// import * as Notifications from 'expo-notifications';



//     const PlantNotifications=()=>{
//         const plantNotifications=(orderedRes)=>{
//     Notifications.cancelAllScheduledNotificationsAsync()
//     orderedRes.forEach((obj)=>{
 
//                 Notifications.scheduleNotificationAsync({
        
//         content: {
//           title: "your date in 3 days!",
//           body: 'You have a date at the ' + obj.name +  'on ' + obj.date + " .",
//           data: { data: 'goes here' },
        
          
//         },
        
//         trigger: { seconds: new Date(obj.date).getTime() - new Date().getTime()},
//       })

    

//       Notifications.getAllScheduledNotificationsAsync().then(()=>console.log(res))
  
//   }

// )
//         }
// }
// export default PlantNotifications
