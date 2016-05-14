

import {JsonTransportClient, JsonTransportBackend} from './json_transport';

export class DirectTransportClient implements JsonTransportClient {
    constructor(
        private transportBackend: JsonTransportBackend
    ) {
    }
    
    async sendJsonPayload(payload: any) {
        let jsonData = JSON.stringify(payload);
        
        let responsePayload = await this.transportBackend.handleJsonPayload(JSON.parse(jsonData));
        return responsePayload;
    }
}
