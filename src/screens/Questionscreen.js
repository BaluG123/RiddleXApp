// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert, ActivityIndicator, Image, Modal, Button } from 'react-native';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import SuccessScreen from './SuccessScreen';
// import Sound from 'react-native-sound';
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// import {
//   responsiveFontSize as fs
// } from "react-native-responsive-dimensions";
// import { RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads';
// import { RewardedInterstitialAd } from 'react-native-google-mobile-ads'; //reward intertetial
// import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';


// // const adUnitId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-2627956667785383/1872666477';

// const adUnitId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-2627956667785383/1872666477';



// const rewarded = RewardedAd.createForAdRequest(adUnitId, {
//   keywords: ['fashion', 'clothing', 'Menswear', 'Womenswear', 'Streetwear'],
// });

// // const adUnitId2 = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';

// // rewarded ads for solution
// // const rewarded2 = RewardedAd.createForAdRequest(adUnitId2, {
// //   keywords: ['fashion', 'clothing'],
// // });

// const adUnitId2 = __DEV__ ? TestIds.REWARDED_INTERSTITIAL : 'ca-app-pub-2627956667785383/6921813171';

// const rewardedInterstitial = RewardedInterstitialAd.createForAdRequest(adUnitId2, {
//   keywords: ['fashion', 'clothing', 'Menswear', 'Womenswear', 'Streetwear'],
// });


// const Questionscreen = ({ route, navigation }) => {
//   const { levelNumber } = route.params;
//   const [question, setQuestion] = useState(null);
//   const [inputValue, setInputValue] = useState('');
//   const [answer, setAnswer] = useState(null); // New state for the correct answer
//   const [errorMessage, setErrorMessage] = useState(null);
//   const [soundOn, setSoundOn] = useState(true);
//   const [loading, setLoading] = useState(true);
//   const [isImageQuestion, setIsImageQuestion] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [hmodalVisible, setHmodalVisible] = useState(false)
//   const [hint, setHint] = useState('');
//   const [solution, setSolution] = useState('');
//   const [watchAdForHintModalVisible, setWatchAdForHintModalVisible] = useState(false);
//   const [watchAdForSolutionModalVisible, setWatchAdForSolutionModalVisible] = useState(false);
//   // const [loaded, setLoaded] = useState(false);
//   const [isAdLoaded, setIsAdLoaded] = useState(false);

