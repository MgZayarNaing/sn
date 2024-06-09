import React, { useEffect, useState, useRef } from 'react';
import { TouchableOpacity, Animated, Easing, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import FastImage from 'react-native-fast-image';
import {useNetInfo} from "@react-native-community/netinfo";

import {
  Text,
  View,
  Image, 
  StyleSheet
} from 'react-native';

function App(){
  const [isLanding, SetIsLanding] = useState(true)
  
  const netInfo = useNetInfo();
  // console.log("is connect",netInfo.isConnected)
  // console.log("is internet",netInfo.isInternetReachable)
  // console.log("is wifi",netInfo.isWifiEnabled)
  // console.log("is type",netInfo.type)

  const fadeAnim = useState(new Animated.Value(0))[0];
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const moveAnimation = useRef(new Animated.Value(0)).current;

  const fade = () => {
    Animated.timing(fadeAnim, {
      toValue: 2,
      duration: 5000,
      useNativeDriver: true,
    }).start();
  }

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 50,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const move = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(moveAnimation, {
          toValue: 70, // Move to the right
          duration: 2000, // Duration for moving right
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(moveAnimation, {
          toValue: -70, // Move to the left
          duration: 2000, // Duration for moving left
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(moveAnimation, {
          toValue: 1, // Move to the right
          duration: 2000, // Duration for moving right
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        
      ]),
      { iterations: -1 } // Loop indefinitely
    ).start();
  };

  useEffect(() => {
    fade();
    shake();
    move();
  }, []);

  useEffect(()=>{
    fade();
    shake();
    move();
    setTimeout(() => {
      SetIsLanding(false)
    }, 3000);
  },[isLanding])

  const INJECTEDJAVASCRIPT = `const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `

  return (
    <View style={styles.mainContainter}>
      {isLanding ? (
        <Animated.View
          style={[
            styles.container, 
            {

            transform: [{ translateX: moveAnimation }],
            }]}
        >
          <Image
            source={require('./logo.png')}
            style={styles.image2}
          />
        </Animated.View>
      ) : (
        netInfo.isConnected ? (
          <WebView 
            source={{ uri: 'https://seinnandawdiamond.com/' }} 
            style={{ flex: 1 }}
            scalesPageToFit={Platform.OS === 'android' ? false : true}
            injectedJavaScript={INJECTEDJAVASCRIPT}
            scrollEnabled 
          />
        ) : (
          <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <Image
              source={require('./logo.png')}
              style={styles.image}
            />
            <FastImage
              source={require('./noconnect.gif')}
              style={styles.gif}
              resizeMode={FastImage.resizeMode.contain} // Adjust resizeMode if needed
            />
            <Text style={styles.message}>
              Please check your internet connection.
            </Text>
            <Text style={styles.offlineMessage}>
              You are offline now.
            </Text>
            <TouchableOpacity style={styles.btn} onPress={() => SetIsLanding(true)}>
              <Text style={styles.btntext}>Try Again</Text>
            </TouchableOpacity>
          </Animated.View>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainter: {
    flex: 1,
    backgroundColor: '#FEFEFE',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEFEFE',
  },
  gif: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginTop: 100
  },
  image2: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginTop: 210
  },
  message: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#000',
  },
  offlineMessage: {
    fontSize: 16,
    textAlign: 'center',
    color: 'red',
    marginBottom: 15,
  },
  btn: {
    backgroundColor: '#e53434',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  btntext: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
export default App;
