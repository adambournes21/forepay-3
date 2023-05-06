import React, {useState} from 'react';
import {View, Text, Alert, Image, TouchableOpacity} from 'react-native';

import {TextField, Button} from '../components/Form';
import {usernameIsTaken, addUserToThread} from '../firebaseConfig';

const AddUser = ({navigation, route}) => {

    const threadID = route.params.threadID;
    const theUsername = route.params.username;
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePress = () => {
        setLoading(true);
        console.log(username);
        usernameIsTaken(username).then((taken) => {
            if (taken) {
                addUserToThread(username, threadID);
                navigation.pop();
            } else {
                alert("This is not a user");
            }
        }).finally(() => {
            setLoading(false);
        })
        
    };

  return (
    <View style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'center', 
                    height: '100%', width: '100%', backgroundColor: '#EDF6F9', paddingTop: 45}}>
            <View style={{display: 'flex', width: '80%', flexDirection: 'row',
                    justifyContent: 'space-between', alignItems: 'center', 
                    marginTop: '5%', marginBottom: '3%', marginLeft: '20%', marginRight: '20%'}}>
                <TouchableOpacity style={{flex: 2, alignItems: 'center'}} onPress={() => navigation.pop()}>
                    <Image source={require('../images/back.png')}
                        style={{width: 25, height: 25, marginRight: 70}} />
                </TouchableOpacity>
                <Text style={{flex: 4, textAlign: 'center', alignItems: 'center', fontSize: 25, fontFamily: 'Arial'}}>Add Members</Text>
                <TouchableOpacity onPress={null} style={{flex: 2, alignItems: 'center', marginTop: 2}}><Text></Text></TouchableOpacity>
            </View>
        <Text style={{ fontSize: 20, marginBottom: 45, marginTop: '50%', width: '60%', textAlign: 'center' }}>Add your friends with their username:</Text>
        <TextField
            style={{width: 200}}
            placeholder="username"
            onChangeText={name => setUsername(name)}
        />
        <View style={{marginTop: 30}}>

        </View>
        <Button onPress={handlePress} title="Add User" disabled={loading} />
    </View>
  );
};

export default AddUser;