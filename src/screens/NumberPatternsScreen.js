import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { responsiveFontSize as fs } from "react-native-responsive-dimensions";
import AsyncStorage from '@react-native-async-storage/async-storage';

const NumberPatternsScreen = ({ navigation }) => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [problem, setProblem] = useState(null);
  const [animation] = useState(new Animated.Value(1));
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const patternTypes = [
    'arithmetic',
    'geometric',
    'fibonacci',
    'squareNumbers',
    'primeNumbers',
    'alternating'
  ];

  const loadStats = async () => {
    try {
      const stats = await AsyncStorage.getItem('numberPatternsStats');
      if (stats) {
        const parsedStats = JSON.parse(stats);
        setHighScore(parsedStats.highScore || 0);
        setTotalAttempts(parsedStats.totalAttempts || 0);
        setCorrectAnswers(parsedStats.correctAnswers || 0);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  useEffect(() => {
    loadStats();
    generateProblem();
  }, []);

  const saveStats = async (newScore, isCorrect) => {
    try {
      const newHighScore = Math.max(newScore, highScore);
      const newStats = {
        highScore: newHighScore,
        totalAttempts: totalAttempts + 1,
        correctAnswers: correctAnswers + (isCorrect ? 1 : 0),
        lastPlayed: new Date().toISOString(),
      };

      await AsyncStorage.setItem('numberPatternsStats', JSON.stringify(newStats));
      setHighScore(newHighScore);
      setTotalAttempts(newStats.totalAttempts);
      setCorrectAnswers(newStats.correctAnswers);

      // Update global stats
      const globalStats = await AsyncStorage.getItem('mathStats');
      const parsedGlobalStats = globalStats ? JSON.parse(globalStats) : {
        categoryPerformance: {
          addition: { correct: 0, total: 0 },
          subtraction: { correct: 0, total: 0 },
          multiplication: { correct: 0, total: 0 },
          division: { correct: 0, total: 0 },
          algebra: { correct: 0, total: 0 },
          numberPatterns: { correct: 0, total: 0 },
        },
        recentScores: [],
      };

      parsedGlobalStats.categoryPerformance.numberPatterns = parsedGlobalStats.categoryPerformance.numberPatterns || { correct: 0, total: 0 };
      parsedGlobalStats.categoryPerformance.numberPatterns.total += 1;
      if (isCorrect) {
        parsedGlobalStats.categoryPerformance.numberPatterns.correct += 1;
      }

      parsedGlobalStats.recentScores = [
        newScore,
        ...(parsedGlobalStats.recentScores || []).slice(0, 9)
      ];

      await AsyncStorage.setItem('mathStats', JSON.stringify(parsedGlobalStats));
    } catch (error) {
      console.error('Error saving stats:', error);
    }
  };

  const generateProblem = () => {
    const type = patternTypes[Math.floor(Math.random() * patternTypes.length)];
    let sequence = [];
    let correctAnswer;
    let options = [];
    let question;

    const generateWrongAnswer = (correct, variance = 2) => {
      const offset = Math.floor(Math.random() * variance) + 1;
      return Math.random() > 0.5 ? correct + offset : correct - offset;
    };

    switch (type) {
      case 'arithmetic': {
        const start = Math.floor(Math.random() * 20) + 1;
        const difference = Math.floor(Math.random() * 5) + 1;
        sequence = Array.from({ length: 4 }, (_, i) => start + i * difference);
        correctAnswer = sequence[3] + difference;
        question = `${sequence.join(', ')}, ___?`;
        options = [
          correctAnswer,
          generateWrongAnswer(correctAnswer),
          sequence[3] + difference * 2,
          correctAnswer - difference
        ];
        break;
      }

      case 'geometric': {
        const start = Math.floor(Math.random() * 5) + 1;
        const ratio = Math.floor(Math.random() * 3) + 2;
        sequence = Array.from({ length: 4 }, (_, i) => start * Math.pow(ratio, i));
        correctAnswer = sequence[3] * ratio;
        question = `${sequence.join(', ')}, ___?`;
        options = [
          correctAnswer,
          generateWrongAnswer(correctAnswer, 5),
          sequence[3] + (sequence[3] - sequence[2]),
          Math.pow(sequence[3], 2)
        ];
        break;
      }

      case 'fibonacci': {
        const start1 = Math.floor(Math.random() * 5) + 1;
        const start2 = Math.floor(Math.random() * 5) + 1;
        sequence = [start1, start2, start1 + start2, start1 + start2 * 2];
        correctAnswer = sequence[2] + sequence[3];
        question = `${sequence.join(', ')}, ___?`;
        options = [
          correctAnswer,
          sequence[3] * 2,
          sequence[3] + sequence[0],
          generateWrongAnswer(correctAnswer, 3)
        ];
        break;
      }

      case 'squareNumbers': {
        const start = Math.floor(Math.random() * 5) + 2;
        sequence = Array.from({ length: 4 }, (_, i) => Math.pow(start + i, 2));
        correctAnswer = Math.pow(start + 4, 2);
        question = `${sequence.join(', ')}, ___?`;
        options = [
          correctAnswer,
          Math.pow(start + 4, 2) + start,
          (start + 4) * 2,
          generateWrongAnswer(correctAnswer, 5)
        ];
        break;
      }

      case 'primeNumbers': {
        const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
        const startIndex = Math.floor(Math.random() * 4);
        sequence = primes.slice(startIndex, startIndex + 4);
        correctAnswer = primes[startIndex + 4];
        question = `${sequence.join(', ')}, ___?`;
        options = [
          correctAnswer,
          correctAnswer + 2,
          primes[startIndex + 4] + 1,
          generateWrongAnswer(correctAnswer)
        ];
        break;
      }

      case 'alternating': {
        const pattern = Math.random() > 0.5 ? 'add/subtract' : 'multiply/divide';
        let current = Math.floor(Math.random() * 20) + 10;
        sequence = [current];
        
        for (let i = 0; i < 3; i++) {
          if (pattern === 'add/subtract') {
            current += (i % 2 === 0) ? 5 : -3;
          } else {
            current = (i % 2 === 0) ? current * 2 : Math.floor(current / 2);
          }
          sequence.push(current);
        }
        correctAnswer = pattern === 'add/subtract' 
          ? sequence[3] + 5 
          : Math.floor(sequence[3] * 2);
        question = `${sequence.join(', ')}, ___?`;
        options = [
          correctAnswer,
          generateWrongAnswer(correctAnswer),
          pattern === 'add/subtract' ? sequence[3] - 3 : Math.floor(sequence[3] / 2),
          correctAnswer + (pattern === 'add/subtract' ? -1 : 2)
        ];
        break;
      }
    }

    setProblem({
      question,
      answer: correctAnswer,
      options: options.sort(() => Math.random() - 0.5).map(String),
      type
    });
  };

  const handleAnswer = async (selectedAnswer) => {
    const isCorrect = parseInt(selectedAnswer) === problem.answer;

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

    if (isCorrect) {
      const newScore = score + (10 * (streak + 1));
      setScore(newScore);
      setStreak(prev => prev + 1);
      await saveStats(newScore, true);
    } else {
      setLives(prev => prev - 1);
      setStreak(0);
      await saveStats(score, false);

      if (lives <= 1) {
        handleGameOver();
        return;
      }
    }

    generateProblem();
  };

  const handleGameOver = () => {
    Alert.alert(
      'Game Over!',
      `Final Score: ${score}\nHigh Score: ${highScore}\nAccuracy: ${Math.round((correctAnswers / totalAttempts) * 100)}%`,
      [
        {
          text: 'Try Again',
          onPress: () => {
            setLives(3);
            setScore(0);
            setStreak(0);
            generateProblem();
          },
        },
        {
          text: 'Exit',
          onPress: () => navigation.goBack(),
          style: 'cancel',
        },
      ]
    );
  };

  const getAccuracyColor = () => {
    const accuracy = (correctAnswers / totalAttempts) * 100 || 0;
    if (accuracy >= 80) return '#2ECC71';
    if (accuracy >= 60) return '#F1C40F';
    return '#E74C3C';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={hp(4)} color="#ECF0F1" />
        </TouchableOpacity>
        <Text style={styles.title}>Number Patterns</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Icon name="emoji-events" size={hp(3)} color="#F1C40F" />
          <Text style={styles.statLabel}>High Score</Text>
          <Text style={styles.statValue}>{highScore}</Text>
        </View>
        <View style={styles.statBox}>
          <Icon name="check-circle" size={hp(3)} color={getAccuracyColor()} />
          <Text style={styles.statLabel}>Accuracy</Text>
          <Text style={[styles.statValue, { color: getAccuracyColor() }]}>
            {totalAttempts ? Math.round((correctAnswers / totalAttempts) * 100) : 0}%
          </Text>
        </View>
        <View style={styles.statBox}>
          <Icon name="favorite" size={hp(3)} color="#E74C3C" />
          <Text style={styles.statLabel}>Lives</Text>
          <Text style={styles.statValue}>{lives}</Text>
        </View>
      </View>

      <Text style={styles.scoreText}>Score: {score}</Text>
      {streak > 0 && (
        <Text style={styles.streakText}>Streak: {streak}x</Text>
      )}

      <Animated.View style={[styles.problemContainer, { transform: [{ scale: animation }] }]}>
        <Text style={styles.problemText}>
          {problem?.question}
        </Text>
        <Text style={styles.problemType}>({problem?.type.replace(/([A-Z])/g, ' $1').trim()})</Text>
      </Animated.View>

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

// Reuse the same styles from AlgebraScreen
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: hp(2),
    backgroundColor: '#34495E',
    marginTop: hp(1),
  },
  statBox: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#BDC3C7',
    fontSize: fs(1.6),
    marginTop: hp(0.5),
  },
  statValue: {
    color: '#ECF0F1',
    fontSize: fs(2),
    fontWeight: 'bold',
    marginTop: hp(0.5),
  },
  scoreText: {
    fontSize: fs(4),
    color: '#2ECC71',
    textAlign: 'center',
    marginTop: hp(2),
    fontWeight: 'bold',
  },
  streakText: {
    fontSize: fs(2.5),
    color: '#F1C40F',
    textAlign: 'center',
    marginTop: hp(1),
  },
  problemContainer: {
    backgroundColor: '#34495E',
    margin: hp(2),
    padding: hp(4),
    borderRadius: hp(2),
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  problemText: {
    fontSize: fs(4),
    color: '#ECF0F1',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  problemType: {
    fontSize: fs(2),
    color: '#BDC3C7',
    marginTop: hp(1),
    fontStyle: 'italic',
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
  },
  optionText: {
    fontSize: fs(3),
    color: '#ECF0F1',
    fontWeight: '600',
  },
});

export default NumberPatternsScreen;