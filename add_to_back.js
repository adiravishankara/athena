// Add this function to your existing background.js

// Handle updating source sync status
function updateSourceSyncStatus(request, sender, sendResponse) {
  const { notebookName, sourceId, added_to_notebook } = request;

  chrome.storage.local.get(['notebooks'], (result) => {
    const notebooks = result.notebooks || {};
    
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

// Add this case to your existing message listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    // ... your existing cases
    
    case 'UPDATE_SOURCE_SYNC_STATUS':
      updateSourceSyncStatus(request, sender, sendResponse);
      break;
      
    // ... other cases
  }
  
  return true; // Indicates that sendResponse will be called asynchronously
}); 