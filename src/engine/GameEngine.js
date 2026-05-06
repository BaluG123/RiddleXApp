/**
 * Game Engine — Math Master v3.0
 * Manages XP, levels, progression, and user state
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const GAME_STATE_KEY = 'game_state_v3';

// XP required per level (exponential curve)
const XP_PER_LEVEL = Array.from({ length: 50 }, (_, i) => Math.floor(100 * Math.pow(1.15, i)));

const LEVEL_TITLES = [
  'Math Newbie', 'Beginner', 'Learner', 'Student', 'Apprentice',
  'Solver', 'Thinker', 'Calculator', 'Analyst', 'Strategist',
  'Problem Solver', 'Number Cruncher', 'Math Whiz', 'Prodigy', 'Scholar',
  'Expert', 'Specialist', 'Virtuoso', 'Genius', 'Maestro',
  'Champion', 'Conqueror', 'Titan', 'Olympian', 'Grandmaster',
  'Sage', 'Oracle', 'Wizard', 'Sorcerer', 'Alchemist',
  'Professor', 'Einstein', 'Newton', 'Euler', 'Gauss',
  'Archimedes', 'Pythagoras', 'Fibonacci', 'Turing', 'Ramanujan',
  'Immortal', 'Transcendent', 'Infinite', 'Cosmic', 'Quantum',
  'Stellar', 'Galactic', 'Universal', 'Mythical', 'Math Legend',
];

const DEFAULT_STATE = {
  xp: 0,
  level: 1,
  coins: 0,
  totalCorrect: 0,
  totalAttempts: 0,
  currentStreak: 0,
  bestStreak: 0,
  categoriesPlayed: [],
  gamesPlayed: 0,
  lastPlayedDate: null,
  dailyStreak: 0,
  dailyStreakLastDate: null,
  dailyChallengeCompleted: null,
  dailyWheelSpun: null,
  streakFreezes: 0,
  soundEnabled: true,
  achievements: [],
  avatar: 0,
};

class GameEngine {
  constructor() {
    this.state = { ...DEFAULT_STATE };
    this.listeners = [];
    this._loaded = false;
  }

  /**
   * Load state from storage, migrating old data if needed
   */
  async load() {
    try {
      const saved = await AsyncStorage.getItem(GAME_STATE_KEY);
      if (saved) {
        this.state = { ...DEFAULT_STATE, ...JSON.parse(saved) };
      } else {
        // Migrate from old app data
        await this._migrateOldData();
      }
      this._loaded = true;
      this._checkDailyStreak();
    } catch (e) {
      console.warn('GameEngine load error:', e);
    }
    return this.state;
  }

  /**
   * Migrate data from v2.x AsyncStorage keys
   */
  async _migrateOldData() {
    try {
      const completedLevel = await AsyncStorage.getItem('completedLevel');
      const mathStats = await AsyncStorage.getItem('mathStats');
      const timeHS = await AsyncStorage.getItem('timeHighScore');
      const soundPref = await AsyncStorage.getItem('soundEnabled');

      if (completedLevel) {
        const lvl = parseInt(completedLevel) || 0;
        this.state.xp = lvl * 50; // Give XP credit for completed levels
        this.state.level = Math.min(Math.floor(lvl / 2) + 1, 50);
        this.state.coins = lvl * 10; // Gift coins for progress
      }

      if (mathStats) {
        const stats = JSON.parse(mathStats);
        if (stats.categoryPerformance) {
          let tc = 0, ta = 0;
          Object.values(stats.categoryPerformance).forEach(cat => {
            tc += cat.correct || 0;
            ta += cat.total || 0;
          });
          this.state.totalCorrect = tc;
          this.state.totalAttempts = ta;
        }
      }

      if (timeHS) this.state.bestStreak = parseInt(timeHS) || 0;
      if (soundPref !== null) this.state.soundEnabled = soundPref !== 'false';

      await this._save();
      console.log('Migrated old data successfully');
    } catch (e) {
      console.warn('Migration error:', e);
    }
  }

  /**
   * Check and update daily streak
   */
  _checkDailyStreak() {
    const today = new Date().toDateString();
    const lastDate = this.state.dailyStreakLastDate;

    if (!lastDate) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (lastDate === today) {
      // Already played today
      return;
    } else if (lastDate === yesterday.toDateString()) {
      // Played yesterday, streak continues (will be incremented on play)
      return;
    } else {
      // Missed a day
      if (this.state.streakFreezes > 0) {
        this.state.streakFreezes--;
        this._save();
      } else {
        this.state.dailyStreak = 0;
        this._save();
      }
    }
  }

  /**
   * Record a correct answer
   */
  async recordCorrect(category, streakMultiplier = 1) {
    const baseXP = 10;
    const xpEarned = Math.floor(baseXP * streakMultiplier);
    const coinsEarned = 5 + (streakMultiplier > 3 ? 5 : 0);

    this.state.xp += xpEarned;
    this.state.coins += coinsEarned;
    this.state.totalCorrect++;
    this.state.totalAttempts++;
    this.state.currentStreak++;
    this.state.bestStreak = Math.max(this.state.bestStreak, this.state.currentStreak);
    this.state.gamesPlayed++;

    if (category && !this.state.categoriesPlayed.includes(category)) {
      this.state.categoriesPlayed.push(category);
    }

    // Check level up
    const leveledUp = this._checkLevelUp();

    await this._save();
    this._notify();

    return { xpEarned, coinsEarned, leveledUp, newLevel: this.state.level };
  }

  /**
   * Record a wrong answer
   */
  async recordWrong() {
    this.state.totalAttempts++;
    this.state.currentStreak = 0;
    this.state.gamesPlayed++;
    await this._save();
    this._notify();
  }

  /**
   * Record daily play for streak
   */
  async recordDailyPlay() {
    const today = new Date().toDateString();
    if (this.state.dailyStreakLastDate !== today) {
      this.state.dailyStreak++;
      this.state.dailyStreakLastDate = today;
      this.state.lastPlayedDate = today;

      // Streak bonus coins
      const streakBonus = Math.min(this.state.dailyStreak * 5, 50);
      this.state.coins += streakBonus;

      await this._save();
      this._notify();
      return streakBonus;
    }
    return 0;
  }

  /**
   * Complete daily challenge
   */
  async completeDailyChallenge() {
    const today = new Date().toDateString();
    if (this.state.dailyChallengeCompleted !== today) {
      this.state.dailyChallengeCompleted = today;
      this.state.xp += 50;
      this.state.coins += 50;
      await this._save();
      this._notify();
      return { xp: 50, coins: 50 };
    }
    return null;
  }

  /**
   * Spin daily wheel
   */
  async spinDailyWheel() {
    const today = new Date().toDateString();
    if (this.state.dailyWheelSpun === today) return null;

    const rewards = [10, 20, 30, 50, 75, 100, 15, 25];
    const reward = rewards[Math.floor(Math.random() * rewards.length)];
    this.state.coins += reward;
    this.state.dailyWheelSpun = today;
    await this._save();
    this._notify();
    return reward;
  }

  /**
   * Spend coins
   */
  async spendCoins(amount) {
    if (this.state.coins >= amount) {
      this.state.coins -= amount;
      await this._save();
      this._notify();
      return true;
    }
    return false;
  }

  /**
   * Add coins (from rewarded ads, etc.)
   */
  async addCoins(amount) {
    this.state.coins += amount;
    await this._save();
    this._notify();
  }

  /**
   * Buy streak freeze
   */
  async buyStreakFreeze() {
    if (await this.spendCoins(100)) {
      this.state.streakFreezes++;
      await this._save();
      return true;
    }
    return false;
  }

  /**
   * Check for level up
   */
  _checkLevelUp() {
    if (this.state.level >= 50) return false;
    const xpNeeded = this.getXPForNextLevel();
    if (this.state.xp >= xpNeeded) {
      this.state.level++;
      return true;
    }
    return false;
  }

  /**
   * Get total XP needed for next level
   */
  getXPForNextLevel() {
    if (this.state.level >= 50) return Infinity;
    let total = 0;
    for (let i = 0; i < this.state.level; i++) {
      total += XP_PER_LEVEL[i];
    }
    return total;
  }

  /**
   * Get XP progress within current level (0-1)
   */
  getXPProgress() {
    if (this.state.level >= 50) return 1;
    let prevTotal = 0;
    for (let i = 0; i < this.state.level - 1; i++) {
      prevTotal += XP_PER_LEVEL[i];
    }
    const currentLevelXP = this.state.xp - prevTotal;
    const needed = XP_PER_LEVEL[this.state.level - 1];
    return Math.min(Math.max(currentLevelXP / needed, 0), 1);
  }

  /**
   * Get XP remaining for next level
   */
  getXPRemaining() {
    const nextTotal = this.getXPForNextLevel();
    return Math.max(nextTotal - this.state.xp, 0);
  }

  /**
   * Get level title
   */
  getLevelTitle() {
    return LEVEL_TITLES[Math.min(this.state.level - 1, LEVEL_TITLES.length - 1)];
  }

  /**
   * Get accuracy percentage
   */
  getAccuracy() {
    if (this.state.totalAttempts === 0) return 0;
    return Math.round((this.state.totalCorrect / this.state.totalAttempts) * 100);
  }

  /**
   * Check if daily challenge is completed today
   */
  isDailyChallengeCompleted() {
    return this.state.dailyChallengeCompleted === new Date().toDateString();
  }

  /**
   * Check if wheel was spun today
   */
  isWheelSpunToday() {
    return this.state.dailyWheelSpun === new Date().toDateString();
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  _notify() {
    this.listeners.forEach(l => l({ ...this.state }));
  }

  async _save() {
    try {
      await AsyncStorage.setItem(GAME_STATE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('GameEngine save error:', e);
    }
  }

  async resetAll() {
    this.state = { ...DEFAULT_STATE };
    await AsyncStorage.clear();
    await this._save();
    this._notify();
  }
}

export default new GameEngine();
