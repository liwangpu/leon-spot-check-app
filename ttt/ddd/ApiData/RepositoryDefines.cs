using System;
using System.Collections.Generic;
using System.Text;
using ApiModel;
using Microsoft.Extensions.DependencyInjection;

namespace ApiData
{
    /// <summary>
    /// 仓库服务依赖注册器
    /// </summary>
    public class ApiRepositoryRegister
    {
        /// <summary>
        /// 把每一个类的仓库类注册为服务
        /// </summary>
        /// <param name="services"></param>
        public static void RegisterServices(IServiceCollection services)
        {
            services.AddScoped<EntityRepository<Asset>, AssetRepository>();
            services.AddScoped<EntityRepository<User>, UserRepository>();
        }
    }

    //////////////////////////////////////////////////////////////////
    //这里的xxxDepot类是为了简化模板写法并且提供一个DbContext的依赖注入入口

    public class AssetRepository : EntityRepository<Asset> { public AssetRepository(ApiDbContext context): base(context) { } }
    public class UserRepository : EntityRepository<User> { public UserRepository(ApiDbContext context) : base(context) { } }
}
