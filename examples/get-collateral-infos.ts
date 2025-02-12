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

  const response = await sdk.info.getCollateralInfos();
  console.log(response);
}

main().catch(console.error);
