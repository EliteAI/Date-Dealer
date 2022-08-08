import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView, FlatList, TouchableOpacity, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSchedule } from '../storage/Database';
import MapView from 'react-native-maps';



const Home = ({ navigation }) => {
  const [loading, setLoading] = useState("")
  const [data, setData] = useState()
  const [isMounted, setIsMounted] = useState(true)
  const [appState,setAppState] = useState("questioning")




  const getLoginState = async () => {
    try {
      await AsyncStorage.getItem('appState').then((appState)=>{  appState == "passed"? setAppState("passed") : setAppState("questioning")   })
    } catch (e) {
      // saving error
    }
  }
  const getName = async () => {
    try {
      await AsyncStorage.getItem('@name12345').then((name) => setName(name))

    } catch (e) {
      // saving error
    }

  }

  useEffect(() => {
    if (isMounted) {
  

      getSchedule().then(
        (res)=>setData(res)
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




  const renderItem = ({ item }) => {
    {
      if (item) return <TouchableOpacity onPress={()=>Linking.openURL('http://maps.apple.com/maps?daddr=38.7875851,-9.3906089')}><Text>{item.name + " ---- " + item.date} </Text></TouchableOpacity>
    }
  };

  if (loading) return <ActivityIndicator/>

  else return <MapView
  style = {{width:'100%',height:'100%'}}
  initialRegion={{
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }}
/>
    // return (
    //   <View style={styles.container}>
    //     <View style = {styles.bannerContainer}>
    //       <Text>your dates below! Have fun & enjoy the romance!</Text>
    //       </View>

    //     <FlatList data={data} renderItem={renderItem} contentContainerStyle = {styles.listContainer} />
    //   </View>
    // )
}


export default Home

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', justifyContent: 'space-around', alignItems: 'center' },
  listContainer:{
    alignItems:'center',
    flex:1,
    justifyContent:'space-around'
  }
,
bannerContainer:{ height:'10%',justifyContent:'center'
}
});

