/**
 * Storage Manager Utility
 * Handles all AsyncStorage operations with error handling and validation
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  COMPLETED_LEVEL: 'completedLevel',
  CURRENT_LEVEL: 'currentLevel',
  SOUND_ENABLED: 'soundEnabled',
  STATS: 'mathStats',
  CATEGORY_STATS: 'categoryStats',
};

class StorageManager {
  /**
   * Get completed level
   */
  async getCompletedLevel() {
    try {
      const level = await AsyncStorage.getItem(STORAGE_KEYS.COMPLETED_LEVEL);
      return level ? parseInt(level, 10) : 0;
    } catch (error) {
      console.error('Error getting completed level:', error);
      return 0;
    }
  }

  /**
   * Set completed level
   */
  async setCompletedLevel(levelNumber) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.COMPLETED_LEVEL, levelNumber.toString());
      return true;
    } catch (error) {
      console.error('Error setting completed level:', error);
      return false;
    }
  }

  /**
   * Get current level
   */
  async getCurrentLevel() {
    try {
      const level = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_LEVEL);
      return level ? parseInt(level, 10) : 1;
    } catch (error) {
      console.error('Error getting current level:', error);
      return 1;
    }
  }

  /**
   * Set current level
   */
  async setCurrentLevel(levelNumber) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_LEVEL, levelNumber.toString());
      return true;
    } catch (error) {
      console.error('Error setting current level:', error);
      return false;
    }
  }

  /**
   * Get sound enabled status
   */
  async isSoundEnabled() {
    try {
      const enabled = await AsyncStorage.getItem(STORAGE_KEYS.SOUND_ENABLED);
      return enabled !== 'false'; // Default to true
    } catch (error) {
      console.error('Error getting sound status:', error);
      return true;
    }
  }

  /**
   * Set sound enabled status
   */
  async setSoundEnabled(enabled) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, enabled.toString());
      return true;
    } catch (error) {
      console.error('Error setting sound status:', error);
      return false;
    }
  }

  /**
   * Get stats
   */
  async getStats() {
    try {
      const stats = await AsyncStorage.getItem(STORAGE_KEYS.STATS);
      return stats ? JSON.parse(stats) : this.getDefaultStats();
    } catch (error) {
      console.error('Error getting stats:', error);
      return this.getDefaultStats();
    }
  }

  /**
   * Update stats
   */
  async updateStats(updates) {
    try {
      const currentStats = await this.getStats();
      const newStats = { ...currentStats, ...updates };
      await AsyncStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(newStats));
      return true;
    } catch (error) {
      console.error('Error updating stats:', error);
      return false;
    }
  }

  /**
   * Get default stats
   */
  getDefaultStats() {
    return {
      totalAttempts: 0,
      correctAnswers: 0,
      highScore: 0,
      lastPlayed: null,
      categoryPerformance: {},
    };
  }

  /**
   * Clear all data
   */
  async clearAllData() {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  }

  /**
   * Get all data (for debugging)
   */
  async getAllData() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const data = await AsyncStorage.multiGet(keys);
      return Object.fromEntries(data);
    } catch (error) {
      console.error('Error getting all data:', error);
      return {};
    }
  }
}

export default new StorageManager();
