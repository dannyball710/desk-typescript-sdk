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
  const subAccountSummary = await sdk.exchange.getSubAccountSummary();
  console.log(subAccountSummary);
}

main().catch(console.error);
