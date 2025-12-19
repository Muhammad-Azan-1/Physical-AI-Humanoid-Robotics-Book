---
id: 17
title: "Physical AI Chatbot Integration Spec"
stage: "spec"
date: "2025-12-19"
model: "claude-opus-4-5-20251101"
feature: "chatbot-integration"
branch: "016-chatbot-integration"
user: "claude"
command: "/sp.specify"
labels: ["spec", "chatbot", "ai", "docusaurus"]
links:
  spec: "specs/016-chatbot-integration/spec.md"
  ticket: null
  adr: null
  pr: null
files:
  - "specs/016-chatbot-integration/spec.md"
  - "specs/016-chatbot-integration/checklists/requirements.md"
tests: []
outcome: "Specification created successfully with user scenarios, requirements, and success criteria"
evaluation: "Specification meets all quality criteria and is ready for planning phase"
---

# Specification: Physical AI & Humanoid Robotics Book Chatbot Integration

## Document Information
- **Spec ID**: SPEC-PHYSICAL-AI-CHATBOT-016
- **Date**: 2025-12-19
- **Status**: Draft
- **Priority**: High
- **Version**: 2.0
- **Project**: Physical AI & Humanoid Robotics Documentation Website

---

## 1. Executive Summary

Create an AI chatbot interface for the Physical AI & Humanoid Robotics documentation website. The chatbot must connect the existing OpenAI Agent (with Pinecone RAG) to the Docusaurus frontend through a FastAPI backend. The main challenge is establishing this connection and maintaining conversation sessions so users can have multi-turn conversations with the Agent.

---

## 2. The Core Problem

**You have:**
- ✅ Docusaurus website (frontend)
- ✅ OpenAI Agent with Pinecone RAG (backend)
- ✅ Agent works perfectly in CLI/terminal

**You need:**
- ❌ Connection between frontend and Agent
- ❌ FastAPI endpoint to bridge them
- ❌ Session management for conversation history
- ❌ User interface to interact with Agent

**The Barrier:**
How do you connect the frontend to the Agent and maintain conversation context across multiple messages?

---

## 3. Solution Overview

```
USER (Frontend)
    ↓ types question
CHATBOT UI (Docusaurus)
    ↓ sends HTTP POST request
FASTAPI ENDPOINT (/api/chat)
    ↓ receives { message, session_id }
LOAD SESSION HISTORY
    ↓ get previous messages
CALL AGENT WITH HISTORY
    ↓ Agent processes with context
AGENT RETURNS RESPONSE
    ↓ save to session
FASTAPI RETURNS RESPONSE
    ↓ sends { response, session_id }
CHATBOT UI DISPLAYS ANSWER
    ↓ user sees response
```

---

## 4. Website Theme Analysis

Based on the provided screenshot, the website has:

