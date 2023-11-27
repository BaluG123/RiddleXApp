// HomeScreen.js

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {
  responsiveFontSize as fs
} from "react-native-responsive-dimensions";

const Homescreen = ({ navigation }) => {


  const handleLevelsPress = () => {
    navigation.navigate('LevelScreen');
  };

  return (
    <View style={styles.container}>
      {/* App Name */}
      
      <Image
        source={require('../components/Math.png')}
        style={styles.logo}
      />
      <Text style={styles.appName}>RiddleX</Text>

      {/* Play icon */}
      <TouchableOpacity onPress={handleLevelsPress}>
        <View style={styles.playIconContainer}>
          <Icon name="play-arrow" size={32} color="black" />
        </View>
      </TouchableOpacity>

      {/* Other options */}
      <View style={styles.optionsContainer}>
        <Text style={styles.optionText} onPress={handleLevelsPress}>
          Levels
        </Text>
        <Text style={styles.optionText}>Follow Us</Text>
        {/* Add more options as needed */}
      </View>
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
  appName: {
    fontSize: fs(2.8),
    fontWeight: '200',
    marginBottom: hp(1),
    color: '#FFFFFF'
  },
  playIconContainer: {
    backgroundColor: '#FFFFFF', // Customize the background color
    borderRadius: hp(4), // Half of the size for a circular shape
    padding: hp(2),
    marginBottom: wp(3),
  },
  optionsContainer: {
    alignItems: 'center',
  },
  optionText: {
    fontSize: fs(2.5),
    marginVertical: hp(0.5),
    color: '#FFFFFF',
    fontWeight:'200',
    // marginBottom:hp(10)
  },
  logo: {
    width: hp(25), // Adjust the width as needed
    height: hp(25), // Adjust the height as needed
    resizeMode: 'contain', // Choose the resizeMode that fits your image
    marginBottom:hp(2),
    borderWidth:hp(0.1),
    borderColor:'#FFFFFF'
  },
});

export default Homescreen;
