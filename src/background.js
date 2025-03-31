// background.js

console.log("Background script loaded");

// Function to inject the floating button into a tab
function injectFloatingButton(tabId) {
  // Check if the tab exists and has a valid URL
  chrome.tabs.get(tabId, (tab) => {
    // Check if the URL is valid for script injection (not chrome://, chrome-extension://, etc.)
    const url = tab.url;
    if (!url || url.startsWith('chrome://') || url.startsWith('chrome-extension://') || url.startsWith('edge://') || url.startsWith('about:')) {
      console.log('Cannot inject script into', url);
      return;
    }
    
    // Get current notebook to check if URL is already saved
    chrome.storage.local.get(['currentNotebook', 'notebooks'], (result) => {
      const currentNotebook = result.currentNotebook;
      const notebooks = result.notebooks || {};
      let isUrlSaved = false;
      let isYouTube = false;
      
      // Check if URL is already saved in current notebook
      if (currentNotebook && notebooks[currentNotebook] && notebooks[currentNotebook].sources) {
        // Check if the URL is already in the current notebook's sources
        Object.values(notebooks[currentNotebook].sources).forEach((source) => {
          // Normalize YouTube URLs for comparison
          const normalizedUrl = normalizeYouTubeUrl(url);
          const normalizedSourceUrl = normalizeYouTubeUrl(source.url);
          if (normalizedUrl === normalizedSourceUrl) {
            isUrlSaved = true;
          }
        });
      }

      // Check if current URL is a YouTube URL
      isYouTube = url.toLowerCase().includes('youtube.com') || url.toLowerCase().includes('youtu.be');
      
      // Inject the floating button
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: (params) => {
          const { isAlreadySaved, isYouTube } = params;
          // This function runs in the context of the web page
          // Check if the button already exists
          if (document.getElementById("athena-floating-button")) {
            // Update existing button state if needed
            const existingButton = document.getElementById("athena-floating-button");
            existingButton.innerHTML = isAlreadySaved ? "✓" : "+";
            existingButton.style.background = isAlreadySaved ? "#2e7d32" : "#004d40";
            return;
          }
          
          const button = document.createElement("div");
          button.id = "athena-floating-button";
          button.innerHTML = isAlreadySaved ? "✓" : "+";
          button.style.position = "fixed";
          button.style.bottom = "50%";
          button.style.right = "20px";
          button.style.transform = "translateY(50%)";
          button.style.background = isAlreadySaved ? "#2e7d32" : "#004d40";
          button.style.color = "white";
          button.style.width = "40px";
          button.style.height = "40px";
          button.style.padding = "0";
          button.style.borderRadius = "50%";
          button.style.fontSize = "24px";
          button.style.fontWeight = "bold";
          button.style.cursor = "pointer";
          button.style.zIndex = "2147483647";
          button.style.boxShadow = "0 4px 8px rgba(0,0,0,0.4)";
          button.style.display = "flex";
          button.style.justifyContent = "center";
          button.style.alignItems = "center";
          button.style.lineHeight = "40px";
          button.style.textAlign = "center";
          button.style.fontFamily = "Arial, sans-serif";
          button.style.border = "none";
          button.style.margin = "0";
          button.style.userSelect = "none";

          // Add hover effect for YouTube videos
          if (isYouTube) {
            button.title = "Add YouTube video to notebook";
            button.style.transition = "transform 0.2s ease-in-out";
            button.addEventListener('mouseover', () => {
              button.style.transform = "translateY(50%) scale(1.1)";
            });
            button.addEventListener('mouseout', () => {
              button.style.transform = "translateY(50%) scale(1)";
            });
          }

          document.body.appendChild(button);
        },
        args: [{ isAlreadySaved: isUrlSaved, isYouTube: isYouTube }]
      }).catch(error => {
        console.error('Script injection error:', error);
      });
    });
  });
}

// Helper function to normalize YouTube URLs for comparison
function normalizeYouTubeUrl(url) {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes('youtube.com')) {
      const videoId = urlObj.searchParams.get('v');
      if (videoId) {
        return `youtube.com/watch?v=${videoId}`;
      }
    } else if (urlObj.hostname.includes('youtu.be')) {
      const videoId = urlObj.pathname.substring(1);
      if (videoId) {
        return `youtube.com/watch?v=${videoId}`;
      }
    }
    return url.toLowerCase();
  } catch (e) {
    console.error('Error normalizing URL:', e);
    return url.toLowerCase();
  }
}

