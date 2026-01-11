# AIPex Browser Extension Sample

This is a sample browser extension project demonstrating how to build an AI-powered browser automation tool using the Aipex Studio framework packages.

## Overview

AIPex is a browser extension that allows users to automate browser tasks using natural language commands. It leverages the Aipex Studio framework to provide an open-source browser automation solution similar to browser-use.

## Core Dependencies

This sample project is built on three main Aipex Studio packages:

### [@aipexstudio/aipex-core](https://www.npmjs.com/package/@aipexstudio/aipex-core) (v0.0.6)

The core framework providing fundamental AI agent capabilities:

- **AI SDK Integration** (`aisdk`): Wrapper for AI model integration with various providers (OpenAI, Anthropic, Google)
- **Session Management** (`SessionStorage`): Handles conversation history and state persistence
- **Type Definitions** (`AppSettings`): Core configuration types for AI settings and agent behavior

**Usage in this project:**
- [src/lib/browser-agent-config.ts:7](src/lib/browser-agent-config.ts#L7) - Imports core functionality
- [src/lib/browser-agent-config.ts:23-28](src/lib/browser-agent-config.ts#L23-L28) - Creates IndexedDB-backed session storage
- [src/lib/browser-agent-config.ts:37-40](src/lib/browser-agent-config.ts#L37-L40) - Model factory using AI SDK

### [@aipexstudio/aipex-react](https://www.npmjs.com/package/@aipexstudio/aipex-react) (v0.0.6)

React components and hooks for building AI chat interfaces:

- **`useAgent` Hook**: React hook for initializing and managing AI agents
- **`ChatBot` Component**: Pre-built chat interface with message history and input
- **Theme System**: `ThemeProvider` and theme types for UI customization
- **i18n Support**: `I18nProvider` for internationalization
- **Intervention Components**: UI components for user intervention modes

**Usage in this project:**
- [src/pages/common/app-root.tsx:6-12](src/pages/common/app-root.tsx#L6-L12) - React components and utilities
- [src/pages/common/app-root.tsx:43-51](src/pages/common/app-root.tsx#L43-L51) - Agent initialization with `useAgent`
- [src/pages/common/app-root.tsx:65-84](src/pages/common/app-root.tsx#L65-L84) - ChatBot component with custom slots
- [src/pages/common/app-root.tsx:95-100](src/pages/common/app-root.tsx#L95-L100) - Theme and i18n providers

### [@aipexstudio/browser-runtime](https://www.npmjs.com/package/@aipexstudio/browser-runtime) (v0.0.6)

Browser-specific implementations and tools:

- **Storage Adapters**: `ChromeStorageAdapter` for persisting settings in browser storage, `IndexedDBStorage` for session data
- **Browser Tools** (`allBrowserTools`): Pre-built tools for browser automation (tab management, DOM manipulation, etc.)
- **Context Providers** (`allBrowserProviders`): Browser context information providers for AI agents

**Usage in this project:**
- [src/pages/common/app-root.tsx:13](src/pages/common/app-root.tsx#L13) - Chrome storage adapter
- [src/lib/browser-agent-config.ts:11-14](src/lib/browser-agent-config.ts#L11-L14) - Browser tools and providers
- [src/lib/browser-agent-config.ts:24](src/lib/browser-agent-config.ts#L24) - IndexedDB storage implementation

## Project Architecture

### Extension Structure

```
browser-ext/
├── src/
│   ├── background.ts           # Service worker for extension lifecycle
│   ├── content.tsx             # Content script entry point
│   ├── pages/
│   │   ├── common/
│   │   │   └── app-root.tsx    # Main React app with Aipex integration
│   │   ├── content/            # Content script implementation
│   │   ├── sidepanel/          # Side panel UI
│   │   └── options/            # Options page
│   ├── lib/
│   │   ├── browser-agent-config.ts  # Aipex agent configuration
│   │   └── intervention-ui.tsx      # Custom intervention UI
│   └── hooks/                  # Custom React hooks
├── manifest.json               # Chrome extension manifest
└── package.json
```

### How It Works

1. **Agent Initialization** ([src/lib/browser-agent-config.ts](src/lib/browser-agent-config.ts))
   - Creates browser-specific storage using IndexedDB
   - Sets up model factory with AI SDK
   - Configures browser tools and context providers

2. **React Integration** ([src/pages/common/app-root.tsx](src/pages/common/app-root.tsx))
   - Uses `useAgent` hook to initialize AI agent with settings
   - Renders `ChatBot` component with custom UI slots
   - Wraps app with theme and i18n providers

3. **Browser Extension Integration**
   - Background service worker handles extension lifecycle
   - Content scripts inject AI assistant into web pages
   - Side panel provides persistent chat interface

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Chrome/Chromium browser

### Installation

```bash
# Install dependencies
pnpm install

# Build the extension
pnpm run build

# Development mode with hot reload
pnpm dev
```

### Loading the Extension

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `build` directory from this project

### Usage

- Click the extension icon to open the side panel
- Or press `Ctrl+M` (Windows/Linux) or `Cmd+M` (Mac) to open the command menu
- Type natural language commands to automate browser tasks

## Key Features Demonstrated

### 1. AI Provider Integration

The sample supports multiple AI providers through unified configuration:

```typescript
// From browser-agent-config.ts
const provider = createAIProvider(settings);
return aisdk(provider(settings.aiModel!));
```

Supports OpenAI, Anthropic Claude, and Google models via the AI SDK.

### 2. Persistent Session Storage

Uses IndexedDB for storing conversation history:

```typescript
new SessionStorage(
  new IndexedDBStorage({
    dbName: "aipex-sessions",
    storeName: "sessions",
  })
)
```

### 3. Browser Automation Tools

Leverages pre-built browser tools from `@aipexstudio/browser-runtime`:

```typescript
const tools = useBrowserTools();  // allBrowserTools
const contextProviders = useBrowserContextProviders();  // allBrowserProviders
```

### 4. Custom UI Integration

Demonstrates custom UI slots in the ChatBot component:

```typescript
<ChatBot
  agent={agent}
  slots={{
    headerContent: () => <CustomHeader />,
    afterMessages: () => <InterventionUI />
  }}
/>
```

### 5. Settings Persistence

Uses Chrome storage adapter for syncing settings:

```typescript
const i18nStorageAdapter = new ChromeStorageAdapter<Language>();
const themeStorageAdapter = new ChromeStorageAdapter<Theme>();
```

## Configuration

### AI Model Settings

Configure AI providers in the extension options page:
- API keys for OpenAI, Anthropic, or Google
- Model selection
- Temperature and other parameters

### Agent Behavior

Agent configuration in [src/lib/browser-agent-config.ts:60-64](src/lib/browser-agent-config.ts#L60-L64):

```typescript
export const BROWSER_AGENT_CONFIG = {
  instructions: SYSTEM_PROMPT,
  name: "AIPex Browser Assistant",
  maxTurns: 200,
} as const;
```

## Development

### Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build production bundle
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm test` - Run tests
- `pnpm test:watch` - Run tests in watch mode

### Testing

The project uses Vitest for testing:

```bash
pnpm test
```

## Extension Permissions

The extension requires various permissions for full functionality:
- `tabs`, `windows`, `tabGroups` - Tab and window management
- `scripting`, `debugger` - DOM manipulation and debugging
- `storage` - Settings persistence
- `bookmarks`, `history`, `downloads` - Browser data access
- `sidePanel` - Side panel UI

See [manifest.json](manifest.json) for complete permissions list.

## Contributing

This is a sample project demonstrating Aipex Studio integration. For the main AIPex project:

- Repository: https://github.com/AIPexStudio/AIPex
- Issues: Report issues in the main repository

## License

See the main AIPex repository for license information.

## Related Resources

- [Aipex Studio Documentation](https://aipexstudio.com/docs)
- [@aipexstudio/aipex-core](https://www.npmjs.com/package/@aipexstudio/aipex-core)
- [@aipexstudio/aipex-react](https://www.npmjs.com/package/@aipexstudio/aipex-react)
- [@aipexstudio/browser-runtime](https://www.npmjs.com/package/@aipexstudio/browser-runtime)

## Support

For questions and support, please visit the main AIPex repository or check the Aipex Studio documentation.
