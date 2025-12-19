# Physical AI & Humanoid Robotics Educational Platform

This repository contains the educational content and platform for learning about Physical AI & Humanoid Robotics.

## Features

- Educational content for Physical AI & Humanoid Robotics
- Interactive learning modules
- Docusaurus-based documentation site
- Supabase authentication system with cross-tab synchronization
- Email verification with automatic authentication
- Consistent authentication state across all browser tabs

## Authentication State Synchronization

This platform implements advanced authentication state synchronization that ensures:

- When a user verifies their email in one tab, all other open tabs automatically update to reflect the authenticated state
- Logout from any tab propagates to all other tabs
- Authentication state remains consistent across all browser contexts
- No manual page refresh required after verification or authentication changes

## Setup

1. Install dependencies: `npm install`
2. Set up environment variables for Supabase authentication
3. Run the development server: `npm run start`

For detailed setup instructions, see the [Authentication Setup Guide](physical-ai-book/docs/authentication-setup.md).

## Technologies Used

- Docusaurus v3.9.2
- React 19
- TypeScript 5.6.2
- Supabase for authentication
- BroadcastChannel API for cross-tab communication
- HTTP-only cookies for secure token storage



# we need to correct the auth and also need to also continue the RAG  CHATBOT

// to run backend uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000


INFO:     127.0.0.1:55426 - "POST /api/v1/ HTTP/1.1" 500 Internal Server Error