import React, { useState, useEffect, useRef } from 'react';
import { View, Alert, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Linking, Modal, useWindowDimensions, Animated, Image, ImageBackground, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getNames, getSchedule, getInterests, getAvailability, insertSchedule, deleteSchedule } from '../storage/Database';
import * as Calendar from 'expo-calendar';
import { getLocation, getData } from '../api/GET';
import plantDates from '../Service/PlantDates';
import { DotIndicator } from 'react-native-indicators';


const Home = ({ navigation }) => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([{ name: "", lon: 0, lat: 0, date: "", type: "" }])
  const [isMounted, setIsMounted] = useState(true)
  const [appState, setAppState] = useState("questioning")
  const [currentView, setCurrentView] = useState(0)
  const { width } = useWindowDimensions();
  const scrollX = useRef(new Animated.Value(0)).current
  const [status, requestPermission] = Calendar.useCalendarPermissions();

  const [name, setName] = useState("")
  const [partnerName, setPartnerName] = useState("")
  const [modal, setModal] = useState(false)




  const getDaysUntil = (date) => {
    var date1 = new Date();
    var date2 = new Date(date);
    var timeDifference = date2.getTime() - date1.getTime();
    return Math.ceil((date2 - date1) / 8.64e7);
  }

  const isBeforeToday = (date) => {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    return new Date(date).setHours(0, 0, 0, 0) < today;
  }


  const queryInterests = async () => {
    return await getInterests()

  }

  const getLoginState = async () => {
    try {
      await AsyncStorage.getItem('appState').then((app) => { app == "passed" ? setAppState("passed") : app == "questioning" ? setAppState("questioning") : setAppState("finished") })
      return await AsyncStorage.getItem('appState')
    } catch (e) {
      // saving error
    }
  }




  useEffect(() => {
    if (isMounted) {
      let state;



      getLoginState().then((res) => {
        state = res;


        AsyncStorage.getItem("appState").then((res) => {
          console.log(res)
          if (res != "calculating" && res != "passed" && res != "finished") { initDates() } else  {
            getSchedule().then(
              (res) => {

                let orderedRes = res.sort(
                  (objA, objB) => new Date(objA.date) - new Date(objB.date)
                ).filter((obj) => {
                  if (!isBeforeToday(obj.date)) return obj
                })

                if (orderedRes.length < 1) {
                  console.log("small")
                  AsyncStorage.setItem("appState", "finished")
                  setAppState("finished")
                }
                else 
                {
                  console.log("big")
                  setData(res.sort(
                    (objA, objB) => new Date(objA.date) - new Date(objB.date)
                  ).filter((obj) => {
                    if (!isBeforeToday(obj.date)) return obj
                  })
  
                  )
                }
      
              }
            ) .then(
              () => getNames().then(
                (res) => {
                  setName(res[0].name), 
                  setPartnerName(res[0].partnerName)
                }
              ).then(() => {
                setLoading(false)
              })
            )
          }
        })

      }

      )

    }

  }
    , [isMounted])


  useEffect(
    () => {

    }
    , [loading, data])

  useEffect(() => {
    return () => {
      setIsMounted(false);
    }
  }, []);

  const createTwoButtonAlert = () =>
    Alert.alert('Permissions Required', "Calendar Permissions are required to add events to our device's calendaer.", [
      {
        text: 'Deny',
        style: 'Cancel',
      },
      {
        text: 'Grant Permissions', onPress: () => {
          Linking.openURL('app-settings:')
          setLoading(true)
        }
      },
    ]);

  const initDates = async () => {
    let activities;
    let schedule;
    await AsyncStorage.setItem("appState", "calculating")
    await queryInterests().then
      ((result) => {
        activities = result,
          getLocation().then(
            (loc) => {
              console.log("getting location")
              if (!loc) {
                setLoading("no permissions")
                AsyncStorage.setItem("appState", "finished")
                return
              }
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

                        setData(schedule.sort(
                          (objA, objB) => new Date(objA.properties.scheduledDate) - new Date(objB.properties.scheduledDate)
                        ).map((obj) => {
                          if (!isBeforeToday(obj.properties.scheduledDate)) return { name: obj.properties.name, lon: obj.properties.lon, lat: obj.properties.lat, date: obj.properties.scheduledDate.toString(), type: obj.properties.categories[1] != null ? obj.properties.categories[1] : obj.properties.categories[0] }
                        })

                        )

                      }
                    )
                    .then(
                      () => {
                        schedule.forEach(
                          (obj) => {
                            insertSchedule(obj.properties.name, obj.properties.lon, obj.properties.lat, obj.properties.scheduledDate.toString(), obj.properties.categories[1] != null ? obj.properties.categories[1] : obj.properties.categories[0])
                          }
                        )
                      }


                    )

                    .then(
                      () => {

                        setPassed().then(
                          () => getNames().then(
                            (res) => {
                              setName(res[0].name), setPartnerName(res[0].partnerName)
                            }
                          )
                        ).then(() => { setLoading(false) })
                      }

                    )

                }
              )

            }
          )
      }
      )
  }

  const setPassed = async () => {
    await AsyncStorage.setItem("appState", "passed")
  }

  const addToCalendar = () => {
    (async () => {
      // const { status } = await Calendar.getCalendarPermissionsAsync();
      if (status === 'granted') {
        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        console.log('Here are all your calendars:');
        console.log({ calendars });
      }
      else {
        // createTwoButtonAlert()
      }
    })();

  }

  const setMap = (state) => {
    switch (state) {
      case 0: return <ImageBackground resizeMode={"cover"} source={require('../assets/date-dealer-home-background.png')} style={styles.container}>
        <View style={styles.topSpace}>

          {!loading ? <Text style={{ color: 'white', fontSize: 20 }}>{"Hello "}{name + "!"}</Text>
            : null
          }
          {!loading ?
            <Text style={{ color: 'white', fontSize: 20 }}>{"You and"} {partnerName}{"'s"} {"next date is:"}</Text>
            : null
          }
        </View>
        <View style={styles.mapViewContainer}>
          {
            !loading ?
              <Text style={styles.infoText1}>{data[0].name}</Text> : null
          }
          {

            !loading ? <Image source={data[0].type.includes("museum") ? require('../assets/museum.png') : data[0].type.includes("cinema") ? require('../assets/movie.png') : data[0].type.includes("restaurant") ? require('../assets/resturaunt.png') : data[0].type.includes("shopping") ? require('../assets/shopping.png') : data[0].type.includes("leisure") ? require('../assets/outdoor.png') : data[0].type.includes("tourism") ? require("../assets/tourist.png") : require("../assets/tourist.png")} />
              : null
          }
          <Text style={styles.infoText2}>{!loading ? "Days until: " + getDaysUntil(data[0].date) : <DotIndicator size={8} color="#2225CC" />
          }</Text>
          <Text style={styles.infoText2}>{!loading ? data[0].date : <DotIndicator size={8} color="#2225CC" />}</Text>
          {
            !loading ?
              <TouchableOpacity style={[styles.nextBtn]} onPress={() => Linking.openURL('http://maps.apple.com/maps?daddr=' + data[0].lat + ',' + data[0].lon)}>
                <Text style={{ color: '#ffff', textAlign: 'center' }}>take me there</Text>
              </TouchableOpacity> : null
          }
          {loading == "no permissions" ?
            <Text style={{ color: 'white', fontSize: 20, textAlign: 'center' }}>{"you must grant permissions in app settings to continue"}</Text>
            : null
          }
        </View>
        {!loading ?
          <Text style={{ color: 'white', fontSize: 20, paddingTop: '10%' }}> this month's dates:</Text> : null}
        {!loading ?
          <FlatList onViewableItemsChanged={viewableItemsChanged} onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }]
            , {
              useNativeDriver: false
            }
          )}
            style={styles.flatListContainer}
            pagingEnabled={true} bounces={false} showsHorizontalScrollIndicator={true} horizontal data={data} renderItem={({ item, index }) => renderItem(item, index)} /> :
          <DotIndicator size={8} color="#2225CC" />

        }
      </ImageBackground>

        break;
      case 1: return <ImageBackground resizeMode={"cover"} source={require('../assets/date-dealer-home-background.png')} style={styles.closingContainer}>
        <View style={styles.closingCover}>
          <Text style={{ color: 'white', fontSize: 20 }}>{"Thank you for using the Date Dealer!"}</Text>

          <TouchableOpacity style={[styles.nextBtn, { width: 150, height: 50 }]} onPress={() => { handleReShuffle() }}>
            <Text style={{ color: '#ffff', textAlign: 'center' }}>re-shuffle</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
        break;
    }
  }


  const handleReShuffle = async () => {
    try {
      await AsyncStorage.setItem('appState', "questioning")
    } catch (e) {
      // saving error
    }
    navigation.navigate('p1_questionaire')
  }

  const viewableItemsChanged = useRef(
    ({ viewableItems }) => {
      setCurrentView(viewableItems[0].index)
    }
  ).current

  const renderItem = (item, index) => {
    {

      if (item && index != 0 && !loading) return <View style={{ width: 300, alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <View style={styles.dateBtn} >
          <View style={{ flex: .7, justifyContent: 'space-around', alignItems: 'center', margin: 10 }}>
            <Text style={styles.infoText1}>{item.name}
            </Text>
            <Text style={styles.infoText2}>{item.date}</Text>
          </View>
          {loading == "no permissions" ?
            <Text style={{ color: 'white', fontSize: 20, textAlign: 'center' }}>{"you must grant permissions to continue"}</Text>
            : null
          }
          {
            !loading ?
              <TouchableOpacity style={styles.nextBtn} onPress={() => Linking.openURL('http://maps.apple.com/maps?daddr=' + item.lat + ',' + item.lon)}>
                <Text style={{ color: '#ffff', textAlign: 'center' }}>take me there</Text>
              </TouchableOpacity> : null
          }
        </View>

      </View>
    }
  };

  if (appState == "finished") return setMap(1)
  else return setMap(0)

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
  closingContainer: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%'
  },
  closingCover: {
    height: '50%',
    justifyContent: 'space-around',
    alignItems: 'center'
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
    height: '80%',
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
    textAlign: 'center',
    fontFamily: 'Lato-Medium'
  },
  infoText2: {
    fontWeight: '400',
    letterSpacing: .2,
    fontFamily: 'Lato-Regular'
  },
  nextBtn: {
    backgroundColor: '#36A2B7',
    alignItems: 'center',
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    shadowColor: 'blue',
    width: '50%',
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: .5,
    shadowRadius: 5,
    elevation: 4,

  },
  middleBannerContainer: {

    alignItems: 'center',
    height: '10%',
    justifyContent: 'flex-end',
  }



});