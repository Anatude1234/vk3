import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Position from './components/Position';
import Weather from './components/Weather';

const App = () => {
  const [position, setPosition] = useState(null);

  const handlePositionRetrieved = (coords) => {
    setPosition(coords);
  };

  return (
    <View style={styles.container}>
      <Position onPositionRetrieved={handlePositionRetrieved} />
      {position && <Weather locationCoords={position} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;