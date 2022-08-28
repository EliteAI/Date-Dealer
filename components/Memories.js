import React, { useState, useEffect , useRef} from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Alert, ImageBackground, Button, Dimensions,Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { deleteAvailability, deleteInterests, deleteLocation, deleteSchedule, getSchedule, updateSchedule, } from '../storage/Database';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { DotIndicator } from 'react-native-indicators';
import * as Notifications from 'expo-notifications';
import Timeline from 'react-native-timeline-flatlist'
import Modal from 'react-native-modal'
import * as ImagePicker from 'expo-image-picker';
import { TextInput } from 'react-native-paper';

const Memories = ({ navigation }) => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([{name:"",lon:0,lat:0,date:""}])
  const [currentView, setCurrentView] = useState(0)

  const [modalAddMemory, setModalAddMemory] = useState(false)
  const [modal,showModal] = useState(false)
  const [image, setImage] = useState(null);

  const [currentEdit, setCurrentEdit] = useState("")
  const [currentIndex,setCurrentIndex] = useState(0);
  const [rogueTest,setRogueTest] = useState(null)
  const [memorycolumns,setMemoryColumns] = useState([{
    time:"9/25/2022",
    title:"Fudruckers",
    description:<Button title ="open capsule"></Button>
  },
  {
    time:"9/25/2022",
    title:"Manuels ATX",
    description:<Button title ="open capsule"></Button>
  }

])
const [memories,setMemories] = useState([])
const [title,setTitle] = useState("")
const [description,setDescription] = useState("")

