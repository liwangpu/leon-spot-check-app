using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using ApiModel;

namespace ApiData
{
    public class ApiDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }

        public ApiDbContext(DbContextOptions options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

        }
    }
}
