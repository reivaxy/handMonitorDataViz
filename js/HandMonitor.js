/* 
*  =============================================================================================================================================
*  Project : Hand Monitor Data visualisation e-Nable France
*  Author  : Xavier Grosjean
* 
*  ---------------------------------------------------------------------------------------------------------------------------------------------
*  Description : main HandMonitor class
* 
* =============================================================================================================================================
*/
class HandMonitor {
  constructor(titleSelector, onOffGraphSelector) {
    let _self = this;
    this.titleSelector = titleSelector;
    this.onOffGraph = new OnOffGraph(onOffGraphSelector);
    this.parseDate = d3.time.format("%d/%m/%Y %H:%M:%S").parse;
  }

  updateTitle(aDate) {
    let m = aDate.getMonth();
    let y = aDate.getFullYear();
    let month = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août",
      "Septembre", "Octobre", "Novembre", "Décembre"][m];
    $(this.titleSelector).text("Données de " + month + " " + y);
    $(this.titleSelector).show();
  }

  processFile(file) {
    var reader = new FileReader();
    let _self = this;
    reader.onload = function (e) {
      let fileLines = e.target.result.split(/\r\n|\r|\n/);
      let dataSet = [];
      let previous = 0;
      for (let i = 0; i < fileLines.length; i++) {
        let lineData = fileLines[i].split(',');
        // Compatibility with previous file format which was space separated
        if (lineData.length == 1) {
          lineData = fileLines[i].split(' ');
          let dDate = lineData.shift();
          lineData[0] = dDate + " " + lineData[0];
        }
        let theDate = _self.parseDate(lineData[0]);
        let jData = {
          date: theDate,
          value: +lineData[1]
        }
        if (i == 0) {
          _self.updateTitle(jData.date);
        }
        if (i != 0 && previous != jData.value) {
          dataSet.push({
            date: theDate,
            value: previous
          })
        }
        previous = +lineData[1];
        dataSet.push(jData);
      }
      _self.onOffGraph.processData(dataSet);
    }
    reader.readAsText(file);
  }


}