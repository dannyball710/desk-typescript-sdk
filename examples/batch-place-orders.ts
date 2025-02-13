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
    enableWs: false,
  });

  const response = await sdk.exchange.batchPlaceOrder([
    {
      symbol: "SOLUSD",
      amount: "1",
      price: "100",
      side: "Long",
      orderType: "Limit",
      reduceOnly: false,
      timeInForce: "GTC",
      waitForReply: true,
    },
    {
      symbol: "SOLUSD",
      amount: "1",
      price: "100",
      side: "Long",
      orderType: "Limit",
      reduceOnly: false,
      timeInForce: "GTC",
      waitForReply: true,
    },
  ]);
  console.log(response);
}

main().catch(console.error);
