
//import {RpcBackend} from '../backend';
import {JsonTransportBackend, jsonParse, jsonStringify} from './json_transport';

import * as express from 'express';

/**
 * Wrap a JSON transport backend inside a Express resolver function.
 */
export function createExpressResolver(jsonBackend: JsonTransportBackend) {
    return async (request: express.Request, response: express.Response) => {
        let requestBody = request['body'];
        let payload;
        if (typeof requestBody === 'string') {
            payload = jsonParse(requestBody);
        } else {
            let bodyString = JSON.stringify(requestBody);
            payload = jsonParse(bodyString);
        }

        let responsePayload = await jsonBackend.handleJsonPayload(payload);
        
        response.format({
            'text/plain': function () {
                response.send(jsonStringify(responsePayload));
            },
            'application/json': function () {
                response.json(responsePayload);
            },
            'default': function () {
                response.status(406).send('Not Acceptable');
            }
        });
    }
}
