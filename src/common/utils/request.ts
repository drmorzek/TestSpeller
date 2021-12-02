import https from 'https';

export default function (url: string) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      try {
        let data: Buffer[] = [];

        res.on('data', (chunk: Buffer) => {
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
function res(url: string, res: any, arg2: (Response: import("http").IncomingMessage) => void) {
  throw new Error('Function not implemented.');
}

