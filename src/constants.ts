import { gql } from "@apollo/client";

export enum ChainOptions {
  Polygon,
  Solana,
  Tron,
}

export interface AssetConfig {
  key: string;
  token: string;
  fullName: string;
  chain: string;
  chainOption: ChainOptions;
  addrPlaceholder: string;
  iconBg: string;
  iconText: string;
}

export const ASSETS: AssetConfig[] = [
  {
    key: "usdc",
    token: "USDC",
    fullName: "USD Coin",
    chain: "Solana",
    chainOption: ChainOptions.Solana,
    addrPlaceholder: "Solana address (e.g. 7xK...nQ4)",
    iconBg: "#2775CA",
    iconText: "$",
  },
  {
    key: "xsgd",
    token: "XSGD",
    fullName: "StraitsX Singapore Dollar",
    chain: "Polygon",
    chainOption: ChainOptions.Polygon,
    addrPlaceholder: "Polygon address (0x...)",
    iconBg: "#8247E5",
    iconText: "$",
  },
  {
    key: "usdt",
    token: "USDT",
    fullName: "Tether",
    chain: "Tron",
    chainOption: ChainOptions.Tron,
    addrPlaceholder: "Tron address (T...)",
    iconBg: "#EF4444",
    iconText: "₮",
  },
];

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
