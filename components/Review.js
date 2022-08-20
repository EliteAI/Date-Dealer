import React, { useState, useEffect , useRef} from 'react';
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView, FlatList, TouchableOpacity, Linking, useWindowDimensions , Animated, Image, ImageBackground, Button} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getNames, getSchedule, } from '../storage/Database';
import * as SMS from 'expo-sms';

const Review = ({ navigation }) => {
  const [loading, setLoading] = useState("")
  const [data, setData] = useState([{name:"",lon:0,lat:0,date:""}])
  const [isMounted, setIsMounted] = useState(true)
  const [appState, setAppState] = useState("questioning")
  const [currentView, setCurrentView] = useState(0)
  const { width } = useWindowDimensions();
  const scrollX = useRef(new Animated.Value(0)).current

  const [name,setName ] = useState("")



  useEffect(() => {
    if (isMounted) {


      getSchedule().then(
        (res) => setData(res.sort(
          (objA,objB)=>Number(objA.date) -Number(objB.date)
        ), 
        // console.log(res.sort(
        //   (objA,objB)=>Number(objA.date) -Number(objB.date)
        // ))
        )
      ).then(
        ()=>getNames().then(
          (res)=>setName(res[0].name)
        )
      )
      setLoading(false)


    }

  }
    , [])
  useEffect(
    () => {

    }
    , [loading, data])

  useEffect(() => {
    return () => {
      setIsMounted(false);
    }
  }, []);

  const openMessage = async() =>{
    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
        const { result } = await SMS.sendSMSAsync(
            [''],
            'Hey! I found this cool app called Date Dealer. You should give it a try.',
   
          );
              } 
              
              else {
      // misfortune... there's no SMS available on this device
    }
    
  }



  if (loading) return <ActivityIndicator />

  else return (
    
    <ImageBackground resizeMode={"cover"} source={require('../assets/date-dealer-home-background.png')} style={styles.container}>
      <View style = {styles.topSpace}>
      <Text style = {{color:'black', fontSize:20,textAlign:'center'}}>{"Hi "}{ name + "! Thank ou so much for downloading the App."}  {"\n"}  {"\n"} {"If you would like to leave a review, please use one of the links below!"}</Text>
        <Button title = "leave a review on App Stop Store"/>
        <Button onPress = {()=>{openMessage()}} title = "share with friends"/>
      </View>
      </ImageBackground>
  )
}


export default Review

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
  alignItems: 'center',
   width: '100%', 
  backgroundColor:'#7C44B9',
  justifyContent:'space-around',

},


  listContainer: {
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
  }
  ,
  topBuffer:{
flex:4
  },
  mapView: {
    flex:.7,
    width: '70%',
    borderRadius: 10,
    
  },
  bannerContainer: {
    height: '10%', justifyContent: 'center'
  },
  dateBtn: {
    backgroundColor: '#FAF9F6',
    height: '65%',
    justifyContent: 'center',
    width: '90%',
    borderRadius: 15,
    alignItems: 'center',
    shadowOffset:{width:1,height:2},
    shadowColor:'#6890E1',
    shadowOpacity:.4,
    shadowRadius:10,
    elevation:1,
  },
  itemContainer: {

  }, mapViewContainer:{
    height:'40%',
    width:'80%',
    backgroundColor:'#FAF9F6',
    alignItems:'center',
    justifyContent:'center',
    borderRadius:15,
    shadowOffset:{width:2,height:3},
    shadowColor:'#6890E1',
    shadowOpacity:.6,
    shadowRadius:20,
    elevation:4,
    justifyContent:'space-around'
  },
  topSpace:{
    height:'50%',
    alignItems:'center',
    justifyContent:'space-around',
    padding:20,
    backgroundColor:'white',
    borderRadius:10,
    margin:25

  },
  nextDateContainer:{justifyContent:'space-around',flex:.2, alignItems:'center'},
  flatListContainer:{
    height:'30%',
  }, 
  infoText1:{
     fontWeight:'500',
     fontSize:20,
     letterSpacing:.2
  },
  infoText2:{
    fontWeight:'400',
    letterSpacing:.2
  },
  nextBtn:{
    backgroundColor:'#36A2B7',
    alignItems:'center',
    height:'25%',
    borderRadius:20,
    justifyContent:'center',
    shadowColor:'blue',
    width:'60%',
    shadowOffset:{width:1,height:3},
    shadowOpacity:.5,
    shadowRadius:5,
    elevation:4,

  },
  middleBannerContainer:{

    alignItems:'center',
    height:'10%',
    justifyContent:'flex-end',
    backgroundColor:'red'
  }


  
});

