import React from 'react';
import { StyleSheet, Text, TouchableOpacity, Alert, PermissionsAndroid } from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CameraButton = ({ refreshMediaGallery }) => {

    const requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: "Camera Permission",
                    message: "App needs camera permission",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
            console.warn(err);
            return false;
        }
    };

    const handleCameraPress = async () => {
        const hasPermission = await requestCameraPermission();
        if (!hasPermission) {
            Alert.alert('Permission Denied', 'Camera permission is required to capture images and videos.');
            return;
        }

        const options = {
            mediaType: 'mixed', // Allow both photos and videos
            includeBase64: true,
        };

        launchCamera(options, async (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.error('ImagePicker Error: ', response.errorMessage);
            } else {
                const asset = response.assets[0];
                const base64Media = asset.base64;
                const mediaType = asset.type.startsWith('image/') ? 'image' : 'video';

                if (base64Media) {
                    Alert.alert(
                        'Confirm',
                        `Do you want to save this ${mediaType}?`,
                        [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'OK', onPress: () => uploadMedia(base64Media, mediaType) },
                        ],
                        { cancelable: false }
                    );
                } else {
                    console.error('Invalid media response:', response);
                }
            }
        });
    };

    const uploadMedia = async (base64Media, mediaType) => {
        const token = await AsyncStorage.getItem('token');
        const formData = new FormData();
        formData.append(mediaType, {
            uri: `data:${mediaType}/${mediaType === 'image' ? 'jpeg' : 'mp4'};base64,${base64Media}`,
            type: `${mediaType}/${mediaType === 'image' ? 'jpeg' : 'mp4'}`,
            name: `media.${mediaType === 'image' ? 'jpg' : 'mp4'}`,
        });

        try {
            const response = await fetch('https://media-vault-app.vercel.app/api/media/uploadImage', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            try {
                const data = await response.json();
                // Handle successful parsing
                if (data && data?.status === 'success') {
                    refreshMediaGallery();
                    Alert.alert('Success', `${mediaType === 'image' ? 'Image' : 'Video'} uploaded successfully.`);
                } else {
                    Alert.alert('Upload Failed', `There was an error uploading the ${mediaType}.`);
                }
            } catch (error) {
                // Handle parsing error
                console.error(`Error parsing JSON:`, error);
                Alert.alert('JSON Parse Error', `An error occurred while parsing the server response.`);
            }

        } catch (error) {
            console.error(`Error uploading ${mediaType}:`, error);
            Alert.alert('Upload Error', `An error occurred while uploading the ${mediaType}.`);
        }
    };

    return (
        <TouchableOpacity style={styles.cameraButton} onPress={handleCameraPress}>
            <Text style={styles.cameraButtonText}>📷</Text>
        </TouchableOpacity>
    );
};

export default CameraButton;

const styles = StyleSheet.create({
    cameraButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#0ef',
        borderRadius: 50,
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center'
    },
    cameraButtonText: {
        fontSize: 30,
        color: 'white'
    }
});