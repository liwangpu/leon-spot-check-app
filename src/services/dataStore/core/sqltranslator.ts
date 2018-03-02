import { Entity, FieldType, QueryFilter, MachOperate } from '../interfaces';

export class SQLTranslator {

    constructor() {

    }

    /**
     * 获取字段枚举对应的声明类型名称
     * @param dtype 
     */
    private getFieldType(dtype: FieldType): string {
        let strType = '';
        switch (dtype) {
            case FieldType.integer:
                strType = 'INTEGER';
                break;
            case FieldType.text:
                strType = 'TEXT';
                break;
            case FieldType.blob:
                strType = 'BLOB';
                break;
            default:
                strType = 'TEXT';
                break;
        }
        return strType;
    }//getFieldType

    /**
    * 根据查询条件联结查询语句
    * @param filters 
    */
    private conjunctQuery(filters: Array<QueryFilter>): { SQL: string, Values: Array<any> } {
        let queryStr = '';
        let values = [];
        if (filters && filters.length) {
            for (let fieldItem of filters) {
                switch (fieldItem.Operator) {
                    case MachOperate.Eq:
                        queryStr += ` AND ${fieldItem.PropertyName}=? `;
                        values.push(fieldItem.Value);
                        break;
                    case MachOperate.Gt:
                        queryStr += ` AND ${fieldItem.PropertyName}> ? `;
                        values.push(fieldItem.Value);
                        break;
                    case MachOperate.Ge:
                        queryStr += ` AND ${fieldItem.PropertyName}>=? `;
                        values.push(fieldItem.Value);
                        break;
                    case MachOperate.Lt:
                        queryStr += ` AND ${fieldItem.PropertyName}<? `;
                        values.push(fieldItem.Value);
                        break;
                    case MachOperate.Le:
                        queryStr += ` AND ${fieldItem.PropertyName}<=? `;
                        values.push(fieldItem.Value);
                        break;
                    case MachOperate.Like:
                        queryStr += ` AND ${fieldItem.PropertyName} LIKE ? `;
                        values.push(`%${fieldItem.Value}%`);
                        break;
                    case MachOperate.StartWith:
                        queryStr += ` AND ${fieldItem.PropertyName} LIKE ? `;
                        values.push(`%${fieldItem.Value}`);
                        break;
                    case MachOperate.Between:
                        queryStr += ` AND ${fieldItem.PropertyName}>=? AND ${fieldItem.PropertyName}<=? `;
                        values.push(fieldItem.Value);
                        values.push(fieldItem.Value2);
                        break;
                    case MachOperate.Lt:
                        queryStr += ` AND ${fieldItem.PropertyName} !=? `;
                        values.push(fieldItem.Value);
                        break;
                    default:
                        break;
                }
            }
        }
        return { SQL: queryStr, Values: values };;
    }//conjunctQuery


    /**
     * 构建新建表SQL
     * @param entity 
     */
    public createTableTrans(entity: Entity): string {
        let tableName = `T_${entity.constructor.name}`;
        let structs = entity.defineTable();
        let fieldDefines = [];
        for (let item of structs) {
            if (item[0] && item[0].toUpperCase() !== 'Id') {
                fieldDefines.push(`${item[0]} ${this.getFieldType(item[1])}`);
            }
        }
        let strSql = `CREATE TABLE IF NOT EXISTS ${tableName} (Id INTEGER PRIMARY KEY AUTOINCREMENT,${fieldDefines.join(',')})`;
        return strSql;
    }//createTableTrans

    /**
     * 构建删除表SQL
     * @param entity 
     */
    public dropTableTrans(entity: Entity): string {
        let tableName = `T_${entity.constructor.name}`;
        let strSql = `DROP TABLE ${tableName}`;
        return strSql;
    }

    /**
     * 构建新建数据SQL
     * @param entity 
     */
    public createDataTrans(entity: Entity): [string, Array<any>] {
        let tableName = `T_${entity.constructor.name}`;
        let fieldArr = Object.keys(entity).filter(field => field.toUpperCase() !== 'Id');
        let valueArr = [];
        let holders = [];
        for (let ky of fieldArr) {
            valueArr.push(entity[ky]);
            holders.push('?');
        }
        let strSql = `INSERT INTO ${tableName} (${fieldArr.join(',')}) VALUES (${holders.join(',')})`;
        return [strSql, valueArr];
    }//createDataTrans

    /**
     * 构建更新数据SQL
     * @param entity 
     */
    public updateDataTrans(entity: Entity): [string, Array<any>] {
        let tableName = `T_${entity.constructor.name}`;
        let fieldArr = Object.keys(entity).filter(field => field.toUpperCase() !== 'Id');
        let valueArr = [];
        let holders = [];
        for (let ky of fieldArr) {
            valueArr.push(entity[ky]);
            holders.push(`${ky}=?`);
        }
        let strSql = `UPDATE ${tableName} SET ${holders.join(',')} WHERE Id=${entity.Id}`;
        return [strSql, valueArr];
    }//updateDataTrans

    /**
     * 构建删除数据SQL
     * @param entity 
     */
    public deleteDataTrans(entity: Entity): string {
        let tableName = `T_${entity.constructor.name}`;
        let strSql = `DELETE FROM ${tableName}  WHERE Id=${entity.Id}`;
        return strSql;
    }//deleteDataTrans

    /**
     * 构建查询数据SQL
     * @param filters 
     * @param instance 
     */
    public queryDataTrans(filters: Array<QueryFilter>, instance: Entity): [string, Array<any>] {
        let tableName = `T_${instance.constructor.name}`;
        let strSql = `SELECT * FROM ${tableName} WHERE 1=1 `;
        //过滤掉无效的字段信息,同时生成查询条件
        let fields = instance.defineTable().map(gen => gen[0]);
        let effectFields = [];
        if (filters && filters.length) {
            for (let filterItem of filters) {
                if (fields.indexOf(filterItem.PropertyName) !== -1) {
                    effectFields.push(filterItem);
                }
            }
        }
        let conjuncts = this.conjunctQuery(effectFields);
        return [`${strSql} ${conjuncts.SQL}`, conjuncts.Values];
    }//queryDataTrans

}//SQLTranslator