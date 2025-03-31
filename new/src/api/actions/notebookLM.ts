/// <reference types="chrome"/>
/// <reference lib="dom" />

import { Notebooks, Notebook, Source, SourceType, NotebookLMServiceSource } from '../../common/types.ts';
import { executeScript } from '../chrome/scripting.ts';
import { queryTabs, createTab, getTab, updateTab } from '../chrome/tabs.ts';
import { getLocalStorage, setLocalStorage } from '../chrome/storage.ts';
import { getNotebooks, getCurrentNotebookName, updateSourceSyncStatus } from './notebookStore.ts';
import { normalizeUrlForComparison } from '../utils/utils.ts'; // Assuming this exists now
import { waitForTabLoad } from '../utils/utils.ts'; // Assuming this will be added

const NOTEBOOKLM_URL_PATTERN = "https://notebooklm.google.com/*";
const NOTEBOOKLM_BASE_URL = "https://notebooklm.google.com/";
const NOTEBOOKS_KEY = 'notebooks'; // From notebookStore, maybe centralize constants?

// --- Helper Functions ---

/**
 * Simple delay function.
 * @param ms Milliseconds to wait.
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Determines the source type based on URL.
 * (Migrated from basicService.ts)
 */
function getSourceType(url: string): SourceType {
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) return 'youtube';
    if (lowerUrl.includes('docs.google.com/document')) return 'googledocs';
    if (lowerUrl.includes('docs.google.com/presentation')) return 'googleslides';
    if (lowerUrl.endsWith('.pdf')) return 'pdf';
    return 'website'; // Default
}

// --- Core NotebookLM Interaction Logic ---

/**
 * Ensures a NotebookLM tab is open and ready.
 * If not open, creates one. If open, ensures it's loaded.
 * @returns The ID of the ready NotebookLM tab.
 * @throws If unable to create or find a usable tab.
 */
export async function ensureNotebookLMTab(): Promise<number> {
  console.log('Ensuring NotebookLM tab exists and is ready...');
  try {
    const tabs = await queryTabs({ url: NOTEBOOKLM_URL_PATTERN });

    if (tabs.length > 0 && tabs[0].id) {
      const tabId = tabs[0].id;
      console.log(`Found existing NotebookLM tab: ${tabId}. Checking status...`);
      // Ensure the tab is loaded
      await waitForTabLoad(tabId);
      console.log(`Tab ${tabId} is ready.`);
      // Optionally bring tab to front?
      // await updateTab(tabId, { active: true });
      return tabId;
    } else {
      console.log('No NotebookLM tab found, creating a new one...');
      const newTab = await createTab({ url: NOTEBOOKLM_BASE_URL, active: false }); // Create inactive
      if (!newTab.id) {
        throw new Error("Failed to create NotebookLM tab: No ID returned.");
      }
      console.log(`Created new NotebookLM tab: ${newTab.id}. Waiting for load...`);
      await waitForTabLoad(newTab.id);
      console.log(`New tab ${newTab.id} is ready.`);
      return newTab.id;
    }
  } catch (error) {
    console.error('Error ensuring NotebookLM tab:', error);
    throw new Error(`Failed to ensure NotebookLM tab is ready: ${error instanceof Error ? error.message : String(error)}`);
  }
}


// --- Scripting Functions (to be injected) ---

/**
 * INJECTED FUNCTION: Clicks the 'Add source' button in NotebookLM.
 * Contains multiple selectors as fallbacks.
 */
function clickAddSourceButton(): boolean {
    console.log("Looking for Add source button...");
    const addSourceSelectors = [
        'button[aria-label="Add source"]', // Primary target
        'button:not([disabled])', // General enabled button
        '.add-source-button', // Potential custom class
        'button.mat-mdc-button-base' // Material UI button base
    ];
    let addButton: HTMLElement | null = null;
    for (const selector of addSourceSelectors) {
        const elements = document.querySelectorAll<HTMLElement>(selector);
        // Use forEach for NodeListOf compatibility
        elements.forEach(element => {
            if (addButton) return; // Stop iterating if already found
            const buttonText = element.textContent?.trim().toLowerCase() || "";
            // Check text content for more reliability
            if (buttonText.includes("add source")) {
                addButton = element;
            }
        });
        if (addButton) break; // Exit outer loop once found
    }
    if (!addButton) {
        console.error("Could not find Add source button using selectors:", addSourceSelectors);
        return false;
    }
    console.log("Found Add source button, clicking...");
    // Assert type as HTMLElement because TS struggles with inference after forEach
    (addButton as HTMLElement).click();
    return true;
}

