import { ethers } from "ethers";
import * as CONSTANTS from "./types/constants";
import { Auth } from "./api/auth";
import { Network } from "./types";
import { Exchange } from "./api/exchange";
import { WebSocketClient } from "./websocket/connection";
import { WebSocketSubscriptions } from "./websocket/subscriptions";
import { Info } from "./api/info";

export class DeskExchange {
  public auth: Auth;
  public exchange: Exchange;
  public info: Info;
  public wsClient: WebSocketClient;
  public subscriptions: WebSocketSubscriptions;
  public enableWs: boolean;
  private initialized: boolean;

  constructor(params: {
    network: Network;
    privateKey: string;
    subAccountId: number;
    enableWs: boolean;
  }) {
    this.auth = new Auth(
      params.network,
      params.privateKey,
      params.subAccountId
    );
    this.exchange = new Exchange(this.auth, this);
    this.info = new Info(this.auth, this);
    this.wsClient = new WebSocketClient(this.auth);
    this.subscriptions = new WebSocketSubscriptions(this.wsClient, this);
    this.enableWs = params.enableWs;
    this.initialized = false;
  }

  private async initialize(): Promise<void> {
    await this.auth.generateJwt();
    if (this.enableWs) await this.wsClient.connect();
    this.initialized = true;
  }

  public async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  public async authenticate(): Promise<void> {
    await this.auth.generateJwt();
  }

  public isInitialized(): boolean {
    return this.initialized;
  }
}

export * from "./types";
