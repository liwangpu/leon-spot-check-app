using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using ApiModel;
using BambooCommon;
using BambooCore;

namespace ApiServer.Services
{
    /// <summary>
    /// 对数据进行检查的类，当POST（新建）和PUT（修改）资源时，应该对数据进行过滤和判断。
    /// 服务器不应该相信客户端的数据，能在服务端决定的数据就不应该使用客户端提供的数据。
    /// 比如id不应该修改，创建时间，修改时间，所属账号等应该由服务器决定而不是客户端随便写。
    /// </summary>
    public class DataChecker
    {
        public static void Check(EntityBase obj)
        {
            if (obj == null)
                return;

        }
        public static void Check(ListableEntity obj)
        {
            if (obj == null)
                return;

        }
        public static void Check(Asset obj)
        {
            if (obj == null)
                return;

        }
        public static void Check(FileAsset obj)
        {
            if (obj == null)
                return;

        }
    }
}