// Function to remove the floating button from a tab
function removeFloatingButton(tabId) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    function: () => {
      const button = document.getElementById("athena-floating-button");
      if (button) {
        button.remove();
      }
    }
  }).catch(error => {
    // Ignore errors for non-injectable pages
    console.log('Cannot remove button from this page');
  });
}

// Listener for when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  console.log('Athena Extension Installed');
  
  // Initialize default storage values
  chrome.storage.local.get(['notebooks', 'currentNotebook', 'researchMode'], (result) => {
    if (!result.notebooks) {
      chrome.storage.local.set({ notebooks: {} });
    }
    if (!result.currentNotebook) {
      chrome.storage.local.set({ currentNotebook: null });
    }
    if (result.researchMode === undefined) {
      chrome.storage.local.set({ researchMode: false });
    }
  });
});

// Listen for tab updates (when user navigates to a new page)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Wait for the tab to complete loading
  if (changeInfo.status === 'complete') {
    // Check if research mode is active
    chrome.storage.local.get(['researchMode'], (result) => {
      const isResearchMode = result.researchMode || false;
      
      if (isResearchMode) {
        // Inject the floating button if research mode is active
        injectFloatingButton(tabId);
      }
    });
  }
});

// Listen for new tab creation
chrome.tabs.onCreated.addListener((tab) => {
  // Check if research mode is active
  chrome.storage.local.get(['researchMode'], (result) => {
    const isResearchMode = result.researchMode || false;
    
    if (isResearchMode) {
      // We'll wait for the tab to finish loading before injecting the button
      // The onUpdated listener will handle this
    }
  });
});

// Function to ensure NotebookLM tab is open and return its ID
async function ensureNotebookLMTab() {
  console.log('Ensuring NotebookLM tab exists...');
  const notebookLMUrl = "https://notebooklm.google.com/*";

  try {
    // Query for existing NotebookLM tabs
    const tabs = await chrome.tabs.query({ url: notebookLMUrl });

    if (tabs.length > 0) {
      // Found an existing tab, return its ID
      console.log('Found existing NotebookLM tab:', tabs[0].id);
      return tabs[0].id;
    } else {
      // No tab found, create a new one in the background
      console.log('No NotebookLM tab found, creating a new one...');
      const newTab = await chrome.tabs.create({ url: "https://notebooklm.google.com/", active: false });
      console.log('Created new NotebookLM tab:', newTab.id);
      // It might take a moment for the tab to fully load, but we have the ID
      return newTab.id;
    }
  } catch (error) {
    console.error('Error ensuring NotebookLM tab:', error);
    throw new Error('Failed to ensure NotebookLM tab: ' + error.message); // Re-throw or handle as appropriate
  }
}

