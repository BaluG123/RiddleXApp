import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert, ActivityIndicator, Image, Modal } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Sound from 'react-native-sound';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { responsiveFontSize as fs } from "react-native-responsive-dimensions";
import { getAnswerFeedback } from '../util/answerValidator';
import apiClient from '../util/apiClient';
import adManager from '../util/adManager';
import storageManager from '../util/storageManager';

const Questionscreen = ({ route, navigation }) => {
  const { levelNumber } = route.params;
  const [question, setQuestion] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [answer, setAnswer] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorType, setErrorType] = useState(null); // 'error' or 'success'
  const [soundOn, setSoundOn] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isImageQuestion, setIsImageQuestion] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [hmodalVisible, setHmodalVisible] = useState(false);
  const [hint, setHint] = useState('');
  const [solution, setSolution] = useState('');
  const [watchAdForHintModalVisible, setWatchAdForHintModalVisible] = useState(false);
  const [watchAdForSolutionModalVisible, setWatchAdForSolutionModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const errorTimeoutRef = useRef(null);

  // Load question data
  useEffect(() => {
    const loadQuestion = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getQuestion(levelNumber);
        setQuestion(data.image_question || data.math_question);
        setIsImageQuestion(!!data.image_question);
        setAnswer(data.answer);
        setHint(data.hint || 'No hint available');
        setSolution(data.solution || 'No solution available');
      } catch (error) {
        Alert.alert(
          'Error Loading Question',
          error.message || 'Failed to load the question. Please check your internet connection.',
          [
            { text: 'Retry', onPress: () => loadQuestion() },
            { text: 'Go Back', onPress: () => navigation.goBack() }
          ]
        );
      } finally {
        setLoading(false);
      }
    };

    loadQuestion();
  }, [levelNumber]);

  // Initialize ads
  useEffect(() => {
    adManager.initializeAds();
    return () => adManager.cleanup();
  }, []);

  // Load sound preference
  useEffect(() => {
    const loadSoundPreference = async () => {
      const enabled = await storageManager.isSoundEnabled();
      setSoundOn(enabled);
    };
    loadSoundPreference();
  }, []);

  const playSound = (soundFile) => {
    if (soundOn) {
      try {
        const sound = new Sound(soundFile, Sound.MAIN_BUNDLE, (error) => {
          if (error) {
            console.warn('Sound error:', error);
            return;
          }
          sound.play(() => sound.release());
        });
      } catch (error) {
        console.warn('Error playing sound:', error);
      }
    }
  };

  const showErrorMessage = (message, type = 'error') => {
    setErrorMessage(message);
    setErrorType(type);
    
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }
    
    errorTimeoutRef.current = setTimeout(() => {
      setErrorMessage(null);
      setErrorType(null);
    }, 4000);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!inputValue.trim()) {
      showErrorMessage('Please enter an answer.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const feedback = getAnswerFeedback(inputValue, answer);

      if (feedback.isCorrect) {
        playSound('success.mp3');
        await storageManager.setCompletedLevel(levelNumber);
        await storageManager.setCurrentLevel(levelNumber + 1);
        
        // Navigate to success screen after a brief delay
        setTimeout(() => {
          navigation.navigate('SuccessScreen', { levelNumber });
        }, 500);
      } else {
        playSound('wrong_answer.mp3');
        showErrorMessage(feedback.message, 'error');
        setInputValue('');
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      showErrorMessage('An error occurred. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWatchAdForHint = async () => {
    try {
      const adShown = await adManager.showRewardedAdForHint();
      if (adShown) {
        setWatchAdForHintModalVisible(false);
        setHmodalVisible(true);
      } else {
        Alert.alert(
          'Ad Not Available',
          'No ads are available right now. Please try again in a moment.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error showing hint ad:', error);
      Alert.alert('Error', 'Failed to load ad. Please try again.');
    }
  };

  const handleWatchAdForSolution = async () => {
    try {
      const adShown = await adManager.showRewardedInterstitialAdForSolution();
      if (adShown) {
        setWatchAdForSolutionModalVisible(false);
        setModalVisible(true);
      } else {
        Alert.alert(
          'Ad Not Available',
          'No ads are available right now. Please try again in a moment.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error showing solution ad:', error);
      Alert.alert('Error', 'Failed to load ad. Please try again.');
    }
  };

  const toggleSound = async () => {
    const newState = !soundOn;
    setSoundOn(newState);
    await storageManager.setSoundEnabled(newState);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="keyboard-arrow-left" size={fs(4)} color="#ECF0F1" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Level {levelNumber}</Text>
          <TouchableOpacity onPress={toggleSound}>
            <MaterialIcons name={soundOn ? "volume-up" : "volume-off"} size={fs(3)} color="#ECF0F1" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4ECDC4" />
            <Text style={styles.loadingText}>Loading question...</Text>
          </View>
        ) : (
          <View style={styles.questionContainer}>
            {isImageQuestion && question ? (
              <Image 
                source={{ uri: question }} 
                style={styles.imageQuestion} 
                resizeMode="contain"
                onError={(error) => {
                  console.warn('Image load error:', error);
                  setIsImageQuestion(false);
                }}
              />
            ) : (
              <Text style={styles.question}>{question || 'Loading...'}</Text>
            )}
          </View>
        )}

        {errorMessage && (
          <View style={[styles.errorContainer, { backgroundColor: errorType === 'error' ? '#E74C3C' : '#27AE60' }]}>
            <MaterialIcons 
              name={errorType === 'error' ? 'error-outline' : 'check-circle'} 
              size={fs(2.5)} 
              color="#ECF0F1" 
              style={{ marginRight: wp(2) }}
            />
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
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => setInputValue('')}
              disabled={isSubmitting}
            >
              <MaterialIcons name="cancel" size={fs(2.5)} color="#ECF0F1" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => setWatchAdForHintModalVisible(true)}
              disabled={isSubmitting}
            >
              <MaterialIcons name="help-outline" size={fs(2.5)} color="#ECF0F1" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => setWatchAdForSolutionModalVisible(true)}
              disabled={isSubmitting}
            >
              <MaterialIcons name="lightbulb" size={fs(2.5)} color="#ECF0F1" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]} 
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.submitText}>{isSubmitting ? '...' : 'Enter'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.keypadContainer}>
            {[1, 2, 3, 4, 5].map(num => (
              <TouchableOpacity
                key={num}
                style={styles.keypadButton}
                onPress={() => setInputValue(prev => prev + num)}
                disabled={isSubmitting}
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
                disabled={isSubmitting}
              >
                <Text style={styles.keypadText}>{num}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.keypadContainer}>
            <TouchableOpacity
              style={[styles.keypadButton, styles.specialButton]}
              onPress={() => setInputValue(prev => prev.slice(0, -1))}
              disabled={isSubmitting}
            >
              <MaterialIcons name="backspace" size={fs(2.5)} color="#ECF0F1" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.keypadButton, styles.specialButton]}
              onPress={() => setInputValue(prev => prev + '.')}
              disabled={isSubmitting}
            >
              <Text style={styles.keypadText}>.</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.keypadButton, styles.specialButton]}
              onPress={() => setInputValue(prev => prev + '-')}
              disabled={isSubmitting}
            >
              <Text style={styles.keypadText}>-</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Hint Modal */}
        <Modal
          animationType="slide"
          transparent
          visible={hmodalVisible}
          onRequestClose={() => setHmodalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <MaterialIcons name="help-outline" size={fs(3)} color="#4ECDC4" />
                <Text style={styles.modalTitle}>Hint</Text>
              </View>
              <Text style={styles.modalText}>{hint}</Text>
              <TouchableOpacity style={styles.modalButton} onPress={() => setHmodalVisible(false)}>
                <Text style={styles.modalButtonText}>Got it</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Solution Modal */}
        <Modal
          animationType="slide"
          transparent
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <MaterialIcons name="lightbulb" size={fs(3)} color="#F39C12" />
                <Text style={styles.modalTitle}>Solution</Text>
              </View>
              <Text style={styles.modalText}>{solution}</Text>
              <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Got it</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Watch Ad for Hint Modal */}
        <Modal
          animationType="slide"
          transparent
          visible={watchAdForHintModalVisible}
          onRequestClose={() => setWatchAdForHintModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Get a Hint</Text>
              <Text style={styles.modalText}>Watch a quick ad to unlock a helpful hint!</Text>
              <TouchableOpacity style={styles.modalButton} onPress={handleWatchAdForHint}>
                <MaterialIcons name="play-circle-filled" size={fs(2)} color="#ECF0F1" style={{ marginRight: wp(2) }} />
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

        {/* Watch Ad for Solution Modal */}
        <Modal
          animationType="slide"
          transparent
          visible={watchAdForSolutionModalVisible}
          onRequestClose={() => setWatchAdForSolutionModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>View Solution</Text>
              <Text style={styles.modalText}>Watch an ad to see the complete solution!</Text>
              <TouchableOpacity style={styles.modalButton} onPress={handleWatchAdForSolution}>
                <MaterialIcons name="play-circle-filled" size={fs(2)} color="#ECF0F1" style={{ marginRight: wp(2) }} />
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
    borderBottomWidth: 2,
    borderBottomColor: '#4ECDC4',
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
    borderWidth: 2,
    borderColor: '#4ECDC4',
  },
  question: {
    fontSize: fs(3.2),
    color: '#ECF0F1',
    textAlign: 'center',
    fontWeight: '500',
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
  loadingText: {
    color: '#ECF0F1',
    fontSize: fs(2),
    marginTop: hp(2),
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: hp(1.5),
    marginHorizontal: hp(2),
    marginBottom: hp(1),
    borderRadius: hp(1),
  },
  errorText: {
    color: '#ECF0F1',
    fontSize: fs(2),
    flex: 1,
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
    borderWidth: 1,
    borderColor: '#4ECDC4',
  },
  actionButton: {
    backgroundColor: '#34495E',
    padding: hp(1.5),
    borderRadius: hp(1),
    marginRight: wp(2),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#4ECDC4',
  },
  submitButton: {
    backgroundColor: '#4ECDC4',
    padding: hp(1.5),
    borderRadius: hp(1),
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.75,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: '#2C3E50',
    fontSize: fs(2),
    fontWeight: '700',
  },
  keypadContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(1),
  },
  keypadButton: {
    backgroundColor: '#34495E',
    width: wp(15),
    height: wp(15),
    borderRadius: wp(7.5),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp(1),
    borderWidth: 1,
    borderColor: '#4ECDC4',
  },
  specialButton: {
    backgroundColor: '#4ECDC4',
  },
  keypadText: {
    color: '#ECF0F1',
    fontSize: fs(3),
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#34495E',
    padding: hp(3),
    borderRadius: hp(2),
    width: wp(85),
    borderWidth: 2,
    borderColor: '#4ECDC4',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  modalTitle: {
    color: '#ECF0F1',
    fontSize: fs(2.8),
    fontWeight: '700',
    marginLeft: wp(3),
  },
  modalText: {
    color: '#ECF0F1',
    fontSize: fs(2.2),
    marginBottom: hp(2),
    textAlign: 'center',
    lineHeight: fs(3),
  },
  modalButton: {
    backgroundColor: '#4ECDC4',
    padding: hp(1.5),
    borderRadius: hp(1),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(1),
    flexDirection: 'row',
  },
  modalButtonText: {
    color: '#2C3E50',
    fontSize: fs(2.2),
    fontWeight: '700',
  },
  cancelButton: {
    backgroundColor: '#E74C3C',
  },
});

export default Questionscreen;