import { gql, useQuery } from "@apollo/client";

import { Clipboard } from "@capacitor/clipboard";
import Loading from "./Loading";
import { QRCodeSVG } from "qrcode.react";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { SendPaymentResponse, requestProvider } from "webln";

const GET_SELL_ORDER = gql`
  query GetSellOrder($id: String!) {
    sellOrder(id: $id) {
      id
      status
      paymentHash
      tokenAddress
      tokenAmount
      destAddress
      metadata
    }
  }
`;

const HOST = "https://dev-static-api.ap.ngrok.io";
const STATIC_PREIMAGE_URI = `${HOST}/preimage`;
const TWO_SEC_MS = 2000;

export default function Order({
  orderId,
  preimage,
  assetName,
  chainName,
}: any) {
  const { loading, error, data, stopPolling } = useQuery(GET_SELL_ORDER, {
    variables: { id: orderId },
    pollInterval: TWO_SEC_MS,
  });

  const hasWriteToClipboardPermission =
    window.isSecureContext && navigator.clipboard;

  const writeToClipboard = async (d: any) => {
    if (!hasWriteToClipboardPermission) return;
    await Clipboard.write({ string: d })
      .then(() => {
        toast.success("Copied!", { duration: TWO_SEC_MS });
      })
      .catch(() => {
        toast.success(d, { duration: TWO_SEC_MS });
      });
  };

  useEffect(() => {
    const sendPreimage = async () => {
      const url =
        "https://corsproxy.io/?" + encodeURIComponent(STATIC_PREIMAGE_URI);
      const result = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: { wid: orderId, preimage: preimage },
        }),
      });
      console.log("sendPreimage: " + result);
    };

    async function getWebln() {
      return await requestProvider();
    }

    if (data === null || data === undefined) return;
    switch (data.sellOrder.status) {
      case "AwaitingPayment":
        getWebln()
          .then((webln) => {
            const invoice = data.sellOrder.metadata.invoice;
            return webln.sendPayment(invoice);
          })
          .then((paymentResponse: SendPaymentResponse) => {
            console.log("preimage from payment: " + paymentResponse.preimage);
          })
          .catch((error) => {
            console.log(error);
          });
        return;
      case "DeployedContract":
        sendPreimage();
        return;
      case "ReleasedFund":
      case "Expired":
        stopPolling();
        return;
      default:
        return;
    }
  }, [data, stopPolling, orderId, preimage]);

  const mapStatus = (status: any) => {
    switch (status) {
      case "Created":
        return "Order Created";
      case "AwaitingPayment":
        return "Waiting for Lightning Payment into Escrow...";
      case "Paid":
        return `Lightning Funds Escrowed, Escrowing ${assetName} on ${chainName}..`;
      case "DeployedContract":
        return `Escrow Created. Outgoing ${chainName} ${assetName} Locked in Escrow`;
      case "ReceivedPreimage":
        return `Received Preimage. Releasing ${chainName} ${assetName} Funds...`;
      case "ReleasedFund":
        return `${assetName} successfully sent to destination address!`;
      default:
        return status;
    }
  };

  const explorerUrl = (txHash: string) => {
    switch (chainName) {
      case "Polygon": return `https://polygonscan.com/tx/${txHash}`;
      case "Solana":  return `https://solscan.io/tx/${txHash}`;
      case "Tron":    return `https://tronscan.org/#/transaction/${txHash}`;
      default:        return "#";
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {loading && <Loading />}
      {error && <p className="text-xs text-danger">Error: {error.message}</p>}

      {data?.sellOrder.status && (
        <div className={`w-full text-center px-4 py-3 rounded-field text-sm font-medium ${
          data.sellOrder.status === "ReleasedFund"
            ? "bg-success/10 text-success"
            : data.sellOrder.status === "Expired"
            ? "bg-danger/10 text-danger"
            : "bg-inset text-ink"
        }`}>
          {mapStatus(data.sellOrder.status)}
        </div>
      )}

      {data?.sellOrder?.metadata.invoice &&
        data?.sellOrder?.status === "AwaitingPayment" && (
        <div className="flex flex-col items-center gap-2">
          <div className="bg-surface rounded-field p-2 border border-border">
            <QRCodeSVG
              size={200}
              value={data.sellOrder.metadata.invoice}
              onClick={() => writeToClipboard(data.sellOrder.metadata.invoice)}
              onTouchEnd={() => writeToClipboard(data.sellOrder.metadata.invoice)}
            />
          </div>
          {!hasWriteToClipboardPermission && (
            <p className="text-xs text-muted truncate w-48 text-center">
              {data.sellOrder.metadata.invoice}
            </p>
          )}
          <p className="text-xs text-muted">Tap QR code to copy invoice</p>
        </div>
      )}

      {data?.sellOrder?.metadata.failureReason && (
        <p className="text-xs text-danger">{data.sellOrder.metadata.failureReason}</p>
      )}

      {data?.sellOrder?.metadata.depositTx && (
        <div className="w-full flex flex-col gap-1 text-xs">
          <div className="flex justify-between">
            <span className="text-muted">Deposit Txn</span>
            <a
              className="text-accent underline"
              href={explorerUrl(data.sellOrder.metadata.depositTx)}
              target="_blank"
              rel="noreferrer"
            >
              View
            </a>
          </div>
          {data.sellOrder.metadata.transactionHash && (
            <div className="flex justify-between">
              <span className="text-muted">Release Txn</span>
              <a
                className="text-accent underline"
                href={explorerUrl(data.sellOrder.metadata.transactionHash)}
                target="_blank"
                rel="noreferrer"
              >
                View
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
