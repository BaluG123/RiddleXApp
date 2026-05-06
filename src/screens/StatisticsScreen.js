/**
 * StatisticsScreen — Math Master v3.0
 * Shows achievements, category performance, and overall stats
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useGame } from '../context/GameContext';
import { Colors, Gradients, CategoryConfig } from '../theme/colors';
import { FontSizes, Fonts } from '../theme/typography';
import { GradientHeader, GradientCard, StatPill } from '../components/UIComponents';

const StatisticsScreen = ({ navigation }) => {
  const { state, t, engine, achievements } = useGame();
  
  const allAchievements = achievements.getAll();
  const unlockedCount = achievements.getUnlockedCount();
  const totalCount = achievements.getTotalCount();

  const categories = Object.keys(CategoryConfig).filter(cat => 
    !['riddles', 'timeChallenge', 'mixed', 'statistics'].includes(cat)
  );

  return (
    <LinearGradient colors={Gradients.screenBg} style={styles.container}>
      <GradientHeader title={t('stats.title')} onBack={() => navigation.goBack()} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Overall Stats Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 {t('stats.title')}</Text>
          <View style={styles.statsGrid}>
            <StatPill icon="check_circle" label={t('stats.correctAnswers')} value={state.totalCorrect} color={Colors.accentGreen} />
            <StatPill icon="trending_up" label={t('stats.overallAccuracy')} value={`${engine.getAccuracy()}%`} color={Colors.accent} />
            <StatPill icon="bolt" label={t('game.streak')} value={state.bestStreak} color={Colors.accentYellow} />
            <StatPill icon="videogame_asset" label={t('stats.totalProblems')} value={state.totalAttempts} color={Colors.textSecondary} />
          </View>
        </View>

        {/* Achievements Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🏆 {t('profile.achievements')}</Text>
            <Text style={styles.countText}>{unlockedCount}/{totalCount}</Text>
          </View>
          <View style={styles.achievementsGrid}>
            {allAchievements.map((ach, index) => (
              <View key={index} style={[styles.achievementItem, !ach.unlocked && styles.lockedItem]}>
                <View style={[styles.iconCircle, ach.unlocked ? styles.unlockedCircle : styles.lockedCircle]}>
                  <Text style={styles.achievementIcon}>{ach.icon}</Text>
                </View>
                <Text style={styles.achievementLabel} numberOfLines={1}>
                  {t(`achievements.${ach.id}`)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Category Performance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 {t('stats.categoryPerformance')}</Text>
          {categories.map((cat, index) => {
            const config = CategoryConfig[cat];
            const hasPlayed = state.categoriesPlayed?.includes(cat);
            return (
              <GradientCard key={index} gradient={Gradients.card} style={styles.categoryStatCard}>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryEmoji}>{config.emoji}</Text>
                  <Text style={styles.categoryTitle}>{t(`categories.${cat}`)}</Text>
                </View>
                {hasPlayed ? (
                  <View style={styles.categoryResult}>
                    <Text style={styles.playedText}>Played</Text>
                    <Icon name="check-circle" size={hp(2)} color={Colors.accentGreen} />
                  </View>
                ) : (
                  <Text style={styles.notPlayedText}>Not started</Text>
                )}
              </GradientCard>
            );
          })}
        </View>

        <View style={{ height: hp(5) }} />
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: wp(4) },
  section: { marginBottom: hp(3) },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: hp(1.5) },
  sectionTitle: { color: Colors.textPrimary, fontSize: FontSizes.lg, fontWeight: Fonts.bold },
  countText: { color: Colors.accent, fontSize: FontSizes.md, fontWeight: Fonts.bold },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  achievementsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' },
  achievementItem: { width: wp(21), alignItems: 'center', marginBottom: hp(2), marginRight: wp(2) },
  iconCircle: { width: hp(7), height: hp(7), borderRadius: hp(3.5), justifyContent: 'center', alignItems: 'center', marginBottom: hp(0.5) },
  unlockedCircle: { backgroundColor: Colors.surfaceLight, borderWidth: 2, borderColor: Colors.primary },
  lockedCircle: { backgroundColor: Colors.surface, opacity: 0.3 },
  achievementIcon: { fontSize: hp(3.5) },
  achievementLabel: { color: Colors.textSecondary, fontSize: hp(1.2), textAlign: 'center' },
  lockedItem: { opacity: 0.6 },
  categoryStatCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: hp(1.5), marginBottom: hp(1) },
  categoryInfo: { flexDirection: 'row', alignItems: 'center' },
  categoryEmoji: { fontSize: FontSizes.lg, marginRight: wp(3) },
  categoryTitle: { color: Colors.textPrimary, fontSize: FontSizes.md, fontWeight: Fonts.medium },
  categoryResult: { flexDirection: 'row', alignItems: 'center' },
  playedText: { color: Colors.textMuted, fontSize: FontSizes.xs, marginRight: wp(1) },
  notPlayedText: { color: Colors.textMuted, fontSize: FontSizes.xs }
});

export default StatisticsScreen;