using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BambooCore
{
    public static class StringExtention
    {
        /// <summary>
        /// 安全且简便的判断字符串是否包含子字符串的函数，避免逻辑层的多处if check和异常触发
        /// s==null则返回false，substr==null/""则返回true。包含则返回true
        /// </summary>
        /// <param name="s"></param>
        /// <param name="substr"></param>
        /// <returns></returns>
        public static bool HaveSubStr(this string s, string substr)
        {
            if (s == null)
                return false;
            if (string.IsNullOrEmpty(substr))
                return true;
            return s.IndexOf(substr) >= 0;
        }
    }
}
