using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace ApiServer.Migrations
{
    public partial class permissionIndex : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Permissions_AccountId",
                table: "Permissions");

            migrationBuilder.CreateIndex(
                name: "IX_Permissions_AccountId_ResId_ResType",
                table: "Permissions",
                columns: new[] { "AccountId", "ResId", "ResType" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Permissions_AccountId_ResId_ResType",
                table: "Permissions");

            migrationBuilder.CreateIndex(
                name: "IX_Permissions_AccountId",
                table: "Permissions",
                column: "AccountId");
        }
    }
}
