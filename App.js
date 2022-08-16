import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Button, TextInput, ActivityIndicator } from 'react-native';
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




  const getLoginState = async () => {
    try {
      await AsyncStorage.getItem('appState').then((appState) => { appState == "passed" ? setAppState("passed") : setAppState("questioning") })
    } catch (e) {
      // saving error
    }
  }


  useEffect(() => {
    if (isMounted) {
      getLoginState().then(
     
          () => setLoading(false)
      )
    }
  }, [])

  useEffect(() => {
    return () => {
      setIsMounted(false);
    }
  }, []);

  function MyTabs() {
    const Tab = createBottomTabNavigator();
    return (
      <Tab.Navigator barStyle={styles.barStyle} screenOptions={{ headerShown:false}}   >
        <Tab.Screen name = "Home" component={Home} 
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => (<Icon name="home" size={25}/>),
          unmountOnBlur:true
          
        }} />
        <Tab.Screen  name="Settings" component={Settings}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => (<Icon name="cog" size={25}/>),
          
        }} />
        <Tab.Screen name="Share" component={Review}     options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => (<Icon name="share-social" size={25}/>),
          unmountOnBlur:true

        }}/>
        <Tab.Screen 
        name="Info" component={Info}  options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => (<Icon name="information-circle" size={25}/>),
          
        }}  />

      </Tab.Navigator>
    )
  }

  // options={{headerBackVisible:false}}
  if (loading) { return <View style={styles.container}><ActivityIndicator /></View> }
  else if (appState == "questioning" && !loading)
    return (
      <NativeBaseProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ "headerShown": false }}>

            <Stack.Screen name="p1_questionaire" component={P1_Questionaire} />
            <Stack.Screen name="p2_questionaire" component={P2_Questionaire} />
            <Stack.Screen name="p3_questionaire" component={P3_Questionaire} />
            <Stack.Screen name="Date Dealer" component={MyTabs} />
          </Stack.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
    );
  else return (
    <NativeBaseProvider>
      <NavigationContainer >
        <Stack.Navigator screenOptions={{ "headerShown": false }}>
          <Stack.Screen name={"Date Dealer"} component={MyTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  )

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
