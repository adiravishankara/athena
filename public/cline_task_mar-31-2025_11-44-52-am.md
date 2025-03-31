**User:**

<task>
I think there are a lot of organizational issues with this code. What would you do to fix it? My main issues are repetitive functions, disorganized API.

Can you help me work on organize (i.e., all the functions related to interacting with chrome scripting should be in an API folder and then a new file for each command or something like finding the right button should be a file, ensuring that we are on the right page should be a file, eventually when we create a background sync funciton that should be a file) and so on. 

And then All the front end design should happen somewhere. Finally all the button clicks and and everything should reference the backed API.

This way when I am debugging and searching for functions, I know where to look.

Remember that this is a chrome extension, and we are using react + vite, and there is ESLint. Keep in consideration of the issues with all that.

Finally, I want to obfuscate the majority of the work so that it doesnt live in background.js or contentScript.js so that anyone can just see the code.
</task>
<environment_details>
# VSCode Visible Files
vite.config.ts

# VSCode Open Tabs
project-management/tasklist.md,project-management/images/main-dash.png,project-management/phase3_plan.md,src/background.js,src/App2.tsx,vite.config.ts,project-management/cline_docs.md

# Current Time
3/31/2025, 10:21:16 AM (Asia/Taipei, UTC+8:00)

# Current Context Size (Tokens)
(Not available)

# Current Cost
$0.00

# Current Mode
<slug>architect</slug>
<name>Architect</name>


# Current Working Directory (c:/Users/adira/Desktop/REPOSITORIES/OTHER PROJECTS/athena) Files
.cursorrules
.gitignore
add_to_back.js
eslint.config.js
example.ts
index.html
manifest.json
package-lock.json
package.json
README.md
template.md
tsconfig.app.json
tsconfig.json
tsconfig.node.json
vite.config.ts
.git/
.git/COMMIT_EDITMSG
.git/config
.git/description
.git/FETCH_HEAD
.git/HEAD
.git/index
.git/ORIG_HEAD
.git/hooks/
.git/hooks/applypatch-msg.sample
.git/hooks/commit-msg.sample
.git/hooks/fsmonitor-watchman.sample
.git/hooks/post-update.sample
.git/hooks/pre-applypatch.sample
.git/hooks/pre-commit.sample
.git/hooks/pre-merge-commit.sample
.git/hooks/pre-push.sample
.git/hooks/pre-rebase.sample
.git/hooks/pre-receive.sample
.git/hooks/prepare-commit-msg.sample
.git/hooks/push-to-checkout.sample
.git/hooks/sendemail-validate.sample
.git/hooks/update.sample
.git/info/
.git/info/exclude
.git/objects/
.git/objects/0a/
.git/objects/0d/
.git/objects/0e/
.git/objects/0f/
.git/objects/01/
.git/objects/1a/
.git/objects/1b/
.git/objects/1d/
.git/objects/1e/
.git/objects/1f/
.git/objects/02/
.git/objects/2e/
.git/objects/2f/
.git/objects/3a/
.git/objects/3b/
.git/objects/3e/
.git/objects/3f/
.git/objects/04/
.git/objects/4a/
.git/objects/4b/
.git/objects/4d/
.git/objects/4f/
.git/objects/05/
.git/objects/5b/
.git/objects/5c/
.git/objects/5d/
.git/objects/5f/
.git/objects/06/
.git/objects/6a/
.git/objects/6b/
.git/objects/6c/
.git/objects/6e/
.git/objects/6f/
.git/objects/7a/
.git/objects/7b/
.git/objects/7c/
.git/objects/7d/
.git/objects/7e/
.git/objects/08/
.git/objects/8a/
.git/objects/8b/
.git/objects/8c/
.git/objects/8d/
.git/objects/8e/
.git/objects/8f/
.git/objects/09/
.git/objects/9a/
.git/objects/9b/
.git/objects/9d/
.git/objects/9f/
.git/objects/10/
.git/objects/11/
.git/objects/12/
.git/objects/13/
.git/objects/14/
.git/objects/15/
.git/objects/17/
.git/objects/20/
.git/objects/22/
.git/objects/25/
.git/objects/26/
.git/objects/28/
.git/objects/29/
.git/objects/30/
.git/objects/31/
.git/objects/32/
.git/objects/33/
.git/objects/35/
.git/objects/36/
.git/objects/38/
.git/objects/40/
.git/objects/42/
.git/objects/43/
.git/objects/44/
.git/objects/46/
.git/objects/47/
.git/objects/48/
.git/objects/49/
.git/objects/50/
.git/objects/52/
.git/objects/53/
.git/objects/55/
.git/objects/56/
.git/objects/57/
.git/objects/59/
.git/objects/60/
.git/objects/61/
.git/objects/63/
.git/objects/64/
.git/objects/65/
.git/objects/67/
.git/objects/69/
.git/objects/70/
.git/objects/71/
.git/objects/74/
.git/objects/76/
.git/objects/77/
.git/objects/78/
.git/objects/79/
.git/objects/80/
.git/objects/81/
.git/objects/82/
.git/objects/83/
.git/objects/84/
.git/objects/85/
.git/objects/86/
.git/objects/87/
.git/objects/94/
.git/objects/96/
.git/objects/97/
.git/objects/a0/
.git/objects/a1/
.git/objects/a2/
.git/objects/a4/
.git/objects/a5/
.git/objects/a6/
.git/objects/a7/
.git/objects/a9/
.git/objects/aa/
.git/objects/ab/
.git/objects/ac/
.git/objects/ad/
.git/objects/ae/
.git/refs/
build/
build/background.js
build/contentScript.js
build/index.html
build/main.js
build/manifest.json
build/vite.svg
build/assets/
build/design_images/
build/icons/
project-management/
project-management/actionplan.md
project-management/cline_docs.md
project-management/context.md
project-management/milestone.md
project-management/phase3_plan.md
project-management/tasklist.md
project-management/images/
public/
public/vite.svg
public/design_images/
public/icons/
src/
src/App.css
src/App.tsx
src/App2.tsx
src/background.js
src/contentScript.js
src/index.css
src/main.tsx
src/vite-env.d.ts
src/assets/
src/elements/
src/requests/
src/services/

(File list truncated. Use list_files on specific subdirectories if you need to explore further.)
</environment_details>

---

**Assistant:**

Okay, I understand the challenges you're facing with the current organization of your Chrome extension code. Repetitive functions, a disorganized API layer, and logic being too exposed in `background.js` and `contentScript.js` are common issues as projects grow. Moving to a more structured approach with clear separation of concerns will definitely improve maintainability, debuggability, and achieve the desired obfuscation.

Based on your requirements and the project context (React, Vite, TypeScript, Chrome Extension), here's my plan to tackle this refactoring task:

**Phase 1: Information Gathering & Analysis**

1.  **Understand Current Structure:** I need to examine the existing code to identify patterns, responsibilities, and areas for improvement. I'll start by reading the key files:
    *   `src/background.js`: To see the current background logic and event handling.
    *   `src/contentScript.js`: To understand how the extension interacts with web pages.
    *   `src/App.tsx` and `src/App2.tsx`: To see how the UI is built and interacts with the backend/content scripts.
    *   `manifest.json`: To understand the extension's components, permissions, and entry points.
    *   `project-management/tasklist.md`, `project-management/featurelist.md`, `project-management/context.md`: To align with existing project documentation and processes.
2.  **Analyze Existing Folders:** Check the purpose of `src/requests/` and `src/services/` to see if they can be integrated into the new structure or if they serve a distinct purpose.

**Phase 2: Propose New Structure & Plan**

1.  **Define New Directory Structure:** Based on the analysis, I will propose a refined folder structure. A potential structure could look like this:
    *   `src/api/`: Core logic, Chrome API interactions.
        *   `chrome/`: Low-level wrappers for `chrome.*` APIs (e.g., `tabs.ts`, `scripting.ts`, `storage.ts`, `runtime.ts`).
        *   `actions/`: Higher-level, reusable actions built upon the Chrome wrappers (e.g., `findElement.ts`, `ensurePageActive.ts`, `syncData.ts`).
        *   `utils/`: Common utilities used within the API layer.
    *   `src/background/`: Minimal background script (`background.ts`). Its main role will be initialization and routing messages to the appropriate `src/api/actions/` modules.
    *   `src/content/`: Minimal content script (`contentScript.ts`). Primarily for DOM interaction if needed, injecting UI elements, and relaying messages between the page and the background script/API.
    *   `src/ui/`: All React components, hooks, state management, and styles.
        *   `components/`: Reusable UI components.
        *   `hooks/`: Custom React hooks (including React Query, Zustand hooks).
        *   `pages/` or `views/`: Top-level UI views (e.g., Popup, Options page).
        *   `state/`: Zustand store definitions.
        *   `styles/`: Global styles or theme definitions (or co-located `.styled.tsx` files).
        *   `main.tsx`: Entry point for the React app (e.g., for the popup).
    *   `src/common/`: Shared elements like TypeScript types (`types.ts`), constants (`constants.ts`), or utility functions used across multiple layers (UI, background, content).
2.  **Outline Refactoring Steps:**
    *   Detail the migration path: Which functions move where?
    *   Define the communication protocol: How will UI, background, and content scripts interact (likely via `chrome.runtime.sendMessage`, `chrome.tabs.sendMessage`, and potentially `long-lived connections`)?
    *   Specify API interfaces: Define clear TypeScript interfaces for messages and API module functions.
    *   Address Obfuscation: Explain how moving logic into compiled TypeScript modules within `src/api/` inherently makes it less directly accessible than plain JS in `background.js`/`contentScript.js`.
    *   Update Build Process: Ensure Vite configuration (`vite.config.ts`) correctly handles the new structure, multiple entry points (background, content, UI), and bundles the API modules.
    *   ESLint Integration: Plan for potential ESLint adjustments needed for the new structure.
3.  **Update Project Management Docs:** Plan the necessary updates to `tasklist.md`, `featurelist.md`, and `context.md` as per your rules.

**Phase 3: Review and Execution**

1.  **Present Plan:** Share the detailed plan, including the proposed structure (potentially with a Mermaid diagram) and refactoring steps.
2.  **Gather Feedback:** Discuss the plan with you, incorporating any feedback or adjustments.
3.  **Finalize Plan:** Get your approval on the final plan.
4.  **(Optional) Document Plan:** Offer to write the finalized plan to a markdown file (e.g., `project-management/refactoring_plan.md`).
5.  **Switch Mode:** Request to switch to "Code" mode to begin implementing the refactoring according to the approved plan.

Let's start with Phase 1. I'll begin by reading the core files to get a better understanding of the current state.

```tool_code
<read_file>
<path>src/background.js</path>
<auto_truncate>true</auto_truncate>
</read_file>
```

---

**User:**

