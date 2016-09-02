

import fetch from '../external/node-fetch';

import {JsonTransportClient, jsonParse, jsonStringify} from './json_transport';

/**
 * JSON transport client for establishing a transport channel with a HTTP transport server.
 */
export class HttpTransportClient implements JsonTransportClient {
    constructor(private serverEndpoint: string) {
    }
        
    async sendJsonPayload(payload: any) {
        let serializedPayload = jsonStringify(payload);
        let response = await fetch(this.serverEndpoint, {
            method: 'post',
            headers: {
                'Accept': 'text/plain',
                'Content-Type': 'text/plain'
            },
            body: serializedPayload
        });
        
        let responseBody = await response.text(); 
        return jsonParse(responseBody);
    }
}

