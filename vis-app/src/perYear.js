// Find the immigration total figures per year, based on large regions

import ParseCSV from "./parseCSV";
import admissionsTotal from './assets/datasets/admissions_total.csv';

export default class PerYear {

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

  _computeNodes(year){

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

      // Check since the last year only contains 2 quarters of data

      if(this.data[i]){

        for (let j = 0; j < 4; j++) {

          regionTotals[j].total += parseFloat(this.data[i][j+2]);
        }
      }
    }

    for (let j = 0; j < 4; j++) {

      jsonCircles.push({
        "x": 150 * (j), "r": regionTotals[j].total, "label": regionTotals[j].name + '\n' + regionTotals[j].total.toString()
      });
    }

    return jsonCircles;
  }

  _displayNodes(jsonCircles){

    this.d3.selectAll("svg > *").remove();

    const svgContainer = this.d3.select("#D3Container")
      .attr("width", 1600)
      .attr("height", 500);

    const elem = svgContainer.selectAll("g").data(jsonCircles);

    const elemEnter = elem.enter()
      .append('g')
      .attr("transform", function (d) {
        return 'translate(' + d.x + ',80)'
      });

    const circle = elemEnter.append("circle")
      .attr('r', function (d) {
        return d.r
      })
      .attr("stroke", "black")
      .attr('fill', 'white');

    elemEnter.append('text')
      .attr('dx', function (d) {
        return -20
      })
      .text(function (d) {
        return d.label
      });
  }
}
