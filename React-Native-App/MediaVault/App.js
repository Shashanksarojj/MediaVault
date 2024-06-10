import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import AllRoutes from './src/AllRoutes';

export default function App() {
  return (
    <>
      <SafeAreaView style={styles.topSafeArea} />
      <StatusBar barStyle="light-content" showHideTransition='fade' backgroundColor={"#1d6e67"} />
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          <AllRoutes />
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    width: '100%',
  },
  logo: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'dodgerblue',
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    marginTop: 20
  },
  topSafeArea: {
    flex: 0,
  },
});
