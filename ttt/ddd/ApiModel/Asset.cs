using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;
using BambooCommon;

namespace ApiModel
{
    /// <summary>
    /// 资源，用户拥有的所有东东都叫资源，从3d模型到设计方案
    /// 文件夹和分类的问题，所有的资源都可以同时设置文件夹和分类，但是分类一般只用于物品和材质，用在风格替换上。文件夹则是更通用灵活的管理资源的方式。
    /// </summary>
    public class Asset : ListableEntity
    {
        public string FolderId { get; set; }
        public string CategoryId { get; set; }

        public string AccountId { get; set; }
        [JsonIgnore]
        public Account Account { get; set; }
    }

    /// <summary>
    /// 每种资源的文件夹结构，文件夹用来给用户自由的管理资源。比如说户型和方案可以让用户自由的管理文件夹结构。
    /// </summary>
    public class AssetFolder : ListableEntity
    {
        public string AccountId { get; set; }
        /// <summary>
        /// 资源类型，比如Mesh,Material,Texture, Layout, Solution
        /// </summary>
        public string Type { get; set; }

        public string ParentId { get; set; }
    }

    /// <summary>
    /// 资源分类，跟文件夹一样的结构和作用，但用作更严肃的地方，比如风格切换，套餐之类的，一般用在产品和材质上。描述，沙发，单人沙发，桌子，椅子这种分类。
    /// </summary>
    public class AssetCategory : ListableEntity
    {
        public string AccountId { get; set; }
        /// <summary>
        /// 资源类型，比如Mesh,Material,Texture, Layout, Solution
        /// </summary>
        public string Type { get; set; }

        public string ParentId { get; set; }
    }

    /// <summary>
    /// 资源的标签
    /// </summary>
    public class AssetTag : ListableEntity
    {
        public string AccountId { get; set; }
        /// <summary>
        /// 资源类型，比如Mesh,Material,Texture, Layout, Solution
        /// </summary>
        public string Type { get; set; }
    }

    /// <summary>
    /// 客户端使用的资源
    /// </summary>
    public class ClientAsset : Asset
    {
        /// <summary>
        /// 原始文件路径
        /// </summary>
        public string SrcFileUrl { get; set; }
        /// <summary>
        /// 原始文件md5
        /// </summary>
        public string SrcFileMd5 { get; set; }
        /// <summary>
        /// 原始文件上传时本地路径
        /// </summary>
        public string SrcFileLocalPath { get; set; }
        /// <summary>
        /// 资源上传时间
        /// </summary>
        public string UploadTime { get; set; }
        /// <summary>
        /// 客户端使用的资源文件路径，内容为json对象的字符串形式。 { "ue418":"http://xxx.com/xx", "ue418_md5": "xx", "baby":"xx", "baby_md5":"xx" }
        /// </summary>
        public string ClientFiles { get; set; }
        /// <summary>
        /// 资源类型, Mesh, Material, Texture，蓝图类名等等
        /// </summary>
        public string ClassName { get; set; }
        /// <summary>
        /// 专有属性，通过json字符串的方式存储对象或者key-value对。{ "property1": 123, "property2":"value2" }
        /// </summary>
        public string Properties { get; set; }
    }
    

    public class FileAsset : Asset
    {
        /// <summary>
        /// 原始文件路径
        /// </summary>
        public string Url { get; set; }
        /// <summary>
        /// 原始文件md5
        /// </summary>
        public string Md5 { get; set; }
        /// <summary>
        /// 文件大小
        /// </summary>
        public long Size { get; set; }
        /// <summary>
        /// 扩展名，比如.jpg, .png, .fbx
        /// </summary>
        public string FileExt { get; set; }
        /// <summary>
        /// 原始文件上传时本地路径
        /// </summary>
        public string LocalPath { get; set; }
        /// <summary>
        /// 资源上传时间
        /// </summary>
        public string UploadTime { get; set; }
    }
    
}
