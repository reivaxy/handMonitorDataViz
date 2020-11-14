

let handmonitor = new HandMonitor("#title", "#chart_placeholder");
let dropZone = new DropZone("#dropzone", file => handmonitor.processFile(file));



