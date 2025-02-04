import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { responsiveFontSize as fs } from "react-native-responsive-dimensions";
import AsyncStorage from '@react-native-async-storage/async-storage';

const FractionScreen = ({ navigation }) => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [problem, setProblem] = useState(null);
  const [animation] = useState(new Animated.Value(1));
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  // Fraction operation types
  const OPERATION_TYPES = {
    ADDITION: 'addition',
    SUBTRACTION: 'subtraction',
    MULTIPLICATION: 'multiplication',
    DIVISION: 'division',
  };

  const loadStats = async () => {
    try {
      const stats = await AsyncStorage.getItem('fractionStats');
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

      await AsyncStorage.setItem('fractionStats', JSON.stringify(newStats));
      setHighScore(newHighScore);
      setTotalAttempts(newStats.totalAttempts);
      setCorrectAnswers(newStats.correctAnswers);

      // Update global stats
      const globalStats = await AsyncStorage.getItem('mathStats');
      const parsedGlobalStats = globalStats ? JSON.parse(globalStats) : {
        categoryPerformance: {
          fractions: { correct: 0, total: 0 },
        },
        recentScores: [],
      };

      parsedGlobalStats.categoryPerformance.fractions = parsedGlobalStats.categoryPerformance.fractions || { correct: 0, total: 0 };
      parsedGlobalStats.categoryPerformance.fractions.total += 1;
      if (isCorrect) {
        parsedGlobalStats.categoryPerformance.fractions.correct += 1;
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

  const gcd = (a, b) => {
    return b === 0 ? a : gcd(b, a % b);
  };

  const simplifyFraction = (numerator, denominator) => {
    const divisor = gcd(Math.abs(numerator), Math.abs(denominator));
    return {
      numerator: numerator / divisor,
      denominator: denominator / divisor
    };
  };

  const generateFraction = (maxValue = 10) => {
    const numerator = Math.floor(Math.random() * maxValue) + 1;
    const denominator = Math.floor(Math.random() * maxValue) + 1;
    return { numerator, denominator };
  };

  const generateProblem = () => {
    const difficultyLevel = Math.floor(score / 50);
    const maxValue = 6 + difficultyLevel;
    const operationKeys = Object.keys(OPERATION_TYPES);
    const selectedOperation = OPERATION_TYPES[operationKeys[Math.floor(Math.random() * operationKeys.length)]];
    
    const fraction1 = generateFraction(maxValue);
    const fraction2 = generateFraction(maxValue);
    let answer, questionText, formula;

    switch(selectedOperation) {
      case OPERATION_TYPES.ADDITION:
        answer = simplifyFraction(
          fraction1.numerator * fraction2.denominator + fraction2.numerator * fraction1.denominator,
          fraction1.denominator * fraction2.denominator
        );
        questionText = `${fraction1.numerator}/${fraction1.denominator} + ${fraction2.numerator}/${fraction2.denominator}`;
        formula = 'a/b + c/d = (ad + bc)/(bd)';
        break;

      case OPERATION_TYPES.SUBTRACTION:
        answer = simplifyFraction(
          fraction1.numerator * fraction2.denominator - fraction2.numerator * fraction1.denominator,
          fraction1.denominator * fraction2.denominator
        );
        questionText = `${fraction1.numerator}/${fraction1.denominator} - ${fraction2.numerator}/${fraction2.denominator}`;
        formula = 'a/b - c/d = (ad - bc)/(bd)';
        break;

      case OPERATION_TYPES.MULTIPLICATION:
        answer = simplifyFraction(
          fraction1.numerator * fraction2.numerator,
          fraction1.denominator * fraction2.denominator
        );
        questionText = `${fraction1.numerator}/${fraction1.denominator} × ${fraction2.numerator}/${fraction2.denominator}`;
        formula = '(a/b) × (c/d) = (ac)/(bd)';
        break;

      case OPERATION_TYPES.DIVISION:
        answer = simplifyFraction(
          fraction1.numerator * fraction2.denominator,
          fraction1.denominator * fraction2.numerator
        );
        questionText = `${fraction1.numerator}/${fraction1.denominator} ÷ ${fraction2.numerator}/${fraction2.denominator}`;
        formula = '(a/b) ÷ (c/d) = (ad)/(bc)';
        break;
    }

    // Generate wrong answers
    const correctAnswerDecimal = answer.numerator / answer.denominator;
    const wrongAnswers = [
      { numerator: answer.numerator + 1, denominator: answer.denominator },
      { numerator: answer.numerator, denominator: answer.denominator + 1 },
      { numerator: answer.numerator * 2, denominator: answer.denominator * 2 },
    ].map(fraction => ({
      ...fraction,
      decimal: fraction.numerator / fraction.denominator
    })).filter(fraction => Math.abs(fraction.decimal - correctAnswerDecimal) > 0.1);

    const options = [...wrongAnswers.slice(0, 2), answer]
      .sort(() => Math.random() - 0.5)
      .map(fraction => `${fraction.numerator}/${fraction.denominator}`);

    setProblem({
      question: questionText,
      answer: `${answer.numerator}/${answer.denominator}`,
      options,
      operation: selectedOperation,
      formula
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

  const getOperationIcon = () => {
    switch(problem?.operation) {
      case OPERATION_TYPES.ADDITION: return 'add';
      case OPERATION_TYPES.SUBTRACTION: return 'remove';
      case OPERATION_TYPES.MULTIPLICATION: return 'close';
      case OPERATION_TYPES.DIVISION: return 'division';
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
        <Text style={styles.title}>Fraction Challenge</Text>
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
        <Icon name={getOperationIcon()} size={hp(8)} color="#8E44AD" />
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

export default FractionScreen