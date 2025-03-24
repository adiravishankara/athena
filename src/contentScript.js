// contentScript.js

// This script checks if research mode is active and injects the floating button if it is
console.log("Content script loaded");

// Check if research mode is active
chrome.storage.local.get(['researchMode'], function(result) {
  const isResearchMode = result.researchMode || false;
  
  if (isResearchMode) {
    injectFloatingButton();
  }
});

// Listen for research mode toggle changes
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

// Function to inject the floating button
function injectFloatingButton() {
  if (document.getElementById("athena-floating-button")) return;

  const button = document.createElement("div");
  button.id = "athena-floating-button";
  button.innerHTML = "+";
  button.style.position = "fixed";
  button.style.bottom = "20px";
  button.style.right = "20px";
  button.style.background = "#004d40";
  button.style.color = "white";
  button.style.padding = "15px 18px";
  button.style.borderRadius = "50%";
  button.style.fontSize = "24px";
  button.style.fontWeight = "bold";
  button.style.cursor = "pointer";
  button.style.zIndex = "10000";
  button.style.boxShadow = "0 2px 5px rgba(0,0,0,0.3)";
  button.style.display = "flex";
  button.style.justifyContent = "center";
  button.style.alignItems = "center";
  button.style.width = "40px";
  button.style.height = "40px";

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

  document.body.appendChild(button);
}

// Function to remove the floating button
function removeFloatingButton() {
  const button = document.getElementById("athena-floating-button");
  if (button) {
    button.remove();
  }
} 