// Function to be injected into NotebookLM page to extract notebook data
// IMPORTANT: Selectors are placeholders and need verification/adjustment!
function extractNotebookDataFromDOM() {
  console.log('Attempting to extract notebook data from DOM...');
  const notebooks = [];
  // Placeholder selector for individual notebook list items
  const notebookElements = document.querySelectorAll('.notebook-list-item'); // Adjust selector

  if (!notebookElements || notebookElements.length === 0) {
    console.warn('Could not find notebook elements with selector ".notebook-list-item".');
    // Try an alternative or return empty
    // const alternativeElements = document.querySelectorAll('...');
    // if (!alternativeElements) return notebooks;
    // notebookElements = alternativeElements;
     return notebooks; // Return empty if no elements found
  }

  notebookElements.forEach(element => {
    try {
      // Placeholder selector for the notebook name/title within the item
      const nameElement = element.querySelector('.notebook-name'); // Adjust selector
      // Placeholder logic for getting the notebook ID (might be data attribute, part of a link, etc.)
      const idElement = element.querySelector('[data-notebook-id]'); // Adjust selector/attribute
      const notebookId = idElement ? idElement.getAttribute('data-notebook-id') : element.id || null; // Adjust logic

      const notebookName = nameElement ? nameElement.innerText.trim() : 'Untitled Notebook';

      if (notebookId && notebookName) {
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

  console.log(`Extracted ${notebooks.length} notebooks:`, notebooks);
  return notebooks;
}

// Function to orchestrate scanning notebooks in the specified tab
async function scanNotebookLMNotebooks(tabId) {
  console.log(`Scanning for notebooks in tab ID: ${tabId}`);
  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: extractNotebookDataFromDOM,
    });

    // executeScript returns an array of results, one for each frame.
    // We assume the main frame is the first one.
    if (results && results[0] && results[0].result) {
      console.log('Successfully scanned notebooks:', results[0].result);
      return results[0].result; // This is the array of { notebookLM_id, notebookLM_title }
    } else {
      console.warn('No results received from script execution or result was empty.');
      return []; // Return empty array if no data found
    }
  } catch (error) {
    console.error(`Error executing notebook scanning script in tab ${tabId}:`, error);
    // Check for specific errors like missing host permissions
    if (error.message.includes('Cannot access contents of url')) {
       throw new Error(`Cannot access NotebookLM page. Ensure host permissions for "https://notebooklm.google.com/*" are granted in manifest.json. Original error: ${error.message}`);
    }
     if (error.message.includes('No tab with id')) {
       throw new Error(`NotebookLM tab with ID ${tabId} not found or closed. Original error: ${error.message}`);
    }
    throw new Error('Failed to scan notebooks: ' + error.message);
  }
}


// Function to sync scanned notebook data with local storage
async function syncNotebookData(scannedNotebooks) {
  console.log('Syncing scanned notebooks with local storage:', scannedNotebooks);

  try {
    // 1. Get current stored notebooks
    const storageResult = await chrome.storage.local.get(['notebooks']);
    const storedNotebooks = storageResult.notebooks || {}; // Use object format { name: data }
    const updatedNotebooks = { ...storedNotebooks }; // Create a copy to modify
    const nowISO = new Date().toISOString();

    const scannedNotebookMap = new Map(scannedNotebooks.map(nb => [nb.notebookLM_id, nb]));
    const storedNotebookLMIds = new Set();

    // 2. Process stored notebooks against scanned data
    for (const notebookName in updatedNotebooks) {
      const storedData = updatedNotebooks[notebookName];
      if (storedData.notebookLM_id) { // Only process notebooks that were previously synced
        storedNotebookLMIds.add(storedData.notebookLM_id);
        const scannedMatch = scannedNotebookMap.get(storedData.notebookLM_id);

        if (scannedMatch) {
          // Match found: Update title and sync time if changed
          if (storedData.notebookLM_title !== scannedMatch.notebookLM_title) {
             console.log(`Updating title for notebook ID ${storedData.notebookLM_id}: "${storedData.notebookLM_title}" -> "${scannedMatch.notebookLM_title}"`);
             storedData.notebookLM_title = scannedMatch.notebookLM_title;
             storedData.last_updated_datetime = nowISO; // Also update this? Or just sync time? Let's update both.
          }
          storedData.last_sync_datetime = nowISO;
        } else {
          // No match found in scan: Mark as stale (as per plan)
          console.log(`Marking notebook "${notebookName}" (ID: ${storedData.notebookLM_id}) as stale.`);
          storedData.notebookLM_id = null; // Mark as stale
          storedData.notebookLM_title = storedData.notebookLM_title || notebookName; // Keep last known title or name
          storedData.last_sync_datetime = nowISO;
          storedData.last_updated_datetime = nowISO;
        }
      }
      // Keep notebooks that were created locally (notebookLM_id is null) as they are
    }

    // 3. Process scanned notebooks against stored data (to find new ones)
    for (const [scannedId, scannedData] of scannedNotebookMap.entries()) {
      if (!storedNotebookLMIds.has(scannedId)) {
        // New notebook found in scan, needs to be added to storage
        // We need a unique local name. Using title for now, but might need refinement if titles clash.
        let newNotebookName = scannedData.notebookLM_title;
        let counter = 1;
        // Ensure unique name in local storage
        while (updatedNotebooks[newNotebookName]) {
            newNotebookName = `${scannedData.notebookLM_title} (${counter++})`;
        }

        console.log(`Adding new notebook found in scan: "${newNotebookName}" (ID: ${scannedId})`);
        updatedNotebooks[newNotebookName] = {
          created_datetime: nowISO,
          last_updated_datetime: nowISO,
          last_sync_datetime: nowISO,
          notebookLM_id: scannedId,
          notebookLM_url: `https://notebooklm.google.com/notebook/${scannedId}`, // Construct URL
          notebookLM_title: scannedData.notebookLM_title,
          sources: {} // Initialize empty sources
        };
      }
    }

    // 4. Save the updated notebooks back to storage
    await chrome.storage.local.set({ notebooks: updatedNotebooks });
    console.log('Successfully synced notebooks to local storage:', updatedNotebooks);
    return updatedNotebooks; // Return the updated list

  } catch (error) {
    console.error('Error syncing notebook data:', error);
    throw new Error('Failed to sync notebook data: ' + error.message);
  }
}


// Notebook operations
function createNotebook(name) {
  return new Promise((resolve, reject) => {
    if (!name) {
      reject(new Error('Notebook name is required'));
      return;
    }

    chrome.storage.local.get(['notebooks'], (result) => {
      const notebooks = result.notebooks || {};
      
      // Check if notebook already exists
      if (notebooks[name]) {
        reject(new Error(`Notebook "${name}" already exists`));
        return;
      }
      
      // Create new notebook with proper structure
      notebooks[name] = {
        created_datetime: new Date().toISOString(),
        last_updated_datetime: new Date().toISOString(),
        last_sync_datetime: null,
        notebookLM_id: null,
        notebookLM_url: null,
        notebookLM_title: null,
        sources: {}  // Initialize empty sources object
      };
      
      // Save updated notebooks
      chrome.storage.local.set({ notebooks, currentNotebook: name }, () => {
        resolve({ name, notebook: notebooks[name] });
      });
    });
  });
}

function addSourceToNotebook(notebookName, source) {
  return new Promise((resolve, reject) => {
    if (!notebookName) {
      reject(new Error('Notebook name is required'));
      return;
    }
    
    if (!source || !source.url) {
      reject(new Error('Source URL is required'));
      return;
    }
    
    chrome.storage.local.get(['notebooks'], (result) => {
      const notebooks = result.notebooks || {};
      
      // Check if notebook exists
      if (!notebooks[notebookName]) {
        reject(new Error(`Notebook "${notebookName}" does not exist`));
        return;
      }
      
      // Generate a unique ID for the source
      const sourceId = `source_${Date.now()}`;
      
      // Add source to notebook's sources object
      if (!notebooks[notebookName].sources) {
        notebooks[notebookName].sources = {};
      }
      
      notebooks[notebookName].sources[sourceId] = {
        url: source.url,
        title: source.title || source.url,
        linkType: source.type || 'web',  // Changed type to linkType to match interface
        added_datetime: source.datetime || new Date().toISOString(),
        added_to_notebook: false  // Initialize as not added to NotebookLM
      };
      
      // Update last_updated_datetime
      notebooks[notebookName].last_updated_datetime = new Date().toISOString();
      
      // Save updated notebooks
      chrome.storage.local.set({ notebooks }, () => {
        resolve({ notebookName, sourceId, source: notebooks[notebookName].sources[sourceId] });
      });
    });
  });
}

function deleteSourceFromNotebook(notebookName, sourceId) {
  return new Promise((resolve, reject) => {
    if (!notebookName) {
      reject(new Error('Notebook name is required'));
      return;
    }
    
    if (!sourceId) {
      reject(new Error('Source ID is required'));
      return;
    }
    
    chrome.storage.local.get(['notebooks'], (result) => {
      const notebooks = result.notebooks || {};
      
      // Check if notebook exists
      if (!notebooks[notebookName]) {
        reject(new Error(`Notebook "${notebookName}" does not exist`));
        return;
      }
      
      // Check if source exists
      if (!notebooks[notebookName].sources || !notebooks[notebookName].sources[sourceId]) {
        reject(new Error(`Source "${sourceId}" does not exist in notebook "${notebookName}"`));
        return;
      }
      
      // Delete source from notebook
      delete notebooks[notebookName].sources[sourceId];
      
      // Update last_updated_datetime
      notebooks[notebookName].last_updated_datetime = new Date().toISOString();
      
      // Save updated notebooks
      chrome.storage.local.set({ notebooks }, () => {
        resolve({ notebookName, sourceId });
      });
    });
  });
}

function setCurrentNotebook(notebookName) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['notebooks'], (result) => {
      const notebooks = result.notebooks || {};
      
      // Check if notebook exists
      if (notebookName && !notebooks[notebookName]) {
        reject(new Error(`Notebook "${notebookName}" does not exist`));
        return;
      }
      
      // Set current notebook
      chrome.storage.local.set({ currentNotebook: notebookName }, () => {
        resolve({ currentNotebook: notebookName });
      });
    });
  });
}

