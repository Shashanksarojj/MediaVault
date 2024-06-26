import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, FlatList, Dimensions, Alert, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Video } from 'expo-av'; // Importing Video from expo-av
import { fetchMedia, deleteMedia } from './api';

const MediaGallery = forwardRef(({ navigation }, ref) => {
    const [jwtToken, setJwtToken] = useState(null);
    const [media, setMedia] = useState([]);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [selectedForDeletion, setSelectedForDeletion] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false); // State to manage video playback

    useEffect(() => {
        AsyncStorage.getItem('token').then((token) => {
            if (token) {
                setJwtToken(token);
                getMedia(token);
            } else {
                navigation.navigate('Login');
            }
        });
    }, []);

    const getMedia = async (token) => {
        const data = await fetchMedia(token);
        if (data?.message == "Invalid token.") {
            await AsyncStorage.setItem('token', null);
            navigation.navigate("Login");
        }
        setMedia(data);
    };

    const handleRefresh = async () => {
        if (jwtToken) {
            setRefreshing(true);
            await getMedia(jwtToken);
            setRefreshing(false);
        }
    };

    useImperativeHandle(ref, () => ({
        refreshMedia: () => {
            if (jwtToken) {
                getMedia(jwtToken);
            }
        }
    }));

    const handleLongPress = (item) => {
        setSelectedForDeletion(item);
        Alert.alert(
            'Delete Media',
            'Are you sure you want to delete this media?',
            [
                { text: 'Cancel', onPress: () => setSelectedForDeletion(null), style: 'cancel' },
                { text: 'Delete', onPress: () => deleteSelectedMedia(item) },
            ],
            { cancelable: true }
        );
    };

    const deleteSelectedMedia = async (item) => {
        if (jwtToken) {
            const result = await deleteMedia(jwtToken, item._id);
            if (result.status == 'success') {
                setMedia(media.filter(mediaItem => mediaItem._id !== item._id));
                setSelectedForDeletion(null);
                alert("Deletion successfully!")
            } else {
                Alert.alert('Error', 'Failed to delete the media.');
            }
        }
    };

    const renderMediaItem = ({ item }) => (
        <TouchableOpacity
            style={styles.box}
            onPress={() => setSelectedMedia(item)}
            onLongPress={() => handleLongPress(item)}
        >
            {item.mimeType.startsWith('image/') ? (
                <Image source={{ uri: item.ImageUrl }} style={styles.thumbnail} />
            ) : (
                <View style={styles.thumbnail}>
                    <Video
                        ref={videoRef}
                        source={{ uri: item.ImageUrl }}
                        style={styles.videoThumbnail}
                        resizeMode="cover"
                        shouldPlay={isPlaying && selectedMedia && selectedMedia._id === item._id} // Auto play when selected
                    />
                </View>
            )}
            <Text style={styles.mediaText}>{item.mimeType.startsWith('image/') ? "Image" : 'Video'}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={media}
                renderItem={renderMediaItem}
                keyExtractor={(item) => item._id}
                numColumns={3}
                contentContainerStyle={styles.grid}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                    />
                }
            />
            {selectedMedia && (
                <Modal
                    visible={true}
                    transparent={true}
                    onRequestClose={() => setSelectedMedia(null)}
                >
                    <View style={styles.modalContainer}>
                        <TouchableOpacity style={styles.modalCloseButton} onPress={() => setSelectedMedia(null)}>
                            <Text style={styles.modalCloseButtonText}>Close</Text>
                        </TouchableOpacity>
                        {selectedMedia.mimeType.startsWith('image/') ? (
                            <Image source={{ uri: selectedMedia.ImageUrl }} style={styles.fullImage} />
                        ) : (
                            <Video
                                ref={videoRef}
                                source={{ uri: selectedMedia.ImageUrl }}
                                style={styles.fullImage}
                                useNativeControls={true}
                                resizeMode="contain"
                                isLooping
                                shouldPlay={isPlaying && selectedMedia._id === selectedMedia._id} // Auto play when selected
                            />
                        )}
                    </View>
                </Modal>
            )}
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    grid: {
        justifyContent: 'space-between',
    },
    box: {
        width: '33%',
        borderWidth: 2,
        borderColor: '#0ef',
        backgroundColor: '#323946',
        borderRadius: 10,
        margin: 1,
    },
    mediaText: {
        color: 'white',
        textAlign: 'center',
    },
    thumbnail: {
        width: Dimensions.get('window').width / 3 - 20,
        height: Dimensions.get('window').width / 3 - 20,
        margin: 5,
        borderRadius: 5,
    },
    videoThumbnail: {
        width: '100%',
        height: '100%',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    modalCloseButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 5,
        borderWidth: 1,
        zIndex: 1,
    },
    modalCloseButtonText: {
        color: 'black',
    },
    fullImage: {
        width: '90%',
        height: '90%',
        resizeMode: 'contain',
    },
});

export default MediaGallery;
