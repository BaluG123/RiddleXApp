// // SuccessScreen.js
// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// const SuccessScreen = ({ navigation, route }) => {
//   const { onNextLevel } = route.params;

//   const handleNextLevel = () => {
//     // Navigate to the Questionscreen with the next level
//     onNextLevel();
//     // navigation.goBack();
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.successText}>Success! You got it right!</Text>
//       <TouchableOpacity style={styles.nextLevelButton} onPress={handleNextLevel}>
//         <Text>Next Level</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#ffffff',
//   },
//   successText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   nextLevelButton: {
//     padding: 10,
//     backgroundColor: 'lightgreen',
//     borderRadius: 5,
//   },
// });

// export default SuccessScreen;

import React ,{useEffect,useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

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
  }, [levelNumber]);

  const handleNextLevel = () => {
    // You can add any logic related to moving to the next level here
    navigation.navigate('QuestionScreen', { levelNumber: levelNumber + 1 });
  };

  return (
    <View style={styles.container}>
      <MaterialIcons name="check-circle" size={100} color="green" style={styles.icon} />
      <Text style={styles.successText}>Correct!</Text>
      <Text style={styles.nextLevelText}>Congratulations! Move on to the next level.</Text>
      <TouchableOpacity style={styles.nextLevelButton} onPress={handleNextLevel}>
        <MaterialIcons name="play-circle-filled" size={24} color="white" />
        <Text style={styles.buttonText}>Next Level</Text>
      </TouchableOpacity>
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
    marginBottom: 20,
  },
  successText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color:'black'
  },
  nextLevelText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color:'black'
  },
  nextLevelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
  },
});

export default SuccessScreen;
