// Deterministic local stand-in for the Static GraphQL swap API.
// Implements only what the frontend's gql operations in src/constants.ts and
// src/Order.tsx call: Create{Polygon,Solana,Tron}SellOrder and sellOrder(id).
// Not a real GraphQL engine: it routes on `operationName` and reads fields
// out of the request `variables` / raw `query` text directly.
const http = require("http");
const crypto = require("crypto");

const orders = new Map();

const FAKE_INVOICE =
  "lnbc10u1pjstubbedpp5qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqsdqqcqpjsp5" +
  "stubbedstubbedstubbedstubbedstubbedstubbedstubbedstubbedq9qyyssqstubbedstubbedstubbed" +
  "stubbedstubbedstubbedstubbedstubbedstubbedstubbedstubbedstubbedstubbed";

function extractTokenAddress(query) {
  const match = /tokenAddress:\s*"([^"]*)"/.exec(query || "");
  return match ? match[1] : "";
}

function createOrder(operationName, variables, query) {
  const id = crypto.randomBytes(16).toString("hex");
  const order = {
    id,
    status: "AwaitingPayment",
    paymentHash: variables.paymentHash,
    tokenAddress: variables.tokenAddress || extractTokenAddress(query),
    tokenAmount: variables.tokenAmount,
    destAddress: variables.destAddress,
    metadata: { invoice: FAKE_INVOICE },
  };
  orders.set(id, order);
  return { [operationName]: order };
}

function getSellOrder(variables) {
  return { sellOrder: orders.get(variables.id) || null };
}

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
}

const server = http.createServer((req, res) => {
  setCors(res);

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === "GET" && (req.url === "/" || req.url === "/health")) {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("graphql-stub ok");
    return;
  }

  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", () => {
    try {
      if (req.url.startsWith("/graphql")) {
        const payload = body ? JSON.parse(body) : {};
        const { operationName, variables = {}, query } = payload;
        let data;
        switch (operationName) {
          case "CreatePolygonSellOrder":
          case "CreateSolanaSellOrder":
          case "CreateTronSellOrder":
            data = createOrder(operationName, variables, query);
            break;
          case "GetSellOrder":
            data = getSellOrder(variables);
            break;
          default:
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                errors: [{ message: `Unknown operation: ${operationName}` }],
              })
            );
            return;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ data }));
        return;
      }

      if (req.url.startsWith("/preimage")) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true }));
        return;
      }

      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "not found" }));
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ errors: [{ message: String(err) }] }));
    }
  });
});

const PORT = process.env.PORT || 8911;
server.listen(PORT, () => {
  console.log(`graphql-stub listening on ${PORT}`);
});
