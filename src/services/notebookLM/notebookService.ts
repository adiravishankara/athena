/// <reference types="chrome"/>
import { waitForTabLoad, safeExecuteScript } from './utils';

export interface Source {
  url: string;
  title?: string;
}

export class NotebookLMService {
  private async openNotebookLM(): Promise<number> {
    try {
      console.log("Opening NotebookLM...");
      const tab = await chrome.tabs.create({
        url: "https://notebooklm.google.com/",
      });
      
      if (!tab.id) {
        throw new Error("Failed to create NotebookLM tab");
      }

      await waitForTabLoad(tab.id);
      // Add extra delay to ensure the UI is fully rendered
      await new Promise(resolve => setTimeout(resolve, 5000));
      console.log("NotebookLM opened successfully, tab ID:", tab.id);
      return tab.id;
    } catch (error) {
      console.error("Error opening NotebookLM:", error);
      throw error;
    }
  }
  private async openInspectBar(tabId: number): Promise<void> {
    try {
      console.log("Opening inspect bar and console for tab ID:", tabId);
      await chrome.tabs.executeScript(tabId, { code: 'window.open("chrome://inspect", "_self");' });
      console.log("Inspect bar and console opened successfully.");
    } catch (error) {
      console.error("Error opening inspect bar and console:", error);
      throw error;
    }
  }

  private async clickCreateNewButton(tabId: number): Promise<void> {
    try {
      console.log("Attempting to click 'Create New' button...");
      await safeExecuteScript<boolean>(tabId, () => {
        console.log("Trying to find and click 'Create New' button");
        
        const selectors = [
          "button.create-new-button",
          '[data-test-id="create-new-button"]',
          "button.mat-button",
          "button.mat-raised-button",
          "button.mat-flat-button",
          "button",
          'a[role="button"]',
        ];

        // Try each selector
        const trySelectors = () => {
          for (const selector of selectors) {
            try {
              const elements = document.querySelectorAll(selector);
              console.log(`Found ${elements.length} elements for selector: ${selector}`);
              
              for (const element of elements) {
                const text = element.textContent?.toLowerCase() || "";
                console.log(`Element text: "${text}"`);
                if (text.includes("create new")) {
                  console.log("Found 'Create New' button, clicking...");
                  (element as HTMLElement).click();
                  return true;
                }
              }
            } catch (e) {
              console.error(`Error with selector ${selector}:`, e);
            }
          }
          return false;
        };
        
        // First attempt
        const found = trySelectors();
        if (!found) {
          console.log("First attempt failed, trying again after delay...");
          // Wait and try again
          setTimeout(() => {
            const retryFound = trySelectors();
            if (!retryFound) {
              console.error("Could not find 'Create New' button after retry");
            }
          }, 2000);
        }
        
        return found;
      });
      
      // Wait for the dialog to appear
      console.log("Waiting for dialog to appear...");
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error("Error clicking Create New button:", error);
      throw error;
    }
  }

  private async addWebsiteSource(tabId: number, url: string): Promise<void> {
    try {
      console.log("Adding website source:", url);
      
      // Step 1: Click the Website chip
      await safeExecuteScript<boolean>(tabId, () => {
        console.log("Looking for website chip...");
        const websiteSelectors = [
          'mat-chip[jslog*="230546"]',
          "mat-chip.mat-mdc-chip",
          '.mat-mdc-chip:has(mat-icon[data-mat-icon-type="font"])',
          ".mdc-evolution-chip",
          ".mat-mdc-chip .mdc-evolution-chip__text-label",
          '[class*="chip"]',
        ];
        
        let websiteChip = null;
        
        for (const selector of websiteSelectors) {
          const elements = document.querySelectorAll(selector);
          console.log(`Found ${elements.length} elements for selector: ${selector}`);
          
          for (const element of elements) {
            const textContent = element.textContent?.toLowerCase() || "";
            const hasWebIcon = element.querySelector('mat-icon[data-mat-icon-type="font"]')?.textContent === "web";
            console.log(`Element text: "${textContent}", hasWebIcon: ${hasWebIcon}`);
            
            if (textContent.includes("website") || hasWebIcon) {
              websiteChip = element;
              break;
            }
          }
          if (websiteChip) break;
        }
        
        if (!websiteChip) {
          console.error("Could not find 'Website' chip");
          return false;
        }
        
        console.log("Found 'Website' chip, clicking...");
        (websiteChip as HTMLElement).click();
        return true;
      });
      
      // Wait for the source selection UI to appear
      console.log("Waiting for source selection UI...");
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Step 2: Enter the URL
      await safeExecuteScript<boolean>(tabId, (sourceUrl: string) => {
        console.log("Looking for URL input field...");
        const urlInputSelectors = [
          'input[type="url"]',
          'input[placeholder*="url" i]',
          'textarea[placeholder*="url" i]',
          "input.mat-mdc-input-element",
          ".mat-mdc-form-field input",
          ".mat-mdc-input-element",
        ];
        
        let urlInput = null;
        
        for (const selector of urlInputSelectors) {
          const element = document.querySelector(selector);
          if (element) {
            console.log(`Found input with selector: ${selector}`);
            urlInput = element;
            break;
          }
        }
        
        if (!urlInput) {
          console.error("Could not find URL input field");
          return false;
        }
        
        console.log("Found URL input field, entering URL:", sourceUrl);
        (urlInput as HTMLInputElement).value = sourceUrl;
        (urlInput as HTMLInputElement).dispatchEvent(new Event("input", { bubbles: true }));
        (urlInput as HTMLInputElement).dispatchEvent(new Event("change", { bubbles: true }));
        return true;
      }, url);
      
      // Wait for URL to be processed
      console.log("Waiting for URL to be processed...");
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Step 3: Click the Insert button
      await safeExecuteScript<boolean>(tabId, () => {
        console.log("Looking for Insert button...");
        const insertSelectors = [
          "button.mat-mdc-button-base",
          ".mat-mdc-button:not([disabled])",
          ".mdc-button",
          '[jslog*="generic_click"]',
        ];
        
        let insertButton = null;
        
        for (const selector of insertSelectors) {
          const elements = document.querySelectorAll(selector);
          console.log(`Found ${elements.length} elements for selector: ${selector}`);
          
          for (const element of elements) {
            const text = element.textContent?.toLowerCase() || "";
            console.log(`Button text: "${text}"`);
            if (text.includes("insert")) {
              insertButton = element;
              break;
            }
          }
          if (insertButton) break;
        }
        
        if (!insertButton) {
          console.error("Could not find 'Insert' button");
          return false;
        }
        
        console.log("Found 'Insert' button, clicking...");
        (insertButton as HTMLElement).click();
        console.log("Source added successfully");
        return true;
      });
      
      // Wait for source to be added
      console.log("Waiting for source to be added...");
      await new Promise(resolve => setTimeout(resolve, 3000));
    } catch (error) {
      console.error("Error adding website source:", error);
      throw error;
    }
  }

  public async addSource(source: Source): Promise<void> {
    try {
      console.log("Adding source:", source);
      const tabId = await this.openNotebookLM();
      await this.openInspectBar(tabId);
      await this.clickCreateNewButton(tabId);
      await this.addWebsiteSource(tabId, source.url);
      console.log("Successfully added source to NotebookLM");
    } catch (error) {
      console.error("Error adding source to NotebookLM:", error);
      throw error;
    }
  }
} 