import { randomBytes } from "crypto";
import { ethers } from "ethers";
import axios, { AxiosInstance } from "axios";
import { BASE_URLS, CRM_URLS } from "../types/constants";
import { Network } from "../types";

export class Auth {
  public readonly wallet: ethers.Wallet | undefined;
  public readonly subAccountId: number;
  private authenticated: boolean;
  public readonly client: AxiosInstance;
  public readonly crmClient: AxiosInstance;
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
    this.crmClient = axios.create({
      baseURL: CRM_URLS[network],
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
    const message = `Welcome to DESK!\n\nPlease sign this message to verify ownership of your wallet and proceed. By signing, you confirm the following: you have read, understood, and agreed to the Terms & Conditions, Privacy Policy, and any other relevant terms and conditions announced by DESK.\n\nThis request will not trigger a blockchain transaction or cost any gas fees.\n\nWallet address: ${this.wallet.address?.toLowerCase()}\nSub-account id: ${this.subAccountId.toString()}\nNonce: ${nonce}`;
    const signature = await this.wallet.signMessage(message);

    const orderbookJwtResponse = await this.client.post(`/v2/auth/evm`, {
      account: this.wallet.address,
      subaccount_id: this.subAccountId.toString(),
      nonce,
      signature,
    });

    const crmJwtResponse = await this.crmClient.post(`/v1/users/auth`, {
      nonce: nonce,
      signature: signature,
      subaccount_id: this.subAccountId.toString(),
      wallet_address: this.wallet.address,
    });

    if (orderbookJwtResponse.status === 200 && crmJwtResponse.status === 200) {
      this.client.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${orderbookJwtResponse.data.data.jwt}`;
      this.crmClient.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${crmJwtResponse.data.data.jwt}`;
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
