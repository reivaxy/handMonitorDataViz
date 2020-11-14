/* 
*  =============================================================================================================================================
*  Project : Hand Monitor Data visualisation e-Nable France
*  Author  : Xavier Grosjean
* 
*  ---------------------------------------------------------------------------------------------------------------------------------------------
*  Description : Class handling the on/off graph showing when the handmonitor device detected the prosthetic was being used
* 
* =============================================================================================================================================
*/
class OnOffGraph {
  constructor(graphSelector) {
    let _self = this;
    this.graphSelector = graphSelector;

    let margin = {top: 10, right: 100, bottom: 100, left: 100},
      width = window.innerWidth - margin.left - margin.right;

    this.height = 200 - margin.top - margin.bottom;

    this.x = d3.time.scale().range([0, width]);
    this.y = d3.scale.linear().range([this.height, 0]);

    this.xAxis = d3.svg.axis().scale(this.x).orient("bottom");
    this.yAxis = d3.svg.axis().scale(this.y).orient("left").ticks(1);

    this.yAxis.tickFormat(function (d, i) {
      if (d === 1) return "utilisé"; else return "non utilisé";
    });

    let defaultTick = this.x.tickFormat();
    this.xAxis.tickFormat(function (d, i) {
      let label = defaultTick(d, i);
      return translateD3DateTicks(d, i, label);
    });

    this.area = d3.svg.area()
      .x(function (d) {
        return _self.x(d.date);
      })
      .y0(this.height)
      .y1(function (d) {
        return _self.y(d.value);
      });

    let svg = d3.select(this.graphSelector).append("svg")
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
      .on("zoom", function() {_self.draw()});

    // Add rect cover the zoomed graph and attach zoom event.
    let rect = svg.append("svg:rect")
      .attr("class", "pane")
      .attr("width", width)
      .attr("height", this.height)
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(this.zoom);

  }

  interpolateZoom(translate, scale, duration) {
    let self = this;
    return d3.transition().duration(duration).tween("zoom", function () {
      let iTranslate = d3.interpolate(zoom.translate(), translate),
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
    this.focus.select(".area").attr("d", this.area);
    this.focus.select(".x.axis").call(this.xAxis);
  }
  
  processData(dataSet) {
    let data = [];
    let previous = 0;
    for(let i=0; i < dataSet.length; i++) {
      let jData = dataSet[i];
      if (i != 0 && previous != jData.value) {
        data.push({
          date: jData.date,
          value: previous
        })
      }
      data.push(jData);
      previous = +jData.value;
    }
    
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

}