/**
 * Reusable Components — Math Master v3.0
 */
import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MathIcon from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors, Gradients } from '../theme/colors';
import { FontSizes, Fonts } from '../theme/typography';

/* ─── Gradient Card ─── */
export const GradientCard = ({ gradient, children, style, onPress }) => {
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper onPress={onPress} activeOpacity={0.85}>
      <LinearGradient colors={gradient || Gradients.card} start={{x:0,y:0}} end={{x:1,y:1}}
        style={[styles.card, style]}>
        {children}
      </LinearGradient>
    </Wrapper>
  );
};

/* ─── Animated Option Button ─── */
export const OptionButton = ({ label, onPress, gradient, disabled }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.9, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();
    onPress?.();
  };
  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }], width: wp(42), marginBottom: hp(1.2) }}>
      <TouchableOpacity onPress={handlePress} disabled={disabled} activeOpacity={0.8}>
        <LinearGradient colors={gradient || Gradients.button}
          start={{x:0,y:0}} end={{x:1,y:1}}
          style={styles.optionBtn}>
          <Text style={styles.optionText}>{label}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

/* ─── XP Progress Bar ─── */
export const XPBar = ({ progress, level, title }) => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: progress, duration: 800, useNativeDriver: false }).start();
  }, [progress]);
  const width = anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
  return (
    <View style={styles.xpContainer}>
      <View style={styles.xpLabelRow}>
        <Text style={styles.xpLevel}>Lv.{level}</Text>
        <Text style={styles.xpTitle}>{title}</Text>
        <Text style={styles.xpPercent}>{Math.round(progress * 100)}%</Text>
      </View>
      <View style={styles.xpBarBg}>
        <Animated.View style={[styles.xpBarFill, { width }]}>
          <LinearGradient colors={Gradients.xp} start={{x:0,y:0}} end={{x:1,y:0}}
            style={StyleSheet.absoluteFill} />
        </Animated.View>
      </View>
    </View>
  );
};

/* ─── Coin Display ─── */
export const CoinDisplay = ({ count }) => (
  <View style={styles.coinContainer}>
    <Text style={styles.coinEmoji}>🪙</Text>
    <Text style={styles.coinCount}>{count?.toLocaleString?.() || count}</Text>
  </View>
);

/* ─── Streak Banner ─── */
export const StreakBanner = ({ days, message }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.1, duration: 800, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
    ])).start();
  }, []);
  if (!days || days <= 0) return null;
  return (
    <LinearGradient colors={Gradients.streak} start={{x:0,y:0}} end={{x:1,y:0}} style={styles.streakBanner}>
      <Animated.Text style={[styles.streakFire, { transform: [{ scale: pulseAnim }] }]}>🔥</Animated.Text>
      <View>
        <Text style={styles.streakText}>{days} Day Streak!</Text>
        {message && <Text style={styles.streakSub}>{message}</Text>}
      </View>
    </LinearGradient>
  );
};

/* ─── Category Card (for Play screen) ─── */
export const CategoryCard = ({ gradient, icon, title, emoji, highScore, accuracy, onPress, locked }) => (
  <TouchableOpacity onPress={onPress} disabled={locked} activeOpacity={0.85}
    style={[styles.catCardOuter, locked && { opacity: 0.5 }]}>
    <LinearGradient colors={gradient} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.catCard}>
      <Text style={styles.catEmoji}>{emoji}</Text>
      <Text style={styles.catTitle} numberOfLines={1}>{title}</Text>
      {highScore > 0 && <Text style={styles.catScore}>🏆 {highScore}</Text>}
      {locked && <View style={styles.lockOverlay}><Icon name="lock" size={hp(3)} color="#fff" /></View>}
    </LinearGradient>
  </TouchableOpacity>
);

/* ─── Header with gradient ─── */
export const GradientHeader = ({ title, onBack, rightComponent }) => (
  <LinearGradient colors={Gradients.headerBg} start={{x:0,y:0}} end={{x:1,y:0}} style={styles.header}>
    {onBack && (
      <TouchableOpacity onPress={onBack} style={styles.backBtn}>
        <Icon name="arrow-back-ios" size={hp(2.5)} color="#fff" />
      </TouchableOpacity>
    )}
    <Text style={styles.headerTitle}>{title}</Text>
    {rightComponent || <View style={{ width: hp(4) }} />}
  </LinearGradient>
);

