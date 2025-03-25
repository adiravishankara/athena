/// <reference types="chrome"/>
import { safeExecuteScript } from './utils';

export interface Source {
  url: string;
  title?: string;
}

export type SourceType = 'website' | 'youtube' | 'googledocs' | 'googleslides';

export class NotebookLMService {
  // Determine the source type based on URL
  private getSourceType(url: string): SourceType {
    const lowerUrl = url.toLowerCase();
    
    if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
      return 'youtube';
    } else if (lowerUrl.includes('docs.google.com/document')) {
      return 'googledocs';
    } else if (lowerUrl.includes('docs.google.com/presentation')) {
      return 'googleslides';
    } else {
      // Default to website for all other URLs
      return 'website';
    }
  }

  private async addSourceToTab(tabId: number, url: string): Promise<void> {
    try {
      const sourceType = this.getSourceType(url);
      console.log(`Adding ${sourceType} source:`, url);
      
      // Step 1: Click the Add source button
      await safeExecuteScript<boolean>(tabId, () => {
        console.log("Looking for Add source button...");
        const addSourceSelectors = [
          'button[aria-label="Add source"]',
          'button:not([disabled])',
          '.add-source-button',
          'button.mat-mdc-button-base'
        ];
        
        let addButton = null;
        for (const selector of addSourceSelectors) {
          const elements = document.querySelectorAll(selector);
          console.log(`Found ${elements.length} elements for selector: ${selector}`);
          
          for (const element of elements) {
            // Check the button text
            const buttonText = element.textContent?.toLowerCase() || "";
            console.log(`Checking element with text: "${buttonText}"`);
            
            if (buttonText.includes("add source")) {
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
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Step 2: Click the appropriate source type button and enter URL
      await safeExecuteScript<boolean>(tabId, (sourceUrl: string, type: string) => {
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
        
        // Find all mat-chips, buttons and clickable elements
        const allElements = document.querySelectorAll('mat-chip, button, [role="button"], .mat-mdc-chip, .mdc-evolution-chip');
        console.log(`Found ${allElements.length} potential clickable elements`);
        
        // Find the target button by examining text content
        let targetButton = null;
        
        // First attempt: Look for exact match with the target label
        for (const element of allElements) {
          const text = element.textContent?.toLowerCase() || "";
          console.log(`Element text: "${text}"`);
          
          // Check if text content matches our target (either exact or contains)
          if (text === targetInfo.label.toLowerCase() || 
              text.includes(targetInfo.label.toLowerCase())) {
            console.log(`Found matching button for ${targetInfo.label}`);
            targetButton = element;
            break;
          }
        }
        
        // Second attempt: Check for partial text matches if exact didn't work
        if (!targetButton) {
          console.log(`No exact match found, looking for partial matches for ${type}`);
          
          // For Google Docs/Slides, try just looking for "Google"
          if (type === 'googledocs' || type === 'googleslides') {
            for (const element of allElements) {
              const text = element.textContent?.toLowerCase() || "";
              if (text.includes("google")) {
                if ((type === 'googledocs' && text.includes("doc")) || 
                    (type === 'googleslides' && (text.includes("slide") || text.includes("presentation")))) {
                  console.log(`Found ${type} button with partial match: ${text}`);
                  targetButton = element;
                  break;
                }
              }
            }
          } 
          
          // For YouTube, try looking for just "tube" or "video"
          if (type === 'youtube' && !targetButton) {
            for (const element of allElements) {
              const text = element.textContent?.toLowerCase() || "";
              if (text.includes("tube") || text.includes("video")) {
                console.log(`Found YouTube button with partial match: ${text}`);
                targetButton = element;
                break;
              }
            }
          }
          
          // For Website, try looking for "web" or "site"
          if (type === 'website' && !targetButton) {
            for (const element of allElements) {
              const text = element.textContent?.toLowerCase() || "";
              if (text.includes("web") || text.includes("site") || text.includes("link")) {
                console.log(`Found Website button with partial match: ${text}`);
                targetButton = element;
                break;
              }
            }
          }
        }
        
        // Last resort: Look for anything that might be a source type chip
        if (!targetButton) {
          console.log("Using last resort method to find source type options");
          
          // Look for horizontal list items that look like chips
          const chipContainers = document.querySelectorAll('.mat-mdc-chip-set, mat-chip-set, .mat-chip-list, .mat-chip-grid');
          
          for (const container of chipContainers) {
            const chips = container.querySelectorAll('mat-chip, .mat-mdc-chip, .mdc-evolution-chip, button');
            console.log(`Found ${chips.length} chips in container`);
            
            if (chips.length > 0) {
              // Depending on the type, try to find the right chip
              for (const chip of chips) {
                const chipText = chip.textContent?.toLowerCase() || "";
                
                if ((type === 'website' && (chipText.includes('web') || chipText.includes('site') || chipText.includes('link'))) ||
                    (type === 'youtube' && (chipText.includes('tube') || chipText.includes('video'))) ||
                    (type === 'googledocs' && (chipText.includes('doc'))) ||
                    (type === 'googleslides' && (chipText.includes('slide')))) {
                  console.log(`Found chip that might be ${type}: ${chipText}`);
                  targetButton = chip;
                  break;
                }
              }
            }
            
            if (targetButton) break;
          }
        }
        
        // Absolute last resort: Just click the first chip/button we find
        if (!targetButton) {
          console.error(`Could not find button for ${type}, trying first button in source options`);
          
          const firstOption = document.querySelector('mat-chip, .mat-mdc-chip, button.mat-mdc-button-base');
          if (firstOption) {
            console.log(`Clicking first source option as fallback: ${firstOption.textContent}`);
            targetButton = firstOption;
          } else {
            console.error("Could not find any source type options");
            return false;
          }
        }
        
        // Click the found button
        console.log(`Clicking button for ${type}`);
        (targetButton as HTMLElement).click();
        
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
            setTimeout(() => {
              // Look for insert/add/continue buttons
              const buttonSelectors = [
                'button:not([disabled])',
                '.mat-mdc-button-base:not([disabled])',
                '.mdc-button:not([disabled])',
                'button.mat-button',
                'button.mat-flat-button',
                'button.mat-raised-button'
              ];
              
              let actionButton = null;
              for (const selector of buttonSelectors) {
                const buttons = document.querySelectorAll(selector);
                console.log(`Found ${buttons.length} buttons with selector: ${selector}`);
                
                for (const button of buttons) {
                  const buttonText = button.textContent?.toLowerCase() || "";
                  if (buttonText.includes('insert')) {
                    console.log(`Found button with text: ${buttonText}`);
                    actionButton = button;
                    break;
                  }
                }
                
                if (actionButton) break;
              }
              
              if (!actionButton) {
                console.error("Could not find Insert/Add button");
                resolve(false);
                return;
              }
              
              console.log("Clicking Insert/Add button");
              (actionButton as HTMLElement).click();
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
      // Get the active tab since we expect NotebookLM to be open
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab.id) {
        throw new Error("No active tab found");
      }
      await this.addSourceToTab(tab.id, source.url);
      console.log("Successfully added source to NotebookLM");
    } catch (error) {
      console.error("Error adding source to NotebookLM:", error);
      throw error;
    }
  }
}