
import {HttpTransportClient, DirectTransportClient} from '../';
import {createInterfaceDescriptorClientProxy, createInterfaceDescriptorBackend} from '../';
import {definePromiseMethod} from '../';

class TestInterfaceDescriptor {
    static interfaceVersion = "1.0";

    async getFoo() { return null as string; }
    async getBar(barIndex: number) { return definePromiseMethod<number>(); }
}

class TestClass implements TestInterfaceDescriptor {
    async getFoo() { return "hi"; }
    async getBar(barIndex: number) { return barIndex + 2; }
}

export async function test1() {

    let testImplementation = new TestClass();

    //let clientProxy = createInterfaceDescriptorClientProxy(TestInterfaceDescriptor, new HttpTransportClient("http://localhost:8080"));
    let backendProxy = createInterfaceDescriptorBackend(TestInterfaceDescriptor, testImplementation);
    let clientProxy = createInterfaceDescriptorClientProxy(TestInterfaceDescriptor, new DirectTransportClient(backendProxy));

    let foo = await clientProxy.getFoo();
    let bar = await clientProxy.getBar(2);
    console.log(foo);
    console.log(bar);
}
