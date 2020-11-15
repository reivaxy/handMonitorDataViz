/* 
*  =============================================================================================================================================
*  Project : Hand Monitor Data visualisation e-Nable France
*  Author  : Xavier Grosjean
* 
*  ---------------------------------------------------------------------------------------------------------------------------------------------
*  Description : main script
* 
* =============================================================================================================================================
*/

let onOffGraphSelector = "#onOffGraph";
let minPerDayGraphSelector = "#minPerDayGraph";
let dropZoneSelector = "#dropzone";

let handmonitor = new HandMonitor("#title", onOffGraphSelector, minPerDayGraphSelector);
new DropZone(dropZoneSelector, file => handmonitor.processFile(file));

function restart() {
  $(onOffGraphSelector).empty();
  $(minPerDayGraphSelector).empty();
  $(document.body).removeClass("init");
  handmonitor = new HandMonitor("#title", onOffGraphSelector, minPerDayGraphSelector);
}



