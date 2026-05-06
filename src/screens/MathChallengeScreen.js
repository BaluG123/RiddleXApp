/**
 * MathChallengeScreen — Math Master v3.0
 * Unified game screen replacing 15 duplicate screens
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Alert, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useGame } from '../context/GameContext';
import { generateProblem } from '../engine/QuestionGenerator';
import { Colors, Gradients, CategoryConfig } from '../theme/colors';
import { FontSizes, Fonts } from '../theme/typography';
import { GradientHeader, OptionButton, StatPill } from '../components/UIComponents';
import adManager from '../util/adManager';

const MathChallengeScreen = ({ route, navigation }) => {
  const { category } = route.params;
  const { state, t, engine, checkAchievements } = useGame();
  const config = CategoryConfig[category] || CategoryConfig.mixed;

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [problem, setProblem] = useState(null);
  const [totalQ, setTotalQ] = useState(0);
  const [correctQ, setCorrectQ] = useState(0);
  const [showFeedback, setShowFeedback] = useState(null);
  const [disabled, setDisabled] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const gamesPlayedRef = useRef(0);

  useEffect(() => {
    generateNext();
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  const getDifficulty = useCallback(() => {
    return Math.min(Math.floor(score / 50) + 1, 8);
  }, [score]);

  const generateNext = useCallback(() => {
    const p = generateProblem(category, getDifficulty());
    setProblem(p);
    setDisabled(false);
  }, [category, getDifficulty]);

  const handleAnswer = useCallback(async (selected) => {
    if (disabled) return;
    setDisabled(true);
    const isCorrect = selected === problem.answer;
    setTotalQ(prev => prev + 1);

    if (isCorrect) {
      // Animate pulse
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.15, duration: 100, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
      ]).start();

      const newStreak = streak + 1;
      const multiplier = Math.min(newStreak, 5);
      const points = 10 * multiplier;
      setScore(prev => prev + points);
      setStreak(newStreak);
      setCorrectQ(prev => prev + 1);
      setShowFeedback({ type: 'correct', text: `+${points} 🎉` });

      await engine.recordCorrect(category, multiplier);
      await checkAchievements();
    } else {
      // Shake animation
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -6, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
      ]).start();

      setStreak(0);
      setLives(prev => prev - 1);
      setShowFeedback({ type: 'wrong', text: `${t('game.wrong')} Answer: ${problem.answer}` });
      await engine.recordWrong();

      if (lives <= 1) {
        gamesPlayedRef.current++;
        // Show interstitial every 5 games
        if (gamesPlayedRef.current % 5 === 0) {
          adManager.showInterstitialAd();
        }
        setTimeout(() => handleGameOver(), 1200);
        return;
      }
    }

    setTimeout(() => {
      setShowFeedback(null);
      generateNext();
    }, 800);
  }, [disabled, problem, streak, lives, category]);

  const handleGameOver = () => {
    const accuracy = totalQ > 0 ? Math.round((correctQ / totalQ) * 100) : 0;
    if (accuracy === 100 && totalQ >= 5) {
      engine.achievements?.recordPerfectGame?.();
    }

    Alert.alert(
      t('game.gameOver'),
      `${t('game.finalScore', { score })}\n${t('game.accuracy')}: ${accuracy}%\n${t('game.streak')}: ${streak}`,
      [
        { text: t('game.watchAdLife'), onPress: handleWatchAdForLife },
        { text: t('game.tryAgain'), onPress: resetGame },
        { text: t('game.exit'), onPress: () => navigation.goBack(), style: 'cancel' },
      ]
    );
  };

  const handleWatchAdForLife = async () => {
    const shown = await adManager.showRewardedAdForHint();
    if (shown) {
      setLives(1);
      await engine.addCoins(10);
      setShowFeedback(null);
      generateNext();
    }
  };

  const resetGame = () => {
    setScore(0);
    setStreak(0);
    setLives(3);
    setTotalQ(0);
    setCorrectQ(0);
    setShowFeedback(null);
    generateNext();
  };

  const handleHint = async () => {
    if (await engine.spendCoins(30)) {
      Alert.alert(t('game.hint'), problem?.hint || 'No hint available');
    } else {
      Alert.alert(t('game.hint'), `Need 30 coins. You have ${state.coins}.\nWatch ad for free hint?`, [
        { text: t('common.watchAd'), onPress: async () => {
          await adManager.showRewardedAdForHint();
          Alert.alert(t('game.hint'), problem?.hint || 'No hint available');
        }},
        { text: t('common.cancel'), style: 'cancel' },
      ]);
    }
  };

  return (
    <LinearGradient colors={Gradients.screenBg} style={styles.container}>
      <GradientHeader title={t(`categories.${category}`)} onBack={() => navigation.goBack()}
        rightComponent={
          <View style={styles.coinHeader}>
            <Text style={styles.coinText}>🪙 {state.coins}</Text>
          </View>
        }
      />

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <StatPill icon="emoji-events" label={t('game.score')} value={score} color={Colors.accentGreen} />
        <StatPill icon="favorite" label={t('game.lives')} value={'❤️'.repeat(lives)} color={Colors.accentRed} />
        <StatPill icon="bolt" label={t('game.streak')} value={`${streak}x`} color={Colors.accentYellow} />
      </View>

      {/* Problem Card */}
      <Animated.View style={[styles.problemWrapper, {
        transform: [{ scale: scaleAnim }, { translateX: shakeAnim }],
        opacity: fadeAnim,
      }]}>
        <LinearGradient colors={config.gradient} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.problemCard}>
          <Text style={styles.problemEmoji}>{config.emoji}</Text>
          <Text style={styles.problemText}>{problem?.question}</Text>
          {problem?.formula && <Text style={styles.formulaText}>{problem.formula}</Text>}
        </LinearGradient>
      </Animated.View>

      {/* Feedback */}
      {showFeedback && (
        <View style={[styles.feedbackBar, { backgroundColor: showFeedback.type === 'correct' ? Colors.correct + '30' : Colors.wrong + '30' }]}>
          <Text style={[styles.feedbackText, { color: showFeedback.type === 'correct' ? Colors.correct : Colors.wrong }]}>
            {showFeedback.text}
          </Text>
        </View>
      )}

      {/* Hint Button */}
      <View style={styles.hintRow}>
        <Text onPress={handleHint} style={styles.hintBtn}>💡 {t('game.hint')} (30🪙)</Text>
      </View>

      {/* Options */}
      <View style={styles.optionsGrid}>
        {problem?.options.map((opt, i) => (
          <OptionButton key={`${opt}-${i}`} label={opt} onPress={() => handleAnswer(opt)}
            gradient={config.gradient} disabled={disabled} />
        ))}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  coinHeader: { backgroundColor: Colors.surface, paddingHorizontal: wp(3), paddingVertical: hp(0.4), borderRadius: hp(1) },
  coinText: { color: Colors.coinGold, fontSize: FontSizes.sm, fontWeight: Fonts.bold },
  statsBar: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: wp(3), paddingVertical: hp(1) },
  problemWrapper: { paddingHorizontal: wp(4), marginVertical: hp(1) },
  problemCard: { borderRadius: hp(3), padding: hp(3), alignItems: 'center', justifyContent: 'center', minHeight: hp(22), elevation: 6, shadowColor: '#000', shadowOffset: {width:0,height:4}, shadowOpacity: 0.35, shadowRadius: 8 },
  problemEmoji: { fontSize: FontSizes.hero, marginBottom: hp(1) },
  problemText: { fontSize: FontSizes.xxl, color: '#fff', fontWeight: Fonts.bold, textAlign: 'center' },
  formulaText: { fontSize: FontSizes.sm, color: 'rgba(255,255,255,0.7)', marginTop: hp(0.8), fontStyle: 'italic' },
  feedbackBar: { marginHorizontal: wp(4), padding: hp(1), borderRadius: hp(1), alignItems: 'center' },
  feedbackText: { fontSize: FontSizes.md, fontWeight: Fonts.bold },
  hintRow: { alignItems: 'center', marginVertical: hp(0.5) },
  hintBtn: { color: Colors.textSecondary, fontSize: FontSizes.sm },
  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', paddingHorizontal: wp(3), marginTop: hp(1) },
});

export default MathChallengeScreen;
