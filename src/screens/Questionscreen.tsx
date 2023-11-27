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
import { View, Text, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert, ActivityIndicator, Image, Modal, Button } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SuccessScreen from './SuccessScreen';
import Sound from 'react-native-sound';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {
  responsiveFontSize as fs
} from "react-native-responsive-dimensions";


const Questionscreen = ({ route, navigation }) => {
  const { levelNumber } = route.params;
  const [question, setQuestion] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [answer, setAnswer] = useState(null); // New state for the correct answer
  const [errorMessage, setErrorMessage] = useState(null);
  const [soundOn, setSoundOn] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isImageQuestion, setIsImageQuestion] = useState(false);

  // State for modal
  const [modalVisible, setModalVisible] = useState(false);
  const [hmodalVisible, setHmodalVisible] = useState(false)
  const [hint, setHint] = useState('');
  const [solution, setSolution] = useState('');

  useEffect(() => {
    // Fetch the question for the selected level from your API
    fetch(`http://riddlexapi.pythonanywhere.com/api/levels/${levelNumber}/`)
      .then((response) => response.json())
      .then((data) => {
        if (data.image_question) {
          setQuestion(data.image_question);
          setIsImageQuestion(true);
        } else {
          setQuestion(data.math_question);
          setIsImageQuestion(false);
        }
        setAnswer(data.answer);
        setHint(data.hint);
        setSolution(data.solution);
        setLoading(false);
      })
      .catch((error) => console.error('Error fetching data:', error));
    setLoading(false);
  }, [levelNumber]);

  const handleNumberPress = (number) => {
    setInputValue((prevValue) => prevValue + number.toString());
  };

  const handleCancelPress = () => {
    setInputValue('');
  };

  // Function to toggle modal visibility
  const toggleModal = () => {
    setModalVisible(!modalVisible);
    setInputValue('');
  };

  const htoggleModal = () => {
    setHmodalVisible(!hmodalVisible);
    setInputValue('');
  }

  const handleSubmit = () => {
    if (!inputValue.trim()) {
      // If inputValue is empty or contains only whitespace
      setErrorMessage('Please fill in the answer.');
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
      return; // Exit the function to prevent further execution
    }
    if (inputValue === answer.toString()) {
      if (soundOn) {
        const successSound = new Sound('success.mp3', Sound.MAIN_BUNDLE, (error) => {
          if (error) {
            console.error('Error loading sound: ', error);
            return;
          }

          successSound.play(() => successSound.release());
        });
      }

      navigation.navigate('SuccessScreen', { levelNumber });
    } else {
      if (soundOn) {
        const wrongAnswerSound = new Sound('wrong_answer.mp3', Sound.MAIN_BUNDLE, (error) => {
          if (error) {
            console.error('Error loading wrong answer sound: ', error);
            return;
          }

          wrongAnswerSound.play(() => wrongAnswerSound.release());
        });
      }

      setInputValue('');
      setErrorMessage('Wrong. Try again.');

      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }

    setInputValue('');
  };


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

  const toggleSound = () => {
    setSoundOn((prev) => !prev);
  };


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()} // You can customize the back button behavior
          >
            <MaterialIcons name="keyboard-arrow-left" size={fs(4.2)} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Level {levelNumber}</Text>
          <TouchableOpacity onPress={toggleSound}>
            <MaterialIcons name={soundOn ? "volume-up" : "volume-off"} size={24} color="white" />
          </TouchableOpacity>
        </View>
        {/* 70% of the screen for the question */}
        {loading ? ( // Display ActivityIndicator while loading
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="red" />
          </View>
        ) : (
          <View style={styles.questionContainer}>
            {/* <Text style={styles.question}>{question}</Text> */}
            {isImageQuestion ? (
              <Image source={{ uri: question }} style={styles.imageQuestion} />
            ) : (
              <Text style={styles.question}>{question}</Text>
            )}
          </View>
        )}
        {errorMessage && (
          <View style={styles.errorMessageContainer}>
            <Text style={styles.errorMessageText}>{errorMessage}</Text>
          </View>
        )}

        {/* 30% of the screen with three rows */}
        <View style={styles.inputContainer}>
          {/* First row for input, small button, and enter button */}
          <View style={styles.row}>
            <TextInput style={styles.input} placeholder="Answer" editable={false} value={inputValue} pointerEvents="none" placeholderTextColor="#FFFFFF" />
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelPress}>
              <MaterialIcons name="cancel" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.smallButton} onPress={htoggleModal} >
              <MaterialIcons name="help-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.smallButton} onPress={toggleModal}>
              <MaterialIcons name="lightbulb" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.enterButton} onPress={handleSubmit}>
              <Text style={{ color: '#FFFFFF' }}>Enter</Text>
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

        <Modal
          animationType="slide"
          transparent={true}
          visible={hmodalVisible}
          onRequestClose={() => {
            setHmodalVisible(!hmodalVisible);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* <Text style={{ color: 'black', marginLeft: '30%' }}>Need Help ?</Text> */}
              <Text style={styles.modalTitle}>Hint</Text>
              <Text style={{ color: 'black', marginBottom: 5 }}>{hint}</Text>
              {/* <Text style={styles.modalTitle}>Solution</Text> */}
              {/* <Text style={{ color: 'black', marginBottom: 10 }}>{solution}</Text> */}
              {/* <Button title="got it thanks !" onPress={htoggleModal} /> */}
              <TouchableOpacity onPress={htoggleModal} style={styles.gotItButton}>
                <Text style={styles.buttonText}>Got it. Close!</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* <Text style={{ color: 'black', marginLeft: '30%' }}>Need Help ?</Text> */}
              {/* <Text style={styles.modalTitle}>Hint</Text> */}
              {/* <Text style={{color:'black',marginBottom:5}}>{hint}</Text> */}
              <Text style={styles.modalTitle}>Solution</Text>
              <Text style={{ color: 'black', marginBottom: 10 }}>{solution}</Text>
              {/* <Button title="got it thanks !" onPress={toggleModal} /> */}
              <TouchableOpacity onPress={toggleModal} style={styles.gotItButton}>
                <Text style={styles.buttonText}>Got it. Close!</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#555555',
    paddingHorizontal: 5
  },
  questionContainer: {
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333333',
    borderWidth:hp(0.1),
    borderColor:'#ccc'
  },
  question: {
    fontSize: fs(3.6),
    fontWeight: '100',
    color: '#FFFFFF',
  },
  inputContainer: {
    flex: 0.2,
    paddingHorizontal: hp(0.1),
    paddingTop: hp(1),
    padding: hp(0.1),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(2),
  },
  input: {
    flex: 0.48,
    padding: wp(2),
    color: '#FFFFFF',
    width: wp(1),
    borderWidth:hp(0.1),
    backgroundColor:'#333333',
    borderColor:'#ccc'
  },
  smallButton: {
    flex: 0.2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333333',
    marginRight: wp(1),
    borderWidth:hp(0.1),
    borderColor:'#ccc'
  },
  enterButton: {
    flex: 0.2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333333',
    color: 'white',
    borderWidth:hp(0.1),
    borderColor:'#ccc',
    marginRight: wp(0),
  },
  numberButton: {
    flex: 0.18,
    height: hp(5),
    width: hp(6),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333333',
    color: 'white',
    fontWeight:'100',
    borderColor:'#ccc',
    borderWidth:hp(0.1)
  },
  cancelButton: {
    flex: 0.2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333333',
    marginRight: 10,
    borderWidth:hp(0.1),
    borderColor:'#ccc',
    marginLeft:wp(0.2)
  },
  errorMessageContainer: {
    alignItems: 'center',
    marginBottom: hp(0.1),
    marginTop:hp(0.1)
  },
  errorMessageText: {
    color: '#FFFFFF',
    fontSize: fs(2),
    fontWeight:'100'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(0.5),
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    backgroundColor: '#333333',
    height: hp(6),
    marginTop:hp(0.5),
    borderWidth:hp(0.1),
    borderColor:'#ccc'
  },
  headerTitle: {
    fontSize: fs(2.8),
    fontWeight: '100',
    marginLeft: 8,
    color: 'white'
  },
  loadingContainer: {
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageQuestion: {
    width: hp(40),
    height: hp(40), // Adjust the height as needed
    resizeMode: 'cover',
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: hp(2.5),
    borderRadius: hp(1.2),
    elevation: 5,
    width: wp(80), // Set the width to cover 80% of the screen
    maxHeight: hp(100), // Set the max height to cover 80% of the screen
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '100',
    marginBottom: 10,
    color: 'black'
  },
  gotItButton: {
    backgroundColor: '#333333',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
    borderWidth:hp(0.1),
    borderColor:'#ccc'
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: fs(2),
    fontWeight:'100',
  },
});

export default Questionscreen;
