# DESK Typescript SDK

A TypeScript client for interacting with DESK Exchange API, featuring JWT authentication and EVM wallet integration.

## Features

- EVM wallet integration
- JWT-based authentication
- Subaccount management
- Type-safe API interactions
- Real-time WebSocket support
- Comprehensive error handling

## Installation

```shell
npm install @desk/typescript-sdk
# or
yarn add @desk/typescript-sdk
```

## Usage

### Initialize the Client

```typescript
import { DeskExchange } from "@desk/typescript-sdk";

const sdk = new DeskExchange({
  network: "testnet",
  privateKey: process.env.PRIVATE_KEY,
  subAccountId: 0,
  enableWs: false, // true if you want to connect to websocket
});
```

### Account Management

```typescript
// Get account information
const accountInfo = await sdk.exchange.getSubAccountSummary();
```

### Trading Operations

```typescript
// Place a limit order
const limitOrder = await sdk.exchange.placeOrder({
  symbol: "BTCUSD",
  amount: "0.1",
  price: "99714.4",
  side: "Long",
  orderType: "Limit",
  reduceOnly: false,
  timeInForce: "GTC",
});

// Place a market order
const marketOrder = await sdk.exchange.placeOrder({
  symbol: "BTCUSD",
  amount: "0.0001",
  price: "0",
  side: "Short",
  orderType: "Market",
  reduceOnly: false,
});

// Cancel an order
await sdk.exchange.cancelOrder(orderId);
```

### WebSocket Streams

```typescript
await sdk.subscriptions.subscribeToMarkPrices((data) => {
  console.log("Received mark price data:", data);
});
await sdk.subscriptions.subscribeToOrderbook("BTCUSD", (data) => {
  console.log("Received BTCUSD orderbook data:", data);
});
```

## Running examples

```shell
pnpm exec tsx examples/***.ts
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

```
MIT License - see the LICENSE file for details.

```
