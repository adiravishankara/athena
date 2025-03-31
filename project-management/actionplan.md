# Athena Extension Refactor - Action Plan

## Current Progress (As of 3/31/2025)
✅ **API Layer Completed**
- Chrome API wrappers (`storage`, `tabs`, `scripting`) 
- Action modules (`notebookStore`, `floatingButton`, `notebookLM`)
- Utility functions 

✅ **UI Components Created**
- Popup component refactored
- CSS styles moved to proper locations

⚠️ **Partial Work**
- Content script styles extracted but not integrated
- Background script needs modernization

## Milestone 1: Complete Core Infrastructure ✅
- [x] Update `manifest.json` for new architecture ✔︎
  - Added required permissions
  - Updated content script references
- [x] Finalize background script ✔︎
  - Created message router
  - Integrated with API modules
- [x] Verified API wrapper coverage ✔︎
  - Background script uses wrappers for all Chrome API calls

## Milestone 2: Content Script Updates ✅
- [x] Integrated extracted CSS with floating button ✔︎
- [x] Updated toast notification system ✔︎
- [x] Ensured research mode state sync ✔︎
- [x] Removed drag functionality ✔︎
- [x] Implemented proper messaging with background script ✔︎
  - Uses CSS classes for all styling
  - Simplified message handling
  - Aligned with background script protocol

## Milestone 3: UI Integration ✅
- [x] Verified popup connects to background via messages ✔︎
- [x] Tested all notebook operations: ✔︎
  - Create/select notebooks
  - Add/delete sources
  - Track sync status
- [x] Implemented loading/error states throughout UI ✔︎

## Milestone 4: Testing & Cleanup
- [ ] Manual testing checklist:
  - Popup functionality
  - Floating button on different sites
  - NotebookLM integration
- [ ] Remove deprecated files:
  - Old service layer
  - Direct Chrome API calls
- [ ] Update build configuration if needed

## Milestone 5: Documentation
- [ ] Architecture overview
- [ ] Message protocol specification
- [ ] Update README with new setup instructions

## Immediate Next Steps (Milestone 1)
1. Update manifest permissions:
```json
{
  "permissions": [
    "storage",
    "tabs", 
    "scripting",
    "activeTab"
  ],
  "host_permissions": [
    "https://notebooklm.google.com/*"
  ]
}
```

2. Create message handler stub in background script
3. Verify API wrappers handle all needed Chrome APIs

Would you like me to proceed with any specific part of Milestone 1?