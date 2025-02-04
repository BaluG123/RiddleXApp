import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Alert, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { responsiveFontSize as fs } from "react-native-responsive-dimensions";
import AsyncStorage from '@react-native-async-storage/async-storage';

const WordProblemsScreen = ({ navigation }) => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [problem, setProblem] = useState(null);
  const [animation] = useState(new Animated.Value(1));
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  // Problem categories
  const PROBLEM_TYPES = {
    AGE: 'age',
    DISTANCE: 'distance',
    MONEY: 'money',
    TIME: 'time',
    PERCENTAGE: 'percentage'
  };

  const loadStats = async () => {
    try {
      const stats = await AsyncStorage.getItem('wordProblemStats');
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

      await AsyncStorage.setItem('wordProblemStats', JSON.stringify(newStats));
      setHighScore(newHighScore);
      setTotalAttempts(newStats.totalAttempts);
      setCorrectAnswers(newStats.correctAnswers);

      // Update global stats
      const globalStats = await AsyncStorage.getItem('mathStats');
      const parsedGlobalStats = globalStats ? JSON.parse(globalStats) : {
        categoryPerformance: {
          wordProblems: { correct: 0, total: 0 },
        },
        recentScores: [],
      };

      parsedGlobalStats.categoryPerformance.wordProblems = parsedGlobalStats.categoryPerformance.wordProblems || { correct: 0, total: 0 };
      parsedGlobalStats.categoryPerformance.wordProblems.total += 1;
      if (isCorrect) {
        parsedGlobalStats.categoryPerformance.wordProblems.correct += 1;
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
    const selectedType = problemTypes[Math.floor(Math.random() * problemTypes.length)];
    
    let question = {};
    const names = ['John', 'Sarah', 'Mike', 'Emma', 'Alex', 'Lisa', 'Tom', 'Amy'];
    const randomName = () => names[Math.floor(Math.random() * names.length)];

    switch(selectedType) {
      case PROBLEM_TYPES.AGE:
        const currentAge = Math.floor(Math.random() * 20) + 10;
        const yearDiff = Math.floor(Math.random() * 10) + 5;
        const name = randomName();
        
        if (difficultyLevel < 2) {
          question = {
            type: PROBLEM_TYPES.AGE,
            text: `${name} is ${currentAge} years old. How old will ${name} be in ${yearDiff} years?`,
            answer: currentAge + yearDiff,
            hint: 'Add the years to current age'
          };
        } else {
          const pastYears = Math.floor(Math.random() * 10) + 5;
          question = {
            type: PROBLEM_TYPES.AGE,
            text: `${name} will be ${currentAge} years old in ${pastYears} years. How old is ${name} now?`,
            answer: currentAge - pastYears,
            hint: 'Subtract years from future age'
          };
        }
        break;

      case PROBLEM_TYPES.DISTANCE:
        const speed = (Math.floor(Math.random() * 30) + 20) * 5;
        const time = Math.floor(Math.random() * 4) + 2;
        
        if (difficultyLevel < 2) {
          question = {
            type: PROBLEM_TYPES.DISTANCE,
            text: `A car travels at ${speed} km/h for ${time} hours. How far does it travel?`,
            answer: speed * time,
            hint: 'Distance = Speed × Time'
          };
        } else {
          const distance = speed * time;
          question = {
            type: PROBLEM_TYPES.DISTANCE,
            text: `A car travels ${distance} km in ${time} hours. What is its average speed?`,
            answer: speed,
            hint: 'Speed = Distance ÷ Time'
          };
        }
        break;

      case PROBLEM_TYPES.MONEY:
        const price = Math.floor(Math.random() * 50) + 20;
        const quantity = Math.floor(Math.random() * 5) + 2;
        const discount = Math.floor(Math.random() * 20) + 10;
        
        if (difficultyLevel < 2) {
          question = {
            type: PROBLEM_TYPES.MONEY,
            text: `${randomName()} buys ${quantity} items at $${price} each. How much does ${quantity > 1 ? 'they' : 'he/she'} spend in total?`,
            answer: price * quantity,
            hint: 'Multiply price by quantity'
          };
        } else {
          const total = price * quantity;
          question = {
            type: PROBLEM_TYPES.MONEY,
            text: `${randomName()} buys ${quantity} items for $${total}. There is a ${discount}% discount. How much does ${quantity > 1 ? 'they' : 'he/she'} save?`,
            answer: Math.round((total * discount) / 100),
            hint: 'Calculate percentage of total price'
          };
        }
        break;

      case PROBLEM_TYPES.TIME:
        const hours = Math.floor(Math.random() * 3) + 1;
        const minutes = Math.floor(Math.random() * 45) + 15;
        
        if (difficultyLevel < 2) {
          question = {
            type: PROBLEM_TYPES.TIME,
            text: `${randomName()} starts studying at 2:00 PM and studies for ${hours} hours and ${minutes} minutes. What time does ${hours > 1 ? 'they' : 'he/she'} finish?`,
            answer: `${2 + hours}:${minutes.toString().padStart(2, '0')} PM`,
            hint: 'Add hours and minutes to start time'
          };
        } else {
          question = {
            type: PROBLEM_TYPES.TIME,
            text: `${randomName()} starts at 9:00 AM and finishes at ${9 + hours}:${minutes} AM. How many minutes did they work?`,
            answer: (hours * 60) + minutes,
            hint: 'Convert time difference to minutes'
          };
        }
        break;

      case PROBLEM_TYPES.PERCENTAGE:
        const total = Math.floor(Math.random() * 200) + 100;
        const percent = Math.floor(Math.random() * 30) + 20;
        
        if (difficultyLevel < 2) {
          question = {
            type: PROBLEM_TYPES.PERCENTAGE,
            text: `In a class of ${total} students, ${percent}% play sports. How many students play sports?`,
            answer: Math.round((total * percent) / 100),
            hint: 'Calculate percentage of total'
          };
        } else {
          const partValue = Math.round((total * percent) / 100);
          question = {
            type: PROBLEM_TYPES.PERCENTAGE,
            text: `${partValue} students out of ${total} total students play sports. What percentage of students play sports?`,
            answer: percent,
            hint: 'Divide part by total and multiply by 100'
          };
        }
        break;
    }

    // Generate wrong answers
    let wrongAnswers;
    if (typeof question.answer === 'number') {
      wrongAnswers = [
        Math.round(question.answer * 0.8),
        Math.round(question.answer * 1.2),
        question.answer + Math.round(question.answer * 0.1),
      ].filter(val => val !== question.answer);
    } else {
      // Handle string answers (like time)
      wrongAnswers = [
        `${parseInt(question.answer) + 1}:00 PM`,
        `${parseInt(question.answer) - 1}:30 PM`,
        `${parseInt(question.answer)}:15 PM`,
      ].filter(val => val !== question.answer);
    }

    const options = [...new Set([...wrongAnswers.slice(0, 2), question.answer])]
      .sort(() => Math.random() - 0.5);

    setProblem({ ...question, options });
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
      case PROBLEM_TYPES.AGE: return 'person';
      case PROBLEM_TYPES.DISTANCE: return 'directions-car';
      case PROBLEM_TYPES.MONEY: return 'attach-money';
      case PROBLEM_TYPES.TIME: return 'access-time';
      case PROBLEM_TYPES.PERCENTAGE: return 'pie-chart';
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
        <Text style={styles.title}>Word Problems</Text>
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

      <ScrollView style={styles.scrollContainer}>
        <Animated.View style={[styles.problemContainer, { transform: [{ scale: animation }] }]}>
          <Icon name={getProblemIcon()} size={hp(8)} color="#8E44AD" />
          <Text style={styles.problemText}>
            {problem?.text}
          </Text>
          <Text style={styles.hintText}>Hint: {problem?.hint}</Text>
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
      </ScrollView>
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
    scrollContainer: {
      flex: 1,
      marginBottom: hp(2),
    },
    problemContainer: {
      backgroundColor: '#34495E',
      margin: hp(2),
      padding: hp(4),
      borderRadius: hp(2),
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 5,
      minHeight: hp(30),
    },
    problemText: {
      fontSize: fs(2.2),
      color: '#ECF0F1',
      fontWeight: '500',
      textAlign: 'center',
      marginVertical: hp(2),
      lineHeight: hp(3.5),
      paddingHorizontal: wp(2),
    },
    hintText: {
      fontSize: fs(1.8),
      color: '#BDC3C7',
      fontStyle: 'italic',
      textAlign: 'center',
      marginTop: hp(2),
      paddingHorizontal: wp(4),
    },
    optionsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      padding: hp(2),
      marginBottom: hp(4),
    },
    optionButton: {
      backgroundColor: '#8E44AD',
      width: wp(40),
      padding: hp(2),
      margin: hp(1),
      borderRadius: hp(1),
      alignItems: 'center',
      elevation: 3,
      minHeight: hp(8),
      justifyContent: 'center',
    },
    optionText: {
      fontSize: fs(2.5),
      color: '#ECF0F1',
      fontWeight: '600',
      textAlign: 'center',
    },
    // Additional styles for word problems
    categoryBadge: {
      position: 'absolute',
      top: hp(1),
      right: hp(1),
      backgroundColor: '#2980B9',
      paddingHorizontal: wp(3),
      paddingVertical: hp(0.5),
      borderRadius: hp(1),
    },
    categoryText: {
      color: '#ECF0F1',
      fontSize: fs(1.4),
      fontWeight: '500',
    },
    difficultyContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: hp(1),
    },
    difficultyDot: {
      width: wp(2),
      height: wp(2),
      borderRadius: wp(1),
      marginHorizontal: wp(0.5),
    },
    activeDot: {
      backgroundColor: '#E74C3C',
    },
    inactiveDot: {
      backgroundColor: '#BDC3C7',
    },
    // Responsive padding for different screen sizes
    contentPadding: {
      paddingHorizontal: wp(4),
    },
    // Animation related styles
    fadeIn: {
      opacity: 1,
      transform: [{ scale: 1 }],
    },
    fadeOut: {
      opacity: 0,
      transform: [{ scale: 0.9 }],
    },
    // Accessibility styles
    accessibilityText: {
      position: 'absolute',
      width: 1,
      height: 1,
      padding: 0,
      margin: -1,
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap',
      border: 0,
    },
    // Error state styles
    errorContainer: {
      backgroundColor: '#E74C3C',
      padding: hp(2),
      margin: hp(2),
      borderRadius: hp(1),
      alignItems: 'center',
    },
    errorText: {
      color: '#ECF0F1',
      fontSize: fs(2),
      textAlign: 'center',
    },
    // Loading state styles
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      color: '#ECF0F1',
      fontSize: fs(2),
      marginTop: hp(2),
    },
    // Modal styles for hints and explanations
    modalContainer: {
      backgroundColor: '#34495E',
      margin: hp(2),
      padding: hp(3),
      borderRadius: hp(2),
      elevation: 5,
    },
    modalTitle: {
      fontSize: fs(2.5),
      color: '#ECF0F1',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: hp(2),
    },
    modalContent: {
      fontSize: fs(2),
      color: '#ECF0F1',
      lineHeight: hp(3),
      textAlign: 'center',
    },
    modalButton: {
      backgroundColor: '#8E44AD',
      padding: hp(1.5),
      borderRadius: hp(1),
      marginTop: hp(2),
      alignItems: 'center',
    },
    modalButtonText: {
      color: '#ECF0F1',
      fontSize: fs(2),
      fontWeight: '600',
    },
    // Progress indicator styles
    progressContainer: {
      height: hp(1),
      backgroundColor: '#34495E',
      borderRadius: hp(0.5),
      marginHorizontal: wp(4),
      marginTop: hp(1),
    },
    progressBar: {
      height: '100%',
      backgroundColor: '#2ECC71',
      borderRadius: hp(0.5),
    },
  });
  
  export default WordProblemsScreen;