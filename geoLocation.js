import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import * as Location from 'expo-location';

const geoLocation = ()=> {

  const [location,setLocation] = useState({
    latitude: '',
    longitude: ''
  });
  const [errorMsg, setErrorMsg] = useState(null);
  const onSuccess = location =>{
    setLocation({
      latitude:location.coords.latitude,
      longitude:location.coords.longitude
    });
  }
  
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude:location.coords.latitude,
        longitude:location.coords.longitude
      });
    })();
  }, [location.latitude]);

  let text = 'Waiting..';
  if (errorMsg) {
    alert(errorMsg);
  } else if (location) {
    text = (JSON.stringify(location))
  }

  return (location);
};

export default geoLocation;