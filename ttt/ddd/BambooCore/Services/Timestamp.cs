using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BambooCore
{
    /// <summary>
    /// Unix时间戳相关的处理函数
    /// 服务器内部所有时间都为UTC时间，和客户端的交流也都统一使用UTC时间戳，时间的本地化仅在客户端界面显示时处理。
    /// unix stamp 是 1970年1月1日,0:00 GMT，格林尼治时间。也就是 UTC 统一协调时时间
    /// </summary>
    public class Timestamp
    {

        /// <summary>
        /// utc时间转unix时间戳，注意要utc时间 DateTime.UtcNow 而不是DateTime.Now
        /// 时间可以通过DateTime.ToLocalTime / ToUniverseTime 在本地和UTC时间互相转换。本函数需要UTC时间
        /// </summary>
        /// <param name="utcTime"></param>
        /// <returns></returns>
        public static long DateTimeToTimeStampUtc(DateTime utcTime)
        {
            return (utcTime.Ticks - 621355968000000000) / 10000000;
        }
        /// <summary>
        /// 本地时间转unix时间戳
        /// </summary>
        /// <param name="localTime"></param>
        /// <returns></returns>
        public static long DateTimeToTimeStampLocal(DateTime localTime)
        {
            return (localTime.ToUniversalTime().Ticks - 621355968000000000) / 10000000;
        }

        /// <summary>
        /// unix时间戳转时间，参数为utc时间戳版本，返回utc时间
        /// </summary>
        /// <param name="utcTmStamp">utc时间戳</param>
        /// <returns>utc时间</returns>
        public static DateTime TimeStampToDateTimeUtc(long utcTmStamp)
        {
            var start = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            return start.AddSeconds(utcTmStamp);
        }
    }
}
