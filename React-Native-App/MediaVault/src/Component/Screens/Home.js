import { StyleSheet, Text, View, Alert } from 'react-native'
import React, { useEffect, useRef } from 'react'
import MediaGallery from '../MediaGallery'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { verifyToken } from '../api';
import Header from '../Header';
import CameraButton from '../CameraButton';

const Home = ({ navigation }) => {
    const mediaGalleryRef = useRef(null);

    const checkToken = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                // console.log("token ", token)
                const data = await verifyToken(token);
                if (data?.status !== "success") {
                    navigation.navigate('Login');
                } else {
                    navigation.navigate('Home');
                }
            } else {
                await AsyncStorage.removeItem('token');
                navigation.navigate('Login');
            }
        } catch (error) {
            console.error('Error checking token:', error);
        }
    };

    const refreshMediaGallery = () => {
        if (mediaGalleryRef.current) {
            mediaGalleryRef.current.refreshMedia();
        }
    };


    const handleLogout = async () => {
        // console.log('logout');
        await AsyncStorage.removeItem('token');
        Alert.alert('Logged out', 'You have been logged out successfully.');
        navigation.navigate('Login');
    };

    useEffect(() => {
        checkToken();
    }, []);

    return (
        <View style={styles.container}>
            <Header onLogout={handleLogout} />
            <MediaGallery ref={mediaGalleryRef} navigation={navigation} />
            <CameraButton refreshMediaGallery={refreshMediaGallery} />
        </View>
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#323946',
        backgroundColor: '#6e9887'
    }
})