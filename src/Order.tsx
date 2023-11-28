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

  return (
    <>
      {loading ? <p>Loading...</p> : <></>}
      {error ? <p>{"Error:" + error.message}</p> : <></>}
      {data?.sellOrder.status ? (
        <p className="m-4 break-all">{data?.sellOrder.status}</p>
      ) : (
        <></>
      )}
      {data?.sellOrder?.metadata.invoice ? (
        <div className="flex flex-col justify-center items-center">
          <QRCodeSVG
            size={250}
            includeMargin={true}
            value={data?.sellOrder?.metadata.invoice}
            onClick={() => writeToClipboard(data?.sellOrder?.metadata.invoice)}
          />
          <p className="m-4 break-all">{data?.sellOrder?.metadata.invoice}</p>
        </div>
      ) : (
        <></>
      )}
      {data ? (
        <p className="m-4 text-xs break-all">{JSON.stringify(data)}</p>
      ) : (
        <></>
      )}
    </>
  );
}