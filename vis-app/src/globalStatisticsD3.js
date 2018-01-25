/**
 * Compute and display nodes for global region based immigration statistics using D3 Js
 */

import ParseCSV from "./parseCSV";
import admissionsTotal from './assets/datasets/admissions_total.csv';

export default class GlobalStatisticsD3 {

  /**
   * Construct a new global statistics instance
   * @param d3 - the d3 JS instance to use
   */
  constructor(d3) {

    this.d3 = d3;
    this.csvData = this._getCSVData();
    this.year = 2007;
    this.quarter = null;
  }

  _getCSVData() {

    return new Promise((resolve) => {

      ParseCSV.parseCSV(admissionsTotal).then(({headers, data}) => {

        this.headers = headers;
        this.data = data;
        resolve();
      });
    });
  }

  /**
   * Wrapper to compute and display nodes from current CSV data and time values
   */
  showNodes() {

    this.csvData.then(() => {

      // There are four global regions we are interested in

      const nodes = this._computeNodes();
      this._displayNodes(nodes);
    });
  }

  _computeNodes() {

    // There are 4 regions available in total, each with their own name and total immigration figures

    const regionTotals = [
      {name: this.headers[2], total: 0},
      {name: this.headers[3], total: 0},
      {name: this.headers[4], total: 0},
      {name: this.headers[5], total: 0}
    ];

    const nodes = [];

    // The first year is 2007 and has 4 quartiles

    let startIndex = (this.year - 2007) * 4;

    if (this.quarter) {

      startIndex += this.quarter - 1;
    }

    const endIndex = this.quarter ? startIndex + 1 : startIndex + 4;

    for (let i = startIndex; i < endIndex; i++) {

      for (let j = 0; j < 4; j++) {

        regionTotals[j].total += Number(parseFloat(this.data[i][j + 2]).toFixed(2));
      }
    }

    for (let j = 0; j < 4; j++) {

      nodes.push({
        "x": 150 * (j + 1),
        "y": 150,
        "r": regionTotals[j].total,
        "name": regionTotals[j].name,
        "label": regionTotals[j].name + '\n' + regionTotals[j].total.toString()
      });
    }

    return nodes;
  }

  _displayNodes(nodes) {

    this.d3.selectAll("svg > *").remove();

    const svgContainer = this.d3.select("#D3Container")
      .attr("width", 1600)
      .attr("height", 500);

    const elem = svgContainer.selectAll("g").data(nodes);

    const elemEnter = elem.enter()
      .append('g')
      .attr("transform", function (d) {
        return 'translate(' + d.x + ',' + d.y + ')'
      });

    const circle = elemEnter.append("circle")
      .attr('r', function (d) {
        return d.r
      })
      .attr("stroke", "black")
      .attr('fill', 'white')
      .on('click', (d) => {
        document.dispatchEvent(new CustomEvent('region_clicked', {detail: {'name': d.name}}));
      });

    elemEnter.append('text')
      .attr('dx', function (d) {
        return -50
      })
      .text(function (d) {
        return d.label
      });
  }
}
