using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;
using BambooCommon;

namespace ApiModel
{
    public class Order : ListableEntity
    {
        public string AccountId { get; set; }
        public string State { get; set; }
        public DateTime StateTime { get; set; }
        /// <summary>
        /// 子订单列表，由多个订单id用分号分隔而成
        /// </summary>
        public string ChildOrders { get; set; }
        /// <summary>
        /// 订单内容, 内容为OrderContent对象的json字符串
        /// </summary>
        public string Content { get; set; }
        
        public List<OrderStateItem> OrderStates { get; set; }
        [JsonIgnore]
        public Account Account { get; set; }
    }

    public class OrderStateItem
    {
        public string Id { get; set; }
        public string OldState { get; set; }
        public string NewState { get; set; }
        public string OperatorAccount { get; set; }
        public DateTime OperateTime { get; set; }
        public string Reason { get; set; }
        public string Detail { get; set; }


        [JsonIgnore]
        public string OrderId { get; set; }
        [JsonIgnore]
        public Order Order { get; set; }

        [JsonIgnore]
        public string SolutionId { get; set; }
        [JsonIgnore]
        public Solution Solution { get; set; }
    }

    public class OrderContent
    {
        public List<OrderContentItem> Items { get; set; }
        public int TotalPrice { get; set; }
        public string Remark { get; set; }
    }

    public class OrderContentItem
    {
        public string Name { get; set; }
        public string ProductId { get; set; }
        public int Num { get; set; }
        public int UnitPrice { get; set; }
        public int TotalPrice { get; set; }
        public string Remark { get; set; }
    }
}
