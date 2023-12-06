// SplashScreen.js

import React, { useEffect } from 'react';
import { View, Text, StyleSheet,Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {
  responsiveFontSize as fs
} from "react-native-responsive-dimensions";

const Splashscreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('HomeScreen'); // Replace with your home screen name
    }, 3000); // 3000 milliseconds = 3 seconds

    return () => clearTimeout(timer); // Clear the timeout if the component is unmounted
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../components/math.png')}
        style={styles.logo}
      />
      <Text style={styles.introText}>Welcome</Text>
      {/* <Text style={styles.text}>RiddleX</Text> */}
      {/* You can add your app's logo or any other branding elements here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333333', // Customize the background color
  },
  logo: {
    width: hp(25), // Adjust the width as needed
    height: hp(25), // Adjust the height as needed
    resizeMode: 'contain', // Choose the resizeMode that fits your image
    marginBottom:hp(2),
    // borderWidth:hp(0.1),
    // borderColor:'#FFFFFF'
  },
  text: {
    fontSize: fs(2.8),
    fontWeight: '200',
    color: '#FFFFFF', // Customize the text color
  },
  introText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF', // Customize the text color
    textAlign: 'center', // Center the text
  },
});

export default Splashscreen;
