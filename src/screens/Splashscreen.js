import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { responsiveFontSize as fs } from "react-native-responsive-dimensions";
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Splashscreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        delay: 500,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('HomeScreen');
    }, 3500);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../util/particles.json')}
        autoPlay
        loop
        style={styles.particles}
      />

      <Animated.View
        style={[
          styles.mathContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}>
        <Text style={styles.mathText}>Math Master</Text>
        <View style={styles.underline} />
      </Animated.View>

      <Animated.View
        style={[
          styles.textContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}>
        <Text style={styles.introText}>Welcome to Learning</Text>
        <Text style={styles.subText}>Practice • Learn • Master</Text>
      </Animated.View>

      <Icon name="school" size={hp(6)} color="#4ECDC4" style={styles.icon} />

      <LottieView
        source={require('../util/wave.json')}
        autoPlay
        loop
        style={styles.wave}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2C3E50',  // Matched with home screen
  },
  particles: {
    position: 'absolute',
    width: wp('100%'),
    height: hp('100%'),
    opacity: 0.3,
  },
  mathContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#34495E',  // Matched with header
    padding: hp(3),
    borderRadius: hp(2),
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  mathText: {
    fontSize: fs(6),
    fontWeight: '700',
    color: '#ECF0F1',  // Matched with home screen text
    letterSpacing: wp(0.5),
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  underline: {
    height: hp(0.3),
    width: wp(40),
    backgroundColor: '#4ECDC4',  // Using accent color from home screen
    marginTop: hp(1),
    borderRadius: 2,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: hp(4),
  },
  introText: {
    fontSize: fs(3),
    fontWeight: 'bold',
    color: '#ECF0F1',
    textAlign: 'center',
  },
  subText: {
    fontSize: fs(2),
    color: '#BDC3C7',  // Matched with home screen secondary text
    marginTop: hp(1),
    fontWeight: '500',
    letterSpacing: wp(0.5),
  },
  icon: {
    marginTop: hp(4),
    opacity: 0.9,
  },
  wave: {
    position: 'absolute',
    bottom: 0,
    width: wp('100%'),
    height: hp('20%'),
    tintColor: '#34495E',  // Tinting the wave animation to match theme
  },
});

export default Splashscreen;