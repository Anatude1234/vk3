import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, ScrollView, RefreshControl, Image, StyleSheet, Alert, ActivityIndicator } from "react-native";

const openWeatherKey = '';
const url = `https://api.openweathermap.org/data/2.5/weather?units=metric&exclude=minutely&appid=${openWeatherKey}`;

const Weather = ({ locationCoords }) => {
  const [forecast, setForecast] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadForecast = async () => {
    setRefreshing(true);

    try {
      const response = await fetch(`${url}&lat=${locationCoords.latitude}&lon=${locationCoords.longitude}`);
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data = await response.json();
      setForecast(data);
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while fetching weather data');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (locationCoords) {
      loadForecast();
    }
  }, [locationCoords]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadForecast} />
        }
        style={styles.scrollView}
      >
        <Text style={styles.title}>Current Weather</Text>
        {locationCoords && (
          <Text style={styles.locationText}>
            Your Location: {locationCoords.latitude}, {locationCoords.longitude}
          </Text>
        )}
        {forecast ? (
          <View style={styles.weatherContainer}>
            <View style={styles.weather}>
              <Image style={styles.weatherIcon} source={{ uri: `http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png` }} />
              <Text style={styles.currentTemp}>{Math.round(forecast.main.temp)}°C</Text>
            </View>
            <Text style={styles.weatherDescription}>{forecast.weather[0].description}</Text>
          </View>
        ) : (
          <ActivityIndicator size="large" color="#C84B31" />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  scrollView: {
    marginTop: 50,
  },
  title: {
    textAlign: 'center',
    fontSize: 36,
    fontWeight: 'bold',
    color: '#C84B31',
  },
  locationText: {
    textAlign: 'center',
    color: '#C84B31',
  },
  weatherContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  weather: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherIcon: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  currentTemp: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#C84B31',
  },
  weatherDescription: {
    fontSize: 20,
    color: '#C84B31',
  },
});

export default Weather;