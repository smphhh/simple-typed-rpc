

import fetch from '../external/node-fetch';

import {createProxyFromMethodNames, getPrototypeMethodNames} from '../common';

import {MetadataQueryName, RequestPayload, ResponsePayload} from './json';

/**
 * 
 */
export function createFromMethodNames<T>(serverEndpoint: string, methodNames: string[]) {
    let methodResolver = (methodName: string, args: any[]) => {
        return makeMethodCall(serverEndpoint, methodName, args);
    };
    
    return createProxyFromMethodNames<T>(methodNames, methodResolver);    
}

/**
 * Create client from metadata received from the server.
 */
export async function createFromServerMetadata<T>(serverEndpoint: string) {
    let methodNames: string[] = await makeMetadataQuery(serverEndpoint, 'methodNames');
    return createFromMethodNames<T>(serverEndpoint, methodNames);
}

export function createFromTemplateClass<T>(serverEndpoint: string, classInstance: T) {
    let methodNames = getPrototypeMethodNames(classInstance);
    return createFromMethodNames<T>(serverEndpoint, methodNames);
}

async function postPayload(url: string, payload: RequestPayload): Promise<ResponsePayload> {
    let response = await fetch(url, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
    
    let responsePayload = await response.json();
    
    return {
        error: responsePayload.error,
        returnValue: responsePayload.returnValue
    };
}

async function makeRequest(url: string, payload: RequestPayload) {
    let responsePayload = await postPayload(url, payload);
    
    if (responsePayload.error) {
        throw new Error(responsePayload.error);
    } else {
        return responsePayload.returnValue;
    }
}

async function makeMetadataQuery(url: string, queryName: MetadataQueryName) {
    return makeRequest(url, { metadataQuery: queryName });
}

async function makeMethodCall(url: string, methodName: string, args: any[]) {
    return makeRequest(url, { methodName: methodName, args: args });
}