### Color Scheme
- **Background**: Dark black (#0A0E14 or similar very dark color)
- **Primary Accent**: Cyan/Teal (#00BCD4 or #14B8A6)
- **Secondary Accent**: Cyan with slight variation for badges
- **Text Primary**: White (#FFFFFF)
- **Text Secondary**: Light gray (#B0B0B0 or #9CA3AF)
- **Buttons Primary**: Cyan background with dark text
- **Buttons Secondary**: Dark with light border

### Design Style
- Modern, clean, minimalist
- Dark theme (appears to be default)
- High contrast
- Rounded corners on buttons and badges
- Ample spacing and padding
- Professional, tech-focused aesthetic

### Typography
- Large, bold headings
- Sans-serif fonts (likely Inter or similar)
- Good hierarchy and spacing

---

## 5. Chatbot Design Requirements

### 5.1 Chatbot Icon

**Position & Behavior:**
- Fixed position in **bottom-right corner**
- Stay visible when user scrolls (sticky)
- Distance from edges: 24px right, 24px bottom (desktop)
- Distance from edges: 16px right, 16px bottom (mobile)
- Must appear on EVERY page globally

**Visual Design:**
- Shape: Circular button
- Size: 60×60px (desktop), 56×56px (mobile)
- Icon: Chat bubble or message icon
- Background color: **Cyan (#00BCD4)** to match website theme
- Icon color: **Dark/Black** for contrast
- Shadow: Elevated shadow to show it's floating
- Z-index: High enough to stay above all content

**Hover State:**
- Scale up slightly (1.05x larger)
- Add glow effect in cyan
- Cursor changes to pointer
- Smooth transition (150-200ms)

**Active State (when chatbot is open):**
- Icon can change to X (close) symbol
- Or keep same icon with different color to indicate active

### 5.2 Chatbot Window

**Positioning:**
- Opens from icon location (bottom-right)
- Expands upward and leftward
- Desktop: 420px wide × 650px tall
- Mobile: Full screen or 95% width × 75% height
- Stays in bottom-right area on desktop

**Window Structure:**

**Header Section:**
- Title: "Physical AI Assistant" or "Ask About the Book"
- Close button (×) in top-right corner
- Background: Match website dark theme
- Border bottom: Subtle line in dark gray

**Messages Area:**
- Scrollable container
- Auto-scroll to latest message when new message arrives
- Display conversation history
- Background: Dark (matching website)
- Padding: Comfortable spacing between messages

**User Messages (Right-aligned):**
- Background: **Cyan (#00BCD4)** - same as website accent
- Text color: **Dark/Black** for readability
- Border radius: Rounded corners (18px)
- Max width: 70% of window
- Alignment: Right side
- Margin: Space between messages

**Bot Messages (Left-aligned):**
- Background: **Dark gray** (lighter than window background)
- Text color: **White/Light gray**
- Border radius: Rounded corners (18px)
- Max width: 80% of window
- Alignment: Left side
- Margin: Space between messages

**Timestamps:**
- Small text below each message
- Color: Light gray (subtle)
- Font size: 11px
- Optional but nice to have

**Input Area (Bottom):**
- Text input field for user to type
- Background: Dark gray (slightly lighter than window)
- Text color: White
- Border: Subtle border in darker shade
- Placeholder text: "Ask about Physical AI and Robotics..."
- Multi-line support (up to 3-4 lines)

**Send Button:**
- Icon: Arrow (→) or paper plane
- Background: **Cyan (#00BCD4)**
- Icon color: Dark
- Position: Right side of input
- Size: Match input height
- Disabled state when loading

**Loading Indicator:**
- Show when waiting for Agent response
- Three dots animation (● ● ●)
- Appears as a bot message
- Pulsing/fading animation
- Color: Light gray

### 5.3 Animations

**Window Opening:**
- Smooth scale animation from 90% to 100%
- Fade in effect
- Duration: 300ms
- Easing: Smooth (ease-out)

**Window Closing:**
- Scale down to 90%
- Fade out effect
- Duration: 250ms
- Easing: Smooth (ease-in)

**New Message Appearing:**
- Slide up animation (10px)
- Fade in effect
- Duration: 200ms
- Smooth transition

**Auto-scroll:**
- Smooth scroll to bottom
- Duration: 300ms
- Triggered when new message arrives

### 5.4 Theme Matching

The chatbot must feel like a native part of the website, not an external widget.

**Colors to Use:**
- Window background: Same dark color as website body
- User messages: Cyan (#00BCD4) - matches "Start Learning" button
- Bot messages: Dark gray (lighter than background)
- Text: White and light gray
- Borders: Subtle dark borders
- Shadows: Dark shadows for elevation

**DO NOT USE:**
- Bright colors that clash
- White backgrounds (this is a dark theme site)
- Colors not present in the website
- Light mode styling

**Light Mode:**
Based on the screenshot, the website appears to use dark theme by default. If the website has a light mode toggle:
- Detect theme changes using Docusaurus theme system
- Switch chatbot colors accordingly
- Light mode: White background, dark text, cyan accents
- But PRIMARY focus is on dark theme

---

## 6. Backend Requirements - The Main Challenge

### 6.1 The Problem to Solve

**Current State:**
- Your Agent code runs in terminal using `Runner.run_sync()`
- Agent has Input Guardrail and Consumer Agent
- Agent uses query_pinecone tool for RAG
- Works perfectly but only accessible via CLI

**What You Need:**
- Make the Agent accessible via HTTP
- Frontend sends question → Backend receives it → Agent processes → Backend returns answer
- Maintain conversation history so Agent remembers previous messages

### 6.2 FastAPI Endpoint Structure

**Create ONE endpoint:** `POST /api/chat`

**What it receives from frontend:**
- User's message (text string)
- Session ID (string, optional for first message)

**What it must do:**
1. Check if session_id exists
   - If NO → Generate new unique session_id (use UUID)
   - If YES → Load previous conversation from storage

2. Get conversation history for this session
   - History = list of previous user and bot messages
   - Format: [{ role: "user", content: "..." }, { role: "assistant", content: "..." }]

3. Prepare input for Agent WITH history context
   - Agent needs to know what was said before
   - Include conversation history in the input somehow
   - Options: prepend history to message, or use Agent SDK's history API

4. Call your existing Agent
   - Use the same Agent code you already have
   - Pass the message (with or without history prepended)
   - Let Input Guardrail do its job
   - Let Consumer Agent use query_pinecone tool
   - Get response from Agent

5. Save new messages to session
   - Save user's message to session history
   - Save Agent's response to session history
   - Update session storage

6. Return response to frontend
   - Send back Agent's answer
   - Send back session_id (same one or new one)
   - Send timestamp

**What it returns to frontend:**
- Agent's response text
- Session ID
- Timestamp
- (Optional) Flag if guardrail blocked the request

### 6.3 CORS Configuration

**Critical:** Enable CORS so frontend can make requests.

**What to allow:**
- Frontend domain (localhost:3000 for development)
- POST method for /api/chat
- GET method for /api/health (optional health check)
- Headers: Content-Type, Authorization (if needed)

### 6.4 Error Handling

**Handle these errors and return proper responses:**

**Invalid Request (400):**
- Empty message
- Invalid session_id format
- Missing required fields
→ Return: Error message user can understand

**Guardrail Rejection (200 but with flag):**
- Input Guardrail blocks off-topic question
→ Return: Polite message "I can only answer questions about Physical AI"

**Agent Error (500):**
- Agent crashes
- Pinecone connection fails
- Gemini API fails
→ Return: "Something went wrong. Please try again."

**Timeout (504):**
- Agent takes too long (> 30 seconds)
→ Return: "Request timed out. Please try again."

---

## 7. Session Management - The Critical Part

### 7.1 The Session Problem

**Why sessions matter:**
- User: "What is physical AI?"
- Bot: "Physical AI refers to..."
- User: "Tell me more" ← Agent needs to know "more about WHAT?"

Without session history, Agent has NO context of previous messages.

### 7.2 What to Store Per Session

**Each session needs:**
- Unique session_id (UUID string)
- List of messages in conversation:
  - Each message has: role ("user" or "assistant"), content (text), timestamp
- Creation time
- Last updated time

**Example session data:**
```
Session ID: "abc-123-def-456"
Messages: [
  { role: "user", content: "What is physical AI?", timestamp: "..." },
  { role: "assistant", content: "Physical AI refers to...", timestamp: "..." },
  { role: "user", content: "Tell me more", timestamp: "..." },
  { role: "assistant", content: "Building on that...", timestamp: "..." }
]
Created: "2025-12-19T10:00:00Z"
Last Updated: "2025-12-19T10:05:00Z"
```

### 7.3 Storage Options

**Option 1: CONTEXT 7 MCP Server (Recommended)**
- Use CONTEXT 7 MCP server to search OpenAI Agents SDK documentation
- Find the recommended way to maintain conversation history
- Implement session storage following OpenAI's best practices
- Research how to pass conversation context to Agent between turns

**Steps:**
1. Use CONTEXT 7 MCP to search for "OpenAI Agents SDK conversation history"
2. Find official examples of multi-turn conversations
3. Implement exactly what the docs recommend
4. Store sessions using the pattern from docs

**Option 2: In-Memory Dictionary (For Development/Testing)**
- Use Python dictionary to store sessions
- Key = session_id, Value = list of messages
- Simple and fast for testing
- PROBLEM: Loses data when server restarts
- Only use for development

**Option 3: Redis (For Production)**
- Use Redis database to store sessions
- Set expiration time (24 hours)
- Persistent across server restarts
- Fast read/write
- Scalable for multiple users

**Recommendation:** Start with CONTEXT 7 MCP research to find best practice, then implement. Fall back to in-memory for quick testing, use Redis for production.

### 7.4 How Agent Gets History

**The key question:** How do you give conversation history to your Agent?

**Three approaches:**

**Approach 1: Prepend history to input**
Format the conversation history as text and add it before the user's message.
Example input to Agent: "Previous conversation: [history here]\n\nCurrent question: Tell me more"

**Approach 2: Use Agent SDK's built-in conversation API**
Check if OpenAI Agents SDK has a conversation or history parameter.
Use CONTEXT 7 MCP to find this in the docs.

**Approach 3: Modify Agent instructions dynamically**
Update the Agent's system instructions to include history context.

**Action Required:**
Research OpenAI Agents SDK using CONTEXT 7 MCP to find the correct way.

### 7.5 Session Lifecycle

**New conversation:**
1. User opens chatbot (first time)
2. No session_id in localStorage
3. User sends first message
4. Frontend sends: { message: "...", session_id: null }
5. Backend generates new session_id
6. Backend creates new empty session
7. Backend processes message
8. Backend saves messages to session
9. Backend returns: { response: "...", session_id: "abc-123" }
10. Frontend saves session_id to localStorage

**Continuing conversation:**
1. User sends second message
2. Frontend has session_id in localStorage
3. Frontend sends: { message: "...", session_id: "abc-123" }
4. Backend loads existing session
5. Backend gets conversation history
6. Backend passes history + new message to Agent
7. Backend saves new messages to session
8. Backend returns: { response: "...", session_id: "abc-123" }

**Session expiration:**
- Sessions expire after 24 hours of no activity
- Backend deletes old sessions automatically
- If frontend sends expired session_id, create new session

---

## 8. Frontend Implementation Requirements

### 8.1 Global Availability

**Where to add chatbot:**
- Docusaurus has a theme structure
- Add chatbot component to the root layout
- Component appears on every page automatically
- Use Docusaurus swizzling if needed to inject into theme

**What you need:**
- React component for chatbot icon
- React component for chatbot window
- State management for open/close, messages, loading
- HTTP client to call backend API

### 8.2 State Management

**Component must track:**
- `isOpen` (boolean) - Is chatbot window open?
- `messages` (array) - List of all messages in conversation
- `inputText` (string) - What user is currently typing
- `isLoading` (boolean) - Waiting for Agent response?
- `sessionId` (string) - Current session ID
- `error` (string) - Error message if something fails

**LocalStorage:**
- Save `sessionId` to localStorage when received from backend
- Load `sessionId` from localStorage when page loads
- This allows session to persist across page navigation

### 8.3 Sending Messages Flow

**When user clicks send:**

1. Validate input
   - Check message is not empty
   - Check message is not too long (< 500 chars)

2. Add user message to UI immediately
   - Create message object: { content: "...", sender: "user", status: "sending" }
   - Add to messages array
   - Display in chat window
   - Clear input field
   - Auto-scroll to bottom

3. Show loading indicator
   - Set isLoading = true
   - Disable send button
   - Disable input field
   - Show typing indicator "..."

4. Make API request
   - GET session_id from localStorage (or null if new)
   - POST to /api/chat with { message: "...", session_id: "..." }
   - Wait for response

5. Handle response
   - If success:
     - Get response text
     - Get session_id
     - Save session_id to localStorage
     - Add bot message to UI: { content: "...", sender: "bot" }
     - Set isLoading = false
     - Auto-scroll to bottom

   - If error:
     - Show error message in chat
     - Set isLoading = false
     - Re-enable send button
     - Allow user to retry

### 8.4 Theme Detection

**How to match website theme:**
- Docusaurus provides theme context
- Import and use Docusaurus's theme hooks
- Detect if current theme is light or dark
- Apply appropriate colors to chatbot
- Listen for theme changes and update chatbot colors

**CSS Variables:**
- Use CSS variables for colors
- Define --chatbot-bg, --chatbot-text, --chatbot-accent
- Update variables when theme changes
- All components reference these variables

### 8.5 API Integration

**HTTP Request Details:**

**Endpoint:** POST http://your-backend-url/api/chat

**Request Headers:**
- Content-Type: application/json

**Request Body:**
- message: string (user's question)
- session_id: string | null (conversation ID)

**Response (Success):**
- response: string (Agent's answer)
- session_id: string (same or new)
- timestamp: string
- blocked: boolean (optional, if guardrail rejected)

**Response (Error):**
- error: string (error message)
- error_code: string
- details: string

**Error Handling:**
- Network error → Show "Connection failed. Check your internet."
- Timeout → Show "Request timed out. Try again."
- 500 error → Show "Something went wrong. Try again."
- 400 error → Show specific validation error
- Guardrail rejection → Show polite message

**Configuration:**
- Store API URL in environment variable
- Development: http://localhost:8000/api/chat
- Make it easy to configure through environment variables

---

## 9. Integration Checklist

### 9.1 Backend Tasks

**FastAPI Setup:**
- [ ] Create FastAPI application
- [ ] Add CORS middleware for frontend domain
- [ ] Create POST /api/chat endpoint
- [ ] Create request validation model (Pydantic)
- [ ] Create response model (Pydantic)
- [ ] Add error handling with try-catch
- [ ] Add logging for debugging
- [ ] Test endpoint with curl or Postman

**Agent Integration:**
- [ ] Import existing Agent code
- [ ] Keep Input Guardrail Agent unchanged
- [ ] Keep Consumer Agent unchanged
- [ ] Keep query_pinecone tool unchanged
- [ ] Create function to call Agent from endpoint
- [ ] Handle InputGuardrailTripwireTriggered exception
- [ ] Handle other Agent errors
- [ ] Test Agent calls work through API

**Session Management:**
- [ ] Research OpenAI Agents SDK conversation handling using CONTEXT 7 MCP
- [ ] Choose storage method (MCP pattern, in-memory, Redis)
- [ ] Create session storage functions: create, get, update, delete
- [ ] Implement session ID generation (UUID)
- [ ] Implement conversation history loading
- [ ] Implement history saving after each turn
- [ ] Figure out how to pass history to Agent
- [ ] Test multi-turn conversations maintain context
- [ ] Set up session expiration (24 hours)
- [ ] Add session cleanup for expired sessions

**Testing:**
- [ ] Test endpoint with empty message (should reject)
- [ ] Test endpoint with valid message (should work)
- [ ] Test with new session (no session_id)
- [ ] Test with existing session (with session_id)
- [ ] Test off-topic question (guardrail should block)
- [ ] Test on-topic question (should answer)
- [ ] Test follow-up question (should have context)
- [ ] Test error scenarios (Pinecone down, Gemini fails)
- [ ] Test CORS from frontend domain

### 9.2 Frontend Tasks

**Component Creation:**
- [ ] Create ChatbotIcon component (floating button)
- [ ] Create ChatbotWindow component (full chat interface)
- [ ] Create Message component (individual messages)
- [ ] Create InputArea component (text input + send button)
- [ ] Create LoadingIndicator component (typing dots)

**State Management:**
- [ ] Set up useState for isOpen, messages, sessionId, isLoading
- [ ] Add localStorage integration for sessionId
- [ ] Implement open/close chatbot functions
- [ ] Implement send message function
- [ ] Implement API call logic
- [ ] Handle API responses
- [ ] Handle API errors

**Styling:**
- [ ] Match website dark theme colors
- [ ] Style chatbot icon (cyan, bottom-right)
- [ ] Style chatbot window (dark background)
- [ ] Style user messages (cyan bubbles, right-aligned)
- [ ] Style bot messages (dark gray bubbles, left-aligned)
- [ ] Style input area (dark with cyan send button)
- [ ] Add animations (open, close, message appear)
- [ ] Make responsive (mobile, tablet, desktop)
- [ ] Add hover effects
- [ ] Test theme switching if website has light mode

**Integration:**
- [ ] Add chatbot to Docusaurus theme/layout
- [ ] Ensure it appears on all pages
- [ ] Set API endpoint URL from environment variable
- [ ] Test on different pages
- [ ] Test theme detection
- [ ] Verify z-index doesn't conflict with other elements

**User Experience:**
- [ ] Auto-scroll to latest message
- [ ] Show loading indicator while waiting
- [ ] Disable input while loading
- [ ] Clear input after sending
- [ ] Handle Enter key to send
- [ ] Handle Shift+Enter for new line
- [ ] Show welcome message on first open
- [ ] Handle long messages (scroll within bubble)
- [ ] Add timestamps (optional)
- [ ] Test on mobile devices

### 9.3 End-to-End Testing

**Happy Path:**
- [ ] Open chatbot → See welcome message
- [ ] Type question about Physical AI → Send
- [ ] See loading indicator → See response from Agent
- [ ] Session ID saved to localStorage
- [ ] Ask follow-up question → Agent remembers context
- [ ] Close and reopen chatbot → Session persists
- [ ] Navigate to different page → Chatbot still works

**Error Path:**
- [ ] Ask off-topic question → See polite rejection
- [ ] Disconnect internet → Send message → See error
- [ ] Restart backend → Session still works (if using Redis)
- [ ] Send empty message → See validation error
- [ ] Send very long message → Handle gracefully

**Performance:**
- [ ] Response time < 5 seconds for most queries
- [ ] Chatbot opens instantly (< 300ms animation)
- [ ] Auto-scroll is smooth
- [ ] No lag when typing
- [ ] Page load not impacted

---

## 10. Environment Configuration

### 10.1 Backend Environment Variables

**Required:**
- `GEMINI_API_KEY` - Already have this
- `PINECONE_API_KEY` - Already have this
- `CORS_ORIGINS` - Frontend URL (http://localhost:3000)
- `API_PORT` - Port for FastAPI (e.g., 8000)

**Optional:**
- `SESSION_STORAGE_TYPE` - "memory", "redis", "mcp"
- `REDIS_URL` - If using Redis
- `SESSION_EXPIRY_HOURS` - Default 24
- `LOG_LEVEL` - "INFO", "DEBUG", "ERROR"

### 10.2 Frontend Environment Variables

**Required:**
- `REACT_APP_API_URL` - Backend endpoint

**Development:**
```
REACT_APP_API_URL=http://localhost:8000
```

---

## 11. Success Criteria

**You know it works when:**

✅ **User opens chatbot:**
- Icon visible in bottom-right on all pages
- Clicking icon opens window smoothly
- Window matches website dark theme perfectly

✅ **User asks question:**
- User types message and clicks send
- Message appears immediately in chat
- Loading indicator shows while waiting
- Agent response appears within 5 seconds
- Response is relevant to question

✅ **User asks follow-up:**
- Second question relates to first
- Agent understands context (shows session works)
- Conversation flows naturally

✅ **User navigates:**
- User goes to different page on website
- Chatbot still accessible
- Session persists (can continue conversation)

✅ **User returns later:**
- User closes browser
- User returns hours later (within 24 hours)
- Session still exists
- Can continue conversation OR starts fresh if expired

✅ **Guardrails work:**
- User asks off-topic question (e.g., "Capital of France?")
- Agent politely declines
- Shows message: "I can only answer questions about Physical AI"

✅ **Errors handled:**
- Backend is down → User sees friendly error
- Network fails → User sees connection error
- Timeout → User sees retry option

---

## 12. Troubleshooting Guide

### 12.1 Common Issues

**Problem: CORS error in browser console**
- Cause: Backend CORS not configured for frontend domain
- Fix: Add frontend URL (http://localhost:3000) to CORS allowed origins in FastAPI

**Problem: 404 error when calling API**
- Cause: Backend not running or wrong URL
- Fix: Check backend is running, verify API URL is correct

**Problem: Agent not remembering context**
- Cause: Session history not being passed to Agent
- Fix: Review session loading and history passing logic

**Problem: Chatbot doesn't match theme**
- Cause: Using wrong colors or not detecting theme
- Fix: Use exact colors from website, check theme context

**Problem: Session lost on page refresh**
- Cause: Not saving session_id to localStorage
- Fix: Save session_id when received, load on page mount

**Problem: Slow responses (> 10 seconds)**
- Cause: Pinecone query slow or Agent processing slow
- Fix: Optimize Pinecone queries, add timeout handling

---

## 13. Out of Scope

**NOT included in this project:**
- ❌ Voice input/output
- ❌ File uploads
- ❌ Multi-language support
- ❌ User authentication
- ❌ Admin dashboard
- ❌ Analytics tracking
- ❌ Email notifications
- ❌ Chat history export
- ❌ Custom Agent training

---

## 14. Key Instructions for Implementation

**For Backend Developer:**

1. **Your main job:** Create FastAPI endpoint that connects frontend to existing Agent code.

2. **Agent code can be modified if necessary.** The existing Agent code is a good foundation, but feel free to add, modify, or enhance it if needed for the integration. For example:
   - Add conversation history handling if Agent doesn't support it
   - Modify Agent instructions to better handle context
   - Add new tools or features if helpful
   - Refactor Agent initialization for FastAPI compatibility
   - Whatever makes the integration work smoothly

3. **Focus on session management.** This is the hard part. Figure out how to:
   - Store conversations
   - Load previous messages
   - Pass history to Agent

4. **Use CONTEXT 7 MCP Server.** Research OpenAI Agents SDK docs to find the correct way to maintain conversation context.

5. **Handle errors gracefully.** Don't let Agent crashes break the API. Return user-friendly errors.

**For Frontend Developer:**

1. **Your main job:** Create chatbot UI that sends messages to backend and displays responses.

2. **Match the theme exactly.** Use the dark background and cyan accent colors shown in the screenshot.

3. **Handle session IDs.** Save to localStorage, send with each request, handle new sessions.

4. **Focus on UX.** Smooth animations, auto-scroll, loading indicators, error messages.

5. **Test thoroughly.** Try edge cases, errors, long messages, mobile devices.

**Key Connection Points:**

Frontend sends:
```
{ message: "What is physical AI?", session_id: "abc-123" }
```

Backend returns:
```
{ response: "Physical AI refers to...", session_id: "abc-123" }
```

That's the interface. Get this working first, then polish.

---

## 15. Next Steps

**Phase 1: Backend (Week 1)**
1. Set up FastAPI project
2. Add CORS for localhost:3000
3. Create /api/chat endpoint with Pydantic models
4. Import and call existing Agent code (modify if needed)
5. Implement basic session storage (in-memory to start)
6. Test with curl/Postman
7. Verify Agent responses work through API

**Phase 2: Session Management (Week 2)**
1. Research OpenAI Agents SDK using CONTEXT 7 MCP
2. Implement proper conversation history storage
3. Figure out how to pass history to Agent (modify Agent if necessary)
4. Test multi-turn conversations
5. Switch to Redis if needed

**Phase 3: Frontend (Week 2-3)**
1. Create chatbot icon component
2. Create chatbot window component
3. Style to match website theme
4. Implement API calls
5. Add to Docusaurus layout
6. Test on all pages

**Phase 4: Integration & Testing (Week 3)**
1. Connect frontend to backend
2. Test full user flow
3. Fix bugs
4. Optimize performance
5. Test on mobile

---

## 16. Final Notes

**Remember:**

- The Agent code is a good foundation but CAN BE MODIFIED if needed for integration.
- The website theme is DARK with CYAN accents. Match it exactly.
- The main challenge is CONNECTING frontend to backend and MAINTAINING sessions.
- Focus on making the connection work first, then polish the UI.
- Test frequently. Don't wait until everything is done.

**Critical Success Factors:**

1. **Session management works** - Multi-turn conversations maintain context
2. **Theme matches perfectly** - Feels native to the website
3. **Error handling is robust** - Never crashes, always gives feedback
4. **Response time is acceptable** - < 5 seconds for most queries
5. **Works on mobile** - Responsive and usable on small screens

**The goal:** User asks question about Physical AI → Gets intelligent answer from your Agent → Can have a natural conversation.

---

**End of Specification** ADD THIS FOR CHATBOT SPECIFCIATION "ONLY WRITE SPECIFICATION" ultrathink