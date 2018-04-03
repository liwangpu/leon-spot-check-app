using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Reflection;
using System.Text;

namespace BambooCommon
{
    /// <summary>
    /// 所有存数据库的实体类的基类，提供Clone方法，默认是浅拷贝，子类可以重写此函数以便提供自定义操作
    /// </summary>
    public class EntityBase : ICloneable
    {
        public string Id { get; set; }
        public string Name { get; set; }
               
        
        /// <summary>
        /// 创建一个新的数据和自己一样的浅拷贝对象，引用类型的成员还是保持引用，不会复制新对象出来。
        /// </summary>
        /// <returns></returns>
        public object Clone()
        {
            return MemberwiseClone();
        }

        /// <summary>
        /// 从另外一个对象拷贝数据到自己身上。只会拷贝public 带get;set的属性。不会拷贝成员变量，不会深拷贝引用类型的成员
        /// </summary>
        /// <param name="other"></param>
        public void CopyDataFrom(EntityBase other)
        {
            const BindingFlags flags = BindingFlags.Public | BindingFlags.Instance | BindingFlags.GetProperty | BindingFlags.SetProperty;
            var otherProps = other.GetType().GetProperties(flags);
            var myProps = GetType().GetProperties(flags);
            for (int i = 0; i < myProps.Length; i++)
            {
                for (int j = 0; j < otherProps.Length; j++)
                {
                    if (myProps[i].Name == otherProps[j].Name && myProps[i].Name != "Id")
                        myProps[i].SetValue(this, otherProps[j].GetValue(other));
                }
            }
        }
    }

    /// <summary>
    /// 所有在界面上列出显示的数据类的基类，提供图标，描述，创建时间和修改时间属性
    /// </summary>
    public class ListableEntity : EntityBase
    {
        public string Description { get; set; }
        public string Icon { get; set; }
        public DateTime CreateTime { get; set; }
        public DateTime ModifyTime { get; set; }
    }
}
