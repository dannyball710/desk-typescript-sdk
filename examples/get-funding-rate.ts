import "dotenv/config";
import { DeskExchange } from "../src";

async function main() {
  if (!process.env.PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY is required in .env file");
  }

  const sdk = new DeskExchange({
    network: "testnet",
    privateKey: "", // accessing SDK without private key
    subAccountId: 0,
    enableWs: false,
  });

  const response = await sdk.info.getHistoricalFundingRates(
    "BTCUSD",
    1739872632,
    1740477432
  );
  console.log(response);

  const currentFundingRate = await sdk.info.getCurrentFundingRate("BTCUSD");
  console.log("currentFundingRate", currentFundingRate);
}

main().catch(console.error);
