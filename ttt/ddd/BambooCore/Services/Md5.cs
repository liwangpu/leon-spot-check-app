using System;
using System.Text;

namespace BambooCore
{
    public class Md5
    {
        public static string CalcFile(string localPath)
        {
            string hashMD5 = "";

            //检查文件是否存在，如果文件存在则进行计算，否则返回空值
            if (System.IO.File.Exists(localPath))
            {
                using (System.IO.FileStream fs = new System.IO.FileStream(localPath, System.IO.FileMode.Open, System.IO.FileAccess.Read))
                {
                    //计算文件的MD5值
                    System.Security.Cryptography.MD5 calculator = System.Security.Cryptography.MD5.Create();
                    Byte[] buffer = calculator.ComputeHash(fs);
                    calculator.Clear();
                    //将字节数组转换成十六进制的字符串形式
                    StringBuilder stringBuilder = new StringBuilder();
                    for (int i = 0; i < buffer.Length; i++)
                    {
                        stringBuilder.Append(buffer[i].ToString("x2"));
                    }
                    hashMD5 = stringBuilder.ToString();
                }//关闭文件流

            }//结束计算

            return hashMD5;
        }

        public static string CalcString(string str)
        {
            string hashMD5 = "";
            System.Security.Cryptography.MD5 calculator = System.Security.Cryptography.MD5.Create();
            Byte[] buffer = calculator.ComputeHash(Encoding.UTF8.GetBytes(str));
            calculator.Clear();
            //将字节数组转换成十六进制的字符串形式
            StringBuilder stringBuilder = new StringBuilder();
            for (int i = 0; i < buffer.Length; i++)
            {
                stringBuilder.Append(buffer[i].ToString("x2"));
            }
            hashMD5 = stringBuilder.ToString();
            return hashMD5;
        }
    }
}
