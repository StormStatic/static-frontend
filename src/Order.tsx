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

type StepStatus = "pending" | "active" | "done";

interface OrderProps {
  orderId: string;
  preimage: string;
  assetName: string;
  chainName: string;
}

export default function Order({
  orderId,
  preimage,
  assetName,
  chainName,
}: OrderProps) {
  const { loading, error, data, stopPolling } = useQuery(GET_SELL_ORDER, {
    variables: { id: orderId },
    pollInterval: TWO_SEC_MS,
  });

  const hasClipboardPermission =
    window.isSecureContext && navigator.clipboard;

  const writeToClipboard = async (text: string) => {
    if (!hasClipboardPermission) return;
    await Clipboard.write({ string: text })
      .then(() => toast.success("Copied!", { duration: TWO_SEC_MS }))
      .catch(() => toast.success(text, { duration: TWO_SEC_MS }));
  };

  useEffect(() => {
    const sendPreimage = async () => {
      const url =
        "https://corsproxy.io/?" + encodeURIComponent(STATIC_PREIMAGE_URI);
      await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: { wid: orderId, preimage } }),
      });
    };

    async function getWebln() {
      return await requestProvider();
    }

    if (!data) return;
    switch (data.sellOrder.status) {
      case "AwaitingPayment":
        getWebln()
          .then((webln) => webln.sendPayment(data.sellOrder.metadata.invoice))
          .then((r: SendPaymentResponse) =>
            console.log("preimage from payment:", r.preimage)
          )
          .catch(console.log);
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

  const status = data?.sellOrder?.status;
  const invoice = data?.sellOrder?.metadata?.invoice;
  const depositTx = data?.sellOrder?.metadata?.depositTx;
  const releaseTx = data?.sellOrder?.metadata?.transactionHash;
  const failureReason = data?.sellOrder?.metadata?.failureReason;
  const tokenAmount = data?.sellOrder?.tokenAmount;

  // Map order status to stepper step states
  const step1Status: StepStatus =
    !status || status === "Created"
      ? "pending"
      : status === "AwaitingPayment"
      ? "active"
      : "done";

  const step2Status: StepStatus =
    !status ||
    status === "Created" ||
    status === "AwaitingPayment"
      ? "pending"
      : status === "Paid" || status === "DeployedContract"
      ? "active"
      : "done";

  const step3Status: StepStatus =
    status === "ReceivedPreimage"
      ? "active"
      : status === "ReleasedFund"
      ? "done"
      : "pending";

  const txUrl = (tx: string) => {
    if (chainName === "Polygon")
      return `https://polygonscan.com/tx/${tx}`;
    if (chainName === "Tron")
      return `https://tronscan.org/#/transaction/${tx}`;
    return `https://solscan.io/tx/${tx}`;
  };

  const statusBannerText = () => {
    switch (status) {
      case "Created":
        return "Order created — generating invoice…";
      case "AwaitingPayment":
        return "Waiting for Lightning payment…";
      case "Paid":
        return `Funding ${chainName} escrow…`;
      case "DeployedContract":
        return "Escrow funded — releasing funds…";
      case "ReceivedPreimage":
        return `Releasing ${assetName} to your wallet…`;
      case "ReleasedFund":
        return `${assetName} sent successfully!`;
      case "Expired":
        return "Order expired.";
      default:
        return "Processing…";
    }
  };

  if (loading && !data) {
    return (
      <div className="flex justify-center py-6">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-red-500 text-sm text-center py-4">
        Error: {error.message}
      </p>
    );
  }

  return (
    <div>
      {/* Status banner */}
      <div className="flex items-center gap-2 px-3 py-2.5 bg-orange-50 border border-orange-200 rounded-xl mb-4">
        <span
          className={`w-2 h-2 rounded-full flex-shrink-0 ${
            status === "ReleasedFund"
              ? "bg-emerald-500"
              : "bg-orange-500 animate-pulse"
          }`}
        />
        <span className="text-xs font-medium text-orange-900">
          {statusBannerText()}
        </span>
      </div>

      {/* QR card — visible while awaiting payment */}
      {invoice && status === "AwaitingPayment" && (
        <div className="bg-white border-2 border-dashed border-orange-200 rounded-xl p-4 text-center mb-4">
          <QRCodeSVG
            size={160}
            includeMargin={true}
            value={invoice}
            className="mx-auto"
          />
          <div className="flex gap-2 justify-center mt-3">
            <button
              className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-900 rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-orange-100 transition-colors"
              onClick={() => writeToClipboard(invoice)}
            >
              📋 Copy invoice
            </button>
          </div>
          {!hasClipboardPermission && (
            <p className="font-mono text-xs text-stone-500 break-all mt-2.5 p-2 bg-cream-100 rounded-lg leading-relaxed">
              {invoice}
            </p>
          )}
        </div>
      )}

      {/* Failure reason */}
      {failureReason && (
        <p className="text-red-500 text-xs text-center mb-3">
          {failureReason}
        </p>
      )}

      {/* Vertical timeline stepper */}
      <div className="relative pl-7">
        {/* Connecting line */}
        <div className="absolute left-[9px] top-3 bottom-3 w-0.5 bg-cream-300" />

        <StepItem
          stepNum="⚡"
          status={step1Status}
          title="Pay Lightning invoice"
          sub={
            step1Status === "active"
              ? "Scan with any Lightning wallet"
              : step1Status === "done"
              ? "Paid"
              : "Waiting"
          }
        />

        <StepItem
          stepNum="2"
          status={step2Status}
          title={`Escrow funded on ${chainName}`}
          sub={
            step2Status === "active"
              ? "Submitting to escrow…"
              : step2Status === "done" && depositTx
              ? ""
              : "Pending — starts after payment"
          }
          txLink={
            step2Status === "done" && depositTx
              ? txUrl(depositTx)
              : undefined
          }
          txLabel="View escrow tx ↗"
        />

        <StepItem
          stepNum="3"
          status={step3Status}
          title="Released to your wallet"
          sub={
            step3Status === "active"
              ? `Releasing ${tokenAmount} ${assetName}…`
              : step3Status === "done"
              ? `${tokenAmount} ${assetName} sent`
              : `${tokenAmount ?? "—"} ${assetName} will arrive`
          }
          txLink={
            step3Status === "done" && releaseTx
              ? txUrl(releaseTx)
              : undefined
          }
          txLabel="View release tx ↗"
          isLast
        />
      </div>
    </div>
  );
}

