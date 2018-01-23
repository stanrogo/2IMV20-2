import Papa from 'papaparse';

export default class ParseCSV {

  constructor() {

  }

  parseCSV(url) {

    return new Promise((resolve, reject) => {

      Papa.parse(
        url, {
          download: true,
          complete: function(results, file) {
            resolve(results.data);
          }
        }
      )
    });
  }

}
