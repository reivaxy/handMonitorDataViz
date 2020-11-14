/* 
*  =============================================================================================================================================
*  Project : Hand Monitor Data visualisation e-Nable France
*  Author  : Xavier Grosjean
* 
*  ---------------------------------------------------------------------------------------------------------------------------------------------
*  Description : minimal test "framework"
* 
* =============================================================================================================================================
*/

function testInterval() {
  let dateTime = new Date();
  let interval = new Interval(dateTime);
  let endOfDay = date24h(dateTime);

  console.assert(interval.start.getTime() == dateTime.getTime());
  console.assert(interval.stop.getTime() == endOfDay.getTime());
  
  let now = new Date();
  interval.setStart(now);
  interval.setStop(now);
  console.assert(interval.start.getTime() == now.getTime());
  console.assert(interval.stop.getTime() == now.getTime());
  
}

function testDayCounter() {
  let now = new Date();
  let beginingOfDay = date0h(now);
  let endOfDay = date24h(now);

  let dayCounter = new DayCounter(now);
  console.assert(dayCounter.currentInterval === null);
  console.assert(dayCounter.intervals.length === 0);
  
  dayCounter.on(now);
  console.assert(dayCounter.currentInterval.start.getTime() === now.getTime());
  console.assert(dayCounter.currentInterval.stop.getTime() === endOfDay.getTime());
  let midnight = date24h(now);
  let minutes = Math.round((midnight - now)/60000);
  // As long as we didn't get the 'stop' data, consider it runs 'on' until midnight
  console.assert(dayCounter.getMinuteCount() === minutes);
  // Set the stop one minute later and test counter is one minute 
  dayCounter.off(new Date(now.getTime() + 60000));
  console.assert(dayCounter.getMinuteCount() === 1);
  console.assert(dayCounter.intervals.length === 1);
  
  // Process a new period (can use same dates, we don't care)
  dayCounter.on(now);
  console.assert(dayCounter.intervals.length === 2);
  console.assert(dayCounter.currentInterval.start.getTime() === now.getTime());
  console.assert(dayCounter.currentInterval.stop.getTime() === endOfDay.getTime());
  
  // As long as we didn't get the 'stop' data, consider it runs 'on' until midnight
  // So minute count is from now until midnight, + 1mn for the previous interval
  console.assert(dayCounter.getMinuteCount() === minutes + 1);
  // Set the stop one minute later and test counter is now 2 minutes 
  dayCounter.off(new Date(now.getTime() + 60000));
  console.assert(dayCounter.getMinuteCount() === 2);
  console.assert(dayCounter.intervals.length === 2);
  
  // Test that when starting with an off event, we get a start time at 0h
  dayCounter = new DayCounter(now);
  dayCounter.off(now);
  minutes = Math.round((now - beginingOfDay) / 60000) ;
  console.assert(dayCounter.intervals.length === 1);
  console.assert(dayCounter.getMinuteCount() === minutes);
 
}

function testFirstDay() {
  let now = new Date();
  let f = firstMonthDay(now);
  console.assert(f.getDate() === 1);
  console.assert(f.getMonth() === now.getMonth());
  console.assert(f.getFullYear() === now.getFullYear());
}

function testLastDay() {
  let now = new Date('November 15, 2020 10:11:00') ;
  let f = lastMonthDay(now);
  console.assert(f.getMonth() === now.getMonth());
  console.assert(f.getFullYear() === now.getFullYear());
  console.assert(f.getDate() === 30);
}

function testDayCollection() {
  let now = new Date('November 15, 2020 10:11:00');
  let col = new DayCollection();
  col.init(now);
  let days = col.getDays();
  let firstDay = firstMonthDay(now);
  let lastDay = lastMonthDay(now);
  console.assert(days[DayCollection.dayId(firstDay)].getMinuteCount() === 0);
  console.assert(days[DayCollection.dayId(lastDay)].getMinuteCount() === 0);
  
}

function run(test) {
  let name = test.name;
  $("#results").append($("<div>").text("Running " + name));
  test.call();
}

run(testInterval);
run(testDayCounter);
run(testFirstDay);
run(testLastDay);
run(testDayCollection);
$("#results").append($("<div>").text("Done"));
