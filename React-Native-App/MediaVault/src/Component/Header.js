import React from 'react';
import { StyleSheet, View, TouchableOpacity, Alert, Image, Text } from 'react-native';

const Header = ({ onLogout }) => {
    const handleLogoutPress = () => {
        console.log('logout');
        Alert.alert(
            'Logout',
            'Are you sure you want to log out?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'OK', onPress: onLogout },
            ],
            { cancelable: false }
        );
    };

    return (
        <View style={styles.header}>
            <TouchableOpacity style={styles.logo}>
                <Image source={require('../../assets/logo.png')} style={styles.logoImage} />
            </TouchableOpacity>
            <Text style={styles.headerText}>Media Vault</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutPress}>
                <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Header;

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#1d6e67',
        paddingVertical: 15,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerText: {
        color: '#dbfcff',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    logo: {
        position: 'absolute',
        left: 20,
    },
    logoImage: {
        width: 35, // Adjust the width and height as needed
        height: 35,
        borderRadius: 10
    },
    logoutButton: {
        position: 'absolute',
        right: 20,
    },
    logoutButtonText: {
        color: '#dbfcff',
        fontSize: 16,
    },
});
