using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using BambooCommon;
using Microsoft.EntityFrameworkCore;

namespace BambooCore.Services
{
    public class PermissionMan<T> where T : EntityBase
    {
        string accid;
        DbContext context;

        public PermissionMan(string accid, DbContext context)
        {
            this.accid = accid;
            this.context = context;            
        }

        public IQueryable<PermissionItem> GetPermissons(string accid)
        {
            return context.Set<PermissionItem>().Where(d => d.AccountId == accid);
        }
        public IQueryable<T> GetDataSet(string accid)
        {
            var dataSet = context.Set<T>();
            var permissionSet = GetPermissons(accid);
            var tempset = from d in dataSet join p in permissionSet on d.Id equals p.ResId select d;
            return tempset;
        }
        
    }
}
