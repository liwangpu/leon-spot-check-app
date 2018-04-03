using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace ApiModel
{
    /// <summary>
    /// 供应商提供的产品
    /// </summary>
    public class Product : Asset
    {
        /// <summary>
        /// 规格
        /// </summary>
        public List<ProductSpec> Specifications { get; set; }

    }

    /// <summary>
    /// 产品规格
    /// </summary>
    public class ProductSpec
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Icon { get; set; }
        public string Mesh { get; set; }
        public string Description { get; set; }
        public string Materials { get; set; }

        /// <summary>
        /// 价格，单位为元
        /// </summary>
        public int Price { get; set; }
        /// <summary>
        /// 第三方ID，此产品在供应商自己的系统比如ERP的ID
        /// </summary>
        public string TPID { get; set; }
        
        /// <summary>
        /// 所在产品的ID
        /// </summary>
        public string ProductId { get; set; }
        [JsonIgnore]
        public Product Product { get; set; }
    }
}
