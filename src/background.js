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


