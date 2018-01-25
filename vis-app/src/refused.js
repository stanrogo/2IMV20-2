// Find the immigration total figures per year, based on large regions

import ParseCSV from "./parseCSV";
import admissionsTotal from './assets/datasets/refused_by_country.csv';

export default class Refused {

  constructor(d3) {

    this.d3 = d3;
    this.csvData = this._getCSVData();
  }

  _getCSVData() {

    return new Promise((resolve) => {

      ParseCSV.parseCSV(admissionsTotal)
        .then(({headers, data}) => {

          this.headers = headers;
          this.data = data;

          resolve()
        });
    });
  }

  /**
   * Show the data for one year for global immigration figures
   * @param year
   */
  showYear(year) {

    this.csvData.then(() => {

      // There are four global regions we are interested in

      const jsonCircles = this._computeNodes(year);
      this._displayNodes(jsonCircles);
    });
  }

  _computeNodes(year) {

    const regionTotals = [
      {name: this.headers[2], total: 0},
      {name: this.headers[3], total: 0},
      {name: this.headers[4], total: 0},
      {name: this.headers[5], total: 0}
    ];

    const jsonCircles = [];

    // Each year has 4 quartiles, and the first year starts at index 0 (first year is 2007)

    const startIndex = (year - 2007) * 4;

    for (let i = startIndex; i < startIndex + 4; i++) {

      for (let j = 0; j < 4; j++) {

        regionTotals[j].total += parseFloat(this.data[i][j + 2]);
        regionTotals[j].total = Number((regionTotals[j].total).toFixed(2));
      }
    }

    for (let j = 0; j < 4; j++) {

      jsonCircles.push({
        "x": 150 * (j + 1),
        "y": 150,
        "r": regionTotals[j].total,
        "label": regionTotals[j].name + '\n' + regionTotals[j].total.toString()
      });
    }

    return jsonCircles;
  }

  _displayNodes(jsonCircles) {

    this.d3.selectAll("svg > *").remove();

    var margin = {top: 20, right: 20, bottom: 70, left: 40},
      width = 600 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

// Parse the date / time
    var parseDate = d3.time.format("%Y-%m").parse;

    var x = this.d3.scale.ordinal().rangeRoundBands([0, width], .05);

    var y = this.d3.scale.linear().range([height, 0]);

    var xAxis = this.d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickFormat(this.d3.time.format("%Y-%m"));

    var yAxis = this.d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(10);

    const svgContainer = this.d3.select("#D3Container")
      .attr("width", 1600)
      .attr("height", 500);

    data.forEach(function (d) {
      d.date = parseDate(d.date);
      d.value = +d.value;
    });

    x.domain(data.map(function (d) {
      return d.date;
    }));
    y.domain([0, this.d3.max(data, function (d) {
      return d.value;
    })]);

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)");

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Value ($)");

    svg.selectAll("bar")
      .data(data)
      .enter().append("rect")
      .style("fill", "steelblue")
      .attr("x", function (d) {
        return x(d.date);
      })
      .attr("width", x.rangeBand())
      .attr("y", function (d) {
        return y(d.value);
      })
      .attr("height", function (d) {
        return height - y(d.value);
      });
  }
}
