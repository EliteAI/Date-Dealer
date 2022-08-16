import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet,ImageBackground, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CheckBox } from 'react-native-elements'
import { getData, getLocation } from '../api/GET';
import { getInterests, deleteSchedule} from '../storage/Database';

import plantDates from '../Service/PlantDates';
import {deleteAvailability,getAvailability, insertAvailability, getSchedule, insertSchedule, setAvailability} from '../storage/Database';


const P3_Questionaire= ({navigation})=> {
  const [radioBtn,setRadioBtn] = useState({monday:false,tuesday:false,wednesday:false,thursday:false,friday:false, saturday:false, sunday:false})
  const [availability, setAvailability] = useState({})
  const [data, setData] = useState()
  const [loading,setLoading] = useState(false)



  const queryInterests = async () => {
    return await getInterests()

  }

  const handleButtonPress = async () =>{
    setLoading(true)
    deleteAvailability()
    let activities;
    let schedule;
    await insertAvailability(radioBtn)
    await AsyncStorage.setItem("appState","passed")
    await queryInterests().then
    ((result)=>{   
      activities = result,
      getLocation().then(
      (loc) => {
        getData(loc, activities).then(
          (res) => {
            activities = res
            getAvailability()
              .then(
                (res) => {
                  var days = {
                    0: {
                      monday: 1,
                      tuesday: 2,
                      wednesday: 3,
                      thursday: 4,
                      friday: 5,
                      saturday: 6,
                      sunday: 7
                    },
                    1: {
                      monday: 7,
                      tuesday: 8,
                      wednesday: 9,
                      thursday: 10,
                      friday: 11,
                      saturday: 12,
                      sunday: 13
                    },
                    2: {
                      monday: 6,
                      tuesday: 7,
                      wednesday: 8,
                      thursday: 9,
                      friday: 10,
                      saturday: 11,
                      sunday: 12
                    },
                    3: {
                      monday: 5,
                      tuesday: 6,
                      wednesday: 7,
                      thursday: 8,
                      friday: 9,
                      saturday: 10,
                      sunday: 11
                    },
                    4: {
                      monday: 4,
                      tuesday: 5,
                      wednesday: 6,
                      thursday: 7,
                      friday: 8,
                      saturday: 9,
                      sunday: 10
                    },
                    5: {
                      monday: 3,
                      tuesday: 4,
                      wednesday: 8,
                      thursday: 9,
                      friday: 10,
                      saturday: 11,
                      sunday: 12
                    },
                    6: {
                      monday: 2,
                      tuesday: 3,
                      wednesday: 4,
                      thursday: 5,
                      friday: 6,
                      saturday: 7,
                      sunday: 8
                    }
                  }
                  Object.keys(res).forEach(key => {
                    if (res[key] == 1) {
                      schedule = plantDates(activities, days[new Date().getDay()][key])
                    }
                  }
                  )
                  // console.log(JSON.stringify(schedule+ " < -------mine"))
                  setData(schedule)
                  setAvailability(res)

                  deleteSchedule()
                }
              )
              .then(
                () => 
                {
                    schedule.forEach(
                    (obj)=>{
                      console.log(obj.properties.name)
                      insertSchedule(obj.properties.name,obj.properties.lon,obj.properties.lat, obj.properties.scheduledDate)
                    }
                  )
                }


              )

              .then(
                () => {
                  getSchedule().then(
                    (res) => {
                      getAvailability()
                      navigation.push("Date Dealer")    
                      setLoading(false)
                    }
                  )
                }

              )

          }
        )

      }
    )
    }
    )

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
  else return <ActivityIndicator/>
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

