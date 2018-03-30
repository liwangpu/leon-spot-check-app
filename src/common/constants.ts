//定义常量
/**
 * 数据库名称
 */
export const dbName = "pmshub.db";

/**
 * 节点类型,[1-测点,2-位置,3-设备,4-区域]
 */
export const nodeType = {
    Point: 1,
    Location: 2,
    Machine: 3,
    Area: 4
};

/**
 * 是否开发(调试)模式
 * 浏览器调试时设置为true, 模拟器和真机中调试设置为false
 */
export const IS_DEBUG = false;

/**
 * 周期时间
 */
export const PeriodNameType = {
    "1": "分钟",
    "2": "小时",
    "3": "天",
    "4": "周",
    "5": "月"
}

/**
 * 移动端点检设备标识
 */
export const devinfo = 'PMSHUB';

export const IMAGE_SIZE = 1024;//拍照/从相册选择照片压缩大小
export const QUALITY_SIZE = 94;//图像压缩质量，范围为0 - 100

/**系统模块
 * [模块名称;请求地址(pageUrl);序列;是否包含当前模块,默认false;图标名称]
 * 后续新增模块时只需依次添加
 */
export const ModuleArray = [
    { ModName: "备件", ModUrl: "", OrderNum: 0, Selected: false, IconName: "" }
    , { ModName: "故障", ModUrl: "", OrderNum: 1, Selected: false, IconName: "" }
    , { ModName: "履历", ModUrl: "", OrderNum: 2, Selected: false, IconName: "" }
    , { ModName: "精度", ModUrl: "", OrderNum: 3, Selected: false, IconName: "" }
]

export const UPDATE_URL = "http://192.168.1.6/PmsApp/update.xml";