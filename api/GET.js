import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { Alert, Linking } from 'react-native';

const shuffle = (events)=>{
  let random = Math.floor(Math.random() * events.length)
  while(!events[random].properties.name)
  {
    random = Math.floor(Math.random() * events.length)
  }
 return random
}

const randomizeArray = (events)=>{
  let newArr = []
  let alreadyUsed = []
  let random = Math.floor(Math.random() * events.length);
  alreadyUsed.push(random);
  // shuffle

  random = shuffle(events)



  alreadyUsed.push(random)

  newArr.push(events[random])
  random = shuffle(events)
  // shuffle


  random = shuffle(events)


  alreadyUsed.push(random)
  newArr.push(events[random])
  random = shuffle(events)
  // shuffle


  random = shuffle(events)

  alreadyUsed.push(random)
  newArr.push(events[random])


  random = shuffle(events)

  // shuffle


  random = shuffle(events)
  alreadyUsed.push(random)
  newArr.push(events[random])

  return newArr
}

// function to retrieve events based on interests
const getData = async (location,interests) => {

let data = []

// inserting objects in data based on interests
for(const key in interests)
{
    //GET request
    await fetch('https://api.geoapify.com/v2/places?categories=' + interests[key] + '&filter=circle:' + location.coords.longitude + ',' + location.coords.latitude + ',' + 40000 + '&limit=15&apiKey=b443898cef3a4218aac50de9db6d43b9', {
      method: 'GET',
      //Request Type
    })
      .then((response) => response.json())
      //If response is in json then in success
      .then((responseJson) => {
        //Success

        data = [...data, ...responseJson.features]
        
      })
      //If response is not in json then in error
      .catch((error) => {
        //Error
        console.log(error);
      });
    }
    data = randomizeArray(data).map(
      (obj)=>{return obj }
    )

    return data
  };

  const getLocation = async() => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissions Required', 'please grant location permissions in device settings in order to find events near you. For example, in order to find a resuraunt date near you we would first need to know your current location.', [
        { text: 'Cancel'},
        { text: 'OK', onPress: () => Linking.openURL('app-settings:')},
      ]);      return false;
    }
    AsyncStorage.setItem("appState","calculating")
    return await Location.getCurrentPositionAsync({});

          } ;


  export {getData,getLocation }