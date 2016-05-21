
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as http from 'http';

export async function createExpressTestServer(handlerHref: string, requestHandler: express.RequestHandler) {
    let app = express();

    app.use(bodyParser.json());
    
    app.post(handlerHref, requestHandler);

    let server = await (new Promise<http.Server>((resolve, reject) => {
        let srv = app.listen(0, () => {
            resolve(srv);
        });
    }));
    
    return {
        port: server.address().port
    };
}
