import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { responsiveFontSize as fs } from "react-native-responsive-dimensions";
import AsyncStorage from '@react-native-async-storage/async-storage';

const MixedScreen = ({ navigation }) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [problem, setProblem] = useState(null);
  const [animation] = useState(new Animated.Value(1));
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [showResult, setShowResult] = useState(false);
  const [resultMessage, setResultMessage] = useState('');

  const generateProblem = useCallback(() => {
    const operations = ['+', '-', '×', '÷'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    let num1, num2, answer;

    // Adjust difficulty based on current level
    const maxNum = Math.min(12 * currentLevel, 50);

    switch (operation) {
      case '+':
        num1 = Math.floor(Math.random() * maxNum) + 1;
        num2 = Math.floor(Math.random() * maxNum) + 1;
        answer = num1 + num2;
        break;
      case '-':
        num1 = Math.floor(Math.random() * maxNum) + 1;
        num2 = Math.floor(Math.random() * num1) + 1;
        answer = num1 - num2;
        break;
      case '×':
        num1 = Math.floor(Math.random() * (maxNum / 2)) + 1;
        num2 = Math.floor(Math.random() * (maxNum / 2)) + 1;
        answer = num1 * num2;
        break;
      case '÷':
        num2 = Math.floor(Math.random() * (maxNum / 4)) + 1;
        answer = Math.floor(Math.random() * (maxNum / 4)) + 1;
        num1 = num2 * answer;
        break;
    }

    // Generate wrong answers based on common mistakes
    const wrongAnswers = [
      answer + Math.floor(Math.random() * (maxNum / 4)) + 1,
      answer - Math.floor(Math.random() * (maxNum / 4)) - 1,
      operation === '×' ? num1 + num2 : answer + Math.floor(Math.random() * maxNum) + 1,
    ];

    const options = [...wrongAnswers, answer].sort(() => Math.random() - 0.5);

    return {
      num1,
      num2,
      operation,
      answer,
      options,
    };
  }, [currentLevel]);

  useEffect(() => {
    setProblem(generateProblem());
  }, [generateProblem, currentLevel]);

  const handleAnswer = useCallback((selectedAnswer) => {
    const isCorrect = selectedAnswer === problem.answer;

    // Animate the problem container
    Animated.sequence([
      Animated.timing(animation, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setShowResult(true);
    
    if (isCorrect) {
      setScore(prev => prev + (10 * currentLevel));
      setStreak(prev => prev + 1);
      setResultMessage('Correct! 🎉');
      
      // Level up logic
      if (streak > 0 && streak % 5 === 0) {
        setCurrentLevel(prev => Math.min(prev + 1, 10));
        Alert.alert('Level Up! 🌟', `You've reached level ${currentLevel + 1}!`);
      }
    } else {
      setLives(prev => prev - 1);
      setStreak(0);
      setResultMessage('Wrong! Try again 😔');

      if (lives <= 1) {
        handleGameOver();
        return;
      }
    }

    // Hide result message after 1 second
    setTimeout(() => {
      setShowResult(false);
      setProblem(generateProblem());
    }, 1000);
  }, [problem, currentLevel, streak, lives, animation, generateProblem]);

  const handleGameOver = async () => {
    try {
      const highScore = await AsyncStorage.getItem('mixedHighScore');
      if (!highScore || score > parseInt(highScore)) {
        await AsyncStorage.setItem('mixedHighScore', score.toString());
        Alert.alert('Game Over! 🎮', `New High Score: ${score}!`);
      } else {
        Alert.alert('Game Over! 🎮', `Score: ${score}\nHigh Score: ${highScore}`);
      }
      
      // Reset game
      setLives(3);
      setScore(0);
      setStreak(0);
      setCurrentLevel(1);
      setProblem(generateProblem());
    } catch (error) {
      console.error('Error saving score:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={hp(4)} color="#ECF0F1" />
        </TouchableOpacity>
        <Text style={styles.title}>Mixed Operations</Text>
      </View>

      <View style={styles.statusBar}>
        <View style={styles.statusItem}>
          <Icon name="star" size={hp(3)} color="#F1C40F" />
          <Text style={styles.statusText}>Level {currentLevel}</Text>
        </View>
        <View style={styles.statusItem}>
          <Icon name="favorite" size={hp(3)} color="#E74C3C" />
          <Text style={styles.statusText}>×{lives}</Text>
        </View>
        <View style={styles.statusItem}>
          <Icon name="flash-on" size={hp(3)} color="#F39C12" />
          <Text style={styles.statusText}>×{streak}</Text>
        </View>
      </View>

      <Text style={styles.scoreText}>Score: {score}</Text>

      <Animated.View style={[styles.problemContainer, { transform: [{ scale: animation }] }]}>
        <Text style={styles.problemText}>
          {problem?.num1} {problem?.operation} {problem?.num2}
        </Text>
      </Animated.View>

      {showResult && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>{resultMessage}</Text>
        </View>
      )}

      <View style={styles.optionsContainer}>
        {problem?.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.optionButton}
            onPress={() => handleAnswer(option)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
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
  },
  title: {
    fontSize: fs(3),
    color: '#ECF0F1',
    marginLeft: wp(4),
    fontWeight: '600',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: hp(2),
    backgroundColor: '#34495E',
    marginTop: hp(1),
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    color: '#ECF0F1',
    fontSize: fs(2),
    marginLeft: wp(1),
    fontWeight: '600',
  },
  scoreText: {
    fontSize: fs(4),
    color: '#2ECC71',
    textAlign: 'center',
    marginTop: hp(2),
    fontWeight: 'bold',
  },
  problemContainer: {
    backgroundColor: '#34495E',
    margin: hp(2),
    padding: hp(4),
    borderRadius: hp(2),
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  problemText: {
    fontSize: fs(6),
    color: '#ECF0F1',
    fontWeight: 'bold',
  },
  resultContainer: {
    alignItems: 'center',
    marginVertical: hp(2),
  },
  resultText: {
    fontSize: fs(3),
    color: '#ECF0F1',
    fontWeight: '600',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: hp(2),
  },
  optionButton: {
    backgroundColor: '#3498DB',
    width: wp(40),
    padding: hp(2),
    margin: hp(1),
    borderRadius: hp(1),
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  optionText: {
    fontSize: fs(3),
    color: '#ECF0F1',
    fontWeight: '600',
  },
});

export default MixedScreen;