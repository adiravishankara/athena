# Task List

## Initial Extension Prototype
- [x] Setup project with Vite, React, and TypeScript
- [x] setup vite.config.ts, manifest.json, tsconfig.node.json files
- [x] Implement basic UI with popup interface
    - Currently the default react app
- [x] Setup icons in public folder
- [x] Setup the background.js worker to manage chrome extension
- [x] Implement UI according to design
  - [x] Create header with logo and "ATHENA" text
  - [x] Add Research Mode toggle switch
  - [x] Create Notebook dropdown with selection functionality
  - [x] Implement "Create new notebook" option with input form
  - [x] Design and implement Included Sources list with checkmarks
  - [x] Add delete functionality for sources
- [x] Implement Chrome Storage for notebooks and sources
  - [x] Design and implement storage structure for notebooks
  - [x] Add functions to create notebooks in storage
  - [x] Add functions to add sources to notebooks
  - [x] Add functions to delete sources from notebooks
- [x] Add persistent on-screen icon (floating button)
  - [x] Create content script to inject floating button
  - [x] Implement button click handler to save current tab URL
  - [x] Make button appear only when Research Mode is active
  - [x] Add button styling according to design

## Current Tasks 

- [x] Create a basic Chrome extension that allows users to save sources to notebooks
  - [x] Create manifest.json
  - [x] Create popup.html
  - [x] Create background.js
  - [x] Implement basic functionality to save URLs to notebooks
  - [x] Implement UI for the extension popup

- [x] Add research mode toggle
  - [x] Add toggle button in the UI
  - [x] Implement storage for research mode state
  - [x] Update UI based on research mode state

## Next Steps
- [x] Fix build errors
  - [x] Fix unused parameter warning in App.tsx
  - [x] Fix unused import and missing module in vite.config.ts
- [x] Fix floating button not appearing in active tab
  - [x] Update toggleResearchMode function to inject button directly into active tab
- [x] Fix chrome:// URL injection error
  - [x] Add URL validation to prevent injection in restricted pages
  - [x] Add proper error handling for script injection
- [x] Make floating button persist across tab navigation
  - [x] Refactor button injection into a separate function
  - [x] Add tab update event listener to inject button on navigation
  - [x] Add tab creation event listener to inject button on new tabs
  - [x] Update toggleResearchMode to inject/remove button from all tabs
- [x] Add alternative method to add sources
  - [x] Implement direct "Add Current Tab" button in extension popup UI
  - [x] Add functionality to get current tab URL and add to selected notebook
- [x] Enhance floating button functionality
  - [x] Make the button bigger for better visibility
  - [x] Move the button to the middle of the screen vertically
  - [x] Show checkmark permanently for already saved URLs
  - [x] Prevent adding duplicate links to notebooks
- [x] Improve UI for better user experience
  - [x] Make only the included sources section scrollable
  - [x] Add a counter to show the number of sources in a notebook
- [ ] Test the extension in Chrome to verify all functionality works correctly
- [ ] Fix any bugs or issues found during testing
- [ ] Optimize performance for handling large numbers of sources

## Notebook Integration
- [ ] Reverse-engineer NotebookLM HTTP requests
- [ ] Implement HTTP request simulation in background script
- [ ] Ensure secure handling of authentication tokens

## BraveSearch API Integration
- [ ] Extract keywords from notebook entries using NLP
- [ ] Implement queries to BraveSearch API
- [ ] Parse API responses
- [ ] Display suggested sources in extension UI

## Final Testing & Deployment
- [ ] Conduct QA testing
- [ ] Fix bugs identified during testing
- [ ] Publish extension on Chrome Web Store

## Future Enhancements

- [ ] Add ability to categorize sources within notebooks
- [ ] Add ability to search through sources
- [ ] Add ability to export notebooks
- [ ] Add notifications for successful actions
