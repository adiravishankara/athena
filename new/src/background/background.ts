import { Notebooks, Source } from '../common/types.ts'; // Removed unused NotebookLMServiceSource
import { getLocalStorage, setLocalStorage } from '../api/chrome/storage.ts';
import { queryTabs, getTab } from '../api/chrome/tabs.ts'; // Removed unused createTab, updateTab
import { executeScript } from '../api/chrome/scripting.ts';
import {
    getNotebooks,
    getCurrentNotebookName,
    createNotebook,
    addSourceToCurrentNotebook,
    deleteSourceFromNotebook,
    setCurrentNotebook,
    getResearchMode,
    setResearchMode
    // updateSourceSyncStatus // Removed unused import
} from '../api/actions/notebookStore.ts';
import { addSourcesToNotebookLM, scanAndSyncNotebooks } from '../api/actions/notebookLM.ts';
// import { shouldShowButtonForUrl, getButtonStateForUrl } from '../api/actions/floatingButton.ts'; // Removed unused shouldShowButtonForUrl
import { getButtonStateForUrl } from '../api/actions/floatingButton.ts'; // Keep getButtonStateForUrl

// Initialize extension
chrome.runtime.onInstalled.addListener(async () => {
    console.log('Athena Extension Installed');
    
    // Initialize default storage values
    const storage = await getLocalStorage<{
        notebooks: Notebooks;
        currentNotebook: string | null;
        researchMode: boolean;
    }>(['notebooks', 'currentNotebook', 'researchMode']);

    if (!storage.notebooks) await setLocalStorage({ notebooks: {} });
    if (!storage.currentNotebook) await setLocalStorage({ currentNotebook: null });
    if (storage.researchMode === undefined) await setLocalStorage({ researchMode: false });
});

// Message Router
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    console.log('Message received:', request);
    
    try {
        switch (request.action) {
            case 'GET_INITIAL_DATA':
                // Use different variable names to avoid redeclaration
                const initialNotebooks = await getNotebooks();
                const initialCurrentNotebook = await getCurrentNotebookName();
                const initialResearchMode = await getResearchMode();
                sendResponse({
                    status: 'success',
                    data: {
                        notebooks: initialNotebooks,
                        currentNotebook: initialCurrentNotebook,
                        researchMode: initialResearchMode
                    }
                });
                break;

            case 'CREATE_NOTEBOOK':
                const createResult = await createNotebook(request.payload.name);
                sendResponse({ status: 'success', data: createResult });
                break;

            case 'SET_CURRENT_NOTEBOOK':
                const setResult = await setCurrentNotebook(request.payload.name);
                sendResponse({ status: 'success', data: setResult });
                break;

            case 'ADD_SOURCE_FROM_CURRENT_TAB':
                if (!sender.tab?.id) throw new Error('No tab information available');
                const tabInfo = await getTab(sender.tab.id); // Use different name
                if (!tabInfo?.url) throw new Error('Could not get current tab URL');
                
                const notebookToAddSource = await getCurrentNotebookName(); // Use different name
                if (!notebookToAddSource) throw new Error('No notebook selected');
                
                // Construct the source object matching Omit<Source, 'added_to_notebook'>
                const newSource: Omit<Source, 'added_to_notebook'> = {
                    url: tabInfo.url,
                    title: tabInfo.title || tabInfo.url, // Ensure title is always a string
                    linkType: tabInfo.url.toLowerCase().includes('youtube') || tabInfo.url.toLowerCase().includes('youtu.be') ? 'youtube' : 'website',
                    added_datetime: new Date().toISOString() // Add current datetime
                };
                
                const addResult = await addSourceToCurrentNotebook(newSource);
                sendResponse({ status: 'success', data: addResult });
                break;

            case 'DELETE_SOURCE':
                const deleteResult = await deleteSourceFromNotebook(
                    request.payload.notebookName,
                    request.payload.sourceId
                );
                sendResponse({ status: 'success', data: deleteResult });
                break;

            case 'TOGGLE_RESEARCH_MODE':
                await setResearchMode(request.payload.enabled);
                const allTabs = await queryTabs({}); // Use different name
                
                if (request.payload.enabled) {
                    // Inject button into all tabs
                    for (const tab of allTabs) {
                        if (tab.id) {
                            try {
                                await injectFloatingButton(tab.id);
                            } catch (error) {
                                console.error(`Error injecting button into tab ${tab.id}:`, error);
                            }
                        }
                    }
                } else {
                    // Remove button from all tabs
                    for (const tab of allTabs) {
                        if (tab.id) {
                            try {
                                await removeFloatingButton(tab.id);
                            } catch (error) {
                                console.error(`Error removing button from tab ${tab.id}:`, error);
                            }
                        }
                    }
                }
                
                sendResponse({ status: 'success', data: { enabled: request.payload.enabled } });
                break;

            case 'SYNC_NOTEBOOKLM_NOTEBOOKS':
                const syncedNotebooks = await scanAndSyncNotebooks(); // Use different name
                sendResponse({ status: 'success', data: { notebooks: syncedNotebooks } });
                break;

            case 'ADD_SOURCES_TO_NOTEBOOKLM':
                const addSourcesResult = await addSourcesToNotebookLM(request.payload.notebookName); // Use different name
                sendResponse({ status: 'success', data: addSourcesResult });
                break;

            default:
                throw new Error(`Unknown action: ${request.action}`);
        }
    } catch (error) {
        console.error('Error handling message:', error);
        sendResponse({ 
            status: 'error', 
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        });
    }

    return true; // Keep message channel open for async response
});

// Tab Management
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        const researchMode = await getResearchMode();
        if (researchMode && tab.url) {
            try {
                await injectFloatingButton(tabId);
            } catch (error) {
                console.error(`Error injecting button into tab ${tabId}:`, error);
            }
        }
    }
});

// Floating Button Functions
async function injectFloatingButton(tabId: number): Promise<void> {
    const tab = await getTab(tabId);
    if (!tab?.url) {
        console.log('Cannot inject script - no URL available');
        return;
    }

    // const [currentNotebook, notebooks] = await Promise.all([ // Removed unused variables
    //     getCurrentNotebookName(),
    //     getNotebooks()
    // ]);

    const buttonState = await getButtonStateForUrl(tab.url);
    if (!buttonState.shouldShow) return;

    try {
        await executeScript({
            target: { tabId },
            files: ['content.js', 'content.css']
        });

        await executeScript({
            target: { tabId },
            func: (state) => {
                // This function runs in the content script context
                window.postMessage({
                    type: 'INIT_FLOATING_BUTTON',
                    payload: state
                }, '*');
            },
            args: [buttonState]
        });
    } catch (error) {
        console.error('Error injecting floating button:', error);
    }
}

async function removeFloatingButton(tabId: number): Promise<void> {
    try {
        await executeScript({
            target: { tabId },
            func: () => {
                // This function runs in the content script context
                window.postMessage({
                    type: 'REMOVE_FLOATING_BUTTON'
                }, '*');
            }
        });
    } catch (error) {
        console.error('Error removing floating button:', error);
    }
}