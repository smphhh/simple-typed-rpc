
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as http from 'http';

export async function createExpressTestServer(requestHandler: express.RequestHandler) {
    let app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.text());
    
    app.post('/test', requestHandler);

    let port = await (new Promise<number>((resolve, reject) => {
        let server = app.listen(0, () => {
            resolve(server.address().port);
        });
    }));
    
    return port;
}
