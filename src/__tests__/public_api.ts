
import {expect} from 'chai';


import {HttpTransportClient, DirectTransportClient} from '../';
import {createInterfaceDescriptorClientProxy, createInterfaceDescriptorBackend} from '../';
import {definePromiseMethod} from '../';

class TestInterfaceDescriptor {
    static interfaceVersion = "1.0";

    async getFoo() { return null as string; }
    async getBar(n1: number, n2: number) { return definePromiseMethod<number>(); }
    async getObject() { return definePromiseMethod<{ a: number, b: string }>(); }
    async getPrimitiveList() { return definePromiseMethod<string[]>(); }
}

class TestClass implements TestInterfaceDescriptor {
    async getFoo() { return "hi"; }
    async getBar(n1: number, n2: number) { return n1 + n2 + 2; }
    async getObject() { return { a: 1, b: "b" }; }
    async getPrimitiveList() { return ["a", "b", "c"]; }
}

describe("Interface descriptor proxy", function () {
    let testImplementation = new TestClass();

    //let clientProxy = createInterfaceDescriptorClientProxy(TestInterfaceDescriptor, new HttpTransportClient("http://localhost:8080"));
    let backendProxy = createInterfaceDescriptorBackend(TestInterfaceDescriptor, testImplementation);
    let clientProxy = createInterfaceDescriptorClientProxy(TestInterfaceDescriptor, new DirectTransportClient(backendProxy));

    describe("should proxy method", function () {
        it("with no arguments", async function () {
            expect(await clientProxy.getFoo()).to.equal(await testImplementation.getFoo());
        });

        it("with multiple primitive arguments", async function () {
            expect(await clientProxy.getBar(2, 3)).to.equal(await testImplementation.getBar(2, 3));
        });

        it("returning an object", async function () {
            expect(await clientProxy.getObject()).to.deep.equal(await testImplementation.getObject());
        });

        it("returning a list of primitives", async function () {
            expect(await clientProxy.getPrimitiveList()).to.deep.equal(await testImplementation.getPrimitiveList());
        });
    });

})

