/**
 * HomeTab — Math Master v3.0
 * Modern home screen with hero section, streak, daily challenge, quick play
 */
import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated, BackHandler, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useGame } from '../context/GameContext';
import { Colors, Gradients, CategoryConfig } from '../theme/colors';
import { FontSizes, Fonts } from '../theme/typography';
import { XPBar, CoinDisplay, StreakBanner, GradientCard } from '../components/UIComponents';

const QUICK_PLAY_CATS = ['addition', 'subtraction', 'multiplication', 'division', 'mixed'];

const HomeTab = ({ navigation }) => {
  const { state, t, engine } = useGame();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();

    engine.recordDailyPlay();

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (navigation.isFocused()) {
        Alert.alert(t('common.cancel'), 'Exit Math Master?', [
          { text: t('common.no'), style: 'cancel' },
          { text: t('common.yes'), onPress: () => BackHandler.exitApp(), style: 'destructive' },
        ]);
        return true;
      }
      return false;
    });
    return () => backHandler.remove();
  }, []);

  const getTimeUntilMidnight = () => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const diff = midnight - now;
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return `${h}h ${m}m`;
  };

  return (
    <LinearGradient colors={Gradients.screenBg} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.heroTop}>
              <View>
                <Text style={styles.welcomeText}>{t('home.welcome')}</Text>
                <Text style={styles.levelText}>{engine.getLevelTitle()}</Text>
              </View>
              <CoinDisplay count={state.coins} />
            </View>
            <XPBar progress={engine.getXPProgress()} level={state.level} title={engine.getLevelTitle()} />
          </View>

          {/* Streak Banner */}
          {state.dailyStreak > 0 && (
            <StreakBanner days={state.dailyStreak} message={t('home.streakKeep')} />
          )}

          {/* Daily Challenge Card */}
          <TouchableOpacity activeOpacity={0.85}
            onPress={() => navigation.navigate('DailyChallengeScreen')}>
            <LinearGradient colors={['#f857a6', '#ff5858']} start={{x:0,y:0}} end={{x:1,y:1}}
              style={styles.dailyCard}>
              <View style={styles.dailyLeft}>
                <Text style={styles.dailyEmoji}>🎯</Text>
                <View>
                  <Text style={styles.dailyTitle}>{t('home.dailyChallenge')}</Text>
                  <Text style={styles.dailyDesc}>{t('home.dailyDesc')}</Text>
                </View>
              </View>
              <View style={styles.dailyRight}>
                <Text style={styles.dailyTimer}>{t('home.endsIn', { time: getTimeUntilMidnight() })}</Text>
                {engine.isDailyChallengeCompleted() && <Text style={styles.dailyDone}>✅</Text>}
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Quick Play Section */}
          <Text style={styles.sectionTitle}>{t('home.quickPlay')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickPlayScroll}>
            {QUICK_PLAY_CATS.map(cat => {
              const config = CategoryConfig[cat];
              return (
                <TouchableOpacity key={cat} activeOpacity={0.85}
                  onPress={() => navigation.navigate('MathChallengeScreen', { category: cat })}>
                  <LinearGradient colors={config.gradient} start={{x:0,y:0}} end={{x:1,y:1}}
                    style={styles.quickCard}>
                    <Text style={styles.quickEmoji}>{config.emoji}</Text>
                    <Text style={styles.quickLabel}>{t(`categories.${cat}`)}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Featured Sections */}
          <Text style={styles.sectionTitle}>🏆 {t('home.allCategories')}</Text>
          <View style={styles.featuredRow}>
            <TouchableOpacity style={styles.featuredCard} activeOpacity={0.85}
              onPress={() => navigation.navigate('LevelScreen')}>
              <LinearGradient colors={Gradients.riddles} style={styles.featuredGrad} start={{x:0,y:0}} end={{x:1,y:1}}>
                <Text style={styles.featuredEmoji}>🧠</Text>
                <Text style={styles.featuredTitle}>{t('categories.riddles')}</Text>
                <Text style={styles.featuredSub}>100 Levels</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.featuredCard} activeOpacity={0.85}
              onPress={() => navigation.navigate('TimeChallengeScreen')}>
              <LinearGradient colors={Gradients.timeChallenge} style={styles.featuredGrad} start={{x:0,y:0}} end={{x:1,y:1}}>
                <Text style={styles.featuredEmoji}>⏱️</Text>
                <Text style={styles.featuredTitle}>{t('categories.timeChallenge')}</Text>
                <Text style={styles.featuredSub}>60 Seconds</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Stats Summary */}
          <GradientCard gradient={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.03)']} style={styles.statsCard}>
            <Text style={styles.statsTitle}>📊 Quick Stats</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNum}>{state.totalCorrect}</Text>
                <Text style={styles.statLbl}>Correct</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNum}>{engine.getAccuracy()}%</Text>
                <Text style={styles.statLbl}>Accuracy</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNum}>{state.bestStreak}</Text>
                <Text style={styles.statLbl}>Best Streak</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNum}>{state.gamesPlayed}</Text>
                <Text style={styles.statLbl}>Games</Text>
              </View>
            </View>
          </GradientCard>
        </Animated.View>
        <View style={{ height: hp(10) }} />
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: wp(4), paddingTop: hp(2) },
  heroSection: { marginBottom: hp(2) },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: hp(1.5) },
  welcomeText: { color: Colors.textSecondary, fontSize: FontSizes.md },
  levelText: { color: Colors.textPrimary, fontSize: FontSizes.xl, fontWeight: Fonts.bold },
  dailyCard: { borderRadius: hp(2), padding: hp(2), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: hp(2), elevation: 5, shadowColor: '#f857a6', shadowOffset: {width:0,height:4}, shadowOpacity: 0.3, shadowRadius: 8 },
  dailyLeft: { flexDirection: 'row', alignItems: 'center' },
  dailyEmoji: { fontSize: FontSizes.hero, marginRight: wp(3) },
  dailyTitle: { color: '#fff', fontSize: FontSizes.lg, fontWeight: Fonts.bold },
  dailyDesc: { color: 'rgba(255,255,255,0.8)', fontSize: FontSizes.xs },
  dailyRight: { alignItems: 'flex-end' },
  dailyTimer: { color: 'rgba(255,255,255,0.9)', fontSize: FontSizes.xs },
  dailyDone: { fontSize: FontSizes.xl, marginTop: hp(0.5) },
  sectionTitle: { color: Colors.textPrimary, fontSize: FontSizes.lg, fontWeight: Fonts.bold, marginBottom: hp(1.2), marginTop: hp(0.5) },
  quickPlayScroll: { marginBottom: hp(2) },
  quickCard: { width: wp(28), height: hp(14), borderRadius: hp(2), marginRight: wp(3), justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOffset: {width:0,height:3}, shadowOpacity: 0.3, shadowRadius: 4 },
  quickEmoji: { fontSize: FontSizes.hero },
  quickLabel: { color: '#fff', fontSize: FontSizes.xs, fontWeight: Fonts.semiBold, marginTop: hp(0.5) },
  featuredRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: hp(2) },
  featuredCard: { width: wp(44) },
  featuredGrad: { borderRadius: hp(2), padding: hp(2.5), alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOffset: {width:0,height:3}, shadowOpacity: 0.3, shadowRadius: 4 },
  featuredEmoji: { fontSize: FontSizes.hero },
  featuredTitle: { color: '#fff', fontSize: FontSizes.md, fontWeight: Fonts.bold, marginTop: hp(0.8) },
  featuredSub: { color: 'rgba(255,255,255,0.7)', fontSize: FontSizes.xs, marginTop: hp(0.3) },
  statsCard: { padding: hp(2) },
  statsTitle: { color: Colors.textPrimary, fontSize: FontSizes.md, fontWeight: Fonts.semiBold, marginBottom: hp(1.5) },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statNum: { color: Colors.accent, fontSize: FontSizes.xl, fontWeight: Fonts.bold },
  statLbl: { color: Colors.textMuted, fontSize: FontSizes.xs, marginTop: hp(0.3) },
});

export default HomeTab;
