import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack';
import Signup from './Component/Screens/Signup';
import Login from './Component/Screens/Login';
import Home from './Component/Screens/Home';


const Stack = createStackNavigator();
const AllRoutes = () => {
    return (
        <View style={styles.main}>
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName="Home"

                    screenOptions={{ presentation: 'transparentModal', headerShown: false }}
                >
                    <Stack.Screen name="Login" component={Login} />
                    <Stack.Screen name="Signup" component={Signup} />
                    <Stack.Screen name="Home" component={Home} />
                </Stack.Navigator>
            </NavigationContainer>
        </View>

    )
}

export default AllRoutes

const styles = StyleSheet.create({
    main: {
        flex: 1,
    }
})