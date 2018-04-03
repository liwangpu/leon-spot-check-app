using System;
using System.Collections.Generic;
using System.Text;

namespace BambooCommon
{

    /// <summary>
    /// 管理后台的导航菜单配置数据
    /// </summary>
    public class NavigationModel
    {
        public List<NavigationItem> model { get; set; }
    }

    /// <summary>
    /// 管理后台的导航菜单的一个条目，可以有多重子节点，构成树形菜单
    /// </summary>
    public class NavigationItem
    {
        /// <summary>
        /// 所有菜单里面唯一的字符串即可
        /// </summary>
        public string id { get; set; }
        /// <summary>
        /// 标题，为了配合多语言，这里可以写成翻译值。
        /// </summary>
        public string title { get; set; }
        /// <summary>
        /// 菜单的类型，可以为 group / item / collapse.  group为大分类，item为单个， collapse为文件夹
        /// </summary>
        public string type { get; set; }
        /// <summary>
        /// icon 为图标字体的内容。比如 chat, email, account_box, check_box, alerm. 也可以为空
        /// </summary>
        public string icon { get; set; }
        /// <summary>
        /// 内部导航路径，比如 /pages/auth/login， /apps/dashboards/project 
        /// </summary>
        public string url { get; set; }
        /// <summary>
        /// 徽章，也就是消息数量提醒用。可以为null。
        /// </summary>
        public NavigationItemBadge badge { get; set; }
        /// <summary>
        /// 子菜单,可以为null
        /// </summary>
        public List<NavigationItem> children { get; set; }
    }

    /// <summary>
    /// 管理后台的导航菜单条目的徽章，一般用于显示消息条数。比如一个红圈里面白色的20，表示还有20条通知
    /// </summary>
    public class NavigationItemBadge
    {
        /// <summary>
        /// 文字
        /// </summary>
        public int title { get; set; }
        /// <summary>
        /// 背景色
        /// </summary>
        public string bg { get; set; }
        /// <summary>
        /// 文字颜色
        /// </summary>
        public string fg { get; set; }
    }

}
