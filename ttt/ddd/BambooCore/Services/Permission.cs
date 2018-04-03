using System;
using System.Collections.Generic;
using System.Text;
using BambooCommon;

namespace BambooCore
{
    
    /// <summary>
    /// 资源的权限定义，用一个8位整数表示对一个资源的权限，每个位表示一个项目是否有权限
    /// 位号  8  7  6   5    4    3    2    1
    /// 意义  无 无 无 管理 删除 修改 读取 列表  
    /// </summary>
    public class Permission
    {
        public static byte ValueFromEnum(PermissionType type)
        {
            return (byte)type;
        }
        public static PermissionType EnumToValue(byte type)
        {
            return (PermissionType)type;
        }

        public static PermissionItem NewItem(string accid, string resid, string restype, PermissionType type)
        {
            PermissionItem p = new PermissionItem();
            p.Id = GuidGen.NewGUID();
            p.AccountId = accid;
            p.ResId = resid;
            p.ResType = restype;
            p.Permission = (byte)type;
            return p;
        }

        //---------------------------------------------------------------------

        public static bool CanList(byte v)
        {
            return Bitset8.GetBit(v, 0);
        }

        public static bool CanRead(byte v)
        {
            return Bitset8.GetBit(v, 1);
        }

        public static bool CanWrite(byte v)
        {
            return Bitset8.GetBit(v, 2);
        }

        public static bool CanDelete(byte v)
        {
            return Bitset8.GetBit(v, 3);
        }

        public static bool CanManage(byte v)
        {
            return Bitset8.GetBit(v, 4);
        }

        //---------------------------------------------------------------------

        public static bool CanList(PermissionType v)
        {
            return Bitset8.GetBit((byte)v, 0);
        }

        public static bool CanRead(PermissionType v)
        {
            return Bitset8.GetBit((byte)v, 1);
        }

        public static bool CanWrite(PermissionType v)
        {
            return Bitset8.GetBit((byte)v, 2);
        }

        public static bool CanDelete(PermissionType v)
        {
            return Bitset8.GetBit((byte)v, 3);
        }

        public static bool CanManage(PermissionType v)
        {
            return Bitset8.GetBit((byte)v, 4);
        }

        //---------------------------------------------------------------------

        public static bool CanList(PermissionItem v)
        {
            return Bitset8.GetBit(v.Permission, 0);
        }

        public static bool CanRead(PermissionItem v)
        {
            return Bitset8.GetBit(v.Permission, 1);
        }

        public static bool CanWrite(PermissionItem v)
        {
            return Bitset8.GetBit(v.Permission, 2);
        }

        public static bool CanDelete(PermissionItem v)
        {
            return Bitset8.GetBit(v.Permission, 3);
        }

        public static bool CanManage(PermissionItem v)
        {
            return Bitset8.GetBit(v.Permission, 4);
        }

    }
}
