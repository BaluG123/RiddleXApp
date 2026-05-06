/**
 * PlayTab — Math Master v3.0
 * Category browser organized by difficulty groups
 */
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useGame } from '../context/GameContext';
import { Colors, Gradients, CategoryConfig, CategoryGroups } from '../theme/colors';
import { FontSizes, Fonts } from '../theme/typography';
import { CategoryCard } from '../components/UIComponents';

const PlayTab = ({ navigation }) => {
  const { t, state } = useGame();

  const groupTitleKeys = { Basics: 'basics', Intermediate: 'intermediate', Advanced: 'advanced', 'Brain Teasers': 'brainTeasers', Special: 'special' };

  const handleCategoryPress = (cat) => {
    if (cat === 'riddles') {
      navigation.navigate('LevelScreen');
    } else if (cat === 'timeChallenge') {
      navigation.navigate('TimeChallengeScreen');
    } else if (cat === 'statistics') {
      navigation.navigate('StatisticsScreen');
    } else {
      navigation.navigate('MathChallengeScreen', { category: cat });
    }
  };

  return (
    <LinearGradient colors={Gradients.screenBg} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎮 {t('nav.play')}</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {CategoryGroups.map((group, gi) => (
          <View key={gi} style={styles.groupSection}>
            <Text style={styles.groupTitle}>
              {group.emoji} {t(`groups.${groupTitleKeys[group.title]}`)}
            </Text>
            <View style={styles.catGrid}>
              {group.categories.map(cat => {
                const config = CategoryConfig[cat];
                if (!config) return null;
                return (
                  <CategoryCard
                    key={cat}
                    gradient={config.gradient}
                    icon={config.icon}
                    title={t(`categories.${cat}`)}
                    emoji={config.emoji}
                    onPress={() => handleCategoryPress(cat)}
                  />
                );
              })}
            </View>
          </View>
        ))}
        <View style={{ height: hp(12) }} />
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: wp(4), paddingTop: hp(2.5), paddingBottom: hp(1) },
  headerTitle: { color: Colors.textPrimary, fontSize: FontSizes.xl, fontWeight: Fonts.bold },
  scroll: { paddingHorizontal: wp(4) },
  groupSection: { marginBottom: hp(1) },
  groupTitle: { color: Colors.textPrimary, fontSize: FontSizes.lg, fontWeight: Fonts.bold, marginBottom: hp(1.2), marginTop: hp(0.5) },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
});

export default PlayTab;
