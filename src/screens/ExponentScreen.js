import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { responsiveFontSize as fs } from "react-native-responsive-dimensions";
import AsyncStorage from '@react-native-async-storage/async-storage';

const ExponentScreen = ({ navigation }) => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [problem, setProblem] = useState(null);
  const [animation] = useState(new Animated.Value(1));
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  // Exponent problem types
  const PROBLEM_TYPES = {
    BASIC_POWER: 'basic_power',
    POWER_OF_POWER: 'power_of_power',
    MULTIPLY_SAME_BASE: 'multiply_same_base',
    DIVIDE_SAME_BASE: 'divide_same_base',
    NEGATIVE_EXPONENT: 'negative_exponent'
  };

  const loadStats = async () => {
    try {
      const stats = await AsyncStorage.getItem('exponentStats');
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

      await AsyncStorage.setItem('exponentStats', JSON.stringify(newStats));
      setHighScore(newHighScore);
      setTotalAttempts(newStats.totalAttempts);
      setCorrectAnswers(newStats.correctAnswers);

      // Update global stats
      const globalStats = await AsyncStorage.getItem('mathStats');
      const parsedGlobalStats = globalStats ? JSON.parse(globalStats) : {
        categoryPerformance: {
          exponents: { correct: 0, total: 0 },
        },
        recentScores: [],
      };

      parsedGlobalStats.categoryPerformance.exponents = parsedGlobalStats.categoryPerformance.exponents || { correct: 0, total: 0 };
      parsedGlobalStats.categoryPerformance.exponents.total += 1;
      if (isCorrect) {
        parsedGlobalStats.categoryPerformance.exponents.correct += 1;
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
    const difficultyLevel = Math.floor(score / 50);
    const problemTypes = Object.values(PROBLEM_TYPES);
    // Introduce more complex problems as score increases
    const availableTypes = problemTypes.slice(0, Math.min(problemTypes.length, 2 + Math.floor(difficultyLevel / 2)));
    const selectedType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    
    let question = {};
    const base = Math.floor(Math.random() * (3 + difficultyLevel)) + 2;
    const exponent1 = Math.floor(Math.random() * (3 + difficultyLevel)) + 2;
    let answer, questionText, formula;

    switch(selectedType) {
      case PROBLEM_TYPES.BASIC_POWER:
        answer = Math.pow(base, exponent1);
        questionText = `Calculate: ${base}^${exponent1}`;
        formula = 'x^n = x × x × ... × x (n times)';
        break;

      case PROBLEM_TYPES.POWER_OF_POWER:
        const exponent2 = Math.floor(Math.random() * 3) + 2;
        answer = Math.pow(base, exponent1 * exponent2);
        questionText = `Calculate: (${base}^${exponent1})^${exponent2}`;
        formula = '(x^a)^b = x^(a×b)';
        break;

      case PROBLEM_TYPES.MULTIPLY_SAME_BASE:
        const exp1 = Math.floor(Math.random() * 3) + 2;
        const exp2 = Math.floor(Math.random() * 3) + 2;
        answer = Math.pow(base, exp1 + exp2);
        questionText = `Calculate: ${base}^${exp1} × ${base}^${exp2}`;
        formula = 'x^a × x^b = x^(a+b)';
        break;

      case PROBLEM_TYPES.DIVIDE_SAME_BASE:
        const expDividend = Math.floor(Math.random() * 4) + 4;
        const expDivisor = Math.floor(Math.random() * 3) + 1;
        answer = Math.pow(base, expDividend - expDivisor);
        questionText = `Calculate: ${base}^${expDividend} ÷ ${base}^${expDivisor}`;
        formula = 'x^a ÷ x^b = x^(a-b)';
        break;

      case PROBLEM_TYPES.NEGATIVE_EXPONENT:
        const negExp = -(Math.floor(Math.random() * 2) + 1);
        answer = 1 / Math.pow(base, Math.abs(negExp));
        questionText = `Calculate: ${base}^(${negExp})`;
        formula = 'x^(-n) = 1/x^n';
        break;
    }

    // Generate wrong answers
    const wrongAnswers = [
      answer + 1,
      answer - 1,
      answer * 2,
      Math.floor(answer / 2)
    ].filter(val => val !== answer);

    const options = [...new Set([...wrongAnswers.slice(0, 2), answer])]
      .sort(() => Math.random() - 0.5);

    setProblem({
      type: selectedType,
      question: questionText,
      answer: answer,
      options: options,
      formula: formula
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
      const newScore = score + (15 * (streak + 1));
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

  const getProblemIcon = () => {
    switch(problem?.type) {
      case PROBLEM_TYPES.BASIC_POWER: return 'functions';
      case PROBLEM_TYPES.POWER_OF_POWER: return 'all-inclusive';
      case PROBLEM_TYPES.MULTIPLY_SAME_BASE: return 'close';
      case PROBLEM_TYPES.DIVIDE_SAME_BASE: return 'division';
      case PROBLEM_TYPES.NEGATIVE_EXPONENT: return 'exposure-neg-1';
      default: return 'help-outline';
    }
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
        <Text style={styles.title}>Exponent Challenge</Text>
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
        <Icon name={getProblemIcon()} size={hp(8)} color="#8E44AD" />
        <Text style={styles.problemText}>
          {problem?.question}
        </Text>
        <Text style={styles.formulaText}>{problem?.formula}</Text>
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
    fontSize: fs(2.5),
    color: '#ECF0F1',
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: hp(2),
  },
  formulaText: {
    fontSize: fs(1.8),
    color: '#BDC3C7',
    fontStyle: 'italic',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: hp(2),
  },
  optionButton: {
    backgroundColor: '#8E44AD',
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

export default ExponentScreen;