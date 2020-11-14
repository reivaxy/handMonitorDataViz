class HandMonitor {
  constructor(titleSelector, onOffGraphSelector) {
    let _self = this;
    this.titleSelector = titleSelector;
    this.onOffGraphSelector = onOffGraphSelector;
    this.parseDate = d3.time.format("%d/%m/%Y %H:%M:%S").parse;


    let margin = {top: 10, right: 50, bottom: 100, left: 50},
      width = window.innerWidth - margin.left - margin.right;
    
    this.height = 400 - margin.top - margin.bottom;


    this.x = d3.time.scale().range([0, width]);
    this.y = d3.scale.linear().range([this.height, 0]);

    this.xAxis = d3.svg.axis().scale(this.x).orient("bottom");
    this.yAxis = d3.svg.axis().scale(this.y).orient("left");

    this.yAxis.tickFormat(function (d, i) {
      if (d === 1) return "porté"; else return "";
    });

    let defaultTick = this.x.tickFormat();
    this.xAxis.tickFormat(function (d, i) {
      let label = defaultTick(d, i).split(' ');
      let translation = label[0];
      switch (label[0]) {
        case "Mon":
          translation = "Lundi";
          break;
        case "Tue":
          translation = "Mardi";
          break;
        case "Wed":
          translation = "Mercredi";
          break;
        case "Thu":
          translation = "Jeudi";
          break;
        case "Fri":
          translation = "Vendredi";
          break;
        case "Sat":
          translation = "Samedi";
          break;
        case "Sun":
          translation = "Dimanche";
          break;

        // months
        case "January":
        case "Jan":
          translation = "Janvier";
          break;
        case "February":
        case "Feb":
          translation = "Février";
          break;
        case "March":
        case "Mar":
          translation = "Mars";
          break;
        case "April":
        case "Apr":
          translation = "Avril";
          break;
        case "May":
          translation = "Mai";
          break;
        case "June":
        case "Jun":
          translation = "Juin";
          break;
        case "July":
        case "Jul":
          translation = "Juillet";
          break;
        case "August":
        case "Aug":
          translation = "Août";
          break;
        case "September":
        case "Sep":
          translation = "Septembre";
          break;
        case "October":
        case "Oct":
          translation = "Octobre";
          break;
        case "November":
        case "Nov":
          translation = "Novembre";
          break;
        case "December":
        case "Dec":
          translation = "Décembre";
          break;
      }
      if (label[1]) {
        if (d.getDay() === 0) {
          return "Dim " + label[1] + " " + translation;
        } else {
          return translation + " " + label[1];
        }
      } else {
        return translation;
      }
    });

    this.area = d3.svg.area()
      .x(function (d) {
        return _self.x(d.date);
      })
      .y0(this.height)
      .y1(function (d) {
        return _self.y(d.value);
      });

    var svg = d3.select(this.onOffGraphSelector).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", this.height + margin.top + margin.bottom);

    svg.append("defs").append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", width)
      .attr("height", this.height);

    this.focus = svg.append("g")
      .attr("class", "focus")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    this.zoom = d3.behavior.zoom()
      .on("zoom", this.draw);
    
    // Add rect cover the zoomed graph and attach zoom event.
    var rect = svg.append("svg:rect")
      .attr("class", "pane")
      .attr("width", width)
      .attr("height", this.height)
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(this.zoom);

  }


  interpolateZoom(translate, scale, duration) {
    var self = this;
    return d3.transition().duration(duration).tween("zoom", function () {
      var iTranslate = d3.interpolate(zoom.translate(), translate),
        iScale = d3.interpolate(zoom.scale(), scale);
      return function (t) {
        zoom
          .scale(iScale(t))
          .translate(iTranslate(t));
        zoom.event(self.focus);
      };
    });
  }

  draw() {
    this.focus.select(".area").attr("d", area);
    this.focus.select(".x.axis").call(this.xAxis);
  }

  updateTitle(aDate) {
    let m = aDate.getMonth();
    let y = aDate.getFullYear();
    let month = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août",
      "Septembre", "Octobre", "Novembre", "Décembre"][m];
    $(this.titleSelector).text("Données de " + month + " " + y);
    $(this.titleSelector).show();
  }

  processData(data) {
    this.x.domain(d3.extent(data.map(function (d) {
      return d.date;
    })));
    this.y.domain([0, d3.max(data.map(function (d) {
      return d.value;
    }))]);


    // Set up zoom behavior
    this.zoom.x(this.x);

    this.focus.append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", this.area);

    this.focus.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + this.height + ")")
      .call(this.xAxis);

    this.focus.append("g")
      .attr("class", "y axis")
      .call(this.yAxis);

  }

  processFile(file) {
    var reader = new FileReader();
    let that = this;
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
        let theDate = that.parseDate(lineData[0]);
        let jData = {
          date: theDate,
          value: +lineData[1]
        }
        if (i == 0) {
          handmonitor.updateTitle(jData.date);
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
      that.processData(dataSet);
    }
    reader.readAsText(file);
  }


}