
import {definePromiseMethod} from '../../';

export class TestInterfaceDescriptor {
    static interfaceVersion = "2.0";

    async getByDate(date: Date) { return definePromiseMethod<number>(); }
    async getDate() { return definePromiseMethod<Date>(); }
}
