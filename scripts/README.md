# MetaAPI MCP Server - Utility Scripts

This directory contains utility scripts for development, validation, and testing.

## Server Management

### start_server.sh
Start the MCP server

```bash
./scripts/start_server.sh
```

### test_server.sh
Test server connectivity and health

```bash
./scripts/test_server.sh
```

## Validation Scripts

### validate_tools.js
Validate tool definitions and schemas

```bash
node scripts/validate_tools.js
```

### check_tool_coverage.js
Check tool coverage and completeness

```bash
node scripts/check_tool_coverage.js
```

### verify_ticks.js
Verify tick data retrieval functionality

```bash
node scripts/verify_ticks.js
```

## Inspection Tools

### inspect_accounts.cjs
Inspect MetaAPI account details

```bash
node scripts/inspect_accounts.cjs
```

### inspect_sdk.cjs
Inspect MetaAPI SDK capabilities

```bash
node scripts/inspect_sdk.cjs
```

## Example

### example.js
Example usage of the MCP server

```bash
node -r dotenv/config scripts/example.js
```

## Migration Scripts

### test_migration.sh
Test the HTTP/SSE migration

```bash
./scripts/test_migration.sh
```

### validate.sh
Validate the server setup

```bash
./scripts/validate.sh
```
