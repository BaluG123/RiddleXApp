/**
 * API Client Utility
 * Handles all API calls with proper error handling, retries, and timeouts
 */

const API_BASE_URL = 'https://riddlexapi.pythonanywhere.com/api';
const REQUEST_TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

class APIClient {
  constructor() {
    this.cache = {};
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Fetch with timeout
   */
  async fetchWithTimeout(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Fetch with retry logic
   */
  async fetchWithRetry(url, options = {}, retries = MAX_RETRIES) {
    try {
      const response = await this.fetchWithTimeout(url, options);
      return await response.json();
    } catch (error) {
      if (retries > 0 && this.isRetryableError(error)) {
        await this.delay(RETRY_DELAY);
        return this.fetchWithRetry(url, options, retries - 1);
      }
      throw error;
    }
  }

  /**
   * Check if error is retryable
   */
  isRetryableError(error) {
    // Network errors, timeouts, and 5xx errors are retryable
    return (
      error.name === 'AbortError' ||
      error.message.includes('Network') ||
      error.message.includes('timeout') ||
      (error.message.includes('HTTP') && error.message.includes('5'))
    );
  }

  /**
   * Delay helper
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get question by level
   */
  async getQuestion(levelNumber) {
    const cacheKey = `question_${levelNumber}`;
    
    // Check cache
    if (this.cache[cacheKey] && Date.now() - this.cache[cacheKey].timestamp < this.cacheTimeout) {
      return this.cache[cacheKey].data;
    }

    try {
      const data = await this.fetchWithRetry(`${API_BASE_URL}/levels/${levelNumber}/`);
      
      // Validate response
      if (!data.answer) {
        throw new Error('Invalid question data: missing answer');
      }

      // Cache the result
      this.cache[cacheKey] = {
        data,
        timestamp: Date.now()
      };

      return data;
    } catch (error) {
      console.error(`Error fetching question ${levelNumber}:`, error);
      throw new Error(`Failed to load question. ${error.message}`);
    }
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache = {};
  }
}

export default new APIClient();
