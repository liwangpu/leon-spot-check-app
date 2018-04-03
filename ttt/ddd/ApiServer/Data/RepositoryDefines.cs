using System;
using System.Collections.Generic;
using System.Text;
using ApiModel;
using Microsoft.Extensions.DependencyInjection;

namespace ApiServer.Data
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
            services.AddScoped<IOrderRepository, OrderRepository>();
        }
    }

    //////////////////////////////////////////////////////////////////
    //这里的xxxDepot类是为了简化模板写法并且提供一个DbContext的依赖注入入口

    //public interface IUserRepository : IEntityRepository<User> { }
    //public class UserRepository : EntityRepository<User>, IUserRepository { public UserRepository(ApiDbContext context) : base(context) { } }
    public interface IOrderRepository : IEntityRepository<Order> { }
    public class OrderRepository : EntityRepository<Order>, IOrderRepository { public OrderRepository(ApiDbContext context) : base(context) { } }
}
