import React, { useState, useEffect , useRef} from 'react';
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView, FlatList, TouchableOpacity, Linking, useWindowDimensions , Animated, Image, ImageBackground, ScrollView, Button} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getNames, getSchedule, } from '../storage/Database';



const Info = ({ navigation }) => {
  const [loading, setLoading] = useState("")
  const [data, setData] = useState([{name:"",lon:0,lat:0,date:""}])
  const [isMounted, setIsMounted] = useState(true)
  const [appState, setAppState] = useState("questioning")
  const [currentView, setCurrentView] = useState(0)
  const { width } = useWindowDimensions();
  const scrollX = useRef(new Animated.Value(0)).current

  const [name,setName ] = useState("")



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


  const viewableItemsChanged = useRef(
    ({viewableItems})=>{
      setCurrentView(viewableItems[0].index)
    }
  ).current

  const renderItem = (item, index) => {
    {
      
   return <View style={{ width:"100%", alignItems:'center', justifyContent:'center',  flex:1}}>
        <View style={styles.dateBtn} >
          <View style = {{flex:1,flexDirection:'row',justifyContent:'space-around', alignItems:'center', width:'100%' }}>
            <Button title='edit'/>
            <View style = {{flex:.9, flexDirection:'row', justifyContent:'space-between'}}>
        <Text style={{ color: 'black', textAlign:'center', fontSize:14 }} numberOfLines={1}>{item.name.slice(0, 15) + "..."}
        </Text>
<Text style = {{fontSize:14}}>{item.date}</Text>
</View>
        </View>
        </View>
        
        </View>
    }
  };

  if (loading) return <ActivityIndicator />

  else return (
    <ImageBackground resizeMode={"cover"} source={require('../assets/settings-background.png')} style={styles.container}>
          <View style = {styles.topSpace}>
      <Text style = {{color:'black', fontSize:25}}>{"General Information"}</Text>

      </View>
      <Text style = {{color:'white', fontSize:16, flex:1, justifyContent:'center'}}>{"v1.0.0"}</Text>

<View style = {{backgroundColor:'#ffff', flex:10, width:'90%', borderRadius:15, alignItems:'center',marginBottom:'5%'}}>
  
  <ScrollView style = {styles.scrollView}>
    <View style={{alignItems:'center'}}>
  <Text style = {styles.header}>
  Terms and conditions
</Text>
<Text>
These terms and conditions (“Agreement”) set forth the general terms and conditions of your use of the “Date Dealer” mobile application (“Mobile Application” or “Service”) and any of its related products and services (collectively, “Services”). This Agreement is legally binding between you (“User”, “you” or “your”) and this Mobile Application developer (“Operator”, “we”, “us” or “our”). If you are entering into this agreement on behalf of a business or other legal entity, you represent that you have the authority to bind such entity to this agreement, in which case the terms “User”, “you” or “your” shall refer to such entity. If you do not have such authority, or if you do not agree with the terms of this agreement, you must not accept this agreement and may not access and use the Mobile Application and Services. By accessing and using the Mobile Application and Services, you acknowledge that you have read, understood, and agree to be bound by the terms of this Agreement. You acknowledge that this Agreement is a contract between you and the Operator, even though it is electronic and is not physically signed by you, and it governs your use of the Mobile Application and Services.
</Text>
<Text style = {styles.header}>
Age requirement
</Text>
<Text>
 You must be at least 16 years of age to use the Mobile Application and Services. By using the Mobile Application and Services and by agreeing to this Agreement you warrant and represent that you are at least 16 years of age.
 </Text>
 <Text style = {styles.header}>
Links to other resources
</Text>
<Text>
Although the Mobile Application and Services may link to other resources (such as websites, mobile applications, etc.), we are not, directly or indirectly, implying any approval, association, sponsorship, endorsement, or affiliation with any linked resource, unless specifically stated herein. We are not responsible for examining or evaluating, and we do not warrant the offerings of, any businesses or individuals or the content of their resources. We do not assume any responsibility or liability for the actions, products, services, and content of any other third parties. You should carefully review the legal statements and other conditions of use of any resource which you access through a link in the Mobile Application. Your linking to any other off-site resources is at your own risk.
</Text>
<Text style = {styles.header}>
Intellectual property rights
</Text>
<Text>
“Intellectual Property Rights” means all present and future rights conferred by statute, common law or equity in or in relation to any copyright and related rights, trademarks, designs, patents, inventions, goodwill and the right to sue for passing off, rights to inventions, rights to use, and all other intellectual property rights, in each case whether registered or unregistered and including all applications and rights to apply for and be granted, rights to claim priority from, such rights and all similar or equivalent rights or forms of protection and any other results of intellectual activity which subsist or will subsist now or in the future in any part of the world. This Agreement does not transfer to you any intellectual property owned by the Operator or third parties, and all rights, titles, and interests in and to such property will remain (as between the parties) solely with the Operator. All trademarks, service marks, graphics and logos used in connection with the Mobile Application and Services, are trademarks or registered trademarks of the Operator or its licensors. Other trademarks, service marks, graphics and logos used in connection with the Mobile Application and Services may be the trademarks of other third parties. Your use of the Mobile Application and Services grants you no right or license to reproduce or otherwise use any of the Operator or third party trademarks.
</Text>
<Text style = {styles.header}>

Limitation of liability
</Text>
<Text>

To the fullest extent permitted by applicable law, in no event will the Operator, its affiliates, directors, officers, employees, agents, suppliers or licensors be liable to any person for any indirect, incidental, special, punitive, cover or consequential damages (including, without limitation, damages for lost profits, revenue, sales, goodwill, use of content, impact on business, business interruption, loss of anticipated savings, loss of business opportunity) however caused, under any theory of liability, including, without limitation, contract, tort, warranty, breach of statutory duty, negligence or otherwise, even if the liable party has been advised as to the possibility of such damages or could have foreseen such damages. To the maximum extent permitted by applicable law, the aggregate liability of the Operator and its affiliates, officers, employees, agents, suppliers and licensors relating to the services will be limited to an amount no greater than one dollar or any amounts actually paid in cash by you to the Operator for the prior one month period prior to the first event or occurrence giving rise to such liability. The limitations and exclusions also apply if this remedy does not fully compensate you for any losses or fails of its essential purpose.
</Text>
<Text style = {styles.header}>

Dispute resolution
</Text>
<Text>

The formation, interpretation, and performance of this Agreement and any disputes arising out of it shall be governed by the substantive and procedural laws of Texas, United States without regard to its rules on conflicts or choice of law and, to the extent applicable, the laws of United States. The exclusive jurisdiction and venue for actions related to the subject matter hereof shall be the courts located in Texas, United States, and you hereby submit to the personal jurisdiction of such courts. You hereby waive any right to a jury trial in any proceeding arising out of or related to this Agreement. The United Nations Convention on Contracts for the International Sale of Goods does not apply to this Agreement.
</Text>
<Text style = {styles.header}>

Changes and amendments
</Text>
<Text>

We reserve the right to modify this Agreement or its terms related to the Mobile Application and Services at any time at our discretion. When we do, we will post a notification in the Mobile Application. We may also provide notice to you in other ways at our discretion, such as through the contact information you have provided.
</Text>
<Text>

An updated version of this Agreement will be effective immediately upon the posting of the revised Agreement unless otherwise specified. Your continued use of the Mobile Application and Services after the effective date of the revised Agreement (or such other act specified at that time) will constitute your consent to those changes.
</Text>
<Text style = {styles.header}>

Acceptance of these terms
</Text>
<Text>

You acknowledge that you have read this Agreement and agree to all its terms and conditions. By accessing and using the Mobile Application and Services you agree to be bound by this Agreement. If you do not agree to abide by the terms of this Agreement, you are not authorized to access or use the Mobile Application and Services. 
</Text>
<Text style = {styles.header}>

Contacting us
</Text>
<Text>

If you have any questions, concerns, or complaints regarding this Agreement, we encourage you to contact us using the details below:
</Text>
<Text>

nicktsdop@gmail.com
</Text>
<Text>

This document was last updated on August 11, 2022 
</Text>
</View>
</ScrollView>
</View>
      </ImageBackground>
  )
}


export default Info

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
    flex: 6,
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
    flex:4,
    alignItems:'center',
    justifyContent:'center'
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
    height:'25%',
    borderRadius:20,
    justifyContent:'center',
    shadowColor:'blue',
    width:'40%',
    shadowOffset:{width:1,height:3},
    shadowOpacity:.5,
    shadowRadius:5,
    elevation:4,

  },
  middleBannerContainer:{

    alignItems:'center',
    height:'10%',
    justifyContent:'flex-end',
  },
  scrollView:{
    flex:1,
    margin:10
  },
  header:{
    fontWeight:'700',
    margin:20,
    letterSpacing:.3
  }
,


  
});

