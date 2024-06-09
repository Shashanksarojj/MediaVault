import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, StatusBar, Alert } from 'react-native';
import AllRoutes from './src/AllRoutes';

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#1d6e67"
      />
      <AllRoutes />
    </GestureHandlerRootView>
  );
};

export default App;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: "#FFFFFF",
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    marginTop: 20,
  }
});
