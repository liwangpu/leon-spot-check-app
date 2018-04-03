using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ApiModel;
using Microsoft.EntityFrameworkCore;

namespace ApiServer.Services
{
    public class AuthMan
    {
        public enum LoginResult
        {
            /// <summary>
            /// 登陆成功
            /// </summary>
            Ok,
            /// <summary>
            /// 账号或密码错误
            /// </summary>
            AccOrPasswordWrong,
            /// <summary>
            /// 账号被冻结
            /// </summary>
            Frozen,
            /// <summary>
            /// 账号没有激活
            /// </summary>
            NotActivation,
            /// <summary>
            /// 账号已经过期
            /// </summary>
            Expired
        }

        Data.ApiDbContext context;
        Controller controller;
        public AuthMan(Controller controller, Data.ApiDbContext context)
        {
            this.controller = controller;
            this.context = context;
        }

        public LoginResult LoginRequest(string account, string pwd, out Account acc)
        {
            acc = null;

            if (string.IsNullOrEmpty(account) || string.IsNullOrEmpty(pwd))
                return LoginResult.AccOrPasswordWrong;
            account = account.ToLower();
            pwd = pwd.ToLower();

            acc = context.Accounts.FirstOrDefault(d => d.Mail == account || d.Phone == account);

            if (acc == null)
                return LoginResult.AccOrPasswordWrong;

            if (acc.Frozened)
                return LoginResult.Frozen;

            var now = DateTime.UtcNow;
            if (now < acc.ActivationTime)
                return LoginResult.NotActivation;

            if (now > acc.ExpireTime)
                return LoginResult.Expired;

            if (acc.Password != pwd)
                return LoginResult.AccOrPasswordWrong;

            return LoginResult.Ok;
        }

        public static string GetAccountId(Controller c)
        {
            return c.User.Identity.Name;
        }

        public static Account GetAccount(Controller c, DbContext context)
        {
            return context.Set<Account>().Find(c.User.Identity.Name);
        }
        
    }
}
