import { Entity, FieldType } from '../services/dataStore/interfaces';

/**
 * 系统配置信息
 */
export class Demo implements Entity {
    Id: number;
    CfgValue: string;

    defineTable(): [string, FieldType][] {
        return [
            ['CfgValue', FieldType.text]
        ];
    }

}