import React, { useRef, useState, useEffect } from 'react';
import { TouchableOpacity, Text, TextInput, View, Image, Alert } from 'react-native';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { firebaseConfig, createAccountIfNotUser, checkIfPhoneExists, auth } from '../firebaseConfig';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import PhoneInput from "react-native-phone-number-input";
import styles from '../styles';
import { setPersistence, signInWithRedirect, inMemoryPersistence, GoogleAuthProvider } from "firebase/auth";


const PhoneAuth = ({navigation}) => {
    const [phoneNumberWithCode, setPhoneNumberWithCode] = useState('+1');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [code, setCode] = useState('');
    const [verificationId, setVerificationId] = useState(null);
    const recaptchaVerifier = useRef(null);
    const [confirming, setConfirming] = useState(true);

    const press = () => {
        setPhoneNumber('');
        setCode('');
        setConfirming(true);
    }

    const sendVerification = () => {
        const phoneProvider = new firebase.auth.PhoneAuthProvider();
        phoneProvider
        .verifyPhoneNumber(phoneNumberWithCode, recaptchaVerifier.current)
        .then(setVerificationId);
        setConfirming(!confirming);
        setCode('');
    };

    const confirmCode = () => {
        const credential = firebase.auth.PhoneAuthProvider.credential(
            verificationId,
            code
        );
        firebase.auth().signInWithCredential(credential)
        .then(() => {
            setCode('');
            checkIfPhoneExists(phoneNumberWithCode).then((userExists) => {
                if (userExists) {
                    navigation.navigate('Threads');
                } else {
                    navigation.navigate('EnterInfo');
                }
            })
            createAccountIfNotUser(phoneNumberWithCode);
        }).catch((error) => {
            console.log(error);
        });
        console.log(auth, firebase.auth())

    };

    useEffect(() => {
        // firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch((error) => {
        //     console.error('Error setting persistence:', error);
        // });
    }, []);

  return (
    <KeyboardAwareScrollView contentContainerStyle={{aligntext: 'center', justifyContent: 'center', alignItems: 'center', backgroundColor: '#edf6f9', height: '100%'}}>
        <View style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}>
            <FirebaseRecaptchaVerifierModal
            ref={recaptchaVerifier}
            firebaseConfig={firebaseConfig}
            attemptInvisibleVerification={true}
            />
            {confirming
            ? 
            <View style={{width: '70%', marginBottom: '10%', alignItems: 'center', justifyContent: 'center'}}>
                <Image source={require('../images/forepay-text-logo.png')}
                        style={{width: 210, height: 47, marginLeft: 15, marginBottom: 7, marginTop: '-55%'}} />
                <Text style={{fontStyle:'italic', marginBottom: '40%', textAlign: 'center'}}>Asking can be awkward</Text>
                <Text style={{fontSize: 17, marginBottom: '10%', textAlign: 'center'}}>Enter your phone number to login or create an account:</Text>
                <View style={{marginBottom: 30}}>
                    <PhoneInput
                        defaultValue={phoneNumber}
                        defaultCode="US"
                        layout="first"
                        onChangeText={(text) => {
                            setPhoneNumber(text);
                        }}
                        onChangeFormattedText={(text) => {
                            setPhoneNumberWithCode(text);
                        }}
                        withDarkTheme
                        withShadow
                        autoFocus
                    />
                </View>
                
                <TouchableOpacity
                style={styles.sendCode}
                disabled={!phoneNumber}
                onPress={sendVerification}
                >
                    <Text style={styles.buttonText}>Send Verification</Text>
                </TouchableOpacity>
            </View>
            
            : 
            <View style={{width: '70%', marginBottom: '10%'}}>
                <TouchableOpacity style={{alignItems: 'center'}} onPress={() => press()}>
                    <Image source={require('../images/back.png')}
                        style={{width: 25, height: 25, marginTop: '-72%', marginLeft: '-110%'}} />
                </TouchableOpacity>
                <Text style={{fontSize: 17, marginBottom: 40, marginTop: '0%', textAlign: 'center'}}>Please enter your confirmation code below:</Text>
                <TextInput
                placeholder="Confirmation Code"
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                style={styles.textInput}
                />
                <TouchableOpacity style={styles.sendCode} onPress={confirmCode}>
                    <Text style={styles.buttonText}>Sign In</Text>
                </TouchableOpacity>
            </View>
            }
            
        </View>
    </KeyboardAwareScrollView>
  );
};

export default PhoneAuth;