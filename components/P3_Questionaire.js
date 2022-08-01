import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet,Button,TextInput, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CheckBox } from 'react-native-elements'
import {createTable,deleteAvailability,dropTable, getAvailability, getNames, insertAvailability, insertName} from '../storage/Database';


const P3_Questionaire= ({navigation})=> {
  const [radioBtn,setRadioBtn] = useState({monday:false,tuesday:false,wednesday:false,thursday:false,friday:false, saturday:false, sunday:false})


  getNames()

  const handleButtonPress = async () =>{
    deleteAvailability()
    await insertAvailability(radioBtn)
    await AsyncStorage.setItem("appState","passed")
    getAvailability()
    navigation.push("Home")
  }
  return (
    <View style={styles.container}>
      <View style = {styles.contentContainer}>

      <View style={styles.questionHeaderContainer}>
      <Text>on what days of the week are you generally available?</Text>
      </View>
      <View style={styles.checkBoxContainer}>
        <CheckBox
          left
          title='Monday'
          checked={radioBtn.monday}
          onPress={()=>setRadioBtn({...radioBtn,monday:!radioBtn.monday})}
        />
        <CheckBox
          left
          title='Tuesday'
          onPress={()=>setRadioBtn({...radioBtn,tuesday:!radioBtn.tuesday})}
          checked={radioBtn.tuesday}
        />
        <CheckBox
          left
          title='Wednesday'
          onPress={()=>setRadioBtn({...radioBtn,wednesday:!radioBtn.wednesday})}
          checked={radioBtn.wednesday}
        />
        <CheckBox
          left
          title="Thursday"
          onPress={()=>setRadioBtn({...radioBtn,thursday:!radioBtn.thursday})}
          checked={radioBtn.thursday}
        />
        <CheckBox
          left
          title='Friday'
          onPress={()=>setRadioBtn({...radioBtn,friday:!radioBtn.friday})}
          checked={radioBtn.friday}
        />
        <CheckBox
          left
          title='Saturday'
          onPress={()=>setRadioBtn({...radioBtn,saturday:!radioBtn.saturday})}
          checked={radioBtn.saturday}
        />
             <CheckBox
          left
          title='Sunday'
          onPress={()=>setRadioBtn({...radioBtn,sunday:!radioBtn.sunday})}
          checked={radioBtn.sunday}
        />
      </View>
      <View>
        <Button title="next" onPress={() => { handleButtonPress()}}></Button>
      </View>
      </View>
    </View>
  );
}

export default P3_Questionaire

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
  },

  input: {
    width: '80%',
    height: 50,
    borderWidth: 2
  },

  inputContainer: {
    flex: .5,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  btnContainer: {
    flex: 1,
    width: '100%'
  },
  questionHeaderContainer: {
    flex: .1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',

  },
  checkBoxContainer: {
    flex: .5,
  },
  contentContainer:{
    width:'100%',
    flex:1,
    justifyContent:'space-around',
  },
  
  });

