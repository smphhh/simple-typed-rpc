

import {JsonTransportClient, JsonTransportBackend, jsonParse, jsonStringify} from './json_transport';

/**
 * A transport client that communicates with a transport backend through a simulated
 * direct JSON channel.
 */
export class DirectTransportClient implements JsonTransportClient {
    constructor(
        private transportBackend: JsonTransportBackend
    ) {
    }
    
    async sendJsonPayload(payload: any) {        
        let responsePayload = await this.transportBackend.handleJsonPayload(DirectTransportClient.simulateJsonTransport(payload));
        return DirectTransportClient.simulateJsonTransport(responsePayload);
    }
    
    private static simulateJsonTransport(payload: any) {
        return jsonParse(jsonStringify(payload));
    }
}
