// LevelsScreen.js

import React from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Levelscreen = ({ navigation }) => {
  const levelsData = Array.from({ length: 100 }, (_, index) => index + 1);

  const handleLevelPress = (levelNumber) => {
    // Handle the navigation to the specific level screen
    console.log(`Navigating to Level ${levelNumber}`);
    navigation.navigate('QuestionScreen', { levelNumber });
    // Add your navigation logic here
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.levelBox}
      onPress={() => handleLevelPress(item)}
    >
      <Text style={styles.levelNumber}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
        <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()} // You can customize the back button behavior
        >
          <Icon name="keyboard-arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Levels</Text>
      </View>

      <FlatList
        data={levelsData}
        renderItem={renderItem}
        keyExtractor={(item) => item.toString()}
        numColumns={5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#333333',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor:'#333333',
    height:40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
    color:'#FFFFFF'
  },
  levelBox: {
    flex: 1,
    aspectRatio: 1, // Maintain square aspect ratio
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    margin: 8,
    backgroundColor:'#333333'
  },
  levelNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
});

export default Levelscreen;
