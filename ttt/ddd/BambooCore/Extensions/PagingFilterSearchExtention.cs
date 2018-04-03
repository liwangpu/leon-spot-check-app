using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BambooCore
{
    /// <summary>
    /// 通用的分页数据结构
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class PagedData<T>
    {
        public List<T> Data { get; set; }
        public int Page { get; set; }
        public int Size { get; set; }
        public int Total { get; set; }
    }

    /// <summary>
    /// 对IEnumerable的分页查询的扩展
    /// </summary>
    public static class PagingFilterSearchExtention
    {
        /// <summary>
        /// 对IEnumerable的分页查询的扩展，用法
        /// using ApiServer.Data;
        /// [HttpGet]
        /// public PagedData{Order} Get(string search, int page, int pageSize, string orderBy, bool desc)
        /// {
        ///     return context.Orders.Paging(context, page, pageSize, orderBy, desc,
        ///         string.IsNullOrEmpty(search) ? (Func{Order , bool}  )null : d => d.Id.HaveSubStr(search) || d.Name.HaveSubStr(search) || d.Content.HaveSubStr(search));
        /// }
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="src">IEnumerable<typeparamref name="T"/>的数据集合</param>
        /// <param name="context">DbContext对象，src应该在context.Set<typeparamref name="T"/>()能找到</param>
        /// <param name="page">需要第几页数据，从1开始，小于1则自动改为1，默认为1</param>
        /// <param name="pageSize">每页数据的数量，最小为1，默认为站点默认配置</param>
        /// <param name="orderBy">排序的属性名，区分大小写，且属性必须存在于类型<typeparamref name="T"/>中，默认为空</param>
        /// <param name="desc">是否是倒序排列，默认是升序</param>
        /// <param name="searchPredicate">用来查找或过滤的筛选函数，不需要此功能则传null即可</param>
        /// <returns></returns>
        public static PagedData<T> Paging<T>(this IEnumerable<T> src, int page, int pageSize, string orderBy, bool desc, Func<T, bool> searchPredicate) where T : class
        {
            PagedData<T> res = new PagedData<T>();

            IEnumerable<T> data = null;
            if (searchPredicate == null)
                data = src;
            else
                data = src.Where(searchPredicate);

            if (page < 1)
                page = 1;
            if (pageSize < 1)
                pageSize = 1;

            res.Total = data.Count();
            res.Page = page;

            if (!string.IsNullOrEmpty(orderBy))
            {
                try
                {
                    data = data.OrderBy(orderBy);
                    if (desc)
                        data = data.Reverse();
                }
                catch { }// orderBy参数有误，比如名称不是类的成员
            }

            if (((page - 1) * pageSize) > res.Total)
            {
                res.Data = new List<T>();
                res.Size = 0;
            }
            else
            {
                data = data.Skip((page - 1) * pageSize).Take(pageSize);
                res.Data = data.ToList();
                res.Size = res.Data.Count;
            }
            return res;
        }
    }
}
