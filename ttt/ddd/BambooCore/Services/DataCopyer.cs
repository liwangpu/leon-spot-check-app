using System;
using System.Collections.Generic;
using System.Reflection;
using System.Text;

namespace BambooCore
{
    /// <summary>
    /// 数据拷贝器，对对象进行克隆和数据拷贝
    /// </summary>
    public class DataCopyer
    {
        /// <summary>
        /// 从一个对象拷贝公开的可读写成员属性的数据到目标对象，注意不包含static, readonly, private, protect属性
        /// </summary>
        /// <param name="from"></param>
        /// <param name="to"></param>
        public static void CopyDataTo(object from, object to)
        {
            if (from == null || to == null)
                return;
            const BindingFlags flags = BindingFlags.Public | BindingFlags.Instance | BindingFlags.GetProperty | BindingFlags.SetProperty;
            var otherProps = from.GetType().GetProperties(flags);
            var myProps = to.GetType().GetProperties(flags);
            for (int i = 0; i < myProps.Length; i++)
            {
                for (int j = 0; j < otherProps.Length; j++)
                {
                    if (myProps[i].Name == otherProps[j].Name)
                        myProps[i].SetValue(to, otherProps[j].GetValue(from));
                }
            }
        }

        /// <summary>
        /// 克隆一个新的数据一样的对象，只复制了公开可读写属性的数据。 浅拷贝，引用类型的成员没有克隆新的一份。
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="obj"></param>
        /// <returns></returns>
        public static T CloneByProperties<T>(T obj) where T : new()
        {
            if (obj == null)
                return default(T);
            T t = new T();
            CopyDataTo(obj, t);
            return t;
        }

        /// <summary>
        /// 克隆一个新的数据一样的对象，目标需要是继承自ICloneable，所有的属性和字段，包括私有的都会被复制。浅拷贝，引用类型的成员没有克隆新的一份。
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="obj"></param>
        /// <returns></returns>
        public static T CloneCloneable<T>(T obj) where T : class, ICloneable
        {
            if (obj == null)
                return null;
            return obj.Clone() as T;
        }
    }
}
