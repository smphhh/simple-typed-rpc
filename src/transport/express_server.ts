
import {RpcBackend} from '../backend';

import * as express from '../external/express';

import {
    RequestPayload,
    ResponsePayload,
    isMetadataQuery,
    isMethodCall
} from './json';

export class ExpressServer {
    constructor(
        private backend: RpcBackend
    ) {
    }

    getResolver() {
        return (request: express.Request, response: express.Response) => {
            return this.expressResolver(request, response);
        }
    }

    private async expressResolver(request: express.Request, response: express.Response) {
        let payload = request.body;

        if (!payload || typeof payload !== 'object') {
            console.log("Not configured properly.");
        }

        try {
            if (typeof payload.methodName === 'string' && Array.isArray(payload.args)) {
                let responsePayload = await this.resolver({
                    methodName: payload.methodName,
                    args: payload.args
                });

                return response.json(responsePayload);

            } else if (typeof payload.metadataQuery) {
                let responsePayload = await this.resolver({
                    metadataQuery: payload.metadataQuery
                });

                return response.json(responsePayload);

            } else {
                return response.status(400).json({
                    error: "Invalid payload."
                });
            }

        } catch (error) {
            return response.status(400).json({
                error: "Error processing request."
            });
        }
    }

    private async resolver(requestPayload: RequestPayload): Promise<ResponsePayload> {
        if (isMethodCall(requestPayload)) {
            try {
                let returnValue = await this.backend.invokeMethod(
                    requestPayload.methodName,
                    requestPayload.args
                );

                return {
                    returnValue: returnValue
                };
                
            } catch (error) {
                console.log(error);
                return {
                    error: error.message  
                };
            }

        } else if (isMetadataQuery(requestPayload)) {
            throw new Error("Not implemented.");

        } else {
            throw new Error("Not implemented.");
        }

    }
}

