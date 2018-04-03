using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace ApiServer.Migrations
{
    public partial class permission : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastLoginTime",
                table: "Accounts");

            migrationBuilder.RenameColumn(
                name: "UnlockTime",
                table: "Accounts",
                newName: "ActivationTime");

            migrationBuilder.AddColumn<string>(
                name: "Location",
                table: "Accounts",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "Accounts",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Permissions",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    AccountId = table.Column<string>(nullable: true),
                    Permission = table.Column<byte>(nullable: false),
                    ResId = table.Column<string>(nullable: true),
                    ResType = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Permissions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Permissions_Accounts_AccountId",
                        column: x => x.AccountId,
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Permissions_AccountId",
                table: "Permissions",
                column: "AccountId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Permissions");

            migrationBuilder.DropColumn(
                name: "Location",
                table: "Accounts");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Accounts");

            migrationBuilder.RenameColumn(
                name: "ActivationTime",
                table: "Accounts",
                newName: "UnlockTime");

            migrationBuilder.AddColumn<DateTime>(
                name: "LastLoginTime",
                table: "Accounts",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }
    }
}
