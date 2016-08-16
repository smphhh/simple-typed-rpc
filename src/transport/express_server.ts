
//import {RpcBackend} from '../backend';
import {JsonTransportBackend} from './json_transport';

import * as express from 'express';

/**
 * Wrap a JSON transport backend inside a Express resolver function.
 */
export function createExpressResolver(jsonBackend: JsonTransportBackend) {
    return async (request: express.Request, response: express.Response) => {
        let payload = request['body'];
        let responsePayload = await jsonBackend.handleJsonPayload(payload);
        response.json(responsePayload);
    }
}
