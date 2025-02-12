import { Auth } from "./auth";
import { CollateralInfo, MarketInfo } from "../types";
import { BROKER_ID } from "../types/constants";
import { DeskExchange } from "..";

export class Info {
  private auth: Auth;
  private parent: DeskExchange;

  constructor(auth: Auth, parent: DeskExchange) {
    this.auth = auth;
    this.parent = parent;
  }

  public async getMarketInfos(): Promise<MarketInfo[]> {
    const response = await this.auth.client.get(
      `/v2/market-info/brokers/${BROKER_ID}`
    );
    return response.data.data as MarketInfo[];
  }

  public async getCollateralInfos(): Promise<CollateralInfo[]> {
    const response = await this.auth.client.get(`/v2/collaterals`);
    return response.data.data as CollateralInfo[];
  }
}
