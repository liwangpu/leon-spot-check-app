using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Text;
using BambooCore;

namespace ApiServer.Tests.Services
{
    [TestClass]
    public class UtilTest
    {
        [TestMethod]
        public void Util_GetFileSizeStringTest()
        {
            Assert.IsTrue(Util.GetFileSizeString(-2) == "-2 B");
            Assert.IsTrue(Util.GetFileSizeString(0) == "0 B");
            Assert.IsTrue(Util.GetFileSizeString(1) == "1 B");
            Assert.IsTrue(Util.GetFileSizeString(999) == "999 B");
            Assert.IsTrue(Util.GetFileSizeString(1023) == "1023 B");
            Assert.IsTrue(Util.GetFileSizeString(1024) == "1.00 KB");
            Assert.IsTrue(Util.GetFileSizeString(1025) == "1.00 KB", Util.GetFileSizeString(1025));
            Assert.IsTrue(Util.GetFileSizeString(2047) == "2.00 KB", Util.GetFileSizeString(2047));
            Assert.IsTrue(Util.GetFileSizeString(2048) == "2.00 KB", Util.GetFileSizeString(2048));
            Assert.IsTrue(Util.GetFileSizeString(2049) == "2.00 KB", Util.GetFileSizeString(2049));
            Assert.IsTrue(Util.GetFileSizeString(2048 + 512) == "2.50 KB", Util.GetFileSizeString(2048 + 512));
            Assert.IsTrue(Util.GetFileSizeString(1024*1024) == "1.00 MB");
            Assert.IsTrue(Util.GetFileSizeString(1024 * 1024 * 2) == "2.00 MB");
            Assert.IsTrue(Util.GetFileSizeString(1024 * 1024 * 2 - 2) == "2.00 MB", Util.GetFileSizeString(1024 * 1024 * 2 - 2));
            Assert.IsTrue(Util.GetFileSizeString(1024 * 1024 * 1024) == "1.00 GB");
            Assert.IsTrue(Util.GetFileSizeString(1024L * 1024 * 1024 * 3 + 1024 * 1024 * 50) == "3.05 GB", Util.GetFileSizeString(1024L * 1024 * 1024 * 3 + 1024 * 1024 * 50));
        }

        [TestMethod]
        public void Util_Md5Test()
        {
            Assert.IsTrue(Util.GetMd5Str(null) == "D41D8CD98F00B204E9800998ECF8427E", Util.GetMd5Str(null));
            Assert.IsTrue(Util.GetMd5Str("") == "D41D8CD98F00B204E9800998ECF8427E", Util.GetMd5Str(""));
            Assert.IsTrue(Util.GetMd5Str(" ") == "7215EE9C7D9DC229D2921A40E899EC5F", Util.GetMd5Str(" "));
            Assert.IsTrue(Util.GetMd5Str("1") == "C4CA4238A0B923820DCC509A6F75849B", Util.GetMd5Str("1"));
            Assert.IsTrue(Util.GetMd5Str("123456") == "E10ADC3949BA59ABBE56E057F20F883E", Util.GetMd5Str("123456"));
            Assert.IsTrue(Util.GetMd5Str("abcABC") == "0ACE325545119AC99F35A58E04AC2DF1", Util.GetMd5Str("abcABC"));
            Assert.IsTrue(Util.GetMd5Str("ABCabc") == "54E8E33298F80D80DE23CFD6DEBC932B", Util.GetMd5Str("ABCabc"));
            Assert.IsTrue(Util.GetMd5Str("abcdefghijklmnopqrstuvwxyz1234567890") == "7F7D52A001B9D2C71B6BAE1F189F41F3", Util.GetMd5Str("abcdefghijklmnopqrstuvwxyz1234567890"));
            byte[] bytes = Encoding.UTF8.GetBytes("abcdefghijklmnopqrstuvwxyz1234567890");
            Assert.IsTrue(Util.GetMd5(null) == "D41D8CD98F00B204E9800998ECF8427E", Util.GetMd5(null));
            Assert.IsTrue(Util.GetMd5(bytes) == "7F7D52A001B9D2C71B6BAE1F189F41F3", Util.GetMd5(bytes));
            Assert.IsTrue(Util.GetMd5Str(null) == Util.GetMd5(null) && Util.GetMd5Str(null) == Util.GetMd5Str(""));
        }

    }
}
