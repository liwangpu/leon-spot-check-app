import { DebugType } from './enums';
/**
 * 应用配置信息帮助类
 */
export class AppConfig {

    /**************** Singleton ****************/
    private static _instance: AppConfig;
    private constructor() { }
    /**************** Singleton End ****************/

    private _iDebugType: DebugType;
    private _isDebug: boolean;
    private _isMobile: boolean;
    private _strHMSServiceUrl: string;
    private _strLoginName: string;
    private _strPassword: string;
    private _iUserId: number;
    private _strUserName: string;
    private _isAndroid: boolean;
    private _isIos: boolean;

    /**
     * App调试模式
     */
    public get debugType(): DebugType {
        return this._iDebugType;
    }

    /**
     * 获取应用是否启用调试模式参数
     */
    public get isDebug(): boolean {
        return this._isDebug;
    }


    /**
     * 获取应用是否是手机模式参数
     */
    public get isMobile(): boolean {
        return this._isMobile;
    }

    /**
     * 设置是否为移动设备
     */
    public setIsMobile(isMobile: boolean) {
        this._isMobile = isMobile;
    }

    /**获取真机环境是否为安卓设备 */
    public get isAndroid(): boolean {
        return this._isAndroid;
    }

    /**设置为安卓环境 */
    public setIsAndroid(isAndroid: boolean) {
        this._isAndroid = isAndroid;
    }

    /**获取真机环境是否为安卓设备 */
    public get isIos(): boolean {
        return this._isIos;
    }

    /**设置为ios环境 */
    public setIsIos(isIos: boolean) {
        this._isIos = isIos;
    }

    /**
     * 获取HMS Rest服务Url
     */
    public get HMSServiceUrl(): string {
        return this._strHMSServiceUrl;
    }

    /**
     * 获取用户登录账号信息
     */
    public get LoginName(): string {
        return this._strLoginName;
    }

    /**
     * 获取用户登录密码信息
     */
    public get Password(): string {
        return this._strPassword;
    }

    /**
     * 获取用户Id
     */
    public get UserId(): number {
        return this._iUserId;
    }

    /**
     * 获取用户姓名
     */
    public get UserName(): string {
        return this._strUserName;
    }

    /**
     * 获取AppConfig实例
     */
    public static getInstance(): AppConfig {
        if (!this._instance) {
            this._instance = new AppConfig();
        }
        return this._instance;
    }

    /**
     * 设置调试模式
     * @param iDebug 调试模式
     */
    public setDebugType(iDebug: DebugType): void {
        if (iDebug == DebugType.product) {
            this._isDebug = false;
        }
        else {
            this._isDebug = true;
        }
        this._iDebugType = iDebug;
    }


    /**
     * 设置应用HMS服务URL
     * @param strRestUrl 
     */
    public setHMSServiceUrl(strRestUrl: string): void {
        this._strHMSServiceUrl = strRestUrl;
    }

    /**
     * 设置用户Id
     * @param iUser 用户Id
     */
    public setUserId(iUser: number | string): void {
        if (typeof iUser === 'number') {
            this._iUserId = iUser;
        }
        else {
            this._iUserId = parseInt(iUser);
        }
    }

    /**
     * 设置用户姓名
     * @param strUserName 用户名称
     */
    public setUserName(strUserName: string): void {
        this._strUserName = strUserName;
    }

    /**退出当前登录用户 */
    public clearUserInfo(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this._strUserName = "";
            this._iUserId = 0;
            resolve(true);
        });
    }

    /** 
     * 校验用户:主要用于判断当前用户类型:游客/用户
     * true:用户 false:游客
    */
    public checkCustomer(): boolean {
        return this.UserId > 0;
    }

}