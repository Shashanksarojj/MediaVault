import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import { signup } from '../api';

const Signup = ({ navigation }) => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async () => {
        try {
            const response = await signup(name, username, password);
            // If signup is successful, navigate to the login page
            if (response && response.status == "success") {
                navigation.navigate('Login');
            } else {
                Alert.alert('Signup Failed', response.message || 'Signup failed. Please try again.');
            }
        } catch (error) {
            Alert.alert('Signup Error', error.message || 'An error occurred during signup. Please try again.');
        }
    };

    return (
        <ImageBackground
            source={require("../background/a.jpeg")} // Replace with your image URL
            style={styles.backgroundImage}
        >
            <View style={styles.container}>
                <Text style={styles.title}>Signup</Text>
                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your name"
                            placeholderTextColor="#A9A9A9" // Placeholder text color
                            value={name}
                            onChangeText={setName}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Username</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your username"
                            placeholderTextColor="#A9A9A9" // Placeholder text color
                            value={username}
                            onChangeText={setUsername}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your password"
                            placeholderTextColor="#A9A9A9" // Placeholder text color
                            secureTextEntry={true}
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>
                    <TouchableOpacity style={styles.button} onPress={handleSignup}>
                        <Text style={styles.buttonText}>Signup</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.signupButton}>
                    <Text style={styles.loginText}>Already have an account? Login</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

export default Signup;


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
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: '15%',
        marginBottom: 20,
        color: 'white',
    },
    formContainer: {
        width: '90%',
        borderWidth: 1,
        backgroundColor: 'grey',
        padding: "8%",
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
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        color: 'black',
        backgroundColor: 'white',
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
    loginButton: {
        marginTop: 20,
    },
    loginText: {
        color: '#007bff',
    },
    signupButton: {
        position: 'absolute',
        bottom: 30,
    },
});
