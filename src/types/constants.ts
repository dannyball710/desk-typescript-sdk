export const BASE_URLS = {
  mainnet: "https://api.happytrading.global",
  testnet: "https://stg-trade-api.happytrading.global",
};

export const WSS_URLS = {
  mainnet: "wss://ws-api.happytrading.global/ws",
  testnet: "wss://stg-trade-ws-api.happytrading.global/ws",
};

export const CHAIN_ID = {
  mainnet: 8453,
  testnet: 421614,
  base: 8453,
  arbitrumSepolia: 421614,
};

export const VAULT_ADDRESS = {
  mainnet: "0x764ab030159466edf9663e3fe3198c5d5c26c122",
  testnet: "0x6e664f5025ee54704040a970d2bfa1ecbbc20fd4",
  [CHAIN_ID.base]: "0x764ab030159466edf9663e3fe3198c5d5c26c122",
  [CHAIN_ID.arbitrumSepolia]: "0x6e664f5025ee54704040a970d2bfa1ecbbc20fd4",
};

export const BROKER_ID = "DESK-SDK";
