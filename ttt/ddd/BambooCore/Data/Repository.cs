using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using BambooCommon;
using System.Linq;

namespace BambooCore
{
    /// <summary>
    /// 通用的Entity存储仓库，提供常规的增删改查逻辑
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class Repository<T> where T : EntityBase, new()
    {
        private readonly DbContext context;
        private static long nextNewNameId = 0;

        public Repository(DbContext context)
        {
            this.context = context;
        }

        /// <summary>
        /// 获取此类型的DbSet对象，以便扩展
        /// </summary>
        public DbSet<T> Set { get { return context.Set<T>(); } }

        /// <summary>
        /// 获取DbContext对象，以便扩展
        /// </summary>
        public DbContext Context { get { return context; } }
        
        public IQueryable<PermissionItem> GetPermissons(string accid)
        {
            return context.Set<PermissionItem>().Where(d => d.AccountId == accid);
        }

        public IQueryable<T> GetDataSet(string accid)
        {
            var dataSet = context.Set<T>();
            var permissionSet = GetPermissons(accid);
            var tempset = from d in dataSet join p in permissionSet on d.Id equals p.ResId select d;
            return tempset;
        }

        /// <summary>
        /// 分页获取数据，支持自定义筛选条件，按属性名排序
        /// </summary>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <param name="orderBy"></param>
        /// <param name="desc"></param>
        /// <param name="searchPredicate"></param>
        /// <returns></returns>
        public PagedData<T> Get(string accid, int page, int pageSize, string orderBy, bool desc, Func<T, bool> searchPredicate)
        {
            return GetDataSet(accid).Paging(page, pageSize, orderBy, desc, searchPredicate);
        }
        
        /// <summary>
        /// 通过ID获取一个数据，如果找不到或者无权访问则返回null，已通过权限过滤
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public T Get(string accid, string id)
        {
            if (CanRead(accid, id) == false)
                return null;

            return GetDataSet(accid).FirstOrDefault(d => d.Id == id);
        }

        /// <summary>
        /// 创建新对象，传递null则返回null
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public T Create(string accid, T value, bool forceNewId = true)
        {
            if (value == null)
                return null;
            
            if(forceNewId)
                value.Id = GuidGen.NewGUID();//强制分配新id

            if (string.IsNullOrEmpty(value.Name))
                value.Name = "Obj" + nextNewNameId++;            

            context.Set<T>().Add(value);
            
            context.Set<PermissionItem>().Add(Permission.NewItem(accid, value.Id, value.GetType().Name, PermissionType.All));

            context.SaveChangesAsync();
            return value;
        }

        /// <summary>
        /// 批量创建
        /// </summary>
        /// <param name="values"></param>
        /// <returns></returns>
        public int BatchCreate(string accid, IEnumerable<T> values)
        {
            int count = 0;
            var set = context.Set<T>();
            string type = typeof(T).Name;
            var pset = context.Set<PermissionItem>();
            foreach (var item in values)
            {
                set.Add(item);
                
                pset.Add(Permission.NewItem(accid, item.Id, type, PermissionType.All));

                count++;
            }
            SaveChangesAsync();
            return count;
        }

        /// <summary>
        /// 批量创建
        /// </summary>
        /// <param name="count">创建对象的数量</param>
        /// <param name="template">模板对象</param>
        /// <returns></returns>
        public int BatchCreate(string accid, int count, T template)
        {
            var set = context.Set<T>();
            if (template == null)
                template = new T();

            string type = typeof(T).Name;
            var pset = context.Set<PermissionItem>();
            for (int i = 0; i < count; i++)
            {
                var t = template.Clone() as T;
                t.Id = GuidGen.NewGUID();
                set.Add(t);
                
                pset.Add(Permission.NewItem(accid, t.Id, type, PermissionType.All));
            }
            SaveChangesAsync();
            return count;
        }

        /// <summary>
        /// 判断用户是否能更新指定资源
        /// </summary>
        /// <param name="accid"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public bool CanUpdate(string accid, string id)
        {
            var p = context.Set<PermissionItem>().FirstOrDefault(d => d.AccountId == accid && d.ResId == id);
            if (p == null)
                return false;
            return Permission.CanWrite(p.Permission);
        }

        /// <summary>
        /// 判断用户是否能删除指定资源
        /// </summary>
        /// <param name="accid"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public bool CanDelete(string accid, string id)
        {
            var p = context.Set<PermissionItem>().FirstOrDefault(d => d.AccountId == accid && d.ResId == id);
            if (p == null)
                return false;
            return Permission.CanDelete(p.Permission);
        }

        /// <summary>
        /// 判断用户是否能查看指定资源的内容
        /// </summary>
        /// <param name="accid"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public bool CanRead(string accid, string id)
        {
            var p = context.Set<PermissionItem>().FirstOrDefault(d => d.AccountId == accid && d.ResId == id);
            if (p == null)
                return false;
            return Permission.CanRead(p.Permission);
        }

        /// <summary>
        /// 判断用户是否能管理指定的资源
        /// </summary>
        /// <param name="accid"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public bool CanManage(string accid, string id)
        {
            var p = context.Set<PermissionItem>().FirstOrDefault(d => d.AccountId == accid && d.ResId == id);
            if (p == null)
                return false;
            return Permission.CanManage(p.Permission);
        }

        /// <summary>
        /// 获取用户对指定资源的权限
        /// </summary>
        /// <param name="accid"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public PermissionItem GetPermission(string accid, string id)
        {
            return context.Set<PermissionItem>().FirstOrDefault(d => d.AccountId == accid && d.ResId == id);
        }

        /// <summary>
        /// 更新一个对象，value=null或者id找不到则返回null，内部已经做了访问权限判断
        /// </summary>
        /// <param name="id"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public T Update(string accid, T value)
        {
            if (CanUpdate(accid, value.Id) == false)
                return null;

            ListableEntity entity = value as ListableEntity;
            if (entity != null)
                UpdateProtectListableEntity(accid, entity);
            
            var res = GetDataSet(accid).FirstOrDefault(d => d.Id == value.Id);
            if (res == null)
                return null;
            DataCopyer.CopyDataTo(value, res);
            context.SaveChangesAsync();
            return res;
        }
        
        /// <summary>
        /// Update操作前的数据检查，确保数据不会误导ID,CreateTime, ModifyTime，比如 PUT /asset/105  但是提供的数据里面id=106。
        /// </summary>
        /// <param name="accid"></param>
        /// <param name="id"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        bool UpdateProtectListableEntity(string accid, ListableEntity value)
        {
            ListableEntity src = Get(accid, value.Id) as ListableEntity;
            if (src == null)
                return false;
            value.CreateTime = src.CreateTime;
            value.ModifyTime = DateTime.UtcNow;
            return true;
        }

        /// <summary>
        /// 根据id删除一个，内部已经做了访问权限判断
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public bool Delete(string accid, string id)
        {
            if (CanDelete(accid, id) == false)
                return false;
            var res = GetDataSet(accid).FirstOrDefault(d => d.Id == id);
            if(res != null)
                context.Set<T>().Remove(res);
            
            var pset = context.Set<PermissionItem>();
            var pitem = pset.FirstOrDefault(d => d.AccountId == accid && d.ResId == id);
            if(pitem != null)
                pset.Remove(pitem);

            context.SaveChangesAsync();
            return true;
        }
        
        /// <summary>
        /// 保存数据修改到数据库，多次修改一次提交一般会作为事务提交，有一个失败就全部失败。所以应该尽量修改后就提交。
        /// 本类的方法中除了查询外的函数已经执行了SaveChanges操作，不需要再次调用此方法。
        /// 此方法是为了给直接访问DbSet属性做自定义操作后使用的。
        /// </summary>
        public void SaveChangesAsync()
        {
            context.SaveChangesAsync();
        }
    }
}
