import { ethers } from "ethers";
import * as CONSTANTS from "./types/constants";
import { Auth } from "./api/auth";
import { Network } from "./types";
import { Exchange } from "./api/exchange";

export class DeskExchange {
  public auth: Auth;
  public exchange: Exchange;

  constructor(network: Network, privateKey: string, subAccountId: number) {
    this.auth = new Auth(network, privateKey, subAccountId);
    this.exchange = new Exchange(this.auth);
  }

  public async authenticate(): Promise<void> {
    await this.auth.generateJwt();
  }
}

export * from "./types";
