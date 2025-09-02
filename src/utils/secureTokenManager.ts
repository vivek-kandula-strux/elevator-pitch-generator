/**
 * Secure Token Manager - Handles access tokens securely
 * Moves tokens from URL parameters to sessionStorage for better security
 */

const TOKEN_KEY = 'pitch_access_token';
const TOKEN_EXPIRY_KEY = 'pitch_token_expiry';
const TOKEN_EXPIRY_HOURS = 24; // Token expires after 24 hours

interface TokenData {
  token: string;
  recordId: string;
  expiry: number;
}

export class SecureTokenManager {
  /**
   * Store token securely in sessionStorage with expiry
   */
  static storeToken(token: string, recordId: string): void {
    const expiry = Date.now() + (TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);
    const tokenData: TokenData = {
      token,
      recordId,
      expiry
    };
    
    try {
      sessionStorage.setItem(TOKEN_KEY, JSON.stringify(tokenData));
    } catch (error) {
      console.error('Failed to store token securely:', error);
    }
  }

  /**
   * Retrieve token from secure storage and validate expiry
   */
  static getToken(recordId: string): string | null {
    try {
      const stored = sessionStorage.getItem(TOKEN_KEY);
      if (!stored) return null;

      const tokenData: TokenData = JSON.parse(stored);
      
      // Check if token has expired
      if (Date.now() > tokenData.expiry) {
        this.clearToken();
        return null;
      }

      // Check if token matches the requested record
      if (tokenData.recordId !== recordId) {
        return null;
      }

      return tokenData.token;
    } catch (error) {
      console.error('Failed to retrieve token:', error);
      return null;
    }
  }

  /**
   * Clear stored token
   */
  static clearToken(): void {
    try {
      sessionStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error('Failed to clear token:', error);
    }
  }

  /**
   * Extract token from URL and store it securely, then clean URL
   */
  static handleUrlToken(recordId: string): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token && recordId) {
      // Store token securely
      this.storeToken(token, recordId);
      
      // Clean URL by removing token parameter
      urlParams.delete('token');
      const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
      window.history.replaceState(null, '', newUrl);
      
      return token;
    }

    // Try to get from secure storage
    return this.getToken(recordId);
  }

  /**
   * Validate token format (basic UUID validation)
   */
  static isValidTokenFormat(token: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(token);
  }
}