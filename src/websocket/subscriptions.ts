import { DeskExchange } from "..";
import {
  CollateralPriceStreamMessage,
  MarkPrice,
  OrderBook,
  OrderUpdateStreamMessage,
  PositionUpdateStreamMessage,
  TradeStreamMessage,
} from "../types";
import { WebSocketClient } from "./connection";
import { StreamType } from "../types/constants";

type MessageHandler = (message: any) => void;

interface Subscription {
  type: StreamType;
  symbol?: string;
  subaccount?: string;
}

interface SubscriptionCallback {
  callback: Function;
  messageHandler: MessageHandler;
}

export class WebSocketSubscriptions {
  private ws: WebSocketClient;
  private parent: DeskExchange;
  private subscriptions: Map<string, Set<SubscriptionCallback>> = new Map();

  constructor(ws: WebSocketClient, parent: DeskExchange) {
    this.ws = ws;
    this.parent = parent;
  }

  private getSubscriptionKey(subscription: Subscription): string {
    return JSON.stringify(subscription);
  }

  private addSubscription(
    subscription: Subscription,
    callback: Function,
    messageHandler: MessageHandler
  ): void {
    const key = this.getSubscriptionKey(subscription);
    if (!this.subscriptions.has(key)) {
      this.subscriptions.set(key, new Set());
    }
    this.subscriptions.get(key)?.add({ callback, messageHandler });
  }

  private async subscribe(subscription: Subscription): Promise<void> {
    await this.parent.ensureInitialized();
    await this.ws.sendMessage({
      method: "subscribe",
      subscription,
    });
  }

  private async unsubscribe(subscription: Subscription): Promise<void> {
    await this.parent.ensureInitialized();
    await this.ws.sendMessage({
      method: "unsubscribe",
      subscription,
    });
  }

  private removeSubscription(subscription: Subscription): void {
    const key = this.getSubscriptionKey(subscription);
    const callbacks = this.subscriptions.get(key);

    if (callbacks) {
      for (const { messageHandler } of callbacks) {
        this.ws.removeListener("message", messageHandler);
      }
      this.subscriptions.delete(key);
    }
  }

  async subscribeToMarkPrices(
    callback: (data: MarkPrice[]) => void
  ): Promise<void> {
    if (typeof callback !== "function") {
      throw new Error("Callback must be a function");
    }

    const subscription: Subscription = { type: StreamType.MarkPrices };

    const messageHandler: MessageHandler = (message: any) => {
      if (message.type === "markPricesV2" && message.data) {
        const markPrices = message.data.map((item: any) => ({
          symbol: item.symbol,
          markPrice: item.mark_price,
          indexPrice: item.index_price,
        }));
        callback(markPrices);
      }
    };

    this.addSubscription(subscription, callback, messageHandler);
    this.ws.on("message", messageHandler);
    await this.subscribe(subscription);
  }

  async unsubscribeFromMarkPrices(): Promise<void> {
    const subscription: Subscription = { type: StreamType.MarkPrices };
    this.removeSubscription(subscription);
    await this.unsubscribe(subscription);
  }

  async subscribeToOrderbook(
    symbol: string,
    callback: (data: OrderBook) => void
  ): Promise<void> {
    if (typeof callback !== "function") {
      throw new Error("Callback must be a function");
    }

    const subscription: Subscription = { type: StreamType.Orderbook, symbol };

    const messageHandler: MessageHandler = (message: any) => {
      if (message.type === StreamType.Orderbook && message.data) {
        callback(message.data as OrderBook);
      }
    };

    this.addSubscription(subscription, callback, messageHandler);
    this.ws.on("message", messageHandler);
    await this.subscribe(subscription);
  }

  async unsubscribeFromOrderbook(symbol: string): Promise<void> {
    const subscription: Subscription = { type: StreamType.Orderbook, symbol };
    this.removeSubscription(subscription);
    await this.unsubscribe(subscription);
  }

  async subscribeToTrades(
    symbol: string,
    callback: (data: TradeStreamMessage) => void
  ): Promise<void> {
    if (typeof callback !== "function") {
      throw new Error("Callback must be a function");
    }

    const subscription: Subscription = {
      type: StreamType.Trades,
      symbol,
    };

    const messageHandler: MessageHandler = (message: any) => {
      if (message.type === StreamType.Trades && message.data) {
        callback(message.data as TradeStreamMessage);
      }
    };

    this.addSubscription(subscription, callback, messageHandler);
    this.ws.on("message", messageHandler);
    await this.subscribe(subscription);
  }

  async unsubscribeFromTrades(symbol: string): Promise<void> {
    const subscription: Subscription = { type: StreamType.Trades, symbol };
    this.removeSubscription(subscription);
    await this.unsubscribe(subscription);
  }

  async subscribeToCollateralPrices(
    callback: (data: CollateralPriceStreamMessage) => void
  ): Promise<void> {
    if (typeof callback !== "function") {
      throw new Error("Callback must be a function");
    }

    const subscription: Subscription = {
      type: StreamType.CollateralPrices,
    };

    const messageHandler: MessageHandler = (message: any) => {
      if (message.type === StreamType.CollateralPrices && message.data) {
        callback(message.data as CollateralPriceStreamMessage);
      }
    };

    this.addSubscription(subscription, callback, messageHandler);
    this.ws.on("message", messageHandler);
    await this.subscribe(subscription);
  }

  async unsubscribeFromCollateralPrices(symbol: string): Promise<void> {
    const subscription: Subscription = {
      type: StreamType.CollateralPrices,
      symbol,
    };
    this.removeSubscription(subscription);
    await this.unsubscribe(subscription);
  }

  async subscribeToOrderUpdates(
    subaccount: string | undefined,
    callback: (data: OrderUpdateStreamMessage) => void
  ): Promise<void> {
    if (typeof callback !== "function") {
      throw new Error("Callback must be a function");
    }

    const subscription: Subscription = {
      type: StreamType.OrderUpdatesV2,
      subaccount: subaccount || this.parent.auth.getSubaccount(),
    };

    const messageHandler: MessageHandler = (message: any) => {
      if (message.type === StreamType.OrderUpdatesV2 && message.data) {
        callback(message.data as OrderUpdateStreamMessage);
      }
    };

    this.addSubscription(subscription, callback, messageHandler);
    this.ws.on("message", messageHandler);
    await this.subscribe(subscription);
  }

  async unsubscribeFromOrderUpdates(symbol: string): Promise<void> {
    const subscription: Subscription = {
      type: StreamType.OrderUpdatesV2,
      symbol,
    };
    this.removeSubscription(subscription);
    await this.unsubscribe(subscription);
  }

  async subscribeToPositionUpdates(
    subaccount: string | undefined,
    callback: (data: PositionUpdateStreamMessage) => void
  ): Promise<void> {
    if (typeof callback !== "function") {
      throw new Error("Callback must be a function");
    }

    const subscription: Subscription = {
      type: StreamType.PositionUpdatesV2,
      subaccount: subaccount || this.parent.auth.getSubaccount(),
    };

    const messageHandler: MessageHandler = (message: any) => {
      if (message.type === StreamType.PositionUpdatesV2 && message.data) {
        callback(message.data as PositionUpdateStreamMessage);
      }
    };

    this.addSubscription(subscription, callback, messageHandler);
    this.ws.on("message", messageHandler);
    await this.subscribe(subscription);
  }

  async unsubscribeFromPositionUpdates(symbol: string): Promise<void> {
    const subscription: Subscription = {
      type: StreamType.PositionUpdatesV2,
      symbol,
    };
    this.removeSubscription(subscription);
    await this.unsubscribe(subscription);
  }
}
