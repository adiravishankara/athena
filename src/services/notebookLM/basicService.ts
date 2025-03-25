/// <reference types="chrome"/>
import { safeExecuteScript } from './utils';

export interface Source {
  url: string;
  title?: string;
}

export class NotebookLMService {
  private async addWebsiteSource(tabId: number, url: string): Promise<void> {
    try {
      console.log("Adding website source:", url);
      
      // Step 1: Click the Add source button
      await safeExecuteScript<boolean>(tabId, () => {
        console.log("Looking for Add source button...");
        const addSourceSelectors = [
          'button[aria-label="Add source"]',
          '.add-source-button',
          'button.mat-mdc-button-base',
          // Looking at the screenshot, we can also try finding by the + icon
          'button:has(span.material-icons)',
          // Or by the specific text content
          '[role="button"]'
        ];
        
        let addButton = null;
        for (const selector of addSourceSelectors) {
          const elements = document.querySelectorAll(selector);
          console.log(`Found ${elements.length} elements for selector: ${selector}`);
          
          for (const element of elements) {
            // Check both the button text and any span/div children
            const buttonText = element.textContent?.toLowerCase() || "";
            const hasAddIcon = element.querySelector('.material-icons')?.textContent === 'add';
            console.log(`Checking element with text: "${buttonText}", hasAddIcon: ${hasAddIcon}`);
            
            if (buttonText.includes("add source") || hasAddIcon) {
              addButton = element;
              break;
            }
          }
          if (addButton) break;
        }
        
        if (!addButton) {
          console.error("Could not find Add source button");
          return false;
        }
        
        console.log("Found Add source button, clicking...");
        (addButton as HTMLElement).click();
        return true;
      });
      
      // Wait for the source dialog to appear
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Step 2: Click Website option and enter URL
      await safeExecuteScript<boolean>(tabId, (sourceUrl: string) => {
        // Find and click Website option
        const websiteSelectors = [
          'mat-chip[aria-label="Website"]',
          'mat-chip.mat-mdc-chip',
          '.mdc-evolution-chip',
          'button.mat-mdc-chip'
        ];
        
        let websiteButton = null;
        for (const selector of websiteSelectors) {
          const elements = document.querySelectorAll(selector);
          console.log(`Found ${elements.length} elements for selector: ${selector}`);
          
          for (const element of elements) {
            const text = element.textContent?.toLowerCase() || "";
            const hasWebIcon = element.querySelector('mat-icon')?.textContent === 'web';
            console.log(`Element text: "${text}", hasWebIcon: ${hasWebIcon}`);
            
            if (text.includes('website') || hasWebIcon) {
              websiteButton = element;
              break;
            }
          }
          if (websiteButton) break;
        }
        
        if (!websiteButton) {
          console.error("Could not find Website button");
          return false;
        }
        
        console.log("Found Website button, clicking...");
        (websiteButton as HTMLElement).click();
        
        // Find and fill URL input
        setTimeout(() => {
          const urlSelectors = [
            'input[type="url"]',
            'input[placeholder*="url" i]',
            'input.mat-mdc-input-element'
          ];
          
          let urlInput = null;
          for (const selector of urlSelectors) {
            urlInput = document.querySelector(selector);
            if (urlInput) break;
          }
          
          if (!urlInput) {
            console.error("Could not find URL input");
            return false;
          }
          
          console.log("Found URL input, entering URL:", sourceUrl);
          (urlInput as HTMLInputElement).value = sourceUrl;
          (urlInput as HTMLInputElement).dispatchEvent(new Event('input', { bubbles: true }));
          (urlInput as HTMLInputElement).dispatchEvent(new Event('change', { bubbles: true }));
          
          // Click Insert button
          setTimeout(() => {
            const insertSelectors = [
              'button.mat-mdc-button-base',
              '.mat-mdc-button:not([disabled])',
              '.mdc-button'
            ];
            
            let insertButton = null;
            for (const selector of insertSelectors) {
              const elements = document.querySelectorAll(selector);
              for (const element of elements) {
                if (element.textContent?.toLowerCase().includes('insert')) {
                  insertButton = element;
                  break;
                }
              }
              if (insertButton) break;
            }
            
            if (!insertButton) {
              console.error("Could not find Insert button");
              return false;
            }
            
            console.log("Found Insert button, clicking...");
            (insertButton as HTMLElement).click();
          }, 500);
        }, 500);
        
        return true;
      }, url);
    } catch (error) {
      console.error("Error adding website source:", error);
      throw error;
    }
  }

  public async addSource(source: Source): Promise<void> {
    try {
      console.log("Adding source:", source);
      // Get the active tab since we expect NotebookLM to be open
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab.id) {
        throw new Error("No active tab found");
      }
      await this.addWebsiteSource(tab.id, source.url);
      console.log("Successfully added source to NotebookLM");
    } catch (error) {
      console.error("Error adding source to NotebookLM:", error);
      throw error;
    }
  }
}