function toggleResearchMode(enabled) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ researchMode: enabled }, () => {
      if (enabled) {
        // When enabling research mode, inject the button into all tabs
        chrome.tabs.query({}, (tabs) => {
          for (const tab of tabs) {
            // Try to inject the floating button into each tab
            injectFloatingButton(tab.id);
          }
        });
      } else {
        // When disabling research mode, remove the button from all tabs
        chrome.tabs.query({}, (tabs) => {
          for (const tab of tabs) {
            // Try to remove the floating button from each tab
            removeFloatingButton(tab.id);
          }
        });
      }
      
      resolve({ researchMode: enabled });
    });
  });
}

// Handle updating source sync status
function updateSourceSyncStatus(request, sender, sendResponse) {
  const { notebookName, sourceId, added_to_notebook } = request;

  chrome.storage.local.get(['notebooks'], (result) => {
    const notebooks = result.notebooks || {};
    
    // Check if notebook exists and has the source
    if (!notebooks[notebookName] || !notebooks[notebookName].sources || !notebooks[notebookName].sources[sourceId]) {
      sendResponse({ status: 'error', error: 'Source not found' });
      return;
    }
    
    // Update the sync status
    notebooks[notebookName].sources[sourceId].added_to_notebook = added_to_notebook;
    
    // Update last sync datetime if we're marking as synced
    if (added_to_notebook) {
      notebooks[notebookName].last_sync_datetime = new Date().toISOString();
    }
    
    // Save the updated notebooks
    chrome.storage.local.set({ notebooks }, () => {
      sendResponse({ status: 'success', data: { notebookName, sourceId, added_to_notebook } });
    });
  });
  
  return true; // Indicates that sendResponse will be called asynchronously
}

