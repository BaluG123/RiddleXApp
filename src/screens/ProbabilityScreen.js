import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { responsiveFontSize as fs } from "react-native-responsive-dimensions";
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProbabilityScreen = ({ navigation }) => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [problem, setProblem] = useState(null);
  const [animation] = useState(new Animated.Value(1));
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const problemTypes = [
    'singleEvent',
    'combinedIndependent',
    'combinedDependent',
    'complementary',
    'expectedValue',
  ];

  const loadStats = async () => {
    try {
      const stats = await AsyncStorage.getItem('probabilityStats');
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

      await AsyncStorage.setItem('probabilityStats', JSON.stringify(newStats));
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
          probability: { correct: 0, total: 0 },
        },
        recentScores: [],
      };

      parsedGlobalStats.categoryPerformance.probability = parsedGlobalStats.categoryPerformance.probability || { correct: 0, total: 0 };
      parsedGlobalStats.categoryPerformance.probability.total += 1;
      if (isCorrect) {
        parsedGlobalStats.categoryPerformance.probability.correct += 1;
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
    let question = '';
    let correctAnswer = 0;
    let options = [];

    const generateWrongAnswer = (correct) => {
      const variations = [
        correct * 0.5,
        correct * 1.5,
        correct + 0.1,
        correct - 0.1,
        1 - correct,
        correct / 2
      ].filter(v => v >= 0 && v <= 1);
      
      return variations[Math.floor(Math.random() * variations.length)].toFixed(2);
    };

    switch (type) {
      case 'singleEvent': {
        const outcomes = Math.floor(Math.random() * 6) + 2; // 2-7 possible outcomes
        const success = Math.floor(Math.random() * outcomes) + 1;
        correctAnswer = (success / outcomes).toFixed(2);
        question = `What is the probability of an event with ${success} successful outcomes out of ${outcomes} possible?`;
        break;
      }

      case 'combinedIndependent': {
        const p1 = (Math.floor(Math.random() * 4) + 1) / 5; // 0.2-0.8
        const p2 = (Math.floor(Math.random() * 4) + 1) / 5;
        correctAnswer = (p1 * p2).toFixed(2);
        question = `Two independent events have probabilities ${p1.toFixed(1)} and ${p2.toFixed(1)}. What's the probability both occur?`;
        break;
      }

      case 'combinedDependent': {
        const total = Math.floor(Math.random() * 8) + 3; // 3-10 total items
        const firstSuccess = Math.floor(Math.random() * (total - 1)) + 1;
        const secondSuccess = Math.floor(Math.random() * (total - 2)) + 1;
        const prob = (firstSuccess / total) * (secondSuccess / (total - 1));
        correctAnswer = prob.toFixed(2);
        question = `A bag has ${firstSuccess} red and ${total - firstSuccess} blue marbles. What's the probability of drawing two red marbles without replacement?`;
        break;
      }

      case 'complementary': {
        const p = (Math.floor(Math.random() * 9) + 1) / 10; // 0.1-0.9
        correctAnswer = (1 - p).toFixed(2);
        question = `If the probability of rain is ${p.toFixed(1)}, what's the probability it doesn't rain?`;
        break;
      }

      case 'expectedValue': {
        const outcomes = [];
        const numOutcomes = Math.floor(Math.random() * 3) + 2; // 2-4 outcomes
        let totalProb = 0;
        
        for (let i = 0; i < numOutcomes - 1; i++) {
          const value = Math.floor(Math.random() * 20) + 1;
          const prob = (Math.random() * 0.8).toFixed(1);
          outcomes.push({ value, prob });
          totalProb += parseFloat(prob);
        }
        
        // Add final outcome to make probabilities sum to 1
        const lastValue = Math.floor(Math.random() * 20) + 1;
        const lastProb = (1 - totalProb).toFixed(1);
        outcomes.push({ value: lastValue, prob: lastProb });

        correctAnswer = outcomes.reduce((sum, { value, prob }) => sum + value * prob, 0).toFixed(2);
        question = `Calculate expected value for:\n${outcomes.map(o => `$${o.value} (${o.prob})`).join(', ')}`;
        break;
      }
    }

    // Generate options
    options = [correctAnswer];
    while (options.length < 4) {
      const wrong = generateWrongAnswer(parseFloat(correctAnswer));
      if (!options.includes(wrong)) options.push(wrong);
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
        <Text style={styles.title}>Probability</Text>
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

// Reuse the same styles from previous screens
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
    fontSize: fs(3),
    color: '#ECF0F1',
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: hp(4),
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

export default ProbabilityScreen;