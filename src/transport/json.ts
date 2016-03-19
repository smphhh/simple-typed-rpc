
export type MetadataQueryName = 'methodNames';

export interface MetadataQuery {
    metadataQuery: MetadataQueryName
}

export interface MethodCall {
    methodName: string,
    args: any[]    
}

export type RequestPayload = MetadataQuery | MethodCall;

export interface ResponsePayload {
    error?: any,
    returnValue?: any
}

export function isMetadataQuery(arg: RequestPayload): arg is MetadataQuery {
    return (arg as MetadataQuery).metadataQuery !== undefined;
}

export function isMethodCall(arg: RequestPayload): arg is MethodCall {
    return (arg as MethodCall).methodName !== undefined;
}
