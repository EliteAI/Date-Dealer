import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CheckBox } from 'react-native-elements'
import { deleteInterests, getInterests, getNames, insertInterest } from '../storage/Database';



const P2_Questionaire = ({ navigation }) => {
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(true)
  const [data,setData] = useState({restaraunt: null, outdoor: null, shopping : null, physical :null, movies: null, concerts: null, lazy: null, creative: null, scenic: null})


  
  const getName = async () => {
    try {
    setName(await getNames())
      setLoading(false)

    } catch (e) {
      // saving error
    }
  }

  const handleSubmit = async ()=>{
    deleteInterests()
    insertInterest(data)

    navigation.push("p3_questionaire") 
  }

  useEffect(() => {
    getName()
  }, []);


  if (loading) return <ActivityIndicator></ActivityIndicator>
  else return (
    <View style={styles.container}>
      <View style = {styles.contentContainer}>

      <View style={styles.questionHeaderContainer}>
      <Text>Welcome {name}</Text>
        <Text>select all that apply:</Text>
      </View>
      <View style={styles.checkBoxContainer}>
        <CheckBox
          left
          title='restaurants'
          checked={data.restaraunt != null ? true : false }
          onPress={()=>setData({...data,restaraunt: data.restaraunt == null?'catering.restaraunt' : null})}
        />
        <CheckBox
          left
          title='outdoor activities'
          checked={data.outdoor!= null ? true : false}
          onPress={()=>setData({...data,outdoor:data.outdoor == null?'leisure' : null})}
        />
        <CheckBox
          left
          title='shopping'
          checked={data.shopping!= null ? true : false}
          onPress={()=>setData({...data,shopping: data.shopping == null?'commercial.shopping_mall' : null})}
        />
        <CheckBox
          left
          title='physical activities'
          checked={data.physical!= null ? true : false
          }
          onPress={()=>setData({...data,physical
            : data.physical == null?'natural' : null
          })}
        />
        <CheckBox
          left
          title='movies'
          checked={data.movies!= null ? true : false}
          onPress={()=>setData({...data,movies: data.movies == null?'entertainment.cinema' : null})}
        />
        {/* <CheckBox
          left
          title='concerts'
          checked={data.concerts}
          onPress={()=>setData({...data,concerts: !data.concerts})}
        /> */}
                <CheckBox
          left
          title='lazy'
          checked={data.lazy!= null ? true : false}
          onPress={()=>setData({...data,lazy: data.lazy == null?'leisure.park' : null})}
        />
                <CheckBox
          left
          title='creative'
          checked={data.creative!= null ? true : false}
          onPress={()=>setData({...data,creative: data.creative == null?'entertainment.museum' : null})}
        />
                <CheckBox
          left
          title='scenic'
          checked={data.scenic!= null ? true : false}
          onPress={()=>setData({...data,scenic: data.scenic == null?'natural' : null})}
        />
      </View>
      <View style = {styles.submitBtn}>
        <Button title="next" onPress={() => { handleSubmit()}}></Button>
      </View>
      </View>
    </View>
  )
}

export default P2_Questionaire

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
    flex: .8,
  },
  contentContainer:{
    width:'100%',
    flex:1,
    justifyContent:'space-around',
  },
  submitBtn:{
    flex:.2
  }
  

});

