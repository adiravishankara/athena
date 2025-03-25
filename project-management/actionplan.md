# Action Plan for NotebookLM Integration

## Repository Implementation Analysis
The repository uses Chrome's scripting API to automate NotebookLM interactions through DOM manipulation. Here's how it works:

1. **Command Listener Setup**
   - Listens for keyboard shortcuts to trigger automation
   - Uses `chrome.commands.onCommand.addListener`

2. **Main Automation Flow**
   ```typescript
   async function runAutomation() {
     // 1. Get current tab URL
     // 2. Open NotebookLM in new tab
     // 3. Wait for page load
     // 4. Click "Create New" button
     // 5. Click "Website" button
     // 6. Input URL and click "Insert"
   }
   ```

3. **DOM Interaction Methods**
   - Uses multiple selector fallbacks for reliability
   - Implements waiting periods between actions
   - Handles errors gracefully

## Implementation Plan for Our Extension

1. **Service Layer** (src/services/notebookLM/notebookService.ts)
   - Create NotebookLMService class with methods:
     - `getNotebooks()`: Get list of notebooks
     - `addSource(url: string, notebookId: string)`
     - `waitForTabLoad(tabId: number)`

2. **DOM Interaction Functions** (src/services/notebookLM/domUtils.ts)
   - Port their selector-based approach:
     - `clickCreateNewButton()`
     - `processWebsiteInput()`
     - Add new function `getNotebookList()`

3. **Integration Steps**
   1. Copy and adapt their Chrome scripting implementation
   2. Add notebook list retrieval functionality
   3. Modify UI to work with real NotebookLM notebooks

## Required Changes to Current Extension
1. Update manifest.json to include required permissions:
   ```json
   {
     "permissions": [
       "scripting",
       "tabs",
       "activeTab"
     ],
     "host_permissions": [
       "https://notebooklm.google.com/*"
     ]
   }
   ```

2. Create new background script handlers
3. Update existing UI components to work with NotebookLM

## Questions Resolved
- How does it access NotebookLM? → Uses chrome.scripting.executeScript
- How does it handle interactions? → DOM manipulation with fallback selectors
- Error handling? → Try-catch blocks and console logging

## Next Steps
1. Would you like me to start implementing these changes?
2. Should we keep their keyboard shortcut functionality or stick with our current UI-based approach?
3. Do you want to keep their console logging in Japanese or switch to English?

The implementation is very straightforward and well-structured. We can directly adapt their code to work with our extension's existing functionality. Would you like me to start with any particular component? 