using System;
using System.Collections.Generic;
using System.Text;

namespace BambooCommon
{
    public class Vector2
    {
        public float X { get; set; }
        public float Y { get; set; }

        public static char spliter = ',';
        static Vector2 globalZero = new Vector2();

        public static Vector2 Zero { get{ return globalZero; } } 

        public Vector2()
        {
            X = 0;
            Y = 0;
        }

        public Vector2(float x, float y)
        {
            X = x;
            Y = y;
        }

        public Vector2(string str)
        {
            string[] ss = str.Split(spliter);
            float t = 0;
            if (ss.Length > 0)
                float.TryParse(ss[0], out t); X = t;
            if (ss.Length > 1)
                float.TryParse(ss[1], out t); Y = t;
        }

        public override string ToString()
        {
            return string.Format("{0},{1}", X, Y);
        }


        #region 运算符  


        public static bool operator ==(Vector2 v1, Vector2 v2)
        {
            return v1.X == v2.X && v1.Y == v2.Y;
        }

        public static bool operator !=(Vector2 v1, Vector2 v2)
        {
            return v1.X != v2.X || v1.Y != v2.Y;
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
        public static Vector2 operator -(Vector2 v)
        {
            return new Vector2(-v.X, -v.Y);
        }

        /// <summary>  
        /// 重载二元"+"运算符  
        /// </summary>  
        /// <param name="v1"></param>  
        /// <param name="v2"></param>  
        /// <returns></returns>  
        public static Vector2 operator +(Vector2 v1, Vector2 v2)
        {
            return new Vector2(v1.X + v2.X, v1.Y + v2.Y);
        }

        /// <summary>  
        /// 重载二元"-"运算符  
        /// </summary>  
        /// <param name="v1"></param>  
        /// <param name="v2"></param>  
        /// <returns></returns>  
        public static Vector2 operator -(Vector2 v1, Vector2 v2)
        {
            return new Vector2(v1.X - v2.X, v1.Y - v2.Y);
        }

        /// <summary>  
        /// 与标量相乘  
        /// </summary>  
        /// <param name="v"></param>  
        /// <param name="a"></param>  
        /// <returns></returns>  
        public static Vector2 operator *(Vector2 v, float a)
        {
            return new Vector2(v.X * a, v.Y * a);
        }

        /// <summary>  
        /// 与标量相除  
        /// </summary>  
        /// <param name="v"></param>  
        /// <param name="a"></param>  
        /// <returns></returns>  
        public static Vector2 operator /(Vector2 v, float a)
        {
            float oneOverA = 1.0f / a;//:这里不对除零进行检查  
            return new Vector2(v.X * oneOverA, v.Y * oneOverA);
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
        public static float operator *(Vector2 v1, Vector2 v2)
        {
            return v1.X * v2.X + v1.Y * v2.Y;
        }

        public override bool Equals(object v)
        {
            if (!(v is Vector3))
            {
                return false;
            }
            return this == (v as Vector2);
        }

        /// <summary>  
        /// 向量左乘  
        /// </summary>  
        /// <param name="a"></param>  
        /// <param name="v"></param>  
        /// <returns></returns>  
        public static Vector2 operator *(float a, Vector2 v)
        {
            return new Vector2(a * v.X, a * v.Y);
        }
        #endregion



        /// <summary>  
        /// 置为零微量  
        /// </summary>  
        public void ToZero()
        {
            X = Y = 0.0f;
        }


        /// <summary>  
        /// 向量标准化  
        /// </summary>  
        public void Normalize()
        {
            float magSq = X * X + Y * Y;
            if (magSq > 0.0f)//检查除零  
            {
                float oneOverMag = (float)(1.0f / Math.Sqrt(magSq));
                X *= oneOverMag;
                Y *= oneOverMag;
            }
        }

        /// <summary>  
        /// 求向量模  
        /// </summary>  
        /// <returns></returns>  
        public float VectorMag()
        {
            return (float)(Math.Sqrt(X * X + Y * Y));
        }
        

        /// <summary>  
        /// 计算两点间的距离  
        /// </summary>  
        /// <param name="v"></param>  
        /// <returns></returns>  
        public float Distance(Vector2 v)
        {
            float dx = X - v.X;
            float dy = Y - v.Y;
            return (float)(Math.Sqrt(dx * dx + dy * dy));
        }
    }

}
