import { gql, useQuery } from "@apollo/client";

import { Clipboard } from "@capacitor/clipboard";
import { QRCodeSVG } from "qrcode.react";
import toast from "react-hot-toast";
import { useEffect } from "react";

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

export default function Order({ orderId, preimage }: any) {
  const { loading, error, data } = useQuery(GET_SELL_ORDER, {
    variables: { id: orderId },
    pollInterval: 2000, // query once every 2sec
    onCompleted: () => {},
  });
  const writeToClipboard = async (d: any) => {
    await Clipboard.write({
      string: d,
    });
    toast.success("Copied!", { duration: 2000 });
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
      console.log(result);
    };

    console.log(data);
    if (data == null) return;
    if (data.sellOrder.status === "DeployedContract") {
      sendPreimage();
    }
  }, [data, orderId, preimage]);

  const mapStatus = (status: any) => {
    switch (status) {
      case "Created":
        return "Order Created";
      case "AwaitingPayment":
        return "Waiting for Lightning Payment into Escrow...";
      case "Paid":
        return "Lightning Funds Escrowed, Escrowing XSGD on Polygon..";
      case "DeployedContract":
        return "Escrow Created. Outgoing Polygon XSGD Locked in Escrow";
      case "ReceivedPreimage":
        return "Received Preimage from Frontend. Claimed Lightning funds. Releasing Polygon XSGD Funds...";
      case "ReleasedFund":
        return "XSGD successfully sent to destination address!";
      default:
        return status;
    }
  };

  return (
    <>
      {loading ? <p>Loading...</p> : <></>}
      {error ? <p>{"Error:" + error.message}</p> : <></>}
      {data?.sellOrder.status ? (
        <p className="m-4 border-2 p-4 rounded-3xl bg-slate-600 text-slate-200 shadow-lg break-normal">
          {mapStatus(data?.sellOrder.status)}
        </p>
      ) : (
        <></>
      )}
      {data?.sellOrder?.metadata.invoice &&
      data?.sellOrder?.status === "AwaitingPayment" ? (
        <div className="flex flex-col justify-center items-center">
          <QRCodeSVG
            size={250}
            includeMargin={true}
            value={data?.sellOrder?.metadata.invoice}
            onClick={() => writeToClipboard(data?.sellOrder?.metadata.invoice)}
          />
          <p className="w-96 mx-4 break-all">
            {data?.sellOrder?.metadata.invoice}
          </p>
        </div>
      ) : (
        <></>
      )}
      {data?.sellOrder ? (
        <>
          <div className="text-xl break-all w-96">
            <p>{data?.sellOrder.metadata.failureReason}</p>
          </div>
          {data?.sellOrder.metadata.depositTx ? (
            <>
              <div className="flex text-md">
                <p>{"Deposit Txn: "}</p>
                <a
                  className="text-blue underline ml-4"
                  href={`https://polygonscan.com/tx/${data?.sellOrder.metadata.depositTx}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  polygonscan
                </a>
              </div>
              <div className="flex text-md">
                <p>{"Release Txn: "}</p>
                <a
                  className="text-blue underline ml-4"
                  href={`https://polygonscan.com/tx/${data?.sellOrder.metadata.transactionHash}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  polygonscan
                </a>
              </div>
            </>
          ) : (
            <></>
          )}
        </>
      ) : (
        <></>
      )}
    </>
  );
}
