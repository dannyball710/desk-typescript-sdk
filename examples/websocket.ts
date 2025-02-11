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
    enableWs: true,
  });

  try {
    await sdk.subscriptions.subscribeToMarkPrices((data) => {
      console.log("Received mark price data:", data);
    });
    await sdk.subscriptions.subscribeToOrderbook("BTCUSD", (data) => {
      console.log("Received BTCUSD orderbook data:", data);
    });
    await new Promise(() => {});
  } catch (error) {
    console.log("error", error);
  }
}

main().catch(console.error);
