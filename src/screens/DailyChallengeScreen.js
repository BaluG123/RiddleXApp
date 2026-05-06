/**
 * DailyChallengeScreen — Math Master v3.0
 * Daily challenge with reward wheel and streak calendar
 */
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useGame } from '../context/GameContext';
import { Colors, Gradients } from '../theme/colors';
import { FontSizes, Fonts } from '../theme/typography';
import { GradientCard, GradientHeader, OptionButton } from '../components/UIComponents';
import { generateDailyChallenge } from '../engine/QuestionGenerator';
import adManager from '../util/adManager';

const WHEEL_REWARDS = [10, 20, 30, 50, 75, 100, 15, 25];

const DailyChallengeScreen = ({ navigation }) => {
  const { state, t, engine } = useGame();
  const [challenges, setChallenges] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [completed, setCompleted] = useState(engine.isDailyChallengeCompleted());
  const [showWheel, setShowWheel] = useState(false);
  const [wheelResult, setWheelResult] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const spinAnim = useRef(new Animated.Value(0)).current;
  const [showFeedback, setShowFeedback] = useState(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!completed) {
      setChallenges(generateDailyChallenge());
    }
  }, []);

  const handleAnswer = async (selected) => {
    const problem = challenges[currentIdx];
    const isCorrect = selected === problem.answer;

    if (isCorrect) {
      setScore(prev => prev + 10);
      setShowFeedback({ type: 'correct', text: '+10 🎉' });
      await engine.recordCorrect('mixed', 1);
    } else {
      setShowFeedback({ type: 'wrong', text: `Answer: ${problem.answer}` });
      await engine.recordWrong();
    }

    setTimeout(() => {
      setShowFeedback(null);
      if (currentIdx < challenges.length - 1) {
        setCurrentIdx(prev => prev + 1);
      } else {
        handleChallengeComplete();
      }
    }, 800);
  };

  const handleChallengeComplete = async () => {
    const reward = await engine.completeDailyChallenge();
    setCompleted(true);
    if (reward) {
      Alert.alert('🎉 Challenge Complete!', `You earned +${reward.xp} XP and +${reward.coins} Coins!\nScore: ${score}/100`);
    }
  };

  const handleSpin = async () => {
    if (engine.isWheelSpunToday()) {
      Alert.alert(t('daily.alreadySpun'));
      return;
    }
    setSpinning(true);
    spinAnim.setValue(0);
    Animated.timing(spinAnim, { toValue: 1, duration: 2000, useNativeDriver: true }).start(async () => {
      const reward = await engine.spinDailyWheel();
      setWheelResult(reward);
      setSpinning(false);
      if (reward) {
        Alert.alert('🎰 You won!', `+${reward} Coins!`);
      }
    });
  };

  const problem = challenges[currentIdx];
  const spinRotation = spinAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '1440deg'] });

  // Generate streak calendar (last 7 days)
  const getStreakDays = () => {
    const days = [];
    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push({
        label: dayNames[d.getDay()],
        date: d.getDate(),
        active: i < state.dailyStreak,
        today: i === 0,
      });
    }
    return days;
  };

  return (
    <LinearGradient colors={Gradients.screenBg} style={styles.container}>
      <GradientHeader title={t('daily.title')} onBack={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Streak Calendar */}
        <GradientCard gradient={Gradients.card} style={styles.calCard}>
          <Text style={styles.calTitle}>🔥 {t('daily.streakCalendar')}</Text>
          <View style={styles.calRow}>
            {getStreakDays().map((d, i) => (
              <View key={i} style={[styles.calDay, d.active && styles.calDayActive, d.today && styles.calDayToday]}>
                <Text style={styles.calLabel}>{d.label}</Text>
                <Text style={[styles.calDate, d.active && { color: '#fff' }]}>{d.date}</Text>
                {d.active && <Text style={styles.calCheck}>✓</Text>}
              </View>
            ))}
          </View>
          <Text style={styles.calStreak}>🔥 {state.dailyStreak} day streak</Text>
        </GradientCard>

        {/* Daily Challenge */}
        {!completed ? (
          <View>
            <Text style={styles.sectionTitle}>🎯 {t('daily.todayChallenge')}</Text>
            <Text style={styles.progressText}>{currentIdx + 1}/10 • {t('daily.questionsLeft', { count: 10 - currentIdx })}</Text>
            
            {problem && (
              <>
                <GradientCard gradient={Gradients.button} style={styles.questionCard}>
                  <Text style={styles.questionText}>{problem.question}</Text>
                </GradientCard>

                {showFeedback && (
                  <View style={[styles.feedbackBar, { backgroundColor: showFeedback.type === 'correct' ? Colors.correct + '30' : Colors.wrong + '30' }]}>
                    <Text style={[styles.feedbackText, { color: showFeedback.type === 'correct' ? Colors.correct : Colors.wrong }]}>{showFeedback.text}</Text>
                  </View>
                )}

                <View style={styles.optionsGrid}>
                  {problem.options.map((opt, i) => (
                    <OptionButton key={`${opt}-${i}`} label={opt} onPress={() => handleAnswer(opt)} gradient={Gradients.button} />
                  ))}
                </View>
              </>
            )}
          </View>
        ) : (
          <GradientCard gradient={['rgba(0,230,118,0.15)', 'rgba(0,230,118,0.05)']} style={styles.completedCard}>
            <Text style={styles.completedEmoji}>✅</Text>
            <Text style={styles.completedText}>{t('daily.completed')}</Text>
            <Text style={styles.completedSub}>Come back tomorrow for a new challenge!</Text>
          </GradientCard>
        )}

        {/* Reward Wheel */}
        <Text style={styles.sectionTitle}>🎰 {t('daily.reward')}</Text>
        <GradientCard gradient={Gradients.card} style={styles.wheelCard}>
          <Animated.View style={[styles.wheel, { transform: [{ rotate: spinRotation }] }]}>
            <View style={styles.wheelInner}>
              {WHEEL_REWARDS.map((r, i) => (
                <View key={i} style={[styles.wheelSlice, { transform: [{ rotate: `${i * 45}deg` }] }]}>
                  <Text style={styles.wheelValue}>{r}🪙</Text>
                </View>
              ))}
            </View>
          </Animated.View>
          
          {!engine.isWheelSpunToday() ? (
            <TouchableOpacity onPress={handleSpin} disabled={spinning}>
              <LinearGradient colors={Gradients.gold} style={styles.spinBtn}>
                <Text style={styles.spinText}>{t('daily.spinWheel')}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <View>
              <Text style={styles.spunText}>{wheelResult ? `You won ${wheelResult} coins!` : t('daily.alreadySpun')}</Text>
              <TouchableOpacity onPress={async () => {
                const shown = await adManager.showRewardedAdForHint();
                if (shown) {
                  const reward = WHEEL_REWARDS[Math.floor(Math.random() * WHEEL_REWARDS.length)];
                  await engine.addCoins(reward);
                  Alert.alert('🎰 Bonus Spin!', `+${reward} Coins!`);
                }
              }}>
                <Text style={styles.adSpinText}>📺 {t('daily.spinAgain')}</Text>
              </TouchableOpacity>
            </View>
          )}
        </GradientCard>

        {/* Streak Freeze */}
        <GradientCard gradient={Gradients.card} style={styles.freezeCard}>
          <View style={styles.freezeRow}>
            <View>
              <Text style={styles.freezeTitle}>🧊 {t('daily.streakFreeze')}</Text>
              <Text style={styles.freezeDesc}>{t('daily.freezeDesc')}</Text>
              <Text style={styles.freezeOwned}>Owned: {state.streakFreezes || 0}</Text>
            </View>
            <TouchableOpacity onPress={async () => {
              const bought = await engine.buyStreakFreeze();
              if (bought) Alert.alert('✅', 'Streak Freeze purchased!');
              else Alert.alert('❌', 'Not enough coins (100 needed)');
            }}>
              <LinearGradient colors={Gradients.button} style={styles.buyBtn}>
                <Text style={styles.buyText}>100 🪙</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </GradientCard>
        <View style={{ height: hp(4) }} />
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: wp(4) },
  calCard: { padding: hp(2), marginBottom: hp(2) },
  calTitle: { color: Colors.textPrimary, fontSize: FontSizes.md, fontWeight: Fonts.bold, marginBottom: hp(1.5), textAlign: 'center' },
  calRow: { flexDirection: 'row', justifyContent: 'space-around' },
  calDay: { alignItems: 'center', width: wp(10), paddingVertical: hp(0.8), borderRadius: hp(1) },
  calDayActive: { backgroundColor: Colors.accentGreen + '30' },
  calDayToday: { borderWidth: 2, borderColor: Colors.accent },
  calLabel: { color: Colors.textMuted, fontSize: FontSizes.xs },
  calDate: { color: Colors.textSecondary, fontSize: FontSizes.md, fontWeight: Fonts.bold, marginTop: hp(0.3) },
  calCheck: { color: Colors.accentGreen, fontSize: FontSizes.xs, marginTop: hp(0.2) },
  calStreak: { color: Colors.streakFire, fontSize: FontSizes.sm, fontWeight: Fonts.bold, textAlign: 'center', marginTop: hp(1) },
  sectionTitle: { color: Colors.textPrimary, fontSize: FontSizes.lg, fontWeight: Fonts.bold, marginBottom: hp(1), marginTop: hp(0.5) },
  progressText: { color: Colors.textSecondary, fontSize: FontSizes.sm, marginBottom: hp(1) },
  questionCard: { padding: hp(3), alignItems: 'center', marginBottom: hp(1.5) },
  questionText: { color: '#fff', fontSize: FontSizes.xl, fontWeight: Fonts.bold, textAlign: 'center' },
  feedbackBar: { padding: hp(1), borderRadius: hp(1), alignItems: 'center', marginBottom: hp(1) },
  feedbackText: { fontSize: FontSizes.md, fontWeight: Fonts.bold },
  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' },
  completedCard: { padding: hp(3), alignItems: 'center', marginBottom: hp(2) },
  completedEmoji: { fontSize: FontSizes.hero },
  completedText: { color: Colors.accentGreen, fontSize: FontSizes.xl, fontWeight: Fonts.bold, marginTop: hp(1) },
  completedSub: { color: Colors.textSecondary, fontSize: FontSizes.sm, marginTop: hp(0.5) },
  wheelCard: { padding: hp(2), alignItems: 'center' },
  wheel: { width: hp(20), height: hp(20), borderRadius: hp(10), backgroundColor: Colors.surfaceLight, justifyContent: 'center', alignItems: 'center', marginBottom: hp(2), borderWidth: 3, borderColor: Colors.coinGold },
  wheelInner: { width: '100%', height: '100%', position: 'relative' },
  wheelSlice: { position: 'absolute', width: '100%', alignItems: 'center', top: hp(1) },
  wheelValue: { color: Colors.coinGold, fontSize: FontSizes.sm, fontWeight: Fonts.bold },
  spinBtn: { paddingHorizontal: wp(8), paddingVertical: hp(1.5), borderRadius: hp(3) },
  spinText: { color: Colors.textDark, fontSize: FontSizes.md, fontWeight: Fonts.bold },
  spunText: { color: Colors.accentGreen, fontSize: FontSizes.md, fontWeight: Fonts.bold, textAlign: 'center' },
  adSpinText: { color: Colors.accent, fontSize: FontSizes.sm, textAlign: 'center', marginTop: hp(1) },
  freezeCard: { padding: hp(2), marginTop: hp(2) },
  freezeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  freezeTitle: { color: Colors.textPrimary, fontSize: FontSizes.md, fontWeight: Fonts.bold },
  freezeDesc: { color: Colors.textSecondary, fontSize: FontSizes.xs, marginTop: hp(0.3) },
  freezeOwned: { color: Colors.accent, fontSize: FontSizes.xs, marginTop: hp(0.3) },
  buyBtn: { paddingHorizontal: wp(4), paddingVertical: hp(1), borderRadius: hp(1.5) },
  buyText: { color: '#fff', fontSize: FontSizes.sm, fontWeight: Fonts.bold },
});

export default DailyChallengeScreen;
