import * as Location from 'expo-location';

const shuffle = (repeating)=>{
let random = Math.floor(Math.random() * 4)
while ( repeating.includes(random))
{
  random = Math.floor(Math.random() * 4)
}
 return random
}

const randomizeArray = (events)=>{
  let newArr = []
  let alreadyUsed = []
  let random;
  // shuffle
  random = Math.floor(Math.random() * events.length);

  alreadyUsed.push(random)
  newArr.push(events[random])
  // shuffle
  random = shuffle(alreadyUsed)

  alreadyUsed.push(random)
  newArr.push(events[random])

  // shuffle
  random = shuffle(alreadyUsed)
  alreadyUsed.push(random)
  newArr.push(events[random])



  // shuffle
  random = shuffle(alreadyUsed)
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
      (obj)=>{if(obj.properties.name != null) {return obj} }
    )
    return data
  };

  const getLocation = async() => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }
    return await Location.getCurrentPositionAsync({});

          } ;


  export {getData,getLocation }