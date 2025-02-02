import { BASE_URLS } from "./constants";

export type Network = keyof typeof BASE_URLS;

export interface OpenOrder {
  order_digest: string;
  symbol: string;
  side: "Long" | "Short";
  price: string;
  original_quantity: string;
  remaining_quantity: string;
  order_type: "Limit" | "StopMarket" | "TakeProfitMarket";
  client_order_id: string | null;
  time_in_force: "GTC" | "IOC";
  created_at: number;
  is_reduce_only: boolean;
  is_conditional_order: boolean;
  trigger_price: string | null;
  is_trigger_above_threshold: boolean | null;
}

export interface Collateral {
  asset: string;
  collateral_id: string;
  amount: string;
}

export interface Position {
  symbol: string;
  quantity: string;
  avg_entry_price: string;
  side: "Long" | "Short";
  last_updated_funding_fee: string;
}

export interface SubaccountSummary {
  open_orders: OpenOrder[];
  collaterals: Collateral[];
  positions: Position[];
  account_margin: string;
  collateral_value: string;
  unrealized_pnl: string;
  pending_funding_fee: string;
  pending_borrowing_fee: string;
  account_imr: string;
  order_imr: string;
  position_imr: string;
  position_mmr: string;
}
