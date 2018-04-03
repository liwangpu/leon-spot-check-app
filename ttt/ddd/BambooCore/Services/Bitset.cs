using System;
using System.Collections.Generic;
using System.Text;

namespace BambooCore
{
    /// <summary>
    /// 类似c++的 bitset，进行位操作。 可以最大64位。可以用静态函数，也可以创建实例
    /// index是从0开始，0表示最低位。 
    /// Get获取指定位的值，Set设置指定为为1， Clear设置指定为为0
    /// </summary>
    public class Bitset
    {
        public Bitset()
        {

        }

        public Bitset(ulong v)
        {
            Value = v;
        }

        public ulong Value { get; set; }

        public bool GetBit(byte index)
        {
            return (Value & (1UL << index)) > 0 ? true : false;
        }
        public void SetBit(byte index)
        {
            Value = Value | (1UL << index);
        }
        public void ClearBit(byte index)
        {
            Value = Value & ~(1UL << index);
        }
        public void ReverseBit(byte index)
        {
            Value = Value ^ (1UL << index);
        }

        public static bool GetBit(ulong value, byte index)
        {
            return (value & (1UL << index)) > 0 ? true : false;
        }
        public static void SetBit(ref ulong value, byte index)
        {
            value = value | (1UL << index);
        }
        public static void ClearBit(ref ulong value, byte index)
        {
            value = value & ~(1UL << index);
        }
        public static void ReverseBit(ref ulong value, byte index)
        {
            value = value ^ (1UL << index);
        }
    }

    public class Bitset8
    {
        public Bitset8()
        {

        }

        public Bitset8(byte v)
        {
            Value = v;
        }

        public byte Value { get; set; }

        public bool GetBit(byte index)
        {
            return (Value & (1 << index)) > 0 ? true : false;
        }
        public void SetBit(byte index)
        {
            Value = (byte)(Value | (1 << index));
        }
        public void ClearBit(byte index)
        {
            Value = (byte)(Value & ~(1 << index));
        }
        public void ReverseBit(byte index)
        {
            Value = (byte)(Value ^ (1 << index));
        }

        public static bool GetBit(byte value, byte index)
        {
            return (value & (1UL << index)) > 0 ? true : false;
        }
        public static void SetBit(ref byte value, byte index)
        {
            value = (byte)(value | (1 << index));
        }
        public static void ClearBit(ref byte value, byte index)
        {
            value = (byte)(value & ~(1 << index));
        }
        public static void ReverseBit(ref byte value, byte index)
        {
            value = (byte)(value ^ (1 << index));
        }
    }

    public class Bitset16
    {
        public Bitset16()
        {

        }

        public Bitset16(ushort v)
        {
            Value = v;
        }

        public ushort Value { get; set; }

        public bool GetBit(byte index)
        {
            return (Value & (1 << index)) > 0 ? true : false;
        }
        public void SetBit(byte index)
        {
            Value = (ushort)(Value | (1 << index));
        }
        public void ClearBit(byte index)
        {
            Value = (ushort)(Value & ~(1 << index));
        }
        public void ReverseBit(byte index)
        {
            Value = (ushort)(Value ^ (1 << index));
        }

        public static bool GetBit(ushort value, byte index)
        {
            return (value & (1UL << index)) > 0 ? true : false;
        }
        public static void SetBit(ref ushort value, byte index)
        {
            value = (ushort)(value | (1 << index));
        }
        public static void ClearBit(ref ushort value, byte index)
        {
            value = (ushort)(value & ~(1 << index));
        }
        public static void ReverseBit(ref ushort value, byte index)
        {
            value = (ushort)(value ^ (1 << index));
        }
    }

    public class Bitset32
    {
        public Bitset32()
        {

        }

        public Bitset32(uint v)
        {
            Value = v;
        }

        public uint Value { get; set; }

        public bool GetBit(byte index)
        {
            return (Value & (1 << index)) > 0 ? true : false;
        }
        public void SetBit(byte index)
        {
            Value = Value | (1U << index);
        }
        public void ClearBit(byte index)
        {
            Value = (uint)(Value & ~(1 << index));
        }
        public void ReverseBit(byte index)
        {
            Value = (uint)(Value ^ (1 << index));
        }

        public static bool GetBit(uint value, byte index)
        {
            return (value & (1UL << index)) > 0 ? true : false;
        }
        public static void SetBit(ref uint value, byte index)
        {
            value = value | (1U << index);
        }
        public static void ClearBit(ref uint value, byte index)
        {
            value = value & ~(1U << index);
        }
        public static void ReverseBit(ref uint value, byte index)
        {
            value = (uint)(value ^ (1 << index));
        }
    }
}
