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
 * 数据调试标记,默认为true
 * 浏览器调试时设置为true, 模拟器和真机中调试设置为false
 */
export const debugDb = true;

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


