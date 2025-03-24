# NotebookLM Integration Tests

## Source Addition Test Cases

### Session Management Tests
- [ ] Test NotebookLM session detection
- [ ] Test session refresh mechanism
- [ ] Test handling of expired sessions
- [ ] Test authentication error handling

### Source Addition Tests by Type

#### Website Links
- [ ] Test adding basic website URL
- [ ] Test adding URL with query parameters
- [ ] Test adding URL with special characters
- [ ] Test adding same URL multiple times (duplicate handling)

#### YouTube Links
- [ ] Test adding YouTube video URL
- [ ] Test adding YouTube playlist URL
- [ ] Test adding YouTube channel URL
- [ ] Test adding invalid YouTube URL

#### Google Drive Sources
- [ ] Test adding Google Docs link
- [ ] Test adding Google Slides link
- [ ] Test handling of permission errors

### Element Selection Tests
- [ ] Test "Create New" button selection
- [ ] Test source type button selection
- [ ] Test URL input field selection
- [ ] Test submit button selection
- [ ] Test element selection retry logic
- [ ] Test handling of UI changes/updates

### UI Interaction Tests
- [ ] Test button click simulation
- [ ] Test text input automation
- [ ] Test form submission
- [ ] Test success/error detection
- [ ] Test dialog closing detection

### Error Handling Tests
- [ ] Test element not found scenarios
- [ ] Test timeout scenarios
- [ ] Test network errors
- [ ] Test rate limiting
- [ ] Test session expiration
- [ ] Test permission errors

### Test Modes
1. **Dry Run Mode**
   - Logs all scripting actions
   - Does not actually interact with NotebookLM
   - Validates element selectors
   - Returns mock successful responses

2. **Debug Mode**
   - Full UI interaction with logging
   - Records all DOM operations
   - Captures screenshots at key points
   - Detailed error logging

3. **Production Mode**
   - Normal operation
   - Minimal logging
   - Automatic error recovery
   - Performance optimized

## Test Data
### Sample URLs
- Standard website URLs
- YouTube video URLs
- Google Drive document URLs
- URLs with special characters
- Invalid URLs for testing

### Element Selectors
- "Create New" button selectors
- Source type button selectors
- URL input field selectors
- Submit button selectors
- Success/error indicators

## Error Cases
- [ ] Element not found
- [ ] Element selection timeout
- [ ] Network errors
- [ ] Session expired
- [ ] Permission denied
- [ ] Rate limiting
- [ ] UI changed/updated
- [ ] Invalid input 