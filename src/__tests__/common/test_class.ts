
import {definePromiseMethod} from '../../';

export class TestInterfaceDescriptor {
    static interfaceVersion = "1.0";

    async getFoo() { return null as string; }
    async getBar(n1: number, n2: number) { return definePromiseMethod<number>(); }
    async getObject() { return definePromiseMethod<{ a: number, b: string }>(); }
    async getPrimitiveList() { return definePromiseMethod<string[]>(); }
    async getError() { return definePromiseMethod<string>(); }
    async getByDate(date: Date) { return definePromiseMethod<number>(); }
    async getDate() { return definePromiseMethod<Date>(); }
    async getWithAnyArgReturningVoid(arg: any) { return definePromiseMethod<void>(); }
    async getNonPlainObject() { return definePromiseMethod<any>(); }
    async getWithOptionalArg(v?: number) { return definePromiseMethod<number>(); }
    async getNull() { return definePromiseMethod<string>(); }
    async getUndefined() { return definePromiseMethod<string>(); }
}

export class ChangedTestInterfaceDescriptor {
    static interfaceVersion = "1.0";

    async getObject() { return definePromiseMethod<{ a: number, b: string }>(); }
}

export class TestClass implements TestInterfaceDescriptor {
    async getFoo() { return "hi"; }
    async getBar(n1: number, n2: number) { return n1 + n2 + 2; }
    async getObject() { return { a: 1, b: "b" }; }
    async getPrimitiveList() { return ["a", "b", "c"]; }
    async getError(): Promise<string> {
        throw new Error("TestClass error.");
    }
    async getByDate(date: Date) { return date.valueOf(); }
    async getDate() { return new Date(1000000); }
    async getWithAnyArgReturningVoid(arg: any) { return; }
    async getNonPlainObject() { let obj = Object.create({ s: "foo" }); obj.b = 1; return obj; }
    async getWithOptionalArg(v = Infinity) { return 5376; }
    async getNull() { return null; }
    async getUndefined() { return undefined; }
}
