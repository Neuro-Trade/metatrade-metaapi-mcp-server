# MetaAPI MCP Server - Project Structure

## Directory Organization

```
├── src/
│   ├── index.js                 # Main server entry point
│   ├── server.js                # MCP server creation and configuration
│   ├── config.js                # Configuration and environment setup
│   ├── handlers/                # Request handlers
│   │   ├── tools.js            # Tool handler implementations
│   │   ├── resources.js        # Resource handler implementations
│   │   └── prompts.js          # Prompt handler implementations
│   └── utils/                   # Utility functions
│       ├── logger.js           # Logging utility
│       ├── connection.js       # MetaAPI connection management
│       └── helpers.js          # Helper functions (error mapping, etc.)
├── tests/                       # Test scripts
│   ├── test_client.js          # Basic client test
│   ├── test_mcp_client.js      # MCP protocol test
│   ├── test_phase1_*.js        # Phase 1 feature tests
│   ├── test_phase2.js          # Phase 2 feature tests
│   ├── test_phase3.js          # Phase 3 feature tests
│   ├── test_candle_viz.js      # Candle data visualization test
│   ├── test_ticks_*.js         # Tick data tests
│   └── test_market_order_tools.js  # Market order tests
├── scripts/                     # Utility scripts
│   ├── example.js              # Example usage
│   ├── check_tool_coverage.js  # Tool coverage checker
│   ├── validate_tools.js       # Tool validation
│   ├── verify_ticks.js         # Tick data verification
│   ├── inspect_*.cjs           # Inspection utilities
│   ├── start_server.sh         # Server start script
│   ├── test_server.sh          # Server test script
│   ├── test_migration.sh       # Migration test script
│   └── validate.sh             # Validation script
├── docs/                        # Documentation
│   ├── PROJECT_STRUCTURE.md    # This file
│   ├── README.md               # Main documentation
│   ├── QUICK_START.md          # Quick start guide
│   ├── API_REFERENCE.md        # API reference
│   └── *.md                    # Other documentation files
├── certs/                       # SSL certificates (if needed)
├── package.json                # Project dependencies
└── .env                        # Environment variables

```

## Key Components

### Main Server (src/index.js)
- HTTP/SSE server setup using Express
- Session management for MCP connections
- Health check endpoint
- Server initialization and startup

### MCP Server Configuration (src/server.js)
- MCP server instance creation
- Handler registration (tools, resources, prompts)
- Server capabilities configuration

### Handlers (src/handlers/)
- **tools.js**: Implements all MetaAPI trading tools
- **resources.js**: Implements account and trading resources
- **prompts.js**: Implements AI prompts for trading assistance

### Utilities (src/utils/)
- **logger.js**: Centralized logging to stderr (MCP requirement)
- **connection.js**: MetaAPI connection caching and management
- **helpers.js**: Error mapping, ID generation, and other utilities

### Configuration (src/config.js)
- Environment variable loading
- MetaAPI client initialization
- Global configuration constants

## Transport Architecture

The server uses **HTTP/SSE (Server-Sent Events)** transport:

1. **GET /sse** - Establishes SSE connection
   - Creates new session with unique ID
   - Initializes MCP server instance
   - Streams events to client

2. **POST /message/:sessionId** - Receives JSON-RPC messages
   - Routes messages to correct session
   - Handles tool calls, resource reads, prompts

3. **GET /health** - Health check endpoint

## Session Management

- Each client connection gets a unique session ID (UUID)
- Sessions stored in Map with transport and server instances
- Automatic cleanup on connection close
- Session ID included in POST endpoint URL path

## Testing Strategy

- **Unit tests**: Individual tool and handler tests
- **Integration tests**: Full MCP protocol flow tests
- **Feature tests**: Phase-specific functionality tests
- **Visualization tests**: Data rendering and formatting tests

## Scripts

- **start_server.sh**: Start the MCP server
- **test_*.sh**: Automated testing scripts
- **validate*.js**: Validation and coverage checking
- **example.js**: Usage examples and demonstrations
