import { DataStore } from '../datastore';
import { DbStoreProvider } from '../datastore.provider';
import { WebSQLEngine } from '../core/websql.engine';
import { Entity, FieldType, QueryFilter, MachOperate } from '../interfaces';
import { TestBed } from '@angular/core/testing';
describe('datastore', () => {

    let store: DataStore;

    beforeAll(() => {

        let mockProvider = {
            createDbEngine: () => {
                return new WebSQLEngine('pmsdb2');
            }
        };
        TestBed.configureTestingModule({
            providers: [
                DataStore,
                { provide: DbStoreProvider, useValue: mockProvider }
            ]
        });
        store = TestBed.get(DataStore);
    });//beforeAll

    it('simple create', (done) => {
        let p1 = new Person();
        p1.name = 'Leon';
        p1.address = '南京东路';

        store.simpleSaveOrUpdate(p1).then(() => {
            console.log('datastore/simple create', p1);
            done();
        }).catch((err) => {
            done.fail(err);
        });
    });//it

    it('simple update', (done) => {
        let p1 = new Person();
        p1.id = 5;
        p1.name = 'Leon11';
        p1.address = '南京东路11';

        store.simpleSaveOrUpdate(p1).then(() => {
            console.log('datastore/simple update', p1);
            done();
        }).catch((err) => {
            done.fail(err);
        });
    });//it

    it('simple delete', (done) => {
        let p1 = new Person();
        p1.id = 100;
        store.simpleDelete(p1).then(() => {
            console.log('datastore/simple delete sucess');
            done();
        }).catch((err) => {
            done.fail(err);
        });
    });//it

    it('simple query', (done) => {
        let filters = [];
        filters.push(new QueryFilter('name', MachOperate.Eq, 'Leon11'));
        store.query(filters, new Person).then((rdata) => {
            console.log('datastore/simple query', rdata.length);
            done();
        }).catch(() => {
            done.fail();
        });
    });

});//describe




/********************************************/

class Person extends Entity {
    id: number;
    name: string;
    address: string;

    defineTable(): [string, FieldType][] {
        return [
            ['name', FieldType.text],
            ['address', FieldType.text]
        ];
    }

}