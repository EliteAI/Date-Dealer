import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, Button, TextInput, ImageBackground, TouchableOpacity } from 'react-native';
import { deleteUsers, insertName } from '../storage/Database';




const nameSubmit = async (name, navigation) => {
  try {
    deleteUsers()
    insertName(name)
    navigation.push("p2_questionaire")
  } catch (e) {
    // saving error
  }
}

const P1_Questionaire = ({ navigation }) => {
  const [name, setName] = useState("")
  return (
    <ImageBackground resizeMode={"cover"} source={require('../assets/settings-background.png')} style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style = {styles.headerText}>Welcome to Date Dealer! Enter you and your significant other's name below.</Text>
      </View>
  
      <View style={styles.inputContainer} >
        <TextInput placeholder='your name here' placeholderTextColor={'#FAF9F6'}  onChangeText={(givenName) => { setName(givenName) }} style={styles.input} />
        <TextInput placeholder="your significant other's name here" placeholderTextColor={'#FAF9F6'}  onChangeText={(givenName) => { setName(givenName) }} style={styles.input} />

      </View>
      <View style={styles.btnContainer}>
        <TouchableOpacity style = {styles.nextBtn} onPress={() => { nameSubmit(name, navigation) }}><Text style = {{color:'white'}}>next</Text></TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

export default P1_Questionaire

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
  },
  btn: {

  },
  input: {
    width: '80%',
    height: 50,
    borderRadius: 10,
    backgroundColor:'transparent',
    borderBottomWidth:1,
    borderColor:'#FAF9F6',
    textAlign:'center',
    color:'white'
  }
  ,
  headerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems:'center',
    marginTop:'5%',
  },
  inputContainer: {
    flex: 2,
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  btnContainer: {
    flex: 1.5,
    width: '100%',
    alignItems:'center',
    shadowOffset:{width:1,height:5},
    shadowColor:'#000000',
    shadowOpacity:.2,
    shadowRadius:1,
    elevation:1,
    justifyContent:'center'
  },
  nextBtn:{
    backgroundColor:'#36A2B7',
    width:' 50%',
    alignItems:'center',
    height:'15%',
    borderRadius:10,
    justifyContent:'center',
    shadowColor:'blue'
  },
  headerText:{
    fontSize:20,
    textAlign:'center',
    letterSpacing:.2,
    
  }
});
