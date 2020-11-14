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

let handmonitor = new HandMonitor("#title", "#chart_placeholder");
let dropZone = new DropZone("#dropzone", file => handmonitor.processFile(file));



