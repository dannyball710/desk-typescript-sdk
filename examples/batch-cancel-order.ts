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

  const placeOrderResponse1 = await sdk.exchange.placeOrder({
    symbol: "BTCUSD",
    amount: "0.1",
    price: "80000",
    side: "Long",
    orderType: "Limit",
    reduceOnly: false,
    timeInForce: "GTC",
  });
  const placeOrderResponse2 = await sdk.exchange.placeOrder({
    symbol: "BTCUSD",
    amount: "0.1",
    price: "70000",
    side: "Long",
    orderType: "Limit",
    reduceOnly: false,
    timeInForce: "GTC",
  });

  const cancelOrderResponse = await sdk.exchange.batchCancelOrder([
    {
      symbol: placeOrderResponse1.symbol,
      orderDigest: placeOrderResponse1.order_digest,
      waitForReply: true,
    },
    {
      symbol: placeOrderResponse2.symbol,
      orderDigest: placeOrderResponse2.order_digest,
      waitForReply: true,
    },
  ]);
  console.log(cancelOrderResponse);
}

main().catch(console.error);
