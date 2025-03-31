/// <reference types="chrome"/>
/// <reference lib="dom" />

import { ActionMessage, ActionResponse, SourceType } from '../common/types.ts';

console.log("Athena Content Script loaded (v2).");

const FLOATING_BUTTON_ID = "athena-floating-button";
const TOAST_CLASS = "athena-toast";
const TOAST_SHOW_CLASS = "show";
const TOAST_SUCCESS_CLASS = "success";
const TOAST_ERROR_CLASS = "error";

let floatingButtonElement: HTMLButtonElement | null = null;

// --- Button Management ---

function createOrUpdateButton(isSaved: boolean, isYouTube: boolean): HTMLButtonElement {
    if (!floatingButtonElement) {
        floatingButtonElement = document.createElement("button");
        floatingButtonElement.id = FLOATING_BUTTON_ID;
        // Basic structure, CSS handles the rest
        floatingButtonElement.addEventListener('click', handleButtonClick);
        document.body.appendChild(floatingButtonElement);
        console.log("Floating button created.");
    }

    // Update state using CSS classes and attributes
    floatingButtonElement.textContent = isSaved ? "✓" : "+";
    floatingButtonElement.classList.toggle('saved', isSaved);
    floatingButtonElement.classList.toggle('youtube', isYouTube); // Add class for potential YouTube-specific styles

    floatingButtonElement.title = isSaved
        ? (isYouTube ? "YouTube video already in notebook" : "Page already in notebook")
        : (isYouTube ? "Add YouTube video to notebook" : "Add page to notebook");

    return floatingButtonElement;
}

function removeFloatingButton() {
    if (floatingButtonElement) {
        floatingButtonElement.remove();
        floatingButtonElement = null;
        console.log("Floating button removed.");
    }
}

// --- Button Event Handlers ---

function handleButtonClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    console.log("Floating button clicked.");

    const url = window.location.href;
    const title = document.title || url; // Use URL as fallback title

    // Basic type detection
    let linkType: SourceType = 'website'; // Default to 'website'
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
        linkType = 'youtube';
    } else if (lowerUrl.includes('docs.google.com/document')) {
        linkType = 'googledocs';
    } else if (lowerUrl.includes('docs.google.com/presentation') || lowerUrl.includes('slides.google.com')) {
        linkType = 'googleslides';
    } else if (lowerUrl.endsWith('.pdf')) {
        linkType = 'pdf';
    }

    // Send message to background script to add the source
    // Use the action name expected by the background script
    const message: ActionMessage = {
        action: 'ADD_SOURCE_FROM_CURRENT_TAB',
        // Background script will get details from the sender tab
    };

    chrome.runtime.sendMessage(message, (response: ActionResponse) => {
        if (chrome.runtime.lastError) {
            console.error("Error sending ADD_SOURCE_FROM_CURRENT_TAB message:", chrome.runtime.lastError);
            showToast("Error adding source: Connection issue", true);
        } else if (response && response.status === 'success') {
            console.log("Source add request sent successfully.", response.data);
            showToast(`Added ${linkType} to notebook`, false);
            // Update button state visually immediately
            createOrUpdateButton(true, linkType === 'youtube');
        } else {
            console.error("Error adding source:", response?.error);
            showToast(response?.error || "Failed to add source", true);
        }
    });
}

// --- Toast Notifications ---

function showToast(message: string, isError = false) {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.classList.add(TOAST_CLASS);
    toast.classList.toggle(TOAST_ERROR_CLASS, isError);
    toast.classList.toggle(TOAST_SUCCESS_CLASS, !isError);

    document.body.appendChild(toast);

    // Trigger fade in
    requestAnimationFrame(() => {
        toast.classList.add(TOAST_SHOW_CLASS);
    });

    // Set timer to fade out and remove
    setTimeout(() => {
        toast.classList.remove(TOAST_SHOW_CLASS);
        // Remove element after transition ends
        toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    }, 2500); // Duration toast is visible
}


// --- Message Listener (from Background via window.postMessage) ---

window.addEventListener('message', (event) => {
    // We only accept messages from ourselves
    if (event.source !== window) {
        return;
    }

    const message = event.data;

    // Check if it's the type of message we expect
    if (message && message.type && message.type.startsWith('ATHENA_')) {
        console.log("Content script received window message:", message);

        switch (message.type) {
            case 'ATHENA_INIT_FLOATING_BUTTON':
                if (message.payload) {
                    createOrUpdateButton(message.payload.isSaved, message.payload.isYouTube);
                }
                break;
            case 'ATHENA_REMOVE_FLOATING_BUTTON':
                removeFloatingButton();
                break;
            // Add other message types from background if needed
        }
    }
}, false);

console.log("Content script listeners attached (v2).");