/**
 * INJECTED FUNCTION: Clicks the correct source type button (Website, YouTube, etc.)
 * and fills the URL input field.
 */
function clickSourceTypeAndFillUrl(sourceUrl: string, type: SourceType): boolean {
    console.log(`Looking for '${type}' button...`);
    const buttonIdentifiers: { [key in SourceType]?: { label: string } } = {
        'website': { label: 'Website' },
        'youtube': { label: 'YouTube' },
        'googledocs': { label: 'Google Doc' }, // Adjusted label based on potential UI text
        'googleslides': { label: 'Google Slides' },
        'pdf': { label: 'PDF' } // Assuming PDF might be an option
    };
    const targetInfo = buttonIdentifiers[type] || buttonIdentifiers.website!; // Default to website

    // Find potential buttons/chips
    const allElements = document.querySelectorAll<HTMLElement>('mat-chip, button, [role="button"], .mat-mdc-chip, .mdc-evolution-chip');
    let targetButton: HTMLElement | null = null;

    // Try finding by text content (case-insensitive, partial match)
    // Use forEach for NodeListOf compatibility
    allElements.forEach(element => {
        if (targetButton) return; // Stop if already found
        const text = element.textContent?.trim().toLowerCase() || "";
        if (text.includes(targetInfo.label.toLowerCase())) {
            console.log(`Found matching button for ${targetInfo.label}: "${text}"`);
            targetButton = element;
        }
    });

    // Fallback if specific button not found (e.g., maybe UI changed)
    if (!targetButton) {
        console.warn(`Could not find exact button for ${type}. Trying generic selectors or first option.`);
        // Add more robust fallback selectors if needed
        targetButton = document.querySelector('mat-chip, .mat-mdc-chip, button.mat-mdc-button-base'); // Example: click first chip
        if (!targetButton) {
             console.error("Could not find any source type options.");
             return false;
        }
         console.log(`Using fallback button: ${targetButton.textContent}`);
    }

    console.log(`Clicking button for ${type}`);
    targetButton.click();

    // Find and fill URL input (needs delay after click)
    // Using setTimeout within the injected function
    setTimeout(() => {
        const urlSelectors = [
            'input[type="url"]',
            'input[placeholder*="URL" i]', // Case-insensitive placeholder check
            'input[placeholder*="link" i]',
            'textarea[placeholder*="URL" i]', // Also check textareas
            'textarea[placeholder*="link" i]',
            'input.mat-mdc-input-element', // Material UI input
            'textarea.mat-mdc-input-element'
        ];
        let urlInput: HTMLInputElement | HTMLTextAreaElement | null = null;
        for (const selector of urlSelectors) {
            const inputs = document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(selector);
            // Use forEach for NodeListOf compatibility
            inputs.forEach(input => {
                if (urlInput) return; // Stop if already found
                const style = window.getComputedStyle(input);
                if (style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0') {
                    urlInput = input;
                }
            });
            if (urlInput) break; // Exit outer loop once found
        }

        if (!urlInput) {
            console.error("Could not find URL input field.");
            // Cannot resolve promise from setTimeout, rely on subsequent step failing
            return;
        }

        console.log("Found URL input, entering URL:", sourceUrl);
        // Assert type as it might be null if not found, and TS struggles after forEach
        const finalUrlInput = urlInput as (HTMLInputElement | HTMLTextAreaElement);
        finalUrlInput.value = sourceUrl;
        // Dispatch events to simulate user input, required by some frameworks (like Angular)
        finalUrlInput.dispatchEvent(new Event('input', { bubbles: true }));
        finalUrlInput.dispatchEvent(new Event('change', { bubbles: true }));
        finalUrlInput.dispatchEvent(new Event('blur', { bubbles: true })); // Sometimes needed

    }, 500); // Delay to allow dialog/input to appear

    return true; // Indicate click was successful, URL filling happens async
}

/**
 * INJECTED FUNCTION: Clicks the final 'Insert' or 'Add' button.
 */
function clickInsertButton(): boolean {
    console.log("Looking for Insert/Add button...");
    const buttonSelectors = [
        'button:not([disabled])', // General enabled button
        '.mat-mdc-button-base:not([disabled])',
        '.mdc-button:not([disabled])'
    ];
    let actionButton: HTMLElement | null = null;
    for (const selector of buttonSelectors) {
        const buttons = document.querySelectorAll<HTMLElement>(selector);
        // Use forEach for NodeListOf compatibility
        buttons.forEach(button => {
            if (actionButton) return; // Stop if already found
            const buttonText = button.textContent?.trim().toLowerCase() || "";
            // Check for common confirmation texts
            if (buttonText.includes('insert') || buttonText.includes('add') || buttonText.includes('continue')) {
                 console.log(`Found button with text: "${buttonText}"`);
                 actionButton = button;
            }
        });
        if (actionButton) break; // Exit outer loop once found
    }

    if (!actionButton) {
        console.error("Could not find Insert/Add/Continue button.");
        return false;
    }

    console.log("Clicking Insert/Add/Continue button...");
    // Assert type as HTMLElement because TS struggles with inference after forEach
    (actionButton as HTMLElement).click();
    return true;
}


