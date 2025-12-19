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
}

const ChatbotComponent: React.FC = () => {
  const [state, setState] = useState<ChatbotState>({
    isOpen: false,
    messages: [],
    inputText: '',
    isLoading: false,
    sessionId: null,
    error: null,
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
      isOpen: !prev.isOpen
    }));
  };

  const closeChatbot = () => {
    setState(prev => ({
      ...prev,
      isOpen: false
    }));
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
      {!state.isOpen && (
        <div className="chatbot-icon-container">
          <button
            className="chatbot-icon"
            onClick={toggleChatbot}
            aria-label="Open chatbot"
            title="Ask about Physical AI and Robotics"
          >
            <svg
              className="chatbot-icon-svg"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      {state.isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>Physical AI Assistant</h3>
            <button className="close-button" onClick={closeChatbot} aria-label="Close chat">
              ×
            </button>
          </div>

          <div className="chatbot-messages">
            {state.messages.length === 0 ? (
              <div className="welcome-message">
                <p>Hello! I'm your Physical AI & Humanoid Robotics assistant.</p>
                <p>Ask me anything about the book content, and I'll help you find relevant information.</p>
              </div>
            ) : (
              state.messages.map((message) => (
                <div
                  key={message.id}
                  className={`message-bubble ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
                >
                  <div className="message-content">{message.content}</div>
                  <div className="message-timestamp">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))
            )}
            {state.isLoading && (
              <div className="message-bubble assistant-message">
                <div className="typing-indicator">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="input-area">
            <div className="input-container">
              <textarea
                ref={textareaRef}
                className="message-input"
                value={state.inputText}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask about Physical AI and Robotics..."
                disabled={state.isLoading}
                rows={1}
                maxLength={10000}
              />
              <button
                className={`send-button ${state.inputText.trim() ? 'active' : ''}`}
                onClick={handleSendClick}
                disabled={state.isLoading || !state.inputText.trim()}
                aria-label="Send message"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="send-icon"
                >
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotComponent;