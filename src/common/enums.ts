
export enum DebugType {
    /**
     * 生产模式,非调试
     */
    product = 0,
    /**
     * 基本调试模式,此时debug信息会以Console.log显示
     */
    debug = 1,
    /**
     * UI调试模式,此时debug信息会以Alert显示
     */
    alert = 2
}

export enum AlarmLevel {
    /** 
     * 正常
    */
    Normal = 0,
    /** 
     * 预警
    */
    PreWarning = 1,
    /** 
     * 警告
    */
    Warning = 2,
    /** 
     * 报警
    */
    Alarm = 3,
    /** 
     * 危险
    */
    Danger = 4
}