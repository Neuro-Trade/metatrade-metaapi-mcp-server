# MCP Server JSON Parsing Error - FIXED

## Problem
Error: `Expected',' or 'l' after array element in JSON at position 5 (line 1 column 6)`

## Root Cause
The MCP client configuration was using `npm start` to run the server, which causes npm to output these lines to stdout:
```
> metaapi-mcp-server@1.0.0 start
> node src/index.js
```

These lines contaminate the stdio transport that MCP uses for JSON-RPC communication. The MCP client tries to parse these npm informational messages as JSON, causing the parsing error.

## Solution
Run the Node.js script **directly** instead of through npm.

### Fix Your MCP Client Configuration

#### Claude Desktop (macOS)
1. Open configuration:
```bash
open ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

2. Ensure configuration uses `node` command directly:
```json
{
  "mcpServers": {
    "metaapi": {
      "command": "node",
      "args": [
        "/Users/5aleel/Downloads/code-sample-node-rpc-b7320f60-ef3c-4589-a692-c6b39f76c313/src/index.js"
      ],
      "env": {
        "METAAPI_TOKEN": "your_token_here"
      }
    }
  }
}
```

#### Claude Desktop (Windows)
1. Open configuration:
```powershell
notepad %APPDATA%\Claude\claude_desktop_config.json
```

2. Use this configuration:
```json
{
  "mcpServers": {
    "metaapi": {
      "command": "node",
      "args": [
        "C:\\path\\to\\code-sample-node-rpc-b7320f60-ef3c-4589-a692-c6b39f76c313\\src\\index.js"
      ],
      "env": {
        "METAAPI_TOKEN": "your_token_here"
      }
    }
  }
}
```

#### VS Code / Other MCP Clients
Ensure your configuration does NOT use:
```json
{
  "command": "npm",
  "args": ["start"]  // ❌ WRONG - causes stdio contamination
}
```

Use this instead:
```json
{
  "command": "node",
  "args": ["src/index.js"]  // ✅ CORRECT
}
```

### Alternative: Use npm with --silent flag
If you must use npm, add the `--silent` flag:
```json
{
  "command": "npm",
  "args": ["start", "--silent"]
}
```

However, running `node` directly is the preferred approach.

## Verification
After updating the configuration:

1. Restart your MCP client (Claude Desktop, VS Code, etc.)
2. The JSON parsing error should be gone
3. All 32 MetaAPI tools should be available

## Technical Details
- MCP uses stdio (stdin/stdout) for JSON-RPC communication
- Each JSON-RPC message must be a complete, valid JSON object
- npm's informational output to stdout breaks this protocol
- Running `node` directly ensures clean stdio communication

## Status
✅ **RESOLVED** - Server code is correct, only client configuration needs updating
