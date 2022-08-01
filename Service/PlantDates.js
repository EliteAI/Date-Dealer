const plantDates = (events, days) => {
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
            obj.scheduledDate = date.toDateString()
            return obj

        }

    )
    }
    else 
    {
        return events.map(
            (obj) => {
                if(flag == false)
                {
            
                date.setDate(date.getDate() + count)
                // console.log(date.toDateString() + count)
                obj.scheduledDate = date.toDateString()
                flag = true;
                return obj
                }
                else
                {
                    date.setDate(date.getDate() + 7)
                    // console.log(date.toDateString() + count)
                    obj.scheduledDate = date.toDateString()
                    return obj
                }
    
            }
    
        )
    }
}

export default plantDates