import * as sequelize from 'sequelize';

import {defineAttribute, defineModel} from '../src';

async function testTypes1() {

    let client: sequelize.Sequelize;

    let model = defineModel(
        client,
        'Model',
        {
            integerField: defineAttribute<number>({
                type: sequelize.INTEGER,
                field: 'integer_field'
            }),
            stringField: defineAttribute<string>(sequelize.STRING)
        },
        {}
    );

    let instance = await model.findById('foo'); 

    let values = instance.get();
    
    let fieldValue = instance.integerField;

    model.create({ integerField: 1 });

}


let o = {};

