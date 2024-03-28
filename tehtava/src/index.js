import { View, Text, Alert, SafeAreaView, StyleSheet, ActivityIndicator,
  ScrollView, RefreshControl, Image} from "react-native"
import React, { useEffect, useState } from "react"
import * as Location from 'expo-location'

const openWeatherKey = '4721156cd9ac3d556ddfceadb9d0100b'
let url = `https://api.openweathermap.org/data/2.5/weather?units=metric&exclude=minutely&appid=${openWeatherKey}`;

const Weather = () => {
  const [forecast, setForecast] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [locationCoords, setLocationCoords] = useState(null);

  const loadForecast = async () => {
      setRefreshing(true);
    
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
          Alert.alert('Permission to access location was denied');
      }
    
      let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
      setLocationCoords(location.coords); 
    
      const response = await fetch(`${url}&lat=${location.coords.latitude}&lon=${location.coords.longitude}`);
      console.log('API Response:', response);
  
      const data = await response.json(); 
      console.log('Weather Data:', data);
  
      if(!response.ok){
          Alert.alert('Error', 'Something went wrong');
      } else {
          setForecast(data);
      }
      setRefreshing(false);
  }
  
  useEffect(() => {
      loadForecast();
  },[]);

  if (!forecast) {
      console.log('No forecast data available');
      return(
          <SafeAreaView style={styles.loading}>
              <ActivityIndicator size='large' />
          </SafeAreaView>
      );
  }
  
  console.log('Forecast data:', forecast)
  
  const current = forecast && forecast.main && forecast.main.temp;
  if (!current) {
      console.log('Invalid or missing data in the forecast:', forecast);
      return (
          <SafeAreaView style={styles.loading}>
              <Text>Error: Weather data not available</Text>
          </SafeAreaView>
      );
  }
  
  console.log('Temperature:', current.temp);
  console.log('Forecast data:', forecast);

  // Construct icon URL
  const iconUrl = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;

  return (
      <SafeAreaView style={styles.container}>
          <ScrollView
              refreshControl={
                  <RefreshControl
                      refreshing={refreshing}
                      onRefresh={() => loadForecast()}
                  />
              }
              style={{ marginTop: 50 }}
          >
              <Text style={styles.title}>
                  Current Weather
              </Text>
              {locationCoords && (
                  <Text style={{ alignItems: 'center', textAlign: 'center', color:'#C84B31'}}>
                      Your Location: {locationCoords.latitude}, {locationCoords.longitude}
                  </Text>
              )}
              <View style={styles.weatherContainer}>
                  {current && (
                      <View style={styles.weather}>
                          <Image style={styles.weatherIcon} source={{ uri: iconUrl }} />
                          <Text style={styles.currentTemp}>
                              {Math.round(current)}°C
                          </Text>
                      </View>
                  )}
                  {forecast.weather && (
                      <Text style={styles.weatherDescription}>
                          {forecast.weather[0].description}
                      </Text>
                  )}
              </View>
          </ScrollView>
      </SafeAreaView>
  );
}

export default Weather;

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor:'#111'
  },
  title: {
      textAlign: 'center',
      fontSize:36,
      fontWeight:'bold',
      color:'#C84B31'
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
      fontWeight:'bold',
      color:'#C84B31'
  },
  weatherDescription: {
      fontSize: 20,
      color: '#C84B31',
  }
});