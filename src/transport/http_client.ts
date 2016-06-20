

import fetch from '../external/node-fetch';

import {JsonTransportClient} from './json_transport';

/**
 * JSON transport client for establishing a transport channel with a HTTP transport server.
 */
export class HttpTransportClient implements JsonTransportClient {
    constructor(private serverEndpoint: string) {
    }
        
    async sendJsonPayload(payload: any) {
        let response = await fetch(this.serverEndpoint, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        let responsePayload = await response.json();
        
        return responsePayload;
    }
}