/* ─── Stat Pill ─── */
export const StatPill = ({ icon, label, value, color }) => (
  <View style={styles.statPill}>
    <Icon name={icon} size={hp(2.2)} color={color || Colors.accent} />
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={[styles.statValue, { color: color || Colors.accent }]}>{value}</Text>
  </View>
);

/* ─── Styles ─── */
const styles = StyleSheet.create({
  card: { borderRadius: hp(2), padding: hp(2), borderWidth: 1, borderColor: Colors.glassBorder },
  optionBtn: { paddingVertical: hp(2), borderRadius: hp(1.5), alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOffset: {width:0,height:3}, shadowOpacity: 0.3, shadowRadius: 4 },
  optionText: { color: '#fff', fontSize: FontSizes.xl, fontWeight: Fonts.bold },
  xpContainer: { marginVertical: hp(0.5) },
  xpLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: hp(0.5) },
  xpLevel: { color: Colors.xpGold, fontSize: FontSizes.sm, fontWeight: Fonts.bold },
  xpTitle: { color: Colors.textSecondary, fontSize: FontSizes.xs },
  xpPercent: { color: Colors.textSecondary, fontSize: FontSizes.xs },
  xpBarBg: { height: hp(0.8), backgroundColor: Colors.surface, borderRadius: hp(0.4), overflow: 'hidden' },
  xpBarFill: { height: '100%', borderRadius: hp(0.4), overflow: 'hidden' },
  coinContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, paddingHorizontal: wp(3), paddingVertical: hp(0.5), borderRadius: hp(2), borderWidth: 1, borderColor: Colors.glassBorder },
  coinEmoji: { fontSize: FontSizes.lg, marginRight: wp(1) },
  coinCount: { color: Colors.coinGold, fontSize: FontSizes.md, fontWeight: Fonts.bold },
  streakBanner: { flexDirection: 'row', alignItems: 'center', borderRadius: hp(1.5), paddingHorizontal: wp(4), paddingVertical: hp(1.2), marginBottom: hp(1.5) },
  streakFire: { fontSize: FontSizes.xxl, marginRight: wp(3) },
  streakText: { color: '#fff', fontSize: FontSizes.md, fontWeight: Fonts.bold },
  streakSub: { color: 'rgba(255,255,255,0.8)', fontSize: FontSizes.xs },
  catCardOuter: { width: wp(43), marginBottom: hp(1.5) },
  catCard: { borderRadius: hp(2), padding: hp(2), height: hp(14), justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOffset: {width:0,height:3}, shadowOpacity: 0.3, shadowRadius: 4 },
  catEmoji: { fontSize: FontSizes.hero },
  catTitle: { color: '#fff', fontSize: FontSizes.sm, fontWeight: Fonts.bold, marginTop: hp(0.8), textAlign: 'center' },
  catScore: { color: 'rgba(255,255,255,0.8)', fontSize: FontSizes.xs, marginTop: hp(0.3) },
  lockOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: hp(2), justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: wp(4), paddingVertical: hp(1.8), paddingTop: hp(2.5) },
  backBtn: { padding: hp(0.5), marginRight: wp(2) },
  headerTitle: { flex: 1, color: '#fff', fontSize: FontSizes.xl, fontWeight: Fonts.bold },
  statPill: { alignItems: 'center', backgroundColor: Colors.surface, paddingHorizontal: wp(3), paddingVertical: hp(1), borderRadius: hp(1.2), borderWidth: 1, borderColor: Colors.glassBorder, minWidth: wp(22) },
  statLabel: { color: Colors.textMuted, fontSize: FontSizes.xs, marginTop: hp(0.3) },
  statValue: { fontSize: FontSizes.lg, fontWeight: Fonts.bold, marginTop: hp(0.2) },
});
