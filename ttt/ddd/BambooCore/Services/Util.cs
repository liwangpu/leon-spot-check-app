using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BambooCore
{
    /// <summary>
    /// 辅助类，全局单例，提供一些常用的辅助函数
    /// </summary>
    public class Util
    {
        /// <summary>
        /// 从字节数转为 kb, mb这种直观的数值, 结果四舍五入, 2047 = 2kb
        /// </summary>
        /// <param name="bytes"></param>
        /// <returns></returns>
        public static string GetFileSizeString(long bytes)
        {
            long kbs = 1024;
            long mbs = 1048576; //1024*1024
            long gbs = 1073741824;//1024*1024*1024
            if (bytes < kbs)
                return bytes + " B";
            if (bytes < mbs)
                return string.Format("{0:N2} KB", (double)bytes / kbs);
            if (bytes < gbs)
                return string.Format("{0:N2} MB", (double)bytes / mbs);
            return string.Format("{0:N2} GB", (double)bytes / gbs);
        }

        /// <summary>
        /// 计算字符串的md5值
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public static string GetMd5Str(string str)
        {
            using (System.Security.Cryptography.MD5CryptoServiceProvider md5 = new System.Security.Cryptography.MD5CryptoServiceProvider())
            {
                if (str == null)
                    str = "";
                string s = BitConverter.ToString(md5.ComputeHash(System.Text.Encoding.UTF8.GetBytes(str)));
                s = s.Replace("-", "");
                return s;
            }
        }
        /// <summary>
        /// 计算二进制数据的md5值
        /// </summary>
        /// <param name="bytes"></param>
        /// <returns></returns>
        public static string GetMd5(byte[] bytes)
        {
            using (System.Security.Cryptography.MD5CryptoServiceProvider md5 = new System.Security.Cryptography.MD5CryptoServiceProvider())
            {
                if (bytes == null)
                    bytes = new byte[] { };
                string s = BitConverter.ToString(md5.ComputeHash(bytes));
                s = s.Replace("-", "");
                return s;
            }
        }

    }
}
