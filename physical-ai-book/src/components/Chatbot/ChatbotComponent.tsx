import React, { useState, useEffect, useRef } from 'react';
import { sendMessage, ChatRequest, ChatResponse } from '../../services/chatbot-api';
import './chatbot.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  status?: 'sent' | 'processing' | 'error';
}

interface ChatbotState {
  isOpen: boolean;
  messages: Message[];
  inputText: string;
  isLoading: boolean;
  sessionId: string | null;
  error: string | null;
  showWelcomePopup: boolean;
}

const ChatbotComponent: React.FC = () => {
  const [state, setState] = useState<ChatbotState>({
    isOpen: false,
    messages: [],
    inputText: '',
    isLoading: false,
    sessionId: null,
    error: null,
    showWelcomePopup: true,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load session ID from localStorage on component mount
  useEffect(() => {
    const savedSessionId = localStorage.getItem('chatbot-session-id');
    if (savedSessionId) {
      setState(prev => ({
        ...prev,
        sessionId: savedSessionId
      }));
    }

    // Show welcome popup after 2 seconds
    const welcomeTimer = setTimeout(() => {
      const hasSeenWelcome = localStorage.getItem('chatbot-welcome-seen');
      if (!hasSeenWelcome) {
        setState(prev => ({ ...prev, showWelcomePopup: true }));
      }
    }, 2000);

    return () => clearTimeout(welcomeTimer);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [state.inputText]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChatbot = () => {
    setState(prev => ({
      ...prev,
      isOpen: !prev.isOpen,
      showWelcomePopup: false
    }));
    localStorage.setItem('chatbot-welcome-seen', 'true');
  };

  const closeChatbot = () => {
    setState(prev => ({
      ...prev,
      isOpen: false
    }));
  };

  const dismissWelcomePopup = (e: React.MouseEvent) => {
    e.stopPropagation();
    setState(prev => ({
      ...prev,
      showWelcomePopup: false
    }));
    localStorage.setItem('chatbot-welcome-seen', 'true');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setState(prev => ({
      ...prev,
      inputText: e.target.value
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (!state.inputText.trim() || state.isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: state.inputText,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };

    // Optimistically add user message to UI
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      inputText: '',
      isLoading: true,
      error: null
    }));

    try {
      // Create chat request
      const chatRequest: ChatRequest = {
        message: state.inputText,
        sessionId: state.sessionId || undefined
      };

      // Send message to backend API
      const response: ChatResponse = await sendMessage(chatRequest);

      // Update session ID if new one was returned
      if (response.sessionId && response.sessionId !== state.sessionId) {
        localStorage.setItem('chatbot-session-id', response.sessionId);
        setState(prev => ({
          ...prev,
          sessionId: response.sessionId
        }));
      }

      // Add assistant response to messages
      const assistantMessage: Message = {
        id: `resp-${Date.now()}`,
        role: 'assistant',
        content: response.response,
        timestamp: response.timestamp,
        status: response.blocked ? 'error' : 'sent'
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false
      }));
    } catch (error: any) {
      // Create error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: error.details || 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date().toISOString(),
        status: 'error'
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
        isLoading: false,
        error: (error as any).error || 'An error occurred'
      }));
    }
  };

  const handleSendClick = () => {
    handleSendMessage();
  };

  return (
    <>
      {/* Floating Button with Welcome Popup */}
      {!state.isOpen && (
        <div className="chatbot-floating-container">
          {/* Welcome Popup Bubble */}
          {state.showWelcomePopup && (
            <div className="chatbot-welcome-popup">
              <button
                className="welcome-popup-close"
                onClick={dismissWelcomePopup}
                aria-label="Close welcome message"
              >
                ×
              </button>
              <div className="welcome-popup-content">
                <span className="welcome-wave">👋</span>
                <div className="welcome-text">
                  <strong>Hi! I'm ARIA 👋</strong>
                  <p>How can I help you today?</p>
                </div>
              </div>
              <div className="welcome-popup-arrow"></div>
            </div>
          )}

          {/* Chat Button */}
          <button
            className="chatbot-fab"
            onClick={toggleChatbot}
            aria-label="Open chatbot"
            title="Ask about Physical AI and Robotics"
          >
            <svg
              className="chatbot-fab-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 2.98.97 4.29L1 23l6.71-1.97C9.02 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm-1 14h2v2h-2v-2zm0-8h2v6h-2V8z" />
            </svg>
          </button>
        </div>
      )}

      {/* Chat Window */}
      {state.isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 2.98.97 4.29L1 23l6.71-1.97C9.02 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" />
                </svg>
              </div>
              <div className="chatbot-header-text">
                <h3>ARIA</h3>
                <span className="chatbot-status">
                  <span className="status-dot"></span>
                  Online
                </span>
              </div>
            </div>
            <button className="chatbot-close-btn" onClick={closeChatbot} aria-label="Close chat">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="chatbot-messages">
            {state.messages.length === 0 ? (
              <div className="chatbot-empty-state">
                <div className="empty-state-icon">🤖</div>
                <h4>Hi! I'm ARIA</h4>
                <p>Your Physical AI & Robotics assistant. Ask me anything about the book!</p>
                <div className="suggestion-chips">
                  <button onClick={() => setState(prev => ({ ...prev, inputText: 'What is Physical AI?' }))}>
                    What is Physical AI?
                  </button>
                  <button onClick={() => setState(prev => ({ ...prev, inputText: 'Tell me about humanoid robots' }))}>
                    Humanoid robots
                  </button>
                  <button onClick={() => setState(prev => ({ ...prev, inputText: 'Explain sensors in robotics' }))}>
                    Sensors
                  </button>
                </div>
              </div>
            ) : (
              state.messages.map((message) => (
                <div
                  key={message.id}
                  className={`chat-message ${message.role === 'user' ? 'user-msg' : 'assistant-msg'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="message-avatar">🤖</div>
                  )}
                  <div className="message-bubble">
                    <div className="message-text">{message.content}</div>
                    <div className="message-time">
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))
            )}
            {state.isLoading && (
              <div className="chat-message assistant-msg">
                <div className="message-avatar">🤖</div>
                <div className="message-bubble typing-bubble">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="chatbot-input-area">
            <div className="input-wrapper">
              <textarea
                ref={textareaRef}
                className="chat-input"
                value={state.inputText}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Type your question..."
                disabled={state.isLoading}
                rows={1}
                maxLength={10000}
              />
              <button
                className={`send-btn ${state.inputText.trim() ? 'active' : ''}`}
                onClick={handleSendClick}
                disabled={state.isLoading || !state.inputText.trim()}
                aria-label="Send message"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
            <div className="input-footer">
              <span>Powered by AI</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotComponent;