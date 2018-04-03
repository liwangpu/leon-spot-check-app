using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using ApiModel;

namespace ApiData
{
    /// <summary>
    /// 数据库初始化工具
    /// </summary>
    public class DbInitializer
    {
        private static ApiDbContext context;

        /// <summary>
        /// 如果数据库为空（第一次运行），填充初始化数据
        /// </summary>
        /// <param name="serviceProvider"></param>
        public static void InitDbIfItsEmpty(ApiDbContext dbContext)
        {
            context = dbContext;

            InitUsers();
        }

        static void InitUsers()
        {
            if (context.Users.Any())
                return;//有数据就返回

            User u = new User() { Name = "default", Description = "here is description" };
            context.Users.Add(u);
        }
    }
}
