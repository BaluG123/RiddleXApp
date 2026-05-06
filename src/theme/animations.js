/**
 * Reusable Animation Presets — Math Master v3.0
 */
import { Animated, Easing } from 'react-native';

export const AnimationPresets = {
  /**
   * Bounce in effect
   */
  bounceIn: (animValue, duration = 600) => {
    return Animated.spring(animValue, {
      toValue: 1,
      friction: 4,
      tension: 50,
      useNativeDriver: true,
    });
  },

  /**
   * Scale pulse (for correct/wrong answer feedback)
   */
  pulse: (animValue, toValue = 1.15, duration = 150) => {
    return Animated.sequence([
      Animated.timing(animValue, {
        toValue,
        duration,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(animValue, {
        toValue: 1,
        duration,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]);
  },

  /**
   * Shake effect (for wrong answers)
   */
  shake: (animValue, intensity = 10, duration = 80) => {
    return Animated.sequence([
      Animated.timing(animValue, { toValue: intensity, duration, useNativeDriver: true }),
      Animated.timing(animValue, { toValue: -intensity, duration, useNativeDriver: true }),
      Animated.timing(animValue, { toValue: intensity * 0.6, duration, useNativeDriver: true }),
      Animated.timing(animValue, { toValue: -intensity * 0.6, duration, useNativeDriver: true }),
      Animated.timing(animValue, { toValue: 0, duration, useNativeDriver: true }),
    ]);
  },

  /**
   * Fade in
   */
  fadeIn: (animValue, duration = 400, delay = 0) => {
    return Animated.timing(animValue, {
      toValue: 1,
      duration,
      delay,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    });
  },

  /**
   * Slide up
   */
  slideUp: (animValue, fromValue = 50, duration = 400, delay = 0) => {
    animValue.setValue(fromValue);
    return Animated.timing(animValue, {
      toValue: 0,
      duration,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
  },

  /**
   * Coin float up animation
   */
  floatUp: (animValue, duration = 1200) => {
    return Animated.timing(animValue, {
      toValue: -100,
      duration,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    });
  },

  /**
   * Glow pulse (for streak fire, XP bar, etc.)
   */
  glowPulse: (animValue, duration = 1500) => {
    return Animated.loop(
      Animated.sequence([
        Animated.timing(animValue, {
          toValue: 1.1,
          duration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(animValue, {
          toValue: 1,
          duration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
  },

  /**
   * Staggered children entrance
   */
  staggeredEntrance: (animations, staggerDelay = 100) => {
    return Animated.stagger(staggerDelay, animations);
  },

  /**
   * Number counter animation helper
   */
  countTo: (animValue, toValue, duration = 800) => {
    return Animated.timing(animValue, {
      toValue,
      duration,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false, // Must be false for text interpolation
    });
  },
};

/**
 * Hook helper to create animation values
 */
export const createAnimValues = (count) => {
  return Array.from({ length: count }, () => new Animated.Value(0));
};
