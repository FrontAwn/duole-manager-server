const moment = require('moment')
const debug = require('./utils').common.debug

exports.getDay = ()=>{
  let startTime = "00:00:00"
  let endTime = "23:59:59"
  let date = new Date;
  let year = date.getFullYear()
  let month = date.getMonth()+1
  let day = date.getDate()
  if(day < 10) {
    day = `0${day}`
  }
  if( parseInt(month) < 10 ) {
    month = `0${month}`
  }

  let scopeDate = []
  let scopeDateByHour = []
  for(let i=1; i<=24; i++) {
    let hour = i
    scopeDateByHour.push(`${i}时`)
    if(i<10) {
      hour = `0${i}`
    }
    scopeDate.push(`${hour}:00:00`)
  }

  return {
    startDate:`${year}-${month}-${day} ${startTime}`,
    endDate:`${year}-${month}-${day} ${endTime}`,
    scopeDate,
    scopeDateByHour,
  }
}

exports.getOneWeekScope = ()=>{
  let startTime = "00:00:00"
  let endTime = "23:59:59"
  let date = new Date;
  let year = date.getFullYear()
  let month = date.getMonth()+1
  let bigMonths = [1,3,5,7,8,10,12]
  let day = date.getDate()
  let currentDay = day
  let startDay = null
  let scopeDate = []
  for(let i=1;i<=7;i++) {
    if(currentDay < 1) {

      if(parseInt(month) - 1 == 0) {
        month = 12
        year -= 1
      }else{
        month -= 1
      }

      if( parseInt(month) == 2 ) {
        if( (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0) ) {
            currentDay = 29
          }else{
            currentDay = 28
          }
      } else if( bigMonths.includes(parseInt(month)) ) {
            currentDay = 31
      } else {
            currentDay = 30
      }

    }

    let scopeMonth = month
    let scopeDay = currentDay
    if(parseInt(scopeMonth) < 10) scopeMonth = `0${scopeMonth}`
    if(parseInt(scopeDay) < 10) scopeDay = `0${scopeDay}`
    scopeDate.unshift(`${year}-${scopeMonth}-${scopeDay}`)
    currentDay -= 1
  }

  startDay = (currentDay+1)

  if(parseInt(day) < 10) day = `0${day}`
  if(parseInt(startDay) < 10)  startDay = `0${startDay}`
  if(parseInt(month) < 10) month = `0${month}`

  return {
    startDate:`${year}-${month}-${startDay} ${startTime}`,
    endDate:`${year}-${month}-${day} ${endTime}`,
    scopeDate,
  }

}

exports.getOneMonthScope = ()=>{
	let startTime = "00:00:00"
    let endTime = "23:59:59"
    let startDay = "01"
    let endDay = null
    let date = new Date;
    let year = date.getFullYear()
    let month = date.getMonth()+1
    let bigMonths = [1,3,5,7,8,10,12]
    let scopeDate = []

    if( parseInt(month) < 10 ) {
      month = `0${month}`
    }
    
    if( parseInt(month) === 2 ) {
      if( (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0) ) {
        endDay = "29"
      }else{
        endDay = "28"
      }
    } else if( bigMonths.includes(parseInt(month)) ) {
        endDay = "31"
    } else {
        endDay = "30"
    }

    for(let i=1; i<=endDay; i++) {
      if( i<10 ) {
        i = `0${i}`
      }
      scopeDate.push(`${year}-${month}-${i}`)
    } 

    return {
      startDate:`${year}-${month}-${startDay} ${startTime}`,
      endDate:`${year}-${month}-${endDay} ${endTime}`,
      scopeDate,
    }
}


exports.getBeforeOneWeek = ()=>{
	let date = []
	let startTime = "00:00:00"
  let endTime = "23:59:59"
	date.push(moment().subtract('days', 6).format('YYYY-MM-DD'))
	date.push(moment().subtract('days', 0).format('YYYY-MM-DD'))
	return {
		startDate:`${date[0]} ${startTime}`,
		endDate:`${date[1]} ${endTime}`
	}
}

exports.getBeforeOneMonth = ()=>{
	let date = new Date();
	let startTime = "00:00:00"
    let endTime = "23:59:59"
    let month = date.getMonth()+1
    let bigMonths = [1,3,5,7,8,10,12]
	let dates = []
	if( bigMonths.includes(month) ) {
		dates.push(moment().subtract('days', 30).format('YYYY-MM-DD'))
		dates.push(moment().subtract('days', 0).format('YYYY-MM-DD'))	
	} else {
		dates.push(moment().subtract('days', 29).format('YYYY-MM-DD'))
		dates.push(moment().subtract('days', 0).format('YYYY-MM-DD'))	
	}
	
	return {
		startDate:`${dates[0]} ${startTime}`,
		endDate:`${dates[1]} ${endTime}`
	}

}



exports.getBeforeWeekByNum = (num=4,defaultDate=null)=>{
    let res = {}
    let dateScope = null
    var initDate = ''
    if (defaultDate === null) {
      initDate = moment().format('YYYY-MM-DD')
    } else {
      initDate = moment(defaultDate).format('YYYY-MM-DD')
    }
     
    let startTime = "00:00:00"
    let endTime = "23:59:59"


    function getDateScope(startDate) {
        var end = moment(startDate).subtract('days', 0).format('YYYY-MM-DD')
        var start = moment(startDate).subtract('days', 6).format('YYYY-MM-DD')
        var nextEndDate = moment(startDate).subtract('days', 7).format('YYYY-MM-DD')
        var sTime = `${start} ${startTime}`
        var eTime = `${end} ${endTime}`
        return {
           start,
           end,
           sTime,
           eTime,
           nextEndDate
        }
    }

    for( let i=0; i<num; i++ ) {
        dateScope = getDateScope(initDate);
        initDate = dateScope['nextEndDate']
        res[i+1+'-week'] = dateScope
    }  

    return res
}
















