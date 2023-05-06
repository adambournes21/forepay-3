import { useState, useRef } from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity, Touchable } from 'react-native';
import { firebaseConfig } from '../firebaseConfig';
import firebase from 'firebase/compat/app';

const Login = ({navigation}) => {

    const [number, setNumber] = useState("");
    const recaptchaVerifier = useRef(null);

    return (
        <View style={{display: 'flex', justifyContent: 'center', 
        alignItems: 'center', height: '100%', width: '100%', 
        backgroundColor: '#EDF6F9', paddingTop: 100, height: '90%'}}>
            <Text style={{fontSize: 60, flex: 3, marginTop: '15%'}}>Forepay</Text>
            <View style={{flex: 10, alignItems: 'center', textAlign: 'center', width: '60%'}}>
                <Text>Phone Number:</Text>
                <TextInput
                    style={{fontSize: 20, padding: 5, margin: 15, textAlign: 'center', borderWidth: 2, borderRadius: 5, width: '80%'}}
                    onChangeText={setNumber}
                    value={number}
                    keyboardType="numeric"
                    selectionColor="blue"
                    textAlign="center"
                />
                <TouchableOpacity 
                    style={{padding: 12, backgroundColor: 'blue', borderRadius: 5, marginTop: 40, 
                    width: '40%', alignItems: 'center'}}
                    onPress={() => navigation.navigate('RegisterCode')}>
					<Text>Login</Text>
				</TouchableOpacity>
                <TouchableOpacity style={{paddingTop: 15}} onPress={() => navigation.navigate('Register')}>
                    <Text>Register</Text>
                </TouchableOpacity>
            </View>
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default Login;