const moment = require('moment');
const debug = require('./common').debug;

exports.getDay = () => {
  const startTime = '00:00:00';
  const endTime = '23:59:59';
  const date = new Date();
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  if (day < 10) {
    day = `0${day}`;
  }
  if (parseInt(month) < 10) {
    month = `0${month}`;
  }

  const scopeDate = [];
  const scopeDateByHour = [];
  for (let i = 1; i <= 24; i++) {
    let hour = i;
    scopeDateByHour.push(`${i}时`);
    if (i < 10) {
      hour = `0${i}`;
    }
    scopeDate.push(`${hour}:00:00`);
  }

  return {
    startDate: `${year}-${month}-${day} ${startTime}`,
    endDate: `${year}-${month}-${day} ${endTime}`,
    scopeDate,
    scopeDateByHour,
  };
};

exports.getOneWeekScope = () => {
  const startTime = '00:00:00';
  const endTime = '23:59:59';
  const date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  const bigMonths = [ 1, 3, 5, 7, 8, 10, 12 ];
  let day = date.getDate();
  let currentDay = day;
  let startDay = null;
  const scopeDate = [];
  for (let i = 1; i <= 7; i++) {
    if (currentDay < 1) {

      if (parseInt(month) - 1 == 0) {
        month = 12;
        year -= 1;
      } else {
        month -= 1;
      }

      if (parseInt(month) == 2) {
        if ((year % 4 == 0) && (year % 100 != 0 || year % 400 == 0)) {
          currentDay = 29;
        } else {
          currentDay = 28;
        }
      } else if (bigMonths.includes(parseInt(month))) {
        currentDay = 31;
      } else {
        currentDay = 30;
      }

    }

    let scopeMonth = month;
    let scopeDay = currentDay;
    if (parseInt(scopeMonth) < 10) scopeMonth = `0${scopeMonth}`;
    if (parseInt(scopeDay) < 10) scopeDay = `0${scopeDay}`;
    scopeDate.unshift(`${year}-${scopeMonth}-${scopeDay}`);
    currentDay -= 1;
  }

  startDay = (currentDay + 1);

  if (parseInt(day) < 10) day = `0${day}`;
  if (parseInt(startDay) < 10) startDay = `0${startDay}`;
  if (parseInt(month) < 10) month = `0${month}`;

  return {
    startDate: `${year}-${month}-${startDay} ${startTime}`,
    endDate: `${year}-${month}-${day} ${endTime}`,
    scopeDate,
  };

};

exports.getOneMonthScope = () => {
  const startTime = '00:00:00';
  const endTime = '23:59:59';
  const startDay = '01';
  let endDay = null;
  const date = new Date();
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  const bigMonths = [ 1, 3, 5, 7, 8, 10, 12 ];
  const scopeDate = [];

  if (parseInt(month) < 10) {
    month = `0${month}`;
  }

  if (parseInt(month) === 2) {
    if ((year % 4 == 0) && (year % 100 != 0 || year % 400 == 0)) {
      endDay = '29';
    } else {
      endDay = '28';
    }
  } else if (bigMonths.includes(parseInt(month))) {
    endDay = '31';
  } else {
    endDay = '30';
  }

  for (let i = 1; i <= endDay; i++) {
    if (i < 10) {
      i = `0${i}`;
    }
    scopeDate.push(`${year}-${month}-${i}`);
  }

  return {
    startDate: `${year}-${month}-${startDay} ${startTime}`,
    endDate: `${year}-${month}-${endDay} ${endTime}`,
    scopeDate,
  };
};


exports.getBeforeOneWeek = () => {
  const date = [];
  const startTime = '00:00:00';
  const endTime = '23:59:59';
  date.push(moment().subtract('days', 6).format('YYYY-MM-DD'));
  date.push(moment().subtract('days', 0).format('YYYY-MM-DD'));
  return {
    startDate: `${date[0]} ${startTime}`,
    endDate: `${date[1]} ${endTime}`,
  };
};

exports.getBeforeOneMonth = () => {
  const date = new Date();
  const startTime = '00:00:00';
  const endTime = '23:59:59';
  const month = date.getMonth() + 1;
  const bigMonths = [ 1, 3, 5, 7, 8, 10, 12 ];
  const dates = [];
  if (bigMonths.includes(month)) {
    dates.push(moment().subtract('days', 30).format('YYYY-MM-DD'));
    dates.push(moment().subtract('days', 0).format('YYYY-MM-DD'));
  } else {
    dates.push(moment().subtract('days', 29).format('YYYY-MM-DD'));
    dates.push(moment().subtract('days', 0).format('YYYY-MM-DD'));
  }

  return {
    startDate: `${dates[0]} ${startTime}`,
    endDate: `${dates[1]} ${endTime}`,
  };

};


exports.getBeforeWeekByNum = (num = 4, defaultDate = null) => {
  const res = {};
  let dateScope = null;
  let initDate = '';
  if (defaultDate === null) {
    initDate = moment().format('YYYY-MM-DD');
  } else {
    initDate = moment(defaultDate).format('YYYY-MM-DD');
  }

  const startTime = '00:00:00';
  const endTime = '23:59:59';


  function getDateScope(startDate) {
    const end = moment(startDate).subtract('days', 0).format('YYYY-MM-DD');
    const start = moment(startDate).subtract('days', 6).format('YYYY-MM-DD');
    const nextEndDate = moment(startDate).subtract('days', 7).format('YYYY-MM-DD');
    const sTime = `${start} ${startTime}`;
    const eTime = `${end} ${endTime}`;
    return {
      start,
      end,
      sTime,
      eTime,
      nextEndDate,
    };
  }

  for (let i = 0; i < num; i++) {
    dateScope = getDateScope(initDate);
    initDate = dateScope.nextEndDate;
    res[i + 1 + '-week'] = dateScope;
  }

  return res;
};

