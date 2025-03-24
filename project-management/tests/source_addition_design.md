# Source Addition Automation Design

## Overview
Since NotebookLM doesn't provide a public API, we'll implement a browser automation approach using Puppeteer to add sources to notebooks. This design document outlines the technical implementation and testing strategy.

## Technical Approach

### 1. Browser Automation Layer
```typescript
interface NotebookLMAutomation {
  addSource(notebookId: string, url: string): Promise<boolean>;
  validateSession(): Promise<boolean>;
  refreshSession(): Promise<void>;
}
```

### 2. Test Mode Implementation
```typescript
interface TestMode {
  isDryRun: boolean;
  isDebugMode: boolean;
  logLevel: 'none' | 'error' | 'debug' | 'verbose';
}

interface AutomationConfig {
  testMode: TestMode;
  retryAttempts: number;
  timeoutMs: number;
}
```

### 3. Implementation Strategy

#### Phase 1: Initial Setup
1. Launch headless browser instance
2. Navigate to NotebookLM
3. Extract and store session cookies
4. Validate session state

#### Phase 2: Source Addition
1. Navigate to notebook page
2. Click "Add Source" button
3. Input URL in the form
4. Submit and verify addition

#### Phase 3: Error Handling
1. Session expiration detection
2. Automatic session refresh
3. Retry logic for failed operations
4. Error reporting and logging

## Testing Strategy

### 1. Dry Run Mode
- Implement mock browser actions
- Log expected HTTP requests
- Validate input parameters
- Return mock responses

### 2. Debug Mode
- Full browser automation with logging
- Screenshot capture at key steps
- Network request logging
- Performance metrics collection

### 3. Production Mode
- Optimized for speed and reliability
- Minimal logging
- Automatic error recovery
- Rate limiting protection

## Implementation Plan

1. Create base automation class
2. Implement test mode infrastructure
3. Add cookie management
4. Implement source addition logic
5. Add error handling and recovery
6. Create logging and monitoring system

## Security Considerations

1. Cookie Storage
   - Encrypt stored cookies
   - Regular cookie rotation
   - Secure cookie validation

2. Error Handling
   - Sanitize error messages
   - Protect sensitive information
   - Rate limiting protection

## Monitoring and Logging

1. Key Metrics
   - Success/failure rate
   - Operation timing
   - Error frequency
   - Session validity

2. Log Levels
   - ERROR: Failed operations
   - INFO: Successful operations
   - DEBUG: Request/response details
   - VERBOSE: All browser actions 