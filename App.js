import React, { useEffect, useState } from 'react';
import { View, Text,StyleSheet, Button, TextInput, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import P2_Questionaire from './components/P2_Questionaire'
import { NativeBaseProvider } from "native-base";
import Home from './components/Home'
import P3_Questionaire from './components/P3_Questionaire';
import P1_Questionaire from './components/P1_Questionaire';
import { createTable, dropTable, turnForeignKeysOn,  } from './storage/Database';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons'
import Settings from './components/Settings';
import Info from './components/Info';
import Review from './components/Review';
import { useFonts } from 'expo-font';
import { Asset } from 'expo-asset';


const Stack = createNativeStackNavigator();


export default function App() {
  const [appState, setAppState] = useState("questioning")
  const [loading, setLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(true)



  turnForeignKeysOn()
  createTable("users")
  createTable("interests")
  createTable("availability")
  createTable("schedule")




  function cacheImages(images) {
    return images.map(image => {
      if (typeof image === 'string') {
        return Image.prefetch(image);
      } else {
        return Asset.fromModule(image).downloadAsync();
      }
    });
  }

  const getLoginState = async () => {
    try {
      await AsyncStorage.getItem('appState').then((appState) => { appState == "passed" ? setAppState("passed") : setAppState("questioning") })
    } catch (e) {
      // saving error
    }
  }

  const loadResourcesAndDataAsync = async () =>{
    try {
      // SplashScreen.preventAutoHideAsync();

      const imageAssets = cacheImages([
        require("./assets/date-dealer-home-background.png"),
        require("./assets/date-dealer_p1.png"),
        require("./assets/movie.png"),
        require("./assets/museum.png"),
        require("./assets/outdoor.png"),
        require("./assets/resturaunt.png"),
        require("./assets/settings-background.png"),
        require("./assets/shopping.png"),
        require("./assets/splash.png"),
        require("./assets/tourist.png")
      ]);


      await Promise.all([...imageAssets]);
    } catch (e) {
      // You might want to provide this error information to an error reporting service
      console.warn(e);
    } 
    // finally {
    //   setAppIsReady(true);
    //   SplashScreen.hideAsync();
    // }
  }

  useEffect(() => {
    
    if (isMounted) {
      
      getLoginState().then(
     
          () => loadResourcesAndDataAsync().then(()=>setLoading(false))
      )
    }
  }, [])

  useEffect(() => {
    return () => {
      setIsMounted(false);
    }
  }, []);

  const [fontsLoaded] = useFonts({
    'Lato-Medium': require('./assets/fonts/Lato-Medium.ttf'),
    'Lato-Regular': require('./assets/fonts/Lato-Regular.ttf'),
    'Lato-Heavy': require('./assets/fonts/Lato-Heavy.ttf')

  });

  function MyTabs() {
    const Tab = createBottomTabNavigator();
    return (
      <Tab.Navigator barStyle={styles.barStyle} screenOptions={{ headerShown:false}}   >
        <Tab.Screen name = "Home" component={Home} 
        
        options={{
          
          tabBarShowLabel: true,
          tabBarIcon: ({ color }) => (<Icon name="home" size={25}/>),
          unmountOnBlur:true
          
        }} />
        <Tab.Screen  name="Settings" component={Settings}
        options={{
          tabBarIcon: ({ color }) => (<Icon name="cog" size={25}/>),
          unmountOnBlur:true
          
        }} />
        <Tab.Screen name="Share" component={Review}     options={{
          tabBarIcon: ({ color }) => (<Icon name="share-social" size={25}/>),
          unmountOnBlur:true

        }}/>
        <Tab.Screen 
        name="Info" component={Info}  options={{
          tabBarIcon: ({ color }) => (<Icon name="information-circle" size={25}/>),
          
        }}  />

      </Tab.Navigator>
    )
  }

  // options={{headerBackVisible:false}}
  if (loading) { return <View style={styles.container}><ActivityIndicator /></View> }
  else if (!loading && fontsLoaded)
    return (
      <NativeBaseProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName={appState == "passed" ?'Date Dealer' : "p1_questionaire"} screenOptions={{ "headerShown": false }}>
            <Stack.Screen name="p1_questionaire" component={P1_Questionaire} />
            <Stack.Screen name="p2_questionaire" component={P2_Questionaire} />
            <Stack.Screen name="p3_questionaire" component={P3_Questionaire} />
    
            <Stack.Screen name="Date Dealer" component={MyTabs} />
          </Stack.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
    )
  else return <View><Text>error</Text></View>

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%'
  },
  btn: {

  },
  input: {
    width: '80%',
    height: 50,
    borderWidth: 2
  },
  headerContainer: {
    flex: .5,
    justifyContent: 'center'
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
  barStyle: {
    backgroundColor: '#FAF9F6',
    justifyContent:'center',
  }
});
