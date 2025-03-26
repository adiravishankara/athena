// Types and interfaces for NotebookLM automation
interface NotebookInfo {
  id: string;
  title: string;
  url: string;
}

interface ElementFinderOptions {
  timeout?: number;
  retries?: number;
  retryInterval?: number;
}

const DEFAULT_OPTIONS: ElementFinderOptions = {
  timeout: 5000,
  retries: 3,
  retryInterval: 1000
};

/**
 * Utility function to find an element by its text content
 * @param textContent Text to search for
 * @param options Optional configuration for element finding
 * @returns Promise<HTMLElement | null>
 */
export async function findElementByText(
  textContent: string,
  options: ElementFinderOptions = DEFAULT_OPTIONS
): Promise<HTMLElement | null> {
  const findElement = () => {
    // Try different strategies to find the element
    const strategies = [
      // Strategy 1: Direct text match
      () => Array.from(document.querySelectorAll('*')).find(
        el => el.textContent?.trim() === textContent
      ),
      // Strategy 2: Case-insensitive contains
      () => Array.from(document.querySelectorAll('*')).find(
        el => el.textContent?.toLowerCase().includes(textContent.toLowerCase())
      ),
      // Strategy 3: Button/link with text
      () => Array.from(document.querySelectorAll('button, a')).find(
        el => el.textContent?.toLowerCase().includes(textContent.toLowerCase())
      )
    ];

    for (const strategy of strategies) {
      const element = strategy();
      if (element) return element as HTMLElement;
    }

    return null;
  };

  let retries = options.retries || DEFAULT_OPTIONS.retries;
  const interval = options.retryInterval || DEFAULT_OPTIONS.retryInterval;

  while (retries > 0) {
    const element = findElement();
    if (element) return element;

    await new Promise(resolve => setTimeout(resolve, interval));
    retries--;
  }

  return null;
}

/**
 * Check if NotebookLM is currently open
 * @returns Promise<boolean>
 */
export async function isNotebookLMOpen(): Promise<boolean> {
  return new Promise((resolve) => {
    chrome.tabs.query({}, (tabs) => {
      const notebookTab = tabs.find(tab => 
        tab.url?.includes('notebooklm.google.com')
      );
      resolve(!!notebookTab);
    });
  });
}

/**
 * Open NotebookLM if not already open
 * @returns Promise<number> Tab ID of NotebookLM
 */
export async function openNotebookLM(): Promise<number> {
  const isOpen = await isNotebookLMOpen();
  
  if (!isOpen) {
    return new Promise((resolve) => {
      chrome.tabs.create(
        { url: 'https://notebooklm.google.com' },
        (tab) => resolve(tab.id!)
      );
    });
  }

  return new Promise((resolve) => {
    chrome.tabs.query({}, (tabs) => {
      const notebookTab = tabs.find(tab => 
        tab.url?.includes('notebooklm.google.com')
      );
      if (notebookTab?.id) {
        chrome.tabs.update(notebookTab.id, { active: true });
        resolve(notebookTab.id);
      }
    });
  });
}

/**
 * Extract notebook information from the main page
 * @returns Promise<NotebookInfo[]>
 */
export async function readMainPage(): Promise<NotebookInfo[]> {
  const notebooks: NotebookInfo[] = [];
  
  // This function will be injected into the page
  const extractNotebooks = () => {
    const notebookElements = document.querySelectorAll('.project-button-title');
    return Array.from(notebookElements).map(el => {
      const title = el.textContent?.trim() || '';
      const id = el.id?.replace('-title', '') || '';
      return {
        id,
        title,
        url: `https://notebooklm.google.com/notebook/${id}`
      };
    });
  };

  // Execute the function in the NotebookLM tab
  return new Promise((resolve) => {
    chrome.tabs.query({ url: '*://notebooklm.google.com/*' }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.scripting.executeScript(
          {
            target: { tabId: tabs[0].id },
            func: extractNotebooks
          },
          (results) => {
            if (results && results[0]?.result) {
              resolve(results[0].result);
            } else {
              resolve([]);
            }
          }
        );
      } else {
        resolve([]);
      }
    });
  });
}

/**
 * Open a specific notebook or create a new one
 * @param notebookId Optional notebook ID to open
 * @returns Promise<void>
 */
export async function openNotebook(notebookId?: string): Promise<void> {
  if (notebookId) {
    const url = `https://notebooklm.google.com/notebook/${notebookId}`;
    return new Promise((resolve) => {
      chrome.tabs.update({ url }, () => resolve());
    });
  } else {
    // Find and click the "Create new" button
    const createButton = await findElementByText('Create new');
    if (createButton) {
      (createButton as HTMLElement).click();
    }
  }
}

/**
 * Open the sources panel if not already open
 * @returns Promise<boolean>
 */
export async function openSourcesPanel(): Promise<boolean> {
  // This function will be injected into the page
  const openPanel = () => {
    const sourcesPanel = document.querySelector('.source-panel');
    if (!sourcesPanel) {
      const sourcesButton = document.querySelector('button[aria-label="Sources"]');
      if (sourcesButton) {
        (sourcesButton as HTMLElement).click();
        return true;
      }
      return false;
    }
    return true;
  };

  return new Promise((resolve) => {
    chrome.tabs.query({ url: '*://notebooklm.google.com/*' }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.scripting.executeScript(
          {
            target: { tabId: tabs[0].id },
            func: openPanel
          },
          (results) => {
            resolve(results && results[0]?.result === true);
          }
        );
      } else {
        resolve(false);
      }
    });
  });
}

/**
 * Verify if a source exists in the current notebook
 * @param url URL to verify
 * @returns Promise<boolean>
 */
export async function verifySource(url: string): Promise<boolean> {
  // This function will be injected into the page
  const checkSource = (sourceUrl: string) => {
    const sources = document.querySelectorAll('.source-url');
    return Array.from(sources).some(
      el => el.textContent?.includes(sourceUrl)
    );
  };

  return new Promise((resolve) => {
    chrome.tabs.query({ url: '*://notebooklm.google.com/*' }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.scripting.executeScript(
          {
            target: { tabId: tabs[0].id },
            func: checkSource,
            args: [url]
          },
          (results) => {
            resolve(results && results[0]?.result === true);
          }
        );
      } else {
        resolve(false);
      }
    });
  });
} 