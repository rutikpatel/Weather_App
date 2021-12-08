//22.37587935396417
//72.73548190542697
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, SafeAreaView, ScrollView, FlatList, Alert, RefreshControl } from 'react-native';
import * as Location from 'expo-location';
const REACT_APP_API_URL = 'https://api.openweathermap.org/data/2.5'
//const REACT_APP_API_KEY = '6a5d69a68de78bb14d0a82afd064f3e0'
const REACT_APP_API_KEY = 'a6e125fb1106bdf660a722513e644e3b'
//const REACT_APP_API_KEY = 'dabd43091243ee5e79e0ebb05c32db35'
//const REACT_APP_API_KEY = '3e0927d5a13dcc4deaa2653db2c19ad5'

const App = () => {

  const [forecast, setForecast] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [city,setCity]= useState(null);

  const loadForecast = async () => {
    setRefreshing(true);

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access location was denied');
    }

    let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
      const response = await fetch(`${REACT_APP_API_URL}/onecall?lat=${location.coords.latitude}&lon=${location.coords.longitude}&units=metric&exclude=minutely&APPID=${REACT_APP_API_KEY}`)
      const response1 = await fetch(`${REACT_APP_API_URL}/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&units=metric&exclude=minutely&APPID=${REACT_APP_API_KEY}`)

   // const response = await fetch( `${url}&lat=${location.coords.latitude}&lon=${location.coords.longitude}`);
    const data = await response.json();
    const data1 = await response1.json();
    if(!response.ok) {
      Alert.alert(`Error retrieving weather data: ${data.message}`); 
    } else {
      setForecast(data);
      if(response1.ok){
        setCity(data1.name)
      }else{
        setCity(data.timezone)
      }
      console.log(data)
    }
    setRefreshing(false);
  }

  useEffect(() => { 
    if (!forecast) {
      loadForecast(); 
    }
  })

  if (!forecast) {
    return <SafeAreaView style={styles.loading}>
      <ActivityIndicator size="large" />
      </SafeAreaView>;
  }
  const current = forecast.current.weather[0];
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        refreshControl={
          <RefreshControl 
            onRefresh={() => {  loadForecast() }} 
            refreshing={refreshing}
          />}
      >
        <Text style={styles.title}>{city}</Text>
        <View style={styles.current}>
          <Image
            style={styles.largeIcon}
            source={{
              uri: `http://openweathermap.org/img/wn/${current.icon}@4x.png`,
            }}
          />
          <Text style={styles.currentTemp}>{Math.round(forecast.current.temp)}°C</Text>
        </View>
        
        <Text style={styles.currentDescription}>{current.description}</Text>
        <View>
          <Text style={styles.subtitle}>Hourly Forecast</Text>
          <FlatList horizontal
            data={forecast.hourly.slice(0, 24)}
            keyExtractor={(item, index) => index.toString()}
            renderItem={(hour) => {
              const weather = hour.item.weather[0];
              var dt = new Date(hour.item.dt * 1000);
              return <View style={styles.hour}>
                <Text>{dt.toLocaleTimeString().replace(/:\d+ /, ' ')}</Text>
                <Text>{Math.round(hour.item.temp)}°C</Text>
                <Image
                  style={styles.smallIcon}
                  source={{
                    uri: `http://openweathermap.org/img/wn/${weather.icon}@4x.png`,
                  }}
                />
                <Text>{weather.description}</Text>
              </View>
            }}
          />
        </View>

        <Text style={styles.subtitle}>Next 5 Days</Text>
        {forecast.daily.slice(0,5).map(d => { //Only want the next 5 days
          const weather = d.weather[0];
          var dt = new Date(d.dt * 1000);
          return <View style={styles.day} key={d.dt}>
            <Text style={styles.dayTemp}>{Math.round(d.temp.max)}°C</Text>
            <Image
              style={styles.smallIcon}
              source={{
                uri: `http://openweathermap.org/img/wn/${weather.icon}@4x.png`,
              }}
            />
            <View style={styles.dayDetails}>
              <Text>{dt.toLocaleDateString()}</Text>
              <Text>{weather.description}</Text>
            </View>
          </View>
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    width: '100%',
    textAlign: 'center',
    fontSize: 32,
    color: '#000080',
  },
  subtitle: {
    fontSize: 24,
    marginVertical: 12,
    marginLeft: 4,
    color: '#e96e50',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  loading: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  current: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
  },
  currentTemp: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },  
  currentDescription: {
    width: '100%',
    textAlign: 'center',
    fontWeight: '200',
    fontSize: 24,
    marginBottom: 24
  },
  hour: {
    padding: 6,
    alignItems: 'center',
  },
  day: {
    flexDirection: 'row',
  },
  dayDetails: {
    justifyContent: 'center',
  },
  dayTemp: {
    marginLeft: 12,
    alignSelf: 'center',
    fontSize: 20
  },
  largeIcon: {
    width: 250,
    height: 200,
  },
  smallIcon: {
    width: 100,
    height: 100,
  }
});

export default App;