//   useEffect(() => {
//     // Fetch the question for the selected level from your API
//     fetch(`https://riddlexapi.pythonanywhere.com/api/levels/${levelNumber}/`)
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.image_question) {
//           setQuestion(data.image_question);
//           setIsImageQuestion(true);
//         } else {
//           setQuestion(data.math_question);
//           setIsImageQuestion(false);
//         }
//         setAnswer(data.answer);
//         setHint(data.hint);
//         setSolution(data.solution);
//         setLoading(false);
//       })
//       .catch((error) => console.error('Error fetching data:', error));
//     setLoading(false);
//   }, [levelNumber]);

//   useEffect(() => {
//     const adLoadTimeout = setTimeout(() => {
//       if (!isAdLoaded) {
//         // Handle the scenario where the ad did not load within the specified time
//         console.log("Ad load timeout");
//         // Alert.alert("Ad Load Error", "Failed to load the rewarded ad. Please try again later.");
//         setIsAdLoaded(true); // Set isAdLoaded to true to prevent further attempts
//       }
//     }, 4000); // Set a timeout of 5 seconds (you can adjust the time as needed)

//     const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
//       // setLoaded(true);
//       setIsAdLoaded(true);
//     });
//     const unsubscribeEarned = rewarded.addAdEventListener(
//       RewardedAdEventType.EARNED_REWARD,
//       reward => {
//         console.log('User earned reward of ', reward);
//       },
//     );

//     // Start loading the rewarded ad straight away
//     rewarded.load();


//     // Unsubscribe from events on unmount
//     return () => {
//       clearTimeout(adLoadTimeout);
//       unsubscribeLoaded();
//       unsubscribeEarned();
//     };
//   }, []);


//   useEffect(() => {
//     const adLoadTimeout = setTimeout(() => {
//       if (!isAdLoaded) {
//         // Handle the scenario where the ad did not load within the specified time
//         console.log("Ad load timeout");
//         // Alert.alert("Ad Load Error", "Failed to load the rewarded ad. Please try again later.");
//         setIsAdLoaded(true); // Set isAdLoaded to true to prevent further attempts
//       }
//     }, 4000); // Set a timeout of 5 seconds (you can adjust the time as needed)
//     const unsubscribeLoaded = rewardedInterstitial.addAdEventListener(
//       RewardedAdEventType.LOADED,
//       () => {
//         setIsAdLoaded(true);
//         // setLoaded(true);
//       },
//     );
//     const unsubscribeEarned = rewardedInterstitial.addAdEventListener(
//       RewardedAdEventType.EARNED_REWARD,
//       reward => {
//         console.log('User earned reward of ', reward);
//       },
//     );

//     // Start loading the rewarded interstitial ad straight away
//     rewardedInterstitial.load();

//     // Unsubscribe from events on unmount
//     return () => {
//       clearTimeout(adLoadTimeout);
//       unsubscribeLoaded();
//       unsubscribeEarned();
//     };
//   }, []);


//   const handleNumberPress = (number) => {
//     setInputValue((prevValue) => prevValue + number.toString());
//   };

//   const handleCancelPress = () => {
//     setInputValue('');
//   };

//   // Function to toggle modal visibility
//   const toggleModal = () => {
//     setModalVisible(!modalVisible);
//     setInputValue('');
//   };

//   const htoggleModal = () => {
//     setHmodalVisible(!hmodalVisible);
//     setInputValue('');
//   }

//   const handleSubmit = () => {
//     if (!inputValue.trim()) {
//       // If inputValue is empty or contains only whitespace
//       setErrorMessage('Please fill in the answer.');
//       setTimeout(() => {
//         setErrorMessage(null);
//       }, 3000);
//       return; // Exit the function to prevent further execution
//     }
//     if (inputValue === answer.toString()) {
//       if (soundOn) {
//         const successSound = new Sound('success.mp3', Sound.MAIN_BUNDLE, (error) => {
//           if (error) {
//             console.error('Error loading sound: ', error);
//             return;
//           }

//           successSound.play(() => successSound.release());
//         });
//       }

//       navigation.navigate('SuccessScreen', { levelNumber });
//     } else {
//       if (soundOn) {
//         const wrongAnswerSound = new Sound('wrong_answer.mp3', Sound.MAIN_BUNDLE, (error) => {
//           if (error) {
//             console.error('Error loading wrong answer sound: ', error);
//             return;
//           }

//           wrongAnswerSound.play(() => wrongAnswerSound.release());
//         });
//       }

//       setInputValue('');
//       setErrorMessage('Wrong. Try again.');

//       setTimeout(() => {
//         setErrorMessage(null);
//       }, 3000);
//     }

//     setInputValue('');
//   };


//   const nextLevel = () => {
//     // Assuming you have a way to determine the next level number, for example, incrementing by 1
//     const nextLevelNumber = levelNumber + 1;

//     fetch(`http://riddlexapi.pythonanywhere.com/api/levels/${nextLevelNumber}/`)
//       .then((response) => response.json())
//       .then((data) => {
//         setQuestion(data.math_question);
//         setAnswer(data.answer);
//       })
//       .catch((error) => console.error('Error fetching data:', error));

//     // Navigate to the SuccessScreen with the next level number
//     navigation.navigate('QuestionScreen', { levelNumber: nextLevelNumber });
//   };

//   const toggleSound = () => {
//     setSoundOn((prev) => !prev);
//   };

//   const handleWatchAdForHint = async() => {
//     try{
//         if (isAdLoaded) {
//       rewarded.show();
//     } else {
//       // Handle the scenario where the ad is not loaded
//       await rewarded.load();
//       Alert.alert("No Ad Available", "No ads are available at the moment. Please try again later.");
//     }
//     setWatchAdForHintModalVisible(false);
//     setHmodalVisible(true);
//   }catch (error) {
//       console.error("An error occurred:", error);
//       // Alert.alert("Error", "An unexpected error occurred. Please try again or check your internet connection.");
//       Alert.alert("No Ad Available", "No ads are available at the moment. Please try again later.");
//   };
//   }


//   const handleWatchAdForSolution = async() => {
//     // Add logic to show ad for solution
//     // For example, you can use a library like react-native-admob to show ads 
//     try{
//       if (isAdLoaded) {
//         rewardedInterstitial.show();
//       } else {
//         // Handle the scenario where the ad is not loaded
//         await rewardedInterstitial.load();
//         Alert.alert("No Ad Available", "Currently, there is no ad available. Please try again later.");
//       }
//       // After the ad is watched, you can set the state to show the solution modal
//       setWatchAdForSolutionModalVisible(false);
//       setModalVisible(true);
//     }catch (error) {
//       console.error("An error occurred:", error);
//       // Alert.alert("Error", "An unexpected error occurred. Please try again or check your internet connection.");
//       Alert.alert("No Ad Available", "No ads are available at the moment. Please try again later.");

//   };
// }

//   return (
//     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//       <View style={styles.container}>
//         <View style={styles.header}>
//           <TouchableOpacity
//             onPress={() => navigation.goBack()} // You can customize the back button behavior
//           >
//             <MaterialIcons name="keyboard-arrow-left" size={fs(4.2)} color="white" />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>Level {levelNumber}</Text>
//           <TouchableOpacity onPress={toggleSound}>
//             <MaterialIcons name={soundOn ? "volume-up" : "volume-off"} size={24} color="white" />
//           </TouchableOpacity>
//         </View>
//         {/* 70% of the screen for the question */}
//         {loading ? (
//           <View style={styles.loadingContainer}>
//             <ActivityIndicator size="large" color="#FFFFFF" />
//           </View>
//         ) : (
//           <View style={styles.questionContainer}>
//             {isImageQuestion ? (
//               <Image source={{ uri: question }} style={styles.imageQuestion} />
//             ) : (
//               <Text style={styles.question}>{question}</Text>
//             )}
//           </View>
//         )}
//         {errorMessage && (
//           <View style={styles.errorMessageContainer}>
//             <Text style={styles.errorMessageText}>{errorMessage}</Text>
//           </View>
//         )}

//         {/* 30% of the screen with three rows */}
//         <View style={styles.inputContainer}>
//           <View style={styles.row}>
//             <TextInput style={styles.input} placeholder="Answer" editable={false} value={inputValue} pointerEvents="none" placeholderTextColor="#FFFFFF" />
//             <TouchableOpacity style={styles.cancelButton} onPress={handleCancelPress}>
//               <MaterialIcons name="cancel" size={24} color="white" />
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.smallButton} onPress={() => setWatchAdForHintModalVisible(true)} >
//               <MaterialIcons name="help-outline" size={24} color="#FFFFFF" />
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.smallButton} onPress={() => setWatchAdForSolutionModalVisible(true)}>
//               <MaterialIcons name="lightbulb" size={24} color="white" />
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.enterButton} onPress={handleSubmit}>
//               <Text style={{ color: '#FFFFFF' }}>Enter</Text>
//             </TouchableOpacity>
//           </View>

