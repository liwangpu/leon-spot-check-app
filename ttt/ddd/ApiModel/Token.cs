using System;
using System.Collections.Generic;
using System.Text;

namespace ApiModel
{
    /// <summary>
    /// 请求access token的参数
    /// </summary>
    public class TokenRequestModel
    {
        public string Account { get; set; }
        public string Password { get; set; }
        /// <summary>
        /// 客户端的身份key
        /// </summary>
        public string AppKey { get; set; }
        /// <summary>
        /// 客户端用AppKey对应的secret 对account加密的结果
        /// </summary>
        public string Sign { get; set; }
    }
}
