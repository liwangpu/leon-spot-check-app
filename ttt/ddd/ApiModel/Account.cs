using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using BambooCommon;

namespace ApiModel
{
    /// <summary>
    /// 注册账号使用的对象模型
    /// </summary>
    public class RegisterAccountModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    /// <summary>
    /// 重置密码时使用的对象模型，这是忘记密码后在未登录的情况下重置密码用的
    /// </summary>
    public class ResetPasswordModel
    {
        public string Email { get; set; }
    }

    /// <summary>
    /// 设置新密码的对象模型，密码是加密后的版本，在登陆后才可使用
    /// </summary>
    public class NewPasswordModel
    {
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
    }

    /// <summary>
    /// 账号的摘要信息
    /// </summary>
    public class AccountProfileModel
    {
        public string Nickname { get; set; }
        public string Avatar { get; set; }
        public string Location { get; set; }
        public string Brief { get; set; }
    }

    /// <summary>
    /// 账号的完整信息
    /// </summary>
    public class Account : ListableEntity
    {
        public string Mail { get; set; }
        public string Password { get; set; }
        public string Phone { get; set; }
        public bool MailValid { get; set; }
        public bool PhoneValid { get; set; }
        public bool Frozened { get; set; }
        public string OrganizationId { get; set; }
        public string DepartmentId { get; set; }
        public string Location { get; set; }
        /// <summary>
        /// 账号类型，系统管理员，普通用户，供应商，设计公司等等
        /// </summary>
        public string Type { get; set; }
        /// <summary>
        /// 账号有效期，登陆时间小于这个有效期则无法登陆
        /// </summary>
        public DateTime ExpireTime { get; set; }
        /// <summary>
        /// 账号启用时间，如果当前登陆时间小于启用时间，则不能登陆。
        /// </summary>
        public DateTime ActivationTime { get; set; }

        [JsonIgnore]
        [InverseProperty("Owner")]
        public Organization Organization { get; set; }
        [JsonIgnore]
        public Department Department { get; set; }

        [JsonIgnore]
        public List<ClientAsset> ClientAssets { get; set; }
        [JsonIgnore]
        public List<Product> Products { get; set; }
        [JsonIgnore]
        public List<Solution> Solutions { get; set; }
        [JsonIgnore]
        public List<Layout> Layouts { get; set; }
        [JsonIgnore]
        public List<Order> Orders { get; set; }
        [JsonIgnore]
        public List<AssetFolder> Folders { get; set; }
        [JsonIgnore]
        public List<FileAsset> Files { get; set; }

        [JsonIgnore]
        public List<AccountOpenId> OpenIds { get; set; }


        /// <summary>
        /// 权限记录，记录能访问的所有类型资源的所有权限设置。不在此列出的则无法访问。
        /// </summary>
        [JsonIgnore]
        public List<PermissionItem> Permissions { get; set; }
    }


    /// <summary>
    /// 账号的第三方登陆信息
    /// </summary>
    public class AccountOpenId
    {
        [Key]
        /// <summary>
        /// 第三方平台的oauth openid，用来关联用户身份
        /// </summary>
        public string OpenId { get; set; }
        /// <summary>
        /// 平台名, google, facebook, qq, wechat等等
        /// </summary>
        public string Platform { get; set; }
        /// <summary>
        /// 创建绑定的时间
        /// </summary>
        public DateTime CreateTime { get; set; }

        public string AccountId { get; set; }
        public Account Account { get; set; }
    }

}