//           <View style={styles.row}>
//             {[1, 2, 3, 4, 5].map((number) => (
//               <TouchableOpacity key={number} style={styles.numberButton} onPress={() => handleNumberPress(number)}>
//                 <Text style={{ color: 'white' }}>{number}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>

//           <View style={styles.row}>
//             {[6, 7, 8, 9, 0].map((number) => (
//               <TouchableOpacity key={number} style={styles.numberButton} onPress={() => handleNumberPress(number)}>
//                 <Text style={{ color: 'white' }}>{number}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>

//         <Modal
//           animationType="slide"
//           transparent={true}
//           visible={hmodalVisible}
//           onRequestClose={() => {
//             setHmodalVisible(!hmodalVisible);
//           }}
//         >
//           <View style={styles.modalContainer}>
//             <View style={styles.modalContent}>
//               <Text style={styles.modalTitle}>Hint</Text>
//               <Text style={{ color: 'black', marginBottom: 5 }}>{hint}</Text>
//               <TouchableOpacity onPress={htoggleModal} style={styles.gotItButton}>
//                 <Text style={styles.buttonText}>Got it. Close!</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </Modal>

//         <Modal
//           animationType="slide"
//           transparent={true}
//           visible={modalVisible}
//           onRequestClose={() => {
//             setModalVisible(!modalVisible);
//           }}
//         >
//           <View style={styles.modalContainer}>
//             <View style={styles.modalContent}>
//               <Text style={styles.modalTitle}>Solution</Text>
//               <Text style={{ color: 'black', marginBottom: 10 }}>{solution}</Text>
//               <TouchableOpacity onPress={toggleModal} style={styles.gotItButton}>
//                 <Text style={styles.buttonText}>Got it. Close!</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </Modal>

