import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { responsiveFontSize as fs } from "react-native-responsive-dimensions";
import AsyncStorage from '@react-native-async-storage/async-storage';

const AlgebraScreen = ({ navigation }) => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [problem, setProblem] = useState(null);
  const [animation] = useState(new Animated.Value(1));
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const problemTypes = [
    'solveEquation',
    'simplifyExpression',
    'expandExpression',
    'factorExpression'
  ];

  const loadStats = async () => {
    try {
      const stats = await AsyncStorage.getItem('algebraStats');
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

      await AsyncStorage.setItem('algebraStats', JSON.stringify(newStats));
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
        },
        recentScores: [],
      };

      if (!parsedGlobalStats.categoryPerformance.algebra) {
        parsedGlobalStats.categoryPerformance.algebra = { correct: 0, total: 0 };
      }

      parsedGlobalStats.categoryPerformance.algebra.total += 1;
      if (isCorrect) {
        parsedGlobalStats.categoryPerformance.algebra.correct += 1;
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
    const type = problemTypes[Math.floor(Math.random() * problemTypes.length)];
    let question, correctAnswer, options;

    switch (type) {
      case 'solveEquation':
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 20) - 10;
        const c = Math.floor(Math.random() * 10) + 1;
        question = `Solve for x: ${a}x ${b >= 0 ? '+' : '-'} ${Math.abs(b)} = ${c}`;
        correctAnswer = ((c - b) / a).toFixed(2);
        options = [
          ((c + b) / a).toFixed(2),
          (c / a - b).toFixed(2),
          correctAnswer,
          (a / (c - b)).toFixed(2)
        ];
        break;

      case 'simplifyExpression':
        const coeff1 = Math.floor(Math.random() * 5) + 1;
        const coeff2 = Math.floor(Math.random() * 5) + 1;
        const var1 = String.fromCharCode(97 + Math.floor(Math.random() * 3));
        const var2 = String.fromCharCode(97 + Math.floor(Math.random() * 3));
        question = `Simplify: ${coeff1}${var1} + ${coeff2}${var2} + ${coeff1}${var1}`;
        correctAnswer = `${coeff1 * 2}${var1} + ${coeff2}${var2}`;
        options = [
          correctAnswer,
          `${coeff1 + coeff2}${var1}${var2}`,
          `${coeff1 * 2 + coeff2}${var1}`,
          `${coeff1 + coeff2}${var1} + ${var2}`
        ];
        break;

      case 'expandExpression':
        const n1 = Math.floor(Math.random() * 3) + 1;
        const n2 = Math.floor(Math.random() * 3) + 1;
        question = `Expand: (x + ${n1})(x + ${n2})`;
        correctAnswer = `x² + ${n1 + n2}x + ${n1 * n2}`;
        options = [
          correctAnswer,
          `x² + ${n1 * n2}x + ${n1 + n2}`,
          `x² + ${n1 + n2 + 1}x + ${n1 * n2}`,
          `2x + ${n1 + n2}`
        ];
        break;

      case 'factorExpression':
        const a1 = Math.floor(Math.random() * 2) + 1;
        const b1 = Math.floor(Math.random() * 5) + 1;
        const c1 = a1 * b1;
        question = `Factor: ${a1}x² + ${c1}x`;
        correctAnswer = `${a1}x(x + ${b1})`;
        options = [
          correctAnswer,
          `x(${a1}x + ${c1})`,
          `${a1}(x² + ${b1}x)`,
          `(${a1}x + ${b1})(x + ${c1})`
        ];
        break;
    }

    setProblem({
      question,
      answer: correctAnswer,
      options: options.sort(() => Math.random() - 0.5),
      type
    });
  };

  const handleAnswer = async (selectedAnswer) => {
    const isCorrect = selectedAnswer === problem.answer;

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
        <Text style={styles.title}>Algebra Basics</Text>
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

// Reuse the same styles from MeasurementScreen
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

export default AlgebraScreen;