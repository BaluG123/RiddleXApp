import React ,{useEffect,useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateCompletedLevel } from './AsyncStorageUtil';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {
  responsiveFontSize as fs
} from "react-native-responsive-dimensions";
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';



const SuccessScreen = ({ navigation, route }) => {
  const { levelNumber } = route.params;
  const [question, setQuestion] = useState(null);

  useEffect(() => {
    fetch(`http://riddlexapi.pythonanywhere.com/api/levels/${levelNumber}/`)
      .then((response) => response.json())
      .then((data) => {
        setQuestion(data.math_question);
      })
      .catch((error) => console.error('Error fetching data:', error));

      AsyncStorage.getItem('completedLevel').then((completedLevel) => {
        if (!completedLevel || levelNumber > parseInt(completedLevel)) {
          AsyncStorage.setItem('completedLevel', levelNumber.toString());
        }
      });

      AsyncStorage.setItem('currentLevel', levelNumber.toString());
      // AsyncStorage.setItem('completedLevel', levelNumber.toString());
  }, [levelNumber]);

  const handleNextLevel = () => {
    // You can add any logic related to moving to the next level here
    // updateCompletedLevel(levelNumber);
    navigation.navigate('QuestionScreen', { levelNumber: levelNumber + 1 });
  };

  const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-2627956667785383/7509768784';
  const adUnitId2 = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-2627956667785383/2801836195';

 
  return (
    <View style={styles.container}>
      <View style={{ position: 'absolute', top: 0, width: '100%' }}>
        <BannerAd
          unitId={adUnitId2}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        />
      </View>
      <MaterialIcons name="check-circle" size={100} color="green" style={styles.icon} />
      <Text style={styles.successText}>Correct!</Text>
      <Text style={styles.nextLevelText}>Congratulations! Move on to the next level.</Text>
      <TouchableOpacity style={styles.nextLevelButton} onPress={handleNextLevel}>
        <MaterialIcons name="play-circle-filled" size={24} color="white" />
        <Text style={styles.buttonText}>Next Level</Text>
      </TouchableOpacity>
      <View style={{ position: 'absolute', bottom: 0, width: '100%' }}>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  icon: {
    marginBottom: hp(2),
  },
  successText: {
    fontSize: fs(3),
    fontWeight: 'bold',
    marginBottom: 10,
    color:'black'
  },
  nextLevelText: {
    fontSize: fs(2),
    marginBottom: wp(3),
    textAlign: 'center',
    color:'black'
  },
  nextLevelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'black',
    paddingVertical: hp(1.2),
    paddingHorizontal: hp(3),
    borderRadius: hp(0.8),
  },
  buttonText: {
    color: 'white',
    marginLeft: wp(2.5),
    fontSize: fs(2),
  },
});

export default SuccessScreen;


