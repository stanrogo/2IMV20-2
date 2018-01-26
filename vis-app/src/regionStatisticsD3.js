// Find the immigration total figures per year, based on large regions

import ParseCSV from "./parseCSV";
import refusedTotal from './assets/datasets/refused_by_country.csv';
import admissionsTotal from './assets/datasets/admissions_total.csv';

export default class RegionStatisticsD3 {

  /**
   * Construct a new global statistics instance
   * @param d3 - the d3 JS instance to use
   * @param region - the name of the region we are targeting
   */
  constructor(d3, region) {

    this.d3 = d3;
    this.csvData = this._getCSVData();
    this.year = 2007;
    this.quarter = null;
    this.totalImmigration = 0;
    this.region = region;
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

      this._getTotalImmigration();
    });
  }

  /**
   * Get the total immigration figure for this region in the given year or quarter
   * @private
   */
  _getTotalImmigration() {

    // Store the list of available regions based on the headers

    const regions = [
      this.headers[2],
      this.headers[3],
      this.headers[4],
      this.headers[5]
    ];

    const regionIndex = regions.indexOf(this.region) + 2;
    let total = 0;
    // The first year is 2007 and has 4 quartiles

    let startIndex = (this.year - 2007) * 4;

    if (this.quarter) {

      startIndex += this.quarter - 1;
    }

    const endIndex = this.quarter ? startIndex + 1 : startIndex + 4;

    for (let i = startIndex; i < endIndex; i++) {

      total += Number(parseFloat(this.data[i][regionIndex]).toFixed(2));
    }

    return total;
  }
}