//         {/* Watch Ad for Hint Modal */}
//         <Modal
//           animationType="slide"
//           transparent={true}
//           visible={watchAdForHintModalVisible}
//           onRequestClose={() => setWatchAdForHintModalVisible(false)}
//         >
//           <View style={styles.modalContainer}>
//             <View style={styles.modalContent}>
//               <Text style={styles.modalTitle}>Watch Ad for Hint</Text>
//               {/* Add ad content and watch button */}
//               <TouchableOpacity onPress={handleWatchAdForHint} style={styles.gotItButton}>
//                 <Text style={styles.buttonText}>Watch Ad</Text>
//               </TouchableOpacity>
//               {/* Add a cancel button or other options */}
//               <TouchableOpacity onPress={() => setWatchAdForHintModalVisible(false)} style={styles.gotItButton}>
//                 <Text style={styles.buttonText}>Cancel</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </Modal>

//         {/* Watch Ad for Solution Modal */}
//         <Modal
//           animationType="slide"
//           transparent={true}
//           visible={watchAdForSolutionModalVisible}
//           onRequestClose={() => setWatchAdForSolutionModalVisible(false)}
//         >
//           <View style={styles.modalContainer}>
//             <View style={styles.modalContent}>
//               <Text style={styles.modalTitle}>Watch Ad for Solution</Text>
//               {/* Add ad content and watch button */}
//               <TouchableOpacity onPress={handleWatchAdForSolution} style={styles.gotItButton}>
//                 <Text style={styles.buttonText}>Watch Ad</Text>
//               </TouchableOpacity>
//               {/* Add a cancel button or other options */}
//               <TouchableOpacity onPress={() => setWatchAdForSolutionModalVisible(false)} style={styles.gotItButton}>
//                 <Text style={styles.buttonText}>Cancel</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </Modal>
//       </View>
//     </TouchableWithoutFeedback>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#555555',
//     paddingHorizontal: 5
//   },
//   questionContainer: {
//     flex: 0.7,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#333333',
//     borderWidth: hp(0.1),
//     borderColor: '#ccc'
//   },
//   question: {
//     fontSize: fs(3.6),
//     fontWeight: '100',
//     color: '#FFFFFF',
//   },
//   inputContainer: {
//     flex: 0.2,
//     paddingHorizontal: hp(0.1),
//     paddingTop: hp(1),
//     padding: hp(0.1),
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: hp(2),
//   },
//   input: {
//     flex: 0.48,
//     padding: wp(2),
//     color: '#FFFFFF',
//     width: wp(1),
//     borderWidth: hp(0.1),
//     backgroundColor: '#333333',
//     borderColor: '#ccc'
//   },
//   smallButton: {
//     flex: 0.2,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#333333',
//     marginRight: wp(1),
//     borderWidth: hp(0.1),
//     borderColor: '#ccc'
//   },
//   enterButton: {
//     flex: 0.2,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#333333',
//     color: 'white',
//     borderWidth: hp(0.1),
//     borderColor: '#ccc',
//     marginRight: wp(0),
//   },
//   numberButton: {
//     flex: 0.18,
//     height: hp(5),
//     width: hp(6),
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#333333',
//     color: 'white',
//     fontWeight: '100',
//     borderColor: '#ccc',
//     borderWidth: hp(0.1)
//   },
//   cancelButton: {
//     flex: 0.2,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#333333',
//     marginRight: 10,
//     borderWidth: hp(0.1),
//     borderColor: '#ccc',
//     marginLeft: wp(0.2)
//   },
//   errorMessageContainer: {
//     alignItems: 'center',
//     marginBottom: hp(0.1),
//     marginTop: hp(0.1)
//   },
//   errorMessageText: {
//     color: '#FFFFFF',
//     fontSize: fs(2),
//     fontWeight: '100'
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: hp(0.5),
//     justifyContent: 'space-between',
//     paddingHorizontal: 5,
//     backgroundColor: '#333333',
//     height: hp(6),
//     marginTop: hp(0.5),
//     borderWidth: hp(0.1),
//     borderColor: '#ccc'
//   },
//   headerTitle: {
//     fontSize: fs(2.8),
//     fontWeight: '100',
//     marginLeft: 8,
//     color: 'white'
//   },
//   loadingContainer: {
//     flex: 0.7,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   imageQuestion: {
//     width: hp(40),
//     height: hp(40), // Adjust the height as needed
//     resizeMode: 'cover',
//     marginBottom: 10,
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     padding: hp(2.5),
//     borderRadius: hp(1.2),
//     elevation: 5,
//     width: wp(80), // Set the width to cover 80% of the screen
//     maxHeight: hp(100), // Set the max height to cover 80% of the screen
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: '100',
//     marginBottom: 10,
//     color: 'black'
//   },
//   gotItButton: {
//     backgroundColor: '#333333',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//     marginTop: 10,
//     alignItems: 'center',
//     borderWidth: hp(0.1),
//     borderColor: '#ccc'
//   },
//   buttonText: {
//     color: '#FFFFFF',
//     fontSize: fs(2),
//     fontWeight: '100',
//   },
// });

