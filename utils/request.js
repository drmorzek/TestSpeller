
const https = require('https');

module.exports = function (url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      try {
        let data = [];

        res.on('data', chunk => {
          data.push(chunk);
        });

        res.on('end', () => {
          const result = JSON.parse(Buffer.concat(data).toString());

          resolve(result);
        });

        res.on("error", err => {
          reject(err)
        });
      } catch (error) {
        reject(error)
      }
    })
  })
}
