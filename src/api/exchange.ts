import axios, { AxiosInstance } from "axios";
import { Auth } from "./auth";
import { SubaccountSummary } from "../types";

export class Exchange {
  private auth: Auth;

  constructor(auth: Auth) {
    this.auth = auth;
  }

  public async getSubAccountSummary(): Promise<SubaccountSummary> {
    const response = await this.auth.client(
      `/v2/subaccount-summary/${this.auth.getSubaccount()}`
    );
    return response.data.data as SubaccountSummary;
  }
}