// export default Questionscreen;

//**********old code its working perfectly fine */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert, ActivityIndicator, Image, Modal } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Sound from 'react-native-sound';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { responsiveFontSize as fs } from "react-native-responsive-dimensions";
import { RewardedAd, RewardedAdEventType, TestIds, BannerAd, BannerAdSize, RewardedInterstitialAd } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-2627956667785383/1872666477';
const adUnitId2 = __DEV__ ? TestIds.REWARDED_INTERSTITIAL : 'ca-app-pub-2627956667785383/6921813171';

const rewarded = RewardedAd.createForAdRequest(adUnitId, {
  keywords: ['fashion', 'clothing', 'Menswear', 'Womenswear', 'Streetwear'],
});

const rewardedInterstitial = RewardedInterstitialAd.createForAdRequest(adUnitId2, {
  keywords: ['fashion', 'clothing', 'Menswear', 'Womenswear', 'Streetwear'],
});

const Questionscreen = ({ route, navigation }) => {
  const { levelNumber } = route.params;
  const [question, setQuestion] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [answer, setAnswer] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [soundOn, setSoundOn] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isImageQuestion, setIsImageQuestion] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [hmodalVisible, setHmodalVisible] = useState(false);
  const [hint, setHint] = useState('');
  const [solution, setSolution] = useState('');
  const [watchAdForHintModalVisible, setWatchAdForHintModalVisible] = useState(false);
  const [watchAdForSolutionModalVisible, setWatchAdForSolutionModalVisible] = useState(false);
  const [isAdLoaded, setIsAdLoaded] = useState(false);

  useEffect(() => {
    fetch(`https://riddlexapi.pythonanywhere.com/api/levels/${levelNumber}/`)
      .then(response => response.json())
      .then(data => {
        setQuestion(data.image_question || data.math_question);
        setIsImageQuestion(!!data.image_question);
        setAnswer(data.answer);
        setHint(data.hint);
        setSolution(data.solution);
        setLoading(false);
      })
      .catch(error => console.error('Error:', error));
  }, [levelNumber]);

  useEffect(() => {
    const loadAds = async () => {
      const adLoadTimeout = setTimeout(() => {
        if (!isAdLoaded) {
          console.log("Ad load timeout");
          setIsAdLoaded(true);
        }
      }, 4000);

      const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
        setIsAdLoaded(true);
      });
      const unsubscribeEarned = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {});

      rewarded.load();

      return () => {
        clearTimeout(adLoadTimeout);
        unsubscribeLoaded();
        unsubscribeEarned();
      };
    };

    loadAds();
  }, []);

  useEffect(() => {
    const loadInterstitialAds = async () => {
      const adLoadTimeout = setTimeout(() => {
        if (!isAdLoaded) {
          console.log("Ad load timeout");
          setIsAdLoaded(true);
        }
      }, 4000);

      const unsubscribeLoaded = rewardedInterstitial.addAdEventListener(RewardedAdEventType.LOADED, () => {
        setIsAdLoaded(true);
      });
      const unsubscribeEarned = rewardedInterstitial.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {});

      rewardedInterstitial.load();

      return () => {
        clearTimeout(adLoadTimeout);
        unsubscribeLoaded();
        unsubscribeEarned();
      };
    };

    loadInterstitialAds();
  }, []);

  const playSound = (soundFile) => {
    if (soundOn) {
      const sound = new Sound(soundFile, Sound.MAIN_BUNDLE, (error) => {
        if (!error) sound.play(() => sound.release());
      });
    }
  };

  const handleSubmit = () => {
    if (!inputValue.trim()) {
      setErrorMessage('Please fill in the answer.');
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    if (inputValue === answer.toString()) {
      playSound('success.mp3');
      navigation.navigate('SuccessScreen', { levelNumber });
      setInputValue('');
    } else {
      playSound('wrong_answer.mp3');
      setInputValue('');
      setErrorMessage('Wrong. Try again.');
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  const handleWatchAdForHint = async () => {
    try {
      if (isAdLoaded) {
        rewarded.show();
        setWatchAdForHintModalVisible(false);
        setHmodalVisible(true);
      } else {
        await rewarded.load();
        Alert.alert("No Ad Available", "Please try again later.");
      }
    } catch (error) {
      Alert.alert("No Ad Available", "Please try again later.");
    }
  };

  const handleWatchAdForSolution = async () => {
    try {
      if (isAdLoaded) {
        rewardedInterstitial.show();
        setWatchAdForSolutionModalVisible(false);
        setModalVisible(true);
      } else {
        await rewardedInterstitial.load();
        Alert.alert("No Ad Available", "Please try again later.");
      }
    } catch (error) {
      Alert.alert("No Ad Available", "Please try again later.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="keyboard-arrow-left" size={fs(4)} color="#ECF0F1" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Level {levelNumber}</Text>
          <TouchableOpacity onPress={() => setSoundOn(!soundOn)}>
            <MaterialIcons name={soundOn ? "volume-up" : "volume-off"} size={fs(3)} color="#ECF0F1" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4ECDC4" />
          </View>
        ) : (
          <View style={styles.questionContainer}>
            {isImageQuestion ? (
              <Image source={{ uri: question }} style={styles.imageQuestion} resizeMode="contain" />
            ) : (
              <Text style={styles.question}>{question}</Text>
            )}
          </View>
        )}

        {errorMessage && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={inputValue}
              editable={false}
              placeholder="Answer"
              placeholderTextColor="#BDC3C7"
            />
            <TouchableOpacity style={styles.actionButton} onPress={() => setInputValue('')}>
              <MaterialIcons name="cancel" size={fs(2.5)} color="#ECF0F1" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => setWatchAdForHintModalVisible(true)}>
              <MaterialIcons name="help-outline" size={fs(2.5)} color="#ECF0F1" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => setWatchAdForSolutionModalVisible(true)}>
              <MaterialIcons name="lightbulb" size={fs(2.5)} color="#ECF0F1" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitText}>Enter</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.keypadContainer}>
            {[1, 2, 3, 4, 5].map(num => (
              <TouchableOpacity
                key={num}
                style={styles.keypadButton}
                onPress={() => setInputValue(prev => prev + num)}
              >
                <Text style={styles.keypadText}>{num}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.keypadContainer}>
            {[6, 7, 8, 9, 0].map(num => (
              <TouchableOpacity
                key={num}
                style={styles.keypadButton}
                onPress={() => setInputValue(prev => prev + num)}
              >
                <Text style={styles.keypadText}>{num}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Modal
          animationType="slide"
          transparent
          visible={hmodalVisible}
          onRequestClose={() => setHmodalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Hint</Text>
              <Text style={styles.modalText}>{hint}</Text>
              <TouchableOpacity style={styles.modalButton} onPress={() => setHmodalVisible(false)}>
                <Text style={styles.modalButtonText}>Got it</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Solution</Text>
              <Text style={styles.modalText}>{solution}</Text>
              <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Got it</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent
          visible={watchAdForHintModalVisible}
          onRequestClose={() => setWatchAdForHintModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Watch Ad for Hint</Text>
              <TouchableOpacity style={styles.modalButton} onPress={handleWatchAdForHint}>
                <Text style={styles.modalButtonText}>Watch Ad</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setWatchAdForHintModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent
          visible={watchAdForSolutionModalVisible}
          onRequestClose={() => setWatchAdForSolutionModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Watch Ad for Solution</Text>
              <TouchableOpacity style={styles.modalButton} onPress={handleWatchAdForSolution}>
                <Text style={styles.modalButtonText}>Watch Ad</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setWatchAdForSolutionModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
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
    backgroundColor: '#2C3E50',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: hp(2),
    backgroundColor: '#34495E',
    borderBottomWidth: 1,
    borderBottomColor: '#3B536F',
  },
  headerTitle: {
    fontSize: fs(3),
    color: '#ECF0F1',
    fontWeight: '700',
  },
  questionContainer: {
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#34495E',
    margin: hp(2),
    borderRadius: hp(2),
    padding: hp(2),
  },
  question: {
    fontSize: fs(3.2),
    color: '#ECF0F1',
    textAlign: 'center',
  },
  imageQuestion: {
    width: wp(80),
    height: hp(40),
    borderRadius: hp(1),
  },
  loadingContainer: {
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    alignItems: 'center',
    padding: hp(1),
  },
  errorText: {
    color: '#E74C3C',
    fontSize: fs(2),
  },
  inputContainer: {
    padding: hp(2),
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  input: {
    flex: 0.4,
    backgroundColor: '#34495E',
    color: '#ECF0F1',
    padding: hp(1.5),
    borderRadius: hp(1),
    marginRight: wp(2),
  },
  actionButton: {
    backgroundColor: '#34495E',
    padding: hp(1.5),
    borderRadius: hp(1),
    marginRight: wp(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {
    backgroundColor: '#4ECDC4',
    padding: hp(1.5),
    borderRadius: hp(1),
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.75,
},
submitText: {
    color: '#ECF0F1',
    fontSize: fs(2),
    fontWeight: '600'
},
keypadContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(1)
},
keypadButton: {
    backgroundColor: '#34495E',
    width: wp(15),
    height: wp(15),
    borderRadius: wp(7.5),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp(1)
},
keypadText: {
    color: '#ECF0F1',
    fontSize: fs(3),
    fontWeight: '600'
},
modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
},
modalContent: {
    backgroundColor: '#34495E',
    padding: hp(3),
    borderRadius: hp(2),
    width: wp(80)
},
modalTitle: {
    color: '#ECF0F1',
    fontSize: fs(2.5),
    fontWeight: '600',
    marginBottom: hp(2),
    textAlign: 'center'
},
modalText: {
    color: '#ECF0F1',
    fontSize: fs(2),
    marginBottom: hp(2),
    textAlign: 'center'
},
modalButton: {
    backgroundColor: '#4ECDC4',
    padding: hp(1.5),
    borderRadius: hp(1),
    alignItems: 'center',
    marginBottom: hp(1)
},
modalButtonText: {
    color: '#ECF0F1',
    fontSize: fs(2),
    fontWeight: '600'
},
cancelButton: {
    backgroundColor: '#E74C3C'
}
});

export default Questionscreen;