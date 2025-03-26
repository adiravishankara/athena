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
      let notebookWithUrl = null;
      
      // Check if URL is already saved in any notebook
      if (currentNotebook && notebooks[currentNotebook]) {
        // Check if the URL is already in the current notebook
        Object.values(notebooks[currentNotebook]).forEach((source) => {
          if (source.url === url) {
            isUrlSaved = true;
          }
        });
      }
      
      // Inject the floating button
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: (isAlreadySaved) => {
          // This function runs in the context of the web page
          // Check if the button already exists
          if (document.getElementById("athena-floating-button")) return;
          
          const button = document.createElement("div");
          button.id = "athena-floating-button";
          button.innerHTML = isAlreadySaved ? "✓" : "+";
          button.style.position = "fixed !important";
          button.style.bottom = "50% !important"; // Center vertically
          button.style.right = "20px !important";
          button.style.transform = "translateY(50%) !important"; // Center adjustment
          button.style.background = isAlreadySaved ? "#2e7d32 !important" : "#004d40 !important";
          button.style.color = "white !important";
          button.style.width = "40px !important"; // Fixed width
          button.style.height = "40px !important"; // Fixed height
          button.style.padding = "0 !important"; // Remove padding
          button.style.borderRadius = "50% !important";
          button.style.fontSize = "24px !important"; // Fixed font size
          button.style.fontWeight = "bold !important";
          button.style.cursor = "pointer !important";
          button.style.zIndex = "2147483647 !important"; // Maximum z-index value
          button.style.boxShadow = "0 4px 8px rgba(0,0,0,0.4) !important";
          button.style.display = "flex !important";
          button.style.justifyContent = "center !important";
          button.style.alignItems = "center !important";
          button.style.lineHeight = "40px !important"; // Match height for centering
          button.style.textAlign = "center !important";
          button.style.fontFamily = "Arial, sans-serif !important"; // Prevent font inheritance
          button.style.border = "none !important";
          button.style.margin = "0 !important";
          button.style.userSelect = "none !important"; // Prevent text selection

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
              if (isAlreadySaved) {
                // If the URL is already saved, show a message
                const toast = document.createElement("div");
                toast.textContent = "Already added to notebook";
                toast.style.position = "fixed";
                toast.style.bottom = "100px";
                toast.style.right = "20px";
                toast.style.backgroundColor = "rgba(46, 125, 50, 0.9)";
                toast.style.color = "white";
                toast.style.padding = "10px 15px";
                toast.style.borderRadius = "4px";
                toast.style.zIndex = "10001";
                document.body.appendChild(toast);
                
                setTimeout(() => {
                  toast.remove();
                }, 2000);
                
                return;
              }
              
              const url = window.location.href;
              const title = document.title;
              
              chrome.runtime.sendMessage({
                action: 'ADD_SOURCE',
                url: url,
                title: title,
                type: 'web',
                datetime: new Date().toISOString()
              }, (response) => {
                if (response && response.status === 'success') {
                  // Visual feedback
                  button.style.background = '#2e7d32 !important';
                  button.innerHTML = "✓";
                  
                  // Don't change back to + since it's now saved
                  isAlreadySaved = true;
                } else {
                  // Show error toast
                  const toast = document.createElement("div");
                  toast.textContent = response && response.error ? response.error : "Failed to add to notebook";
                  toast.style.position = "fixed";
                  toast.style.bottom = "100px";
                  toast.style.right = "20px";
                  toast.style.backgroundColor = "rgba(211, 47, 47, 0.9)";
                  toast.style.color = "white";
                  toast.style.padding = "10px 15px";
                  toast.style.borderRadius = "4px";
                  toast.style.zIndex = "10001";
                  document.body.appendChild(toast);
                  
                  setTimeout(() => {
                    toast.remove();
                  }, 2000);
                }
              });
            }
          });

          document.body.appendChild(button);
          
          // Create a MutationObserver to ensure button attributes stay consistent
          const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                // Ensure the button style remains consistent
                button.style.width = "40px !important";
                button.style.height = "40px !important";
                button.style.fontSize = "24px !important";
                button.style.background = isAlreadySaved ? "#2e7d32 !important" : "#004d40 !important";
                button.style.zIndex = "2147483647 !important";
              } else if (mutation.type === 'childList' && mutation.target === button) {
                // Ensure the button content remains consistent
                button.innerHTML = isAlreadySaved ? "✓" : "+";
              }
            });
          });
          
          // Start observing the button for attribute and content changes
          observer.observe(button, { 
            attributes: true,
            attributeFilter: ['style'],
            childList: true
          });
        },
        args: [isUrlSaved]
      }).catch(error => {
        console.error('Script injection error:', error);
      });
    });
  });
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
    if (!notebooks[notebookName] || !notebooks[notebookName][sourceId]) {
      sendResponse({ status: 'error', error: 'Source not found' });
      return;
    }
    
    // Update the sync status
    notebooks[notebookName][sourceId].added_to_notebook = added_to_notebook;
    
    // Update last sync datetime if we're marking as synced
    if (added_to_notebook) {
      // If the notebook doesn't have last_sync_datetime property, add it
      if (!notebooks[notebookName].last_sync_datetime) {
        // Create a new property for the notebook
        Object.defineProperty(notebooks[notebookName], 'last_sync_datetime', {
          value: new Date().toISOString(),
          writable: true,
          enumerable: true,
          configurable: true
        });
      } else {
        notebooks[notebookName].last_sync_datetime = new Date().toISOString();
      }
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


