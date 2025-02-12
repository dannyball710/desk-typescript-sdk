import "dotenv/config";
import { DeskExchange } from "../src";
import { CHAIN_ID } from "../src/types/constants";

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

  const collateralInfos = await sdk.info.getCollateralInfos();
  const usdcCollateralInfo = collateralInfos.find(
    (each) => each.asset === "USDC"
  )!;

  const response = await sdk.exchange.withdrawCollateral(
    usdcCollateralInfo.token_addresses.find(
      (e) => e.chain_id === CHAIN_ID["arbitrumSepolia"]
    )!.address,
    1
  );
}

main().catch(console.error);
