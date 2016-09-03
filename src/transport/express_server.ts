
//import {RpcBackend} from '../backend';
import {RpcTransportError} from './common';
import {JsonTransportBackend, jsonParse, jsonStringify} from './json_transport';

import * as express from 'express';

/**
 * Wrap a JSON transport backend inside a Express resolver function.
 */
export function createExpressResolver(jsonBackend: JsonTransportBackend) {
    return async (request: express.Request, response: express.Response) => {
        let requestBody = request['body'];
        let payload;
        let responsePayload;
        try {
            if (typeof requestBody === 'string') {
                payload = jsonParse(requestBody);
            } else {
                let bodyString = JSON.stringify(requestBody);
                payload = jsonParse(bodyString);
            }

            responsePayload = await jsonBackend.handleJsonPayload(payload);

        } catch (error) {
            responsePayload = { error: error.message || "Unknown error" };
        }

        response.format({
            'text/plain': function () {
                let serializedResponse: string;
                try {
                    serializedResponse = jsonStringify(responsePayload);
                } catch (error) {
                    serializedResponse = JSON.stringify({ error: error.message || "Unknown error" });
                }
                response.send(serializedResponse);
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
