
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

import {HttpTransportClient, DirectTransportClient, RpcBackendError, RpcTransportError} from '../';
import {createInterfaceDescriptorFrontendProxy, createInterfaceDescriptorBackendProxy} from '../';

import {TestClass, TestInterfaceDescriptor, ChangedTestInterfaceDescriptor} from './common';
import {TestInterfaceDescriptor as NewTestInterfaceDescriptor} from './common/new_test_class';

let expect = chai.expect;
chai.use(chaiAsPromised);

describe("Interface descriptor proxy", function () {
    let testImplementation = new TestClass();

    let backendProxy = createInterfaceDescriptorBackendProxy(TestInterfaceDescriptor, testImplementation);
    let frontendProxy = createInterfaceDescriptorFrontendProxy(TestInterfaceDescriptor, new DirectTransportClient(backendProxy));

    describe("should proxy method", function () {
        it("with no arguments", async function () {
            expect(await frontendProxy.getFoo()).to.equal(await testImplementation.getFoo());
        });

        it("with multiple primitive arguments", async function () {
            expect(await frontendProxy.getBar(2, 3)).to.equal(await testImplementation.getBar(2, 3));
        });

        it("returning an object", async function () {
            expect(await frontendProxy.getObject()).to.deep.equal(await testImplementation.getObject());
        });

        it("returning a list of primitives", async function () {
            expect(await frontendProxy.getPrimitiveList()).to.deep.equal(await testImplementation.getPrimitiveList());
        });
        
        it("throwing an exception", function () {
            return expect(frontendProxy.getError()).to.eventually.be.rejectedWith(RpcBackendError);
        });

        it("with a date argument", async function () {
            let date = new Date();
            expect(await frontendProxy.getByDate(date)).to.equal(await testImplementation.getByDate(date));
        });

        it("returning a date", async function () {
            expect(await frontendProxy.getDate()).to.deep.equal(await testImplementation.getDate());
        });
    });

    describe("should check interface metadata", function () {
        it("for name match", async function () {
            let changedFrontendProxy = createInterfaceDescriptorFrontendProxy(ChangedTestInterfaceDescriptor, new DirectTransportClient(backendProxy));
            await expect(changedFrontendProxy.getObject()).to.eventually.be.rejectedWith(RpcBackendError);
        });

        it("for version match", async function () {
            let changedFrontendProxy = createInterfaceDescriptorFrontendProxy(NewTestInterfaceDescriptor, new DirectTransportClient(backendProxy));
            await expect(changedFrontendProxy.getDate()).to.eventually.be.rejectedWith(RpcBackendError);
        });
    });

    it("should not pass non-plain objects in strict mode", function () {
        let complexObject = Object.create({ a: 1 });
        return expect(frontendProxy.getWithAnyArgReturningVoid(complexObject)).to.eventually.be.rejectedWith(RpcTransportError);
    });

    it("should not return non-plain objects in strict mode", function () {
        return expect(frontendProxy.getNonPlainObject()).to.eventually.be.rejectedWith(RpcTransportError);
    });

});

