
import {getPrototypeMethodNames} from '../common';

import * as express from '../external/express';

import {
    RequestPayload,
    ResponsePayload,
    isMetadataQuery,
    isMethodCall
} from './json';

export class ExpressServer<InstanceType> {
    private methodNames: string[];

    constructor(
        private backend: InstanceType
    ) {
        this.methodNames = getPrototypeMethodNames(backend);
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
            let method = this.backend[requestPayload.methodName];
            if (typeof method !== 'function') {
                throw new Error(`Invalid method name: ${requestPayload.methodName}`);
            }

            let output = this.backend[requestPayload.methodName].apply(this.backend, requestPayload.args);

            if (!output || typeof output.then !== 'function') {
                throw new Error("Exposed methods must return a thenable.");
            }

            let returnValue = await output;

            return {
                returnValue: returnValue
            };

        } else if (isMetadataQuery(requestPayload)) {
            if (requestPayload.metadataQuery === 'methodNames') {
                return {
                    returnValue: this.methodNames  
                };
                
            } else {
                throw new Error("Invalid metadata query.");
            }

        } else {
            throw new Error("Not implemented.");
        }

    }
}

