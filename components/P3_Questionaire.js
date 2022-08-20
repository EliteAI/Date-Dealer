import React, { useState } from 'react';
import { View, Text, StyleSheet,ImageBackground,  TouchableOpacity, Alert } from 'react-native';
import { CheckBox } from 'react-native-elements'
import { DotIndicator } from 'react-native-indicators';

import {deleteAvailability, deleteSchedule, insertAvailability} from '../storage/Database';


const P3_Questionaire= ({navigation})=> {
  const [radioBtn,setRadioBtn] = useState({monday:false,tuesday:false,wednesday:false,thursday:false,friday:false, saturday:false, sunday:false})
  const [loading,setLoading] = useState(false)


  const handleButtonPress = async () =>{
    let count = 0
    setLoading(true)
    deleteAvailability()

    
    Object.keys(radioBtn).forEach(key => {
      if(radioBtn[key] != false){count++}
    }
    )
    if(count > 0)
    {
    await deleteSchedule()
    await insertAvailability(radioBtn)
   navigation.push("Date Dealer")   
    }
    else{
      Alert.alert('Oops', 'you must select at LEAST 1 available day.', [
        
        { text: 'OK'},
      ]);
    } 
       setLoading(false)
  

  }
  if(!loading)
  {
  return (
    <ImageBackground resizeMode={"cover"} source={require('../assets/settings-background.png')} style={styles.container}>
      <View style = {styles.contentContainer}>

      <View style={styles.questionHeaderContainer}>
      <Text style = {{fontSize:20, textAlign:'center'}}>on what days of the week are you generally available?</Text>
      </View>
      <View style={styles.checkBoxContainer}>
        <CheckBox
                containerStyle={{ backgroundColor: 'transparent', borderWidth: 0 }}
                textStyle={{ color: '#ffff' }}
          left
          title='Monday'
          checked={radioBtn.monday}
          onPress={()=>setRadioBtn({...radioBtn,monday:!radioBtn.monday})}
        />
        <CheckBox
                containerStyle={{ backgroundColor: 'transparent', borderWidth: 0 }}
                textStyle={{ color: '#ffff' }}
          left
          title='Tuesday'
          onPress={()=>setRadioBtn({...radioBtn,tuesday:!radioBtn.tuesday})}
          checked={radioBtn.tuesday}
        />
        <CheckBox
                containerStyle={{ backgroundColor: 'transparent', borderWidth: 0 }}
                textStyle={{ color: '#ffff' }}
          left
          title='Wednesday'
          onPress={()=>setRadioBtn({...radioBtn,wednesday:!radioBtn.wednesday})}
          checked={radioBtn.wednesday}
        />
        <CheckBox
                containerStyle={{ backgroundColor: 'transparent', borderWidth: 0 }}
                textStyle={{ color: '#ffff' }}
          left
          title="Thursday"
          onPress={()=>setRadioBtn({...radioBtn,thursday:!radioBtn.thursday})}
          checked={radioBtn.thursday}
        />
        <CheckBox
                containerStyle={{ backgroundColor: 'transparent', borderWidth: 0 }}
                textStyle={{ color: '#ffff' }}
          left
          title='Friday'
          onPress={()=>setRadioBtn({...radioBtn,friday:!radioBtn.friday})}
          checked={radioBtn.friday}
        />
        <CheckBox
                containerStyle={{ backgroundColor: 'transparent', borderWidth: 0 }}
                textStyle={{ color: '#ffff' }}
          left
          title='Saturday'
          onPress={()=>setRadioBtn({...radioBtn,saturday:!radioBtn.saturday})}
          checked={radioBtn.saturday}
        />
             <CheckBox
                     containerStyle={{ backgroundColor: 'transparent', borderWidth: 0 }}
                     textStyle={{ color: '#ffff' }}
          left
          title='Sunday'
          onPress={()=>setRadioBtn({...radioBtn,sunday:!radioBtn.sunday})}
          checked={radioBtn.sunday}
        />
      </View>
      <View style={styles.submitBtn}>
      <TouchableOpacity style = {styles.nextBtn} onPress={() => { handleButtonPress() }}><Text style = {{color:"white"}}>next</Text></TouchableOpacity>
      </View>
      </View>
    </ImageBackground>
  );
  }
  else return     <ImageBackground resizeMode={"cover"} source={require('../assets/settings-background.png')} style={styles.container}>
  <DotIndicator size={6} color ="#ffff"/>
</ImageBackground>
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
    flex: .5,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginHorizontal:10,
    alignSelf:'center',

  },
  checkBoxContainer: {
    flex: 1,
    marginLeft:'4%',
    justifyContent:'center',
    marginBottom:'10%'  },
  contentContainer:{
    width:'100%',
    flex:1,
    justifyContent:'space-around',
  },
  submitBtn: {
    flex: .1,
    width: '80%',
    alignItems:'center',
    shadowOffset:{width:1,height:5},
    shadowColor:'#000000',
    shadowOpacity:.2,
    shadowRadius:1,
    elevation:1,
    justifyContent:'center',
    alignSelf:'center',
    marginBottom:'20%'
  },
  nextBtn:{
    backgroundColor:'#36A2B7',
    width:' 50%',
    alignItems:'center',
    height:'100%',
    borderRadius:10,
    justifyContent:'center',
    shadowColor:'blue',
  },
  });

