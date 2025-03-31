# Feature Comparison: Old (`src/`) vs New (`new/src/`)

This table compares the features implemented in the old JavaScript-based extension (`src/`) with the new TypeScript-based refactored version (`new/src/`).

**Legend:**
*   `x`: Feature exists with similar implementation.
*   `+`: Feature exists with improved/refactored implementation (e.g., TypeScript, better structure, CSS classes).
*   `o`: Feature was intentionally removed or does not exist in the new version.

| Feature                       | Old (`src/`) | New (`new/src/`) | Status | Notes                                                                 |
| :---------------------------- | :----------: | :--------------: | :----: | :-------------------------------------------------------------------- |
| **Core**                      |              |                  |        |                                                                       |
| Manifest Version 3            |      x       |        x         |   x    | Basic structure remains.                                              |
| Background Script             |      x       |        x         |   +    | Refactored to TypeScript, uses message routing, API modules.          |
| Content Script                |      x       |        x         |   +    | Refactored to TypeScript, uses CSS classes, simplified messaging.     |
| Popup UI (React)              |      x       |        x         |   +    | Refactored to TypeScript, uses hooks, improved state management.      |
| **Storage**                   |              |                  |        |                                                                       |
| Initialize Default Storage    |      x       |        x         |   +    | Moved to background script initialization, uses API wrapper.          |
| Notebook CRUD Operations      |      x       |        x         |   +    | Implemented in `notebookStore.ts` action module, uses API wrapper.    |
| Source CRUD Operations        |      x       |        x         |   +    | Implemented in `notebookStore.ts` action module, uses API wrapper.    |
| Set Current Notebook          |      x       |        x         |   +    | Implemented in `notebookStore.ts` action module, uses API wrapper.    |
| Get Initial Data for UI       |      -       |        x         |   +    | New message `GET_INITIAL_DATA` for efficient UI loading.              |
| **Research Mode**             |              |                  |        |                                                                       |
| Toggle Research Mode          |      x       |        x         |   +    | Implemented in background, uses API wrappers, notifies content script. |
| Floating Button Injection     |      x       |        x         |   +    | Handled by background script (`floatingButton.ts`), uses `scripting`. |
| Floating Button Removal       |      x       |        x         |   +    | Handled by background script (`floatingButton.ts`), uses `scripting`. |
| Button State Update (Saved)   |      x       |        x         |   +    | Background script determines state before injection/update.           |
| Button State Update (YouTube) |      x       |        x         |   +    | Background script determines state before injection/update.           |
| Content Script Mode Listener  |      x       |        x         |   +    | Replaced `storage.onChanged` with explicit messaging from background. |
| **Floating Button**           |              |                  |        |                                                                       |
| Button Creation (DOM)         |      x       |        x         |   +    | Simplified in content script, relies on CSS classes.                  |
| Button Styling                | Inline Styles|     CSS File     |   +    | Moved all styles to `content.css`.                                    |
| Button Click Handler          |      x       |        x         |   +    | Sends `ADD_SOURCE_FROM_CURRENT_TAB` message to background.            |
| Button Drag Functionality     |      x       |        -         |   o    | Intentionally removed per user request.                               |
| **NotebookLM Integration**    |              |                  |        |                                                                       |
| Ensure NotebookLM Tab         |      x       |        x         |   +    | Moved to `notebookLM.ts` action module, uses `tabs` API wrapper.      |
| Scan Notebook List (DOM)      |      x       |        x         |   +    | Moved to `notebookLM.ts`, uses `scripting` API wrapper.               |
| Sync Notebook List (Storage)  |      x       |        x         |   +    | Moved to `notebookLM.ts`, improved logic, uses `storage` API wrapper. |
| Add Sources to NotebookLM     |      -       |        x         |   +    | New feature implemented in `notebookLM.ts`.                           |
| Update Source Sync Status     |      x       |        x         |   +    | Handled within `notebookLM.ts` and `notebookStore.ts`.                |
| **UI Features**               |              |                  |        |                                                                       |
| Display Notebook List         |      x       |        x         |   +    | React component in `Popup.tsx`.                                       |
| Display Source List           |      x       |        x         |   +    | React component in `Popup.tsx`, sorted by date.                       |
| Create Notebook UI            |      x       |        x         |   +    | React component in `Popup.tsx`.                                       |
| Add Current Tab Button        |      x       |        x         |   +    | React component in `Popup.tsx`.                                       |
| Delete Source Button          |      x       |        x         |   +    | React component in `Popup.tsx`.                                       |
| Open Source Link              |      -       |        x         |   +    | Added `OPEN_URL` message handler.                                     |
| Sync NotebookLM List Button   |      x       |        x         |   +    | React component in `Popup.tsx`.                                       |
| Add Sources to LM Button      |      -       |        x         |   +    | React component in `Popup.tsx`.                                       |
| Loading/Error States          |      -       |        x         |   +    | Added basic loading/error handling in `Popup.tsx`.                    |
| Toast Notifications           |      x       |        x         |   +    | Refactored in content script to use CSS classes.                      |
| **Utilities**                 |              |                  |        |                                                                       |
| Normalize YouTube URL         |      x       |        x         |   +    | Moved to `utils.ts`, improved robustness.                           |

**Summary:**

All critical features from the old version appear to be present and generally improved in the new version. The main differences are:
*   **Improved Structure:** Code is modularized into API wrappers, action modules, UI components, and background/content scripts.
*   **TypeScript:** Provides type safety and better maintainability.
*   **CSS:** Styling is centralized in CSS files instead of inline styles.
*   **Messaging:** Clearer message passing protocols between components.
*   **Removed:** Floating button drag functionality was intentionally removed.
*   **Added:** Explicit "Add Sources to NotebookLM" button, "Open URL" functionality, basic loading/error states.

Based on this comparison, it seems safe to proceed with removing the old `src/` directory files.