import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView, FlatList, TouchableOpacity, Linking, useWindowDimensions, Animated, Image, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getNames, getSchedule, } from '../storage/Database';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';


const Home = ({ navigation }) => {
  const [loading, setLoading] = useState("")
  const [data, setData] = useState([{ name: "", lon: 0, lat: 0, date: "", type: "" }])
  const [isMounted, setIsMounted] = useState(true)
  const [appState, setAppState] = useState("questioning")
  const [currentView, setCurrentView] = useState(0)
  const { width } = useWindowDimensions();
  const scrollX = useRef(new Animated.Value(0)).current

  const [name, setName] = useState("")


  const getDaysUntil = (date) => {
    var date1 = new Date();
   var date2 = new Date(date);
    var timeDifference = date2.getTime() - date1.getTime();
    return Math.ceil((date1 - date2) / 8.64e7)-1;
  }

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
        (res) => setData(res.sort(
          (objA, objB) => new Date(objA.date) - new Date(objB.date)
        ),
          // console.log(res.sort(
          //   (objA,objB)=>Number(objA.date) -Number(objB.date)
          // ))
        )
      ).then(
        () => getNames().then(
          (res) => setName(res[0].name)
        )
      )
      setLoading(false)


    }

  }
    , [])
  useEffect(
    () => {
      console.log(data)
    }
    , [loading, data])

  useEffect(() => {
    return () => {
      setIsMounted(false);
    }
  }, []);


  const viewableItemsChanged = useRef(
    ({ viewableItems }) => {
      setCurrentView(viewableItems[0].index)
    }
  ).current

  const renderItem = (item, index) => {
    {

      if (item && index != 0) return <View style={{ width: 300, alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <View style={styles.dateBtn} >
          <View style={{ flex: .7, justifyContent: 'space-around', alignItems: 'center', margin: 10 }}>
            <Text style={{ color: 'black', textAlign: 'center', fontSize: 18 }}>{item.name}
            </Text>
            <Text>{item.date}</Text>
          </View>
          <TouchableOpacity style={styles.nextBtn} onPress={() => Linking.openURL('http://maps.apple.com/maps?daddr=' + item.lat + ',' + item.lon)}>
            <Text style={{ color: '#ffff', textAlign: 'center' }}>take me there</Text>
          </TouchableOpacity>
        </View>

      </View>
    }
  };

  if (loading) return <ActivityIndicator />

  else return (

    <ImageBackground resizeMode={"cover"} source={require('../assets/date-dealer-home-background.png')} style={styles.container}>
      <View style={styles.topSpace}>
        <Text style={{ color: 'white', fontSize: 20 }}>{"Hello "}{name + "!"}</Text>
        <Text style={{ color: 'white', fontSize: 20 }}>{"You and your partners' next date is:"}</Text>

      </View>
      <View style={styles.mapViewContainer}>

        <Text style={styles.infoText1}>{data[0].name}</Text>
        <Image source={data[0].type.includes("museum") ? require('../assets/museum.png') : data[0].type.includes("cinema") ? require('../assets/movie.png') : data[0].type.includes("restaurant") ? require('../assets/resturaunt.png') : data[0].type.includes("shopping") ? require('../assets/shopping.png') : data[0].type.includes("leisure") ? require('../assets/outdoor.png') : data[0].type.includes("tourism") ? require("../assets/tourist.png") : require("../assets/tourist.png")} />
        <Text>Days until:  {getDaysUntil(data[0].date)}</Text>
        <Text style={styles.infoText2}>{data[0].date}</Text>
        <TouchableOpacity style={[styles.nextBtn, { width: 150, height: 50 }]} onPress={() => Linking.openURL('http://maps.apple.com/maps?daddr=' + data[0].lat + ',' + data[0].lon)}>
          <Text style={{ color: '#ffff', textAlign: 'center' }}>take me there</Text>
        </TouchableOpacity>
      </View>
      <Text style={{ color: 'white', fontSize: 20, paddingTop: '10%' }}> upcoming dates:</Text>
      <FlatList onViewableItemsChanged={viewableItemsChanged} onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }]
        , {
          useNativeDriver: false
        }
      )}
        style={styles.flatListContainer}
        pagingEnabled={true} bounces={false} showsHorizontalScrollIndicator={true} horizontal data={data} renderItem={({ item, index }) => renderItem(item, index)} />
    </ImageBackground>
  )
}


export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#7C44B9',
    justifyContent: 'space-around'

  },


  listContainer: {
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
  }
  ,
  topBuffer: {
    flex: 4
  },
  mapView: {
    flex: .7,
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
    shadowOffset: { width: 1, height: 2 },
    shadowColor: '#6890E1',
    shadowOpacity: .4,
    shadowRadius: 10,
    elevation: 1,
  },
  itemContainer: {

  }, mapViewContainer: {
    height: '40%',
    width: '80%',
    backgroundColor: '#FAF9F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    shadowOffset: { width: 2, height: 3 },
    shadowColor: '#6890E1',
    shadowOpacity: .6,
    shadowRadius: 20,
    elevation: 4,
    justifyContent: 'space-around',
  },
  topSpace: {
    height: '20%',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 20,
    marginTop: 40
  },
  nextDateContainer: { justifyContent: 'space-around', flex: .2, alignItems: 'center' },
  flatListContainer: {
    height: '30%',
  },
  infoText1: {
    fontWeight: '500',
    fontSize: 20,
    letterSpacing: .2,
    textAlign: 'center'
  },
  infoText2: {
    fontWeight: '400',
    letterSpacing: .2
  },
  nextBtn: {
    backgroundColor: '#36A2B7',
    alignItems: 'center',
    height: 50,
    borderRadius: 20,
    justifyContent: 'center',
    shadowColor: 'blue',
    width: '60%',
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: .5,
    shadowRadius: 5,
    elevation: 4,

  },
  middleBannerContainer: {

    alignItems: 'center',
    height: '10%',
    justifyContent: 'flex-end',
    backgroundColor: 'red'
  }



});

