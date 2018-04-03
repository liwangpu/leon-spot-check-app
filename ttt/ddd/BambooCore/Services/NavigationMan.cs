using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using BambooCommon;

namespace BambooCore.Services
{


    public class NavigationMan
    {
        DbContext context;

        public NavigationMan(DbContext context)
        {
            this.context = context;
        }
        
    }
}
