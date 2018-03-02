/**
 * 数据库存储实体类型
 */
export abstract class Entity {
    abstract Id: number;
    abstract defineTable(): Array<[string, FieldType]>;
}

/**
 * SQLite表字段类型
 */
export enum FieldType {
    /**
     * 整型
     */
    integer = 1,
    /**
     * 浮点型
     */
    float = 2,
    /**
     * 字符型
     */
    text = 3,
    /**
     * 二进制
     */
    blob = 4
}

export abstract class DbEngine {
    /**
     * 执行SQL
     */
    abstract executeSql: (strSql: string, values: Array<any>) => Promise<Array<any>>;

    /**
     * 执行SQL并返回影响记录的id
     */
    abstract executeSqlBackId: (strSql: string, values: Array<any>) => Promise<number>;
}

/**
 * 查询过滤条件
 */
export class QueryFilter {
    constructor(public PropertyName: string, public Operator: MachOperate, public Value: any, public Value2?: any) { }
}

/**
 * 查询操作符
 */
export enum MachOperate {
    /**
     * 等于
     */
    Eq = 1,
    /**
     * 大于
     */
    Gt = 2,
    /**
     * 大于等于
     */
    Ge = 3,
    /**
     * 小于
     */
    Lt = 4,
    /**
     * 小于等于
     */
    Le = 5,
    /**
     * 包含字符
     */
    Like = 6,
    /**
     * 以此字符开头
     */
    StartWith = 7,
    /**
     * 介于值之间
     */
    Between = 8,
    /**
     * 不等于
     */
    NEq = 9
}
