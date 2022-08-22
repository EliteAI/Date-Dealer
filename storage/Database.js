import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase("db.date-dealer-production-us","1.0.3")

const turnForeignKeysOn = ()=>
{
  return new Promise((resolve, reject)=>{
    db.transaction(
        dbName=>{
            dbName.executeSql(
                'PRAGMA foreign_keys = ON;',[],(trans, result)=>{
              
              }
            )
        }
    )
  }
    )
}
 
const insertSchedule = (name,lon,lat,date, type) =>{
  return new Promise((resolve, reject)=>{
  db.transaction(
      dbName=>{
          dbName.executeSql(
              'INSERT INTO schedule (name,lon,lat, date, type) VALUES(?,?,?,?,?)',[name,lon,lat,date, type],(trans, result)=>{
                resolve(result)
            }
          )
      }
  )
}
  )
}

const updateSchedule = (name,date) =>{
  return new Promise((resolve, reject)=>{
  db.transaction(
      dbName=>{
          dbName.executeSql(
              'UPDATE schedule SET date = ? WHERE name = ?',[date, name],(trans, result)=>{
                resolve
            }
          )
      }
  )
}
  )
}

const insertLocation = (lon,lat) =>{
  return new Promise((resolve, reject)=>{
  db.transaction(
      dbName=>{
          dbName.executeSql(
              'INSERT INTO location (lon,lat) VALUES(?,?,?,?)',[lon,lat],(trans, result)=>{
                resolve(result._array)
            }
          )
      }
  )
}
  )
}

const insertName = (name,partnerName) =>{
    return new Promise((resolve, reject)=>{
    db.transaction(
        dbName=>{
            dbName.executeSql(
                'INSERT INTO users (name,partnerName) VALUES(?,?)',[name, partnerName],(trans, result)=>{
              
              }
            )
        }
    )
  }
    )
}

const insertInterest = (interests) =>{
  // interests = "test"
  // console.log(JSON.stringify(interests.restaraunt))
  return new Promise((resolve, reject)=>{
  db.transaction(
      dbName=>{
        
          dbName.executeSql(
            'INSERT INTO intrst (restaraunts, outdoor, shopping, physical, movies, concerts, lazy, creative, scenic) VALUES(?, ?, ? ,?,?,?,?,?,?)',[interests.restaraunt, interests.outdoor, interests.shopping, interests.physical, interests.movies, interests.concerts, interests.lazy, interests.creative, interests.scenic],(trans, result)=>{
            
            }
          )
      }
  )
}
  )
}

const insertAvailability = (availability) =>{
  // interests = "test"
  // console.log(JSON.stringify(interests.restaraunt))
  return new Promise((resolve, reject)=>{
  db.transaction(
      dbName=>{
        
          dbName.executeSql(
            'INSERT INTO availability (monday, tuesday, wednesday, thursday, friday, saturday, sunday) VALUES(?, ?, ? ,?,?,?,?)',[availability.monday, availability.tuesday, availability.wednesday, availability.thursday, availability.friday, availability.saturday, availability.sunday],(trans, result)=>{resolve(result)
            
            }
          )
      }
  )
}
  )
}

const createTable = (tableName) =>{
db.transaction(name => {
    tableName == "interests"?name.executeSql(
      'CREATE TABLE IF NOT EXISTS intrst (interestsId INTEGER REFERENCES users(id), restaraunts TEXT, outdoor TEXT,shopping TEXT, physical TEXT, movies TEXT, concerts TEXT, lazy TEXT, creative TEXT, scenic TEXT)',[],(trans, result)=>{}
    ) : tableName == "users" ? name.executeSql(
      'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, partnerName TEXT)',[],(trans, result)=>{}
    ) : tableName == "availability"? name.executeSql(
      'CREATE TABLE IF NOT EXISTS availability (availabilityId INTEGER REFERENCES users(id), monday TEXT, tuesday TEXT, wednesday TEXT, thursday TEXT, friday, TEXT, saturday TEXT, sunday TEXT)',[],(trans, result)=>{} 
    )
      : tableName == "schedule"? name.executeSql(
        'CREATE TABLE IF NOT EXISTS schedule (scheduleId INTEGER REFERENCES users(id), name TEXT, lon TEXT, lat TEXT, date TEXT, type TEXT)',[],(trans, result)=>{} 
   ) : tableName == "schedule"? name.executeSql(
    'CREATE TABLE IF NOT EXISTS location (locationId INTEGER REFERENCES users(id), lon TEXT, lat TEXT)',[],(trans, result)=>{} 
   ) : null
      }

    )

}


