/// <reference types="chrome"/>
import { safeExecuteScript } from './utils';
import { getLinkType, LinkType } from '../../utils/urlUtils';
import {
  findElementByText,
  isNotebookLMOpen,
  openNotebookLM,
  readMainPage,
  openNotebook,
  openSourcesPanel,
  verifySource
} from '../../utils/notebookLMUtils';

export interface Source {
  url: string;
  title?: string;
}

export type SourceType = 'website' | 'youtube' | 'googledocs' | 'googleslides';

export class NotebookLMService {
  // Determine the source type based on URL
  private getSourceType(url: string): LinkType {
    return getLinkType(url);
  }

  private async addSourceToTab(tabId: number, url: string): Promise<void> {
    try {
      const sourceType = this.getSourceType(url);
      console.log(`Adding ${sourceType} source:`, url);
      
      // Step 1: Ensure sources panel is open
      const isPanelOpen = await openSourcesPanel();
      if (!isPanelOpen) {
        throw new Error('Failed to open sources panel');
      }

      // Step 2: Click the Add source button
      const addButton = await findElementByText('Add source');
      if (!addButton) {
        throw new Error('Could not find Add source button');
      }
      addButton.click();

      // Wait for source type options to appear
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Step 3: Click the appropriate source type button and enter URL
      await safeExecuteScript<boolean>(tabId, async (sourceUrl: string, type: string) => {
        console.log(`Looking for ${type} button...`);
        
        // Button identifiers for each source type
        const buttonIdentifiers = {
          'website': {
            label: 'Website',
            icon: 'web',
            className: 'website'
          },
          'youtube': {
            label: 'YouTube',
            icon: 'smart_display',
            className: 'youtube'
          },
          'googledocs': {
            label: 'Google Docs',
            icon: 'description',
            className: 'google-docs'
          },
          'googleslides': {
            label: 'Google Slides',
            icon: 'slideshow',
            className: 'google-slides'
          }
        };
        
        const targetInfo = buttonIdentifiers[type as keyof typeof buttonIdentifiers] || buttonIdentifiers.website;
        
        // Find the target button using our utility
        const targetButton = await findElementByText(targetInfo.label);
        if (!targetButton) {
          console.error(`Could not find button for ${type}`);
          return false;
        }
        
        // Click the found button
        console.log(`Clicking button for ${type}`);
        targetButton.click();
        
        // Find and fill URL input after a short delay
        return new Promise<boolean>((resolve) => {
          setTimeout(() => {
            // URL input fields
            const urlSelectors = [
              'input[type="url"]',
              'input[placeholder*="url" i]',
              'input[placeholder*="link" i]',
              'input.mat-mdc-input-element',
              'textarea.mat-mdc-input-element',
              'input:not([type="hidden"])',
              'textarea'
            ];
            
            let urlInput = null;
            for (const selector of urlSelectors) {
              const inputs = document.querySelectorAll(selector);
              console.log(`Found ${inputs.length} inputs with selector: ${selector}`);
              
              for (const input of inputs) {
                // Check if it's visible
                const style = window.getComputedStyle(input);
                if (style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0') {
                  console.log(`Found visible input: ${input.outerHTML}`);
                  urlInput = input;
                  break;
                }
              }
              
              if (urlInput) break;
            }
            
            if (!urlInput) {
              console.error("Could not find URL input");
              resolve(false);
              return;
            }
            
            console.log("Found URL input, entering URL:", sourceUrl);
            (urlInput as HTMLInputElement | HTMLTextAreaElement).value = sourceUrl;
            (urlInput as HTMLInputElement | HTMLTextAreaElement).dispatchEvent(new Event('input', { bubbles: true }));
            (urlInput as HTMLInputElement | HTMLTextAreaElement).dispatchEvent(new Event('change', { bubbles: true }));
            
            // Click Insert button
            setTimeout(async () => {
              const insertButton = await findElementByText('Insert');
              if (!insertButton) {
                console.error("Could not find Insert button");
                resolve(false);
                return;
              }
              
              console.log("Clicking Insert button");
              insertButton.click();
              resolve(true);
            }, 500);
          }, 1000);
        });
      }, url, sourceType);
      
      // Wait a bit longer after adding source
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error("Error adding source:", error);
      throw error;
    }
  }

  public async addSource(source: Source): Promise<void> {
    try {
      console.log("Adding source:", source);
      
      // Step 1: Ensure NotebookLM is open
      const isOpen = await isNotebookLMOpen();
      if (!isOpen) {
        const tabId = await openNotebookLM();
        // Wait for page to load
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      // Step 2: Get active NotebookLM tab
      const [tab] = await chrome.tabs.query({ url: '*://notebooklm.google.com/*' });
      if (!tab.id) {
        throw new Error("No NotebookLM tab found");
      }

      // Step 3: Verify source doesn't already exist
      const exists = await verifySource(source.url);
      if (exists) {
        console.log("Source already exists in notebook");
        return;
      }

      // Step 4: Add the source
      await this.addSourceToTab(tab.id, source.url);
      console.log("Successfully added source to NotebookLM");
    } catch (error) {
      console.error("Error adding source to NotebookLM:", error);
      throw error;
    }
  }
}