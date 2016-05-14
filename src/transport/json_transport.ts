
export interface JsonTransportClient {
    sendJsonPayload(jsonPayload: any): Promise<any>;
    //invokeMethod(methodName: string, args: any[]): Promise<any>;
}

export interface JsonTransportBackend {
    handleJsonPayload(payload: any): Promise<any>;
}
