/**
 * Splash Screen — Math Master v3.0
 * Modern animated gradient splash with logo
 */
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Gradients, Colors } from '../theme/colors';
import { FontSizes, Fonts } from '../theme/typography';

const Splashscreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const titleSlide = useRef(new Animated.Value(40)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    StatusBar.setBackgroundColor('#0f0c29');

    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 4, tension: 40, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(titleSlide, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(taglineOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('Main');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient colors={Gradients.screenBg} style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      <Animated.View style={[styles.logoContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <LinearGradient colors={Gradients.headerBg} style={styles.logoCircle} start={{x:0,y:0}} end={{x:1,y:1}}>
          <Text style={styles.logoEmoji}>🧮</Text>
        </LinearGradient>
      </Animated.View>

      <Animated.Text style={[styles.title, { transform: [{ translateY: titleSlide }], opacity: fadeAnim }]}>
        Math Master
      </Animated.Text>

      <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
        Practice • Learn • Master
      </Animated.Text>

      <Animated.Text style={[styles.version, { opacity: taglineOpacity }]}>
        v3.0
      </Animated.Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logoContainer: { marginBottom: hp(2) },
  logoCircle: { width: hp(12), height: hp(12), borderRadius: hp(6), justifyContent: 'center', alignItems: 'center', elevation: 10, shadowColor: '#667eea', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.5, shadowRadius: 12 },
  logoEmoji: { fontSize: hp(6) },
  title: { fontSize: FontSizes.hero, color: Colors.textPrimary, fontWeight: Fonts.extraBold, letterSpacing: 2, textAlign: 'center' },
  tagline: { fontSize: FontSizes.md, color: Colors.textSecondary, marginTop: hp(1), letterSpacing: 3, textTransform: 'uppercase' },
  version: { position: 'absolute', bottom: hp(3), color: Colors.textMuted, fontSize: FontSizes.xs },
});

export default Splashscreen;