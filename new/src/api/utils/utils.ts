/**
 * Normalizes a URL for comparison purposes (e.g., for detecting duplicates).
 * Currently focuses on YouTube URLs.
 * @param url The URL string to normalize.
 * @returns A normalized URL string.
 */
export function normalizeUrlForComparison(url: string): string {
  try {
    const urlObj = new URL(url);
    // Normalize YouTube URLs (remove query params except 'v', use standard domain)
    if (urlObj.hostname.includes('youtube.com')) {
      const videoId = urlObj.searchParams.get('v');
      if (videoId) {
        return `https://www.youtube.com/watch?v=${videoId}`;
      }
    } else if (urlObj.hostname.includes('youtu.be')) {
      const videoId = urlObj.pathname.substring(1);
      if (videoId) {
        return `https://www.youtube.com/watch?v=${videoId}`;
      }
    }
    // Basic normalization: lowercase, remove trailing slash
    let normalized = url.toLowerCase();
    if (normalized.endsWith('/')) {
        normalized = normalized.slice(0, -1);
    }
    return normalized;
  } catch (e) {
    console.warn('Error normalizing URL, returning original lowercase:', url, e);
    // Fallback to simple lowercase if URL parsing fails
    return url.toLowerCase();
  }
}

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
            // Reject if tab is definitely gone
            if (chrome.runtime.lastError.message?.includes("No tab with id")) {
                return reject(new Error(`Tab with ID ${tabId} not found.`));
            }
            // Otherwise, maybe a temporary issue, retry? Or reject? Let's reject for now.
            return reject(new Error(chrome.runtime.lastError.message));
          }

          if (tab && tab.status === 'complete') {
            console.log(`Tab ${tabId} loaded completely.`);
            // Additional delay to ensure scripts might initialize after 'complete' fires
            setTimeout(resolve, 1000); // Reduced delay slightly
          } else {
            console.log(`Tab ${tabId} status: ${tab?.status || 'unknown'}, waiting...`);
            setTimeout(checkTab, 500); // Check slightly more often
          }
        });
      } catch (error) {
        console.error(`Error in checkTab for tab ${tabId}:`, error);
        reject(error);
      }
    };

    // Set a timeout to avoid waiting forever
    const timeoutId = setTimeout(() => {
      console.error(`Tab ${tabId} loading timed out after 30 seconds.`);
      reject(new Error(`Tab ${tabId} loading timed out after 30 seconds`));
    }, 30000); // 30 seconds timeout

    // Start checking
    checkTab();

    // It's tricky to return a cleanup function directly from Promise constructor.
    // The timeout will eventually fire if resolve/reject don't happen.
  });
};


/**
 * Helper function to safely execute a script in a tab, handling common errors.
 * Uses the chrome.scripting wrapper.
 *
 * @param tabId The ID of the target tab.
 * @param func The function to execute in the tab's context.
 * @param args Optional arguments to pass to the function.
 * @returns A Promise resolving with the first result from the execution, or undefined if no result.
 * @throws If script execution fails significantly (permissions, tab closed, etc.).
 */
// Placeholder - will likely need scripting wrapper import later
// import { executeScript } from '../chrome/scripting.ts';
// export async function safeExecuteScript<Args extends any[], Result>(
//   tabId: number,
//   func: (...args: Args) => Result,
//   args?: Args
// ): Promise<Awaited<Result> | undefined> {
//   try {
//     const results = await executeScript<Args, Result>({
//       target: { tabId },
//       func: func,
//       args: args,
//       world: 'MAIN', // Usually execute in the page's main world context
//     });
//     // Return the result from the main frame, if available
//     return results?.[0]?.result;
//   } catch (error: any) {
//     // Log less critical errors, re-throw critical ones
//     if (error.message.includes("Could not connect") ||
//         error.message.includes("Cannot execute script") ||
//         error.message.includes("No tab with id")) {
//       console.warn(`safeExecuteScript failed for tab ${tabId}: ${error.message}`);
//       // Optionally re-throw or return a specific error indicator
//       // throw error; // Re-throw if the caller needs to handle it critically
//       return undefined; // Or return undefined/null to indicate non-critical failure
//     } else {
//       // Log unexpected errors
//       console.error(`Unexpected error in safeExecuteScript for tab ${tabId}:`, error);
//       throw error; // Re-throw unexpected errors
//     }
//   }
// }