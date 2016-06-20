
import {definePromiseMethod} from '../../';

export class TestInterfaceDescriptor {
    static interfaceVersion = "1.0";

    async getFoo() { return null as string; }
    async getBar(n1: number, n2: number) { return definePromiseMethod<number>(); }
    async getObject() { return definePromiseMethod<{ a: number, b: string }>(); }
    async getPrimitiveList() { return definePromiseMethod<string[]>(); }
    async getError() { return definePromiseMethod<string>(); }
}

export class TestClass implements TestInterfaceDescriptor {
    async getFoo() { return "hi"; }
    async getBar(n1: number, n2: number) { return n1 + n2 + 2; }
    async getObject() { return { a: 1, b: "b" }; }
    async getPrimitiveList() { return ["a", "b", "c"]; }
    async getError(): Promise<string> {
        throw new Error("TestClass error.");
    }
}
