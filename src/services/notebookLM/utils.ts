/// <reference types="chrome"/>

/**
 * Waits for a tab to finish loading.
 * Properly handles the tab navigation and returns a promise that resolves when loading is complete.
 */
export const waitForTabLoad = (tabId: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    const checkTab = () => {
      try {
        chrome.tabs.get(tabId, (tab) => {
          if (chrome.runtime.lastError) {
            console.error("Error checking tab:", chrome.runtime.lastError.message);
            reject(new Error(chrome.runtime.lastError.message));
            return;
          }
          
          if (tab.status === 'complete') {
            console.log("Tab loaded completely");
            // Additional delay to ensure all scripts are initialized
            setTimeout(resolve, 1500);
          } else {
            console.log(`Tab status: ${tab.status}, waiting...`);
            setTimeout(checkTab, 300);
          }
        });
      } catch (error) {
        console.error("Error in waitForTabLoad:", error);
        reject(error);
      }
    };
    
    // Set a timeout to avoid waiting forever
    const timeout = setTimeout(() => {
      reject(new Error("Tab loading timed out after 30 seconds"));
    }, 30000);
    
    checkTab();
    
    // Return a cleanup function in the promise to clear the timeout
    return () => clearTimeout(timeout);
  });
};

/**
 * Safely executes a function in the context of a tab.
 * Properly handles the messaging channel to avoid "message channel closed" errors.
 */
export const safeExecuteScript = async <T>(
  tabId: number, 
  func: ((...args: any[]) => any), 
  ...args: any[]
): Promise<T> => {
  return new Promise((resolve, reject) => {
    try {
      chrome.scripting.executeScript(
        {
          target: { tabId },
          func,
          args
        },
        (results) => {
          if (chrome.runtime.lastError) {
            console.error("Execute script error:", chrome.runtime.lastError.message);
            reject(new Error(chrome.runtime.lastError.message));
            return;
          }
          
          if (!results || results.length === 0) {
            reject(new Error("No results from script execution"));
            return;
          }
          
          resolve(results[0].result as T);
        }
      );
    } catch (error) {
      console.error("Error in safeExecuteScript:", error);
      reject(error);
    }
  });
}; 