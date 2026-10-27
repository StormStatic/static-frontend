const http = require("http");
const crypto = require("crypto");

const PORT = process.env.PORT || 8911;

const TOKEN_ADDRESSES = {
  CreatePolygonSellOrder: "0xdc3326e71d45186f113a2f448984ca0e8d201995",
  CreateSolanaSellOrder: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  CreateTronSellOrder: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
};

const FAKE_INVOICE =
  "lnbc100n1pjqstubpp5zzjfk3fake0invoice0for0preview0only0000000000000000sdqqcqzzsxqyz5vqsp5fakefakefakefakefakefakefakefakefakefakefakefakefakefakes9qyyssqfakefakefakefakefakefakefakefakefakefakefakefakefakefakefakefakefakefake";

// In-memory order book for this preview session. Status advances purely by
// elapsed wall-clock time since creation so GetSellOrder's 2s poll sees a
// deterministic progression with no background timers to manage.
const orders = new Map();

function statusAt(order, now) {
  const elapsedSec = (now - order.createdAt) / 1000;
  if (elapsedSec < 2) return "Created";
  if (elapsedSec < 8) return "AwaitingPayment";
  if (elapsedSec < 12) return "Paid";
  if (elapsedSec < 16) return "DeployedContract";
  if (elapsedSec < 20) return "ReceivedPreimage";
  return "ReleasedFund";
}

function metadataFor(order, status) {
  switch (status) {
    case "AwaitingPayment":
      return { invoice: FAKE_INVOICE };
    case "DeployedContract":
    case "ReceivedPreimage":
      return { depositTx: order.depositTx };
    case "ReleasedFund":
      return { depositTx: order.depositTx, transactionHash: order.releaseTx };
    default:
      return {};
  }
}

function serialize(order) {
  const status = statusAt(order, Date.now());
  return {
    id: order.id,
    status,
    paymentHash: order.paymentHash,
    tokenAddress: order.tokenAddress,
    tokenAmount: order.tokenAmount,
    destAddress: order.destAddress,
    metadata: metadataFor(order, status),
  };
}

function createOrder(operationName, variables) {
  const order = {
    id: crypto.randomBytes(12).toString("hex"),
    paymentHash: variables.paymentHash,
    tokenAddress: TOKEN_ADDRESSES[operationName],
    tokenAmount: variables.tokenAmount,
    destAddress: variables.destAddress,
    createdAt: Date.now(),
    depositTx: "0x" + crypto.randomBytes(32).toString("hex"),
    releaseTx: "0x" + crypto.randomBytes(32).toString("hex"),
  };
  orders.set(order.id, order);
  return serialize(order);
}

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Apollo-Require-Preflight"
  );

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", () => {
    if (req.url === "/preimage" && req.method === "POST") {
      res.setHeader("Content-Type", "application/json");
      res.writeHead(200);
      res.end(JSON.stringify({ ok: true }));
      return;
    }

    if (req.url === "/graphql" && req.method === "POST") {
      res.setHeader("Content-Type", "application/json");
      let parsed;
      try {
        parsed = JSON.parse(body || "{}");
      } catch (e) {
        res.writeHead(400);
        res.end(JSON.stringify({ errors: [{ message: "invalid JSON body" }] }));
        return;
      }

      const operationName = parsed.operationName;
      const variables = parsed.variables || {};

      if (operationName === "GetSellOrder") {
        const order = orders.get(variables.id);
        if (!order) {
          res.writeHead(200);
          res.end(JSON.stringify({ errors: [{ message: "order not found" }] }));
          return;
        }
        res.writeHead(200);
        res.end(JSON.stringify({ data: { sellOrder: serialize(order) } }));
        return;
      }

      if (TOKEN_ADDRESSES[operationName]) {
        const result = createOrder(operationName, variables);
        res.writeHead(200);
        res.end(JSON.stringify({ data: { [operationName]: result } }));
        return;
      }

      res.writeHead(200);
      res.end(
        JSON.stringify({ errors: [{ message: `Unknown operation ${operationName}` }] })
      );
      return;
    }

    if (req.url === "/" && req.method === "GET") {
      res.writeHead(200);
      res.end("graphql-stub ok");
      return;
    }

    res.writeHead(404);
    res.end();
  });
});

server.listen(PORT, () => {
  console.log(`[graphql-stub] listening on :${PORT}`);
});
