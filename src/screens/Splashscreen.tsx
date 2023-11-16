// SplashScreen.js

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Splashscreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('HomeScreen'); // Replace with your home screen name
    }, 3000); // 3000 milliseconds = 3 seconds

    return () => clearTimeout(timer); // Clear the timeout if the component is unmounted
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>RiddleX</Text>
      {/* You can add your app's logo or any other branding elements here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Customize the background color
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000', // Customize the text color
  },
});

export default Splashscreen;
