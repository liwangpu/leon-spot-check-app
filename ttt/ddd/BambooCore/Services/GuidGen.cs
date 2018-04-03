using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BambooCore
{
    public class GuidGen
    {

        private static HashidsNet.Hashids hashIds = new HashidsNet.Hashids();
        private static int serverId;

        public static void Init(int inServerId, string inSalt, int inMinLen)
        {
            serverId = inServerId;
            if (serverId < 1)
                serverId = 1;
            if (string.IsNullOrWhiteSpace(inSalt))
                inSalt = "thisisThedefaultSalt";
            if (inMinLen < 0)
                inMinLen = 8;
            hashIds = new HashidsNet.Hashids(inSalt, inMinLen, "BCDFHJKNPQRSTUVWXYZMEGA0123456789");
        }

        /// <summary>
        /// 分配一个新的全局唯一ID
        /// </summary>
        /// <returns></returns>
        public static string NewGUID()
        {
            return hashIds.EncodeLong(serverId, DateTime.UtcNow.Ticks - 636503616000000000L); // 636503616000000000 = ticks of 2018-01-01 00:00:00
        }

        /// <summary>
        /// 从GUID中解析出服务器ID，创建时间，值
        /// </summary>
        /// <param name="guid"></param>
        /// <param name="serverId"></param>
        /// <param name="createTime"></param>
        /// <returns></returns>
        public static long DecryptGUID(string guid, out int serverId, out DateTime createTime)
        {
            long[] vv = hashIds.DecodeLong(guid);
            if (vv == null || vv.Length < 2)
            {
                serverId = 0;
                createTime = new DateTime(0);
                return 0;
            }
            serverId = (int)vv[0];
            createTime = new DateTime(vv[1], DateTimeKind.Utc).AddYears(2018);
            return vv[1];
        }
    }
}
