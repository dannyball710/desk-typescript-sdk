import "dotenv/config";
import { DeskExchange } from "../src";

async function main() {
  if (!process.env.PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY is required in .env file");
  }

  const sdk = new DeskExchange({
    network: "testnet",
    privateKey: process.env.PRIVATE_KEY,
    subAccountId: 0,
    enableWs: true,
  });

  try {
    await sdk.subscriptions.subscribeToMarkPrices((data) => {
      console.log(data);
    });
    await sdk.subscriptions.subscribeToOrderbook("BTCUSD", (data) => {
      console.log(data);
    });
    await sdk.subscriptions.subscribeToTrades("BTCUSD", (data) => {
      console.log(data);
    });
    await sdk.subscriptions.subscribeToCollateralPrices((data) => {
      console.log(data);
    });
    await sdk.subscriptions.subscribeToOrderUpdates(undefined, (data) => {
      console.log(data);
    });
    await sdk.subscriptions.subscribeToPositionUpdates(undefined, (data) => {
      console.log(data);
    });
    await new Promise(() => {});
  } catch (error) {
    console.log("error", error);
  }
}

main().catch(console.error);
