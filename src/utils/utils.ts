
export function getConstructorMethodNames(constructor: any) {
    let prototype = constructor.prototype;    
    return Object.getOwnPropertyNames(prototype).filter(propName => {
        return propName !== 'constructor' && typeof prototype[propName] === 'function';
    });
}

export function definePromiseMethod<T>(): Promise<T> {
    let returnValueMetadata: any = {
        returnType: 'promise'  
    };
    
    return returnValueMetadata;
}
