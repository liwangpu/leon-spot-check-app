using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BambooCommon;

namespace BambooCore
{
    /// <summary>
    /// 用来生成对象的工厂
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class EntityFactory<T> where T : ListableEntity, new()
    {
        /// <summary>
        /// 下次生成对象用的ID
        /// </summary>
        public static long nextId = 0;

        /// <summary>
        /// 创建一个新对象
        /// </summary>
        /// <returns></returns>
        public static T New()
        {
            T d = new T();
            d.Id = GuidGen.NewGUID();
            d.Name = string.Format("obj{0:D4}", nextId++);
            d.CreateTime = DateTime.UtcNow;
            d.ModifyTime = d.CreateTime;
            d.Icon = "";
            d.Description = "";
            return d;
        }

        /// <summary>
        /// 批量生成，可以指定从一个模板拷贝，还可以指定一个随机函数，用来对对象进行随机化处理
        /// var list = BatchNew(10);
        /// var list = BatchNew(12, objToClone);
        /// var list = BatchNew(15, null, (obj, gi, bi) => obj.Name = string.format("obj-{0}", gi));
        /// var list = BatchNew(20, objToClone, randomizeFunction);  void randomizeFunction(T obj, long globalIndex, long batchIndex) { }
        /// </summary>
        /// <param name="count">要创建的对象的数量</param>
        /// <param name="template">模板对象，不提供模板则都创建全新对象</param>
        /// <param name="randomizer">对象随机器，提供一个函数，接受三个参数,T objToRandomize, long globalIndex, long batchIndex。然后对传入的obj修改属性</param>
        /// <returns></returns>
        public static List<T> BatchNew(long count, T template = null, Action<T, long, long> randomizer = null)
        {
            if (template == null)
                template = New();

            List<T> res = new List<T>();
            for (long i = 0; i < count; i++)
            {
                var d = template.Clone() as T;
                d.Id = GuidGen.NewGUID();
                d.Name = string.Format("obj{0:D4}", nextId++);
                d.CreateTime = DateTime.UtcNow;
                d.ModifyTime = d.CreateTime;
                randomizer?.Invoke(d, nextId, i);
                res.Add(d);
            }
            return res;
        }
    }
}