function StepItem({
  stepNum,
  status,
  title,
  sub,
  txLink,
  txLabel,
  isLast = false,
}: {
  stepNum: string;
  status: StepStatus;
  title: string;
  sub: string;
  txLink?: string;
  txLabel?: string;
  isLast?: boolean;
}) {
  const dotBase =
    "absolute -left-4 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold z-10";

  const dotStyle: React.CSSProperties =
    status === "active"
      ? {
          background: "linear-gradient(90deg,#F97316,#EA580C)",
          border: "2px solid #F97316",
          boxShadow: "0 0 0 4px rgba(249,115,22,0.18)",
          color: "#fff",
        }
      : {};

  const dotClassName =
    status === "done"
      ? `${dotBase} bg-emerald-600 border-2 border-emerald-600 text-white`
      : status === "active"
      ? `${dotBase} animate-pulse`
      : `${dotBase} bg-white border-2 border-cream-300 text-stone-400`;

  return (
    <div className={`relative ${isLast ? "" : "pb-5"}`}>
      <div className={dotClassName} style={dotStyle}>
        {status === "done" ? "✓" : stepNum}
      </div>
      <p
        className={`text-sm font-semibold mb-0.5 ${
          status === "active"
            ? "text-orange-900"
            : status === "done"
            ? "text-stone-700"
            : "text-stone-400"
        }`}
      >
        {title}
      </p>
      {sub && (
        <p
          className={`text-xs ${
            status === "pending" ? "text-stone-300" : "text-stone-500"
          }`}
        >
          {sub}
        </p>
      )}
      {txLink && (
        <a
          href={txLink}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 hover:underline mt-1"
        >
          {txLabel}
        </a>
      )}
    </div>
  );
}
