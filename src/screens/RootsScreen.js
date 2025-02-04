import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { responsiveFontSize as fs } from "react-native-responsive-dimensions";
import AsyncStorage from '@react-native-async-storage/async-storage';

const RootsScreen = ({ navigation }) => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [problem, setProblem] = useState(null);
  const [animation] = useState(new Animated.Value(1));
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const isMounted = useRef(true);
  const lastInteractionTime = useRef(Date.now());

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const stats = await AsyncStorage.getItem('rootsStats');
      if (stats && isMounted.current) {
        const parsedStats = JSON.parse(stats);
        setHighScore(parsedStats.highScore || 0);
        setTotalAttempts(parsedStats.totalAttempts || 0);
        setCorrectAnswers(parsedStats.correctAnswers || 0);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadStats();
    generateProblem();
  }, [loadStats]);

  const saveStats = useCallback(async (newScore, isCorrect) => {
    try {
      const newHighScore = Math.max(newScore, highScore);
      const newStats = {
        highScore: newHighScore,
        totalAttempts: totalAttempts + 1,
        correctAnswers: correctAnswers + (isCorrect ? 1 : 0),
        lastPlayed: new Date().toISOString(),
      };
  
      await AsyncStorage.setItem('rootsStats', JSON.stringify(newStats));
      
      if (isMounted.current) {
        setHighScore(newHighScore);
        setTotalAttempts(newStats.totalAttempts);
        setCorrectAnswers(newStats.correctAnswers);
      }
  
      // Update global stats
      const globalStats = await AsyncStorage.getItem('mathStats');
      const parsedGlobalStats = globalStats ? JSON.parse(globalStats) : {
        categoryPerformance: {
          addition: { correct: 0, total: 0 },
          subtraction: { correct: 0, total: 0 },
          multiplication: { correct: 0, total: 0 },
          division: { correct: 0, total: 0 },
          roots: { correct: 0, total: 0 }, // Ensure roots is initialized
        },
        recentScores: [],
      };
  
      // Ensure roots category exists
      if (!parsedGlobalStats.categoryPerformance.roots) {
        parsedGlobalStats.categoryPerformance.roots = { correct: 0, total: 0 };
      }
  
      parsedGlobalStats.categoryPerformance.roots.total += 1;
      if (isCorrect) {
        parsedGlobalStats.categoryPerformance.roots.correct += 1;
      }
  
      parsedGlobalStats.recentScores = [
        newScore,
        ...(parsedGlobalStats.recentScores || []).slice(0, 9)
      ];
  
      await AsyncStorage.setItem('mathStats', JSON.stringify(parsedGlobalStats));
    } catch (error) {
      console.error('Error saving stats:', error);
    }
  }, [highScore, totalAttempts, correctAnswers]);
  const generateProblem = useCallback(() => {
    // Prevent problem generation if we're still processing
    if (isProcessing) return;

    try {
      // Adjust difficulty based on score
      const maxNumber = Math.min(100 + Math.floor(score / 10), 200);
      const number = Math.floor(Math.random() * maxNumber) + 1;
      const answer = Math.sqrt(number).toFixed(2);

      // Generate wrong answers
      const wrongAnswers = new Set();
      while (wrongAnswers.size < 3) {
        const wrongAnswer = (Math.sqrt(number) + (Math.random() * 2 - 1)).toFixed(2);
        if (wrongAnswer !== answer) {
          wrongAnswers.add(wrongAnswer);
        }
      }

      const options = [...Array.from(wrongAnswers), answer]
        .sort(() => Math.random() - 0.5);

      if (isMounted.current) {
        setProblem({ number, answer, options });
      }
    } catch (error) {
      console.error('Error generating problem:', error);
      // Retry problem generation once if it fails
      setTimeout(generateProblem, 100);
    }
  }, [score, isProcessing]);

  const handleAnswer = useCallback(async (selectedAnswer) => {
    // Prevent rapid tapping
    const now = Date.now();
    if (now - lastInteractionTime.current < 500) return;
    lastInteractionTime.current = now;

    if (isProcessing) return;
    setIsProcessing(true);

    try {
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
        if (isMounted.current) {
          setScore(newScore);
          setStreak(prev => prev + 1);
        }
        await saveStats(newScore, true);
      } else {
        if (isMounted.current) {
          setLives(prev => prev - 1);
          setStreak(0);
        }
        await saveStats(score, false);

        if (lives <= 1) {
          handleGameOver();
          return;
        }
      }

      generateProblem();
    } catch (error) {
      console.error('Error handling answer:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      if (isMounted.current) {
        setIsProcessing(false);
      }
    }
  }, [problem, score, streak, lives, isProcessing, saveStats, generateProblem]);

  const handleGameOver = useCallback(() => {
    Alert.alert(
      'Game Over!',
      `Final Score: ${score}\nHigh Score: ${highScore}\nAccuracy: ${Math.round((correctAnswers / totalAttempts) * 100)}%`,
      [
        {
          text: 'Try Again',
          onPress: () => {
            if (isMounted.current) {
              setLives(3);
              setScore(0);
              setStreak(0);
              generateProblem();
            }
          },
        },
        {
          text: 'Exit',
          onPress: () => navigation.goBack(),
          style: 'cancel',
        },
      ]
    );
  }, [score, highScore, correctAnswers, totalAttempts, generateProblem, navigation]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#3498DB" />
      </View>
    );
  }

  const getAccuracyColor = () => {
    const accuracy = (correctAnswers / totalAttempts) * 100 || 0;
    if (accuracy >= 80) return '#2ECC71';
    if (accuracy >= 60) return '#F1C40F';
    return '#E74C3C';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          disabled={isProcessing}
        >
          <Icon name="arrow-back" size={hp(4)} color="#ECF0F1" />
        </TouchableOpacity>
        <Text style={styles.title}>Roots Challenge</Text>
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
        {problem ? (
          <Text style={styles.problemText}>
            √{problem.number}
          </Text>
        ) : (
          <ActivityIndicator size="large" color="#3498DB" />
        )}
      </Animated.View>

      <View style={styles.optionsContainer}>
        {problem?.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              isProcessing && styles.optionButtonDisabled
            ]}
            onPress={() => handleAnswer(option)}
            disabled={isProcessing}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {isProcessing && (
        <View style={styles.processingOverlay}>
          <ActivityIndicator size="small" color="#3498DB" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C3E50',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
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
    minHeight: hp(20),
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
    elevation: 3,
  },
  optionButtonDisabled: {
    opacity: 0.7,
  },
  optionText: {
    fontSize: fs(3),
    color: '#ECF0F1',
    fontWeight: '600',
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RootsScreen;