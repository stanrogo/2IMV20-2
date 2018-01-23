import Papa from 'papaparse';

export default class ParseCSV {

  static parseCSV(url) {

    return new Promise((resolve, reject) => {
      Papa.parse(
        url, {
          download: true,
          complete: function(results, file) {

            const headers = results.data.shift();

            resolve({
              headers,
              data: results.data
            });
          }
        }
      )
    });
  }

}
