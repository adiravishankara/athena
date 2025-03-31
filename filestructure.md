src/
├── api/                  # Core logic, abstractions over Chrome APIs
│   ├── chrome/           # Low-level, reusable wrappers for chrome.* APIs
│   │   ├── runtime.ts
│   │   ├── scripting.ts
│   │   ├── storage.ts
│   │   └── tabs.ts
│   ├── actions/          # High-level features/actions
│   │   ├── floatingButton.ts # Logic related to button state/visibility (called by background)
│   │   ├── notebookStore.ts  # CRUD for local notebooks/sources via chrome.storage
│   │   └── notebookLM.ts     # All logic for interacting with NotebookLM website (replaces basicService.ts)
│   └── utils/            # Shared utilities within the API layer
│       ├── domSelectors.ts # Centralize potentially brittle selectors for NotebookLM?
│       └── scriptingUtils.ts # Helpers like safeExecuteScript
├── background/           # Background script logic
│   └── background.ts     # Entry point, message routing, initialization
├── content/              # Content script logic & assets
│   ├── contentScript.ts  # Handles DOM interaction (floating button), message passing
│   └── content.css       # Styles for injected elements (floating button, toasts)
├── ui/                   # React UI components, hooks, state, styles
│   ├── components/       # Reusable UI components (e.g., Button, Select, SourceItem)
│   ├── hooks/            # Custom React hooks (e.g., useStorage, useMessaging)
│   ├── pages/            # Top-level UI views (e.g., Popup.tsx)
│   ├── state/            # Zustand store definitions (if needed for complex UI state)
│   ├── styles/           # Global styles, theme (or co-located .styled.tsx)
│   └── main.tsx          # React app entry point (renders Popup page)
├── common/               # Shared types, constants across layers
│   ├── constants.ts
│   └── types.ts          # Shared TypeScript interfaces (Source, Notebook, etc.)
└── assets/               # Static assets (icons moved here from public/)

public/                   # Minimal public assets (if any needed beyond icons)
manifest.json             # Extension manifest (updated entry points)
vite.config.ts            # Vite build configuration (updated entry points)
...                       # Other config files (.eslintrc.js, tsconfig.json, etc.)