/**
 * Automates adding a single source URL to the currently open NotebookLM tab.
 * Handles clicking 'Add source', selecting type, entering URL, and clicking 'Insert'.
 * (Refactored from basicService.ts)
 * @param tabId The ID of the NotebookLM tab.
 * @param source The source object containing the URL.
 * @throws If any step of the automation fails.
 */
async function addSourceViaScripting(tabId: number, source: NotebookLMServiceSource): Promise<void> {
    const sourceType = getSourceType(source.url);
    console.log(`Adding ${sourceType} source via scripting:`, source.url);

    // Step 1: Click 'Add source' button
    const clickAddResult = await executeScript<[], boolean>({ target: { tabId }, func: clickAddSourceButton });
    if (!clickAddResult?.[0]?.result) throw new Error("Failed to click 'Add source' button.");
    await delay(1000); // Wait for dialog

    // Step 2: Click source type and fill URL
    const clickTypeResult = await executeScript<[string, SourceType], boolean>({
        target: { tabId },
        func: clickSourceTypeAndFillUrl,
        args: [source.url, sourceType]
    });
    if (!clickTypeResult?.[0]?.result) throw new Error(`Failed to click source type '${sourceType}' or find URL input.`);
    await delay(1000); // Wait for URL field to be filled and potentially validated

    // Step 3: Click 'Insert' button
    const clickInsertResult = await executeScript<[], boolean>({ target: { tabId }, func: clickInsertButton });
     if (!clickInsertResult?.[0]?.result) throw new Error("Failed to click 'Insert/Add' button.");
    await delay(2000); // Wait for source processing

    console.log(`Successfully initiated adding source: ${source.url}`);
}


// --- Public API Actions ---

/**
 * Adds sources from a specified local notebook to NotebookLM.
 * @param notebookName The name of the local notebook whose sources should be added.
 * @returns An object summarizing the results (success, skipped, failed).
 */
export async function addSourcesToNotebookLM(notebookName: string): Promise<{ successCount: number; skippedCount: number; failedSources: string[] }> {
    console.log(`Starting process to add sources from notebook "${notebookName}" to NotebookLM.`);
    const notebooks = await getNotebooks();
    const notebook = notebooks[notebookName];

    if (!notebook) {
        throw new Error(`Local notebook "${notebookName}" not found.`);
    }

    const sourcesToAdd = Object.entries(notebook.sources || {})
        // Filter out sources already marked as added, and potentially non-website/youtube types for now
        .filter(([_, source]) => !source.added_to_notebook && (getSourceType(source.url) === 'website' || getSourceType(source.url) === 'youtube'));

    if (sourcesToAdd.length === 0) {
        console.log("No new website or YouTube sources to add to NotebookLM.");
        return { successCount: 0, skippedCount: Object.keys(notebook.sources || {}).length, failedSources: [] };
    }

    console.log(`Found ${sourcesToAdd.length} new sources to add.`);
    const notebookLMTabId = await ensureNotebookLMTab(); // Ensure tab is open and ready

    let successCount = 0;
    let skippedCount = Object.keys(notebook.sources || {}).length - sourcesToAdd.length; // Count pre-filtered sources
    let failedSources: string[] = [];

    for (const [sourceId, source] of sourcesToAdd) {
        try {
            console.log(`Attempting to add source (${successCount + failedSources.length + 1}/${sourcesToAdd.length}): ${source.url}`);
            await addSourceViaScripting(notebookLMTabId, source);
            // Mark as added in local storage on success
            await updateSourceSyncStatus(notebookName, sourceId, true);
            successCount++;
            console.log(`Successfully added source: ${source.url}`);
            await delay(1000); // Small delay between adding sources
        } catch (error: any) {
            console.error(`Failed to add source ${source.url}:`, error);
            failedSources.push(source.url);
            // Optional: Add more robust error handling, maybe retry?
        }
    }

    console.log(`Finished adding sources. Success: ${successCount}, Skipped: ${skippedCount}, Failed: ${failedSources.length}`);
    return { successCount, skippedCount, failedSources };
}


