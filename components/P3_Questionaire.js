import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet,Button,TextInput, ActivityIndicator, TouchableOpacity } from 'react-native';
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
                      navigation.push("Home")    
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

