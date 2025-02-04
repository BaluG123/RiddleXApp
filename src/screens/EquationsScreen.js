import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { responsiveFontSize as fs } from "react-native-responsive-dimensions";
import AsyncStorage from '@react-native-async-storage/async-storage';

const EquationsScreen = ({ navigation }) => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [problem, setProblem] = useState(null);
  const [animation] = useState(new Animated.Value(1));
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const equationTypes = [
    'linearEquation',
    'quadraticEquation',
    'systemOfEquations',
    'exponentialEquation',
    'logarithmicEquation',
  ];

  const loadStats = async () => {
    try {
      const stats = await AsyncStorage.getItem('equationsStats');
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

      await AsyncStorage.setItem('equationsStats', JSON.stringify(newStats));
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
          moneyMath: { correct: 0, total: 0 },
          equations: { correct: 0, total: 0 },
        },
        recentScores: [],
      };

      parsedGlobalStats.categoryPerformance.equations = parsedGlobalStats.categoryPerformance.equations || { correct: 0, total: 0 };
      parsedGlobalStats.categoryPerformance.equations.total += 1;
      if (isCorrect) {
        parsedGlobalStats.categoryPerformance.equations.correct += 1;
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
    const type = equationTypes[Math.floor(Math.random() * equationTypes.length)];
    let question = '';
    let correctAnswer = 0;
    let options = [];

    const generateWrongAnswer = (correct, variance = 2) => {
      const offset = Math.floor(Math.random() * variance) + 1;
      return Math.random() > 0.5 ? correct + offset : correct - offset;
    };

    switch (type) {
      case 'linearEquation': {
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 20) + 1;
        correctAnswer = (b / a).toFixed(2);
        question = `Solve for x: ${a}x + ${b} = 0`;
        options = [
          correctAnswer,
          generateWrongAnswer(parseFloat(correctAnswer)).toFixed(2),
          (b / (a + 1)).toFixed(2),
          (b / (a - 1)).toFixed(2)
        ];
        break;
      }

      case 'quadraticEquation': {
        const a = Math.floor(Math.random() * 5) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        const c = Math.floor(Math.random() * 5) + 1;
        const discriminant = b * b - 4 * a * c;
        const root1 = ((-b + Math.sqrt(discriminant)) / (2 * a)).toFixed(2);
        const root2 = ((-b - Math.sqrt(discriminant)) / (2 * a)).toFixed(2);
        correctAnswer = root1;
        question = `Solve for x: ${a}x² + ${b}x + ${c} = 0`;
        options = [
          root1,
          root2,
          generateWrongAnswer(parseFloat(root1)).toFixed(2),
          generateWrongAnswer(parseFloat(root2)).toFixed(2)
        ];
        break;
      }

      case 'systemOfEquations': {
        const a1 = Math.floor(Math.random() * 5) + 1;
        const b1 = Math.floor(Math.random() * 5) + 1;
        const c1 = Math.floor(Math.random() * 20) + 1;
        const a2 = Math.floor(Math.random() * 5) + 1;
        const b2 = Math.floor(Math.random() * 5) + 1;
        const c2 = Math.floor(Math.random() * 20) + 1;
        const x = ((b2 * c1 - b1 * c2) / (a1 * b2 - a2 * b1)).toFixed(2);
        const y = ((a1 * c2 - a2 * c1) / (a1 * b2 - a2 * b1)).toFixed(2);
        correctAnswer = x;
        question = `Solve for x: ${a1}x + ${b1}y = ${c1}\n${a2}x + ${b2}y = ${c2}`;
        options = [
          x,
          y,
          generateWrongAnswer(parseFloat(x)).toFixed(2),
          generateWrongAnswer(parseFloat(y)).toFixed(2)
        ];
        break;
      }

      case 'exponentialEquation': {
        const a = Math.floor(Math.random() * 5) + 1;
        const b = Math.floor(Math.random() * 5) + 1;
        const c = Math.floor(Math.random() * 5) + 1;
        correctAnswer = (Math.log(c) / Math.log(a)).toFixed(2);
        question = `Solve for x: ${a}^x = ${c}`;
        options = [
          correctAnswer,
          generateWrongAnswer(parseFloat(correctAnswer)).toFixed(2),
          (Math.log(c + 1) / Math.log(a)).toFixed(2),
          (Math.log(c - 1) / Math.log(a)).toFixed(2)
        ];
        break;
      }

      case 'logarithmicEquation': {
        const a = Math.floor(Math.random() * 5) + 1;
        const b = Math.floor(Math.random() * 5) + 1;
        const c = Math.floor(Math.random() * 5) + 1;
        correctAnswer = (Math.pow(a, c)).toFixed(2);
        question = `Solve for x: log${a}(${b}x) = ${c}`;
        options = [
          correctAnswer,
          generateWrongAnswer(parseFloat(correctAnswer)).toFixed(2),
          (Math.pow(a, c + 1)).toFixed(2),
          (Math.pow(a, c - 1)).toFixed(2)
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
    const isCorrect = parseFloat(selectedAnswer) === parseFloat(problem.answer);

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
        <Text style={styles.title}>Equations</Text>
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

// Reuse the same styles from MoneyMathScreen
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

export default EquationsScreen;