const deleteUsers = () =>
{
  db.transaction(name=>{
    name.executeSql(
    'DELETE FROM users WHERE name != 1',[],(trans, result)=>{}
    )
  }

  )
}
const deleteSchedule = () =>
{
  db.transaction(name=>{
    name.executeSql(
    'DELETE FROM schedule',[],(trans, result)=>{}
    )
  }

  )
}
const deleteLocation = () =>
{
  db.transaction(name=>{
    name.executeSql(
    'DELETE FROM location',[],(trans, result)=>{}
    )
  }

  )
}
const deleteInterests = () =>
{
  db.transaction(name=>{
    name.executeSql(
    'DELETE FROM intrst',[],(trans, result)=>{console.log(trans + " " + result.rowsAffected + " we deleted all interests")}
    )
  }

  )
}

const deleteAvailability = () =>
{
  db.transaction(name=>{
    name.executeSql(
    'DELETE FROM availability',[],(trans, result)=>{console.log(trans + " " + result.rowsAffected + " we deleted all availability")}
    )
  }

  )
}

const dropTable = () =>
{
  db.transaction(name=>{
    name.executeSql(
    'DROP TABLE users',[],(trans, result)=>{}
    )
  }

  )
}

const getNames = async () => {   
return new Promise((resolve, reject) => {
    db.transaction(
        name=>{
         name.executeSql('SELECT * from users',[],(trans, result)=>{resolve(result.rows._array)})
        }
    )
      }
    )
}

const getLocationFromDb = async () => {   
  return new Promise((resolve, reject) => {
      db.transaction(
          name=>{
           name.executeSql('SELECT * from location',[],(trans, result)=>{resolve(result.rows._array)})
          }
      )
        }
      )
  }

const getSchedule = async () => {   
  return new Promise((resolve, reject) => {
      db.transaction(
          name=>{
           name.executeSql('SELECT * from schedule',[],(trans, result)=>{resolve(result.rows._array)})
          }
      )
        }
      )
  }

const getInterests = async () => {
  let res = {}
return new Promise((resolve, reject) => {
    db.transaction(
        name=>{
         name.executeSql('SELECT * from intrst',[],(trans, result)=>{Object.keys(result.rows.item(0)).forEach(key => {
    if (result.rows.item(0)[key] != null) {
        res[key]=result.rows.item(0)[key]
    }
}
),
resolve(res)
}
)
        }
    )
      }
    )
}

const getAvailability = async () => {
  let res = {}
  return new Promise((resolve, reject) => {
      db.transaction(
          name=>{
           name.executeSql('SELECT * from availability',[],(trans, result)=>{
            Object.keys(result.rows.item(0)).forEach(key => {
           
                  res[key]=result.rows.item(0)[key]
          }
          )

          resolve(res)
           })
     
          }
        
      )

 
        }
        
      )
  }

export {getAvailability, createTable,deleteUsers, insertName, getNames, insertInterest,dropTable,getInterests, deleteInterests, turnForeignKeysOn, insertAvailability, deleteAvailability, insertSchedule, deleteSchedule, getSchedule, deleteLocation, insertLocation, getLocationFromDb, updateSchedule} 
