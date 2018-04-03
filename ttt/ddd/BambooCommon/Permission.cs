using System;
using System.Collections.Generic;
using System.Text;

namespace BambooCommon
{

    /// <summary>
    /// 资源的权限定义，用一个8位整数表示对一个资源的权限，每个位表示一个项目是否有权限
    /// </summary>
    public enum PermissionType
    {
        /// <summary>
        /// 没有权限 0000 0000
        /// </summary>
        None = 0,

        /// <summary>
        /// 可以在列表看到条目 0000 0001
        /// </summary>
        List = 1,

        /// <summary>
        /// 可以只读打开查看 0000 0010
        /// </summary>
        Read = 2,

        /// <summary>
        /// 可以修改和写入 0000 0100
        /// </summary>
        Write = 4,

        /// <summary>
        /// 可以删除 0000 1000
        /// </summary>
        Delete = 8,

        /// <summary>
        /// 可以管理 0001 0000
        /// </summary>
        Manage = 16,

        /// <summary>
        /// List + Read 0000 0011
        /// </summary>
        ReadOnly = 3,

        /// <summary>
        /// List + Read + Write 0000 0111
        /// </summary>
        ReadWrite = 7,

        /// <summary>
        /// List + Read + Write + Delete 0000 1111
        /// </summary>
        ReadWriteDelete = 15,

        /// <summary>
        /// List + Delete + Manage 0001 1001
        /// </summary>
        ManageOnly = 25,

        /// <summary>
        /// List + Read + Write + Delete + Manage 0001 1111
        /// </summary>
        All = 31
    }

    public class PermissionItem
    {
        /// <summary>
        /// 权限的条目ID
        /// </summary>
        public string Id { get; set; }
        /// <summary>
        /// 所属账号
        /// </summary>
        public string AccountId { get; set; }
        /// <summary>
        /// 资源ID
        /// </summary>
        public string ResId { get; set; }
        /// <summary>
        /// 资源类型
        /// </summary>
        public string ResType { get; set; }
        /// <summary>
        /// 访问权限，内容应该为枚举 BambooCommon.PermissionType 的数值。
        /// </summary>
        public byte Permission { get; set; }
    }
}
