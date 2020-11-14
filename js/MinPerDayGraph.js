/* 
*  =============================================================================================================================================
*  Project : Hand Monitor Data visualisation e-Nable France
*  Author  : Xavier Grosjean
* 
*  ---------------------------------------------------------------------------------------------------------------------------------------------
*  Description : Class handling the min per day graph showing how many minute per day the handmonitor device detected the prosthetic was being used
* 
* =============================================================================================================================================
*/

class MinPerDayGraph {
  constructor(graphSelector) {
    let _self = this;
    this.graphSelector = graphSelector;
    this.dayCollection = new DayCollection();
  }
  
  processData(dataSet) {
    for(let i=0; i < dataSet.length; i++) {
      let record = dataSet[i];
      if(record.value === 1) {
        this.dayCollection.on(record.date);
      } else {
        this.dayCollection.off(record.date);
      }
    }  
    this.displayData();
  }

  displayData() {
    let days = this.dayCollection.getDays();
    for(let i in days) {
      let day = days[i];
      $(this.graphSelector).append($("<div>").text(day.getDate() + " " + day.getMinuteCount()));
    }
  }
}


class DayCollection {
  constructor() {
    this.days = {};
  }  
  
  on(dateTime) {
    let id = DayCollection.dayId(dateTime);
    if (!(id in this.days)) {
      this.days[id] = new DayCounter(dateTime);
    }
    this.days[id].on(dateTime);
  }
  
  off(dateTime) {
    let id = DayCollection.dayId(dateTime);
    if (!(id in this.days)) {
      this.days[id] = new DayCounter(dateTime);
    }
    this.days[id].off(dateTime);    
  }
  
  getDays() {
    return this.days;
  }
  
  static dayId(dateTime) {
    // we want two digits, i.e. 01, 02, ... 10, 11, ...
    let month = "0" + (dateTime.getMonth() + 1);
    month = month.substring(month.length - 2);  
    let day = "0" + (dateTime.getDate() + 1);
    day = day.substring(day.length - 2);
    return `${dateTime.getFullYear()}${month}${day}`;
  }
}

class DayCounter {
  constructor(dateTime) {
    this.dayBeginingDate = date0h(dateTime);
    this.intervals = [];
    this.currentInterval = null;
  }
  
  getDate() {
    return this.dayBeginingDate;
  }
  
  on(dateTime) {
    if(this.currentInterval != null) {
      this.currentInterval.setStart(dateTime);
    } else {
      this.currentInterval = new Interval(dateTime);
      this.intervals.push(this.currentInterval);      
    }
  }
  
  off(dateTime) {
    if(this.currentInterval != null) {
      this.currentInterval.setStop(dateTime);
      this.currentInterval = null;
    }
  }
  
  getMinuteCount() {
    let count = 0;
    for(let i=0; i < this.intervals.length; i++) {
      let interval = this.intervals[i];
      let intervalCount = interval.stop - interval.start;
      count += intervalCount;
    }
    return Math.round(count/ 60000);
  }
}

class Interval {
  constructor(dateTime) {
    // Interval starts at given date and time
    this.start = new Date(dateTime);
    // In case we never get the end for this day, let's consider it's midnight
    this.stop = date24h(dateTime);
  }
  setStart(dateTime) {
    this.start = dateTime;
  }  
  setStop(dateTime) {
    this.stop = dateTime;
  }
}

