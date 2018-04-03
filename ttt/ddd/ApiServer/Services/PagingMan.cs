using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiServer.Services
{
    public class PagingMan
    {
        public static void CheckParam(ref string search, ref int page, ref int pageSize)
        {
            if (string.IsNullOrEmpty(search))
                search = "";
            else
                search = search.Trim();
            if (page < 1)
                page = 1;
            if (pageSize < 1)
                pageSize = SiteConfig.Instance.Json.DefaultPageSize;
        }
    }
}
