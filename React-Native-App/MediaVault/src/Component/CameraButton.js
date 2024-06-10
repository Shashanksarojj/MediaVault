import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadMedia } from './api';

const CameraButton = ({ refreshMediaGallery }) => {
    const [hasPermission, setHasPermission] = useState(null);

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleCameraPress = async () => {
        if (!hasPermission) {
            Alert.alert('Permission Denied', 'Camera permission is required to capture images and videos.');
            return;
        }

        const options = {
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            quality: 0.5,
            base64: true,
        };

        try {
            const result = await ImagePicker.launchCameraAsync(options);

            if (!result.canceled) {
                const asset = result.assets[0];
                console.log("result.assets[0].uri : ", asset.uri);
                const { base64, duration, exif, fileName, fileSize, height, type, uri, width } = asset;
                console.log({
                    duration,
                    exif,
                    fileName,
                    fileSize,
                    height,
                    type,
                    uri,
                    width
                });
                const mediaType = 'image';

                if (base64) {
                    Alert.alert(
                        'Confirm',
                        `Do you want to save this ${mediaType}?`,
                        [
                            { text: 'Cancel', style: 'cancel' },
                            {
                                text: 'OK', onPress: async () => {
                                    const response = await uploadMedia(base64, mediaType);
                                    if (response.success) {
                                        Alert.alert('Success', response.message);
                                        refreshMediaGallery();
                                    } else {
                                        Alert.alert('Upload Failed', response.message);
                                    }
                                }
                            },
                        ],
                        { cancelable: false }
                    );
                } else {
                    console.log("Base64 Media : ", base64);
                    console.error('Invalid media response response from here:', asset.mimeType);
                }
            }
        } catch (error) {
            console.error('Error taking picture:', error);
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
        justifyContent: 'center',
    },
    cameraButtonText: {
        fontSize: 30,
        color: 'white',
    },
});
