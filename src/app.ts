import Hapi, { Server }  from "@hapi/hapi";
import { TestController } from "./controllers/app.controller";

let server: Server;

export const init = async function (): Promise<Server> {
    server = Hapi.server({
        port: process.env.PORT || 4000,
        host: '0.0.0.0'
    });

    // InitializeController
    let test = new TestController()

    // Add Test Controller routes to server
    server.route(test.routes())

    return server;
};

export const start = async function (): Promise<void> {
    console.log(`Listening on ${server.settings.host}:${server.settings.port}`);
    return server.start();
};

process.on('unhandledRejection', (err: any) => {
    console.error("unhandledRejection");
    if (err) {
        setTimeout(() => {
            start()
        }, 5000)
        console.log("Server restart");
    };
    console.error(err);
});