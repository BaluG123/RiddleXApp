/**
 * ProfileTab — Math Master v3.0
 */
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Switch, Linking } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useGame } from '../context/GameContext';
import { Colors, Gradients } from '../theme/colors';
import { FontSizes, Fonts } from '../theme/typography';
import { XPBar, CoinDisplay, GradientCard } from '../components/UIComponents';
import { LANGUAGES } from '../i18n';

const AVATARS = ['🧑‍🎓','👨‍🔬','👩‍💻','🧙‍♂️','🦸‍♀️','🤖','🧠','🎯','⭐','🏆','🦊','🐼','🦁','🐯','🦋','🌟','💎','🔥','🎮','👾'];

const ProfileTab = ({ navigation }) => {
  const { state, t, engine, language, setLanguage, achievements } = useGame();
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const handleReset = () => {
    Alert.alert(t('profile.resetProgress'), t('profile.resetConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('common.reset'), style: 'destructive', onPress: async () => {
        await engine.resetAll();
        await achievements.reset();
        Alert.alert(t('common.success'), 'Progress reset!');
      }},
    ]);
  };

  const handleShare = () => {
    Linking.openURL('whatsapp://send?text=Check out Math Master! Download: https://play.google.com/store/apps/details?id=com.riddlex');
  };

  const handleRate = () => {
    Linking.openURL('https://play.google.com/store/apps/details?id=com.riddlex');
  };

  const toggleSound = async () => {
    engine.state.soundEnabled = !engine.state.soundEnabled;
    await engine._save();
  };

  const allAchievements = achievements.getAll();

  return (
    <LinearGradient colors={Gradients.screenBg} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Avatar & Level */}
        <View style={styles.profileHeader}>
          <TouchableOpacity onPress={() => setShowAvatarPicker(!showAvatarPicker)}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{AVATARS[state.avatar || 0]}</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.levelTitle}>{engine.getLevelTitle()}</Text>
          <Text style={styles.levelSub}>{t('profile.level', { level: state.level })}</Text>
          <View style={styles.xpRow}>
            <XPBar progress={engine.getXPProgress()} level={state.level} title={`${engine.getXPRemaining()} XP to next`} />
          </View>
          <CoinDisplay count={state.coins} />
        </View>

        {showAvatarPicker && (
          <GradientCard gradient={Gradients.card} style={styles.avatarPicker}>
            <View style={styles.avatarGrid}>
              {AVATARS.map((av, i) => (
                <TouchableOpacity key={i} onPress={async () => { engine.state.avatar = i; await engine._save(); setShowAvatarPicker(false); }}
                  style={[styles.avatarOption, state.avatar === i && styles.avatarSelected]}>
                  <Text style={styles.avatarEmoji}>{av}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </GradientCard>
        )}

        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <GradientCard gradient={['rgba(0,210,255,0.15)','rgba(0,210,255,0.05)']} style={styles.miniStat}>
            <Text style={[styles.miniNum, {color: Colors.accent}]}>{state.totalCorrect}</Text>
            <Text style={styles.miniLabel}>{t('stats.correctAnswers')}</Text>
          </GradientCard>
          <GradientCard gradient={['rgba(0,230,118,0.15)','rgba(0,230,118,0.05)']} style={styles.miniStat}>
            <Text style={[styles.miniNum, {color: Colors.accentGreen}]}>{engine.getAccuracy()}%</Text>
            <Text style={styles.miniLabel}>{t('stats.overallAccuracy')}</Text>
          </GradientCard>
          <GradientCard gradient={['rgba(255,215,0,0.15)','rgba(255,215,0,0.05)']} style={styles.miniStat}>
            <Text style={[styles.miniNum, {color: Colors.xpGold}]}>🔥{state.dailyStreak}</Text>
            <Text style={styles.miniLabel}>{t('game.streak')}</Text>
          </GradientCard>
        </View>

        {/* Achievements */}
        <Text style={styles.sectionTitle}>🏆 {t('profile.achievements')} ({achievements.getUnlockedCount()}/{achievements.getTotalCount()})</Text>
        <GradientCard gradient={Gradients.card} style={styles.achieveCard}>
          <View style={styles.achieveGrid}>
            {allAchievements.slice(0, 12).map((a, i) => (
              <View key={i} style={[styles.badge, !a.unlocked && styles.badgeLocked]}>
                <Text style={styles.badgeIcon}>{a.icon}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('StatisticsScreen')}>
            <Text style={styles.seeAll}>See all achievements →</Text>
          </TouchableOpacity>
        </GradientCard>

        {/* Settings */}
        <Text style={styles.sectionTitle}>⚙️ {t('profile.settings')}</Text>

        {/* Language */}
        <TouchableOpacity onPress={() => setShowLangPicker(!showLangPicker)}>
          <GradientCard gradient={Gradients.card} style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Icon name="language" size={hp(2.5)} color={Colors.accent} />
              <Text style={styles.settingText}>{t('profile.language')}</Text>
            </View>
            <Text style={styles.settingValue}>{LANGUAGES.find(l => l.code === language)?.nativeName}</Text>
          </GradientCard>
        </TouchableOpacity>
        {showLangPicker && (
          <GradientCard gradient={Gradients.card} style={styles.langPicker}>
            {LANGUAGES.map(lang => (
              <TouchableOpacity key={lang.code} style={[styles.langOption, language === lang.code && styles.langSelected]}
                onPress={() => { setLanguage(lang.code); setShowLangPicker(false); }}>
                <Text style={styles.langFlag}>{lang.flag}</Text>
                <Text style={styles.langName}>{lang.nativeName}</Text>
                {language === lang.code && <Icon name="check-circle" size={hp(2)} color={Colors.accentGreen} />}
              </TouchableOpacity>
            ))}
          </GradientCard>
        )}

        {/* Sound */}
        <GradientCard gradient={Gradients.card} style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <Icon name="volume-up" size={hp(2.5)} color={Colors.accent} />
            <Text style={styles.settingText}>{t('profile.sound')}</Text>
          </View>
          <Switch value={state.soundEnabled} onValueChange={toggleSound} trackColor={{false: '#333', true: Colors.primary}} />
        </GradientCard>

        {/* Actions */}
        <TouchableOpacity onPress={handleShare}>
          <GradientCard gradient={Gradients.card} style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Icon name="share" size={hp(2.5)} color={Colors.accentGreen} />
              <Text style={styles.settingText}>{t('profile.shareApp')}</Text>
            </View>
            <Icon name="chevron-right" size={hp(2.5)} color={Colors.textMuted} />
          </GradientCard>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleRate}>
          <GradientCard gradient={Gradients.card} style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Icon name="star" size={hp(2.5)} color={Colors.accentYellow} />
              <Text style={styles.settingText}>{t('profile.rateApp')}</Text>
            </View>
            <Icon name="chevron-right" size={hp(2.5)} color={Colors.textMuted} />
          </GradientCard>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleReset}>
          <GradientCard gradient={['rgba(255,82,82,0.1)','rgba(255,82,82,0.05)']} style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Icon name="refresh" size={hp(2.5)} color={Colors.accentRed} />
              <Text style={[styles.settingText, { color: Colors.accentRed }]}>{t('profile.resetProgress')}</Text>
            </View>
          </GradientCard>
        </TouchableOpacity>

        <Text style={styles.version}>{t('profile.version')} 3.0.0</Text>
        <View style={{ height: hp(12) }} />
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: wp(4), paddingTop: hp(2) },
  profileHeader: { alignItems: 'center', marginBottom: hp(2) },
  avatarCircle: { width: hp(10), height: hp(10), borderRadius: hp(5), backgroundColor: Colors.surface, borderWidth: 2, borderColor: Colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: hp(1) },
  avatarText: { fontSize: FontSizes.hero },
  levelTitle: { color: Colors.textPrimary, fontSize: FontSizes.xl, fontWeight: Fonts.bold },
  levelSub: { color: Colors.textSecondary, fontSize: FontSizes.sm, marginBottom: hp(1) },
  xpRow: { width: '100%', marginBottom: hp(1.5) },
  avatarPicker: { marginBottom: hp(2), padding: hp(1.5) },
  avatarGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  avatarOption: { width: hp(5.5), height: hp(5.5), borderRadius: hp(2.75), justifyContent: 'center', alignItems: 'center', margin: hp(0.5) },
  avatarSelected: { backgroundColor: Colors.primary + '40', borderWidth: 2, borderColor: Colors.primary },
  avatarEmoji: { fontSize: FontSizes.xl },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: hp(2) },
  miniStat: { flex: 1, marginHorizontal: wp(1), alignItems: 'center', padding: hp(1.5) },
  miniNum: { fontSize: FontSizes.lg, fontWeight: Fonts.bold },
  miniLabel: { color: Colors.textMuted, fontSize: FontSizes.xs, marginTop: hp(0.3), textAlign: 'center' },
  sectionTitle: { color: Colors.textPrimary, fontSize: FontSizes.lg, fontWeight: Fonts.bold, marginBottom: hp(1), marginTop: hp(1) },
  achieveCard: { padding: hp(2) },
  achieveGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  badge: { width: hp(5.5), height: hp(5.5), borderRadius: hp(2.75), backgroundColor: Colors.surfaceLight, justifyContent: 'center', alignItems: 'center', margin: hp(0.5) },
  badgeLocked: { opacity: 0.3 },
  badgeIcon: { fontSize: FontSizes.xl },
  seeAll: { color: Colors.accent, fontSize: FontSizes.sm, textAlign: 'center', marginTop: hp(1) },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: hp(1.8), marginBottom: hp(1) },
  settingLeft: { flexDirection: 'row', alignItems: 'center' },
  settingText: { color: Colors.textPrimary, fontSize: FontSizes.md, marginLeft: wp(3) },
  settingValue: { color: Colors.textSecondary, fontSize: FontSizes.sm },
  langPicker: { padding: hp(1), marginBottom: hp(1) },
  langOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: hp(1.2), paddingHorizontal: wp(3), borderRadius: hp(1) },
  langSelected: { backgroundColor: Colors.primary + '20' },
  langFlag: { fontSize: FontSizes.lg, marginRight: wp(3) },
  langName: { color: Colors.textPrimary, fontSize: FontSizes.md, flex: 1 },
  version: { color: Colors.textMuted, fontSize: FontSizes.xs, textAlign: 'center', marginTop: hp(2) },
});

export default ProfileTab;
