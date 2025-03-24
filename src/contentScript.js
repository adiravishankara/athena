// contentScript.js

// This script handles the floating button in research mode
console.log("Content script loaded");

// Set a global flag to indicate the content script is loaded
window.athenaContentScriptLoaded = true;

// Check if research mode is active
chrome.storage.local.get(['researchMode'], function(result) {
  const isResearchMode = result.researchMode || false;
  
  if (isResearchMode) {
    injectFloatingButton();
  }
});

// Listen for research mode toggle changes from storage
chrome.storage.onChanged.addListener(function(changes, namespace) {
  if (namespace === 'local' && changes.researchMode) {
    const isResearchMode = changes.researchMode.newValue;
    
    if (isResearchMode) {
      injectFloatingButton();
    } else {
      removeFloatingButton();
    }
  }
});

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('Content script received message:', request);
  
  if (request.action === 'RESEARCH_MODE_CHANGED') {
    if (request.isEnabled) {
      injectFloatingButton();
    } else {
      removeFloatingButton();
    }
    // Acknowledge receipt
    if (sendResponse) {
      sendResponse({ status: 'success' });
    }
  }
  
  // Return true for async response
  return true;
});

// Function to inject the floating button
function injectFloatingButton() {
  // Don't inject if already exists
  if (document.getElementById("athena-floating-button")) return;

  const button = document.createElement("div");
  button.id = "athena-floating-button";
  button.innerHTML = "+";
  button.style.position = "fixed";
  button.style.top = "50%"; // Position in the middle vertically
  button.style.right = "20px";
  button.style.transform = "translateY(-50%)"; // Center it perfectly
  button.style.background = "#004d40";
  button.style.color = "white";
  button.style.padding = "18px 22px"; // Increased padding for bigger button
  button.style.borderRadius = "50%";
  button.style.fontSize = "30px"; // Increased font size
  button.style.fontWeight = "bold";
  button.style.cursor = "pointer";
  button.style.zIndex = "10000"; // High z-index to appear over other elements
  button.style.boxShadow = "0 3px 8px rgba(0,0,0,0.4)"; // Enhanced shadow
  button.style.display = "flex";
  button.style.justifyContent = "center";
  button.style.alignItems = "center";
  button.style.width = "50px"; // Increased width
  button.style.height = "50px"; // Increased height

  // Make the button draggable
  let isDragging = false;
  let offsetX, offsetY;

  button.addEventListener('mousedown', function(e) {
    isDragging = true;
    offsetX = e.clientX - button.getBoundingClientRect().left;
    offsetY = e.clientY - button.getBoundingClientRect().top;
  });

  document.addEventListener('mousemove', function(e) {
    if (isDragging) {
      const left = e.clientX - offsetX;
      const top = e.clientY - offsetY;
      
      button.style.right = 'auto';
      button.style.bottom = 'auto';
      button.style.transform = 'none'; // Remove transform when dragging
      button.style.left = left + 'px';
      button.style.top = top + 'px';
    }
  });

  document.addEventListener('mouseup', function() {
    isDragging = false;
  });

  // Add click handler to save the current URL
  button.addEventListener('click', function(e) {
    if (!isDragging) {
      const url = window.location.href;
      const title = document.title;
      
      // First check if this URL already exists in the current notebook
      chrome.runtime.sendMessage({
        action: 'CHECK_URL_EXISTS',
        url: url
      }, response => {
        if (response && response.exists) {
          // URL already exists, show permanent checkmark
          button.innerHTML = "✓";
          button.style.background = '#2e7d32';
          button.style.pointerEvents = 'none'; // Disable further clicks
        } else {
          // URL doesn't exist, add it
          chrome.runtime.sendMessage({
            action: 'ADD_SOURCE',
            url: url,
            title: title,
            type: 'web',
            datetime: new Date().toISOString()
          });
          
          // Visual feedback
          const originalColor = button.style.background;
          button.style.background = '#2e7d32';
          button.innerHTML = "✓";
          
          setTimeout(() => {
            button.style.background = originalColor;
            button.innerHTML = "+";
          }, 1000);
        }
      });
    }
  });

  document.body.appendChild(button);
}

// Function to remove the floating button
function removeFloatingButton() {
  const button = document.getElementById("athena-floating-button");
  if (button) {
    button.remove();
  }
} 