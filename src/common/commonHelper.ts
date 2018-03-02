import { nodeType, PeriodNameType } from '../common/constants';
/**
 * 公共帮助类
 * 主要进行数据转换等等
 */
export class CommonHelper {

    /**************** Singleton ****************/
    private static _instance: CommonHelper;
    private constructor() { }
    /**************** Singleton End ****************/

    /**
    * 获取AppConfig实例
    */
    public static getInstance() {
        if (!this._instance) {
            this._instance = new CommonHelper();
        }
        return this._instance;
    }

    /**
     * 获取测点类型
     * @param strType 
     */
    public getNodeType(strType: string): number {
        if (strType === 'measpoint')
            return nodeType.Point;
        else if (strType === 'Location')
            return nodeType.Location;
        else if (strType === 'Machine')
            return nodeType.Machine;
        else
            return nodeType.Area;
    };

    /**
     * 获取点检执行周期名称
     * @param period 
     */
    public getPeriodName(period: string | number): string {
        let transId = typeof period === 'string' ? period : String(period);
        let periodName = '';
        let keys = Object.keys(PeriodNameType);
        for (let key of keys) {
            if (transId === key) {
                return PeriodNameType[transId];
            }
        }
        return periodName;
    }

    /**
    * 将日期根据格式输出
    * @param dSource 需要转换的日期
    * @param strFormat 输出字符格式 例如yyyy/MM/dd hh:mm:ss等等
    */
    public dateFormat(dSource: Date, strFormat: string): string {
        let o = {
            "M+": dSource.getMonth() + 1, //月份
            "d+": dSource.getDate(), //日
            "h+": dSource.getHours(), //小时
            "m+": dSource.getMinutes(), //分
            "s+": dSource.getSeconds(), //秒
            "q+": Math.floor((dSource.getMonth() + 3) / 3), //季度
            "S": dSource.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(strFormat))
            strFormat = strFormat.replace(RegExp.$1, (dSource.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (let k in o)
            if (new RegExp("(" + k + ")").test(strFormat))
                strFormat = strFormat.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return strFormat;
    }

    /**
     * 对比两个日期的差值,返回毫秒
     * @param dDate1 日期1
     * @param dDate2 日期2
     */
    public dateDiff(dDate1: Date, dDate2: Date): number {
        let vdiff = dDate1.getTime() - dDate2.getTime();
        return vdiff;
    }

    /**
     * 将字符串格式字符转为日期
     * @param strDateTime 字符串格式 yyyy-MM-dd hh:mm:ss
     */
    public toDatetime(strDateTime: string): Date {
        if (strDateTime.indexOf('-') > 0)
            return this.toDatetime2(strDateTime);
        else
            return this.toDatetime1(strDateTime);
    }

    /**
     * 判断是否是整数
     * @param str 
     */
    public isInt(str: string): boolean {
        var reg = /^(-|\+)?\d+$/;
        return reg.test(str);
    }

    /**
     * 判断是否小数
     * @param str 
     */
    public isFloat(str: string): boolean {
        if (this.isInt(str))
            return false;
        var reg = /^(-|\+)?\d+\.\d*$/;
        return reg.test(str);
    }

    /**
     * 将字符串格式字符转为日期
     * @param strDateTime 字符串格式 年-月-日 
     * Internet Explorer does not like dashes in dates when converting,
     * so lets use a regular expression to get the year, month, and day
     */
    protected toDatetime1(strDateTime: string): Date {
        //字符串格式 年-月-日
        // Internet Explorer does not like dashes in dates when converting,
        // so lets use a regular expression to get the year, month, and day
        var DateRegex = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;
        var DateRegexResult = strDateTime.match(DateRegex);
        var DateResult;

        // try creating a new date in a format that both Firefox and Internet Explorer understand
        try {
            DateResult = new Date(parseInt(DateRegexResult[1]), parseInt(DateRegexResult[2]) - 1, parseInt(DateRegexResult[3]), parseInt(DateRegexResult[4]), parseInt(DateRegexResult[5]), parseInt(DateRegexResult[6]));
        }
        // if there is an error, catch it and try to set the date result using a simple conversion
        catch (err) {
            DateResult = new Date();
        }
        return DateResult;
    }

    /*
     * 将字符串格式字符转为日期
     * @param strDateTime 字符串格式 年-月-日
     * Internet Explorer does not like dashes in dates when converting,
     * so lets use a regular expression to get the year, month, and day
     */
    protected toDatetime2(strDateTime: string): Date {
        let DateRegex = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/;
        let DateRegexResult = strDateTime.match(DateRegex);
        let DateResult: Date;
        // try creating a new date in a format that both Firefox and Internet Explorer understand
        try {
            DateResult = new Date(parseInt(DateRegexResult[1]), parseInt(DateRegexResult[2]) - 1, parseInt(DateRegexResult[3]), parseInt(DateRegexResult[4]), parseInt(DateRegexResult[5]), parseInt(DateRegexResult[6]));
        }
        // if there is an error, catch it and try to set the date result using a simple conversion
        catch (err) {
            DateResult = new Date();
        }
        return DateResult;
    }

    /**将数据查询结果转换为json对象数组 */
    public copyRows(res) {
        let list = [];
        if (res) {
            for (let idx = 0; idx < res.rows.length; idx++) {
                list.push(Object.assign({}, res.rows.item(idx)));
            }
        }
        return list;
    }

    /**将单条数据查询结果转换为json对象 */
    public copySingle(res) {
        let item = null;
        if (res.rows.length) {
            item = Object.assign([], res.rows.item(0));
        }
        return item;
    }

    /**比较两个对象的大小,用于数组排序 */
    public compare(property){
        return function(a,b){
            var value1 = a[property];
            var value2 = b[property];
            return value1 - value2;
        }
    }
}
