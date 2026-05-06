/**
 * Game Context — Math Master v3.0
 * React Context provider for global game state
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import GameEngine from '../engine/GameEngine';
import AchievementEngine from '../engine/AchievementEngine';
import i18n from '../i18n';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [gameState, setGameState] = useState(GameEngine.state);
  const [language, setLanguageState] = useState('en');
  const [loading, setLoading] = useState(true);
  const [newAchievements, setNewAchievements] = useState([]);

  useEffect(() => {
    const init = async () => {
      const lang = await i18n.init();
      setLanguageState(lang);
      await GameEngine.load();
      await AchievementEngine.load();
      setGameState({ ...GameEngine.state });
      setLoading(false);
    };
    init();

    const unsub = GameEngine.subscribe((state) => setGameState(state));
    return () => unsub();
  }, []);

  const checkAchievements = useCallback(async () => {
    const newlyUnlocked = await AchievementEngine.checkAll(GameEngine.state);
    if (newlyUnlocked.length > 0) {
      setNewAchievements(newlyUnlocked);
    }
  }, []);

  const setLanguage = useCallback(async (code) => {
    await i18n.setLanguage(code);
    setLanguageState(code);
  }, []);

  const t = useCallback((key, params) => {
    return i18n.t(key, params);
  }, [language]); // eslint-disable-line

  const clearNewAchievements = useCallback(() => {
    setNewAchievements([]);
  }, []);

  const value = {
    state: gameState,
    loading,
    language,
    setLanguage,
    t,
    engine: GameEngine,
    achievements: AchievementEngine,
    checkAchievements,
    newAchievements,
    clearNewAchievements,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used inside GameProvider');
  return ctx;
}

export default GameContext;