// Listener for messages from the frontend and content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received:', request);

  // Handle triggering the sync process
  if (request.action === 'SYNC_NOTEBOOKS') {
    ensureNotebookLMTab()
      .then(tabId => {
        if (!tabId) {
          // If ensureNotebookLMTab failed somehow
          throw new Error('Failed to get NotebookLM tab ID.');
        }
        console.log('NotebookLM tab ensured, ID:', tabId, '. Now scanning...');
        // Chain the scanning step
        return scanNotebookLMNotebooks(tabId);
      })
      .then(scannedNotebooks => {
        // Call the sync function
        console.log('Notebooks scanned, now syncing with storage:', scannedNotebooks);
        return syncNotebookData(scannedNotebooks);
      })
      .then(syncedNotebooks => {
        // Sync successful, send back the final synced data
        console.log('Sync process completed successfully.');
        sendResponse({ status: 'success', data: { message: 'Notebooks synced successfully.', notebooks: syncedNotebooks } });
      })
      .catch(error => {
        console.error('Error during SYNC_NOTEBOOKS process:', error);
        sendResponse({ status: 'error', error: error.message });
      });
    return true; // Indicates asynchronous response
  }
  
  if (request.action === 'CREATE_NOTEBOOK') {
    createNotebook(request.name)
      .then(result => sendResponse({ status: 'success', data: result }))
      .catch(error => sendResponse({ status: 'error', error: error.message }));
    return true;
  }
  
  if (request.action === 'ADD_SOURCE') {
    chrome.storage.local.get(['currentNotebook'], (result) => {
      if (!result.currentNotebook) {
        sendResponse({ status: 'error', error: 'No notebook selected' });
        return;
      }
      
      addSourceToNotebook(result.currentNotebook, {
        url: request.url,
        title: request.title,
        type: request.type,
        datetime: request.datetime
      })
        .then(result => {
          console.log('Source added:', result);
          sendResponse({ status: 'success', data: result });
        })
        .catch(error => {
          console.error('Error adding source:', error);
          sendResponse({ status: 'error', error: error.message });
        });
    });
    return true;
  }
  
  if (request.action === 'DELETE_SOURCE') {
    deleteSourceFromNotebook(request.notebookName, request.sourceId)
      .then(result => sendResponse({ status: 'success', data: result }))
      .catch(error => sendResponse({ status: 'error', error: error.message }));
    return true;
  }
  
  if (request.action === 'SET_CURRENT_NOTEBOOK') {
    setCurrentNotebook(request.name)
      .then(result => sendResponse({ status: 'success', data: result }))
      .catch(error => sendResponse({ status: 'error', error: error.message }));
    return true;
  }
  
  if (request.action === 'TOGGLE_RESEARCH_MODE') {
    toggleResearchMode(request.enabled)
      .then(result => sendResponse({ status: 'success', data: result }))
      .catch(error => sendResponse({ status: 'error', error: error.message }));
    return true;
  }

  if (request.action === 'UPDATE_SOURCE_SYNC_STATUS') {
    updateSourceSyncStatus(request, sender, sendResponse);
    return true;
  }
});


