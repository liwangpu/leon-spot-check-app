import { Entity, FieldType } from '../services/dataStore/interfaces';

/**
 * 系统配置信息
 */
export class AppCfg implements Entity {
    Id: number;
    CfgValue: string;
    CfgKey: string;
    UserId: number; //用户id;
    LoginName: string; //登录名
    ImgPath: string; //头像路径
    PatternPwd : string; //手势密码
    CTime: string;  

    defineTable(): [string, FieldType][] {
        return [
            ['CfgValue', FieldType.text],
            ['CfgKey', FieldType.text],
            ['UserId', FieldType.integer],
            ['LoginName', FieldType.text],
            ['ImgPath', FieldType.text],
            ['PatternPwd', FieldType.text],
            ['CTime', FieldType.text]
        ];
    }

}
