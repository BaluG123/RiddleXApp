// // LevelScreen.js

// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet } from 'react-native';

// const Questionscreen = ({ route }) => {
//   const { levelNumber } = route.params;
//   const [question, setQuestion] = useState(null);

//   useEffect(() => {
//     // Fetch the question for the selected level from your API
//     fetch(`http://riddlexapi.pythonanywhere.com/api/levels/${levelNumber}/`)
//       .then((response) => response.json())
//       .then((data) => {
//         setQuestion(data.math_question); // Assuming your API returns a 'math_question' field
//       })
//       .catch((error) => console.error('Error fetching data:', error));
//   }, [levelNumber]);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.question}>{question}</Text>
//       {/* Add UI elements to display the question and allow user interaction */}
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
//   question: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: 'black',
//   },
// });

// export default Questionscreen;


// LevelScreen.js

// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, TextInput, TouchableOpacity ,TouchableWithoutFeedback,Keyboard,Alert} from 'react-native';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// const Questionscreen = ({ route }) => {
//   const { levelNumber } = route.params;
//   const [question, setQuestion] = useState(null);
//   const [inputValue, setInputValue] = useState('');
//   // const [isInputEditable, setIsInputEditable] = useState(false);

//   useEffect(() => {
//     // Fetch the question for the selected level from your API
//     fetch(`http://riddlexapi.pythonanywhere.com/api/levels/${levelNumber}/`)
//       .then((response) => response.json())
//       .then((data) => {
//         setQuestion(data.math_question); // Assuming your API returns a 'math_question' field
//       })
//       .catch((error) => console.error('Error fetching data:', error));
//   }, [levelNumber]);

//   const handleNumberPress = (number) => {
//     // setIsInputEditable(true);
//     setInputValue((prevValue) => prevValue + number.toString());
//   };

//   const handleCancelPress = () => {
//     setInputValue('');
//   };

//   const handleSubmit = () => {
//     // Assuming there is a field 'correct_answer' in the API response
//     const correctAnswer = question.answer; 

//     console.log('canswer',correctAnswer.toString())

//     if (inputValue === correctAnswer.toString()) {
//       // Correct answer
//       Alert.alert('Success! You got it right!');
//     } else {
//       // Incorrect answer
//       Alert.alert('Wrong answer. Try again.');
//     }

//     // Clear the input value after submission
//     setInputValue('');
//   };


//   return (
//     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//     <View style={styles.container}>
//       {/* 70% of the screen for the question */}
//       <View style={styles.questionContainer}>
//         <Text style={styles.question}>{question}</Text>
//       </View>

//       {/* 30% of the screen with three rows */}
//       <View style={styles.inputContainer}>
//         {/* First row for input, small button, and enter button */}
//         <View style={styles.row}>
//           <TextInput style={styles.input} placeholder="Enter Answer" editable={false} value={inputValue} pointerEvents="none" />
//           <TouchableOpacity style={styles.cancelButton} onPress={handleCancelPress}>
//             <MaterialIcons name="cancel" size={24} color="white" />
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.smallButton}>
//             <MaterialIcons name="lightbulb" size={24} color="white" />
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.enterButton} onPress={handleSubmit}>
//             <Text>Enter</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Remaining 2 rows for numbers */}
//         <View style={styles.row}>
//           {[1, 2, 3, 4, 5].map((number) => (
//             <TouchableOpacity key={number} style={styles.numberButton} onPress={() => handleNumberPress(number)}>
//               <Text style={{ color: 'white' }}>{number}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         <View style={styles.row}>
//           {[6, 7, 8, 9, 0].map((number) => (
//             <TouchableOpacity key={number} style={styles.numberButton} onPress={() => handleNumberPress(number)}>
//               <Text style={{ color: 'white' }}>{number}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>
//     </View>
//     </TouchableWithoutFeedback>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#ffffff',
//   },
//   questionContainer: {
//     flex: 0.7,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'lightgray', // Use the desired color for the question background
//   },
//   question: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: 'black',
//   },
//   inputContainer: {
//     flex: 0.2,
//     paddingHorizontal: 20,
//     paddingTop: 20
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 10,
//   },
//   input: {
//     flex: 0.5,
//     borderWidth: 1,
//     padding: 10,
//     color:'black'
//   },
//   smallButton: {
//     flex: 0.2,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: 'lightblue', // Use the desired color for the small button
//   },
//   enterButton: {
//     flex: 0.2,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: 'lightgreen', // Use the desired color for the enter button
//   },
//   numberButton: {
//     flex: 0.18,
//     height: 40,
//     width: 40,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: 'black',
//     color: 'white' // Use the desired color for the number buttons
//   },
//   cancelButton: {
//     flex: 0.2,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: 'black', // Button background color
//   },
// });

