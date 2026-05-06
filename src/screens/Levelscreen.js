/**
 * Levelscreen — Math Master v3.0
 * Shows 100 riddle levels in a grid with progression logic
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useGame } from '../context/GameContext';
import { Colors, Gradients } from '../theme/colors';
import { FontSizes, Fonts } from '../theme/typography';
import { GradientHeader } from '../components/UIComponents';
import { getTotalRiddles } from '../data/riddleData';

const Levelscreen = ({ navigation }) => {
  const { state, t, engine } = useGame();
  const totalRiddles = getTotalRiddles();
  
  // Calculate unlocked levels based on XP or total riddles completed
  // For simplicity: each level unlocked after previous one is completed
  // We can use a smarter logic: level is unlocked if (level-1) is solved
  // We'll use the totalCorrect in 'riddles' category if we had that, but let's use global level for now
  const unlockedLevels = Math.min(Math.floor(state.xp / 10) + 1, totalRiddles);

  const renderLevel = ({ item: levelNum }) => {
    const isUnlocked = levelNum <= unlockedLevels;
    
    return (
      <TouchableOpacity
        style={[styles.levelBtn, !isUnlocked && styles.lockedBtn]}
        disabled={!isUnlocked}
        onPress={() => navigation.navigate('Questionscreen', { levelNumber: levelNum })}
      >
        <LinearGradient 
          colors={isUnlocked ? Gradients.riddles : Gradients.card} 
          style={styles.levelGradient}
          start={{x:0,y:0}} end={{x:1,y:1}}
        >
          {isUnlocked ? (
            <Text style={styles.levelNum}>{levelNum}</Text>
          ) : (
            <Icon name="lock" size={hp(3)} color={Colors.textMuted} />
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const levels = Array.from({ length: totalRiddles }, (_, i) => i + 1);

  return (
    <LinearGradient colors={Gradients.screenBg} style={styles.container}>
      <GradientHeader title={t('categories.riddles')} onBack={() => navigation.goBack()} />
      
      <FlatList
        data={levels}
        renderItem={renderLevel}
        keyExtractor={item => item.toString()}
        numColumns={4}
        contentContainerStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              {unlockedLevels}/{totalRiddles} Levels Unlocked
            </Text>
            <View style={styles.progressBg}>
              <View style={[styles.progressFill, { width: `${(unlockedLevels/totalRiddles)*100}%` }]} />
            </View>
          </View>
        }
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  gridContent: { padding: wp(4), paddingBottom: hp(5) },
  levelBtn: {
    width: wp(20),
    height: wp(20),
    margin: wp(1.5),
    borderRadius: hp(2),
    overflow: 'hidden',
    elevation: 3
  },
  levelGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  levelNum: { color: '#fff', fontSize: FontSizes.lg, fontWeight: Fonts.bold },
  lockedBtn: { opacity: 0.5 },
  infoBox: { marginBottom: hp(3), alignItems: 'center' },
  infoText: { color: Colors.textPrimary, fontSize: FontSizes.md, fontWeight: Fonts.semiBold, marginBottom: hp(1) },
  progressBg: { width: '80%', height: hp(1), backgroundColor: Colors.surface, borderRadius: hp(0.5), overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.accent }
});

export default Levelscreen;