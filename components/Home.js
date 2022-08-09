import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView, FlatList, TouchableOpacity, Linking, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSchedule, } from '../storage/Database';


const Home = ({ navigation }) => {
  const [loading, setLoading] = useState("")
  const [data, setData] = useState()
  const [isMounted, setIsMounted] = useState(true)
  const [appState, setAppState] = useState("questioning")




  const getLoginState = async () => {
    try {
      await AsyncStorage.getItem('appState').then((appState) => { appState == "passed" ? setAppState("passed") : setAppState("questioning") })
    } catch (e) {
      // saving error
    }
  }


  useEffect(() => {
    if (isMounted) {


      getSchedule().then(
        (res) => setData(res)
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
      if (item) return <TouchableOpacity style={styles.dateBtn} onPress={() => Linking.openURL('http://maps.apple.com/maps?daddr=' + item.lat + ',' + item.lon)}><Text style={{ color: 'white' }}>{item.name + " -- " + item.date} </Text></TouchableOpacity>
    }
  };

  if (loading) return <ActivityIndicator />
  else return (
    <View style={styles.container}>
      <Text>Home</Text>
    </View>
  )

  // else return (
  //     <View style={styles.container}>
  //       <View style = {styles.bannerContainer}>
  //         <Text >your dates below! Have fun & enjoy the romance!</Text>
  //         </View>

  //       <FlatList data={data} renderItem={renderItem} contentContainerStyle = {styles.listContainer} />
  //     </View>
  //   )
}


export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#7C44B9'

  }
  ,
  listContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-around'
  }
  ,
  bannerContainer: {
    height: '10%', justifyContent: 'center'
  },
  dateBtn: {
    backgroundColor: 'blue',
    height: 50,
    justifyContent: 'center',
    width: 350,
    borderRadius: 15,
    alignItems: 'center'
  }
});

