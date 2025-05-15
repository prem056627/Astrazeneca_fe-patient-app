import { View, ActivityIndicator, StyleSheet, Image } from 'react-native';
import React from 'react';

export default function LoaderScreen() {
  return (
    <View style={styles.container}>
      {/* <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      /> */}
      <ActivityIndicator size="large" color="#A11327" style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 30,
  },
  loader: {
    marginTop: 20,
  }
});