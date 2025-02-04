import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { responsiveFontSize as fs } from "react-native-responsive-dimensions";
import AsyncStorage from '@react-native-async-storage/async-storage';

const MeasurementScreen = ({ navigation }) => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [problem, setProblem] = useState(null);
  const [animation] = useState(new Animated.Value(1));
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const measurementTypes = [
    {
      type: 'length',
      units: [
        { unit: 'cm', base: 1 },
        { unit: 'm', base: 100 },
        { unit: 'mm', base: 0.1 }
      ]
    },
    {
      type: 'weight',
      units: [
        { unit: 'g', base: 1 },
        { unit: 'kg', base: 1000 },
        { unit: 'mg', base: 0.001 }
      ]
    },
    {
      type: 'volume',
      units: [
        { unit: 'ml', base: 1 },
        { unit: 'l', base: 1000 },
        { unit: 'cl', base: 10 }
      ]
    }
  ];

  const loadStats = async () => {
    try {
      const stats = await AsyncStorage.getItem('measurementStats');
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

//   const saveStats = async (newScore, isCorrect) => {
//     try {
//       const newHighScore = Math.max(newScore, highScore);
//       const newStats = {
//         highScore: newHighScore,
//         totalAttempts: totalAttempts + 1,
//         correctAnswers: correctAnswers + (isCorrect ? 1 : 0),
//         lastPlayed: new Date().toISOString(),
//       };

//       await AsyncStorage.setItem('measurementStats', JSON.stringify(newStats));
//       setHighScore(newHighScore);
//       setTotalAttempts(newStats.totalAttempts);
//       setCorrectAnswers(newStats.correctAnswers);

//       // Update global stats
//       const globalStats = await AsyncStorage.getItem('mathStats');
//       const parsedGlobalStats = globalStats ? JSON.parse(globalStats) : {
//         categoryPerformance: {
//           addition: { correct: 0, total: 0 },
//           subtraction: { correct: 0, total: 0 },
//           multiplication: { correct: 0, total: 0 },
//           division: { correct: 0, total: 0 },
//           measurement: { correct: 0, total: 0 },
//         },
//         recentScores: [],
//       };

//       parsedGlobalStats.categoryPerformance.measurement.total += 1;
//       if (isCorrect) {
//         parsedGlobalStats.categoryPerformance.measurement.correct += 1;
//       }

//       parsedGlobalStats.recentScores = [
//         newScore,
//         ...(parsedGlobalStats.recentScores || []).slice(0, 9)
//       ];

//       await AsyncStorage.setItem('mathStats', JSON.stringify(parsedGlobalStats));
//     } catch (error) {
//       console.error('Error saving stats:', error);
//     }
//   };

const saveStats = async (newScore, isCorrect) => {
    try {
      const newHighScore = Math.max(newScore, highScore);
      const newStats = {
        highScore: newHighScore,
        totalAttempts: totalAttempts + 1,
        correctAnswers: correctAnswers + (isCorrect ? 1 : 0),
        lastPlayed: new Date().toISOString(),
      };

      await AsyncStorage.setItem('measurementStats', JSON.stringify(newStats));
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
          measurement: { correct: 0, total: 0 }, // Make sure this is initialized
        },
        recentScores: [],
      };

      // Ensure measurement category exists
      if (!parsedGlobalStats.categoryPerformance.measurement) {
        parsedGlobalStats.categoryPerformance.measurement = { correct: 0, total: 0 };
      }

      // Update the stats
      parsedGlobalStats.categoryPerformance.measurement.total += 1;
      if (isCorrect) {
        parsedGlobalStats.categoryPerformance.measurement.correct += 1;
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
    // Select random measurement type
    const measurementType = measurementTypes[Math.floor(Math.random() * measurementTypes.length)];
    
    // Select two different random units
    const fromUnitIndex = Math.floor(Math.random() * measurementType.units.length);
    let toUnitIndex;
    do {
      toUnitIndex = Math.floor(Math.random() * measurementType.units.length);
    } while (toUnitIndex === fromUnitIndex);

    const fromUnit = measurementType.units[fromUnitIndex];
    const toUnit = measurementType.units[toUnitIndex];

    // Generate a reasonable number based on difficulty
    const baseNumber = Math.floor(Math.random() * (10 + Math.floor(score / 50))) + 1;
    const fromValue = baseNumber;
    
    // Calculate correct answer
    const correctAnswer = (fromValue * fromUnit.base / toUnit.base).toFixed(2);

    // Generate wrong answers that are common conversion mistakes
    const wrongAnswers = [
      (fromValue * 10).toFixed(2), // Common mistake: wrong power of 10
      (fromValue / 10).toFixed(2), // Another common mistake
      (fromValue * fromUnit.base * toUnit.base).toFixed(2), // Multiplying instead of dividing
    ];

    const options = [...wrongAnswers, correctAnswer]
      .sort(() => Math.random() - 0.5);

    setProblem({
      fromValue,
      fromUnit: fromUnit.unit,
      toUnit: toUnit.unit,
      answer: correctAnswer,
      options,
      type: measurementType.type
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
        <Text style={styles.title}>Measurement Challenge</Text>
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
          Convert {problem?.fromValue} {problem?.fromUnit} to {problem?.toUnit}
        </Text>
        <Text style={styles.problemType}>({problem?.type})</Text>
      </Animated.View>

      <View style={styles.optionsContainer}>
        {problem?.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.optionButton}
            onPress={() => handleAnswer(option)}
          >
            <Text style={styles.optionText}>{option} {problem?.toUnit}</Text>
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

export default MeasurementScreen;