
export interface Facade<T> {
    new(): T
}

export interface MethodResolver {
    (methodName: string, args: any[]): Promise<any>
}

export function getPrototypeMethodNames(classInstance: any) {
    let prototype = Object.getPrototypeOf(classInstance);
    
    return Object.getOwnPropertyNames(prototype).filter(propName => {
        return propName !== 'constructor' && typeof classInstance[propName] === 'function';
    });
}

export function createGenericProxy<T>(
    FacadeType: Facade<T>,
    resolver: MethodResolver
) {
    let facadeInstance = new FacadeType();            
    let proxiedMethodNames = getPrototypeMethodNames(facadeInstance);
        
    return createProxyFromMethodNames(proxiedMethodNames, resolver);
}

export function createProxyFromMethodNames<T>(
    methodNames: string[],
    resolver: MethodResolver
) {
    let proxyObject: any = {};
    
    for (let methodName of methodNames) {
        proxyObject[methodName] = function () {
            let args = [];
            for (let arg of arguments) {
                args.push(arg);
            }
            
            return resolver(methodName, args);
        }
    }
    
    return proxyObject as T;
}