const pickImage = async () => {
  // No permissions request is necessary for launching the image library
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  console.log(result.uri);

  if (!result.cancelled) {
    setImage(result.uri);
    setRogueTest(result.uri)
  }
  // AsyncStorage.setItem("memories", JSON.stringify(memories))

};

  const [test,setTest] = useState([])
    


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

    AsyncStorage.getItem("memories").then((res)=>setTest(JSON.parse(res))
    ).then(()=>setLoading(false))
    //   getSchedule().then(
    //     (res) => {
    //       setData(res.sort(
    //       (objA, objB) => new Date(objA.date) - new Date(objB.date)
    //     ).filter((obj)=> {if(!isBeforeToday(obj.date)) return obj
    //   } )
      
    //     )
    //   }
    //   ).then(()=>{   
     
    //     getLoginState().then((res)=>
    //     {
    //       if(res == "passed")
    //       {
    //       setLoading(false)
    //       }
    //       else{
    //         setTimeout(
    //           function()
    //         {
    //           getSchedule().then(
    //             (res) => {
    //               setData(res.sort(
    //               (objA, objB) => new Date(objA.date) - new Date(objB.date)
    //             ).filter((obj)=> {if(!isBeforeToday(obj.date)) return obj
    //           } )
              
    //             )
    //           }
    //           ).then(()=>setLoading(false))
    //         }, 5000
    //         )
    //       }
    //     })
    // }
    //  )

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

  const updateNotification = async()=>{
    getSchedule().then(
      (res) => {

        let orderedRes = res.sort(
          (objA, objB) => new Date(objA.date) - new Date(objB.date)
        ).filter((obj) => {
          if (!isBeforeToday(obj.date)) return obj
        }
        )

        // cancel all notications
        Notifications.cancelAllScheduledNotificationsAsync()
        orderedRes.forEach((obj)=>{
          let futureDate = new Date(obj.date)
          futureDate.setDate(new Date(obj.date).getDate()-3)
          futureDate.setHours(8)
          futureDate.setMinutes(0)
          futureDate.setSeconds(0)
                    Notifications.scheduleNotificationAsync({
            
            content: {
              title: "your date in 3 days!",
              body: 'You have a date at the ' + obj.name +  'on ' + obj.date + " .",
              data: { data: 'goes here' },
            
              
            },
            
            trigger: { seconds: Math.abs(futureDate- new Date().getTime())/1000},
          })

          Notifications.scheduleNotificationAsync({
            
            content: {
              title: "your date is today!",
              body: 'You have a date at the ' + obj.name +  "today.",
              data: { data: 'goes here' },
            
              
            },
            
            trigger: { seconds: Math.abs(new Date(obj.date).getTime() - new Date().getTime())/1000},
          })


            
      }
    )
    }
    )
  }

  const handleAddNewMemory = ()=>{
   setModalAddMemory(true)
    
  }

  const handleSave = async ()=>{
    setLoading(true)
    let m =[
      {
        time:"9/25/2022",
        title: title,
        description:description,
        image: image
      }
    ]
     AsyncStorage.setItem("memories", JSON.stringify(m)).then(
      ()=>AsyncStorage.getItem("memories").then(
        (res)=>setTest(JSON.parse(res))
      )
     ).then(()=>setLoading(false))
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
<Text style = {{color:'black', fontSize:25, fontFamily:'Lato-Medium'}}>{"Memories"}</Text>

</View>

<View style = {{backgroundColor:'#ffff', height:'75%', width:'90%', borderRadius:15, alignItems:'center',marginBottom:'5%', marginTop:"10%"}}>
<View style = {{height:'10%', justifyContent:'center', alignItems:'center'}}>
<Text style = {{fontSize: 20, fontFamily:'Lato-Regular'}} >Timeline</Text>
</View>
<DotIndicator size={8} color ="#2225CC"/>
</View>
</ImageBackground>

  else 
  return (
    <ImageBackground resizeMode={"cover"} source={require('../assets/settings-background.png')} style={styles.container}>
          <View style = {styles.topSpace,{ marginTop: Dimensions.get('window').height < 700 ? '5%' : '20%'}}>
      <Text style = {{color:'black', fontSize:"25rem", fontFamily:'Lato-Medium'}}>{"Memories"}</Text>

      </View>

<View style = {{backgroundColor:'#ffff', height:'75%', width:'95%', borderRadius:15, alignItems:'center',marginBottom:'5%',marginTop:'10%'}}>
    <View style = {{height:'10%', justifyContent:'center', alignItems:'center'}}>
    <Text style = {{fontSize: 20, fontFamily:'Lato-Regular'}} >Timeline</Text>
    </View>
    <Timeline
          data={test}
          style={{width:300, marginBottom:'10%'}}
          timeContainerStyle={{width:'100%'}}
          timeStyle={{width:100,textAlign:'flex-start'}}
          options = {{horizontal:false,  }}
          lineWidth ={2}
          detailContainerStyle = {{
        alignItems:'flex-end',
        width:'100%'
      }}
    
      
        />
              <Modal isVisible={modalAddMemory} backdropColor={"white"} backdropOpacity={1}  style={styles.modalView} animationInTiming={300} hideModalContentWhileAnimating={true}>

        <View style={{flex:1,justifyContent:'center', alignItems:'center'}}>
          <Image style = {{width:300,height:300}} source={ test!= null? {uri:test[0].image} : require("../assets/icon.png")}/>
                  <View style={{flex:.1,justifyContent:'center', alignItems:'center', flexDirection:'row'}}>
          <Text>title: </Text>
          <TextInput onChangeText={(text)=>setTitle(text)} style={styles.input} />
          </View>
          <View style={{flex:.1,justifyContent:'center', alignItems:'center', flexDirection:'row'}}>
          <Text>description: </Text>
          <TextInput onChangeText={(text)=>setDescription(text)} style={styles.input} />
          </View>
        <Button title = "add picture" onPress={()=>{pickImage()}}></Button>
        <Button title = "date of" onPress={()=>{pickImage()}}></Button>
          <Button title = "cancel" onPress={()=>{setModalAddMemory(false)}}></Button>
          <Button title = "save" onPress={()=>{handleSave()}}></Button>
        </View>
      </Modal>
                   <TouchableOpacity style={[styles.nextBtn, { width: '55%', height: 50 }]} onPress={() => {}}>
          <Text style={{ color: '#ffff', textAlign: 'center' }}>add to an existing memory</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.nextBtn, { width: '55%', height: 50 }]} onPress={() => {handleAddNewMemory()}}>
          <Text style={{ color: '#ffff', textAlign: 'center' }}>add new memory</Text>
        </TouchableOpacity>
    
</View>
      </ImageBackground>
  )
}


export default Memories

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
modalView:{
  justifyContent:'center',
},
input: {
  width: '80%',
  height: 50,
  borderRadius: 10,
  backgroundColor:'transparent',
  borderBottomWidth:1,
  borderColor:'#FAF9F6',
  textAlign:'center',
  color:'white'
}


  
});

