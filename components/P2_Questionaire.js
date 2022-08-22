import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput, TouchableOpacity, ImageBackground, Alert,Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CheckBox } from 'react-native-elements'
import { deleteInterests, getInterests, getNames, insertInterest } from '../storage/Database';
import { DotIndicator } from 'react-native-indicators';



const P2_Questionaire = ({ navigation }) => {
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({ restaraunt: null, outdoor: null, shopping: null, physical: null, movies: null, concerts: null, lazy: null, creative: null, scenic: null })
  const [partnerName,setPartnerName] = useState("")


  const getName = async () => {
    try {
      getNames().then(
        (res) => {
          setName(res[0].name),
        setPartnerName(res[0].partnerName)
        }
      )
      setLoading(false)

    } catch (e) {
      // saving error
    }
  }

  const handleSubmit = async () => {
let count = 0
    Object.keys(data).forEach(key => {
      if(data[key] != null){count++}
    }
    )

    if(count > 2)
    {
    deleteInterests()
    insertInterest(data)
    navigation.push("p3_questionaire")
    }
    else
    {
      Alert.alert('Oops', 'you must select at LEAST 3 interets.', [
        
        { text: 'OK'},
      ]);
    }

  }

  useEffect(() => {
    getName()
  }, []);


  if (loading) return <ImageBackground resizeMode={"cover"} source={require('../assets/settings-background.png')} style={styles.container}><DotIndicator size={6} color ="#ffff"/></ImageBackground>

  else return (
    <ImageBackground resizeMode={"cover"} source={require('../assets/settings-background.png')} style={styles.container}>

        <View style={styles.questionHeaderContainer, { marginTop: Dimensions.get('window').height < 700 ? '5%' : '20%'}}>
          <Text style = {{fontSize: "20rem", textAlign:'center'}}>{"Hi"} {name}{" & "}{partnerName + "."} {"Select at least 3 activities of interest below." }</Text>
        </View>
        <View style={styles.checkBoxContainer}>
          <CheckBox
                 containerStyle={{ backgroundColor: 'transparent', borderWidth: 0 }}
                 textStyle={{ color: '#ffff' }}
            left
            title='restaurants'
            checked={data.restaraunt != null ? true : false}
            onPress={() => setData({ ...data, restaraunt: data.restaraunt == null ? 'catering.restaurant' : null })}
          />
          <CheckBox
            containerStyle={{ backgroundColor: 'transparent', borderWidth: 0 }}
            textStyle={{ color: '#ffff' }}
            left
            title='outdoor activities'
            checked={data.outdoor != null ? true : false}
            onPress={() => setData({ ...data, outdoor: data.outdoor == null ? 'leisure' : null })}
          />
          <CheckBox
                 containerStyle={{ backgroundColor: 'transparent', borderWidth: 0 }}
                 textStyle={{ color: '#ffff' }}
            left
            title='shopping'
            checked={data.shopping != null ? true : false}
            onPress={() => setData({ ...data, shopping: data.shopping == null ? 'commercial.shopping_mall' : null })}
          />
          <CheckBox
                 containerStyle={{ backgroundColor: 'transparent', borderWidth: 0 }}
                 textStyle={{ color: '#ffff' }}
            left
            title='physical activities'
            checked={data.physical != null ? true : false
            }
            onPress={() => setData({
              ...data, physical
                : data.physical == null ? 'natural' : null
            })}
          />
          <CheckBox
                 containerStyle={{ backgroundColor: 'transparent', borderWidth: 0 }}
            textStyle={{ color: '#ffff' }}
            left
            style={{ opacity: 0 }}
            title='movies'
            checked={data.movies != null ? true : false}
            onPress={() => setData({ ...data, movies: data.movies == null ? 'entertainment.cinema' : null })}
          />
          {/* <CheckBox
          left
          title='concerts'
          checked={data.concerts}
          onPress={()=>setData({...data,concerts: !data.concerts})}
        /> */}
          <CheckBox
                 containerStyle={{ backgroundColor: 'transparent', borderWidth: 0 }}
                 textStyle={{ color: '#ffff' }}
            left
            title='lazy'
            checked={data.lazy != null ? true : false}
            onPress={() => setData({ ...data, lazy: data.lazy == null ? 'leisure.park' : null })}
          />
          <CheckBox
                 containerStyle={{ backgroundColor: 'transparent', borderWidth: 0 }}
                 textStyle={{ color: '#ffff' }}
            left
            title='creative'
            checked={data.creative != null ? true : false}
            onPress={() => setData({ ...data, creative: data.creative == null ? 'entertainment.museum' : null })}
          />
          <CheckBox
                 containerStyle={{ backgroundColor: 'transparent', borderWidth: 0 }}
                 textStyle={{ color: '#ffff' }}
            left
            title='scenic'
            checked={data.scenic != null ? true : false}
            onPress={() => setData({ ...data, scenic: data.scenic == null ? 'natural' : null })}
          />
        </View>

        <View style={styles.submitBtn}>
        <TouchableOpacity style = {styles.nextBtn} onPress={() => { handleSubmit() }}><Text style = {{color:"white"}}>next</Text></TouchableOpacity>
        </View>
    </ImageBackground>
  )
}

export default P2_Questionaire

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    width: '100%',
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
    width: '100%',
  },
  questionHeaderContainer: {
    height:'20%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',

  },
  checkBoxContainer: {
    flex: 1,
    marginLeft:'4%',
    justifyContent:'center',
    marginTop:'10%',
  },
  contentContainer: {
    width: '100%',
    flex: 1,
    justifyContent: 'space-around',
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
  }


});

