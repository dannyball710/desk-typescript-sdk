import "dotenv/config";
import { DeskExchange } from "../src";

async function main() {
  if (!process.env.PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY is required in .env file");
  }

  const sdk = new DeskExchange(
    "testnet",
    process.env.PRIVATE_KEY,
    0 // subAccountId
  );

  await sdk.authenticate();
  const response = await sdk.exchange.placeOrder({
    symbol: "BTCUSD",
    amount: "0.1",
    price: "99714.4",
    side: "Long",
    orderType: "Limit",
    reduceOnly: false,
    timeInForce: "GTC",
  });
  console.log(response);
}

main().catch(console.error);
