using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Text;
using BambooCore;

namespace ApiServer.Tests.Services
{
    [TestClass]
    public class BitsetTest
    {
        [TestMethod]
        public void Bitset_Test()
        {
            //位 7654 3210
            //值 1001 1010
            ulong value = 2147483802; //2147483802 ‭10000000000000000000000010011010‬
            Assert.AreEqual(false, Bitset.GetBit(value, 0));
            Assert.AreEqual(true, Bitset.GetBit(value, 1));
            Assert.AreEqual(true, Bitset.GetBit(value, 4));
            Assert.AreEqual(true, Bitset.GetBit(value, 7));
            //index out of range
            Assert.AreEqual(false, Bitset.GetBit(value, 63));
            Assert.AreEqual(false, Bitset.GetBit(value, 64));
            Assert.AreEqual(false, Bitset.GetBit(value, 255));

            //set
            Bitset.SetBit(ref value, 5);// ‭2147483834‬ ‭10000000000000000000000010111010‬
            Assert.IsTrue(value == 2147483834);
            Assert.AreEqual(true, Bitset.GetBit(value, 5));

            //clear
            Bitset.ClearBit(ref value, 5);
            Assert.IsTrue(value == 2147483802);
            Assert.AreEqual(false, Bitset.GetBit(value, 5));


            //obj 
            Bitset bb = new Bitset(2147483802);
            Assert.AreEqual(false, bb.GetBit(0));
            Assert.AreEqual(true, bb.GetBit(1));
            Assert.AreEqual(true, bb.GetBit(4));
            Assert.AreEqual(true, bb.GetBit(7));
            //index out of range
            Assert.AreEqual(false, bb.GetBit(63));
            Assert.AreEqual(false, bb.GetBit(64));
            Assert.AreEqual(false, bb.GetBit(255));
            //set
            bb.SetBit(5);// ‭2147483834‬ ‭10000000000000000000000010111010‬
            Assert.IsTrue(bb.Value == 2147483834);
            Assert.AreEqual(true, bb.GetBit(5));

            //clear
            bb.ClearBit(5);
            Assert.IsTrue(bb.Value == 2147483802);
            Assert.AreEqual(false, bb.GetBit(5));
        }

        [TestMethod]
        public void Bitset_Test8()
        {
            //位 7654 3210
            //值 1001 1010
            byte value = 154; // 154 1001 1010
            Assert.AreEqual(false, Bitset8.GetBit(value, 0));
            Assert.AreEqual(true, Bitset8.GetBit(value, 1));
            Assert.AreEqual(true, Bitset8.GetBit(value, 4));
            Assert.AreEqual(true, Bitset8.GetBit(value, 7));
            //index out of range
            Assert.AreEqual(false, Bitset8.GetBit(value, 8));
            Assert.AreEqual(false, Bitset8.GetBit(value, 255));

            //set
            Bitset8.SetBit(ref value, 5);// 186 1011 1010
            Assert.IsTrue(value == 186);
            Assert.AreEqual(true, Bitset8.GetBit(value, 5));

            //clear
            Bitset8.ClearBit(ref value, 5);
            Assert.IsTrue(value == 154);
            Assert.AreEqual(false, Bitset8.GetBit(value, 5));

            value = 154; // 154 1001 1010
            Bitset8.ReverseBit(ref value, 5); // 186 1011 1010
            Assert.IsTrue(value == 186);
            Assert.AreEqual(true, Bitset8.GetBit(value, 5));

            Bitset8.ReverseBit(ref value, 5);// 154 1001 1010
            Assert.IsTrue(value == 154);
            Assert.AreEqual(false, Bitset8.GetBit(value, 5));


            //obj 
            Bitset8 bb = new Bitset8(154);
            Assert.AreEqual(false, bb.GetBit(0));
            Assert.AreEqual(true, bb.GetBit(1));
            Assert.AreEqual(true, bb.GetBit(4));
            Assert.AreEqual(true, bb.GetBit(7));
            //index out of range
            Assert.AreEqual(false, bb.GetBit(8));
            Assert.AreEqual(false, bb.GetBit(255));

            //set
            bb.SetBit(5);// 186 1011 1010
            Assert.IsTrue(bb.Value == 186);
            Assert.AreEqual(true, bb.GetBit(5));

            //clear
            bb.ClearBit(5);
            Assert.IsTrue(bb.Value == 154);
            Assert.AreEqual(false, bb.GetBit(5));

            value = 154; // 154 1001 1010
            bb.ReverseBit(5); // 186 1011 1010
            Assert.IsTrue(bb.Value == 186);
            Assert.AreEqual(true, bb.GetBit(5));

            bb.ReverseBit(5);// 154 1001 1010
            Assert.IsTrue(bb.Value == 154);
            Assert.AreEqual(false, bb.GetBit(5));
        }

