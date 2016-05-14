
//import {RpcBackend} from '../backend';
import {JsonTransportBackend} from './json_transport';

import * as express from '../external/express';

export function createExpressResolver(jsonBackend: JsonTransportBackend) {
    return async (request: express.Request, response: express.Response) => {
        let payload = request.body;
        let responsePayload = await jsonBackend.handleJsonPayload(payload);
        response.json(responsePayload);
    }
}
