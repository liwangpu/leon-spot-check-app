using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using BambooCommon;

namespace ApiModel
{
    /// <summary>
    /// 组织机构
    /// </summary>
    public class Organization : ListableEntity
    {
        /// <summary>
        /// 父级组织的ID
        /// </summary>
        [JsonIgnore]
        public string ParentId { get; set; }
        /// <summary>
        /// 父级组织
        /// </summary>
        [JsonIgnore]
        public Organization Parent { get; set; }

        /// <summary>
        /// 拥有者ID，反向引用
        /// </summary>
        public string OwnerId { get; set; }
        /// <summary>
        /// 拥有者，反向引用
        /// </summary>
        [JsonIgnore]
        [InverseProperty("Organization")]
        [ForeignKey("OwnerId")]
        public Account Owner { get; set; }

        /// <summary>
        /// 部门
        /// </summary>
        [JsonIgnore]
        public List<Department> Departments { get; set; }

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
    }

    /// <summary>
    /// 组织机构的部门
    /// </summary>
    public class Department : ListableEntity
    {
        public string ParentId { get; set; }
        [JsonIgnore]
        public Department Parent { get; set; }

        public string OrganizationId { get; set; }
        [JsonIgnore]
        public Organization Organization { get; set; }

        [JsonIgnore]
        public List<OrganMember> Members { get; set; }
    }

    /// <summary>
    /// 组织内（部门）的成员信息
    /// </summary>
    public class OrganMember
    {
        public string Id { get; set; }
        public string AccountId { get; set; }
        
        public string OrganizationId { get; set; }
        [JsonIgnore]
        public Organization Organization { get; set; }
        
        public string DepartmentId { get; set; }
        [JsonIgnore]
        public Department Department { get; set; }

        public DateTime JoinOrganTime { get; set; }
        public DateTime JoinDepartmentTime { get; set; }

        public string Role { get; set; }

        [JsonIgnore]
        public Account Account { get; set; }
    }


}
