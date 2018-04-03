using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace ApiServer.Migrations
{
    public partial class EntityBase : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Avartar",
                table: "Organizations");

            migrationBuilder.DropColumn(
                name: "Bio",
                table: "Organizations");

            migrationBuilder.DropColumn(
                name: "Avartar",
                table: "Department");

            migrationBuilder.DropColumn(
                name: "Avatar",
                table: "Accounts");

            migrationBuilder.DropColumn(
                name: "Bio",
                table: "Accounts");

            migrationBuilder.DropColumn(
                name: "Nickname",
                table: "Accounts");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreateTime",
                table: "Solutions",
                type: "timestamp",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifyTime",
                table: "Solutions",
                type: "timestamp",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "CreateTime",
                table: "Skirtings",
                type: "timestamp",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifyTime",
                table: "Skirtings",
                type: "timestamp",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "CreateTime",
                table: "Products",
                type: "timestamp",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifyTime",
                table: "Products",
                type: "timestamp",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Organizations",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Icon",
                table: "Organizations",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifyTime",
                table: "Organizations",
                type: "timestamp",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Orders",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Icon",
                table: "Orders",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifyTime",
                table: "Orders",
                type: "timestamp",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "CreateTime",
                table: "Layouts",
                type: "timestamp",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifyTime",
                table: "Layouts",
                type: "timestamp",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "CreateTime",
                table: "Department",
                type: "timestamp",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Icon",
                table: "Department",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifyTime",
                table: "Department",
                type: "timestamp",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "CreateTime",
                table: "ClientAssets",
                type: "timestamp",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifyTime",
                table: "ClientAssets",
                type: "timestamp",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifyTime",
                table: "AssetTags",
                type: "timestamp",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "CreateTime",
                table: "AssetFolders",
                type: "timestamp",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "AssetFolders",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifyTime",
                table: "AssetFolders",
                type: "timestamp",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "CreateTime",
                table: "AssetCategories",
                type: "timestamp",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "AssetCategories",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifyTime",
                table: "AssetCategories",
                type: "timestamp",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Accounts",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Icon",
                table: "Accounts",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifyTime",
                table: "Accounts",
                type: "timestamp",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Accounts",
                type: "text",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreateTime",
                table: "Solutions");

            migrationBuilder.DropColumn(
                name: "ModifyTime",
                table: "Solutions");

            migrationBuilder.DropColumn(
                name: "CreateTime",
                table: "Skirtings");

            migrationBuilder.DropColumn(
                name: "ModifyTime",
                table: "Skirtings");

            migrationBuilder.DropColumn(
                name: "CreateTime",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "ModifyTime",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Organizations");

            migrationBuilder.DropColumn(
                name: "Icon",
                table: "Organizations");

            migrationBuilder.DropColumn(
                name: "ModifyTime",
                table: "Organizations");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "Icon",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "ModifyTime",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "CreateTime",
                table: "Layouts");

            migrationBuilder.DropColumn(
                name: "ModifyTime",
                table: "Layouts");

            migrationBuilder.DropColumn(
                name: "CreateTime",
                table: "Department");

            migrationBuilder.DropColumn(
                name: "Icon",
                table: "Department");

            migrationBuilder.DropColumn(
                name: "ModifyTime",
                table: "Department");

            migrationBuilder.DropColumn(
                name: "CreateTime",
                table: "ClientAssets");

            migrationBuilder.DropColumn(
                name: "ModifyTime",
                table: "ClientAssets");

            migrationBuilder.DropColumn(
                name: "ModifyTime",
                table: "AssetTags");

            migrationBuilder.DropColumn(
                name: "CreateTime",
                table: "AssetFolders");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "AssetFolders");

            migrationBuilder.DropColumn(
                name: "ModifyTime",
                table: "AssetFolders");

            migrationBuilder.DropColumn(
                name: "CreateTime",
                table: "AssetCategories");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "AssetCategories");

            migrationBuilder.DropColumn(
                name: "ModifyTime",
                table: "AssetCategories");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Accounts");

            migrationBuilder.DropColumn(
                name: "Icon",
                table: "Accounts");

            migrationBuilder.DropColumn(
                name: "ModifyTime",
                table: "Accounts");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Accounts");

            migrationBuilder.AddColumn<string>(
                name: "Avartar",
                table: "Organizations",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Bio",
                table: "Organizations",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Avartar",
                table: "Department",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Avatar",
                table: "Accounts",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Bio",
                table: "Accounts",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Nickname",
                table: "Accounts",
                nullable: true);
        }
    }
}
