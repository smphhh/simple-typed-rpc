
import {JsonTransportClient} from '../transport';

type MetadataQueryName = 'methodNames';

interface MetadataQuery {
    metadataQuery: MetadataQueryName
}

interface MethodCall {
    methodName: string,
    args: any[]    
}

type RequestPayload = MetadataQuery | MethodCall;

interface ResponsePayload {
    error?: any,
    returnValue?: any
}

function isMetadataQuery(arg: RequestPayload): arg is MetadataQuery {
    return (arg as MetadataQuery).metadataQuery !== undefined;
}

function isMethodCall(arg: RequestPayload): arg is MethodCall {
    return (arg as MethodCall).methodName !== undefined;
}


export interface RpcMetadataInterface {
    getInterfaceName(): string;
    getInterfaceVersion(): string;
    getMethodNames(): string[];    
}

export class GenericFrontendProxy {
    private proxyObject;
    
    constructor(
        private metadataInterface: RpcMetadataInterface,
        private transportClient: JsonTransportClient
    ) {
        let methodNames = metadataInterface.getMethodNames();
        this.proxyObject = {};
        
        let that = this;
        for (let methodName of methodNames) {
            // Can't use arrow function here because they don't have the arguments object.
            this.proxyObject[methodName] = function () {
                let args = [];
                for (let arg of arguments) {
                    args.push(arg);
                }
                                
                return that.invokeMethod(methodName, args);
            }
        }
    }
    
    getProxyObject() {
        return this.proxyObject;
    }
    
    private async invokeMethod(methodName: string, args: any[]) {
        let requestPayload = { methodName, args };
        let responsePayload = await this.transportClient.sendJsonPayload(requestPayload);
        
        // TODO: perform metadata validation here.

        if (responsePayload.error) {
            throw new Error(responsePayload.error);
        } else {
            return responsePayload.returnValue;
        }
    }
}

export class GenericBackendProxy {
    constructor(
        private metadataInterface: RpcMetadataInterface,
        private backendImplementation: any
    ) {    
    }
    
    async handleJsonPayload(payload: any): Promise<any> {
        if (!payload || typeof payload !== 'object') {
            console.log("Not configured properly.");
        }

        try {
            if (typeof payload.methodName === 'string' && Array.isArray(payload.args)) {
                let responsePayload = await this.resolver({
                    methodName: payload.methodName,
                    args: payload.args
                });

                return responsePayload;

            } else if (typeof payload.metadataQuery) {
                let responsePayload = await this.resolver({
                    metadataQuery: payload.metadataQuery
                });

                return responsePayload;

            } else {
                return {
                    error: "Invalid payload."
                };
            }

        } catch (error) {
            console.log(error);
            return {
                error: error.message || "Error processing request."
            };
        }
    }
    
    private async resolver(requestPayload: RequestPayload): Promise<ResponsePayload> {
        if (isMethodCall(requestPayload)) {
            let returnValue = await this.invokeMethod(
                requestPayload.methodName,
                requestPayload.args
            );

            return {
                returnValue: returnValue
            };

        } else if (isMetadataQuery(requestPayload)) {
            throw new Error("Not implemented.");

        } else {
            throw new Error("Not implemented.");
        }

    }
    
    private async invokeMethod(methodName: string, args: any[]) {
        let returnValue = await this.backendImplementation[methodName].apply(this.backendImplementation, args);
        return returnValue;
    }
}
