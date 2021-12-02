import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import geoLocation from './geoLocation';
import axios from 'axios'


export default function App() {
  
  const [data, setData] = useState();
  const location = geoLocation();

  const apiData = async () =>{
    const lat= location.latitude
    const lng = location.longitude
    //const api = '6a5d69a68de78bb14d0a82afd064f3e0'
    const api = 'a6e125fb1106bdf660a722513e644e3b'
    //const api = 'dabd43091243ee5e79e0ebb05c32db35'
    //const api = '3e0927d5a13dcc4deaa2653db2c19ad5'
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&exclude=hourly,daily,minutely&appid=${api}`
    const req = axios.post(url);
    const res = await req;
    setData(
      res.data
    )
  }
  useEffect(() => {
    apiData()  
  },[location])
  
  return (
    <>
    <View>
    <Text>
      {JSON.stringify(data)}
    </Text>
    </View>
    </>
  );
}