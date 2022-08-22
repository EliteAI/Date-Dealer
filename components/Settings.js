import React, { useState, useEffect , useRef} from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, useWindowDimensions , Animated, Alert, ImageBackground, Button, Dimensions} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { deleteAvailability, deleteInterests, deleteLocation, deleteSchedule, getNames, getSchedule, updateSchedule, } from '../storage/Database';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { DotIndicator } from 'react-native-indicators';


const Settings = ({ navigation }) => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([{name:"",lon:0,lat:0,date:""}])
  const [isMounted, setIsMounted] = useState(true)
  const [appState, setAppState] = useState("questioning")
  const [currentView, setCurrentView] = useState(0)
  const { width } = useWindowDimensions();
  const scrollX = useRef(new Animated.Value(0)).current

  const [date,setDate] = useState(new Date())
  const [name,setName ] = useState("")
  const [modal,showModal] = useState(false)

  const [currentEdit, setCurrentEdit] = useState("")
  const [currentIndex,setCurrentIndex] = useState(0);




  const isBeforeToday = (date)=>{
    const today = new Date();

    today.setHours(0, 0, 0, 0);
  
    return new Date(date).setHours(0,0,0,0) < today;
  }


  const getLoginState = async () => {
    try {
      return await AsyncStorage.getItem('appState')
    } catch (e) {
      // saving error
    }
  }


  useEffect(() => {
    setLoading(true)

      getSchedule().then(
        (res) => {
          setData(res.sort(
          (objA, objB) => new Date(objA.date) - new Date(objB.date)
        ).filter((obj)=> {if(!isBeforeToday(obj.date)) return obj
      } )
      
        )
      }
      ).then(()=>{   
     
        getLoginState().then((res)=>
        {
          if(res == "passed")
          {
          setLoading(false)
          }
          else{
            setTimeout(
              function()
            {
              getSchedule().then(
                (res) => {
                  setData(res.sort(
                  (objA, objB) => new Date(objA.date) - new Date(objB.date)
                ).filter((obj)=> {if(!isBeforeToday(obj.date)) return obj
              } )
              
                )
              }
              ).then(()=>setLoading(false))
            }, 5000
            )
          }
        })
    }
     )

  }
    , [])



  const handleReShuffle = async ()=>{
    async function move(){
      await AsyncStorage.setItem('appState', "questioning")
      navigation.navigate('p1_questionaire')
    }
    try {
      Alert.alert('Confirm', 'Are you sure you want to reshuffle? You will lose all of your current dates and will be promted to re-enter your information.', [
        
        {text:'Cancel'},
        { text: 'OK', onPress:()=>{

          deleteSchedule()
          deleteAvailability()
          deleteInterests()
          deleteLocation()
          move()
     
        }},
      ]);
    } catch (e) {
      // saving error
    }
  }

  const viewableItemsChanged = useRef(
    ({viewableItems})=>{
      setCurrentView(viewableItems[0].index)
    }
  ).current

  const renderItem = (item, index) => {
    {
      // let item = item.name
   return <View style={{ width:"100%", alignItems:'center', justifyContent:'center',  flex:1}}>
        <View style={styles.dateBtn} >
          <View style = {{flex:1,flexDirection:'row',justifyContent:'space-around', alignItems:'center', width:'100%' }}>
            <View style = {{flex:.9, flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
              <Button title = "edit" onPress={()=>{showModal(true), setCurrentEdit(item.name), setCurrentIndex(index)}}/>
        <Text style={{ color: 'black', textAlign:'center', fontSize:14, fontFamily:'Lato-Regular' }} numberOfLines={1}>{item.name.slice(0, 15) + "..."}
        </Text>
<Text style = {{fontSize:14, fontFamily:'Lato-Regular'}}>{item.date}</Text>
</View>
        </View>
        </View>
        
        </View>
    }
  };

  if (loading) return  <ImageBackground resizeMode={"cover"} source={require('../assets/settings-background.png')} style={styles.container}>
  <View style = {styles.topSpace}>
<Text style = {{color:'black', fontSize:25, fontFamily:'Lato-Medium'}}>{"Settings"}</Text>

</View>

<View style = {{backgroundColor:'#ffff', height:'75%', width:'90%', borderRadius:15, alignItems:'center',marginBottom:'5%', marginTop:"10%"}}>
<View style = {{height:'10%', justifyContent:'center', alignItems:'center'}}>
<Text style = {{fontSize: 20, fontFamily:'Lato-Regular'}} >edit schedule</Text>
</View>
<DotIndicator size={8} color ="#2225CC"/>
</View>
</ImageBackground>

  else 
  return (
    <ImageBackground resizeMode={"cover"} source={require('../assets/settings-background.png')} style={styles.container}>
          <View style = {styles.topSpace,{ marginTop: Dimensions.get('window').height < 700 ? '5%' : '20%'}}>
      <Text style = {{color:'black', fontSize:25, fontFamily:'Lato-Medium'}}>{"Settings"}</Text>

      </View>

<View style = {{backgroundColor:'#ffff', height:'75%', width:'90%', borderRadius:15, alignItems:'center',marginBottom:'5%'}}>
    <View style = {{height:'10%', justifyContent:'center', alignItems:'center'}}>
    <Text style = {{fontSize: 20, fontFamily:'Lato-Regular'}} >edit schedule</Text>
    </View>
      <FlatList onViewableItemsChanged={viewableItemsChanged} onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }]
        , {
          useNativeDriver: false
        }
      )}
      scrollEnabled={true}
      style ={styles.flatListContainer}
      contentContainerStyle={{flex:1,justifyContent:'space-around'}}
      data={data} renderItem={({item,index})=>renderItem(item,index)}
       /> 
           <TouchableOpacity style={[styles.nextBtn, { width: 150, height: 50 }]} onPress={() => {handleReShuffle()}}>
          <Text style={{ color: '#ffff', textAlign: 'center' }}>re-shuffle</Text>
        </TouchableOpacity>
                 <DateTimePickerModal
        isVisible={modal}
        textColor={"black"}
        mode="date"
        date={date}
        onConfirm={()=>{
          let temp = data
          updateSchedule(currentEdit, date.toDateString()), 
          temp[currentIndex].date = date.toDateString(),
          setData(temp),
          showModal(false)
      }}
        onCancel={()=>{showModal(false)}}
        onChange={(date)=>setDate(date)}
        minimumDate={new Date()}
      />
