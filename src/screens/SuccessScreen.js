/**
 * SuccessScreen — Math Master v3.0
 * Celebratory screen after a correct answer or level completion
 */
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Share, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useGame } from '../context/GameContext';
import { Colors, Gradients } from '../theme/colors';
import { FontSizes, Fonts } from '../theme/typography';
import adManager from '../util/adManager';

const SuccessScreen = ({ route, navigation }) => {
  const { nextLevel, xpEarned = 10, coinsEarned = 5 } = route.params || {};
  const { state, t, engine } = useGame();
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rewardAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 6, tension: 40, useNativeDriver: true }),
    ]).start();

    // Stagger rewards appearance
    setTimeout(() => {
      Animated.spring(rewardAnim, { toValue: 1, friction: 5, useNativeDriver: true }).start();
    }, 400);
  }, []);

  const handleNext = () => {
    if (nextLevel) {
      navigation.replace('Questionscreen', { levelNumber: nextLevel });
    } else {
      navigation.goBack();
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `I just cleared a level in Math Master! I've earned ${state.xp} XP so far. Can you beat my score? Download here: https://play.google.com/store/apps/details?id=com.riddlex`,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDoubleReward = async () => {
    const shown = await adManager.showRewardedAdForHint(); // Use existing reward ad method
    if (shown) {
      await engine.addCoins(coinsEarned);
      // We could add more XP too
      Alert.alert('🎉 2x Reward!', `You earned an extra ${coinsEarned} coins!`);
    }
  };

  return (
    <LinearGradient colors={Gradients.screenBg} style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.checkCircle}>
          <Icon name="check" size={hp(8)} color={Colors.accentGreen} />
        </View>

        <Text style={styles.title}>{t('success.correct')}</Text>
        <Text style={styles.congrats}>{t('success.congrats')}</Text>

        <Animated.View style={[styles.rewardRow, { transform: [{ translateY: rewardAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }], opacity: rewardAnim }]}>
          <View style={styles.rewardItem}>
            <Text style={styles.rewardEmoji}>⭐</Text>
            <Text style={styles.rewardText}>{t('success.xpEarned', { xp: xpEarned })}</Text>
          </View>
          <View style={styles.rewardItem}>
            <Text style={styles.rewardEmoji}>🪙</Text>
            <Text style={styles.rewardText}>{t('success.coinsEarned', { coins: coinsEarned })}</Text>
          </View>
        </Animated.View>

        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <LinearGradient colors={Gradients.buttonSuccess} style={styles.btnGradient} start={{x:0,y:0}} end={{x:1,y:1}}>
            <Text style={styles.btnText}>{t('success.nextLevel')}</Text>
            <Icon name="arrow-forward" size={hp(2.5)} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.doubleBtn} onPress={handleDoubleReward}>
          <Text style={styles.doubleText}>📺 {t('success.doubleReward')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
          <Icon name="share" size={hp(2.2)} color={Colors.textSecondary} />
          <Text style={styles.shareText}>{t('success.shareScore')}</Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  confetti: { ...StyleSheet.absoluteFillObject, zIndex: 0 },
  content: { width: wp(85), alignItems: 'center', zIndex: 1 },
  checkCircle: { width: hp(15), height: hp(15), borderRadius: hp(7.5), backgroundColor: 'rgba(0,230,118,0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: hp(3), borderWidth: 2, borderColor: Colors.accentGreen },
  title: { fontSize: FontSizes.hero, color: Colors.textPrimary, fontWeight: Fonts.extraBold, marginBottom: hp(1) },
  congrats: { fontSize: FontSizes.md, color: Colors.textSecondary, textAlign: 'center', marginBottom: hp(4) },
  rewardRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: hp(5) },
  rewardItem: { alignItems: 'center', marginHorizontal: wp(5) },
  rewardEmoji: { fontSize: FontSizes.xl, marginBottom: hp(0.5) },
  rewardText: { color: '#fff', fontSize: FontSizes.md, fontWeight: Fonts.bold },
  nextBtn: { width: '100%', borderRadius: hp(2), overflow: 'hidden', marginBottom: hp(2), elevation: 5 },
  btnGradient: { paddingVertical: hp(2), flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#fff', fontSize: FontSizes.lg, fontWeight: Fonts.bold, marginRight: wp(2) },
  doubleBtn: { padding: hp(1.5), marginBottom: hp(2) },
  doubleText: { color: Colors.accentYellow, fontSize: FontSizes.sm, fontWeight: Fonts.bold },
  shareBtn: { flexDirection: 'row', alignItems: 'center', padding: hp(1.5) },
  shareText: { color: Colors.textSecondary, fontSize: FontSizes.sm, marginLeft: wp(2), fontWeight: Fonts.medium }
});

export default SuccessScreen;