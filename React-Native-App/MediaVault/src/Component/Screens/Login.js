import React, { useState, useEffect } from 'react';
import { StyleSheet, Alert, Text, View, TextInput, TouchableOpacity, ImageBackground, Keyboard, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '../api';

const Login = ({ navigation }) => {
    const [username, setUsername] = useState(''),
        [password, setPassword] = useState('');

    // useEffect(() => {
    //     AsyncStorage.getItem('token').then((token) => {
    //         if (token) {

    //             // navigation.navigate('Home');
    //             // const pushAction = StackActions.push('MainPage');
    //             // const jumpAction = DrawerActions.jumpTo('MainPage');
    //             // navigation.dispatch(jumpAction)
    //         } else {
    //             // navigation.navigate('LoginScreen');
    //         }
    //     });
    // }, []);


    const handleLoginPress = async () => {
        if (!username || !password) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        try {
            // console.log(username, password); 
            const result = await login(username, password);
            console.log("Result : ", result);
            if (result.status === 'success') {

                const token = result.token;
                const username = result.username;

                console.log("username from Login : ", username);

                await AsyncStorage.setItem('token', token);
                await AsyncStorage.setItem('username', username);

                navigation.navigate('Home');

            } else {
                Alert.alert('Please Enter Valid Credentials.');
            }
        } catch (error) {
            console.error('Login failed:', error.message);
            Alert.alert('Error', 'Invalid email or password.');
        }
    };
    return (
        <ImageBackground
            source={require("../background/a.jpeg")} // Replace with your image URL
            style={styles.backgroundImage}
        >
            <View style={styles.container}>
                <Text style={styles.title}>Login</Text>
                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Username</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your username"
                            placeholderTextColor="#A9A9A9" // Placeholder text color
                            onChangeText={(text) => setUsername(text)}
                            onSubmitEditing={() => {
                                passwordInputRef.focus();
                            }}
                            returnKeyType="next"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => setPassword(text)}
                            placeholder="Enter your password"
                            placeholderTextColor="#A9A9A9" // Placeholder text color
                            secureTextEntry={true}
                            ref={ref => {
                                passwordInputRef = ref;
                            }}
                            onSubmitEditing={() => {
                                Keyboard.dismiss();
                                handleLoginPress();
                            }}
                            returnKeyType="done"
                        />
                    </View>
                    <TouchableOpacity onPress={handleLoginPress} style={styles.button}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate("Signup")} style={styles.signupButton}>
                    <Text style={styles.signupText}>Don't have an account? Sign Up</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

export default Login;

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    container: {
        flex: 1,
        // justifyContent: 'center',

        alignItems: 'center',
        // backgroundColor: '#fff',
        // borderWidth: 1
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: "15%",
        marginBottom: 20,
        color: 'white'
    },
    formContainer: {
        width: '90%',
        padding: '8%',
        backgroundColor: 'grey',
        borderRadius: 10

    },
    inputContainer: {
        marginBottom: 10,
    },
    label: {
        marginBottom: 5,
        fontWeight: 'bold',
        color: 'white',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        color: 'black',
        backgroundColor: 'white'
    },
    button: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    signupButton: {
        position: 'absolute',
        bottom: 30,
    },
    signupText: {
        color: '#007bff',
    },
});
