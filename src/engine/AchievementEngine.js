/**
 * Achievement Engine — Math Master v3.0
 * 30+ unlockable achievements with badge system
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const ACHIEVEMENTS_KEY = 'achievements_v3';

const ACHIEVEMENT_DEFS = [
  { id: 'first_steps', icon: '👣', check: s => s.totalCorrect >= 1 },
  { id: 'speed_demon', icon: '⚡', check: s => s.timeHighScore >= 20 },
  { id: 'perfect_10', icon: '🎯', check: s => s.bestStreak >= 10 },
  { id: 'math_explorer', icon: '🧭', check: s => s.categoriesPlayed?.length >= 5 },
  { id: 'daily_warrior', icon: '⚔️', check: s => s.dailyStreak >= 7 },
  { id: 'century_club', icon: '💯', check: s => s.totalCorrect >= 100 },
  { id: 'streak_master', icon: '🔥', check: s => s.dailyStreak >= 30 },
  { id: 'math_legend', icon: '👑', check: s => s.level >= 50 },
  { id: 'coin_collector', icon: '💰', check: s => s.totalCoinsEarned >= 1000 },
  { id: 'perfect_game', icon: '✨', check: s => s.hadPerfectGame === true },
  { id: 'five_hundred', icon: '🏅', check: s => s.totalCorrect >= 500 },
  { id: 'thousand', icon: '🏆', check: s => s.totalCorrect >= 1000 },
  { id: 'level_10', icon: '⭐', check: s => s.level >= 10 },
  { id: 'level_25', icon: '🌟', check: s => s.level >= 25 },
  { id: 'streak_5', icon: '🔗', check: s => s.bestStreak >= 5 },
  { id: 'streak_25', icon: '⛓️', check: s => s.bestStreak >= 25 },
  { id: 'streak_50', icon: '💎', check: s => s.bestStreak >= 50 },
  { id: 'daily_3', icon: '📅', check: s => s.dailyStreak >= 3 },
  { id: 'daily_14', icon: '📆', check: s => s.dailyStreak >= 14 },
  { id: 'games_50', icon: '🎮', check: s => s.gamesPlayed >= 50 },
  { id: 'games_200', icon: '🕹️', check: s => s.gamesPlayed >= 200 },
  { id: 'all_basics', icon: '📚', check: s => {
    const basics = ['addition', 'subtraction', 'multiplication', 'division'];
    return basics.every(c => s.categoriesPlayed?.includes(c));
  }},
  { id: 'all_advanced', icon: '🎓', check: s => {
    const adv = ['algebra', 'exponents', 'roots', 'equations'];
    return adv.every(c => s.categoriesPlayed?.includes(c));
  }},
  { id: 'brain_teaser', icon: '🧩', check: s => {
    const bt = ['logicPuzzles', 'wordProblems', 'numberPatterns', 'probability'];
    return bt.every(c => s.categoriesPlayed?.includes(c));
  }},
  { id: 'all_categories', icon: '🌈', check: s => s.categoriesPlayed?.length >= 15 },
  { id: 'accuracy_90', icon: '🎖️', check: s => s.totalAttempts >= 50 && (s.totalCorrect / s.totalAttempts) >= 0.9 },
  { id: 'coin_5000', icon: '🤑', check: s => s.totalCoinsEarned >= 5000 },
  { id: 'early_bird', icon: '🐦', check: s => s.dailyStreak >= 1 },
  { id: 'night_owl', icon: '🦉', check: s => s.gamesPlayed >= 10 },
  { id: 'dedicated', icon: '💪', check: s => s.gamesPlayed >= 500 },
];

class AchievementEngine {
  constructor() {
    this.unlocked = [];
    this.totalCoinsEarned = 0;
    this.timeHighScore = 0;
    this.hadPerfectGame = false;
  }

  async load() {
    try {
      const data = await AsyncStorage.getItem(ACHIEVEMENTS_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        this.unlocked = parsed.unlocked || [];
        this.totalCoinsEarned = parsed.totalCoinsEarned || 0;
        this.timeHighScore = parsed.timeHighScore || 0;
        this.hadPerfectGame = parsed.hadPerfectGame || false;
      }
    } catch (e) {
      console.warn('Achievement load error:', e);
    }
  }

  async save() {
    try {
      await AsyncStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify({
        unlocked: this.unlocked,
        totalCoinsEarned: this.totalCoinsEarned,
        timeHighScore: this.timeHighScore,
        hadPerfectGame: this.hadPerfectGame,
      }));
    } catch (e) {
      console.warn('Achievement save error:', e);
    }
  }

  /**
   * Check all achievements against current game state
   * Returns array of newly unlocked achievement IDs
   */
  async checkAll(gameState) {
    const state = {
      ...gameState,
      totalCoinsEarned: this.totalCoinsEarned,
      timeHighScore: this.timeHighScore,
      hadPerfectGame: this.hadPerfectGame,
    };

    const newlyUnlocked = [];

    for (const def of ACHIEVEMENT_DEFS) {
      if (this.unlocked.includes(def.id)) continue;
      try {
        if (def.check(state)) {
          this.unlocked.push(def.id);
          newlyUnlocked.push(def.id);
        }
      } catch (e) {
        // Skip broken checks
      }
    }

    if (newlyUnlocked.length > 0) {
      await this.save();
    }

    return newlyUnlocked;
  }

  recordCoinsEarned(amount) {
    this.totalCoinsEarned += amount;
  }

  recordTimeHighScore(score) {
    this.timeHighScore = Math.max(this.timeHighScore, score);
  }

  recordPerfectGame() {
    this.hadPerfectGame = true;
  }

  getAll() {
    return ACHIEVEMENT_DEFS.map(def => ({
      ...def,
      unlocked: this.unlocked.includes(def.id),
    }));
  }

  getUnlockedCount() {
    return this.unlocked.length;
  }

  getTotalCount() {
    return ACHIEVEMENT_DEFS.length;
  }

  async reset() {
    this.unlocked = [];
    this.totalCoinsEarned = 0;
    this.timeHighScore = 0;
    this.hadPerfectGame = false;
    await this.save();
  }
}

export default new AchievementEngine();
