using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Text;
using BambooCore;

namespace ApiServer.Tests.Services
{
    [TestClass]
    public class TimestampTest
    {
        [TestMethod]
        public void Timestamp_Test()
        {
            // unix stamp 是 1970年1月1日,0:00 GMT，格林尼治时间。也就是 UTC 统一协调时时间
            DateTime dateUtc = new DateTime(2018, 1, 29, 7, 53, 5); //1517212385  utc time 7 am, local time 15 pm.
            DateTime dateLocal = new DateTime(2018, 1, 29, 15, 53, 5); //1517212385  utc time 7 am, local time 15 pm.
            Assert.IsTrue(Timestamp.DateTimeToTimeStampUtc(dateUtc) == 1517212385, Timestamp.DateTimeToTimeStampUtc(dateUtc).ToString());
            Assert.IsTrue(Timestamp.TimeStampToDateTimeUtc(1517212385) == dateUtc, Timestamp.TimeStampToDateTimeUtc(1517212385).ToString());
            Assert.IsTrue(Timestamp.DateTimeToTimeStampUtc(dateUtc) == Timestamp.DateTimeToTimeStampLocal(dateLocal), Timestamp.DateTimeToTimeStampUtc(dateUtc).ToString());

            DateTime utcNow = DateTime.UtcNow;
            long ticks = utcNow.Ticks;
            long nUtcNow = (ticks - 621355968000000000) / 10000000;
            long myUtcNow = Timestamp.DateTimeToTimeStampUtc(new DateTime(ticks));
            Assert.IsTrue(myUtcNow == nUtcNow, $"nutcNow = {nUtcNow}, myutcNow={myUtcNow}");

            Assert.IsTrue(Timestamp.DateTimeToTimeStampUtc(new DateTime(ticks)) == Timestamp.DateTimeToTimeStampUtc(new DateTime(ticks, DateTimeKind.Utc)));
            Assert.IsTrue(Timestamp.DateTimeToTimeStampUtc(new DateTime(ticks)) == Timestamp.DateTimeToTimeStampLocal(new DateTime(ticks, DateTimeKind.Utc).ToLocalTime()));
        }
    }
}
