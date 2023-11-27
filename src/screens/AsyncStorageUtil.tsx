import AsyncStorage from '@react-native-async-storage/async-storage';

export const updateCompletedLevel = async (levelNumber) => {
  await AsyncStorage.setItem('completedLevel', levelNumber.toString());
};
