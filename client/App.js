import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import useCurrentLocation from './LocationComponent'; // Импортируйте новый хук

const App = () => {
  const [position, errorMsg] = useCurrentLocation();

  if (!position) {
    return (
      <View style={styles.container}>
        <Text>{errorMsg || "Loading..."}</Text>
      </View>
    );
  }

  return (
    <MapView
      style={styles.map}
      initialRegion={position}
      showsUserLocation={true}
      showsMyLocationButton={true}
      followsUserLocation={true}
      showsCompass={true}
      scrollEnabled={true}
      zoomEnabled={true}
      pitchEnabled={true}
      rotateEnabled={true}>
      <Marker
        coordinate={position}
        title='You are here'
        description='This is a description'
      />
    </MapView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default App;
