const plantDates = (events, days) => {
    console.log(events)
            return setDates(events, days)         

}

const setDates = (events, count) => {
   let flag = false;
    let date = new Date()
    if(count == 7)
    {
    return events.map(
        (obj) => {
            date.setDate(date.getDate() + count)
            obj.properties['scheduledDate'] = date.toDateString()
            return obj

        }

    )
    }
    else 
    {
        return events.map(
            (obj) => {
                console.log(obj + " <--- my obj")
                console.log(events.length + "events length" + JSON.stringify(events))
                {
                    console.log(flag + "value")
                if(flag == false)
                {
                    console.log(JSON.stringify(obj) + "found")
                    if(obj)
{
    
                date.setDate(date.getDate() + count)
                // console.log(date.toDateString() + count)
                obj.properties['scheduledDate'] = date.toDateString()
                flag = true;
                return obj
}
                }
                else
                {
                    if(obj)
{
                    date.setDate(date.getDate() + 7)
                    // console.log(date.toDateString() + count)
                    obj.properties['scheduledDate'] = date.toDateString()
                    return obj
}
                }
    
            }
        }
    
        )
    }
}

export default plantDates