// --- Notebook List Syncing (Placeholder - Requires DOM inspection logic) ---

/**
 * INJECTED FUNCTION: Extracts notebook names and IDs from the NotebookLM main page.
 * IMPORTANT: Selectors are highly dependent on NotebookLM's current DOM structure and WILL break.
 */
function extractNotebookDataFromDOM(): { notebookLM_id: string; notebookLM_title: string }[] {
  console.log('Attempting to extract notebook data from DOM...');
  const notebooks: { notebookLM_id: string; notebookLM_title: string }[] = [];
  // !! Placeholder Selectors - These need careful inspection and updating !!
  const notebookElements = document.querySelectorAll('.notebook-list-item, .notebook-card, a[href*="/notebook/"]'); // Example selectors

  if (!notebookElements || notebookElements.length === 0) {
    console.warn('Could not find notebook elements using common selectors.');
    return notebooks;
  }

  notebookElements.forEach(element => {
    try {
      let notebookId: string | null = null;
      let notebookName: string | null = null;

      // Try extracting ID from href
      if (element instanceof HTMLAnchorElement && element.href) {
          const match = element.href.match(/\/notebook\/([a-zA-Z0-9_-]+)/);
          if (match && match[1]) {
              notebookId = match[1];
          }
      }
      // Try extracting ID from data attribute
      if (!notebookId && element instanceof HTMLElement && element.dataset.notebookId) {
          notebookId = element.dataset.notebookId;
      }
      // Add more ID extraction methods if needed...

      // Try extracting name from common elements within the item
      const nameElement = element.querySelector('.notebook-name, .title, .card-title, h2, h3'); // Example selectors
      if (nameElement) {
          notebookName = nameElement.textContent?.trim() || null;
      }
      // Fallback name extraction
      if (!notebookName) {
          notebookName = element.textContent?.trim().split('\n')[0] || 'Untitled Notebook'; // Basic fallback
      }


      if (notebookId && notebookName) {
        // Basic validation/cleanup
        notebookName = notebookName.replace(/\s+/g, ' ').trim(); // Clean up whitespace
        if (notebookName.length > 100) notebookName = notebookName.substring(0, 97) + '...'; // Truncate long names

        notebooks.push({
          notebookLM_id: notebookId,
          notebookLM_title: notebookName,
        });
      } else {
         console.warn('Could not extract ID or Name for an element:', element);
      }
    } catch (error) {
      console.error('Error processing a notebook element:', element, error);
    }
  });

  console.log(`Extracted ${notebooks.length} potential notebooks:`, notebooks);
  // Deduplicate based on ID before returning
  const uniqueNotebooks = Array.from(new Map(notebooks.map(nb => [nb.notebookLM_id, nb])).values());
  console.log(`Returning ${uniqueNotebooks.length} unique notebooks.`);
  return uniqueNotebooks;
}

/**
 * Scans the NotebookLM tab for the list of notebooks.
 * (Refactored from background.js)
 * @param tabId The ID of the NotebookLM tab.
 * @returns A Promise resolving to an array of found notebooks with their IDs and titles.
 */
