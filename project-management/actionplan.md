# NotebookLM Integration Action Plan

## Directory Structure
```
src/
  ├── services/
  │   ├── notebookLM/
  │   │   ├── selectors.ts       # Robust selector definitions
  │   │   ├── automation.ts      # Core automation logic
  │   │   ├── session.ts         # Session management
  │   │   └── types.ts          # TypeScript interfaces
  │   └── logging/
  │       ├── logger.ts          # Logging utilities
  │       └── errorReporter.ts   # Error handling & reporting
  ├── utils/
  │   ├── retry.ts              # Retry logic
  │   ├── validation.ts         # Input validation
  │   └── dom.ts                # DOM manipulation helpers
  └── tests/
      ├── mocks/                # Test mocks
      ├── fixtures/             # Test data
      └── helpers/              # Test utilities
```

## Implementation Phases

### Phase 1: Core Infrastructure Setup

#### 1.1 Logging System (services/logging/logger.ts)
```typescript
interface LogEntry {
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
  context?: Record<string, any>;
}

// Key functions to implement:
- logDebug(message: string, context?: object)
- logInfo(message: string, context?: object)
- logWarning(message: string, context?: object)
- logError(message: string, error: Error, context?: object)
```

#### 1.2 Error Reporting (services/logging/errorReporter.ts)
```typescript
interface ErrorReport {
  error: Error;
  context: {
    url?: string;
    action: string;
    selectors?: string[];
    timestamp: string;
  };
}

// Critical error points to track:
- Element selection failures
- Session validation errors
- Network timeouts
- UI interaction failures
```

### Phase 2: Robust Selector System

#### 2.1 Selector Definitions (services/notebookLM/selectors.ts)
```typescript
interface ElementSelector {
  name: string;
  selectors: string[];
  validation?: (element: Element) => boolean;
  timeout?: number;
}

// Key selectors to implement:
- Create New button
- Website/YouTube source type buttons
- URL input field
- Submit/Insert button
- Success/Error indicators
```

#### 2.2 DOM Utilities (utils/dom.ts)
```typescript
// Key functions:
- findElement(selector: ElementSelector): Promise<Element>
- waitForElement(selector: ElementSelector): Promise<Element>
- simulateClick(element: Element): Promise<void>
- inputText(element: Element, text: string): Promise<void>
```

### Phase 3: Core Automation Implementation

#### 3.1 Session Management (services/notebookLM/session.ts)
```typescript
// Key functions:
- validateSession(): Promise<boolean>
- refreshSession(): Promise<void>
- handleSessionError(): Promise<void>
```

#### 3.2 Automation Logic (services/notebookLM/automation.ts)
```typescript
class NotebookLMAutomation {
  // Core methods:
  - addSource(url: string): Promise<boolean>
  - openNotebookLM(): Promise<boolean>
  - selectSourceType(type: 'website' | 'youtube'): Promise<boolean>
  - submitSource(): Promise<boolean>
}
```

## Critical Points for Error Handling & Logging

### High-Risk Functions
1. Element Selection
   - Log: Selector attempts, element found/not found
   - Error: Element not found after retries

2. Session Management
   - Log: Session status changes
   - Error: Session validation failures

3. Source Addition
   - Log: Start of process, URL validation, completion
   - Error: Failed submissions, timeouts

4. UI Interactions
   - Log: Click attempts, text input
   - Error: Failed interactions, unexpected UI states

### Retry Strategy
- Implement exponential backoff for element selection
- Maximum 3 retries for UI interactions
- Session refresh on first failure

## Implementation Order

1. **Infrastructure (Week 1)**
   - Setup directory structure
   - Implement logging system
   - Create error reporting

2. **Selector System (Week 1-2)**
   - Create selector definitions
   - Implement DOM utilities
   - Add retry logic

3. **Core Automation (Week 2-3)**
   - Implement session management
   - Create automation class
   - Add source addition logic

4. **Testing & Refinement (Week 3-4)**
   - Create test infrastructure
   - Add test cases
   - Performance optimization

## Success Metrics
- Source addition success rate > 95%
- Average operation time < 5 seconds
- Error recovery rate > 90%
- Clear error logging for failed operations 