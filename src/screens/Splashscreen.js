// // SplashScreen.js

// import React, { useEffect } from 'react';
// import { View, Text, StyleSheet,Image } from 'react-native';
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// import {
//   responsiveFontSize as fs
// } from "react-native-responsive-dimensions";

// const Splashscreen = ({ navigation }) => {
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       navigation.replace('HomeScreen'); // Replace with your home screen name
//     }, 3000); // 3000 milliseconds = 3 seconds

//     return () => clearTimeout(timer); // Clear the timeout if the component is unmounted
//   }, [navigation]);

//   return (
//     <View style={styles.container}>
//       <Image
//         source={require('../components/Math.png')}
//         style={styles.logo}
//       />
//       <Text style={styles.introText}>Welcome</Text>
//       {/* <Text style={styles.text}>RiddleX</Text> */}
//       {/* You can add your app's logo or any other branding elements here */}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#333333', // Customize the background color
//   },
//   logo: {
//     width: hp(25), // Adjust the width as needed
//     height: hp(25), // Adjust the height as needed
//     resizeMode: 'contain', // Choose the resizeMode that fits your image
//     marginBottom:hp(2),
//     // borderWidth:hp(0.1),
//     // borderColor:'#FFFFFF'
//   },
//   text: {
//     fontSize: fs(2.8),
//     fontWeight: '200',
//     color: '#FFFFFF', // Customize the text color
//   },
//   introText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#FFFFFF', // Customize the text color
//     textAlign: 'center', // Center the text
//   },
// });

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { responsiveFontSize as fs } from "react-native-responsive-dimensions";
import LottieView from 'lottie-react-native';

const Splashscreen = ({ navigation }) => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Run animations in parallel
    Animated.parallel([
      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      // Scale animation with spring
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.2,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      // Slide up animation
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        delay: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigation timer
    const timer = setTimeout(() => {
      navigation.replace('HomeScreen');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Background particles animation */}
      <LottieView
        source={require('../util/particles.json')}
        autoPlay
        loop
        style={styles.particles}
      />

      {/* Math text with animation */}
      <Animated.View
        style={[
          styles.mathContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}>
        <Text style={styles.mathText}>Math</Text>
        <View style={styles.underline} />
      </Animated.View>

      {/* Animated welcome text container */}
      <Animated.View
        style={[
          styles.textContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}>
        <Text style={styles.introText}>Welcome</Text>
        <Text style={styles.subText}>Your Journey Begins Here</Text>
      </Animated.View>

      {/* Bottom wave animation */}
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
    backgroundColor: '#333333',
  },
  particles: {
    position: 'absolute',
    width: wp('100%'),
    height: hp('100%'),
    opacity: 0.5,
  },
  mathContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mathText: {
    fontSize: fs(8),
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: wp(1),
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    fontFamily: 'System',  // You can replace with a custom font
  },
  underline: {
    height: hp(0.3),
    width: wp(30),
    backgroundColor: '#FFFFFF',
    marginTop: hp(1),
    borderRadius: 2,
    opacity: 0.7,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: hp(4),
  },
  introText: {
    fontSize: fs(3),
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subText: {
    fontSize: fs(2),
    color: '#CCCCCC',
    marginTop: hp(1),
    fontWeight: '300',
  },
  wave: {
    position: 'absolute',
    bottom: 0,
    width: wp('100%'),
    height: hp('20%'),
  },
});

export default Splashscreen;