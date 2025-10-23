# Quick Reference - New Phase 1 Tools

## 7 New Tools Added

### 1. get_position
Get single position by ID.

**Parameters:**
- `accountId` (string, required)
- `positionId` (string, required)

**Returns:** Position object with details

---

### 2. get_order
Get single pending order by ID.

**Parameters:**
- `accountId` (string, required)
- `orderId` (string, required)

**Returns:** Order object with details

---

### 3. get_symbols
List all tradeable symbols for the account.

**Parameters:**
- `accountId` (string, required)

**Returns:** Array of symbol strings (e.g., ["EURUSD", "GBPUSD", ...])

---

### 4. get_symbol_specification
Get detailed contract specifications for a symbol.

**Parameters:**
- `accountId` (string, required)
- `symbol` (string, required) - e.g., "EURUSD"

**Returns:** Object with:
- `contractSize` - Contract size (e.g., 100000 for standard lot)
- `digits` - Decimal places (e.g., 5 for EURUSD)
- `minVolume` - Minimum trade volume
- `maxVolume` - Maximum trade volume
- `volumeStep` - Volume increment step
- And more...

---

### 5. create_stop_buy_order
Place a stop buy pending order (triggers when price goes above threshold).

**Parameters:**
- `accountId` (string, required)
- `symbol` (string, required)
- `volume` (number, required) - Lot size
- `openPrice` (number, required) - Trigger price
- `stopLoss` (number, optional) - Stop loss price
- `takeProfit` (number, optional) - Take profit price
- `comment` (string, optional) - Order comment

**Returns:** Object with `orderId` and `clientOrderId`

---

### 6. create_stop_sell_order
Place a stop sell pending order (triggers when price goes below threshold).

**Parameters:**
- `accountId` (string, required)
- `symbol` (string, required)
- `volume` (number, required) - Lot size
- `openPrice` (number, required) - Trigger price
- `stopLoss` (number, optional) - Stop loss price
- `takeProfit` (number, optional) - Take profit price
- `comment` (string, optional) - Order comment

**Returns:** Object with `orderId` and `clientOrderId`

---

### 7. modify_order
Modify parameters of a pending order.

**Parameters:**
- `accountId` (string, required)
- `orderId` (string, required)
- `openPrice` (number, required) - New trigger price
- `stopLoss` (number, optional) - New stop loss
- `takeProfit` (number, optional) - New take profit

**Returns:** Success message

---

## Testing

Run this to verify all 23 tools are registered:

```bash
node validate_tools.js
```

## Documentation

- **Full validation report**: `VALIDATION_AND_EXTENSIONS.md`
- **Implementation details**: `PHASE1_COMPLETE.md`
- **Summary**: `EXTENSION_SUMMARY.md`
