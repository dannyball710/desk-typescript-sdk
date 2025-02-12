import { randomBytes } from "crypto";
import { ethers } from "ethers";
import axios, { AxiosInstance } from "axios";
import { BASE_URLS } from "../types/constants";
import { Network } from "../types";

export class Auth {
  public readonly wallet: ethers.Wallet | undefined;
  public readonly subAccountId: number;
  private authenticated: boolean;
  public readonly client: AxiosInstance;
  public readonly network: Network;
  public readonly provider: ethers.Provider;

  constructor(
    network: Network,
    privateKey: string = process.env.PRIVATE_KEY!,
    subAccountId: number
  ) {
    this.provider = new ethers.JsonRpcProvider(
      "https://arbitrum-sepolia-rpc.publicnode.com"
    );
    this.wallet = privateKey
      ? new ethers.Wallet(privateKey, this.provider)
      : undefined;
    this.subAccountId = subAccountId;
    this.network = network;
    this.client = axios.create({
      baseURL: BASE_URLS[network],
      headers: {
        "Content-Type": "application/json",
      },
    });
    this.authenticated = false;
  }

  public generateNonce(): string {
    const expiredAt = BigInt(Date.now() + 1000 * 60) * BigInt(1 << 20);
    const random = parseInt(randomBytes(3).toString("hex"), 16) % (1 << 20);
    return (expiredAt + BigInt(random)).toString();
  }

  public async generateJwt() {
    if (!this.wallet) return;
    const nonce = this.generateNonce();
    const message = `generate jwt for ${this.wallet.address?.toLowerCase()} and subaccount id ${
      this.subAccountId
    } to trade on happytrading.global with nonce: ${nonce}`;
    const signature = await this.wallet.signMessage(message);

    const response = await this.client.post(`/v2/auth/evm`, {
      account: this.wallet.address,
      subaccount_id: this.subAccountId.toString(),
      nonce,
      signature,
    });

    if (response.status === 200) {
      const jwt = response.data.data.jwt;
      this.client.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
      this.authenticated = true;
    } else {
      throw new Error("Could not generate JWT");
    }
  }

  public getSubaccount = (): string => {
    // pad address with subaccountId to be 32 bytes (64 hex characters)
    //  0x + 40 hex characters (address) + 24 hex characters (subaccountId)
    const subaccountIdHex = BigInt(this.subAccountId)
      .toString(16)
      .padStart(24, "0");
    return this.wallet!.address.concat(subaccountIdHex);
  };

  public isAuthenticated(): boolean {
    return this.authenticated;
  }
}
