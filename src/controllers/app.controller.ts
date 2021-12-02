import { Request, ResponseToolkit } from "@hapi/hapi"
import { all, controller, options, post } from "hapi-decorators"
import { ControllerStatic } from "../common/extends/Controller"

import speller from "../common/utils/yandex.speller"

import * as fs from "fs"
import * as path from "path"
import stream from "stream"

interface IPayload {
    path: string,
    bytes: number,
    filename: String,
    headers: Object
}

@controller('/')
export class TestController extends ControllerStatic {

    constructor() {
        super()
    }

    @all("/{any*}")
    @options({
        payload: {
            output: 'stream',
            parse: true,
            multipart: {
                output: "file"
            },
            maxBytes: 1024 * 1024 * 1024 * 100,
            timeout: false,
        }
    })
    async spellerFile(request: Request, h: ResponseToolkit) {
        
        let payload: IPayload = Object.values(request.payload)[0] as IPayload
        
        let readStream = fs.createReadStream(path.normalize(payload.path))
        const channel = new stream.PassThrough
        
        readStream.on("data", async (chunk) => {

            let newChunk = await speller(chunk.toString())
            channel.write(newChunk)
        })

        readStream.on("end", () => {
            channel.end()
        })
        return h.response(channel);
        
    }
}