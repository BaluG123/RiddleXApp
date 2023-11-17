// HomeScreen.js

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Homescreen = ({ navigation }) => {


  const handleLevelsPress = () => {
    navigation.navigate('LevelScreen');
  };





  return (
    <View style={styles.container}>
      {/* App Name */}
      <Text style={styles.appName}>RiddleX</Text>

      {/* Play icon */}
      <TouchableOpacity onPress={handleLevelsPress}>
        <View style={styles.playIconContainer}>
          <Icon name="play-arrow" size={32} color="white" />
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#FFFFFF'
  },
  playIconContainer: {
    backgroundColor: 'black', // Customize the background color
    borderRadius: 64, // Half of the size for a circular shape
    padding: 16,
    marginBottom: 32,
  },
  optionsContainer: {
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
    marginVertical: 8,
    color: '#FFFFFF', // Customize the text color
  },
});

export default Homescreen;
