import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LineChart, BarChart } from 'recharts';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { responsiveFontSize as fs } from "react-native-responsive-dimensions";
import AsyncStorage from '@react-native-async-storage/async-storage';

const StatisticsScreen = ({ navigation }) => {
  const [stats, setStats] = useState({
    timeHighScore: 0,
    totalProblems: 0,
    correctAnswers: 0,
    averageTime: 0,
    categoryPerformance: {
      addition: { correct: 0, total: 0 },
      subtraction: { correct: 0, total: 0 },
      multiplication: { correct: 0, total: 0 },
      division: { correct: 0, total: 0 },
    },
    recentScores: [],
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const storedStats = await AsyncStorage.getItem('mathStats');
      if (storedStats) {
        setStats(JSON.parse(storedStats));
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Icon name={icon} size={hp(4)} color={color} />
      <View style={styles.statInfo}>
        <Text style={styles.statTitle}>{title}</Text>
        <Text style={[styles.statValue, { color }]}>{value}</Text>
      </View>
    </View>
  );

  const getCategoryAccuracy = (category) => {
    const { correct, total } = stats.categoryPerformance[category];
    return total === 0 ? 0 : Math.round((correct / total) * 100);
  };

  const calculateTotalAccuracy = () => {
    const totalCorrect = stats.categoryPerformance.addition.correct + 
                        stats.categoryPerformance.subtraction.correct + 
                        stats.categoryPerformance.multiplication.correct + 
                        stats.categoryPerformance.division.correct;
    
    const totalAttempts = stats.categoryPerformance.addition.total + 
                         stats.categoryPerformance.subtraction.total + 
                         stats.categoryPerformance.multiplication.total + 
                         stats.categoryPerformance.division.total;
    
    return totalAttempts === 0 ? 0 : Math.round((totalCorrect / totalAttempts) * 100);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={hp(4)} color="#ECF0F1" />
        </TouchableOpacity>
        <Text style={styles.title}>Statistics</Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
      <View style={styles.statsGrid}>
  <StatCard
    title="High Score"
    value={stats.categoryPerformance.addition.correct + 
           stats.categoryPerformance.subtraction.correct + 
           stats.categoryPerformance.multiplication.correct + 
           stats.categoryPerformance.division.correct || 0}
    icon="emoji-events"
    color="#F1C40F"
  />
  <StatCard
    title="Total Problems"
    value={stats.categoryPerformance.addition.total + 
           stats.categoryPerformance.subtraction.total + 
           stats.categoryPerformance.multiplication.total + 
           stats.categoryPerformance.division.total || 0}
    icon="functions"
    color="#2ECC71"
  />
  <StatCard
    title="Accuracy"
    value={`${calculateTotalAccuracy()}%`}
    icon="check-circle"
    color="#3498DB"
  />
</View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Category Performance</Text>
          <View style={styles.categoryContainer}>
            {Object.keys(stats.categoryPerformance).map((category) => (
              <View key={category} style={styles.categoryCard}>
                <Text style={styles.categoryTitle}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${getCategoryAccuracy(category)}%` },
                    ]}
                  />
                </View>
                <Text style={styles.categoryPercentage}>
                  {getCategoryAccuracy(category)}%
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.recentScores}>
          <Text style={styles.chartTitle}>Recent Scores</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {stats.recentScores.map((score, index) => (
              <View key={index} style={styles.scoreCard}>
                <Text style={styles.scoreValue}>{score}</Text>
                <Text style={styles.scoreLabel}>Game {index + 1}</Text>
              </View>
            ))}
          </ScrollView>
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
  scrollContainer: {
    flex: 1,
    padding: hp(2),
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#34495E',
    width: wp(44),
    padding: hp(2),
    marginBottom: hp(2),
    borderRadius: hp(1),
    borderLeftWidth: wp(1),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  statInfo: {
    marginLeft: wp(2),
    marginTop: hp(1),
  },
  statTitle: {
    fontSize: fs(1.8),
    color: '#BDC3C7',
    marginBottom: hp(0.5),
  },
  statValue: {
    fontSize: fs(2.5),
    fontWeight: 'bold',
  },
  chartContainer: {
    backgroundColor: '#34495E',
    padding: hp(2),
    borderRadius: hp(1),
    marginVertical: hp(2),
  },
  chartTitle: {
    fontSize: fs(2.2),
    color: '#ECF0F1',
    fontWeight: '600',
    marginBottom: hp(2),
  },
  categoryContainer: {
    marginTop: hp(1),
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2),
    paddingHorizontal: wp(2),
  },
  categoryTitle: {
    width: wp(30),
    fontSize: fs(1.8),
    color: '#ECF0F1',
  },
  progressBar: {
    flex: 1,
    height: hp(1.5),
    backgroundColor: '#465C74',
    borderRadius: hp(0.75),
    marginHorizontal: wp(2),
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3498DB',
    borderRadius: hp(0.75),
  },
  categoryPercentage: {
    width: wp(15),
    fontSize: fs(1.8),
    color: '#ECF0F1',
    textAlign: 'right',
  },
  recentScores: {
    backgroundColor: '#34495E',
    padding: hp(2),
    borderRadius: hp(1),
    marginBottom: hp(2),
  },
  scoreCard: {
    backgroundColor: '#2C3E50',
    padding: hp(2),
    borderRadius: hp(1),
    marginRight: wp(2),
    alignItems: 'center',
    width: wp(20),
  },
  scoreValue: {
    fontSize: fs(2.5),
    color: '#3498DB',
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: fs(1.5),
    color: '#BDC3C7',
    marginTop: hp(0.5),
  },
});

export default StatisticsScreen;