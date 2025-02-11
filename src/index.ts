import { ethers } from "ethers";
import * as CONSTANTS from "./types/constants";
import { Auth } from "./api/auth";
import { Network } from "./types";

export class DeskExchange {
  private privateKey: string;
  public auth: Auth;

  constructor(network: Network, privateKey: string, subAccountId: number) {
    this.privateKey = privateKey;
    this.auth = new Auth(network, privateKey, subAccountId);
  }

  public async authenticate(): Promise<void> {
    await this.auth.generateJwt();
  }
}

export * from "./types";
