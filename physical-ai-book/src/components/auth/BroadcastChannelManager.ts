/**
 * BroadcastChannelManager - Manages cross-tab communication for authentication state synchronization
 */

// Define message types for authentication state synchronization
export type CrossTabMessageType =
  | 'AUTH_UPDATE'
  | 'LOGOUT'
  | 'TOKEN_EXPIRED'
  | 'REFRESH_TOKEN';

// Define the structure of a cross-tab message
export interface CrossTabMessage {
  type: CrossTabMessageType;
  data?: any;
  timestamp: number;
  sourceTabId: string;
}

// Define authentication state data that can be shared
export interface AuthStateData {
  isAuthenticated: boolean;
  user?: any;
  session?: any;
  emailVerified?: boolean;
}

class BroadcastChannelManager {
  private channel: BroadcastChannel | null = null;
  private readonly channelName: string;
  private readonly tabId: string;
  private messageHandlers: Map<CrossTabMessageType, Array<(data: any) => void>> = new Map();
  private fallbackTimer: number | null = null;
  private isBrowser: boolean;

  constructor(channelName: string = 'auth-sync-channel') {
    // Check if we're in a browser environment
    this.isBrowser = typeof window !== 'undefined' && typeof window.addEventListener !== 'undefined';
    this.channelName = channelName;

    // Generate a unique ID for this tab instance (only in browser)
    this.tabId = this.isBrowser
      ? `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      : 'server_instance';

    if (this.isBrowser) {
      // Initialize BroadcastChannel if supported
      if (typeof BroadcastChannel !== 'undefined') {
        this.channel = new BroadcastChannel(this.channelName);
        this.channel.onmessage = this.handleMessage.bind(this);
      } else {
        console.warn('BroadcastChannel not supported, falling back to localStorage events');
        // Set up fallback using localStorage events
        window.addEventListener('storage', this.handleStorageEvent.bind(this));
      }

      // Set up cleanup
      window.addEventListener('beforeunload', this.cleanup.bind(this));
    }
  }

  /**
   * Subscribe to specific message types
   */
  subscribe(type: CrossTabMessageType, handler: (data: any) => void): void {
    if (!this.isBrowser) {
      // Skip subscription on server side
      return;
    }

    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, []);
    }
    const handlers = this.messageHandlers.get(type)!;
    handlers.push(handler);
  }

  /**
   * Unsubscribe from specific message types
   */
  unsubscribe(type: CrossTabMessageType, handler: (data: any) => void): void {
    if (!this.isBrowser) {
      // Skip unsubscription on server side
      return;
    }

    const handlers = this.messageHandlers.get(type);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * Send a message to other tabs
   */
  sendMessage(type: CrossTabMessageType, data?: any): void {
    if (!this.isBrowser) {
      // Skip sending messages on server side
      return;
    }

    const message: CrossTabMessage = {
      type,
      data,
      timestamp: Date.now(),
      sourceTabId: this.tabId
    };

    // Validate message before sending
    if (!this.isValidMessage(message)) {
      console.warn('Invalid message format, not sending:', message);
      return;
    }

    if (this.channel) {
      // Use BroadcastChannel
      this.channel.postMessage(message);
    } else {
      // Fallback to localStorage
      this.sendViaLocalStorage(message);
    }
  }

  /**
   * Send message via localStorage as fallback
   */
  private sendViaLocalStorage(message: CrossTabMessage): void {
    if (!this.isBrowser) {
      // Skip localStorage operations on server side
      return;
    }

    // Use localStorage to communicate with other tabs
    const key = `auth-sync-message-${Date.now()}`;
    localStorage.setItem(key, JSON.stringify(message));

    // Clean up after a short time
    setTimeout(() => {
      localStorage.removeItem(key);
    }, 100);
  }

  /**
   * Handle incoming messages from BroadcastChannel
   */
  private handleMessage(event: MessageEvent): void {
    const message: CrossTabMessage = event.data;

    // Validate the message
    if (!this.isValidMessage(message)) {
      console.warn('Received invalid message, ignoring:', message);
      return;
    }

    // Don't process messages from this tab
    if (message.sourceTabId === this.tabId) {
      return;
    }

    // Process the message based on type
    this.processMessage(message);
  }

  /**
   * Handle incoming messages from localStorage events (fallback)
   */
  private handleStorageEvent(event: StorageEvent): void {
    if (!this.isBrowser) {
      // Skip storage event handling on server side
      return;
    }

    if (event.key && event.key.startsWith('auth-sync-message-') && event.newValue) {
      try {
        const message: CrossTabMessage = JSON.parse(event.newValue);

        // Validate the message
        if (!this.isValidMessage(message)) {
          console.warn('Received invalid message via localStorage, ignoring:', message);
          return;
        }

        // Don't process messages from this tab
        if (message.sourceTabId === this.tabId) {
          return;
        }

        // Process the message based on type
        this.processMessage(message);
      } catch (error) {
        console.error('Error parsing localStorage message:', error);
      }
    }
  }

  /**
   * Process a validated message
   */
  private processMessage(message: CrossTabMessage): void {
    // Check if message is too old (more than 1 minute old)
    if (Date.now() - message.timestamp > 60000) {
      console.warn('Received outdated message, ignoring:', message);
      return;
    }

    // Get handlers for this message type
    const handlers = this.messageHandlers.get(message.type);
    if (handlers) {
      // Call all handlers for this message type
      handlers.forEach(handler => {
        try {
          handler(message.data);
        } catch (error) {
          console.error(`Error in message handler for ${message.type}:`, error);
        }
      });
    }
  }

  /**
   * Validate message format
   */
  private isValidMessage(message: any): message is CrossTabMessage {
    return (
      message &&
      typeof message === 'object' &&
      ['AUTH_UPDATE', 'LOGOUT', 'TOKEN_EXPIRED', 'REFRESH_TOKEN'].includes(message.type) &&
      typeof message.timestamp === 'number' &&
      typeof message.sourceTabId === 'string' &&
      message.sourceTabId.length > 0
    );
  }

  /**
   * Cleanup resources
   */
  private cleanup(): void {
    if (!this.isBrowser) {
      // Skip cleanup on server side
      return;
    }

    if (this.channel) {
      this.channel.close();
    }

    if (this.fallbackTimer) {
      clearTimeout(this.fallbackTimer);
    }
  }

  /**
   * Notify other tabs of authentication state update
   */
  notifyAuthUpdate(authState: AuthStateData): void {
    this.sendMessage('AUTH_UPDATE', authState);
  }

  /**
   * Notify other tabs of logout
   */
  notifyLogout(): void {
    this.sendMessage('LOGOUT');
  }

  /**
   * Notify other tabs of token expiration
   */
  notifyTokenExpired(): void {
    this.sendMessage('TOKEN_EXPIRED');
  }

  /**
   * Notify other tabs to refresh tokens
   */
  notifyTokenRefresh(): void {
    this.sendMessage('REFRESH_TOKEN');
  }

  /**
   * Get the tab ID for this instance
   */
  getTabId(): string {
    return this.tabId;
  }
}

// Singleton instance
let broadcastChannelManager: BroadcastChannelManager | null = null;

export const getBroadcastChannelManager = (): BroadcastChannelManager => {
  // Check if we're in a browser environment before creating the instance
  const isBrowser = typeof window !== 'undefined';

  if (!broadcastChannelManager) {
    broadcastChannelManager = new BroadcastChannelManager();
  }

  return broadcastChannelManager;
};

export default BroadcastChannelManager;