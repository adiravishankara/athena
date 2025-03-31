# TypeScript Error Fix Plan

## Error Categories and Solutions

### 1. Unused Imports (15 errors)
**Files Affected:**
- `new/src/api/actions/floatingButton.ts`
- `new/src/api/actions/notebookLM.ts` 
- `new/src/api/utils/utils.ts`
- `new/src/background/background.ts`
- `new/src/content/contentScript.ts`
- `new/src/ui/main.tsx`
- `new/src/ui/pages/Popup.tsx`

**Solution:**
- Remove unused imports (marked by TS6133)
- For utility functions that might be needed later, consider:
  - Adding `// eslint-disable-next-line @typescript-eslint/no-unused-vars` 
  - Or keeping them with proper JSDoc comments if they're part of the API

### 2. Missing CSS Modules (2 errors)
**Files Affected:**
- `new/src/ui/main.tsx` - Can't find './index.css'
- `new/src/ui/pages/Popup.tsx` - Can't find '../styles/App.css'

**Solution:**
1. Verify CSS file locations:
   - Check if CSS files exist in expected locations
   - If moved, update import paths
   - If missing, create basic CSS files

2. Update tsconfig.json to include CSS module declarations:
```json
{
  "compilerOptions": {
    "types": ["vite/client"]
  }
}
```

### 3. Unused Variables (4 errors)
**Files Affected:**
- `new/src/content/contentScript.ts` - Unused 'title'
- `new/src/ui/pages/Popup.tsx` - Unused 'sender'
- `new/src/background/background.ts` - Unused 'currentNotebook', 'notebooks'

**Solution:**
- Remove truly unused variables
- For callback parameters like 'sender', prefix with underscore (`_sender`) to indicate intentional non-use

## Implementation Steps

1. **Clean Up Imports**
   - Remove all unused imports marked by TS6133
   - Audit if any removed imports might be needed for type definitions

2. **CSS Resolution**
   - Create missing CSS files with basic styles
   - Ensure proper import paths in components
   - Add vite/client types to tsconfig

3. **Variable Cleanup**
   - Remove unused variables where appropriate
   - Mark intentionally unused parameters with underscore prefix

4. **Build Verification**
   - Run `npm run build` after changes
   - Verify no TypeScript errors remain

## Priority Order
1. Fix CSS module errors (blocks build)
2. Clean up unused imports
3. Address unused variables

Would you like me to proceed with implementing any of these fixes?