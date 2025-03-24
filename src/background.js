// background.js

console.log("Background script loaded");

// We'll use messaging to communicate with the content script
function notifyResearchModeStatus(tabId, isEnabled) {
  try {
    chrome.tabs.sendMessage(tabId, { 
      action: 'RESEARCH_MODE_CHANGED', 
      isEnabled: isEnabled 
    }).catch(error => {
      // If we can't send a message (likely because content script isn't loaded yet),
      // we'll fall back to script injection only for pages where it's needed
      if (isEnabled) {
        injectFloatingButton(tabId);
      }
    });
  } catch (err) {
    console.log('Error sending message to tab', tabId, err);
    // Fallback to direct injection if messaging fails
    if (isEnabled) {
      injectFloatingButton(tabId);
    }
  }
}

// Function to inject the floating button into a tab (as fallback)
function injectFloatingButton(tabId) {
  // Check if the tab exists and has a valid URL
  chrome.tabs.get(tabId, (tab) => {
    // Check if the URL is valid for script injection (not chrome://, chrome-extension://, etc.)
    const url = tab.url;
    if (!url || url.startsWith('chrome://') || url.startsWith('chrome-extension://') || url.startsWith('edge://') || url.startsWith('about:')) {
      console.log('Cannot inject script into', url);
      return;
    }
    
    // Inject the floating button
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      function: () => {
        // Don't re-inject if the button or content script is already there
        if (window.athenaContentScriptLoaded || document.getElementById("athena-floating-button")) return;
        
        const button = document.createElement("div");
        button.id = "athena-floating-button";
        button.innerHTML = "+";
        button.style.position = "fixed";
        button.style.top = "50%"; // Position in the middle vertically
        button.style.right = "20px";
        button.style.transform = "translateY(-50%)"; // Center it perfectly
        button.style.background = "#004d40";
        button.style.color = "white";
        button.style.padding = "18px 22px"; // Increased padding for bigger button
        button.style.borderRadius = "50%";
        button.style.fontSize = "30px"; // Increased font size
        button.style.fontWeight = "bold";
        button.style.cursor = "pointer";
        button.style.zIndex = "10000"; // High z-index to appear over other elements
        button.style.boxShadow = "0 3px 8px rgba(0,0,0,0.4)"; // Enhanced shadow
        button.style.display = "flex";
        button.style.justifyContent = "center";
        button.style.alignItems = "center";
        button.style.width = "50px"; // Increased width
        button.style.height = "50px"; // Increased height

        // Make the button draggable
        let isDragging = false;
        let offsetX, offsetY;

        button.addEventListener('mousedown', function(e) {
          isDragging = true;
          offsetX = e.clientX - button.getBoundingClientRect().left;
          offsetY = e.clientY - button.getBoundingClientRect().top;
        });

        document.addEventListener('mousemove', function(e) {
          if (isDragging) {
            const left = e.clientX - offsetX;
            const top = e.clientY - offsetY;
            
            button.style.right = 'auto';
            button.style.bottom = 'auto';
            button.style.transform = 'none'; // Remove transform when dragging
            button.style.left = left + 'px';
            button.style.top = top + 'px';
          }
        });

        document.addEventListener('mouseup', function() {
          isDragging = false;
        });

        // Add click handler to save the current URL
        button.addEventListener('click', function(e) {
          if (!isDragging) {
            const url = window.location.href;
            const title = document.title;
            
            // First check if this URL already exists in the current notebook
            chrome.runtime.sendMessage({
              action: 'CHECK_URL_EXISTS',
              url: url
            }, response => {
              if (response && response.exists) {
                // URL already exists, show permanent checkmark
                button.innerHTML = "✓";
                button.style.background = '#2e7d32';
                button.style.pointerEvents = 'none'; // Disable further clicks
              } else {
                // URL doesn't exist, add it
                chrome.runtime.sendMessage({
                  action: 'ADD_SOURCE',
                  url: url,
                  title: title,
                  type: 'web',
                  datetime: new Date().toISOString()
                });
                
                // Visual feedback
                const originalColor = button.style.background;
                button.style.background = '#2e7d32';
                button.innerHTML = "✓";
                
                setTimeout(() => {
                  button.style.background = originalColor;
                  button.innerHTML = "+";
                }, 1000);
              }
            });
          }
        });

        document.body.appendChild(button);
        
        // Mark that we've handled this page
        window.athenaContentScriptLoaded = true;
      }
    }).catch(error => {
      console.error('Script injection error:', error);
    });
  });
}

