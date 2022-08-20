const plantDates = (events, days) => {
    console.log("plantDates() called")
            return setDates(events, days)         

}

const setDates = (events, count) => {
    console.log("setdates called")
   let flag = false;
    let date = new Date()
    console.log(date.getDate() + count)

    if(count == 7)
    {
        console.log("count was 7")
    return events.map(
        (obj) => {
            date.setDate(date.getDate() + count)
            obj.properties['scheduledDate'] = date.toDateString().toString()
            return obj

        }

    )
    }
    else 
    {
        return events.map(
            (obj) => {
                {
                if(flag == false)
                {
                    if(obj)
{
    
    
                date.setDate(date.getDate() + count)
                obj.properties['scheduledDate'] = date.toDateString().toString()
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
                    obj.properties['scheduledDate'] = date.toDateString().toString()
                    return obj
}
                }
    
            }
        }
    
        )
    }
}

export default plantDates