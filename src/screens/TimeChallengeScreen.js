import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { responsiveFontSize as fs } from "react-native-responsive-dimensions";
import AsyncStorage from '@react-native-async-storage/async-storage';

const TimeChallengeScreen = ({ navigation }) => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [currentProblem, setCurrentProblem] = useState(null);
  const [animation] = useState(new Animated.Value(1));
  const [gameActive, setGameActive] = useState(false);
  const [highScore, setHighScore] = useState(0);

  const generateProblem = useCallback(() => {
    const operations = ['+', '-', 'x', '÷'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    let num1, num2, answer;

    switch (operation) {
      case '+':
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        answer = num1 + num2;
        break;
      case '-':
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * num1) + 1;
        answer = num1 - num2;
        break;
      case 'x':
        num1 = Math.floor(Math.random() * 12) + 1;
        num2 = Math.floor(Math.random() * 12) + 1;
        answer = num1 * num2;
        break;
      case '÷':
        num2 = Math.floor(Math.random() * 12) + 1;
        answer = Math.floor(Math.random() * 12) + 1;
        num1 = num2 * answer;
        break;
    }

    const wrongAnswers = [
      answer + Math.floor(Math.random() * 5) + 1,
      answer - Math.floor(Math.random() * 5) - 1,
      answer + Math.floor(Math.random() * 10) + 5,
    ];

    const options = [...wrongAnswers, answer].sort(() => Math.random() - 0.5);

    return {
      num1,
      num2,
      operation,
      answer,
      options,
    };
  }, []);

  const startGame = useCallback(async () => {
    setGameActive(true);
    setTimeLeft(60);
    setScore(0);
    setCurrentProblem(generateProblem());
    const savedHighScore = await AsyncStorage.getItem('timeHighScore');
    if (savedHighScore) setHighScore(parseInt(savedHighScore));
  }, [generateProblem]);

  const handleAnswer = useCallback((selectedAnswer) => {
    if (!gameActive) return;

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

    if (selectedAnswer === currentProblem.answer) {
      setScore(prev => prev + 1);
    }
    setCurrentProblem(generateProblem());
  }, [currentProblem, gameActive, generateProblem, animation]);

  useEffect(() => {
    let timer;
    if (gameActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setGameActive(false);
      if (score > highScore) {
        AsyncStorage.setItem('timeHighScore', score.toString());
        setHighScore(score);
        Alert.alert('New High Score!', `Congratulations! You scored ${score} points!`);
      }
    }
    return () => clearInterval(timer);
  }, [timeLeft, gameActive, score, highScore]);

  if (!gameActive) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={hp(4)} color="#ECF0F1" />
          </TouchableOpacity>
          <Text style={styles.title}>Time Challenge</Text>
        </View>
        <View style={styles.startContainer}>
          <Text style={styles.highScoreText}>High Score: {highScore}</Text>
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>Start Challenge</Text>
          </TouchableOpacity>
          <Text style={styles.instructionText}>
            Solve as many problems as you can in 60 seconds!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={hp(4)} color="#ECF0F1" />
        </TouchableOpacity>
        <Text style={styles.title}>Time Challenge</Text>
      </View>
      
      <View style={styles.scoreContainer}>
        <Text style={styles.timeText}>{timeLeft}s</Text>
        <Text style={styles.scoreText}>Score: {score}</Text>
      </View>

      <Animated.View style={[styles.problemContainer, { transform: [{ scale: animation }] }]}>
        <Text style={styles.problemText}>
          {currentProblem?.num1} {currentProblem?.operation} {currentProblem?.num2}
        </Text>
      </Animated.View>

      <View style={styles.optionsContainer}>
        {currentProblem?.options.map((option, index) => (
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
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: hp(2),
    backgroundColor: '#34495E',
    marginTop: hp(1),
  },
  timeText: {
    fontSize: fs(4),
    color: '#E74C3C',
    fontWeight: 'bold',
  },
  scoreText: {
    fontSize: fs(4),
    color: '#2ECC71',
    fontWeight: 'bold',
  },
  problemContainer: {
    backgroundColor: '#34495E',
    margin: hp(2),
    padding: hp(4),
    borderRadius: hp(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  problemText: {
    fontSize: fs(6),
    color: '#ECF0F1',
    fontWeight: 'bold',
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
  },
  optionText: {
    fontSize: fs(3),
    color: '#ECF0F1',
    fontWeight: '600',
  },
  startContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#2ECC71',
    padding: hp(2),
    borderRadius: hp(1),
    width: wp(80),
    alignItems: 'center',
    marginVertical: hp(2),
  },
  startButtonText: {
    fontSize: fs(3),
    color: '#ECF0F1',
    fontWeight: '600',
  },
  highScoreText: {
    fontSize: fs(4),
    color: '#F1C40F',
    fontWeight: '600',
    marginBottom: hp(2),
  },
  instructionText: {
    fontSize: fs(2),
    color: '#BDC3C7',
    textAlign: 'center',
    marginTop: hp(2),
    paddingHorizontal: wp(10),
  },
});

export default TimeChallengeScreen;