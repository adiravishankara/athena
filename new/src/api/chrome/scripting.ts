/// <reference types="chrome"/>

/**
 * Executes a script in the specified target context.
 * Wraps chrome.scripting.executeScript in a Promise.
 *
 * @param injection The script injection configuration.
 * @returns A Promise that resolves with an array of results from the script execution, one for each frame injected into. The result type within InjectionResult reflects that Chrome awaits promises returned by the injected function.
 */
export function executeScript<Args extends any[], Result>(
  injection: chrome.scripting.ScriptInjection<Args, Result>
): Promise<chrome.scripting.InjectionResult<Awaited<Result>>[]> { // Keep adjusted Result type here
  return new Promise((resolve, reject) => {
    chrome.scripting.executeScript(injection, (results) => { // Let TS infer 'results' type
      if (chrome.runtime.lastError) {
        // Provide more context for common errors
        if (chrome.runtime.lastError.message?.includes("Cannot access contents of url") ||
            chrome.runtime.lastError.message?.includes("Cannot script required tab")) {
             // Extract target URL if possible for better error message
            let targetInfo = `tab ${injection.target.tabId}`;
            if ('urls' in injection.target && Array.isArray(injection.target.urls)) {
                targetInfo = `URL(s) matching ${injection.target.urls.join(', ')}`;
            }
            return reject(new Error(`Cannot execute script in ${targetInfo}. Check host permissions or if the page is scriptable. Original error: ${chrome.runtime.lastError.message}`));
        }
         if (chrome.runtime.lastError.message?.includes("No tab with id")) {
            return reject(new Error(`Target tab with ID ${injection.target.tabId} not found.`));
        }
        return reject(chrome.runtime.lastError);
      }
      // results might be undefined if the script execution failed in a way that doesn't set lastError
      // Explicitly cast results to the expected Promise resolution type due to potential @types/chrome nuances
      resolve((results || []) as chrome.scripting.InjectionResult<Awaited<Result>>[]);
    });
  });
}

/**
 * Inserts CSS into the specified target context.
 * Wraps chrome.scripting.insertCSS in a Promise.
 *
 * @param injection The CSS injection configuration.
 * @returns A Promise that resolves when the CSS has been inserted.
 */
export function insertCSS(injection: chrome.scripting.CSSInjection): Promise<void> {
    return new Promise((resolve, reject) => {
        chrome.scripting.insertCSS(injection, () => {
            if (chrome.runtime.lastError) {
                 // Add context similar to executeScript
                let targetInfo = `tab ${injection.target.tabId}`;
                 if ('urls' in injection.target && Array.isArray(injection.target.urls)) {
                    targetInfo = `URL(s) matching ${injection.target.urls.join(', ')}`;
                }
                 if (chrome.runtime.lastError.message?.includes("Cannot access contents of url")) {
                    return reject(new Error(`Cannot insert CSS into ${targetInfo}. Check host permissions or if the page is scriptable. Original error: ${chrome.runtime.lastError.message}`));
                }
                 if (chrome.runtime.lastError.message?.includes("No tab with id")) {
                    return reject(new Error(`Target tab with ID ${injection.target.tabId} not found.`));
                }
                return reject(chrome.runtime.lastError);
            }
            resolve();
        });
    });
}

/**
 * Removes CSS from the specified target context.
 * Wraps chrome.scripting.removeCSS in a Promise.
 *
 * @param injection The CSS removal configuration.
 * @returns A Promise that resolves when the CSS has been removed.
 */
export function removeCSS(injection: chrome.scripting.CSSInjection): Promise<void> {
     return new Promise((resolve, reject) => {
        chrome.scripting.removeCSS(injection, () => {
            if (chrome.runtime.lastError) {
                // Add context similar to executeScript
               let targetInfo = `tab ${injection.target.tabId}`;
                if ('urls' in injection.target && Array.isArray(injection.target.urls)) {
                   targetInfo = `URL(s) matching ${injection.target.urls.join(', ')}`;
               }
                if (chrome.runtime.lastError.message?.includes("Cannot access contents of url")) {
                    return reject(new Error(`Cannot remove CSS from ${targetInfo}. Check host permissions or if the page is scriptable. Original error: ${chrome.runtime.lastError.message}`));
                }
                 if (chrome.runtime.lastError.message?.includes("No tab with id")) {
                    return reject(new Error(`Target tab with ID ${injection.target.tabId} not found.`));
                }
                return reject(chrome.runtime.lastError);
            }
            resolve();
        });
    });
}

// Note: registerContentScripts and related functions are typically used declaratively
// in the manifest or programmatically at install time, so wrappers might be less common.