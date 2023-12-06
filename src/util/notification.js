// Import necessary modules
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PermissionsAndroid, Platform } from "react-native";
import messaging from '@react-native-firebase/messaging';


// Constants
const TOPIC_KEY = 'subscribed_topics';

// Function to check and request notification permission
const checkAndRequestNotificationPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  }
};

// Function to subscribe to topics
const subscribeToTopics = async (topics) => {
  try {
    // Check and request notification permission
    await checkAndRequestNotificationPermission();

    const subscribedTopics = await AsyncStorage.getItem(TOPIC_KEY);
    const updatedTopics = subscribedTopics ? JSON.parse(subscribedTopics) : [];

    for (const topic of topics) {
      if (typeof topic !== 'string') {
        console.error('Invalid topic:', topic);
        continue; 
      }

      if (updatedTopics.includes(topic)) {
        console.log('Already subscribed to the topic:', topic);
        continue; 
      }

      // Subscribe to the topic
      await messaging().subscribeToTopic(topic);

      updatedTopics.push(topic);
      console.log('Subscribed to topic:', topic);
    }

    // Save subscribed topics to AsyncStorage
    await AsyncStorage.setItem(TOPIC_KEY, JSON.stringify(updatedTopics));
  } catch (error) {
    console.error('Error subscribing to topics:', error);
  }
};

export default subscribeToTopics;
