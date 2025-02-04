// // LevelsScreen.js

// import React,{useState,useEffect} from 'react';
// import { View, FlatList, Text, TouchableOpacity, StyleSheet,Alert,Modal } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { useFocusEffect } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { updateCompletedLevel } from './AsyncStorageUtil';
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// import {
//   responsiveFontSize as fs
// } from "react-native-responsive-dimensions";

// const Levelscreen = ({ navigation }) => {
//   const levelsData = Array.from({ length: 100 }, (_, index) => index + 1);
//   const [currentLevel, setCurrentLevel] = useState(1);

//   useEffect(() => {
//     // Retrieve the current levelNumber from AsyncStorage
//     AsyncStorage.getItem('currentLevel').then((value) => {
//       if (value) {
//         setCurrentLevel(parseInt(value));
//       }
//     });
//   }, []);


//   const checkCompletedLevels = async () => {
//     const completedLevel = await AsyncStorage.getItem('completedLevel');
//     if (completedLevel) {
//       setCurrentLevel(parseInt(completedLevel) + 1);
//     }
//   };

//   useEffect(() => {
//     checkCompletedLevels();
//   }, []);

//   useFocusEffect(
//     React.useCallback(() => {
//       checkCompletedLevels();
//     }, [])
//   );

//   const handleLevelPress = (levelNumber) => {
//     if (levelNumber <= currentLevel) {
//       console.log(`Navigating to Level ${levelNumber}`);
//       navigation.navigate('QuestionScreen', { levelNumber });
//     } else {
//       Alert.alert('Locked Level', 'This level is currently locked. Please complete the previous level to unlock and access this challenge.');
//     }
//   };

//   const updateCompletedLevel = async (levelNumber) => {
//     await AsyncStorage.setItem('completedLevel', levelNumber.toString());
//     setCurrentLevel(levelNumber + 1);
//   };

//   const renderItem = ({ item }) => (
//     <TouchableOpacity
//       style={styles.levelBox}
//       onPress={() => handleLevelPress(item)}
//     >
//     <Text style={[styles.levelNumber, item <= currentLevel ? styles.completedLevel : styles.incompleteLevel]}>
//         {item}
//       </Text>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//         <View style={styles.header}>
//         <TouchableOpacity
//           onPress={() => navigation.goBack()} // You can customize the back button behavior
//         >
//           <Icon name="keyboard-arrow-left" size={fs(4.2)} color="#FFFFFF" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Levels</Text>
//       </View>

//       <FlatList
//         data={levelsData}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.toString()}
//         numColumns={5}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#333333',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//     backgroundColor:'#333333',
//     height:40,
//   },
//   headerTitle: {
//     fontSize: fs(2.8),
//     fontWeight: '200',
//     marginLeft: 8,
//     color:'#FFFFFF'
//   },
//   levelBox: {
//     flex: 1,
//     aspectRatio: 1, // Maintain square aspect ratio
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: hp(0.1),
//     borderColor: '#ccc',
//     margin: 8,
//     backgroundColor:'#333333',
//   },
//   levelNumber: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#FFFFFF'
//   },
//   completedLevel: {
//     color: '#00FF00',
//     fontWeight:'200'
//   },
//   incompleteLevel: {
//     color: '#FFFFFF',
//     fontWeight:'200'
//   },
// });

// export default Levelscreen;



import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { responsiveFontSize as fs } from "react-native-responsive-dimensions";
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

const Levelscreen = ({ navigation }) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const levelsData = Array.from({ length: 100 }, (_, index) => index + 1);

  useEffect(() => {
    loadCurrentLevel();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      checkCompletedLevels();
    }, [])
  );

  const loadCurrentLevel = async () => {
    try {
      const value = await AsyncStorage.getItem('currentLevel');
      if (value) {
        setCurrentLevel(parseInt(value));
      }
    } catch (error) {
      console.error('Error loading current level:', error);
    }
  };

  const checkCompletedLevels = async () => {
    try {
      const completedLevel = await AsyncStorage.getItem('completedLevel');
      if (completedLevel) {
        setCurrentLevel(parseInt(completedLevel) + 1);
      }
    } catch (error) {
      console.error('Error checking completed levels:', error);
    }
  };

  const handleLevelPress = (levelNumber) => {
    if (levelNumber <= currentLevel) {
      navigation.navigate('QuestionScreen', { levelNumber });
    } else {
      Alert.alert(
        'Locked Level',
        'This level is currently locked. Please complete the previous level to unlock and access this challenge.',
        [{ text: 'OK', style: 'default' }]
      );
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.sectionContainer, { opacity: item <= currentLevel ? 1 : 0.7 }]}
      onPress={() => handleLevelPress(item)}
    >
      <Text style={[
        styles.levelNumber,
        item <= currentLevel ? styles.completedLevel : styles.incompleteLevel
      ]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-2627956667785383/8571195943';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="keyboard-arrow-left" size={hp(4)} color="#ECF0F1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Levels</Text>
      </View>

      <FlatList
        data={levelsData}
        renderItem={renderItem}
        keyExtractor={item => item.toString()}
        numColumns={4}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.adContainer}>
        <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C3E50',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: hp(2),
    backgroundColor: '#34495E',
    borderBottomWidth: 1,
    borderBottomColor: '#3B536F',
  },
  backButton: {
    padding: hp(1),
  },
  headerTitle: {
    fontSize: fs(3),
    color: '#ECF0F1',
    fontWeight: '700',
    marginLeft: wp(2),
    letterSpacing: 1,
  },
  gridContainer: {
    padding: hp(2),
    paddingBottom: hp(12),
  },
  sectionContainer: {
    width: wp(21),
    height: wp(21),
    margin: wp(1),
    borderRadius: hp(1.5),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#34495E',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  levelNumber: {
    fontSize: fs(2.5),
    fontWeight: '600',
  },
  completedLevel: {
    color: '#4ECDC4',
  },
  incompleteLevel: {
    color: '#BDC3C7',
  },
  adContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#2C3E50',
  },
});

export default Levelscreen;