        [TestMethod]
        public void Bitset_Test16()
        {
            //位 7654 3210
            //值 1001 1010
            ushort value = 32922; // 32922 ‭‭1000000010011010‬‬
            Assert.AreEqual(false, Bitset16.GetBit(value, 0));
            Assert.AreEqual(true, Bitset16.GetBit(value, 1));
            Assert.AreEqual(true, Bitset16.GetBit(value, 4));
            Assert.AreEqual(true, Bitset16.GetBit(value, 7));
            Assert.AreEqual(true, Bitset16.GetBit(value, 15));
            //index out of range
            Assert.AreEqual(false, Bitset16.GetBit(value, 16));
            Assert.AreEqual(false, Bitset16.GetBit(value, 255));

            //set
            Bitset16.SetBit(ref value, 5);// 32954 ‭‭1000000010111010‬‬
            Assert.IsTrue(value == 32954);
            Assert.AreEqual(true, Bitset16.GetBit(value, 5));

            //clear
            Bitset16.ClearBit(ref value, 5);
            Assert.IsTrue(value == 32922);
            Assert.AreEqual(false, Bitset16.GetBit(value, 5));


            //obj 
            Bitset16 bb = new Bitset16(32922);
            Assert.AreEqual(false, bb.GetBit(0));
            Assert.AreEqual(true, bb.GetBit(1));
            Assert.AreEqual(true, bb.GetBit(4));
            Assert.AreEqual(true, bb.GetBit(7));
            Assert.AreEqual(true, bb.GetBit(15));
            //index out of range
            Assert.AreEqual(false, bb.GetBit(16));
            Assert.AreEqual(false, bb.GetBit(255));

            //set
            bb.SetBit(5);// 32954 ‭‭1000000010111010‬‬
            Assert.IsTrue(bb.Value == 32954);
            Assert.AreEqual(true, bb.GetBit(5));

            //clear
            bb.ClearBit(5);
            Assert.IsTrue(bb.Value == 32922);
            Assert.AreEqual(false, bb.GetBit(5));
        }

        [TestMethod]
        public void Bitset_Test32()
        {
            //位 7654 3210
            //值 1001 1010
            uint value = 2147483802; // 2147483802 ‭10000000000000000000000010011010‬
            Assert.AreEqual(false, Bitset32.GetBit(value, 0));
            Assert.AreEqual(true, Bitset32.GetBit(value, 1));
            Assert.AreEqual(true, Bitset32.GetBit(value, 4));
            Assert.AreEqual(true, Bitset32.GetBit(value, 7));
            Assert.AreEqual(true, Bitset32.GetBit(value, 31));
            //index out of range
            Assert.AreEqual(false, Bitset32.GetBit(value, 32));
            Assert.AreEqual(false, Bitset32.GetBit(value, 255));

            //set
            Bitset32.SetBit(ref value, 5);// 2147483834 ‭10000000000000000000000010111010‬
            Assert.IsTrue(value == 2147483834);
            Assert.AreEqual(true, Bitset32.GetBit(value, 5));

            //clear
            Bitset32.ClearBit(ref value, 5);
            Assert.IsTrue(value == 2147483802);
            Assert.AreEqual(false, Bitset32.GetBit(value, 5));


            //obj 
            Bitset32 bb = new Bitset32(2147483802);
            Assert.AreEqual(false, bb.GetBit(0));
            Assert.AreEqual(true, bb.GetBit(1));
            Assert.AreEqual(true, bb.GetBit(4));
            Assert.AreEqual(true, bb.GetBit(7));
            Assert.AreEqual(true, bb.GetBit(31));
            //index out of range
            Assert.AreEqual(false, bb.GetBit(32));
            //Assert.AreEqual(false, bb.GetBit(255));

            //set
            bb.SetBit(5);// 2147483834 ‭10000000000000000000000010111010‬
            Assert.IsTrue(bb.Value == 2147483834);
            Assert.AreEqual(true, bb.GetBit(5));

            //clear
            bb.ClearBit(5);
            Assert.IsTrue(bb.Value == 2147483802);
            Assert.AreEqual(false, bb.GetBit(5));
        }

        [TestMethod]
        public void Bitset_TestObj()
        {
            Bitset8 bb = new Bitset8();
            Assert.IsTrue(bb.Value == 0);
            Assert.AreEqual(false, bb.GetBit(0));
            Assert.AreEqual(false, bb.GetBit(7));

            //index out of range
            Assert.AreEqual(false, bb.GetBit(8));
            Assert.AreEqual(false, bb.GetBit(255));

            bb.ClearBit(1);
            Assert.AreEqual(false, bb.GetBit(1));

            bb.SetBit(2);
            Assert.AreEqual(4, bb.Value); // 0100
            Assert.AreEqual(true, bb.GetBit(2));
            bb.SetBit(3);
            Assert.IsTrue(bb.Value == 12); // 1100
            Assert.AreEqual(true, bb.GetBit(2));
            Assert.AreEqual(true, bb.GetBit(3));

            bb.ClearBit(2);
            bb.ClearBit(3);
            Assert.IsTrue(bb.Value == 0);
            Assert.AreEqual(false, bb.GetBit(2));
            Assert.AreEqual(false, bb.GetBit(3));

        }
    }
}
