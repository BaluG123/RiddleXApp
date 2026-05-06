/**
 * TimeChallengeScreen — Math Master v3.0
 * Solve as many problems as possible in 60 seconds
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useGame } from '../context/GameContext';
import { generateProblem } from '../engine/QuestionGenerator';
import { Colors, Gradients } from '../theme/colors';
import { FontSizes, Fonts } from '../theme/typography';
import { GradientHeader, OptionButton, StatPill } from '../components/UIComponents';
import adManager from '../util/adManager';

const CHALLENGE_TIME = 60;

const TimeChallengeScreen = ({ navigation }) => {
  const { state, t, engine, checkAchievements } = useGame();
  
  const [timeLeft, setTimeLeft] = useState(CHALLENGE_TIME);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [problem, setProblem] = useState(null);
  const [disabled, setDisabled] = useState(false);
  
  const timerRef = useRef(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const startChallenge = () => {
    setGameActive(true);
    setScore(0);
    setStreak(0);
    setTimeLeft(CHALLENGE_TIME);
    generateNext();
  };

  const generateNext = useCallback(() => {
    // difficulty increases with score
    const difficulty = Math.floor(score / 30) + 1;
    const p = generateProblem('mixed', difficulty);
    setProblem(p);
    setDisabled(false);
  }, [score]);

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleGameOver();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [gameActive, timeLeft]);

  const handleAnswer = (selected) => {
    if (disabled || !gameActive) return;
    setDisabled(true);

    const isCorrect = selected === problem.answer;

    if (isCorrect) {
      // Pulse animation
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.1, duration: 100, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
      ]).start();

      const newStreak = streak + 1;
      const points = 10 + (newStreak > 5 ? 5 : 0);
      setScore(prev => prev + points);
      setStreak(newStreak);
      
      // Earn small XP/Coins immediately in Time Challenge
      engine.recordCorrect('timeChallenge', 1);
    } else {
      // Shake animation
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
      ]).start();

      setStreak(0);
      // Optional: penalty for wrong answer in time challenge
      // setTimeLeft(prev => Math.max(0, prev - 2)); 
    }

    setTimeout(() => {
      generateNext();
    }, 400);
  };

  const handleGameOver = async () => {
    setGameActive(false);
    clearInterval(timerRef.current);
    
    await checkAchievements();
    
    Alert.alert(
      t('game.gameOver'),
      t('time.congrats', { score }),
      [
        { text: t('time.start'), onPress: startChallenge },
        { text: t('game.exit'), onPress: () => navigation.goBack(), style: 'cancel' }
      ]
    );
  };

  return (
    <LinearGradient colors={Gradients.screenBg} style={styles.container}>
      <GradientHeader title={t('time.title')} onBack={() => navigation.goBack()} />

      {!gameActive ? (
        <View style={styles.startContainer}>
          <Icon name="timer" size={hp(15)} color={Colors.accent} style={styles.startIcon} />
          <Text style={styles.instruction}>{t('time.instruction')}</Text>
          <TouchableOpacity style={styles.startBtn} onPress={startChallenge}>
            <LinearGradient colors={Gradients.button} style={styles.startGradient}>
              <Text style={styles.startBtnText}>{t('time.start')}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.gameContainer}>
          <View style={styles.statsBar}>
            <StatPill icon="schedule" label="Time" value={`${timeLeft}s`} color={timeLeft < 10 ? Colors.accentRed : Colors.accent} />
            <StatPill icon="emoji-events" label="Score" value={score} color={Colors.accentGreen} />
            <StatPill icon="bolt" label="Streak" value={`${streak}x`} color={Colors.accentYellow} />
          </View>

          <Animated.View style={[styles.problemCard, { transform: [{ scale: scaleAnim }, { translateX: shakeAnim }] }]}>
            <LinearGradient colors={Gradients.timeChallenge} style={styles.problemGradient}>
              <Text style={styles.problemText}>{problem?.question}</Text>
            </LinearGradient>
          </Animated.View>

          <View style={styles.optionsGrid}>
            {problem?.options.map((opt, i) => (
              <OptionButton key={i} label={opt} onPress={() => handleAnswer(opt)} gradient={Gradients.timeChallenge} disabled={disabled} />
            ))}
          </View>
        </View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  startContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: wp(10) },
  startIcon: { marginBottom: hp(4) },
  instruction: { color: Colors.textSecondary, fontSize: FontSizes.md, textAlign: 'center', marginBottom: hp(6), lineHeight: FontSizes.md * 1.5 },
  startBtn: { width: '100%', borderRadius: hp(3), overflow: 'hidden', elevation: 5 },
  startGradient: { paddingVertical: hp(2), alignItems: 'center' },
  startBtnText: { color: '#fff', fontSize: FontSizes.lg, fontWeight: Fonts.bold },
  gameContainer: { flex: 1, padding: wp(4) },
  statsBar: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: hp(4) },
  problemCard: { width: '100%', borderRadius: hp(3), overflow: 'hidden', marginBottom: hp(4), elevation: 8 },
  problemGradient: { padding: hp(5), alignItems: 'center', justifyContent: 'center', minHeight: hp(20) },
  problemText: { color: '#fff', fontSize: FontSizes.xxl, fontWeight: Fonts.bold },
  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' }
});

export default TimeChallengeScreen;