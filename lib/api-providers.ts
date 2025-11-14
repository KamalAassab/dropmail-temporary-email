// Multi-provider API system with fallback support
const TIMEOUT = 15000;

export interface Domain {
  id: string;
  domain: string;
}

export interface Account {
  id: string;
  address: string;
  password: string;
}

export interface Message {
  id: string;
  from: {
    name: string;
    address: string;
  };
  to: Array<{
    name: string;
    address: string;
  }>;
  subject: string;
  intro: string;
  createdAt: string;
  seen: boolean;
}

export interface MessageDetail extends Message {
  html: string[];
  text: string;
}

export interface AuthToken {
  token: string;
  id: string;
}

export type APIProvider = 'mail.tm' | '1secmail' | 'tempmail';

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = TIMEOUT): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// ============= MAIL.TM API =============
const MAILTM_BASE = 'https://api.mail.tm';

export const MailTmAPI = {
  async getDomains(): Promise<Domain[]> {
    const response = await fetchWithTimeout(`${MAILTM_BASE}/domains`);
    if (!response.ok) throw new Error('Failed to fetch domains');
    const data = await response.json();
    return data['hydra:member'] || [];
  },

  async createAccount(address: string, password: string): Promise<Account> {
    const response = await fetchWithTimeout(`${MAILTM_BASE}/accounts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, password }),
    });
    
    if (!response.ok) {
      // Handle rate limiting (429)
      if (response.status === 429) {
        throw new Error('RATE_LIMITED: Too many requests. Please wait a few minutes and try again.');
      }
      
      const errorText = await response.text();
      let errorMessage = 'Failed to create account';
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData['hydra:description'] || errorData.detail || errorMessage;
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }
      console.error('Mail.tm account creation error:', errorMessage, 'Status:', response.status);
      throw new Error(errorMessage);
    }
    
    return response.json();
  },

  async getAuthToken(address: string, password: string): Promise<AuthToken> {
    const response = await fetchWithTimeout(`${MAILTM_BASE}/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, password }),
    });
    
    if (!response.ok) throw new Error('Failed to authenticate');
    return response.json();
  },

  async getMessages(token: string): Promise<Message[]> {
    const response = await fetchWithTimeout(`${MAILTM_BASE}/messages`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    if (!response.ok) {
      if (response.status === 401) throw new Error('TOKEN_EXPIRED');
      throw new Error('Failed to fetch messages');
    }
    
    const data = await response.json();
    return data['hydra:member'] || [];
  },

  async getMessage(token: string, messageId: string): Promise<MessageDetail> {
    const response = await fetchWithTimeout(`${MAILTM_BASE}/messages/${messageId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    if (!response.ok) throw new Error('Failed to fetch message');
    return response.json();
  },

  async deleteMessage(token: string, messageId: string): Promise<void> {
    const response = await fetchWithTimeout(`${MAILTM_BASE}/messages/${messageId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    if (!response.ok) throw new Error('Failed to delete message');
  },

  async deleteAccount(token: string, accountId: string): Promise<void> {
    const response = await fetchWithTimeout(`${MAILTM_BASE}/accounts/${accountId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    if (!response.ok) throw new Error('Failed to delete account');
  },
};

// ============= 1SECMAIL API =============
const SECMAIL_BASE = 'https://www.1secmail.com/api/v1/';

export const SecMailAPI = {
  async getDomains(): Promise<Domain[]> {
    const response = await fetchWithTimeout(`${SECMAIL_BASE}?action=getDomainList`);
    if (!response.ok) throw new Error('Failed to fetch domains');
    const domains: string[] = await response.json();
    return domains.map((domain, index) => ({ id: `${index}`, domain }));
  },

  async createAccount(address: string, password: string): Promise<Account> {
    // 1secmail doesn't require account creation, email is ready to use
    const [username, domain] = address.split('@');
    return {
      id: username,
      address,
      password,
    };
  },

  async getAuthToken(address: string, password: string): Promise<AuthToken> {
    // 1secmail doesn't use tokens, we return the username as token
    const [username] = address.split('@');
    return {
      token: username,
      id: username,
    };
  },

  async getMessages(token: string, domain: string): Promise<Message[]> {
    const response = await fetchWithTimeout(
      `${SECMAIL_BASE}?action=getMessages&login=${token}&domain=${domain}`
    );
    
    if (!response.ok) throw new Error('Failed to fetch messages');
    const messages: any[] = await response.json();
    
    return messages.map((msg) => ({
      id: String(msg.id),
      from: {
        name: msg.from,
        address: msg.from,
      },
      to: [{ name: '', address: `${token}@${domain}` }],
      subject: msg.subject || '(No Subject)',
      intro: msg.subject || '',
      createdAt: new Date(msg.date * 1000).toISOString(),
      seen: false,
    }));
  },

  async getMessage(token: string, domain: string, messageId: string): Promise<MessageDetail> {
    const response = await fetchWithTimeout(
      `${SECMAIL_BASE}?action=readMessage&login=${token}&domain=${domain}&id=${messageId}`
    );
    
    if (!response.ok) throw new Error('Failed to fetch message');
    const msg: any = await response.json();
    
    return {
      id: String(msg.id),
      from: {
        name: msg.from,
        address: msg.from,
      },
      to: [{ name: '', address: `${token}@${domain}` }],
      subject: msg.subject || '(No Subject)',
      intro: msg.subject || '',
      createdAt: new Date(msg.date * 1000).toISOString(),
      seen: true,
      html: msg.htmlBody ? [msg.htmlBody] : [],
      text: msg.textBody || msg.body || '',
    };
  },

  async deleteMessage(token: string, messageId: string): Promise<void> {
    // 1secmail doesn't support message deletion
    console.log('1secmail does not support message deletion');
  },

  async deleteAccount(token: string, accountId: string): Promise<void> {
    // 1secmail doesn't support account deletion
    console.log('1secmail does not support account deletion');
  },
};

// ============= API MANAGER WITH FALLBACK =============
export class APIManager {
  private currentProvider: APIProvider = 'mail.tm';
  private currentDomain: string = '';
  
  setProvider(provider: APIProvider) {
    this.currentProvider = provider;
  }

  getProvider(): APIProvider {
    return this.currentProvider;
  }

  setDomain(domain: string) {
    this.currentDomain = domain;
  }

  getDomain(): string {
    return this.currentDomain;
  }

  async getDomains(): Promise<Domain[]> {
    try {
      switch (this.currentProvider) {
        case 'mail.tm':
          return await MailTmAPI.getDomains();
        case '1secmail':
          return await SecMailAPI.getDomains();
        default:
          return await MailTmAPI.getDomains();
      }
    } catch (error) {
      console.error(`Failed to get domains from ${this.currentProvider}:`, error);
      // Fallback to mail.tm if current provider fails
      if (this.currentProvider !== 'mail.tm') {
        this.currentProvider = 'mail.tm';
        return await MailTmAPI.getDomains();
      }
      throw error;
    }
  }

  async createAccount(address: string, password: string): Promise<Account> {
    try {
      switch (this.currentProvider) {
        case 'mail.tm':
          return await MailTmAPI.createAccount(address, password);
        case '1secmail':
          return await SecMailAPI.createAccount(address, password);
        default:
          return await MailTmAPI.createAccount(address, password);
      }
    } catch (error) {
      console.error(`Failed to create account with ${this.currentProvider}:`, error);
      throw error;
    }
  }

  async getAuthToken(address: string, password: string): Promise<AuthToken> {
    try {
      switch (this.currentProvider) {
        case 'mail.tm':
          return await MailTmAPI.getAuthToken(address, password);
        case '1secmail':
          return await SecMailAPI.getAuthToken(address, password);
        default:
          return await MailTmAPI.getAuthToken(address, password);
      }
    } catch (error) {
      console.error(`Failed to get token from ${this.currentProvider}:`, error);
      throw error;
    }
  }

  async getMessages(token: string): Promise<Message[]> {
    try {
      switch (this.currentProvider) {
        case 'mail.tm':
          return await MailTmAPI.getMessages(token);
        case '1secmail':
          // Extract domain from stored email address
          let domain = this.currentDomain;
          if (domain.includes('@')) {
            domain = domain.split('@')[1];
          }
          console.log(`Checking inbox for ${token}@${domain}`);
          return await SecMailAPI.getMessages(token, domain);
        default:
          return await MailTmAPI.getMessages(token);
      }
    } catch (error) {
      console.error(`Failed to get messages from ${this.currentProvider}:`, error);
      console.error(`Domain: ${this.currentDomain}, Token: ${token}`);
      throw error;
    }
  }

  async getMessage(token: string, messageId: string): Promise<MessageDetail> {
    try {
      switch (this.currentProvider) {
        case 'mail.tm':
          return await MailTmAPI.getMessage(token, messageId);
        case '1secmail':
          // Extract domain from stored email address
          let domain = this.currentDomain;
          if (domain.includes('@')) {
            domain = domain.split('@')[1];
          }
          return await SecMailAPI.getMessage(token, domain, messageId);
        default:
          return await MailTmAPI.getMessage(token, messageId);
      }
    } catch (error) {
      console.error(`Failed to get message from ${this.currentProvider}:`, error);
      throw error;
    }
  }

  async deleteMessage(token: string, messageId: string): Promise<void> {
    try {
      switch (this.currentProvider) {
        case 'mail.tm':
          return await MailTmAPI.deleteMessage(token, messageId);
        case '1secmail':
          return await SecMailAPI.deleteMessage(token, messageId);
        default:
          return await MailTmAPI.deleteMessage(token, messageId);
      }
    } catch (error) {
      console.error(`Failed to delete message from ${this.currentProvider}:`, error);
      throw error;
    }
  }

  async deleteAccount(token: string, accountId: string): Promise<void> {
    try {
      switch (this.currentProvider) {
        case 'mail.tm':
          return await MailTmAPI.deleteAccount(token, accountId);
        case '1secmail':
          return await SecMailAPI.deleteAccount(token, accountId);
        default:
          return await MailTmAPI.deleteAccount(token, accountId);
      }
    } catch (error) {
      console.error(`Failed to delete account from ${this.currentProvider}:`, error);
      // Don't throw error for delete failures
    }
  }
}

// Export singleton instance
export const apiManager = new APIManager();

