

import {JsonTransportClient, JsonTransportBackend} from './json_transport';

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
        return JSON.parse(JSON.stringify(payload));
    }
}
