import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Alert, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { responsiveFontSize as fs } from "react-native-responsive-dimensions";
import AsyncStorage from '@react-native-async-storage/async-storage';

const LogicPuzzleScreen = ({ navigation }) => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [puzzle, setPuzzle] = useState(null);
  const [animation] = useState(new Animated.Value(1));
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  // Puzzle categories
  const PUZZLE_TYPES = {
    SEQUENCE: 'sequence',
    PATTERN: 'pattern',
    SYLLOGISM: 'syllogism',
    ANALOGY: 'analogy',
    DEDUCTION: 'deduction'
  };

  const loadStats = async () => {
    try {
      const stats = await AsyncStorage.getItem('logicPuzzleStats');
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
    generatePuzzle();
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

      await AsyncStorage.setItem('logicPuzzleStats', JSON.stringify(newStats));
      setHighScore(newHighScore);
      setTotalAttempts(newStats.totalAttempts);
      setCorrectAnswers(newStats.correctAnswers);

      // Update global stats
      const globalStats = await AsyncStorage.getItem('mathStats');
      const parsedGlobalStats = globalStats ? JSON.parse(globalStats) : {
        categoryPerformance: {
          logicPuzzles: { correct: 0, total: 0 },
        },
        recentScores: [],
      };

      parsedGlobalStats.categoryPerformance.logicPuzzles = parsedGlobalStats.categoryPerformance.logicPuzzles || { correct: 0, total: 0 };
      parsedGlobalStats.categoryPerformance.logicPuzzles.total += 1;
      if (isCorrect) {
        parsedGlobalStats.categoryPerformance.logicPuzzles.correct += 1;
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

  const generatePuzzle = () => {
    const difficultyLevel = Math.floor(score / 50);
    const puzzleTypes = Object.values(PUZZLE_TYPES);
    const selectedType = puzzleTypes[Math.floor(Math.random() * puzzleTypes.length)];
    
    let question = {};

    // switch(selectedType) {
    //   case PUZZLE_TYPES.SEQUENCE:
    //     const sequences = [
    //       {
    //         pattern: [2, 4, 6, 8],
    //         next: 10,
    //         text: "What comes next in the sequence: 2, 4, 6, 8, ?",
    //         hint: "Look for the pattern of addition"
    //       },
    //       {
    //         pattern: [1, 3, 6, 10],
    //         next: 15,
    //         text: "What comes next in the sequence: 1, 3, 6, 10, ?",
    //         hint: "Each increase is larger than the last"
    //       },
    //       {
    //         pattern: [2, 4, 8, 16],
    //         next: 32,
    //         text: "What comes next in the sequence: 2, 4, 8, 16, ?",
    //         hint: "Each number is doubled"
    //       }
    //     ];
        
    //     const selectedSequence = sequences[Math.floor(Math.random() * sequences.length)];
    //     question = {
    //       type: PUZZLE_TYPES.SEQUENCE,
    //       text: selectedSequence.text,
    //       answer: selectedSequence.next,
    //       hint: selectedSequence.hint
    //     };
    //     break;

    //   case PUZZLE_TYPES.PATTERN:
    //     const patterns = [
    //       {
    //         text: "If RED = 27, BLUE = 30, what does GREEN equal?",
    //         answer: 40,
    //         hint: "Count the value of each letter (A=1, B=2, etc.)"
    //       },
    //       {
    //         text: "If TRIANGLE = 8, SQUARE = 6, what does CIRCLE equal?",
    //         answer: 6,
    //         hint: "Count the number of lines needed to draw the shape"
    //       },
    //       {
    //         text: "If CAT = 24, DOG = 26, what does BIRD equal?",
    //         answer: 36,
    //         hint: "Add up the position of each letter in the alphabet"
    //       }
    //     ];
        
    //     const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)];
    //     question = {
    //       type: PUZZLE_TYPES.PATTERN,
    //       text: selectedPattern.text,
    //       answer: selectedPattern.answer,
    //       hint: selectedPattern.hint
    //     };
    //     break;

    //   case PUZZLE_TYPES.SYLLOGISM:
    //     const syllogisms = [
    //       {
    //         text: "All cats are mammals. All mammals breathe air. Based on this, which conclusion is correct?",
    //         answer: "All cats breathe air",
    //         options: [
    //           "All cats breathe air",
    //           "Some mammals are cats",
    //           "All air breathers are cats",
    //           "Some cats don't breathe air"
    //         ],
    //         hint: "Follow the logical connection between the statements"
    //       },
    //       {
    //         text: "All squares are rectangles. All rectangles have four sides. What can we conclude?",
    //         answer: "All squares have four sides",
    //         options: [
    //           "All squares have four sides",
    //           "All four-sided shapes are squares",
    //           "Some rectangles are not squares",
    //           "Rectangles are squares"
    //         ],
    //         hint: "Connect the properties that flow from one statement to another"
    //       }
    //     ];
        
    //     const selectedSyllogism = syllogisms[Math.floor(Math.random() * syllogisms.length)];
    //     question = {
    //       type: PUZZLE_TYPES.SYLLOGISM,
    //       text: selectedSyllogism.text,
    //       answer: selectedSyllogism.answer,
    //       options: selectedSyllogism.options,
    //       hint: selectedSyllogism.hint
    //     };
    //     break;

    //   case PUZZLE_TYPES.ANALOGY:
    //     const analogies = [
    //       {
    //         text: "Bird is to Sky as Fish is to ?",
    //         answer: "Water",
    //         options: ["Water", "Land", "Air", "Sea"],
    //         hint: "Think about natural habitats"
    //       },
    //       {
    //         text: "Hand is to Glove as Foot is to ?",
    //         answer: "Shoe",
    //         options: ["Shoe", "Sock", "Boot", "Sandal"],
    //         hint: "Think about protective coverings"
    //       }
    //     ];
        
    //     const selectedAnalogy = analogies[Math.floor(Math.random() * analogies.length)];
    //     question = {
    //       type: PUZZLE_TYPES.ANALOGY,
    //       text: selectedAnalogy.text,
    //       answer: selectedAnalogy.answer,
    //       options: selectedAnalogy.options,
    //       hint: selectedAnalogy.hint
    //     };
    //     break;

    //   case PUZZLE_TYPES.DEDUCTION:
    //     const deductions = [
    //       {
    //         text: "If John is taller than Mike, and Mike is taller than Steve, who is the shortest?",
    //         answer: "Steve",
    //         options: ["Steve", "John", "Mike", "Can't determine"],
    //         hint: "Order the heights from tallest to shortest"
    //       },
    //       {
    //         text: "If all A's are B's, and no B's are C's, what can we conclude about A's and C's?",
    //         answer: "No A's are C's",
    //         options: [
    //           "No A's are C's",
    //           "All A's are C's",
    //           "Some A's are C's",
    //           "Can't determine"
    //         ],
    //         hint: "Follow the chain of relationships"
    //       }
    //     ];
        
    //     const selectedDeduction = deductions[Math.floor(Math.random() * deductions.length)];
    //     question = {
    //       type: PUZZLE_TYPES.DEDUCTION,
    //       text: selectedDeduction.text,
    //       answer: selectedDeduction.answer,
    //       options: selectedDeduction.options,
    //       hint: selectedDeduction.hint
    //     };
    //     break;
    // }

    switch(selectedType) {
        case PUZZLE_TYPES.SEQUENCE:
          const sequences = [
            // Existing sequences
            {
              pattern: [5, 10, 15, 20],
              next: 25,
              text: "What comes next in the sequence: 5, 10, 15, 20, ?",
              hint: "Increment by 5 each time"
            },
            {
              pattern: [2, 3, 5, 7, 11],
              next: 13,
              text: "Find the next prime number in the sequence: 2, 3, 5, 7, 11, ?",
              hint: "Sequence of prime numbers"
            },
            {
              pattern: [1, 4, 9, 16],
              next: 25,
              text: "What comes next in the sequence of perfect squares: 1, 4, 9, 16, ?",
              hint: "Square of consecutive integers"
            },
            {
              pattern: [1, 1, 2, 3, 5],
              next: 8,
              text: "What comes next in the Fibonacci sequence: 1, 1, 2, 3, 5, ?",
              hint: "Sum of the two previous numbers"
            },
            {
              pattern: [100, 90, 80, 70],
              next: 60,
              text: "What comes next in the sequence: 100, 90, 80, 70, ?",
              hint: "Subtracting 10 each time"
            },
            // 15 more sequences...
            {
              pattern: [2, 5, 10, 17],
              next: 26,
              text: "Find the next number: 2, 5, 10, 17, ?",
              hint: "n² + 1 pattern"
            },
            {
              pattern: [3, 6, 12, 24],
              next: 48,
              text: "What comes next in the sequence: 3, 6, 12, 24, ?",
              hint: "Each number is doubled"
            },
            {
              pattern: [1, 3, 6, 10, 15],
              next: 21,
              text: "What comes next in the sequence: 1, 3, 6, 10, 15, ?",
              hint: "Triangular numbers"
            },
            {
              pattern: [2, 4, 7, 11, 16],
              next: 22,
              text: "Find the next number: 2, 4, 7, 11, 16, ?",
              hint: "Add increasing integers"
            },
            {
              pattern: [31, 28, 31, 30],
              next: 31,
              text: "What comes next in the sequence: 31, 28, 31, 30, ?",
              hint: "Days in successive months"
            },
            // ... (Add more sequences up to 20 new ones)
          ];
      
          const selectedSequence = sequences[Math.floor(Math.random() * sequences.length)];
          question = {
            type: PUZZLE_TYPES.SEQUENCE,
            text: selectedSequence.text,
            answer: selectedSequence.next,
            hint: selectedSequence.hint
          };
          break;
      
        case PUZZLE_TYPES.PATTERN:
          const patterns = [
            // Existing patterns
            {
              text: "If A = 1, B = 2, C = 3, then what does J equal?",
              answer: 10,
              hint: "Alphabetical position"
            },
            {
              text: "If 2 + 3 = 10 and 4 + 5 = 30, then 6 + 7 = ?",
              answer: 70,
              hint: "Multiply the sum by the first number"
            },
            {
              text: "If APPLE = ELPPA, then ORANGE = ?",
              answer: "EGNARO",
              hint: "Reverse the letters"
            },
            {
              text: "If BEAR = 25 and LION = 50, what does TIGER equal?",
              answer: 60,
              hint: "Assign value to letters (consonants = 5, vowels = 10)"
            },
            {
              text: "If BLACK = 29, WHITE = 65, what does GREEN equal?",
              answer: 49,
              hint: "Sum the positions of letters in the alphabet"
            },
            // 5 more patterns...
            {
              text: "If CLOUD = 4, RAIN = 3, what does STORM equal?",
              answer: 5,
              hint: "Count the number of consonants"
            },
            {
              text: "If DAY = 27 and NIGHT = 58, what does EVENING equal?",
              answer: 72,
              hint: "Sum of alphabetical positions"
            },
            {
              text: "If TREE relates to FOREST, then STAR relates to ?",
              answer: "Galaxy",
              hint: "Part of a larger collection"
            },
            {
              text: "If PLANE = 5 and TRAIN = 5, what does CAR equal?",
              answer: 3,
              hint: "Count the number of letters"
            },
            {
              text: "If RED = 27, BLUE = 40, what does YELLOW equal?",
              answer: 78,
              hint: "Sum the positions of the letters"
            },
          ];
      
          const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)];
          question = {
            type: PUZZLE_TYPES.PATTERN,
            text: selectedPattern.text,
            answer: selectedPattern.answer,
            hint: selectedPattern.hint
          };
          break;
      
        case PUZZLE_TYPES.SYLLOGISM:
          const syllogisms = [
            // Existing syllogisms
            {
              text: "All mammals are warm-blooded. All whales are mammals. What can we conclude?",
              answer: "All whales are warm-blooded",
              options: [
                "All whales are warm-blooded",
                "Some whales are warm-blooded",
                "Whales are not mammals",
                "Whales are cold-blooded"
              ],
              hint: "Apply properties of the group to the subset"
            },
            {
              text: "No reptiles have fur. All snakes are reptiles. What can we conclude?",
              answer: "No snakes have fur",
              options: [
                "No snakes have fur",
                "Some snakes have fur",
                "All snakes have fur",
                "Snakes are mammals"
              ],
              hint: "Universal negative statements"
            },
            {
              text: "Some artists are painters. All painters are creative. What can we conclude?",
              answer: "Some artists are creative",
              options: [
                "Some artists are creative",
                "All artists are creative",
                "No artists are creative",
                "Painters are not creative"
              ],
              hint: "Transitive relationship through a subset"
            },
            // 7 more syllogisms...
            {
              text: "All cars have wheels. Some vehicles are cars. What can we conclude?",
              answer: "Some vehicles have wheels",
              options: [
                "Some vehicles have wheels",
                "All vehicles have wheels",
                "No vehicles have wheels",
                "Vehicles are not cars"
              ],
              hint: "Overlap between categories"
            },
            {
              text: "All squares are quadrilaterals. All quadrilaterals have four sides. What can we conclude?",
              answer: "All squares have four sides",
              options: [
                "All squares have four sides",
                "Some squares have four sides",
                "Squares do not have sides",
                "Squares have more than four sides"
              ],
              hint: "Inheritance of properties"
            },
            // ... (Add more syllogisms to reach 10 new ones)
          ];
      
          const selectedSyllogism = syllogisms[Math.floor(Math.random() * syllogisms.length)];
          question = {
            type: PUZZLE_TYPES.SYLLOGISM,
            text: selectedSyllogism.text,
            answer: selectedSyllogism.answer,
            options: selectedSyllogism.options,
            hint: selectedSyllogism.hint
          };
          break;
      
        case PUZZLE_TYPES.ANALOGY:
          const analogies = [
            // Existing analogies
            {
              text: "Sword is to Warrior as Pen is to ?",
              answer: "Writer",
              options: ["Writer", "Paper", "Book", "Ink"],
              hint: "Think about tools and their users"
            },
            {
              text: "Mountain is to Climb as River is to ?",
              answer: "Swim",
              options: ["Swim", "Fish", "Boat", "Flow"],
              hint: "Activities associated with each"
            },
            {
              text: "Heart is to Body as Sun is to ?",
              answer: "Solar System",
              options: ["Solar System", "Planet", "Moon", "Galaxy"],
              hint: "Central components"
            },
            // 2 more analogies...
            {
              text: "Artist is to Painting as Chef is to ?",
              answer: "Cuisine",
              options: ["Cuisine", "Recipe", "Food", "Kitchen"],
              hint: "Creation of professionals"
            },
            {
              text: "Bird is to Nest as Bee is to ?",
              answer: "Hive",
              options: ["Hive", "Honey", "Flower", "Colony"],
              hint: "Habitats"
            },
          ];
      
          const selectedAnalogy = analogies[Math.floor(Math.random() * analogies.length)];
          question = {
            type: PUZZLE_TYPES.ANALOGY,
            text: selectedAnalogy.text,
            answer: selectedAnalogy.answer,
            options: selectedAnalogy.options,
            hint: selectedAnalogy.hint
          };
          break;
      
        case PUZZLE_TYPES.DEDUCTION:
          const deductions = [
            // Existing deductions
            {
              text: "If all pens are blue and the object in my hand is a pen, what color is it?",
              answer: "Blue",
              options: ["Blue", "Red", "Black", "Cannot Determine"],
              hint: "Apply the universal property"
            },
            {
              text: "If no one taller than 6 feet can ride the roller coaster and Mike is 6'2\", can he ride?",
              answer: "No",
              options: ["No", "Yes", "Only with permission", "Cannot Determine"],
              hint: "Apply the height restriction"
            },
            // 3 more deductions...
            {
              text: "If all fruits have seeds and a tomato has seeds, is a tomato a fruit?",
              answer: "Yes",
              options: ["Yes", "No", "Maybe", "Cannot Determine"],
              hint: "Apply the defining characteristic"
            },
            {
              text: "If some mammals lay eggs and a platypus lays eggs, is a platypus a mammal?",
              answer: "Yes",
              options: ["Yes", "No", "Maybe", "Cannot Determine"],
              hint: "Exception to common traits"
            },
            {
              text: "If all the cookies are in the jar and the jar is empty, where are the cookies?",
              answer: "There are no cookies",
              options: ["There are no cookies", "In the jar", "On the table", "Cannot Determine"],
              hint: "Logical conclusion based on the given information"
            },
          ];
      
          const selectedDeduction = deductions[Math.floor(Math.random() * deductions.length)];
          question = {
            type: PUZZLE_TYPES.DEDUCTION,
            text: selectedDeduction.text,
            answer: selectedDeduction.answer,
            options: selectedDeduction.options,
            hint: selectedDeduction.hint
          };
          break;
      }
      

    // Generate options if not already present
    if (!question.options) {
      if (typeof question.answer === 'number') {
        question.options = [
          question.answer,
          question.answer + 2,
          question.answer - 2,
          question.answer * 2
        ].sort(() => Math.random() - 0.5);
      } else {
        // Handle string answers
        question.options = [
          question.answer,
          `Not ${question.answer}`,
          `Maybe ${question.answer}`,
          "Cannot determine"
        ].sort(() => Math.random() - 0.5);
      }
    }

    setPuzzle(question);
  };

  const handleAnswer = async (selectedAnswer) => {
    const isCorrect = selectedAnswer === puzzle.answer;

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
      const newScore = score + (20 * (streak + 1));
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

    generatePuzzle();
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
            generatePuzzle();
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

  const getPuzzleIcon = () => {
    switch(puzzle?.type) {
      case PUZZLE_TYPES.SEQUENCE: return 'format-list-numbered';
      case PUZZLE_TYPES.PATTERN: return 'grid-on';
      case PUZZLE_TYPES.SYLLOGISM: return 'account-tree';
      case PUZZLE_TYPES.ANALOGY: return 'compare-arrows';
      case PUZZLE_TYPES.DEDUCTION: return 'psychology';
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
        <Text style={styles.title}>Logic Puzzles</Text>
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
        <Animated.View style={[styles.puzzleContainer, { transform: [{ scale: animation }] }]}>
          <Icon name={getPuzzleIcon()} size={hp(8)} color="#8E44AD" />
          <Text style={styles.puzzleText}>
            {puzzle?.text}
          </Text>
          <Text style={styles.hintText}>Hint: {puzzle?.hint}</Text>
        </Animated.View>

        <View style={styles.optionsContainer}>
          {puzzle?.options.map((option, index) => (
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
    puzzleContainer: {
      backgroundColor: '#34495E',
      margin: hp(2),
      padding: hp(4),
      borderRadius: hp(2),
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 5,
      minHeight: hp(30),
    },
    puzzleText: {
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
    contentPadding: {
      paddingHorizontal: wp(4),
    },
    fadeIn: {
      opacity: 1,
      transform: [{ scale: 1 }],
    },
    fadeOut: {
      opacity: 0,
      transform: [{ scale: 0.9 }],
    },
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
    // Additional styles specific to logic puzzles
    logicIcon: {
      marginBottom: hp(2),
    },
    explanationText: {
      fontSize: fs(1.6),
      color: '#BDC3C7',
      textAlign: 'center',
      marginTop: hp(1),
      fontStyle: 'italic',
    },
    difficultyText: {
      fontSize: fs(1.6),
      color: '#BDC3C7',
      textAlign: 'center',
      marginTop: hp(1),
    },
    categoryIcon: {
      position: 'absolute',
      top: hp(2),
      right: hp(2),
    },
    streakBonus: {
      position: 'absolute',
      top: hp(2),
      left: hp(2),
      backgroundColor: '#F1C40F',
      paddingHorizontal: wp(2),
      paddingVertical: hp(0.5),
      borderRadius: hp(1),
    },
    streakBonusText: {
      color: '#2C3E50',
      fontSize: fs(1.4),
      fontWeight: 'bold',
    }
  });
  
  export default LogicPuzzleScreen;