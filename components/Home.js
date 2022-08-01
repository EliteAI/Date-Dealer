import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getData, getLocation, getAddress } from '../api/GET';
import { getAvailability, getInterests } from '../storage/Database';
import plantDates from '../Service/PlantDates';


const Home = ({ navigation }) => {
  const [loading, setLoading] = useState("")
  const [data, setData] = useState()
  const [interests, setInterests] = useState({})
  const [availability, setAvailability] = useState({})
  const [isMounted, setIsMounted] = useState(true)


  const queryInterests = async () => {
    return await getInterests()

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
      let activities
      setLoading("interests");
      queryInterests().then
        (
          (result) => {
            setInterests(result)
            setLoading("location")
            getLocation().then(
              (loc) => {
                setLoading("events")
                getData(loc, result).then(
                  (res) => {
                    setLoading("availability")
                    console.log(loading + "test")
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
                          console.log(activities.length)
                          Object.keys(res).forEach(key => {
                            if (res[key] == 1) {
                              setData(plantDates(activities, days[new Date().getDay()][key]))

                            }
                          }
                          )
                          setLoading("settingDates")


                        }
                      )
                      .then(
                        (res) => {
                          setLoading("finalizing")
                          setAvailability(res)
                        }
                      )
                      .then(
                        () => setLoading("done")

                      )
                  }
                )

              }
            )
          }
        )
    }

  }
    , [])
    useEffect(
      ()=>{

      }
      ,[loading])

  useEffect(() => {
    return () => {
      setIsMounted(false);
    }
  }, []);




  const renderItem = ({ item }) => {


    return <Text>{item.properties.name + " ---- " + item.scheduledDate} </Text>
  };

  if (loading == "interests") return <View style={styles.container}>
    <Text>evaluating interests. </Text><ActivityIndicator></ActivityIndicator></View>
  else if (loading == "location") return <View style={styles.container}>
    <Text>getting your current location. .</Text><ActivityIndicator></ActivityIndicator></View>
  else if (loading == "events") return <View style={styles.container}>
    <Text>getting events near you. . .</Text><ActivityIndicator></ActivityIndicator></View>
  else if (loading == "availability") return <View style={styles.container}>
    <Text>fetching your availability. . . .</Text><ActivityIndicator></ActivityIndicator></View>
  else if (loading == "settingDates") return <View style={styles.container}>
    <Text>tying events to your availability!</Text><ActivityIndicator></ActivityIndicator></View>
  else if (loading == "finalizing") return <View style={styles.container}>
    <Text>finalizing. . .</Text><ActivityIndicator></ActivityIndicator></View>
  else
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.container}>
          <Text>your dates below! Have fun & enjoy the romance!</Text>

          <FlatList data={data} renderItem={renderItem} />
        </SafeAreaView>
      </View>
    )
}


export default Home

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }

});

