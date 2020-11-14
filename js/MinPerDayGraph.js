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

    let margin = {top: 10, right: 100, bottom: 100, left: 100},
      width = window.innerWidth - margin.left - margin.right;

    this.height = 400 - margin.top - margin.bottom;

    this.x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
    this.y = d3.scale.linear().range([this.height, 0]);

    this.xAxis = d3.svg.axis().scale(this.x).orient("bottom");
    this.yAxis = d3.svg.axis().scale(this.y).orient("left").ticks(10);

    this.xAxis.tickFormat(d3.time.format("%d-%m-%Y"));

    this.svg = d3.select(this.graphSelector).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", this.height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

  }

  processData(dataSet) {
    for (let i = 0; i < dataSet.length; i++) {
      let record = dataSet[i];
      if (i == 0) {
        this.dayCollection.init(record.date);
      }
      // Ignore the events where measure is 0, it means
      // the device was plugged for charging, and no longer
      // detecting.
      if (record.measure == 0) {
        continue
      }
      if (record.value === 1) {
        this.dayCollection.on(record.date);
      } else {
        this.dayCollection.off(record.date);
      }
    }
    this.displayData();
  }

  displayData() {
    let days = this.dayCollection.getDays();
    let data = [];
    for (let i in days) {
      let day = days[i];
      //$(this.graphSelector).append($("<div>").text(day.getDate() + " " + day.getMinuteCount()));
      data.push({
        date: day.getDate(),
        value: day.getMinuteCount()
      });
    }

    this.x.domain(data.map(function (d) {
      return d.date;
    }));
    this.y.domain([0, d3.max(data, function (d) {
      return d.value;
    })]);
    this.svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + this.height + ")")
      .call(this.xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-45) translate(5, 10)");

    this.svg.append("g")
      .attr("class", "y axis")
      .call(this.yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Minutes");
    let _self = this;
    this.svg.selectAll("bar")
      .data(data)
      .enter().append("rect")
      .style("fill", "steelblue")
      .attr("x", function (d) {
        return _self.x(d.date);
      })
      .attr("width", _self.x.rangeBand())
      .attr("y", function (d) {
        return _self.y(d.value);
      })
      .attr("height", function (d) {
        return _self.height - _self.y(d.value);
      });

  }
}


class DayCollection {
  constructor() {
    this.days = {};
  }

  init(dateTime) {
    let day = firstMonthDay(dateTime);
    let lastDay = lastMonthDay(dateTime);
    for (let i = 0; i < lastDay.getDate(); i++) {
      this.days[DayCollection.dayId(day)] = new DayCounter(day);
      day = nextDay(day);
    }
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
    let day = "0" + (dateTime.getDate());
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
    if (this.currentInterval != null) {
      this.currentInterval.setStart(dateTime);
    } else {
      this.currentInterval = new Interval(dateTime);
      this.intervals.push(this.currentInterval);
    }
  }

  off(dateTime) {
    // If we get an 'off' while there was no current interval, it means
    // it was 'on' since day before: add interval starting a 0h
    if (this.currentInterval == null) {
      this.currentInterval = new Interval(date0h(dateTime));
      this.intervals.push(this.currentInterval);
    }
    this.currentInterval.setStop(dateTime);
    this.currentInterval = null;
  }

  getMinuteCount() {
    let count = 0;
    for (let i = 0; i < this.intervals.length; i++) {
      let interval = this.intervals[i];
      let intervalCount = interval.stop - interval.start;
      count += intervalCount;
    }
    return Math.round(count / 60000);
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

