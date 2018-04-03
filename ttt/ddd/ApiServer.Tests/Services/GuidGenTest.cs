using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Text;
using BambooCore;

namespace ApiServer.Tests.Services
{
    [TestClass]
    public class GuidGenTest
    {
        [TestMethod]
        public void GuidGen_UseBeforeInitTest()
        {
            string s = GuidGen.NewGUID();
            string s2 = GuidGen.NewGUID();
            int serverId = 0;
            long key = 0;
            DateTime createTime;
            key = GuidGen.DecryptGUID(s, out serverId, out createTime);
            DateTime utcNow = DateTime.UtcNow;
            Assert.IsTrue(serverId == 0, "server id == 0, when call newid before guidgen inited.");
            Assert.IsTrue((utcNow - createTime).TotalSeconds < 1, "create time should be correct");
        }

        [TestMethod]
        public void GuidGen_MultiInitTest()
        {
            int serverIdExpect = 0;
            int serverId = 0;
            long key = 0;
            DateTime createTime;

            //init by id 2;
            serverIdExpect = 2;
            GuidGen.Init(serverIdExpect, "ABCDEFG", 6);
            string s1 = GuidGen.NewGUID();
            key = GuidGen.DecryptGUID(s1, out serverId, out createTime);
            DateTime utcNow = DateTime.UtcNow;
            Assert.IsTrue(serverId == serverIdExpect, $"server id == {serverId}, not expected {serverIdExpect}");
            Assert.IsTrue((utcNow - createTime).TotalSeconds < 1, "create time should be correct");


            //init by id 66;
            serverIdExpect = 66;
            GuidGen.Init(serverIdExpect, "ABCDEFG", 6);
            string s2 = GuidGen.NewGUID();
            key = GuidGen.DecryptGUID(s2, out serverId, out createTime);
            utcNow = DateTime.UtcNow;
            Assert.IsTrue(serverId == serverIdExpect, $"server id == {serverId}, not expected {serverIdExpect}");
            Assert.IsTrue((utcNow - createTime).TotalSeconds < 1, "create time should be correct");
        }

        [TestMethod]
        public void GuidGen_Run100000TimesTest()
        {
            HashSet<string> ids = new HashSet<string>();

            for (int i = 0; i < 100000; i++)
            {
                string s = GuidGen.NewGUID();
                Assert.IsTrue(ids.Contains(s) == false, "repeated guid found!!");
                ids.Add(s);
            }
        }

        [TestMethod]
        public void GuidGen_SaltTest()
        {
            int serverIdExpect = 0;
            int serverId = 0;
            long key = 0;
            DateTime createTime;

            //init by id 2, salt A>a;
            serverIdExpect = 2;
            GuidGen.Init(serverIdExpect, "ABCDEFGHIJKLabcdefghijkl", 8);
            string s1 = GuidGen.NewGUID();
            key = GuidGen.DecryptGUID(s1, out serverId, out createTime);
            DateTime utcNow = DateTime.UtcNow;
            Assert.IsTrue(serverId == serverIdExpect, $"server id == {serverId}, not expected {serverIdExpect}");
            Assert.IsTrue((utcNow - createTime).TotalSeconds < 1, "create time should be correct");

            //init by same id, salt a>A;
            GuidGen.Init(serverIdExpect, "abcdefghijklABCDEFGHIJKL", 8);
            key = GuidGen.DecryptGUID(s1, out serverId, out createTime);
            Assert.IsTrue(serverId == 0, $"server id == {serverId}, but should be 0 here, cos salt differnt");


            //init by same id, salt a>A;
            GuidGen.Init(serverIdExpect, "BACDEFGHIJKLabcdefghijkl", 8);
            key = GuidGen.DecryptGUID(s1, out serverId, out createTime);
            Assert.IsTrue(serverId == 0, $"server id == {serverId}, but should be 0 here, cos salt differnt");
        }
    }
}
