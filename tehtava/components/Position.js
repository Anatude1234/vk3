import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Alert, StyleSheet } from "react-native";
import * as Location from 'expo-location';

const Position = ({ onPositionRetrieved }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosition = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        setLoading(false);
        return;
      }

      try {
        const location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
        onPositionRetrieved(location.coords);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch location');
      } finally {
        setLoading(false);
      }
    };

    if (loading) {
      fetchPosition();
    }
  }, [loading, onPositionRetrieved]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#C84B31" />
      ) : (
        <Text style={styles.text}>Position retrieved successfully</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  text: {
    fontSize: 18,
    color: '#C84B31',
  },
});

export default Position;