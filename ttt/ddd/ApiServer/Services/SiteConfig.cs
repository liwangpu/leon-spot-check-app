using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiServer.Services
{
    /// <summary>
    /// 整个站点的配置的管理。
    /// 配置分为 appsettings.json 里面的配置 和 存放在数据库Settings表中的配置
    /// 分别映射为 Json属性和setingsMap变量。
    /// </summary>
    public class SiteConfig
    {
        private static SiteConfig me = new SiteConfig();
        public static SiteConfig Instance { get { return me; } }

        public class JsonConfig
        {
            /// <summary>
            /// 本服务器的ID
            /// </summary>
            public int ServerId { get; set; }
            /// <summary>
            /// 生成token时的密钥
            /// </summary>
            public string TokenKey { get; set; }
            /// <summary>
            /// 生成GUID时的
            /// </summary>
            public string GuidSalt { get; set; }
            /// <summary>
            /// 生成的GUID最小长度，注意，如果数字太大，guid的长度会超过最小长度的预期。
            /// </summary>
            public int GuidMinLen { get; set; }
            /// <summary>
            /// 获取数据时，默认一页数据的数量
            /// </summary>
            public int DefaultPageSize { get; set; }
            /// <summary>
            /// token有效天数
            /// </summary>
            public int TokenValidDays { get; set; }
        }

        ConcurrentDictionary<string, string> settingsMap = new ConcurrentDictionary<string, string>();

        JsonConfig jsonConfig = new JsonConfig();

        public JsonConfig Json { get { return jsonConfig; } }

        public ConcurrentDictionary<string, string> DbSettings { get { return settingsMap; } }

        SiteConfig()
        {
        }

        public void Init(IConfiguration config)
        {
            jsonConfig.ServerId = config.GetValue<int>("ServerId");
            jsonConfig.TokenKey = config["TokenKey"];
            jsonConfig.GuidSalt = config["GuidSalt"];
            jsonConfig.GuidMinLen = config.GetValue<int>("GuidMinLen");
            jsonConfig.DefaultPageSize = config.GetValue<int>("DefaultPageSize");

            if (jsonConfig.TokenKey == null)
                jsonConfig.TokenKey = "apiserver's default secret key~~";
            if (jsonConfig.GuidSalt == null)
                jsonConfig.GuidSalt = "";
            if (jsonConfig.DefaultPageSize < 5)
                jsonConfig.DefaultPageSize = 5;
            if (jsonConfig.TokenValidDays < 7)
                jsonConfig.TokenValidDays = 7;
        }

        /// <summary>
        /// 从数据库重新加载全局设置
        /// </summary>
        public void ReloadSettingsFromDb(Data.ApiDbContext context)
        {
            settingsMap = new ConcurrentDictionary<string, string>();
            
            foreach (var item in context.Settings)
            {
                if (item == null || string.IsNullOrEmpty(item.Key))
                    continue;
                settingsMap[item.Key] = item.Value;
            }
        }

        /// <summary>
        /// 从内存缓存中获取指定的设置项
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public string GetItem(string key)
        {
            string value = "";
            settingsMap.TryGetValue(key, out value);
            return value;
        }

        /// <summary>
        /// 保存设置
        /// </summary>
        /// <param name="key"></param>
        /// <param name="value"></param>
        /// <param name="context"></param>
        public void SetItem(string key, string value, Data.ApiDbContext context)
        {
            settingsMap[key] = value;
            //save to db
            var item = context.Settings.Find(key);
            if(item == null)
            {
                item = new ApiModel.SettingsItem();
                item.Key = key;
                item.Value = value;
                context.Settings.Add(item);
            }
            else
            {
                item.Value = value;
            }

            context.SaveChangesAsync();
        }

        public void SetItem<T>(string key, T value, Data.ApiDbContext context) where T : class
        {
            string vs = Newtonsoft.Json.JsonConvert.SerializeObject(value);
            SetItem(key, vs, context);
        }

        public bool DeleteItem(string key, Data.ApiDbContext context)
        {
            string value;
            settingsMap.Remove(key, out value);
            var item = context.Settings.Find(key);
            if (item == null)
                return false;
            
            context.Settings.Remove(item);
            context.SaveChangesAsync();

            return true;
        }

        public bool GetItem(string key, out bool v)
        {
            string vs = "";
            settingsMap.TryGetValue(key, out vs);
            return bool.TryParse(vs, out v);
        }
        public bool GetItem(string key, out int v)
        {
            string vs = "";
            settingsMap.TryGetValue(key, out vs);
            return int.TryParse(vs, out v);
        }
        public bool GetItem(string key, out long v)
        {
            string vs = "";
            settingsMap.TryGetValue(key, out vs);
            return long.TryParse(vs, out v);
        }
        public bool GetItem(string key, out double v)
        {
            string vs = "";
            settingsMap.TryGetValue(key, out vs);
            return double.TryParse(vs, out v);
        }
        public bool GetItem<T>(string key, out T v) where T : class
        {
            string vs = "";
            settingsMap.TryGetValue(key, out vs);
            v = Newtonsoft.Json.JsonConvert.DeserializeObject<T>(vs);
            return (v != null);
        }
    }
}
