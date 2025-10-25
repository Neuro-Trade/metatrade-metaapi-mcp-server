# Configuration Guide

This guide covers configuration options for the MetaAPI MCP Server.

## Environment Variables

Create a `.env` file in the project root:

```env
# Required: Your MetaAPI API token
METAAPI_TOKEN=your_token_here

# Optional: Server port (default: 3333)
PORT=3333

# Optional: Log level (default: info)
LOG_LEVEL=info
```

### Getting a MetaAPI Token

1. Sign up at [MetaAPI](https://metaapi.cloud/)
2. Navigate to your dashboard
3. Generate an API token
4. Copy the token to your `.env` file

---

## Server Configuration

The server can be configured by editing `src/config.js`:

### Port Configuration

Default port is 3333. To change:

```javascript
export const config = {
  port: process.env.PORT || 3333,
  // ...
};
```

Or set in `.env`:

```env
PORT=8080
```

### Logging

Adjust log levels in `src/utils/logger.js`:

- `info` - General information (default)
- `warn` - Warnings
- `error` - Errors only
- `debug` - Verbose debugging

---

## Claude Desktop Configuration

### Basic Configuration

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "MetaAPI MCP": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "http://localhost:3333/sse"
      ]
    }
  }
}
```

### Custom Port

If you changed the server port:

```json
{
  "mcpServers": {
    "MetaAPI MCP": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "http://localhost:8080/sse"
      ]
    }
  }
}
```

### Multiple Servers

You can run multiple instances on different ports:

```json
{
  "mcpServers": {
    "MetaAPI Production": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "http://localhost:3333/sse"
      ]
    },
    "MetaAPI Demo": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "http://localhost:3334/sse"
      ]
    }
  }
}
```

---

## MetaAPI Account Configuration

### Account Types

MetaAPI supports different account types:

- **Cloud** - MetaAPI cloud hosting
- **Self-hosted** - Your own MT4/MT5 server

### Connection Settings

Accounts are configured through the MetaAPI dashboard, not in the MCP server.

1. Log in to [MetaAPI Dashboard](https://metaapi.cloud/)
2. Add your MT4/MT5 account
3. Configure connection settings
4. The MCP server will automatically access all configured accounts

---

## Advanced Configuration

### Connection Caching

The server caches MetaAPI connections for performance. Connections are automatically managed in `src/utils/connection.js`.

### Price Subscriptions

Market data subscriptions are managed automatically. The server uses a Map to track active subscriptions per account/symbol.

### Session Management

HTTP/SSE sessions are managed with UUID-based session IDs. Sessions are created when clients connect to the `/sse` endpoint.

---

## Security Considerations

### API Token Security

- Never commit `.env` files to version control
- Keep your MetaAPI token private
- Rotate tokens periodically
- Use separate tokens for production and testing

### Network Security

- The server runs on localhost by default
- Only expose to network if absolutely necessary
- Use HTTPS in production (requires reverse proxy)
- Consider firewall rules for exposed instances

### Claude Desktop Access

- Claude Desktop connects via localhost
- No external network access required
- Tokens stay on your machine

---

## Performance Tuning

### Connection Pooling

Connections are cached and reused. Clear cache if needed:

```javascript
import { clearAllConnections } from './src/utils/connection.js';
clearAllConnections();
```

### Market Data Limits

- Candles: Max 1000 per request
- Ticks: Max 1000 per request
- History: Paginated with offset/limit

### Rate Limiting

MetaAPI has rate limits. The server doesn't enforce additional limits, but be aware of:

- API calls per minute
- Concurrent connections
- Data retrieval limits

Check [MetaAPI documentation](https://metaapi.cloud/docs/) for current limits.

---

## Troubleshooting Configuration

### Server Won't Start

Check:
- Port 3333 is available: `lsof -i :3333`
- `.env` file exists and has METAAPI_TOKEN
- Dependencies installed: `npm install`

### Claude Can't Connect

Check:
- Server is running: `curl http://localhost:3333/health`
- Config file syntax is valid JSON
- `mcp-remote` package is available: `npx mcp-remote --version`
- Restart Claude Desktop completely

### Invalid Token Errors

- Verify token in MetaAPI dashboard
- Check for whitespace in `.env` file
- Ensure token has not expired
- Try regenerating the token

---

## Configuration Files Reference

| File | Purpose |
|------|---------|
| `.env` | Environment variables (token, port) |
| `src/config.js` | Server configuration |
| `src/utils/logger.js` | Logging configuration |
| `claude_desktop_config.json` | Claude Desktop MCP server config |
| `package.json` | Dependencies and scripts |
