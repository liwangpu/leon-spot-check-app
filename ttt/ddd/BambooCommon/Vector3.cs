using System;
using System.Collections.Generic;
using System.Text;

namespace BambooCommon
{

    /// <summary>  
    /// 3D向量类  
    /// </summary>  
    public class Vector3
    {
        public float X { get; set; }

        public float Y { get; set; }

        public float Z { get; set; }

        public static char spliter = ',';

        static Vector3 globalZero = new Vector3();

        public static Vector3 Zero { get { return globalZero; } }

        /// <summary>  
        /// 默认构造函数，不执行任何操作  
        /// </summary>  
        public Vector3()
        {

        }

        /// <summary>  
        /// 复制向量的构造函数  
        /// </summary>  
        /// <param name="a"></param>  
        public Vector3(Vector3 a)
        {
            this.X = a.X;
            this.Y = a.Y;
            this.Z = a.Z;
        }

        /// <summary>  
        /// 带参构造函数，用三个值完成初始化.  
        /// </summary>  
        /// <param name="nx"></param>  
        /// <param name="ny"></param>  
        /// <param name="nz"></param>  
        public Vector3(float nx, float ny, float nz)
        {
            this.X = nx;
            this.Y = ny;
            this.Z = nz;
        }

        public Vector3(string str)
        {
            string[] ss = str.Split(spliter);
            float t = 0;
            if (ss.Length > 0)
                float.TryParse(ss[0], out t); X = t;
            if (ss.Length > 1)
                float.TryParse(ss[1], out t); Y = t;
            if (ss.Length > 2)
                float.TryParse(ss[2], out t); Z = t;
        }

        public override string ToString()
        {
            return string.Format("{0},{1},{2}", X, Y, Z);
        }

        #region 运算符  


        public static bool operator ==(Vector3 v1, Vector3 v2)
        {
            return v1.X == v2.X && v1.Y == v2.Y && v1.Z == v2.Z;
        }

        public static bool operator !=(Vector3 v1, Vector3 v2)
        {
            return v1.X != v2.X || v1.Y != v2.Y || v1.Z != v2.Z;
        }
        public override int GetHashCode()
        {
            return base.GetHashCode();
        }

        /// <summary>  
        /// 重载一元“-”运算符  
        /// </summary>  
        /// <param name="v"></param>  
        /// <returns></returns>  
        public static Vector3 operator -(Vector3 v)
        {
            return new Vector3(-v.X, -v.Y, -v.Z);
        }

        /// <summary>  
        /// 重载二元"+"运算符  
        /// </summary>  
        /// <param name="v1"></param>  
        /// <param name="v2"></param>  
        /// <returns></returns>  
        public static Vector3 operator +(Vector3 v1, Vector3 v2)
        {
            return new Vector3(v1.X + v2.X, v1.Y + v2.Y, v1.Z + v2.Z);
        }

        /// <summary>  
        /// 重载二元"-"运算符  
        /// </summary>  
        /// <param name="v1"></param>  
        /// <param name="v2"></param>  
        /// <returns></returns>  
        public static Vector3 operator -(Vector3 v1, Vector3 v2)
        {
            return new Vector3(v1.X - v2.X, v1.Y - v2.Y, v1.Z - v2.Z);
        }

        /// <summary>  
        /// 与标量相乘  
        /// </summary>  
        /// <param name="v"></param>  
        /// <param name="a"></param>  
        /// <returns></returns>  
        public static Vector3 operator *(Vector3 v, float a)
        {
            return new Vector3(v.X * a, v.Y * a, v.Z * a);
        }

        /// <summary>  
        /// 与标量相除  
        /// </summary>  
        /// <param name="v"></param>  
        /// <param name="a"></param>  
        /// <returns></returns>  
        public static Vector3 operator /(Vector3 v, float a)
        {
            float oneOverA = 1.0f / a;//:这里不对除零进行检查  
            return new Vector3(v.X * oneOverA, v.Y * oneOverA, v.Z * oneOverA);
        }

        // +=运算符不可显式重载，会随着+运算符的重载而隐式重载  
        // -=运算符不可显式重载，会随着-运算符的重载而隐式重载  
        // *=运算符不可显式重载，会随着*运算符的重载而隐式重载  
        // /=运算符不可显式重载，会随着/运算符的重载而隐式重载  

        /// <summary>  
        /// 向量点乘，重载标准乘法运算符.  
        /// </summary>  
        /// <param name="v1"></param>  
        /// <param name="v2"></param>  
        /// <returns></returns>  
        public static float operator *(Vector3 v1, Vector3 v2)
        {
            return v1.X * v2.X + v1.Y * v2.Y + v1.Z * v2.Z;
        }

        public override bool Equals(object v)
        {
            if (!(v is Vector3))
            {
                return false;
            }
            return this == (v as Vector3);
        }

        /// <summary>  
        /// 向量左乘  
        /// </summary>  
        /// <param name="a"></param>  
        /// <param name="v"></param>  
        /// <returns></returns>  
        public static Vector3 operator *(float a, Vector3 v)
        {
            return new Vector3(a * v.X, a * v.Y, a * v.Z);
        }
        #endregion


        /// <summary>  
        /// 置为零微量  
        /// </summary>  
        public void ToZero()
        {
            X = Y = Z = 0.0f;
        }


        /// <summary>  
        /// 向量标准化  
        /// </summary>  
        public void Normalize()
        {
            float magSq = X * X + Y * Y + Z * Z;
            if (magSq > 0.0f)//检查除零  
            {
                float oneOverMag = (float)(1.0f / Math.Sqrt(magSq));
                X *= oneOverMag;
                Y *= oneOverMag;
                Z *= oneOverMag;
            }
        }

        /// <summary>  
        /// 求向量模  
        /// </summary>  
        /// <returns></returns>  
        public float VectorMag()
        {
            return (float)(Math.Sqrt(X * X + Y * Y + Z * Z));
        }

        /// <summary>  
        /// 计算两向量的叉乘  
        /// </summary>  
        /// <returns></returns>  
        public Vector3 CorssProduct(Vector3 v)
        {
            return new Vector3(Y * v.Z - Z * v.Y,
                               Z * v.X - X * v.Z,
                               X * v.Y - Y * v.X);
        }

        /// <summary>  
        /// 计算两点间的距离  
        /// </summary>  
        /// <param name="v"></param>  
        /// <returns></returns>  
        public float Distance(Vector3 v)
        {
            float dx = X - v.X;
            float dy = Y - v.Y;
            float dz = Z - v.Z;
            return (float)(Math.Sqrt(dx * dx + dy * dy + dz * dz));
        }
    }
}
