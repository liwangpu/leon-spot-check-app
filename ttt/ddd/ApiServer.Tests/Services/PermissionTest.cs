using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Text;
using BambooCommon;
using BambooCore;

namespace ApiServer.Tests.Services
{
    [TestClass]
    public class PermissionTest
    {
        [TestMethod]
        public void Permission_Test()
        {
            Assert.IsTrue(Permission.ValueFromEnum(PermissionType.None) == 0);
            Assert.IsTrue(Permission.ValueFromEnum(PermissionType.Write) == 4);
            Assert.IsTrue(Permission.ValueFromEnum(PermissionType.ReadWrite) == 7);
            Assert.IsTrue(Permission.ValueFromEnum(PermissionType.All) == 31);

            Assert.IsFalse(Permission.CanRead(0L));
            Assert.IsTrue(Permission.CanRead(7));
            Assert.IsTrue(Permission.CanRead(31));
            Assert.IsFalse(Permission.CanRead(4));
            Assert.IsFalse(Permission.CanRead(25));

            Assert.IsFalse(Permission.CanRead(PermissionType.None));
            Assert.IsFalse(Permission.CanRead(PermissionType.Write));
            Assert.IsFalse(Permission.CanRead(PermissionType.Manage));
            Assert.IsFalse(Permission.CanWrite(PermissionType.ReadOnly));
            Assert.IsFalse(Permission.CanManage(PermissionType.ReadWriteDelete));


            Assert.IsTrue(Permission.CanWrite(PermissionType.ReadWrite));
            Assert.IsTrue(Permission.CanManage(PermissionType.All));
        }
    }
}