async function scanNotebookLMNotebooks(tabId: number): Promise<{ notebookLM_id: string; notebookLM_title: string }[]> {
  console.log(`Scanning for notebooks in tab ID: ${tabId}`);
  try {
    const results = await executeScript<[], { notebookLM_id: string; notebookLM_title: string }[]>({
      target: { tabId: tabId },
      func: extractNotebookDataFromDOM,
      // world: 'MAIN' // Ensure execution in page context if needed
    });

    if (results && results[0] && results[0].result) {
      console.log('Successfully scanned notebooks:', results[0].result);
      return results[0].result;
    } else {
      console.warn('No results received from notebook scanning script or result was empty.');
      return [];
    }
  } catch (error) {
    console.error(`Error executing notebook scanning script in tab ${tabId}:`, error);
    // Re-throw error for the orchestrator function to handle
    throw new Error(`Failed to scan notebooks: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Syncs the scanned list of NotebookLM notebooks with the locally stored notebooks.
 * - Updates titles for matching IDs.
 * - Marks local notebooks as stale if their ID is no longer found.
 * - Adds new notebooks found in the scan to local storage.
 * (Refactored from background.js)
 * @param scannedNotebooks Array of notebooks extracted from NotebookLM DOM.
 * @returns The updated local Notebooks object.
 */
async function syncNotebookData(scannedNotebooks: { notebookLM_id: string; notebookLM_title: string }[]): Promise<Notebooks> {
  console.log('Syncing scanned notebooks with local storage:', scannedNotebooks);

  try {
    const storageResult = await getLocalStorage<{ [NOTEBOOKS_KEY]?: Notebooks }>([NOTEBOOKS_KEY]);
    const storedNotebooks = storageResult[NOTEBOOKS_KEY] || {};
    const updatedNotebooks = { ...storedNotebooks }; // Shallow copy to modify
    const nowISO = new Date().toISOString();

    const scannedNotebookMap = new Map(scannedNotebooks.map(nb => [nb.notebookLM_id, nb]));
    const processedStoredLMIds = new Set<string>(); // Track stored IDs processed

    // 1. Process stored notebooks against scanned data
    for (const notebookName in updatedNotebooks) {
      const storedData = updatedNotebooks[notebookName];
      if (storedData.notebookLM_id) { // Only process notebooks previously linked to NotebookLM
        processedStoredLMIds.add(storedData.notebookLM_id);
        const scannedMatch = scannedNotebookMap.get(storedData.notebookLM_id);

        if (scannedMatch) {
          // Match found: Update title if changed, update sync time
          if (storedData.notebookLM_title !== scannedMatch.notebookLM_title) {
             console.log(`Updating title for notebook "${notebookName}" (ID ${storedData.notebookLM_id}): "${storedData.notebookLM_title}" -> "${scannedMatch.notebookLM_title}"`);
             storedData.notebookLM_title = scannedMatch.notebookLM_title;
             // Should we rename the local key (notebookName) too? Potentially complex if user relies on local name.
             // For now, just update the stored LM title.
             storedData.last_updated_datetime = nowISO;
          }
          storedData.last_sync_datetime = nowISO;
          // Remove from map so we know it's been processed
          scannedNotebookMap.delete(storedData.notebookLM_id);
        } else {
          // No match found in scan: Mark as stale (unlink)
          console.log(`Marking notebook "${notebookName}" (ID: ${storedData.notebookLM_id}) as stale (not found in scan).`);
          storedData.notebookLM_id = null;
          storedData.notebookLM_url = null;
          // Keep last known title? storedData.notebookLM_title = storedData.notebookLM_title || notebookName;
          storedData.last_sync_datetime = nowISO;
          storedData.last_updated_datetime = nowISO; // Mark as updated due to unlinking
        }
      }
      // Keep locally created notebooks (notebookLM_id is null) as they are.
    }

    // 2. Process remaining scanned notebooks (these are new)
    for (const [scannedId, scannedData] of scannedNotebookMap.entries()) {
      // Check if a notebook with this LM ID was already processed (shouldn't happen if logic is correct, but safe check)
       if (processedStoredLMIds.has(scannedId)) continue;

      // New notebook found in scan. Need a unique local name.
      let newNotebookName = scannedData.notebookLM_title;
      let counter = 1;
      // Ensure unique name in local storage keys
      while (updatedNotebooks[newNotebookName]) {
          newNotebookName = `${scannedData.notebookLM_title} (${counter++})`;
      }

      console.log(`Adding new notebook found in scan: "${newNotebookName}" (ID: ${scannedId})`);
      updatedNotebooks[newNotebookName] = {
        created_datetime: nowISO, // Or should this reflect NotebookLM creation time if available?
        last_updated_datetime: nowISO,
        last_sync_datetime: nowISO,
        notebookLM_id: scannedId,
        notebookLM_url: `${NOTEBOOKLM_BASE_URL}notebook/${scannedId}`, // Construct URL
        notebookLM_title: scannedData.notebookLM_title,
        sources: {} // Initialize empty sources for newly discovered notebook
      };
    }

    // 3. Save the updated notebooks back to storage
    await setLocalStorage({ [NOTEBOOKS_KEY]: updatedNotebooks });
    console.log('Successfully synced notebooks to local storage:', updatedNotebooks);
    return updatedNotebooks;

  } catch (error) {
    console.error('Error syncing notebook data:', error);
    throw new Error(`Failed to sync notebook data: ${error instanceof Error ? error.message : String(error)}`);
  }
}


/**
 * Orchestrates the process of scanning NotebookLM for notebooks and syncing with local storage.
 */
export async function scanAndSyncNotebooks(): Promise<Notebooks> {
    console.log("Starting NotebookLM scan and sync process...");
    const tabId = await ensureNotebookLMTab(); // Ensure tab is open and ready
    const scannedNotebooks = await scanNotebookLMNotebooks(tabId);
    const updatedLocalNotebooks = await syncNotebookData(scannedNotebooks);
    console.log("NotebookLM scan and sync process completed.");
    return updatedLocalNotebooks;
}