</View>
      </ImageBackground>
  )
}


export default Settings

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
  alignItems: 'center',
   width: '100%', 
  backgroundColor:'#7C44B9',
  justifyContent:'space-around'

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
    backgroundColor: '#EBEBEB',
    height:50,
    justifyContent: 'center',
    width: '90%',
    borderRadius: 15,
    alignItems: 'center',
    shadowOffset:{width:1,height:2},
    shadowColor:'#6890E1',
    shadowOpacity:.3,
    shadowRadius:5,
    elevation:.5,
  },
  itemContainer: {

  }, mapViewContainer:{
    flex: 7,
    width:'80%',
    backgroundColor:'#ffff',
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
    height:'10%',
    alignItems:'center',
    justifyContent:'center',
  },
  nextDateContainer:{justifyContent:'space-around',flex:.2, alignItems:'center'},
  flatListContainer:{
    height:'80%',
    width:'100%'
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
    height:50,
    borderRadius:20,
    justifyContent:'center',
    shadowColor:'blue',
    width:'40%',
    shadowOffset:{width:1,height:3},
    shadowOpacity:.5,
    shadowRadius:5,
    elevation:4,
    marginBottom:20

  },
  middleBannerContainer:{

    alignItems:'center',
    height:'10%',
    justifyContent:'flex-end',
  }
,


  
});

