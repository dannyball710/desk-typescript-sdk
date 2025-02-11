import { Auth } from "./auth";
import {
  OrderRequest,
  OrderApiResponse,
  SubaccountSummary,
  CancelOrderRequest,
  CancelOrderApiResponse,
  OrderApiRequest,
  CancelOrderApiRequest,
} from "../types";
import { BROKER_ID } from "../types/constants";
import { DeskExchange } from "..";

export class Exchange {
  private auth: Auth;
  private parent: DeskExchange;

  constructor(auth: Auth, parent: DeskExchange) {
    this.auth = auth;
    this.parent = parent;
  }

  public async getSubAccountSummary(): Promise<SubaccountSummary> {
    await this.parent.ensureInitialized();
    const response = await this.auth.client.get(
      `/v2/subaccount-summary/${this.auth.getSubaccount()}`
    );
    return response.data.data as SubaccountSummary;
  }

  public async placeOrder(request: OrderRequest): Promise<OrderApiResponse> {
    await this.parent.ensureInitialized();
    const response = await this.auth.client.post(`v2/place-order`, {
      symbol: request.symbol,
      subaccount: this.auth.getSubaccount(),
      amount: request.amount,
      price: request.price,
      side: request.side,
      nonce: this.auth.generateNonce(),
      broker_id: BROKER_ID,
      order_type: request.orderType,
      reduce_only: request.reduceOnly,
      time_in_force: request.timeInForce,
    } as OrderApiRequest);
    return response.data.data as OrderApiResponse;
  }

  public async cancelOrder(
    request: CancelOrderRequest
  ): Promise<CancelOrderApiResponse> {
    await this.parent.ensureInitialized();
    const response = await this.auth.client.post<{
      data: CancelOrderApiResponse;
    }>(`/v2/cancel-order`, {
      symbol: request.symbol,
      subaccount: this.auth.getSubaccount(),
      nonce: this.auth.generateNonce(),
      order_digest: request.orderDigest,
      is_conditional_order: false,
      wait_for_reply: request.waitForReply ?? false,
    } as CancelOrderApiRequest);

    return response.data.data;
  }

  public async batchCancelOrder(
    requests: CancelOrderRequest[]
  ): Promise<CancelOrderApiResponse[]> {
    await this.parent.ensureInitialized();
    const cancelRequests = requests.map((request) => this.cancelOrder(request));

    return Promise.all(cancelRequests);
  }
}
