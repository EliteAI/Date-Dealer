import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet,Button,TextInput } from 'react-native';
import { deleteUsers, dropTable, getNames, insertName } from '../storage/Database';




const nameSubmit = async (name, navigation) => {
    try {
      deleteUsers()
      insertName(name)
      navigation.push("p2_questionaire")
    } catch (e) {
      // saving error
    }
  }

const P1_Questionaire = ({navigation}) => {
    const [name,setName] = useState("")
    return (
      <View style={styles.container}>
        <View style = {styles.headerContainer}>
        <Text>Hi! Welcome to the Date Dealer. Please enter your name below and we will continue scheduling your romance!</Text>
        </View>
        <View style = {styles.inputContainer} ><TextInput onChangeText={(givenName)=>{setName(givenName)}} style = {styles.input}/></View>
        <View style = {styles.btnContainer}>
          <Button title = "next" onPress={()=>{nameSubmit(name,navigation) }}></Button>
        </View>
      </View>
    );
  }

  export default P1_Questionaire

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'space-around',
      width:'100%'
    },
    btn:{
  
    },
    input:{
  width:'80%',
  height:50,
  borderWidth:2
    },
    headerContainer:{
      flex:.5,
      justifyContent:'center'
    },
    inputContainer:{
      flex:.5,
      width:'100%',
      justifyContent:'flex-start',
      alignItems:'center'
    },
    btnContainer:{
      flex:1,
      width:'100%'
    }
  });
  