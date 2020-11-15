/* 
*  =============================================================================================================================================
*  Project : Hand Monitor Data visualisation e-Nable France
*  Author  : Xavier Grosjean
* 
*  ---------------------------------------------------------------------------------------------------------------------------------------------
*  Description : Class handling the drop zone for a file downloaded from the handMonitor device
* 
* =============================================================================================================================================
*/

class DropZone {
  constructor(dropZoneSelector, dropCallBack) {
    this.dropZoneSelector = dropZoneSelector;
    $(this.dropZoneSelector).on("dragover", ev => this.dragOverHandler(ev));
    $(this.dropZoneSelector).on("drop", ev => this.dropHandler(ev));
    this.dropCallBack = dropCallBack;
  }
  
  dragOverHandler(evt) {
    evt.preventDefault();
  }
  
  dropHandler(evt) {
    let ev = evt.originalEvent;
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
  
    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (var i = 0; i < ev.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (ev.dataTransfer.items[i].kind === 'file') {
          var file = ev.dataTransfer.items[i].getAsFile();
          console.log('... file[' + i + '].name = ' + file.name);
          if (file.type.indexOf("application/vnd.ms-excel") == 0 ||
            file.type.indexOf("text/plain") == 0) {
            this.dropCallBack(file);
          }
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (var i = 0; i < ev.dataTransfer.files.length; i++) {
        console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
        if (ev.dataTransfer.files[i].type.indexOf("application/vnd.ms-excel") == 0 ||
          ev.dataTransfer.files[i].type.indexOf("text/plain") == 0) {
          this.dropCallBack(ev.dataTransfer.files[i]);
        }
      }
    }
  }
}