import { View, Text, Alert, SafeAreaView, StyleSheet, ActivityIndicator,
    ScrollView, RefreshControl} from "react-native"
import React, { useEffect, useState } from "react"
import * as Location from 'expo-location'

const openWeatherKey = '4721156cd9ac3d556ddfceadb9d0100b'
//const cityName = 'Oulu'
let url = `https://api.openweathermap.org/data/2.5/weather?units=metric&exclude=minutely&appid=${openWeatherKey}`;
//let url = `https://api.openweathermap.org/data/2.5/weather?q=Oulu&units=metric&exclude=minutely&appid=4721156cd9ac3d556ddfceadb9d0100b&units=metric`;
//`api.openweathermap.org/data/2.5/weather?q=${citName}&APPID=${openWeatherKey}`
//`api.openweathermap.org/data/2.5/onecall?&units=metric&exclude=minutely&appid=${openWeatherKey}`;



const Weather = () => {
const [forecast, setForecast] = useState(null);
const [refreshing, setRefreshing] = useState(false);

const loadForecast = async () => {
    setRefreshing(true);
    // ask permission to access location
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        Alert.alert('Permission to acces location was denied');
    }

    //get the current location
    let location = await Location.getCurrentPositionAsync({enableHighAccyracy: true});

    //fetches the weather data from the openweathermap api
    const response = await fetch(`${url}&lat=${location.coords.latitude}&lon=${location.coords.longitude}`);
    console.log('API Response:', response);

    const data = await response.json(); // convert the response to json
    console.log('Weather Data:', data);

    if(!response.ok){
        Alert.alert('Error', 'Something went wrong');
    }else{
        setForecast(data);
    }
    setRefreshing(false);
}

useEffect(() => {
        loadForecast();
},[]);

if(!forecast) {
  console.log('No forecast data available');
    return(
        <SafeAreaView style={styles.loading}>
                <ActivityIndicator size='large' />
        </SafeAreaView>
    );
}


console.log('Forecast data:', forecast)

// Check if forecast.current and forecast.current.weather are defined
//const current = forecast.current && forecast.current.weather && forecast.current.weather[0];
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
      <Text style={{ alignItems: 'center', textAlign: 'center', color:'#C84B31'}}>
        Your Location
      </Text>
      <View>

  {current && (
    <Text style={styles.currentTemp}>
      {Math.round(current)}°C
    </Text>
    
  )}
</View>
    </ScrollView>
  </SafeAreaView>
);
}


export default Weather

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
current:{
    flexDirection:'row',
    alignItems:'center',
    alignContent:'center',
    color:'#C84B31'
},
currentTemp: {
  fontSize: 36,
  fontWeight:'bold',
  textAlign:'center',
  color:'#C84B31'
}

})