// Function to remove the floating button from a tab
function removeFloatingButton(tabId) {
  try {
    // Try to use messaging first
    chrome.tabs.sendMessage(tabId, { 
      action: 'RESEARCH_MODE_CHANGED', 
      isEnabled: false 
    }).catch(error => {
      // Fall back to direct script injection if needed
      executeRemoveScript(tabId);
    });
  } catch (err) {
    console.log('Error sending message to tab', tabId, err);
    // Fallback to direct removal if messaging fails
    executeRemoveScript(tabId);
  }
}

function executeRemoveScript(tabId) {
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
        // Notify the content script about the research mode status
        notifyResearchModeStatus(tabId, true);
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
      // We'll wait for the tab to finish loading before notifying
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
      
      // Create new empty notebook
      notebooks[name] = {};
      
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
      
      // Add source to notebook
      notebooks[notebookName][sourceId] = {
        url: source.url,
        title: source.title || source.url,
        type: source.type || 'web',
        added_datetime: source.datetime || new Date().toISOString()
      };
      
      // Save updated notebooks
      chrome.storage.local.set({ notebooks }, () => {
        resolve({ notebookName, sourceId, source: notebooks[notebookName][sourceId] });
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
      if (!notebooks[notebookName][sourceId]) {
        reject(new Error(`Source "${sourceId}" does not exist in notebook "${notebookName}"`));
        return;
      }
      
      // Delete source from notebook
      delete notebooks[notebookName][sourceId];
      
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
        // When enabling research mode, notify all tabs
        chrome.tabs.query({}, (tabs) => {
          for (const tab of tabs) {
            // Try to notify the content script in each tab
            notifyResearchModeStatus(tab.id, true);
          }
        });
      } else {
        // When disabling research mode, notify all tabs
        chrome.tabs.query({}, (tabs) => {
          for (const tab of tabs) {
            // Try to notify the content script or remove the button directly
            notifyResearchModeStatus(tab.id, false);
          }
        });
      }
      
      resolve({ researchMode: enabled });
    });
  });
}

// Add a function to check if a URL already exists in the current notebook
function checkUrlExists(url) {
  return new Promise((resolve, reject) => {
    if (!url) {
      reject(new Error('URL is required'));
      return;
    }
    
    chrome.storage.local.get(['notebooks', 'currentNotebook'], (result) => {
      const notebooks = result.notebooks || {};
      const currentNotebook = result.currentNotebook;
      
      if (!currentNotebook || !notebooks[currentNotebook]) {
        resolve({ exists: false });
        return;
      }
      
      // Check if the URL exists in the current notebook
      const sources = notebooks[currentNotebook];
      let exists = false;
      
      for (const sourceId in sources) {
        if (sources[sourceId].url === url) {
          exists = true;
          break;
        }
      }
      
      resolve({ exists });
    });
  });
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
  
  if (request.action === 'CHECK_URL_EXISTS') {
    checkUrlExists(request.url)
      .then(result => sendResponse(result))
      .catch(error => sendResponse({ error: error.message }));
    return true;
  }
  
  if (request.action === 'ADD_SOURCE') {
    chrome.storage.local.get(['currentNotebook'], (result) => {
      if (!result.currentNotebook) {
        sendResponse({ status: 'error', error: 'No notebook selected' });
        return;
      }
      
      // First check if this URL already exists
      checkUrlExists(request.url)
        .then(existsResult => {
          if (existsResult.exists) {
            // URL already exists, don't add it again
            sendResponse({ status: 'success', data: { alreadyExists: true } });
          } else {
            // URL doesn't exist, add it
            addSourceToNotebook(result.currentNotebook, {
              url: request.url,
              title: request.title,
              type: request.type,
              datetime: request.datetime
            })
              .then(result => sendResponse({ status: 'success', data: result }))
              .catch(error => sendResponse({ status: 'error', error: error.message }));
          }
        })
        .catch(error => sendResponse({ status: 'error', error: error.message }));
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
});


