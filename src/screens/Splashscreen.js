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

// export default Splashscreen;


import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { responsiveFontSize as fs } from "react-native-responsive-dimensions";
import LottieView from 'lottie-react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  withRepeat,
} from 'react-native-reanimated';

const Splashscreen = ({ navigation }) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const slideUp = useSharedValue(50);

  useEffect(() => {
    // Animate scale with bouncy effect
    scale.value = withSequence(
      withTiming(1.2, { duration: 600 }),
      withSpring(1, { damping: 12, stiffness: 100 })
    );

    // Fade in effect
    opacity.value = withTiming(1, { duration: 800 });

    // Slide up animation for text
    slideUp.value = withDelay(400, withSpring(0, { damping: 15 }));

    // Navigation timer
    const timer = setTimeout(() => {
      navigation.replace('HomeScreen');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: slideUp.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      {/* Background particles animation */}
      <LottieView
        source={require('../util/particles.json')} // Make sure to add your particles JSON file
        autoPlay
        loop
        style={styles.particles}
      />

      {/* Logo container with animation */}
      <Animated.View style={[styles.logoContainer, logoStyle]}>
        <Image
          source={require('../components/Math.png')}
          style={styles.logo}
        />
      </Animated.View>

      {/* Animated text container */}
      <Animated.View style={[styles.textContainer, textStyle]}>
        <Text style={styles.introText}>Welcome</Text>
        <Text style={styles.subText}>Your Math Journey Begins Here</Text>
      </Animated.View>

      {/* Bottom wave animation */}
      <LottieView
        source={require('../util/wave.json')} // Make sure to add your wave JSON file
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
    backgroundColor: '#000000',
  },
  particles: {
    position: 'absolute',
    width: wp('100%'),
    height: hp('100%'),
    opacity: 0.5,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: hp(25),
    height: hp(25),
    resizeMode: 'contain',
    marginBottom: hp(2),
  },
  textContainer: {
    alignItems: 'center',
    marginTop: hp(2),
  },
  introText: {
    fontSize: fs(3.5),
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
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