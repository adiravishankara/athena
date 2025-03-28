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
  button.style.bottom = "50%";
  button.style.right = "20px";
  button.style.transform = "translateY(50%)";
  button.style.background = "#004d40";
  button.style.color = "white";
  button.style.width = "40px";
  button.style.height = "40px";
  button.style.padding = "0";
  button.style.borderRadius = "50%";
  button.style.fontSize = "24px";
  button.style.fontWeight = "bold";
  button.style.cursor = "pointer";
  button.style.zIndex = "2147483647";
  button.style.boxShadow = "0 4px 8px rgba(0,0,0,0.4)";
  button.style.display = "flex";
  button.style.justifyContent = "center";
  button.style.alignItems = "center";
  button.style.lineHeight = "40px";
  button.style.textAlign = "center";
  button.style.fontFamily = "Arial, sans-serif";
  button.style.border = "none";
  button.style.margin = "0";
  button.style.userSelect = "none";

  // Make the button draggable
  let isDragging = false;
  let offsetX, offsetY;

  button.addEventListener('mousedown', function(e) {
    isDragging = false;
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
  button.addEventListener('click', async function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isDragging) {
      const url = window.location.href;
      const title = document.title;
      
      // Enhanced YouTube URL detection
      let linkType = 'web';
      const lowerUrl = url.toLowerCase();
      
      if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
        linkType = 'youtube';
        // Extract video ID and validate YouTube URL
        const videoId = getYouTubeVideoId(url);
        if (!videoId) {
          showToast("Invalid YouTube URL", true);
          return;
        }
      } else if (lowerUrl.includes('docs.google.com/document')) {
        linkType = 'googledocs';
      } else if (lowerUrl.includes('docs.google.com/presentation') || lowerUrl.includes('slides.google.com')) {
        linkType = 'googleslides';
      } else if (lowerUrl.endsWith('.pdf')) {
        linkType = 'pdf';
      }
      
      try {
        chrome.runtime.sendMessage({
          action: 'ADD_SOURCE',
          url: url,
          title: title,
          type: linkType,
          datetime: new Date().toISOString()
        }, (response) => {
          if (chrome.runtime.lastError) {
            console.error('Error sending message:', chrome.runtime.lastError);
            showToast("Failed to add to notebook: Connection error", true);
            return;
          }
          
          if (response && response.status === 'success') {
            // Visual feedback REMOVED - Background script will handle state on refresh/navigation
            // button.style.background = '#2e7d32'; // REMOVED
            // button.innerHTML = "✓"; // REMOVED
            showToast(`Added ${linkType === 'youtube' ? 'YouTube video' : 'page'} to notebook`, false);
          } else {
            showToast(response && response.error ? response.error : "Failed to add to notebook", true);
          }
        });
      } catch (error) {
        console.error('Error sending message:', error);
        showToast("Failed to add to notebook: " + error.message, true);
      }
    }
  });

  document.body.appendChild(button);
}

// Helper function to extract YouTube video ID
function getYouTubeVideoId(url) {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes('youtube.com')) {
      return urlObj.searchParams.get('v');
    } else if (urlObj.hostname.includes('youtu.be')) {
      return urlObj.pathname.substring(1);
    }
  } catch (e) {
    console.error('Error parsing YouTube URL:', e);
  }
  return null;
}

// Function to remove the floating button
function removeFloatingButton() {
  const button = document.getElementById("athena-floating-button");
  if (button) {
    button.remove();
  }
}

// Helper function to show toast messages
function showToast(message, isError = false) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.position = "fixed";
  toast.style.bottom = "100px";
  toast.style.right = "20px";
  toast.style.backgroundColor = isError ? "rgba(211, 47, 47, 0.9)" : "rgba(46, 125, 50, 0.9)";
  toast.style.color = "white";
  toast.style.padding = "10px 15px";
  toast.style.borderRadius = "4px";
  toast.style.zIndex = "2147483647";
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 2000);
} 