[read_file for 'src/background.js'] Result:
  1 | // background.js
  2 | 
  3 | console.log("Background script loaded");
  4 | 
  5 | // Function to inject the floating button into a tab
  6 | function injectFloatingButton(tabId) {
  7 |   // Check if the tab exists and has a valid URL
  8 |   chrome.tabs.get(tabId, (tab) => {
  9 |     // Check if the URL is valid for script injection (not chrome://, chrome-extension://, etc.)
 10 |     const url = tab.url;
 11 |     if (!url || url.startsWith('chrome://') || url.startsWith('chrome-extension://') || url.startsWith('edge://') || url.startsWith('about:')) {
 12 |       console.log('Cannot inject script into', url);
 13 |       return;
 14 |     }
 15 |     
 16 |     // Get current notebook to check if URL is already saved
 17 |     chrome.storage.local.get(['currentNotebook', 'notebooks'], (result) => {
 18 |       const currentNotebook = result.currentNotebook;
 19 |       const notebooks = result.notebooks || {};
 20 |       let isUrlSaved = false;
 21 |       let isYouTube = false;
 22 |       
 23 |       // Check if URL is already saved in current notebook
 24 |       if (currentNotebook && notebooks[currentNotebook] && notebooks[currentNotebook].sources) {
 25 |         // Check if the URL is already in the current notebook's sources
 26 |         Object.values(notebooks[currentNotebook].sources).forEach((source) => {
 27 |           // Normalize YouTube URLs for comparison
 28 |           const normalizedUrl = normalizeYouTubeUrl(url);
 29 |           const normalizedSourceUrl = normalizeYouTubeUrl(source.url);
 30 |           if (normalizedUrl === normalizedSourceUrl) {
 31 |             isUrlSaved = true;
 32 |           }
 33 |         });
 34 |       }
 35 | 
 36 |       // Check if current URL is a YouTube URL
 37 |       isYouTube = url.toLowerCase().includes('youtube.com') || url.toLowerCase().includes('youtu.be');
 38 |       
 39 |       // Inject the floating button
 40 |       chrome.scripting.executeScript({
 41 |         target: { tabId: tabId },
 42 |         function: (params) => {
 43 |           const { isAlreadySaved, isYouTube } = params;
 44 |           // This function runs in the context of the web page
 45 |           // Check if the button already exists
 46 |           if (document.getElementById("athena-floating-button")) {
 47 |             // Update existing button state if needed
 48 |             const existingButton = document.getElementById("athena-floating-button");
 49 |             existingButton.innerHTML = isAlreadySaved ? "✓" : "+";
 50 |             existingButton.style.background = isAlreadySaved ? "#2e7d32" : "#004d40";
 51 |             return;
 52 |           }
 53 |           
 54 |           const button = document.createElement("div");
 55 |           button.id = "athena-floating-button";
 56 |           button.innerHTML = isAlreadySaved ? "✓" : "+";
 57 |           button.style.position = "fixed";
 58 |           button.style.bottom = "50%";
 59 |           button.style.right = "20px";
 60 |           button.style.transform = "translateY(50%)";
 61 |           button.style.background = isAlreadySaved ? "#2e7d32" : "#004d40";
 62 |           button.style.color = "white";
 63 |           button.style.width = "40px";
 64 |           button.style.height = "40px";
 65 |           button.style.padding = "0";
 66 |           button.style.borderRadius = "50%";
 67 |           button.style.fontSize = "24px";
 68 |           button.style.fontWeight = "bold";
 69 |           button.style.cursor = "pointer";
 70 |           button.style.zIndex = "2147483647";
 71 |           button.style.boxShadow = "0 4px 8px rgba(0,0,0,0.4)";
 72 |           button.style.display = "flex";
 73 |           button.style.justifyContent = "center";
 74 |           button.style.alignItems = "center";
 75 |           button.style.lineHeight = "40px";
 76 |           button.style.textAlign = "center";
 77 |           button.style.fontFamily = "Arial, sans-serif";
 78 |           button.style.border = "none";
 79 |           button.style.margin = "0";
 80 |           button.style.userSelect = "none";
 81 | 
 82 |           // Add hover effect for YouTube videos
 83 |           if (isYouTube) {
 84 |             button.title = "Add YouTube video to notebook";
 85 |             button.style.transition = "transform 0.2s ease-in-out";
 86 |             button.addEventListener('mouseover', () => {
 87 |               button.style.transform = "translateY(50%) scale(1.1)";
 88 |             });
 89 |             button.addEventListener('mouseout', () => {
 90 |               button.style.transform = "translateY(50%) scale(1)";
 91 |             });
 92 |           }
 93 | 
 94 |           document.body.appendChild(button);
 95 |         },
 96 |         args: [{ isAlreadySaved: isUrlSaved, isYouTube: isYouTube }]
 97 |       }).catch(error => {
 98 |         console.error('Script injection error:', error);
 99 |       });
100 |     });
101 |   });
102 | }
103 | 
104 | // Helper function to normalize YouTube URLs for comparison
105 | function normalizeYouTubeUrl(url) {
106 |   try {
107 |     const urlObj = new URL(url);
108 |     if (urlObj.hostname.includes('youtube.com')) {
109 |       const videoId = urlObj.searchParams.get('v');
110 |       if (videoId) {
111 |         return `youtube.com/watch?v=${videoId}`;
112 |       }
113 |     } else if (urlObj.hostname.includes('youtu.be')) {
114 |       const videoId = urlObj.pathname.substring(1);
115 |       if (videoId) {
116 |         return `youtube.com/watch?v=${videoId}`;
117 |       }
118 |     }
119 |     return url.toLowerCase();
120 |   } catch (e) {
121 |     console.error('Error normalizing URL:', e);
122 |     return url.toLowerCase();
123 |   }
124 | }
125 | 
126 | // Function to remove the floating button from a tab
127 | function removeFloatingButton(tabId) {
128 |   chrome.scripting.executeScript({
129 |     target: { tabId: tabId },
130 |     function: () => {
131 |       const button = document.getElementById("athena-floating-button");
132 |       if (button) {
133 |         button.remove();
134 |       }
135 |     }
136 |   }).catch(error => {
137 |     // Ignore errors for non-injectable pages
138 |     console.log('Cannot remove button from this page');
139 |   });
140 | }
141 | 
142 | // Listener for when the extension is installed or updated
143 | chrome.runtime.onInstalled.addListener(() => {
144 |   console.log('Athena Extension Installed');
145 |   
146 |   // Initialize default storage values
147 |   chrome.storage.local.get(['notebooks', 'currentNotebook', 'researchMode'], (result) => {
148 |     if (!result.notebooks) {
149 |       chrome.storage.local.set({ notebooks: {} });
150 |     }
151 |     if (!result.currentNotebook) {
152 |       chrome.storage.local.set({ currentNotebook: null });
153 |     }
154 |     if (result.researchMode === undefined) {
155 |       chrome.storage.local.set({ researchMode: false });
156 |     }
157 |   });
158 | });
159 | 
160 | // Listen for tab updates (when user navigates to a new page)
161 | chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
162 |   // Wait for the tab to complete loading
163 |   if (changeInfo.status === 'complete') {
164 |     // Check if research mode is active
165 |     chrome.storage.local.get(['researchMode'], (result) => {
166 |       const isResearchMode = result.researchMode || false;
167 |       
168 |       if (isResearchMode) {
169 |         // Inject the floating button if research mode is active
170 |         injectFloatingButton(tabId);
171 |       }
172 |     });
173 |   }
174 | });
175 | 
176 | // Listen for new tab creation
177 | chrome.tabs.onCreated.addListener((tab) => {
178 |   // Check if research mode is active
179 |   chrome.storage.local.get(['researchMode'], (result) => {
180 |     const isResearchMode = result.researchMode || false;
181 |     
182 |     if (isResearchMode) {
183 |       // We'll wait for the tab to finish loading before injecting the button
184 |       // The onUpdated listener will handle this
185 |     }
186 |   });
187 | });
188 | 
189 | // Function to ensure NotebookLM tab is open and return its ID
190 | async function ensureNotebookLMTab() {
191 |   console.log('Ensuring NotebookLM tab exists...');
192 |   const notebookLMUrl = "https://notebooklm.google.com/*";
193 | 
194 |   try {
195 |     // Query for existing NotebookLM tabs
196 |     const tabs = await chrome.tabs.query({ url: notebookLMUrl });
197 | 
198 |     if (tabs.length > 0) {
199 |       // Found an existing tab, return its ID
200 |       console.log('Found existing NotebookLM tab:', tabs[0].id);
201 |       return tabs[0].id;
202 |     } else {
203 |       // No tab found, create a new one in the background
204 |       console.log('No NotebookLM tab found, creating a new one...');
205 |       const newTab = await chrome.tabs.create({ url: "https://notebooklm.google.com/", active: false });
206 |       console.log('Created new NotebookLM tab:', newTab.id);
207 |       // It might take a moment for the tab to fully load, but we have the ID
208 |       return newTab.id;
209 |     }
210 |   } catch (error) {
211 |     console.error('Error ensuring NotebookLM tab:', error);
212 |     throw new Error('Failed to ensure NotebookLM tab: ' + error.message); // Re-throw or handle as appropriate
213 |   }
214 | }
215 | 
216 | // Function to be injected into NotebookLM page to extract notebook data
217 | // IMPORTANT: Selectors are placeholders and need verification/adjustment!
218 | function extractNotebookDataFromDOM() {
219 |   console.log('Attempting to extract notebook data from DOM...');
220 |   const notebooks = [];
221 |   // Placeholder selector for individual notebook list items
222 |   const notebookElements = document.querySelectorAll('.notebook-list-item'); // Adjust selector
223 | 
224 |   if (!notebookElements || notebookElements.length === 0) {
225 |     console.warn('Could not find notebook elements with selector ".notebook-list-item".');
226 |     // Try an alternative or return empty
227 |     // const alternativeElements = document.querySelectorAll('...');
228 |     // if (!alternativeElements) return notebooks;
229 |     // notebookElements = alternativeElements;
230 |      return notebooks; // Return empty if no elements found
231 |   }
232 | 
233 |   notebookElements.forEach(element => {
234 |     try {
235 |       // Placeholder selector for the notebook name/title within the item
236 |       const nameElement = element.querySelector('.notebook-name'); // Adjust selector
237 |       // Placeholder logic for getting the notebook ID (might be data attribute, part of a link, etc.)
238 |       const idElement = element.querySelector('[data-notebook-id]'); // Adjust selector/attribute
239 |       const notebookId = idElement ? idElement.getAttribute('data-notebook-id') : element.id || null; // Adjust logic
240 | 
241 |       const notebookName = nameElement ? nameElement.innerText.trim() : 'Untitled Notebook';
242 | 
243 |       if (notebookId && notebookName) {
244 |         notebooks.push({
245 |           notebookLM_id: notebookId,
246 |           notebookLM_title: notebookName,
247 |         });
248 |       } else {
249 |          console.warn('Could not extract ID or Name for an element:', element);
250 |       }
251 |     } catch (error) {
252 |       console.error('Error processing a notebook element:', element, error);
253 |     }
254 |   });
255 | 
256 |   console.log(`Extracted ${notebooks.length} notebooks:`, notebooks);
257 |   return notebooks;
258 | }
259 | 
260 | // Function to orchestrate scanning notebooks in the specified tab
261 | async function scanNotebookLMNotebooks(tabId) {
262 |   console.log(`Scanning for notebooks in tab ID: ${tabId}`);
263 |   try {
264 |     const results = await chrome.scripting.executeScript({
265 |       target: { tabId: tabId },
266 |       func: extractNotebookDataFromDOM,
267 |     });
268 | 
269 |     // executeScript returns an array of results, one for each frame.
270 |     // We assume the main frame is the first one.
271 |     if (results && results[0] && results[0].result) {
272 |       console.log('Successfully scanned notebooks:', results[0].result);
273 |       return results[0].result; // This is the array of { notebookLM_id, notebookLM_title }
274 |     } else {
275 |       console.warn('No results received from script execution or result was empty.');
276 |       return []; // Return empty array if no data found
277 |     }
278 |   } catch (error) {
279 |     console.error(`Error executing notebook scanning script in tab ${tabId}:`, error);
280 |     // Check for specific errors like missing host permissions
281 |     if (error.message.includes('Cannot access contents of url')) {
282 |        throw new Error(`Cannot access NotebookLM page. Ensure host permissions for "https://notebooklm.google.com/*" are granted in manifest.json. Original error: ${error.message}`);
283 |     }
284 |      if (error.message.includes('No tab with id')) {
285 |        throw new Error(`NotebookLM tab with ID ${tabId} not found or closed. Original error: ${error.message}`);
286 |     }
287 |     throw new Error('Failed to scan notebooks: ' + error.message);
288 |   }
289 | }
290 | 
291 | 
292 | // Function to sync scanned notebook data with local storage
293 | async function syncNotebookData(scannedNotebooks) {
294 |   console.log('Syncing scanned notebooks with local storage:', scannedNotebooks);
295 | 
296 |   try {
297 |     // 1. Get current stored notebooks
298 |     const storageResult = await chrome.storage.local.get(['notebooks']);
299 |     const storedNotebooks = storageResult.notebooks || {}; // Use object format { name: data }
300 |     const updatedNotebooks = { ...storedNotebooks }; // Create a copy to modify
301 |     const nowISO = new Date().toISOString();
302 | 
303 |     const scannedNotebookMap = new Map(scannedNotebooks.map(nb => [nb.notebookLM_id, nb]));
304 |     const storedNotebookLMIds = new Set();
305 | 
306 |     // 2. Process stored notebooks against scanned data
307 |     for (const notebookName in updatedNotebooks) {
308 |       const storedData = updatedNotebooks[notebookName];
309 |       if (storedData.notebookLM_id) { // Only process notebooks that were previously synced
310 |         storedNotebookLMIds.add(storedData.notebookLM_id);
311 |         const scannedMatch = scannedNotebookMap.get(storedData.notebookLM_id);
312 | 
313 |         if (scannedMatch) {
314 |           // Match found: Update title and sync time if changed
315 |           if (storedData.notebookLM_title !== scannedMatch.notebookLM_title) {
316 |              console.log(`Updating title for notebook ID ${storedData.notebookLM_id}: "${storedData.notebookLM_title}" -> "${scannedMatch.notebookLM_title}"`);
317 |              storedData.notebookLM_title = scannedMatch.notebookLM_title;
318 |              storedData.last_updated_datetime = nowISO; // Also update this? Or just sync time? Let's update both.
319 |           }
320 |           storedData.last_sync_datetime = nowISO;
321 |         } else {
322 |           // No match found in scan: Mark as stale (as per plan)
323 |           console.log(`Marking notebook "${notebookName}" (ID: ${storedData.notebookLM_id}) as stale.`);
324 |           storedData.notebookLM_id = null; // Mark as stale
325 |           storedData.notebookLM_title = storedData.notebookLM_title || notebookName; // Keep last known title or name
326 |           storedData.last_sync_datetime = nowISO;
327 |           storedData.last_updated_datetime = nowISO;
328 |         }
329 |       }
330 |       // Keep notebooks that were created locally (notebookLM_id is null) as they are
331 |     }
332 | 
333 |     // 3. Process scanned notebooks against stored data (to find new ones)
334 |     for (const [scannedId, scannedData] of scannedNotebookMap.entries()) {
335 |       if (!storedNotebookLMIds.has(scannedId)) {
336 |         // New notebook found in scan, needs to be added to storage
337 |         // We need a unique local name. Using title for now, but might need refinement if titles clash.
338 |         let newNotebookName = scannedData.notebookLM_title;
339 |         let counter = 1;
340 |         // Ensure unique name in local storage
341 |         while (updatedNotebooks[newNotebookName]) {
342 |             newNotebookName = `${scannedData.notebookLM_title} (${counter++})`;
343 |         }
344 | 
345 |         console.log(`Adding new notebook found in scan: "${newNotebookName}" (ID: ${scannedId})`);
346 |         updatedNotebooks[newNotebookName] = {
347 |           created_datetime: nowISO,
348 |           last_updated_datetime: nowISO,
349 |           last_sync_datetime: nowISO,
350 |           notebookLM_id: scannedId,
351 |           notebookLM_url: `https://notebooklm.google.com/notebook/${scannedId}`, // Construct URL
352 |           notebookLM_title: scannedData.notebookLM_title,
353 |           sources: {} // Initialize empty sources
354 |         };
355 |       }
356 |     }
357 | 
358 |     // 4. Save the updated notebooks back to storage
359 |     await chrome.storage.local.set({ notebooks: updatedNotebooks });
360 |     console.log('Successfully synced notebooks to local storage:', updatedNotebooks);
361 |     return updatedNotebooks; // Return the updated list
362 | 
363 |   } catch (error) {
364 |     console.error('Error syncing notebook data:', error);
365 |     throw new Error('Failed to sync notebook data: ' + error.message);
366 |   }
367 | }
368 | 
369 | 
370 | // Notebook operations
371 | function createNotebook(name) {
372 |   return new Promise((resolve, reject) => {
373 |     if (!name) {
374 |       reject(new Error('Notebook name is required'));
375 |       return;
376 |     }
377 | 
378 |     chrome.storage.local.get(['notebooks'], (result) => {
379 |       const notebooks = result.notebooks || {};
380 |       
381 |       // Check if notebook already exists
382 |       if (notebooks[name]) {
383 |         reject(new Error(`Notebook "${name}" already exists`));
384 |         return;
385 |       }
386 |       
387 |       // Create new notebook with proper structure
388 |       notebooks[name] = {
389 |         created_datetime: new Date().toISOString(),
390 |         last_updated_datetime: new Date().toISOString(),
391 |         last_sync_datetime: null,
392 |         notebookLM_id: null,
393 |         notebookLM_url: null,
394 |         notebookLM_title: null,
395 |         sources: {}  // Initialize empty sources object
396 |       };
397 |       
398 |       // Save updated notebooks
399 |       chrome.storage.local.set({ notebooks, currentNotebook: name }, () => {
400 |         resolve({ name, notebook: notebooks[name] });
401 |       });
402 |     });
403 |   });
404 | }
405 | 
406 | function addSourceToNotebook(notebookName, source) {
407 |   return new Promise((resolve, reject) => {
408 |     if (!notebookName) {
409 |       reject(new Error('Notebook name is required'));
410 |       return;
411 |     }
412 |     
413 |     if (!source || !source.url) {
414 |       reject(new Error('Source URL is required'));
415 |       return;
416 |     }
417 |     
418 |     chrome.storage.local.get(['notebooks'], (result) => {
419 |       const notebooks = result.notebooks || {};
420 |       
421 |       // Check if notebook exists
422 |       if (!notebooks[notebookName]) {
423 |         reject(new Error(`Notebook "${notebookName}" does not exist`));
424 |         return;
425 |       }
426 |       
427 |       // Generate a unique ID for the source
428 |       const sourceId = `source_${Date.now()}`;
429 |       
430 |       // Add source to notebook's sources object
431 |       if (!notebooks[notebookName].sources) {
432 |         notebooks[notebookName].sources = {};
433 |       }
434 |       
435 |       notebooks[notebookName].sources[sourceId] = {
436 |         url: source.url,
437 |         title: source.title || source.url,
438 |         linkType: source.type || 'web',  // Changed type to linkType to match interface
439 |         added_datetime: source.datetime || new Date().toISOString(),
440 |         added_to_notebook: false  // Initialize as not added to NotebookLM
441 |       };
442 |       
443 |       // Update last_updated_datetime
444 |       notebooks[notebookName].last_updated_datetime = new Date().toISOString();
445 |       
446 |       // Save updated notebooks
447 |       chrome.storage.local.set({ notebooks }, () => {
448 |         resolve({ notebookName, sourceId, source: notebooks[notebookName].sources[sourceId] });
449 |       });
450 |     });
451 |   });
452 | }
453 | 
454 | function deleteSourceFromNotebook(notebookName, sourceId) {
455 |   return new Promise((resolve, reject) => {
456 |     if (!notebookName) {
457 |       reject(new Error('Notebook name is required'));
458 |       return;
459 |     }
460 |     
461 |     if (!sourceId) {
462 |       reject(new Error('Source ID is required'));
463 |       return;
464 |     }
465 |     
466 |     chrome.storage.local.get(['notebooks'], (result) => {
467 |       const notebooks = result.notebooks || {};
468 |       
469 |       // Check if notebook exists
470 |       if (!notebooks[notebookName]) {
471 |         reject(new Error(`Notebook "${notebookName}" does not exist`));
472 |         return;
473 |       }
474 |       
475 |       // Check if source exists
476 |       if (!notebooks[notebookName].sources || !notebooks[notebookName].sources[sourceId]) {
477 |         reject(new Error(`Source "${sourceId}" does not exist in notebook "${notebookName}"`));
478 |         return;
479 |       }
480 |       
481 |       // Delete source from notebook
482 |       delete notebooks[notebookName].sources[sourceId];
483 |       
484 |       // Update last_updated_datetime
485 |       notebooks[notebookName].last_updated_datetime = new Date().toISOString();
486 |       
487 |       // Save updated notebooks
488 |       chrome.storage.local.set({ notebooks }, () => {
489 |         resolve({ notebookName, sourceId });
490 |       });
491 |     });
492 |   });
493 | }
494 | 
495 | function setCurrentNotebook(notebookName) {
496 |   return new Promise((resolve, reject) => {
497 |     chrome.storage.local.get(['notebooks'], (result) => {
498 |       const notebooks = result.notebooks || {};
499 |       
500 |       // Check if notebook exists

[File truncated: showing 500 of 662 total lines. Use start_line and end_line or set auto_truncate to false if you need to read more.].

# background.js
5--101 | function injectFloatingButton(tabId) {
104--123 | function normalizeYouTubeUrl(url) {
126--139 | function removeFloatingButton(tabId) {
189--213 | async function ensureNotebookLMTab() {
217--257 | function extractNotebookDataFromDOM() {
260--288 | async function scanNotebookLMNotebooks(tabId) {
292--366 | async function syncNotebookData(scannedNotebooks) {
370--403 | function createNotebook(name) {
405--451 | function addSourceToNotebook(notebookName, source) {
453--492 | function deleteSourceFromNotebook(notebookName, sourceId) {
494--511 | function setCurrentNotebook(notebookName) {
513--537 | function toggleResearchMode(enabled) {
540--567 | function updateSourceSyncStatus(request, sender, sendResponse) {

<environment_details>
# VSCode Visible Files
vite.config.ts

# VSCode Open Tabs
project-management/tasklist.md,project-management/images/main-dash.png,project-management/phase3_plan.md,src/background.js,src/App2.tsx,vite.config.ts,project-management/cline_docs.md

# Current Time
3/31/2025, 10:22:00 AM (Asia/Taipei, UTC+8:00)

# Current Context Size (Tokens)
12,918 (1%)

# Current Cost
$0.00

# Current Mode
<slug>architect</slug>
<name>Architect</name>
</environment_details>

---

**Assistant:**

Okay, thanks for providing the content of `src/background.js`.

This confirms your assessment. The background script currently handles a wide range of responsibilities:
*   **DOM Manipulation (via `chrome.scripting.executeScript`):** Injecting, styling, and removing the floating button.
*   **State Management:** Reading/writing `researchMode`, `notebooks`, `currentNotebook` from `chrome.storage.local`.
*   **API Interaction (Chrome APIs):** Using `chrome.tabs`, `chrome.scripting`, `chrome.storage`, `chrome.runtime`.
*   **Business Logic:** Normalizing URLs, checking if URLs are saved, syncing NotebookLM data, CRUD operations for notebooks/sources.
*   **Event Handling:** Listening to tab updates, creation, installation, and runtime messages.

This mixing of concerns makes the code harder to manage and test. The plan to separate these into distinct layers (`api/chrome`, `api/actions`, `background`, `content`, `ui`) seems appropriate. The logic for injecting the button (`injectFloatingButton`, lines 6-102) and removing it (`removeFloatingButton`, lines 126-140) involves executing functions directly in the target tab's context, including significant DOM manipulation and styling. This logic should ideally be moved to a dedicated content script or managed more cleanly through message passing.

The NotebookLM interaction (`ensureNotebookLMTab`, `extractNotebookDataFromDOM`, `scanNotebookLMNotebooks`, `syncNotebookData`, lines 189-367) is a distinct feature that fits well into the proposed `src/api/actions/notebookLM.ts` module.

The local notebook management functions (`createNotebook`, `addSourceToNotebook`, etc., lines 370-537) belong in something like `src/api/actions/notebookStore.ts`.

The message listener (lines 569 onwards, truncated in the previous view) acts as the central hub and will be the core of the refactored `src/background/background.ts`, routing requests to the appropriate API actions.

Next, let's examine the content script to see how it currently interacts with the background script and the page.

```tool_code
<read_file>
<path>src/contentScript.js</path>
<auto_truncate>true</auto_truncate>
</read_file>
```

---

**User:**

[read_file for 'src/contentScript.js'] Result:
  1 | // contentScript.js
  2 | 
  3 | // This script checks if research mode is active and injects the floating button if it is
  4 | console.log("Content script loaded");
  5 | 
  6 | // Check if research mode is active
  7 | chrome.storage.local.get(['researchMode'], function(result) {
  8 |   const isResearchMode = result.researchMode || false;
  9 |   
 10 |   if (isResearchMode) {
 11 |     injectFloatingButton();
 12 |   }
 13 | });
 14 | 
 15 | // Listen for research mode toggle changes
 16 | chrome.storage.onChanged.addListener(function(changes, namespace) {
 17 |   if (namespace === 'local' && changes.researchMode) {
 18 |     const isResearchMode = changes.researchMode.newValue;
 19 |     
 20 |     if (isResearchMode) {
 21 |       injectFloatingButton();
 22 |     } else {
 23 |       removeFloatingButton();
 24 |     }
 25 |   }
 26 | });
 27 | 
 28 | // Function to inject the floating button
 29 | function injectFloatingButton() {
 30 |   if (document.getElementById("athena-floating-button")) return;
 31 | 
 32 |   const button = document.createElement("div");
 33 |   button.id = "athena-floating-button";
 34 |   button.innerHTML = "+";
 35 |   button.style.position = "fixed";
 36 |   button.style.bottom = "50%";
 37 |   button.style.right = "20px";
 38 |   button.style.transform = "translateY(50%)";
 39 |   button.style.background = "#004d40";
 40 |   button.style.color = "white";
 41 |   button.style.width = "40px";
 42 |   button.style.height = "40px";
 43 |   button.style.padding = "0";
 44 |   button.style.borderRadius = "50%";
 45 |   button.style.fontSize = "24px";
 46 |   button.style.fontWeight = "bold";
 47 |   button.style.cursor = "pointer";
 48 |   button.style.zIndex = "2147483647";
 49 |   button.style.boxShadow = "0 4px 8px rgba(0,0,0,0.4)";
 50 |   button.style.display = "flex";
 51 |   button.style.justifyContent = "center";
 52 |   button.style.alignItems = "center";
 53 |   button.style.lineHeight = "40px";
 54 |   button.style.textAlign = "center";
 55 |   button.style.fontFamily = "Arial, sans-serif";
 56 |   button.style.border = "none";
 57 |   button.style.margin = "0";
 58 |   button.style.userSelect = "none";
 59 | 
 60 |   // Make the button draggable
 61 |   let isDragging = false;
 62 |   let offsetX, offsetY;
 63 | 
 64 |   button.addEventListener('mousedown', function(e) {
 65 |     isDragging = false;
 66 |     offsetX = e.clientX - button.getBoundingClientRect().left;
 67 |     offsetY = e.clientY - button.getBoundingClientRect().top;
 68 |   });
 69 | 
 70 |   document.addEventListener('mousemove', function(e) {
 71 |     if (isDragging) {
 72 |       const left = e.clientX - offsetX;
 73 |       const top = e.clientY - offsetY;
 74 |       
 75 |       button.style.right = 'auto';
 76 |       button.style.bottom = 'auto';
 77 |       button.style.left = left + 'px';
 78 |       button.style.top = top + 'px';
 79 |     }
 80 |   });
 81 | 
 82 |   document.addEventListener('mouseup', function() {
 83 |     isDragging = false;
 84 |   });
 85 | 
 86 |   // Add click handler to save the current URL
 87 |   button.addEventListener('click', async function(e) {
 88 |     e.preventDefault();
 89 |     e.stopPropagation();
 90 |     
 91 |     if (!isDragging) {
 92 |       const url = window.location.href;
 93 |       const title = document.title;
 94 |       
 95 |       // Enhanced YouTube URL detection
 96 |       let linkType = 'web';
 97 |       const lowerUrl = url.toLowerCase();
 98 |       
 99 |       if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
100 |         linkType = 'youtube';
101 |         // Extract video ID and validate YouTube URL
102 |         const videoId = getYouTubeVideoId(url);
103 |         if (!videoId) {
104 |           showToast("Invalid YouTube URL", true);
105 |           return;
106 |         }
107 |       } else if (lowerUrl.includes('docs.google.com/document')) {
108 |         linkType = 'googledocs';
109 |       } else if (lowerUrl.includes('docs.google.com/presentation') || lowerUrl.includes('slides.google.com')) {
110 |         linkType = 'googleslides';
111 |       } else if (lowerUrl.endsWith('.pdf')) {
112 |         linkType = 'pdf';
113 |       }
114 |       
115 |       try {
116 |         chrome.runtime.sendMessage({
117 |           action: 'ADD_SOURCE',
118 |           url: url,
119 |           title: title,
120 |           type: linkType,
121 |           datetime: new Date().toISOString()
122 |         }, (response) => {
123 |           if (chrome.runtime.lastError) {
124 |             console.error('Error sending message:', chrome.runtime.lastError);
125 |             showToast("Failed to add to notebook: Connection error", true);
126 |             return;
127 |           }
128 |           
129 |           if (response && response.status === 'success') {
130 |             // Visual feedback REMOVED - Background script will handle state on refresh/navigation
131 |             // button.style.background = '#2e7d32'; // REMOVED
132 |             // button.innerHTML = "✓"; // REMOVED
133 |             showToast(`Added ${linkType === 'youtube' ? 'YouTube video' : 'page'} to notebook`, false);
134 |           } else {
135 |             showToast(response && response.error ? response.error : "Failed to add to notebook", true);
136 |           }
137 |         });
138 |       } catch (error) {
139 |         console.error('Error sending message:', error);
140 |         showToast("Failed to add to notebook: " + error.message, true);
141 |       }
142 |     }
143 |   });
144 | 
145 |   document.body.appendChild(button);
146 | }
147 | 
148 | // Helper function to extract YouTube video ID
149 | function getYouTubeVideoId(url) {
150 |   try {
151 |     const urlObj = new URL(url);
152 |     if (urlObj.hostname.includes('youtube.com')) {
153 |       return urlObj.searchParams.get('v');
154 |     } else if (urlObj.hostname.includes('youtu.be')) {
155 |       return urlObj.pathname.substring(1);
156 |     }
157 |   } catch (e) {
158 |     console.error('Error parsing YouTube URL:', e);
159 |   }
160 |   return null;
161 | }
162 | 
163 | // Function to remove the floating button
164 | function removeFloatingButton() {
165 |   const button = document.getElementById("athena-floating-button");
166 |   if (button) {
167 |     button.remove();
168 |   }
169 | }
170 | 
171 | // Helper function to show toast messages
172 | function showToast(message, isError = false) {
173 |   const toast = document.createElement("div");
174 |   toast.textContent = message;
175 |   toast.style.position = "fixed";
176 |   toast.style.bottom = "100px";
177 |   toast.style.right = "20px";
178 |   toast.style.backgroundColor = isError ? "rgba(211, 47, 47, 0.9)" : "rgba(46, 125, 50, 0.9)";
179 |   toast.style.color = "white";
180 |   toast.style.padding = "10px 15px";
181 |   toast.style.borderRadius = "4px";
182 |   toast.style.zIndex = "2147483647";
183 |   document.body.appendChild(toast);
184 |   
185 |   setTimeout(() => {
186 |     toast.remove();
187 |   }, 2000);
188 | } 
<environment_details>
# VSCode Visible Files
vite.config.ts

# VSCode Open Tabs
project-management/tasklist.md,project-management/images/main-dash.png,project-management/phase3_plan.md,src/background.js,src/App2.tsx,vite.config.ts,project-management/cline_docs.md

# Current Time
3/31/2025, 10:22:54 AM (Asia/Taipei, UTC+8:00)

# Current Context Size (Tokens)
20,985 (2%)

# Current Cost
$0.00

# Current Mode
<slug>architect</slug>
<name>Architect</name>
</environment_details>

---

**Assistant:**

Thanks for providing the `contentScript.js` content.

This script confirms the redundancy issue: it duplicates the logic for creating, styling, and removing the floating button that we also saw being injected by the background script. It also directly handles user interactions (clicks, drags) on the button, determines the source type, and sends the `ADD_SOURCE` message to the background script. It even includes its own toast notification system.

This reinforces the need for the refactoring plan:

1.  **Single Source of Truth for Button:** The button's creation, styling, event handling (click, drag), and removal logic should reside *only* within the content script (`src/content/contentScript.ts`).
2.  **Message-Based Control:** The background script should control the button's visibility by sending messages (e.g., `{ action: 'TOGGLE_BUTTON', visible: true/false }`) to the content script, rather than injecting code or having the content script poll storage directly for `researchMode`.
3.  **Centralized Actions:** The content script should only send high-level action messages (like `ADD_SOURCE`) to the background script. The background script will then delegate these to the appropriate API modules (`src/api/actions/`).
4.  **Styling:** Inline styles should be moved to a dedicated CSS file (`src/content/content.css`) imported by the content script or handled via the manifest.

Now, let's examine the UI layer to understand how it interacts with the rest of the extension. I'll start with `App.tsx`.

```tool_code
<read_file>
<path>src/App.tsx</path>
<auto_truncate>true</auto_truncate>
</read_file>
```

[Response interrupted by a tool use result. Only one tool may be used at a time and should be placed at the end of the message.]

---

**User:**

[read_file for 'src/App.tsx'] Result:
  1 | import { useState, useEffect } from 'react'
  2 | import './App.css'
  3 | import { NotebookLMService } from './services/notebookLM/basicService'
  4 | 
  5 | /// <reference types="chrome"/>
  6 | 
  7 | interface Source {
  8 |   url: string;
  9 |   title: string;
 10 |   linkType: string;
 11 |   added_datetime: string;
 12 | }
 13 | 
 14 | interface NotebookData {
 15 |   [sourceId: string]: Source;
 16 | }
 17 | 
 18 | interface Notebooks {
 19 |   [notebookName: string]: NotebookData;
 20 | }
 21 | 
 22 | function App() {
 23 |   const [researchMode, setResearchMode] = useState(false)
 24 |   const [notebooks, setNotebooks] = useState<Notebooks>({})
 25 |   const [currentNotebook, setCurrentNotebook] = useState<string | null>(null)
 26 |   const [isCreatingNotebook, setIsCreatingNotebook] = useState(false)
 27 |   const [newNotebookName, setNewNotebookName] = useState('')
 28 |   const [sources, setSources] = useState<[string, Source][]>([])
 29 |   const [isAddingSource, setIsAddingSource] = useState(false)
 30 |   const [isSyncing, setIsSyncing] = useState(false)
 31 |   const notebookService = new NotebookLMService()
 32 | 
 33 |   // Load initial data from storage
 34 |   useEffect(() => {
 35 |     chrome.storage.local.get(['notebooks', 'currentNotebook', 'researchMode'], (result) => {
 36 |       if (result.notebooks) {
 37 |         setNotebooks(result.notebooks)
 38 |       }
 39 |       if (result.currentNotebook) {
 40 |         setCurrentNotebook(result.currentNotebook)
 41 |       }
 42 |       if (result.researchMode !== undefined) {
 43 |         setResearchMode(result.researchMode)
 44 |       }
 45 |     })
 46 | 
 47 |     // Listen for storage changes
 48 |     chrome.storage.onChanged.addListener((changes, _namespace) => {
 49 |       if (changes.notebooks) {
 50 |         setNotebooks(changes.notebooks.newValue)
 51 |       }
 52 |       if (changes.currentNotebook) {
 53 |         setCurrentNotebook(changes.currentNotebook.newValue)
 54 |       }
 55 |       if (changes.researchMode) {
 56 |         setResearchMode(changes.researchMode.newValue)
 57 |       }
 58 |     })
 59 |   }, [])
 60 | 
 61 |   // Update sources when notebooks or current notebook changes
 62 |   useEffect(() => {
 63 |     if (currentNotebook && notebooks[currentNotebook]) {
 64 |       // Convert object to array of [id, source] pairs and sort by date (newest first)
 65 |       const sourceEntries = Object.entries(notebooks[currentNotebook])
 66 |         .sort((a, b) => {
 67 |           return new Date(b[1].added_datetime).getTime() - new Date(a[1].added_datetime).getTime()
 68 |         })
 69 |       setSources(sourceEntries)
 70 |     } else {
 71 |       setSources([])
 72 |     }
 73 |   }, [notebooks, currentNotebook])
 74 | 
 75 |   // Toggle research mode
 76 |   const handleToggleResearchMode = () => {
 77 |     const newMode = !researchMode
 78 |     setResearchMode(newMode)
 79 |     chrome.runtime.sendMessage(
 80 |       { action: 'TOGGLE_RESEARCH_MODE', enabled: newMode },
 81 |       (response) => {
 82 |         console.log('Research Mode Toggled:', response)
 83 |       }
 84 |     )
 85 |   }
 86 | 
 87 |   // Handle notebook selection
 88 |   const handleNotebookChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
 89 |     const value = event.target.value
 90 |     
 91 |     if (value === 'create_new') {
 92 |       setIsCreatingNotebook(true)
 93 |     } else {
 94 |       chrome.runtime.sendMessage(
 95 |         { action: 'SET_CURRENT_NOTEBOOK', name: value },
 96 |         (response) => {
 97 |           console.log('Current Notebook Set:', response)
 98 |           setCurrentNotebook(value)
 99 |         }
100 |       )
101 |     }
102 |   }
103 | 
104 |   // Create a new notebook
105 |   const handleCreateNotebook = () => {
106 |     if (newNotebookName.trim() === '') {
107 |       alert('Please enter a notebook name')
108 |       return
109 |     }
110 | 
111 |     chrome.runtime.sendMessage(
112 |       { action: 'CREATE_NOTEBOOK', name: newNotebookName.trim() },
113 |       (response) => {
114 |         if (response.status === 'success') {
115 |           console.log('Notebook Created:', response)
116 |           setNewNotebookName('')
117 |           setIsCreatingNotebook(false)
118 |           setCurrentNotebook(response.data.name)
119 |         } else {
120 |           alert(`Error: ${response.error}`)
121 |         }
122 |       }
123 |     )
124 |   }
125 | 
126 |   // Delete a source
127 |   const handleDeleteSource = (sourceId: string) => {
128 |     if (!currentNotebook) return
129 | 
130 |     chrome.runtime.sendMessage(
131 |       { action: 'DELETE_SOURCE', notebookName: currentNotebook, sourceId },
132 |       (response) => {
133 |         console.log('Source Deleted:', response)
134 |       }
135 |     )
136 |   }
137 | 
138 |   // Add current tab as source
139 |   const handleAddCurrentTab = () => {
140 |     if (!currentNotebook) {
141 |       alert('Please select a notebook first');
142 |       return;
143 |     }
144 | 
145 |     setIsAddingSource(true);
146 | 
147 |     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
148 |       if (tabs.length === 0) {
149 |         setIsAddingSource(false);
150 |         alert('No active tab found');
151 |         return;
152 |       }
153 | 
154 |       const currentTab = tabs[0];
155 |       
156 |       chrome.runtime.sendMessage(
157 |         {
158 |           action: 'ADD_SOURCE',
159 |           url: currentTab.url,
160 |           title: currentTab.title,
161 |           type: 'web',
162 |           datetime: new Date().toISOString()
163 |         },
164 |         (response) => {
165 |           setIsAddingSource(false);
166 |           if (response.status === 'success') {
167 |             console.log('Source Added:', response);
168 |           } else {
169 |             alert(`Error: ${response.error}`);
170 |           }
171 |         }
172 |       );
173 |     });
174 |   }
175 | 
176 |   // Handle opening a source URL in a new tab
177 |   const handleOpenSource = (url: string) => {
178 |     chrome.tabs.create({ url, active: false });
179 |   }
180 | 
181 |   // Sync current notebook to NotebookLM
182 |   const handleSyncToNotebookLM = async () => {
183 |     if (sources.length === 0) {
184 |       alert('No sources to sync');
185 |       return;
186 |     }
187 | 
188 |     setIsSyncing(true);
189 | 
190 |     try {
191 |       for (const [_, source] of sources) {
192 |         await notebookService.addSource({
193 |           url: source.url,
194 |           title: source.title
195 |         });
196 |       }
197 |       alert('Successfully synced sources to NotebookLM');
198 |     } catch (error) {
199 |       console.error('Error syncing to NotebookLM:', error);
200 |       alert('Error syncing to NotebookLM. Check console for details.');
201 |     } finally {
202 |       setIsSyncing(false);
203 |     }
204 |   };
205 | 
206 |   const handleAddSource = async () => {
207 |     if (sources.length === 0) {
208 |       alert('No sources to add. Please add sources to your notebook first.');
209 |       return;
210 |     }
211 | 
212 |     try {
213 |       setIsSyncing(true);
214 |       
215 |       // Tell the user how many sources we're going to add
216 |       const totalSources = sources.length;
217 |       
218 |       // Track successful, skipped, and failed sources
219 |       let successCount = 0;
220 |       let skippedCount = 0;
221 |       let failedSources: string[] = [];
222 |       
223 |       // Add each source one by one
224 |       for (let i = 0; i < sources.length; i++) {
225 |         const [_, source] = sources[i];
226 |         
227 |         try {
228 |           // Check if this is a web link or another type
229 |           const url = source.url.toLowerCase();
230 |           const isGoogleDocs = url.includes('docs.google.com/document');
231 |           const isGoogleSlides = url.includes('docs.google.com/presentation') || url.includes('slides.google.com');
232 |           const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
233 |           
234 |           // Skip non-web links for now
235 |           if (isGoogleDocs || isGoogleSlides) {
236 |             console.log(`Skipping non-web link (${i+1}/${totalSources}):`, source.url);
237 |             skippedCount++;
238 |             continue;
239 |           }
240 |           setIsSyncing(true);
241 |           
242 |           // Handle YouTube links
243 |           if (isYouTube) {
244 |             try {
245 |               // Click the YouTube button in NotebookLM
246 |               await notebookService.addSource({
247 |                 url: source.url,
248 |                 title: source.title,
249 |                 // linkType: 'youtube' // Specify the type as YouTube
250 |               });
251 |               successCount++;
252 |               console.log(`Added YouTube video (${i+1}/${totalSources}):`, source.url);
253 |             } catch (error) {
254 |               console.error(`Failed to add YouTube video (${i+1}/${totalSources}):`, error);
255 |               failedSources.push(source.url);
256 |             }
257 |             continue;
258 |           }
259 |           
260 |           // Handle regular web links
261 |           await notebookService.addSource({
262 |             url: source.url,
263 |             title: source.title,
264 |             // linkType: 'web'
265 |           });
266 |           
267 |           successCount++;
268 |           console.log(`Added source ${i+1}/${totalSources} to NotebookLM:`, source.url);
269 |           
270 |           // Small delay between sources to avoid overwhelming NotebookLM
271 |           if (i < sources.length - 1) {
272 |             await new Promise(resolve => setTimeout(resolve, 500));
273 |           }
274 |         } catch (error) {
275 |           console.error(`Failed to add source ${i+1}/${totalSources}:`, source.url, error);
276 |           failedSources.push(source.url);
277 |         }
278 |       }
279 |       
280 |       // Show a completion message
281 |       if (skippedCount > 0) {
282 |         alert(`Added ${successCount} website sources to NotebookLM. Skipped ${skippedCount} non-web sources (Google Docs, Slides). ${failedSources.length} sources failed.`);
283 |       } else if (failedSources.length === 0) {
284 |         alert(`Successfully added all ${successCount} sources to NotebookLM!`);
285 |       } else {
286 |         alert(`Added ${successCount} out of ${totalSources} sources to NotebookLM. ${failedSources.length} sources failed.`);
287 |       }
288 |     } catch (error) {
289 |       console.error("Failed to add sources:", error);
290 |       alert("Failed to add sources to NotebookLM. See console for details.");
291 |     } finally {
292 |       setIsSyncing(false);
293 |     }
294 |   };
295 | 
296 |   return (
297 |     <div className="app-container">
298 |       {/* Header */}
299 |       <div className="header">
300 |         <div className="logo-container">
301 |           <img src="/icons/athena48.ico" alt="Athena Logo" className="logo" />
302 |           <h1>ATHENA</h1>
303 |         </div>
304 |         <div className="toggle-container">
305 |           <span>Research Mode</span>
306 |           <label className="switch">
307 |             <input
308 |               type="checkbox"
309 |               checked={researchMode}
310 |               onChange={handleToggleResearchMode}
311 |             />
312 |             <span className="slider round"></span>
313 |           </label>
314 |         </div>
315 |       </div>
316 | 
317 |       {/* Notebook Selection */}
318 |       <div className="notebook-section">
319 |         <div className="notebook-header">
320 |           <h2>Notebook</h2>
321 |           <button 
322 |             onClick={handleSyncToNotebookLM}
323 |             disabled={isSyncing || sources.length === 0}
324 |             className="sync-button"
325 |           >
326 |             {isSyncing ? 'Syncing...' : 'Sync to NotebookLM'}
327 |           </button>
328 |         </div>
329 |         {isCreatingNotebook ? (
330 |           <div className="create-notebook">
331 |             <input
332 |               type="text"
333 |               value={newNotebookName}
334 |               onChange={(e) => setNewNotebookName(e.target.value)}
335 |               placeholder="Enter notebook name"
336 |             />
337 |             <div className="button-group">
338 |               <button onClick={handleCreateNotebook}>Create</button>
339 |               <button onClick={() => setIsCreatingNotebook(false)}>Cancel</button>
340 |             </div>
341 |           </div>
342 |         ) : (
343 |           <select
344 |             value={currentNotebook || ''}
345 |             onChange={handleNotebookChange}
346 |             className="notebook-select"
347 |           >
348 |             <option value="" disabled>
349 |               Select an option
350 |             </option>
351 |             {Object.keys(notebooks).map((name) => (
352 |               <option key={name} value={name}>
353 |                 {name}
354 |               </option>
355 |             ))}
356 |             <option value="create_new">Create New Notebook</option>
357 |           </select>
358 |         )}
359 |       </div>
360 | 
361 |       {/* Add Current Tab Button */}
362 |       <div className="add-source-section">
363 |         <button 
364 |           className="add-current-tab-button" 
365 |           onClick={handleAddCurrentTab}
366 |           disabled={!currentNotebook || isAddingSource}
367 |         >
368 |           {isAddingSource ? 'Adding...' : '+ Add Current Tab to Notebook'}
369 |         </button>
370 |       </div>
371 | 
372 |       {/* Included Sources */}
373 |       <div className="sources-section">
374 |         <h2>
375 |           Included Sources
376 |           <span className="sources-count">{sources.length > 0 ? `(${sources.length})` : ''}</span>
377 |         </h2>
378 |         <ul className="source-list">
379 |           {sources.length > 0 ? (
380 |             sources.map(([id, source]) => (
381 |               <li key={id} className="source-item">
382 |                 <div 
383 |                   className="source-info clickable"
384 |                   onClick={() => handleOpenSource(source.url)}
385 |                   title="Click to open in new tab"
386 |                 >
387 |                   <span className="source-title">{source.title}</span>
388 |                   <span className="source-url">{source.url}</span>
389 |                 </div>
390 |                 <div className="source-actions">
391 |                   <span
392 |                     className="delete-button"
393 |                     onClick={() => handleDeleteSource(id)}
394 |                   >
395 |                     ×
396 |                   </span>
397 |                   <span className="checkmark">✓</span>
398 |                 </div>
399 |               </li>
400 |             ))
401 |           ) : (
402 |             <li className="no-sources">
403 |               {currentNotebook
404 |                 ? "No sources added yet. Click 'Add Current Tab to Notebook' to add sources."
405 |                 : "Please select or create a notebook first."}
406 |             </li>
407 |           )}
408 |         </ul>
409 |       </div>
410 | 
411 |       {/* Version Info */}
412 |       <div className="version-info">
413 |         <span>v1.0.0-beta.45</span>
414 |       </div>
415 | 
416 |       {/* Add to NotebookLM Button */}
417 |       <div className="add-to-notebooklm-section">
418 |         <button 
419 |           onClick={handleAddSource}
420 |           disabled={isSyncing || sources.length === 0}
421 |           className="add-button"
422 |         >
423 |           {isSyncing ? 'Adding to NotebookLM...' : 'Add Website Sources to NotebookLM'}
424 |         </button>
425 |         <p className="help-text">Adds website links from your notebook to NotebookLM (skips Google Docs, Slides, YouTube)</p>
426 |       </div>
427 |     </div>
428 |   )
429 | }
430 | 
431 | export default App
432 | 
<environment_details>
# VSCode Visible Files
vite.config.ts

# VSCode Open Tabs
project-management/tasklist.md,project-management/images/main-dash.png,project-management/phase3_plan.md,src/background.js,src/App2.tsx,vite.config.ts,project-management/cline_docs.md

# Current Time
3/31/2025, 10:23:14 AM (Asia/Taipei, UTC+8:00)

# Current Context Size (Tokens)
24,088 (2%)

# Current Cost
$0.00

# Current Mode
<slug>architect</slug>
<name>Architect</name>
</environment_details>

---

**Assistant:**

Okay, analyzing `src/App.tsx` reveals several key points relevant to the refactoring:

1.  **Direct Storage Access:** The component directly reads from `chrome.storage.local` on mount and listens for changes using `chrome.storage.onChanged` to update its state (lines 34-59). This creates a tight coupling between the UI and the storage implementation details.
2.  **Mixed Communication:** It uses `chrome.runtime.sendMessage` for some actions (toggling research mode, managing notebooks/sources locally) but then directly imports and uses a `NotebookLMService` for syncing/adding sources to the external NotebookLM service (lines 3, 31, 182-204, 206-294). This bypasses the background script for a significant part of the core logic, leading to inconsistency.
3.  **UI-Bound Logic:** Logic for sorting sources (lines 62-73) and determining source types for syncing (lines 227-239) is handled within the UI component.
4.  **Local Type Definitions:** Interfaces like `Source`, `NotebookData`, `Notebooks` are defined locally (lines 7-20).

This confirms the need to:

*   **Centralize Data Flow:** All interactions with storage and external services (like NotebookLM) should be routed through the background script and the new API layer. The UI should communicate solely via messages.
*   **Decouple UI:** Remove direct storage access and the `NotebookLMService` import from the UI component. The UI should only be responsible for presenting data received via messages and sending action messages to the background.
*   **Move Logic:** Business logic (like sorting, type checking for sync) should ideally live closer to the data source (in the API layer or background script) or be handled by a dedicated state management solution (like Zustand) within the UI layer if purely presentational.
*   **Share Types:** Move interfaces to a common `types` file.

The presence of `src/services/notebookLM/basicService.ts` being used directly by the UI is a key area to address. Let's examine that service file next.

```tool_code
<read_file>
<path>src/services/notebookLM/basicService.ts</path>
<auto_truncate>true</auto_truncate>
</read_file>
```

---

**User:**

[read_file for 'src/services/notebookLM/basicService.ts'] Result:
  1 | /// <reference types="chrome"/>
  2 | import { safeExecuteScript } from './utils';
  3 | 
  4 | export interface Source {
  5 |   url: string;
  6 |   title?: string;
  7 | }
  8 | 
  9 | export type SourceType = 'website' | 'youtube' | 'googledocs' | 'googleslides' | 'pdf';
 10 | 
 11 | export class NotebookLMService {
 12 |   // Determine the source type based on URL
 13 |   private getSourceType(url: string): SourceType {
 14 |     const lowerUrl = url.toLowerCase();
 15 |     
 16 |     if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
 17 |       return 'youtube';
 18 |     } else if (lowerUrl.includes('docs.google.com/document')) {
 19 |       return 'googledocs';
 20 |     } else if (lowerUrl.includes('docs.google.com/presentation')) {
 21 |       return 'googleslides';
 22 |     } else if (lowerUrl.endsWith('.pdf')) {
 23 |       return 'pdf';
 24 |     } else {
 25 |       // Default to website for all other URLs
 26 |       return 'website';
 27 |     }
 28 |   }
 29 | 
 30 |   private async addSourceToTab(tabId: number, url: string): Promise<void> {
 31 |     try {
 32 |       const sourceType = this.getSourceType(url);
 33 |       console.log(`Adding ${sourceType} source:`, url);
 34 |       
 35 |       // Step 1: Click the Add source button
 36 |       await safeExecuteScript<boolean>(tabId, () => {
 37 |         console.log("Looking for Add source button...");
 38 |         const addSourceSelectors = [
 39 |           'button[aria-label="Add source"]',
 40 |           'button:not([disabled])',
 41 |           '.add-source-button',
 42 |           'button.mat-mdc-button-base'
 43 |         ];
 44 |         
 45 |         let addButton = null;
 46 |         for (const selector of addSourceSelectors) {
 47 |           const elements = document.querySelectorAll(selector);
 48 |           console.log(`Found ${elements.length} elements for selector: ${selector}`);
 49 |           
 50 |           for (const element of elements) {
 51 |             // Check the button text
 52 |             const buttonText = element.textContent?.toLowerCase() || "";
 53 |             console.log(`Checking element with text: "${buttonText}"`);
 54 |             
 55 |             if (buttonText.includes("add source")) {
 56 |               addButton = element;
 57 |               break;
 58 |             }
 59 |           }
 60 |           if (addButton) break;
 61 |         }
 62 |         
 63 |         if (!addButton) {
 64 |           console.error("Could not find Add source button");
 65 |           return false;
 66 |         }
 67 |         
 68 |         console.log("Found Add source button, clicking...");
 69 |         (addButton as HTMLElement).click();
 70 |         return true;
 71 |       });
 72 |       
 73 |       // Wait for the source dialog to appear
 74 |       await new Promise(resolve => setTimeout(resolve, 1500));
 75 |       
 76 |       // Step 2: Click the appropriate source type button and enter URL
 77 |       await safeExecuteScript<boolean>(tabId, (sourceUrl: string, type: string) => {
 78 |         console.log(`Looking for ${type} button...`);
 79 |         
 80 |         // Button identifiers for each source type
 81 |         const buttonIdentifiers = {
 82 |           'website': {
 83 |             label: 'Website',
 84 |             icon: 'web',
 85 |             className: 'website'
 86 |           },
 87 |           'youtube': {
 88 |             label: 'YouTube',
 89 |             icon: 'smart_display',
 90 |             className: 'youtube'
 91 |           },
 92 |           'googledocs': {
 93 |             label: 'Google Docs',
 94 |             icon: 'description',
 95 |             className: 'google-docs'
 96 |           },
 97 |           'googleslides': {
 98 |             label: 'Google Slides',
 99 |             icon: 'slideshow',
100 |             className: 'google-slides'
101 |           }
102 |         };
103 |         
104 |         const targetInfo = buttonIdentifiers[type as keyof typeof buttonIdentifiers] || buttonIdentifiers.website;
105 |         
106 |         // Find all mat-chips, buttons and clickable elements
107 |         const allElements = document.querySelectorAll('mat-chip, button, [role="button"], .mat-mdc-chip, .mdc-evolution-chip');
108 |         console.log(`Found ${allElements.length} potential clickable elements`);
109 |         
110 |         // Find the target button by examining text content
111 |         let targetButton = null;
112 |         
113 |         // First attempt: Look for exact match with the target label
114 |         for (const element of allElements) {
115 |           const text = element.textContent?.toLowerCase() || "";
116 |           console.log(`Element text: "${text}"`);
117 |           
118 |           // Check if text content matches our target (either exact or contains)
119 |           if (text === targetInfo.label.toLowerCase() || 
120 |               text.includes(targetInfo.label.toLowerCase())) {
121 |             console.log(`Found matching button for ${targetInfo.label}`);
122 |             targetButton = element;
123 |             break;
124 |           }
125 |         }
126 |         
127 |         // Second attempt: Check for partial text matches if exact didn't work
128 |         if (!targetButton) {
129 |           console.log(`No exact match found, looking for partial matches for ${type}`);
130 |           
131 |           // For Google Docs/Slides, try just looking for "Google"
132 |           if (type === 'googledocs' || type === 'googleslides') {
133 |             for (const element of allElements) {
134 |               const text = element.textContent?.toLowerCase() || "";
135 |               if (text.includes("google")) {
136 |                 if ((type === 'googledocs' && text.includes("doc")) || 
137 |                     (type === 'googleslides' && (text.includes("slide") || text.includes("presentation")))) {
138 |                   console.log(`Found ${type} button with partial match: ${text}`);
139 |                   targetButton = element;
140 |                   break;
141 |                 }
142 |               }
143 |             }
144 |           } 
145 |           
146 |           // For YouTube, try looking for just "tube" or "video"
147 |           if (type === 'youtube' && !targetButton) {
148 |             for (const element of allElements) {
149 |               const text = element.textContent?.toLowerCase() || "";
150 |               if (text.includes("video_youtubeyoutube")) {
151 |                 console.log(`Found YouTube button with partial match: ${text}`);
152 |                 targetButton = element;
153 |                 break;
154 |               }
155 |             }
156 |           }
157 |           
158 |           // For Website, try looking for "web" or "site"
159 |           if (type === 'website' && !targetButton) {
160 |             for (const element of allElements) {
161 |               const text = element.textContent?.toLowerCase() || "";
162 |               if (text.includes("webwebsite")) {
163 |                 console.log(`Found Website button with partial match: ${text}`);
164 |                 targetButton = element;
165 |                 break;
166 |               }
167 |             }
168 |           }
169 |         }
170 |         
171 |         // Last resort: Look for anything that might be a source type chip
172 |         if (!targetButton) {
173 |           console.log("Using last resort method to find source type options");
174 |           
175 |           // Look for horizontal list items that look like chips
176 |           const chipContainers = document.querySelectorAll('.mat-mdc-chip-set, mat-chip-set, .mat-chip-list, .mat-chip-grid');
177 |           
178 |           for (const container of chipContainers) {
179 |             const chips = container.querySelectorAll('mat-chip, .mat-mdc-chip, .mdc-evolution-chip, button');
180 |             console.log(`Found ${chips.length} chips in container`);
181 |             
182 |             if (chips.length > 0) {
183 |               // Depending on the type, try to find the right chip
184 |               for (const chip of chips) {
185 |                 const chipText = chip.textContent?.toLowerCase() || "";
186 |                 
187 |                 if ((type === 'website' && (chipText.includes('web') || chipText.includes('site') || chipText.includes('link'))) ||
188 |                     (type === 'youtube' && (chipText.includes('tube') || chipText.includes('video'))) ||
189 |                     (type === 'googledocs' && (chipText.includes('doc'))) ||
190 |                     (type === 'googleslides' && (chipText.includes('slide')))) {
191 |                   console.log(`Found chip that might be ${type}: ${chipText}`);
192 |                   targetButton = chip;
193 |                   break;
194 |                 }
195 |               }
196 |             }
197 |             
198 |             if (targetButton) break;
199 |           }
200 |         }
201 |         
202 |         // Absolute last resort: Just click the first chip/button we find
203 |         if (!targetButton) {
204 |           console.error(`Could not find button for ${type}, trying first button in source options`);
205 |           
206 |           const firstOption = document.querySelector('mat-chip, .mat-mdc-chip, button.mat-mdc-button-base');
207 |           if (firstOption) {
208 |             console.log(`Clicking first source option as fallback: ${firstOption.textContent}`);
209 |             targetButton = firstOption;
210 |           } else {
211 |             console.error("Could not find any source type options");
212 |             return false;
213 |           }
214 |         }
215 |         
216 |         // Click the found button
217 |         console.log(`Clicking button for ${type}`);
218 |         (targetButton as HTMLElement).click();
219 |         
220 |         // Find and fill URL input after a short delay
221 |         return new Promise<boolean>((resolve) => {
222 |           setTimeout(() => {
223 |             // URL input fields
224 |             const urlSelectors = [
225 |               'input[type="url"]',
226 |               'input[placeholder*="url" i]',
227 |               'input[placeholder*="link" i]',
228 |               'input.mat-mdc-input-element',
229 |               'textarea.mat-mdc-input-element',
230 |               'input:not([type="hidden"])',
231 |               'textarea'
232 |             ];
233 |             
234 |             let urlInput = null;
235 |             for (const selector of urlSelectors) {
236 |               const inputs = document.querySelectorAll(selector);
237 |               console.log(`Found ${inputs.length} inputs with selector: ${selector}`);
238 |               
239 |               for (const input of inputs) {
240 |                 // Check if it's visible
241 |                 const style = window.getComputedStyle(input);
242 |                 if (style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0') {
243 |                   console.log(`Found visible input: ${input.outerHTML}`);
244 |                   urlInput = input;
245 |                   break;
246 |                 }
247 |               }
248 |               
249 |               if (urlInput) break;
250 |             }
251 |             
252 |             if (!urlInput) {
253 |               console.error("Could not find URL input");
254 |               resolve(false);
255 |               return;
256 |             }
257 |             
258 |             console.log("Found URL input, entering URL:", sourceUrl);
259 |             (urlInput as HTMLInputElement | HTMLTextAreaElement).value = sourceUrl;
260 |             (urlInput as HTMLInputElement | HTMLTextAreaElement).dispatchEvent(new Event('input', { bubbles: true }));
261 |             (urlInput as HTMLInputElement | HTMLTextAreaElement).dispatchEvent(new Event('change', { bubbles: true }));
262 |             
263 |             // Click Insert button
264 |             setTimeout(() => {
265 |               // Look for insert/add/continue buttons
266 |               const buttonSelectors = [
267 |                 'button:not([disabled])',
268 |                 '.mat-mdc-button-base:not([disabled])',
269 |                 '.mdc-button:not([disabled])',
270 |                 'button.mat-button',
271 |                 'button.mat-flat-button',
272 |                 'button.mat-raised-button'
273 |               ];
274 |               
275 |               let actionButton = null;
276 |               for (const selector of buttonSelectors) {
277 |                 const buttons = document.querySelectorAll(selector);
278 |                 console.log(`Found ${buttons.length} buttons with selector: ${selector}`);
279 |                 
280 |                 for (const button of buttons) {
281 |                   const buttonText = button.textContent?.toLowerCase() || "";
282 |                   if (buttonText.includes('insert')) {
283 |                     console.log(`Found button with text: ${buttonText}`);
284 |                     actionButton = button;
285 |                     break;
286 |                   }
287 |                 }
288 |                 
289 |                 if (actionButton) break;
290 |               }
291 |               
292 |               if (!actionButton) {
293 |                 console.error("Could not find Insert/Add button");
294 |                 resolve(false);
295 |                 return;
296 |               }
297 |               
298 |               console.log("Clicking Insert/Add button");
299 |               (actionButton as HTMLElement).click();
300 |               resolve(true);
301 |             }, 500);
302 |           }, 1000);
303 |         });
304 |       }, url, sourceType);
305 |       
306 |       // Wait a bit longer after adding source
307 |       await new Promise(resolve => setTimeout(resolve, 2000));
308 |       
309 |     } catch (error) {
310 |       console.error("Error adding source:", error);
311 |       throw error;
312 |     }
313 |   }
314 | 
315 |   public async addSource(source: Source): Promise<void> {
316 |     try {
317 |       console.log("Adding source:", source);
318 |       // Get the active tab since we expect NotebookLM to be open
319 |       const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
320 |       if (!tab.id) {
321 |         throw new Error("No active tab found");
322 |       }
323 |       await this.addSourceToTab(tab.id, source.url);
324 |       console.log("Successfully added source to NotebookLM");
325 |     } catch (error) {
326 |       console.error("Error adding source to NotebookLM:", error);
327 |       throw error;
328 |     }
329 |   }
330 | }
<environment_details>
# VSCode Visible Files
vite.config.ts

# VSCode Open Tabs
project-management/tasklist.md,project-management/images/main-dash.png,project-management/phase3_plan.md,src/background.js,src/App2.tsx,vite.config.ts,project-management/cline_docs.md

# Current Time
3/31/2025, 10:23:45 AM (Asia/Taipei, UTC+8:00)

# Current Context Size (Tokens)
30,105 (3%)

# Current Cost
$0.00

# Current Mode
<slug>architect</slug>
<name>Architect</name>
</environment_details>

---

**Assistant:**

Okay, the analysis of `src/services/notebookLM/basicService.ts` completes the information gathering phase. It clearly shows complex, UI-dependent logic (interacting with NotebookLM's DOM via scripting) being called directly from the React UI (`App.tsx`). This is a prime example of the architectural issues we need to address.

Based on the analysis of `background.js`, `contentScript.js`, `App.tsx`, and `basicService.ts`, here is the proposed refactoring plan:

**Phase 2: Proposed Structure & Plan**

**1. Proposed Directory Structure:**

```
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
```

**Mermaid Diagram of Proposed Structure & Data Flow:**

```mermaid
graph LR
    subgraph User Interface (Popup)
        direction LR
        UI_Main[main.tsx] --> UI_Page[pages/Popup.tsx]
        UI_Page --> UI_Comp[components/*]
        UI_Page --> UI_Hook[hooks/useMessaging]
        UI_Hook -- Sends Action Messages --> BG_MsgRouter
    end

    subgraph Background Script
        direction TB
        BG_MsgRouter{background.ts<br/>(Message Router)} -- Calls API Actions --> API_Actions
        BG_MsgRouter -- Listens --> Chrome_Events[chrome.* Events<br/>(tabs.onUpdated, etc.)]
        Chrome_Events -- Triggers --> BG_MsgRouter
    end

    subgraph API Layer
        direction TB
        API_Actions[actions/*<br/>(notebookStore, notebookLM, floatingButton)] -- Uses --> API_Chrome[chrome/*<br/>(Wrappers)]
        API_Actions -- Uses --> API_Utils[utils/*]
        API_Chrome -- Interacts --> ChromeAPI[Chrome Extension APIs<br/>(storage, scripting, tabs)]
        API_Actions -- Calls --> CS_MsgRouter[Content Script Messaging]
    end

    subgraph Content Script
        direction LR
        CS_Script[contentScript.ts] -- Injects/Manages --> DOM_Button[Floating Button (DOM)]
        CS_Script -- Listens/Sends --> CS_MsgRouter{Message Handling}
        DOM_Button -- User Interaction --> CS_Script
    end

    BG_MsgRouter -- Sends Control Messages --> CS_MsgRouter
    CS_MsgRouter -- Sends Action Messages --> BG_MsgRouter

    style User Interface fill:#f9f,stroke:#333,stroke-width:2px
    style Background Script fill:#ccf,stroke:#333,stroke-width:2px
    style API Layer fill:#cfc,stroke:#333,stroke-width:2px
    style Content Script fill:#ffc,stroke:#333,stroke-width:2px
```

**2. Outline of Refactoring Steps:**

1.  **Setup New Structure:** Create the new directories (`api`, `background`, `content`, `ui`, `common`). Move existing files (`App.tsx`, `main.tsx`, `App.css`, `index.css`) into `src/ui/`. Move `background.js` to `src/background/background.ts` (rename). Move `contentScript.js` to `src/content/contentScript.ts` (rename). Move `basicService.ts` and its utils to `src/api/actions/notebookLM.ts` and `src/api/utils/` respectively.
2.  **Define Common Types:** Create `src/common/types.ts` and move/consolidate interfaces (`Source`, `Notebook`, etc.) there. Update imports across the codebase.
3.  **Refactor Background Script (`src/background/background.ts`):**
    *   Convert to TypeScript.
    *   Remove all direct DOM manipulation logic (`injectFloatingButton`, `removeFloatingButton` function bodies).
    *   Remove direct storage manipulation logic (notebook/source CRUD).
    *   Remove NotebookLM interaction logic (`ensureNotebookLMTab`, `scanNotebookLMNotebooks`, `syncNotebookData`, etc.).
    *   Implement a central message listener (`chrome.runtime.onMessage.addListener`).
    *   This listener will act as a router:
        *   Receive messages (e.g., `ADD_SOURCE`, `GET_NOTEBOOKS`, `TOGGLE_RESEARCH_MODE`, `SYNC_NOTEBOOKLM`).
        *   Import and call corresponding functions from `src/api/actions/*`.
        *   Handle responses/errors from API actions and send them back to the caller (UI or content script).
    *   Handle `chrome.tabs.onUpdated`, `chrome.runtime.onInstalled` listeners to potentially trigger actions (like checking if the button should be shown via `floatingButton.ts`).
4.  **Create API Layer (`src/api/`):**
    *   **`chrome/`:** Create thin, promise-based wrappers around necessary `chrome.*` APIs (e.g., `chrome.storage.local.get`, `chrome.tabs.query`, `chrome.scripting.executeScript`). This promotes consistency and testability.
    *   **`actions/notebookStore.ts`:** Move all logic for creating, reading, updating, deleting notebooks and sources from `background.js` into this module. Use the `chrome/storage.ts` wrapper.
    *   **`actions/notebookLM.ts`:** Move the logic from `basicService.ts` here. Refine it to use the `chrome/scripting.ts` and `chrome/tabs.ts` wrappers. Clearly document the fragility of DOM selectors.
    *   **`actions/floatingButton.ts`:** Add functions like `shouldShowButton(tabId, url)` (checking storage, URL validity) and potentially `updateButtonState(tabId, state)` which would send messages to the content script.
    *   **`utils/`:** Move helper functions like `normalizeYouTubeUrl`, `safeExecuteScript`. Consider centralizing NotebookLM DOM selectors here.
5.  **Refactor Content Script (`src/content/contentScript.ts`):**
    *   Convert to TypeScript.
    *   Remove duplicate button creation/styling logic. Implement it *once* here.
    *   Remove direct storage access (`chrome.storage.local.get`, `chrome.storage.onChanged`).
    *   Implement message listeners (`chrome.runtime.onMessage.addListener`) to react to commands from the background (e.g., `{ action: 'SHOW_BUTTON' }`, `{ action: 'HIDE_BUTTON' }`, `{ action: 'UPDATE_BUTTON_STATE', isSaved: true }`).
    *   Keep the button's event listeners (click, drag).
    *   On button click, send a single message to the background: `{ action: 'ADD_SOURCE_FROM_BUTTON', url: ..., title: ... }`. The background will handle adding it via `notebookStore.ts`.
    *   Move inline styles to `src/content/content.css` and ensure it's loaded via `manifest.json`.
    *   Keep the toast notification logic or consider a more robust UI injection method if needed.
6.  **Refactor UI (`src/ui/`):**
    *   Remove direct `chrome.storage` access and listeners.
    *   Remove the import and usage of `NotebookLMService`.
    *   Implement a messaging hook (`hooks/useMessaging.ts`) or utility to handle sending messages to the background script (`chrome.runtime.sendMessage`) and receiving responses/updates.
    *   Fetch initial data (notebooks, current notebook, research mode) by sending a message (e.g., `{ action: 'GET_INITIAL_DATA' }`) on mount.
    *   Listen for updates pushed from the background script (e.g., when storage changes after an action). This might involve the background script sending messages to *all* relevant UI instances (like the popup).
    *   All user actions (creating notebook, selecting notebook, deleting source, toggling research mode, initiating sync) will trigger sending specific messages to the background script.
7.  **Update Manifest (`manifest.json`):**
    *   Change `background.scripts` to `background.service_worker` pointing to the *built* background script (e.g., `dist/background/background.js`).
    *   Update `content_scripts` to point to the *built* content script (e.g., `dist/content/contentScript.js`) and include `dist/content/content.css`.
    *   Ensure necessary permissions (`storage`, `scripting`, `tabs`, `activeTab`, host permissions for `notebooklm.google.com`) are present.
8.  **Update Build Process (`vite.config.ts`):**
    *   Configure Vite to handle multiple entry points: the UI (`src/ui/main.tsx`), the background script (`src/background/background.ts`), and the content script (`src/content/contentScript.ts`).
    *   Ensure correct output paths matching the `manifest.json`.
    *   Configure asset handling (icons, CSS).
9.  **ESLint & TypeScript:** Ensure configuration (`eslint.config.js`, `tsconfig.json`) works with the new structure and enforce coding standards. Run ESLint checks frequently during refactoring.
10. **Project Management Docs:** Update `tasklist.md`, `featurelist.md`, `context.md` to reflect the new architecture and the completion of this refactoring task, following your specified process.

**3. Communication Protocol:**

*   **UI -> Background:** Send messages via `chrome.runtime.sendMessage` with a clear `action` property and necessary payload (e.g., `{ action: 'CREATE_NOTEBOOK', name: '...' }`). Expect a response via the callback indicating success/failure.
*   **Content -> Background:** Send messages via `chrome.runtime.sendMessage` for user-initiated actions from injected elements (e.g., `{ action: 'ADD_SOURCE_FROM_BUTTON', url: '...', title: '...' }`).
*   **Background -> Content:** Send messages via `chrome.tabs.sendMessage(tabId, message)` to control injected UI elements (e.g., `{ action: 'SHOW_BUTTON' }`, `{ action: 'UPDATE_BUTTON_STATE', isSaved: true }`).
*   **Background -> UI:** For real-time updates (e.g., storage changes), the background script might need to query open extension views (like the popup) and send messages directly using `chrome.runtime.sendMessage`. Alternatively, the UI can re-fetch data when it becomes visible or rely on listening to `chrome.storage.onChanged` *if* absolutely necessary, but ideally, updates are pushed or pulled via explicit messages.

**4. Obfuscation:**

By moving the core logic (especially the complex NotebookLM interactions and storage management) from plain JavaScript files (`background.js`, `contentScript.js`) into compiled TypeScript modules within the `src/api/` directory, the code becomes inherently less transparent. The build process (Vite) will bundle and potentially minify/mangle this code, making it harder to read and understand directly from the installed extension's files compared to the original structure. While not true obfuscation in a security sense, it achieves the goal of hiding the implementation details from casual inspection.

**Phase 3: Review and Execution**

This detailed plan outlines the proposed structure, steps, and rationale.

*   Does this plan align with your vision for the refactoring?
*   Are there any specific parts of the proposed structure or steps you'd like to adjust or discuss further?
*   Do the proposed communication methods make sense?

Once you're satisfied with the plan, I can optionally write this to a markdown file for your records, and then we can request to switch to "Code" mode to begin the implementation.

---

**User:**

[ERROR] You did not use a tool in your previous response! Please retry with a tool use.

# Reminder: Instructions for Tool Use

Tool uses are formatted using XML-style tags. The tool name is enclosed in opening and closing tags, and each parameter is similarly enclosed within its own set of tags. Here's the structure:

<tool_name>
<parameter1_name>value1</parameter1_name>
<parameter2_name>value2</parameter2_name>
...
</tool_name>

For example:

<attempt_completion>
<result>
I have completed the task...
</result>
</attempt_completion>

Always adhere to this format for all tool uses to ensure proper parsing and execution.

# Next Steps

If you have completed the user's task, use the attempt_completion tool. 
If you require additional information from the user, use the ask_followup_question tool. 
Otherwise, if you have not completed the task and do not need additional information, then proceed with the next step of the task. 
(This is an automated message, so do not respond to it conversationally.)
<environment_details>
# VSCode Visible Files
vite.config.ts

# VSCode Open Tabs
project-management/tasklist.md,project-management/images/main-dash.png,project-management/phase3_plan.md,src/background.js,src/App2.tsx,vite.config.ts,project-management/cline_docs.md

# Current Time
3/31/2025, 10:24:37 AM (Asia/Taipei, UTC+8:00)

# Current Context Size (Tokens)
37,745 (4%)

# Current Cost
$0.00

# Current Mode
<slug>architect</slug>
<name>Architect</name>
</environment_details>

---

**Assistant:**

You are absolutely right! My apologies, I got carried away explaining the plan and forgot the required tool use for this mode.

Here is the proposed refactoring plan again for clarity:

**1. Proposed Directory Structure:**

```
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
```

**2. Mermaid Diagram of Proposed Structure & Data Flow:**

```mermaid
graph LR
    subgraph User Interface (Popup)
        direction LR
        UI_Main[main.tsx] --> UI_Page[pages/Popup.tsx]
        UI_Page --> UI_Comp[components/*]
        UI_Page --> UI_Hook[hooks/useMessaging]
        UI_Hook -- Sends Action Messages --> BG_MsgRouter
    end

    subgraph Background Script
        direction TB
        BG_MsgRouter{background.ts<br/>(Message Router)} -- Calls API Actions --> API_Actions
        BG_MsgRouter -- Listens --> Chrome_Events[chrome.* Events<br/>(tabs.onUpdated, etc.)]
        Chrome_Events -- Triggers --> BG_MsgRouter
    end

    subgraph API Layer
        direction TB
        API_Actions[actions/*<br/>(notebookStore, notebookLM, floatingButton)] -- Uses --> API_Chrome[chrome/*<br/>(Wrappers)]
        API_Actions -- Uses --> API_Utils[utils/*]
        API_Chrome -- Interacts --> ChromeAPI[Chrome Extension APIs<br/>(storage, scripting, tabs)]
        API_Actions -- Calls --> CS_MsgRouter[Content Script Messaging]
    end

    subgraph Content Script
        direction LR
        CS_Script[contentScript.ts] -- Injects/Manages --> DOM_Button[Floating Button (DOM)]
        CS_Script -- Listens/Sends --> CS_MsgRouter{Message Handling}
        DOM_Button -- User Interaction --> CS_Script
    end

    BG_MsgRouter -- Sends Control Messages --> CS_MsgRouter
    CS_MsgRouter -- Sends Action Messages --> BG_MsgRouter

    style User Interface fill:#f9f,stroke:#333,stroke-width:2px
    style Background Script fill:#ccf,stroke:#333,stroke-width:2px
    style API Layer fill:#cfc,stroke:#333,stroke-width:2px
    style Content Script fill:#ffc,stroke:#333,stroke-width:2px
```

**3. Key Refactoring Steps:**
*   Create the new directory structure.
*   Centralize type definitions in `src/common/types.ts`.
*   Refactor `background.ts` to be a message router, delegating logic to API actions.
*   Build the `src/api/` layer with Chrome wrappers and action modules (moving logic from background, content script, and `basicService.ts`).
*   Refactor `contentScript.ts` to handle only button DOM/events and communicate via messages.
*   Refactor `src/ui/` components to remove direct Chrome API/service usage and communicate solely via messages.
*   Update `manifest.json` and `vite.config.ts` for new entry points and structure.
*   Ensure ESLint/TypeScript compliance.
*   Update project management documents.





