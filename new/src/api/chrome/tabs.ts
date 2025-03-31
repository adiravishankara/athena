/// <reference types="chrome"/>

/**
 * Queries tabs based on the specified criteria.
 * Wraps chrome.tabs.query in a Promise.
 *
 * @param queryInfo Object defining the query parameters.
 * @returns A Promise that resolves with an array of tabs matching the query.
 */
export function queryTabs(queryInfo: chrome.tabs.QueryInfo): Promise<chrome.tabs.Tab[]> {
  return new Promise((resolve, reject) => {
    chrome.tabs.query(queryInfo, (tabs) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      resolve(tabs);
    });
  });
}

/**
 * Creates a new tab.
 * Wraps chrome.tabs.create in a Promise.
 *
 * @param createProperties Object defining the properties of the new tab.
 * @returns A Promise that resolves with the details of the created tab.
 */
export function createTab(createProperties: chrome.tabs.CreateProperties): Promise<chrome.tabs.Tab> {
  return new Promise((resolve, reject) => {
    chrome.tabs.create(createProperties, (tab) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      // The tab object might be undefined in some edge cases, though unlikely for create
      if (!tab) {
          return reject(new Error("Tab creation failed, received undefined tab object."));
      }
      resolve(tab);
    });
  });
}

/**
 * Updates the properties of a tab.
 * Wraps chrome.tabs.update in a Promise.
 *
 * @param tabId The ID of the tab to update.
 * @param updateProperties Object defining the properties to update.
 * @returns A Promise that resolves with the details of the updated tab, or undefined if the tab was closed.
 */
export function updateTab(tabId: number, updateProperties: chrome.tabs.UpdateProperties): Promise<chrome.tabs.Tab | undefined> {
  return new Promise((resolve, reject) => {
    // The tabId must be provided according to @types/chrome
    chrome.tabs.update(tabId, updateProperties, (tab) => {
      if (chrome.runtime.lastError) {
        // Handle specific error if tab not found
        if (chrome.runtime.lastError.message?.includes("No tab with id")) {
            return reject(new Error(`Tab with ID ${tabId} not found.`));
        }
        return reject(chrome.runtime.lastError);
      }
      resolve(tab); // tab can be undefined if the tab was closed before update completed
    });
  });
}

/**
 * Retrieves details about a specific tab.
 * Wraps chrome.tabs.get in a Promise.
 *
 * @param tabId The ID of the tab to get.
 * @returns A Promise that resolves with the details of the tab.
 */
export function getTab(tabId: number): Promise<chrome.tabs.Tab> {
  return new Promise((resolve, reject) => {
    chrome.tabs.get(tabId, (tab) => {
      if (chrome.runtime.lastError) {
        // Handle specific error if tab not found
        if (chrome.runtime.lastError.message?.includes("No tab with id")) {
            return reject(new Error(`Tab with ID ${tabId} not found.`));
        }
        return reject(chrome.runtime.lastError);
      }
      resolve(tab);
    });
  });
}

/**
 * Sends a single message to the content script(s) in a specific tab.
 * Wraps chrome.tabs.sendMessage in a Promise.
 *
 * @param tabId The ID of the tab to send the message to.
 * @param message The message to send. This should be a JSON-ifiable object.
 * @param options Optional settings for sending the message.
 * @returns A Promise that resolves with the response from the content script.
 */
export function sendMessageToTab<TResponse = any>(
    tabId: number,
    message: any,
    options?: chrome.tabs.MessageSendOptions
): Promise<TResponse> {
    return new Promise((resolve, reject) => {
        // Explicitly handle the optional options parameter for the API call
        const callback = (response: any) => {
            if (chrome.runtime.lastError) {
                // Provide more context for common errors
                if (chrome.runtime.lastError.message?.includes("Could not establish connection") ||
                    chrome.runtime.lastError.message?.includes("Receiving end does not exist")) {
                    return reject(new Error(`Could not connect to tab ${tabId}. Content script might not be injected or running.`));
                }
                return reject(chrome.runtime.lastError);
            }
            resolve(response as TResponse);
        };

        if (options) {
            chrome.tabs.sendMessage(tabId, message, options, callback);
        } else {
            // Call without options if it's undefined
            chrome.tabs.sendMessage(tabId, message, callback);
        }
    });
}

// Note: Listener wrappers (onUpdated, onCreated, etc.) are generally not needed
// as they can be used directly in the background script where the listeners live.