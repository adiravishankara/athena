import { getResearchMode as storeGetResearchMode, setResearchMode as storeSetResearchMode, getCurrentNotebookName, getNotebooks } from './notebookStore.ts';
// import { getTab } from '../chrome/tabs.ts'; // May not be needed if URL is passed directly - Removed unused import
import { normalizeUrlForComparison } from '../utils/utils.ts'; // Correct path to utils

// --- Research Mode ---

/**
 * Retrieves the current state of research mode from storage.
 */
export async function getResearchMode(): Promise<boolean> {
    return await storeGetResearchMode();
}

/**
 * Sets the state of research mode in storage.
 * @param enabled True to enable research mode, false to disable.
 */
export async function setResearchMode(enabled: boolean): Promise<void> {
    await storeSetResearchMode(enabled);
    // Note: Background script might need to iterate through tabs and send SHOW/HIDE messages
    // or rely on content scripts listening to storage changes (simpler).
}

/**
 * Toggles the current state of research mode.
 */
export async function toggleResearchMode(): Promise<boolean> {
    const currentMode = await getResearchMode();
    const newMode = !currentMode;
    await setResearchMode(newMode);
    return newMode;
}

// --- Button Visibility & State ---

/**
 * Checks if a given URL is valid for injecting the content script/button.
 * Prevents injection into chrome://, about:, etc. pages.
 * @param url The URL string to check.
 * @returns True if the URL is valid for injection, false otherwise.
 */
function isUrlInjectable(url: string | undefined): boolean {
    if (!url) {
        return false;
    }
    // Basic checks for common restricted schemes
    return !(
        url.startsWith('chrome://') ||
        url.startsWith('chrome-extension://') ||
        url.startsWith('edge://') ||
        url.startsWith('about:') ||
        url.startsWith('view-source:') ||
        url.startsWith('file://') || // Often restricted
        !url.startsWith('http://') && !url.startsWith('https://') // Ensure http or https
    );
}

/**
 * Determines if the floating button should be shown for a given tab/URL.
 * Checks research mode status and URL injectability.
 * @param url The URL of the tab.
 * @returns A Promise resolving to true if the button should be shown, false otherwise.
 */
export async function shouldShowButtonForUrl(url: string | undefined): Promise<boolean> {
    const researchModeEnabled = await getResearchMode();
    if (!researchModeEnabled) {
        return false;
    }
    return isUrlInjectable(url);
}

/**
 * Gets the complete state needed for the floating button in a specific tab/URL.
 * Determines visibility, whether the URL is saved, and if it's a YouTube link.
 * @param url The URL of the tab.
 * @returns A Promise resolving to an object with button state information.
 */
export async function getButtonStateForUrl(url: string | undefined): Promise<{ shouldShow: boolean; isSaved: boolean; isYouTube: boolean }> {
    const shouldShow = await shouldShowButtonForUrl(url);
    if (!shouldShow || !url) {
        return { shouldShow: false, isSaved: false, isYouTube: false };
    }

    let isSaved = false;
    const isYouTube = url.toLowerCase().includes('youtube.com') || url.toLowerCase().includes('youtu.be');

    try {
        const currentNotebookName = await getCurrentNotebookName();
        if (currentNotebookName) {
            const notebooks = await getNotebooks();
            const currentNotebook = notebooks[currentNotebookName];
            if (currentNotebook && currentNotebook.sources) {
                const normalizedUrl = normalizeUrlForComparison(url);
                isSaved = Object.values(currentNotebook.sources).some(
                    source => normalizeUrlForComparison(source.url) === normalizedUrl
                );
            }
        }
    } catch (error) {
        console.error("Error checking if URL is saved:", error);
        // Proceed, assuming not saved if there's an error reading storage
    }

    return { shouldShow: true, isSaved, isYouTube };
}