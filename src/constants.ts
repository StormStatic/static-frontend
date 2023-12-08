import { gql } from "@apollo/client";

export enum ChainOptions {
  Polygon,
  Solana,
  Tron,
}

export const CREATE_POLYGON_SELL_ORDER = gql`
  mutation CreatePolygonSellOrder(
    $destAddress: String!
    $paymentHash: String!
    $tokenAmount: Float!
  ) {
    CreatePolygonSellOrder(
      destAddress: $destAddress
      paymentHash: $paymentHash
      tokenAddress: "0xdc3326e71d45186f113a2f448984ca0e8d201995" # XSGD
      tokenAmount: $tokenAmount
    ) {
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

export const CREATE_SOLANA_SELL_ORDER = gql`
  mutation CreateSolanaSellOrder(
    $destAddress: String!
    $paymentHash: String!
    $tokenAmount: Float!
  ) {
    CreateSolanaSellOrder(
      destAddress: $destAddress
      paymentHash: $paymentHash
      tokenAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" # USDC
      tokenAmount: $tokenAmount
    ) {
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

export const CREATE_TRON_SELL_ORDER = gql`
  mutation CreateTronSellOrder(
    $destAddress: String!
    $paymentHash: String!
    $tokenAmount: Float!
  ) {
    CreateTronSellOrder(
      destAddress: $destAddress
      paymentHash: $paymentHash
      tokenAddress: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t" # USDT
      tokenAmount: $tokenAmount
    ) {
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
