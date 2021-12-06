import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';

export default function App() {
  
const REACT_APP_API_URL = 'https://api.openweathermap.org/data/2.5'
const REACT_APP_ICON_URL = 'https://openweathermap.org/img/w'
const REACT_APP_API_KEY = '6a5d69a68de78bb14d0a82afd064f3e0'
//const REACT_APP_API_KEY = 'a6e125fb1106bdf660a722513e644e3b'
//const REACT_APP_API_KEY = 'dabd43091243ee5e79e0ebb05c32db35'
//const REACT_APP_API_KEY = '3e0927d5a13dcc4deaa2653db2c19ad5'
  const [lat, setLat] = useState([]);
  const [long, setLong] = useState([]);
  const [data, setData] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLat(location.coords.latitude,);
      setLong(location.coords.longitude)

      await fetch(`${REACT_APP_API_URL}/onecall?lat=${lat}&lon=${long}&exclude=hourly,minutely&APPID=${REACT_APP_API_KEY}`)
      .then(res => res.json())
      .then(result => {
        setData(result);
        console.log(result)
      })
      .catch(err=>setErrorMsg(err));
    }
    fetchData();
  }, [lat,long])
  
  return (
    <View>
        <Text>
         {JSON.stringify(data)}
        </Text>
    </View>
  );
}