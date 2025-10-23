# MCP Client Configuration Guide

This guide shows how to configure various MCP clients to connect to the MetaAPI MCP Server.

## Claude Desktop

### macOS

1. Open the configuration file:
```bash
open ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

2. Add the MetaAPI server configuration:
```json
{
  "mcpServers": {
    "metaapi": {
      "command": "node",
      "args": [
        "/Users/YOUR_USERNAME/path/to/metaapi-mcp-server/src/index.js"
      ],
      "env": {
        "METAAPI_TOKEN": "your_metaapi_token_here"
      }
    }
  }
}
```

3. Replace:
   - `/Users/YOUR_USERNAME/path/to/metaapi-mcp-server` with the actual path to this project
   - `your_metaapi_token_here` with your MetaAPI token

4. Restart Claude Desktop

### Windows

1. Open the configuration file:
```powershell
notepad %APPDATA%\Claude\claude_desktop_config.json
```

2. Add the MetaAPI server configuration:
```json
{
  "mcpServers": {
    "metaapi": {
      "command": "node",
      "args": [
        "C:\\Users\\YOUR_USERNAME\\path\\to\\metaapi-mcp-server\\src\\index.js"
      ],
      "env": {
        "METAAPI_TOKEN": "your_metaapi_token_here"
      }
    }
  }
}
```

3. Replace paths and token as needed
4. Restart Claude Desktop

### Linux

1. Open the configuration file:
```bash
nano ~/.config/Claude/claude_desktop_config.json
```

2. Add the configuration (same format as macOS)
3. Restart Claude Desktop

## Cursor IDE

If you're using Cursor IDE with MCP support:

1. Open Cursor settings
2. Navigate to MCP Servers configuration
3. Add a new server:
   - **Name**: MetaAPI
   - **Command**: `node`
   - **Args**: `["/path/to/metaapi-mcp-server/src/index.js"]`
   - **Environment**: 
     ```json
     {
       "METAAPI_TOKEN": "your_metaapi_token_here"
     }
     ```

## VS Code with MCP Extension

If using VS Code with an MCP extension:

1. Create `.vscode/settings.json` in your workspace:
```json
{
  "mcp.servers": {
    "metaapi": {
      "command": "node",
      "args": [
        "${workspaceFolder}/path/to/metaapi-mcp-server/src/index.js"
      ],
      "env": {
        "METAAPI_TOKEN": "your_metaapi_token_here"
      }
    }
  }
}
```

## Generic MCP Client (stdio)

For any MCP client that supports stdio transport:

```javascript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const transport = new StdioClientTransport({
  command: 'node',
  args: ['/path/to/metaapi-mcp-server/src/index.js'],
  env: {
    ...process.env,
    METAAPI_TOKEN: 'your_metaapi_token_here'
  }
});

const client = new Client({
  name: 'my-client',
  version: '1.0.0'
}, {
  capabilities: {}
});

await client.connect(transport);
```

## Verifying Connection

After configuring your client, verify the connection:

1. **Check available tools**:
   - In Claude: Ask "What MetaAPI tools are available?"
   - The client should show tools like `list_accounts`, `get_account_state`, etc.

2. **Test a simple operation**:
   - Try: "List my MetaAPI accounts"
   - This should call the `list_accounts` tool

3. **Check resources**:
   - Resources should be available at `metaapi://accounts/*`

4. **Check logs**:
   - Server logs go to stderr
   - Check your client's console/logs for MetaAPI server output

## Environment Variables

The server requires these environment variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `METAAPI_TOKEN` | Yes | Your MetaAPI authentication token |
| `TOKEN` | No | Alternative name for METAAPI_TOKEN (legacy) |
| `ACCOUNT_ID` | No | Default account ID for testing |

### Security Best Practices

1. **Never commit tokens**: Add `.env` to `.gitignore`
2. **Use environment-specific tokens**: Different tokens for dev/prod
3. **Rotate tokens regularly**: Generate new tokens periodically
4. **Limit token permissions**: Use tokens with minimum required permissions

## Troubleshooting

### Server won't start

**Check Node.js version:**
```bash
node --version  # Should be >= 18.0.0
```

**Check dependencies:**
```bash
npm install
```

**Check token:**
```bash
node -e "console.log(process.env.METAAPI_TOKEN)"
```

### Client can't connect

1. **Verify path**: Make sure the path to `index.js` is correct
2. **Check Node.js**: Ensure Node.js is in your PATH
3. **Check permissions**: Ensure the server file is executable
4. **Check logs**: Look for error messages in stderr

### Tools not appearing

1. **Restart client**: Fully quit and restart your MCP client
2. **Check configuration**: Verify JSON syntax in config file
3. **Check server logs**: Look for startup errors
4. **Test manually**: Run `npm start` to see if server starts

### Token errors

**"METAAPI_TOKEN environment variable is required"**
- Check that the token is set in your client config
- Verify the environment variable name matches exactly
- Check for typos in the token value

**"Authentication failed"**
- Verify token is valid and not expired
- Check token permissions in MetaAPI dashboard
- Try generating a new token

## Advanced Configuration

### Custom Port (HTTP/SSE mode)

If you want to run the server as an HTTP service instead of stdio:

```json
{
  "mcpServers": {
    "metaapi": {
      "command": "node",
      "args": [
        "/path/to/metaapi-mcp-server/src/index.js",
        "--transport=sse",
        "--port=3000"
      ],
      "env": {
        "METAAPI_TOKEN": "your_token"
      }
    }
  }
}
```

*Note: HTTP/SSE support requires additional implementation.*

### Multiple Accounts

To configure access to multiple MetaAPI accounts:

```json
{
  "mcpServers": {
    "metaapi-demo": {
      "command": "node",
      "args": ["/path/to/metaapi-mcp-server/src/index.js"],
      "env": {
        "METAAPI_TOKEN": "demo_token"
      }
    },
    "metaapi-live": {
      "command": "node",
      "args": ["/path/to/metaapi-mcp-server/src/index.js"],
      "env": {
        "METAAPI_TOKEN": "live_token"
      }
    }
  }
}
```

### Logging Configuration

Control log verbosity with environment variables:

```json
{
  "env": {
    "METAAPI_TOKEN": "your_token",
    "LOG_LEVEL": "debug"
  }
}
```

## Getting Help

- **MetaAPI Issues**: https://metaapi.cloud/docs/
- **MCP Protocol**: https://modelcontextprotocol.io/
- **Server Issues**: Check this repository's issues
