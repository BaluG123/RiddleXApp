/**
 * Questionscreen (Riddles) — Math Master v3.0
 * Uses offline riddle data and modern UI
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Alert,
  Modal
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useGame } from '../context/GameContext';
import { getRiddle } from '../data/riddleData';
import { Colors, Gradients } from '../theme/colors';
import { FontSizes, Fonts } from '../theme/typography';
import { GradientHeader, CoinDisplay } from '../components/UIComponents';
import adManager from '../util/adManager';

const Questionscreen = ({ route, navigation }) => {
  const { levelNumber } = route.params;
  const { state, t, engine, checkAchievements } = useGame();
  const [riddle, setRiddle] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showHintModal, setShowHintModal] = useState(false);
  const [showSolutionModal, setShowSolutionModal] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    const data = getRiddle(levelNumber);
    setRiddle(data);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, [levelNumber]);

  const handleSubmit = async () => {
    if (!userAnswer.trim()) {
      Alert.alert(t('common.error'), t('riddle.enterAnswer'));
      return;
    }

    const isCorrect = userAnswer.trim().toLowerCase() === riddle.answer.toLowerCase();

    if (isCorrect) {
      await engine.recordCorrect('riddles', 1.5); // Riddles give more XP
      await checkAchievements();
      navigation.navigate('SuccessScreen', { 
        nextLevel: levelNumber + 1,
        xpEarned: 15,
        coinsEarned: 10
      });
    } else {
      Alert.alert(t('game.wrong'), t('game.wrong'));
      await engine.recordWrong();
    }
  };

  const handleHint = async () => {
    if (await engine.spendCoins(30)) {
      setShowHintModal(true);
    } else {
      Alert.alert(t('game.hint'), t('riddle.watchAdHint'), [
        { text: t('common.watchAd'), onPress: async () => {
          const shown = await adManager.showRewardedAdForHint();
          if (shown) setShowHintModal(true);
        }},
        { text: t('common.cancel'), style: 'cancel' }
      ]);
    }
  };

  const handleSolution = async () => {
    Alert.alert(t('riddle.viewSolution'), t('riddle.watchAdSolution'), [
      { text: t('common.watchAd'), onPress: async () => {
        const shown = await adManager.showRewardedAdForSolution();
        if (shown) setShowSolutionModal(true);
      }},
      { text: t('common.cancel'), style: 'cancel' }
    ]);
  };

  if (!riddle) return null;

  return (
    <LinearGradient colors={Gradients.screenBg} style={styles.container}>
      <GradientHeader 
        title={t('riddle.level', { num: levelNumber })} 
        onBack={() => navigation.goBack()} 
        rightComponent={<CoinDisplay count={state.coins} />}
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], alignItems: 'center' }}>
            <LinearGradient 
              colors={Gradients.riddles} 
              style={styles.questionCard}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
            >
              <Icon name="psychology" size={hp(6)} color="#fff" style={styles.icon} />
              <Text style={styles.questionText}>{riddle.math_question}</Text>
            </LinearGradient>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder={t('game.enterAnswer')}
                placeholderTextColor={Colors.textMuted}
                value={userAnswer}
                onChangeText={setUserAnswer}
                autoCorrect={false}
              />
              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                <LinearGradient colors={Gradients.button} style={styles.submitGradient}>
                  <Text style={styles.submitText}>{t('game.submit')}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.actionBtn} onPress={handleHint}>
                <Icon name="lightbulb" size={hp(3)} color={Colors.accentYellow} />
                <Text style={styles.actionText}>{t('game.hint')}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionBtn} onPress={handleSolution}>
                <Icon name="visibility" size={hp(3)} color={Colors.accentGreen} />
                <Text style={styles.actionText}>{t('game.solution')}</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Hint Modal */}
      <Modal visible={showHintModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <GradientCard gradient={Gradients.card} style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('game.hint')}</Text>
            <Text style={styles.modalText}>{riddle.hint}</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowHintModal(false)}>
              <Text style={styles.closeBtnText}>{t('common.gotIt')}</Text>
            </TouchableOpacity>
          </GradientCard>
        </View>
      </Modal>

      {/* Solution Modal */}
      <Modal visible={showSolutionModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <GradientCard gradient={Gradients.card} style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('game.solution')}</Text>
            <Text style={styles.modalText}>{riddle.solution}</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowSolutionModal(false)}>
              <Text style={styles.closeBtnText}>{t('common.gotIt')}</Text>
            </TouchableOpacity>
          </GradientCard>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: wp(5), paddingBottom: hp(10) },
  questionCard: {
    width: '100%',
    minHeight: hp(30),
    borderRadius: hp(3),
    padding: hp(3),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    marginBottom: hp(3)
  },
  icon: { marginBottom: hp(2) },
  questionText: {
    color: '#fff',
    fontSize: FontSizes.lg,
    fontWeight: Fonts.bold,
    textAlign: 'center',
    lineHeight: FontSizes.lg * 1.4
  },
  inputContainer: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: hp(2),
    padding: hp(1),
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    marginBottom: hp(3)
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: FontSizes.md,
    paddingHorizontal: wp(4),
    height: hp(7)
  },
  submitBtn: {
    borderRadius: hp(1.5),
    overflow: 'hidden'
  },
  submitGradient: {
    paddingHorizontal: wp(6),
    paddingVertical: hp(1.5),
    alignItems: 'center',
    justifyContent: 'center'
  },
  submitText: {
    color: '#fff',
    fontSize: FontSizes.md,
    fontWeight: Fonts.bold
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%'
  },
  actionBtn: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: hp(2),
    borderRadius: hp(2),
    width: wp(40),
    borderWidth: 1,
    borderColor: Colors.glassBorder
  },
  actionText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    marginTop: hp(1),
    fontWeight: Fonts.medium
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp(10)
  },
  modalContent: {
    width: '100%',
    padding: hp(4),
    alignItems: 'center'
  },
  modalTitle: {
    color: Colors.accentYellow,
    fontSize: FontSizes.xl,
    fontWeight: Fonts.bold,
    marginBottom: hp(2)
  },
  modalText: {
    color: '#fff',
    fontSize: FontSizes.md,
    textAlign: 'center',
    marginBottom: hp(3),
    lineHeight: FontSizes.md * 1.5
  },
  closeBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: wp(8),
    paddingVertical: hp(1.5),
    borderRadius: hp(3)
  },
  closeBtnText: {
    color: '#fff',
    fontSize: FontSizes.md,
    fontWeight: Fonts.bold
  }
});

export default Questionscreen;