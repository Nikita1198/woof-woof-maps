import React, { useState, useEffect } from 'react';
import * as Location from 'expo-location';

const useCurrentLocation = () => {
    const [position, setPosition] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let { coords } = await Location.getCurrentPositionAsync({});
            setPosition({
                latitude: coords.latitude,
                longitude: coords.longitude,
                latitudeDelta: 0.0421,
                longitudeDelta: 0.0421,
            });
        })();
    }, []);

    return [position, errorMsg];
};

export default useCurrentLocation;
