const http = require('http');
const speller = require('./utils/yandex.speller')

const app = http.createServer((req, res) => {

    let contentType = req.headers['content-type']

    const contentTypeArray = contentType?.split(';').map(item => item.trim())
    if (contentTypeArray && contentTypeArray.length) {
        contentType = contentTypeArray[0]
    }

    if (!contentType || !/(multipart\/form-data)/.test(contentType)) {
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ message: 'Content type is must be multipart/form-data' }))
        return
    }

    let boundary = contentTypeArray[1].replace(/boundary=(-)+/, "")
    if (!boundary) {
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ message: 'Boundary information missing' }))
        return
    }

    let count = 0

    res.setHeader('Content-Type', "application/octet-stream")

    req.setEncoding('utf8')

    req.on("data", async function (chunk) {

        let lastline = `----------------------------${boundary}--`
        if (chunk.indexOf(lastline) >= 0) chunk = chunk.split(lastline)[0]
        if (count !== 0) {
            req.pause()
            let newChunk = await speller(chunk)
            req.resume()
            res.write(newChunk)
        }
        count++
    })

    req.on("end", () => {
        res.end()
    })

})

app.listen(3000, () => console.log("Port 3000"))

