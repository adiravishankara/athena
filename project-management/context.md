# 

---

# Product Requirements Document (PRD) for NotebookLM Research Assistant Chrome Extension

## **1. Overview**

The NotebookLM Research Assistant Chrome Extension is designed to streamline the process of adding sources to Google NotebookLM notebooks during research. By automating manual tasks and integrating intelligent source suggestions, the extension improves efficiency and enhances the research experience.

---

## **2. Objectives**

1. Automate the process of adding sources to NotebookLM without requiring manual copy-paste actions.
2. Provide a seamless UI-based interface for managing notebooks and adding links.
3. Introduce a persistent on-screen tool for quick source addition during browsing.
4. Enable intelligent source suggestions using BraveSearch API in future iterations.

---

## **3. Core Features**

### **3.1 Research Mode Toggle**

- **Description**: A toggle switch in the extension popup UI to enable or disable "Research Mode."
- **Behavior**: When enabled, the extension activates tools for adding sources and tracking research activity.


### **3.2 Notebook Selection**

- **Description**: Users can select an existing notebook or create a new one directly within the extension UI.
- **Behavior**: Selected notebook is stored locally and used as the target for adding sources during research mode.


### **3.3 Persistent On-Screen Icon**

- **Description**: A small, draggable icon (similar to TealHQ's design) appears on the screen when research mode is active.
- **Behavior**:
    - The icon functions as a "plus" button for adding sources to the selected notebook.
    - Clicking the icon captures the current page URL and sends it to NotebookLM via automation (e.g., Playwright or fetch/XHR requests).


### **3.4 Source Suggestion System (Future Feature)**

- **Description**: Using BraveSearch API, suggest additional resources based on existing notebook entries.
- **Behavior**:
    - Analyze content in the selected notebook and fetch similar resources via BraveSearch API.
    - Display suggestions in a dedicated section within the extension UI.

---

## **4. Technical Implementation Details**

### **4.1 Workaround for NotebookLM Integration**

Since NotebookLM lacks an accessible API, we will explore two possible approaches:

#### Option 1: Simulating HTTP Requests (Preferred Approach)

- Use developer tools to reverse-engineer HTTP requests sent by NotebookLM when a user manually adds a source.
- Replicate these requests programmatically via `fetch` or `XHR` in the background script of the extension.
- Ensure authentication tokens are passed securely from the user's session.


#### Option 2: Headless Automation with Playwright/Puppeteer

- Launch a headless browser instance with Playwright or Puppeteer to control NotebookLM's web interface programmatically.
- Use DOM manipulation techniques to simulate user actions (e.g., clicking "Add Source" buttons, filling input fields).
- Maintain session persistence using cookies or local storage.

---

### **4.2 Extension Architecture**

#### Frontend:

- Built with Vite + React for modularity and fast development.
- UI components include:
    - Popup interface for toggling research mode and selecting notebooks.
    - Persistent on-screen icon for quick source addition.


#### Backend:

- Background service worker manages communication between frontend and automation scripts.
- Native messaging bridge connects extension with Playwright/Puppeteer automation scripts (if needed).


#### Storage:

- Use `chrome.storage.local` for storing notebook selection and user preferences.
- Implement caching for BraveSearch API responses to improve performance.

---

### **4.3 BraveSearch API Integration**

#### Workflow:

1. Extract keywords from existing notebook entries using natural language processing (NLP).
2. Send queries to BraveSearch API based on extracted keywords.
3. Parse API responses and display suggested sources in the extension UI.

---

## **5. User Flow**

### Step-by-Step Interaction:

1. User installs the extension from Chrome Web Store.
2. Opens the extension popup and toggles "Research Mode" ON.
3. Selects an existing notebook or creates a new one within the popup interface.
4. Begins browsing resources:
    - The persistent on-screen icon appears.
    - User clicks "+" on the icon to add current page URL to the selected notebook.
5. Future Feature: Views suggested sources in a dedicated section of the popup UI.

---

## **6. Design Considerations**

### UI/UX:

1. Minimalistic design with intuitive controls.
2. Persistent icon should be unobtrusive yet accessible.
3. Popup interface should clearly display notebook options and research mode status.

### Security:

1. Ensure secure handling of authentication tokens when interacting with NotebookLM.
2. Use HTTPS for all BraveSearch API requests.

---

## **7. Technical Challenges**

1. Reverse-engineering HTTP requests sent by NotebookLM may require extensive testing and debugging.
2. Maintaining session persistence for headless automation without triggering anti-bot mechanisms.
3. Ensuring compatibility with future updates to NotebookLM's web interface.

---

## **8. Milestones**

| Milestone | Description | Timeline |
| :-- | :-- | :-- |
| Initial Extension Prototype | Basic UI, research mode toggle, persistent icon | Week 2 |
| Notebook Integration | Implement HTTP request simulation or Playwright | Week 4 |
| BraveSearch API Integration | Add intelligent source suggestions | Week 6 |
| Final Testing \& Deployment | QA testing, bug fixes, publish on Chrome Store | Week 8 |

---

## **9. Future Enhancements**

1. Add multi-browser support (e.g., Firefox, Edge).
2. Integrate machine learning models for advanced content analysis and suggestions.
3. Enable offline functionality by caching notebook data locally.

---

This PRD outlines all necessary features, technical details, and challenges for developing your Chrome extension effectively while leaving room for future innovation! Feel free to ask further questions or refine any sections!

<div style="text-align: center">⁂</div>

[^1]: https://pplx-res.cloudinary.com/image/upload/v1742787117/user_uploads/NvTayVWdfwyveqT/image.jpg

[^2]: https://github.com/pHo9UBenaA/notebooklm-automation-alpha/blob/master/src/

