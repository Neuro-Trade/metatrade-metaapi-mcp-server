# Getting Started with MetaAPI MCP Server

This guide will help you get the MetaAPI MCP Server up and running with Claude Desktop.

## Prerequisites

- Node.js 18 or higher
- MetaAPI account and API token
- Claude Desktop application

## Installation

1. **Clone or download this project**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure your MetaAPI token**
   
   Create a `.env` file in the project root:
   ```env
   METAAPI_TOKEN=your_metaapi_token_here
   ```

4. **Start the server**
   ```bash
   npm start
   ```
   
   The server will start on `http://localhost:3333`

## Configure Claude Desktop

1. **Open Claude Desktop configuration file**
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`

2. **Add the MetaAPI MCP server configuration**
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

3. **Restart Claude Desktop**
   
   Completely quit and restart the application.

## Verify Connection

Once Claude Desktop restarts, try asking:

- "What MCP servers are connected?"
- "List my MetaAPI trading accounts"

You should see the MetaAPI MCP server in the list of available servers.

## Next Steps

- [Learn about available tools](TOOLS_REFERENCE.md)
- [See usage examples](EXAMPLES.md)
- [Configure advanced settings](CONFIGURATION.md)

## Troubleshooting

### Server won't start
- Check that port 3333 is not in use: `lsof -i :3333`
- Verify your `.env` file has a valid METAAPI_TOKEN

### Claude Desktop doesn't see the server
- Make sure the server is running (`npm start`)
- Check Claude Desktop logs (View menu → Developer Tools)
- Restart Claude Desktop completely

### Health check
Test the server is running:
```bash
curl http://localhost:3333/health
```

Should return:
```json
{"status":"ok","server":"MetaAPI MCP Server"}
```