// export default Questionscreen;


import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SuccessScreen from './SuccessScreen';
import Sound from 'react-native-sound';


const Questionscreen = ({ route,navigation }) => {
  const { levelNumber } = route.params;
  const [question, setQuestion] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [answer, setAnswer] = useState(null); // New state for the correct answer
  const [errorMessage, setErrorMessage] = useState(null);
  

  useEffect(() => {
    // Fetch the question for the selected level from your API
    fetch(`http://riddlexapi.pythonanywhere.com/api/levels/${levelNumber}/`)
      .then((response) => response.json())
      .then((data) => {
        setQuestion(data.math_question);
        setAnswer(data.answer); // Assuming your API returns an 'answer' field
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, [levelNumber]);

  const handleNumberPress = (number) => {
    setInputValue((prevValue) => prevValue + number.toString());
  };

  const handleCancelPress = () => {
    setInputValue('');
  };

  const handleSubmit = () => {
    if (inputValue === answer.toString()) {
      // Alert.alert('Success! You got it right!');
      const successSound = new Sound('success.mp3', Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.error('Error loading sound: ', error);
          return;
        }

        successSound.play(() => successSound.release());
      });
      navigation.navigate('SuccessScreen', { onNextLevel: nextLevel });
    } else {
      // Display a message on the screen
      setInputValue(''); // Clear the input value
  
      // You can set a state to display the message
      setErrorMessage('Wrong answer. Try again.');
      
      // After a certain duration, clear the error message
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000); // Adjust the duration as needed
    }

    setInputValue('');
  };

    // Function to navigate to the next level
    const nextLevel = () => {
      // Assuming you have a way to determine the next level number, for example, incrementing by 1
      const nextLevelNumber = levelNumber + 1;

      fetch(`http://riddlexapi.pythonanywhere.com/api/levels/${nextLevelNumber}/`)
      .then((response) => response.json())
      .then((data) => {
        setQuestion(data.math_question);
        setAnswer(data.answer);
      })
      .catch((error) => console.error('Error fetching data:', error));
  
      // Navigate to the SuccessScreen with the next level number
      navigation.navigate('QuestionScreen', { levelNumber: nextLevelNumber });
    };


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()} // You can customize the back button behavior
        >
          <MaterialIcons name="keyboard-arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Level {levelNumber}</Text>
      </View>
        {/* 70% of the screen for the question */}
        <View style={styles.questionContainer}>
          <Text style={styles.question}>{question}</Text>
        </View>
        {errorMessage && (
  <View style={styles.errorMessageContainer}>
    <Text style={styles.errorMessageText}>{errorMessage}</Text>
  </View>
)}

        {/* 30% of the screen with three rows */}
        <View style={styles.inputContainer}>
          {/* First row for input, small button, and enter button */}
          <View style={styles.row}>
            <TextInput style={styles.input} placeholder="Answer" editable={false} value={inputValue} pointerEvents="none" />
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelPress}>
              <MaterialIcons name="cancel" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.smallButton}>
              <MaterialIcons name="lightbulb" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.enterButton} onPress={handleSubmit}>
              <Text>Enter</Text>
            </TouchableOpacity>
          </View>

          {/* Remaining 2 rows for numbers */}
          <View style={styles.row}>
            {[1, 2, 3, 4, 5].map((number) => (
              <TouchableOpacity key={number} style={styles.numberButton} onPress={() => handleNumberPress(number)}>
                <Text style={{ color: 'white' }}>{number}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.row}>
            {[6, 7, 8, 9, 0].map((number) => (
              <TouchableOpacity key={number} style={styles.numberButton} onPress={() => handleNumberPress(number)}>
                <Text style={{ color: 'white' }}>{number}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  questionContainer: {
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgray',
  },
  question: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  inputContainer: {
    flex: 0.2,
    paddingHorizontal: 20,
    paddingTop: 20,
    padding:5
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  input: {
    flex: 0.5,
    borderWidth: 1,
    padding: 10,
    color: 'black',
    width:150
  },
  smallButton: {
    flex: 0.2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightblue',
  },
  enterButton: {
    flex: 0.2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightgreen',
  },
  numberButton: {
    flex: 0.18,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    color: 'white'
  },
  cancelButton: {
    flex: 0.2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  errorMessageContainer: {
  alignItems: 'center',
  marginBottom: 10,
},
errorMessageText: {
  color: 'red',
  fontSize: 16,
},
header: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 16,
  backgroundColor:'black',
  height:50,
},
headerTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  marginLeft: 8,
  color:'white'
},
});

export default Questionscreen;
