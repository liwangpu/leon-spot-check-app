using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace ApiServer.Migrations
{
    public partial class modifyAccOpenId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Products_AccountId",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "OpenIds",
                table: "Accounts");

            migrationBuilder.AddColumn<string>(
                name: "OrganizationId",
                table: "Solutions",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OrganizationId",
                table: "Products",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OrganizationId",
                table: "Orders",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OrganizationId",
                table: "Layouts",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OrganizationId",
                table: "ClientAssets",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OrganizationId",
                table: "AssetFolders",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AccountOpenId",
                columns: table => new
                {
                    OpenId = table.Column<string>(type: "text", nullable: false),
                    AccountId = table.Column<string>(type: "text", nullable: true),
                    CreateTime = table.Column<DateTime>(type: "timestamp", nullable: false),
                    Platform = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AccountOpenId", x => x.OpenId);
                    table.ForeignKey(
                        name: "FK_AccountOpenId_Accounts_AccountId",
                        column: x => x.AccountId,
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Solutions_OrganizationId",
                table: "Solutions",
                column: "OrganizationId");

            migrationBuilder.CreateIndex(
                name: "IX_Products_AccountId",
                table: "Products",
                column: "AccountId");

            migrationBuilder.CreateIndex(
                name: "IX_Products_OrganizationId",
                table: "Products",
                column: "OrganizationId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_OrganizationId",
                table: "Orders",
                column: "OrganizationId");

            migrationBuilder.CreateIndex(
                name: "IX_Layouts_OrganizationId",
                table: "Layouts",
                column: "OrganizationId");

            migrationBuilder.CreateIndex(
                name: "IX_ClientAssets_OrganizationId",
                table: "ClientAssets",
                column: "OrganizationId");

            migrationBuilder.CreateIndex(
                name: "IX_AssetFolders_AccountId",
                table: "AssetFolders",
                column: "AccountId");

            migrationBuilder.CreateIndex(
                name: "IX_AssetFolders_OrganizationId",
                table: "AssetFolders",
                column: "OrganizationId");

            migrationBuilder.CreateIndex(
                name: "IX_AccountOpenId_AccountId",
                table: "AccountOpenId",
                column: "AccountId");

            migrationBuilder.AddForeignKey(
                name: "FK_AssetFolders_Accounts_AccountId",
                table: "AssetFolders",
                column: "AccountId",
                principalTable: "Accounts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_AssetFolders_Organizations_OrganizationId",
                table: "AssetFolders",
                column: "OrganizationId",
                principalTable: "Organizations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ClientAssets_Organizations_OrganizationId",
                table: "ClientAssets",
                column: "OrganizationId",
                principalTable: "Organizations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Layouts_Organizations_OrganizationId",
                table: "Layouts",
                column: "OrganizationId",
                principalTable: "Organizations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Organizations_OrganizationId",
                table: "Orders",
                column: "OrganizationId",
                principalTable: "Organizations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Organizations_OrganizationId",
                table: "Products",
                column: "OrganizationId",
                principalTable: "Organizations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Solutions_Organizations_OrganizationId",
                table: "Solutions",
                column: "OrganizationId",
                principalTable: "Organizations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AssetFolders_Accounts_AccountId",
                table: "AssetFolders");

            migrationBuilder.DropForeignKey(
                name: "FK_AssetFolders_Organizations_OrganizationId",
                table: "AssetFolders");

            migrationBuilder.DropForeignKey(
                name: "FK_ClientAssets_Organizations_OrganizationId",
                table: "ClientAssets");

            migrationBuilder.DropForeignKey(
                name: "FK_Layouts_Organizations_OrganizationId",
                table: "Layouts");

            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Organizations_OrganizationId",
                table: "Orders");

            migrationBuilder.DropForeignKey(
                name: "FK_Products_Organizations_OrganizationId",
                table: "Products");

            migrationBuilder.DropForeignKey(
                name: "FK_Solutions_Organizations_OrganizationId",
                table: "Solutions");

            migrationBuilder.DropTable(
                name: "AccountOpenId");

            migrationBuilder.DropIndex(
                name: "IX_Solutions_OrganizationId",
                table: "Solutions");

            migrationBuilder.DropIndex(
                name: "IX_Products_AccountId",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Products_OrganizationId",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Orders_OrganizationId",
                table: "Orders");

            migrationBuilder.DropIndex(
                name: "IX_Layouts_OrganizationId",
                table: "Layouts");

            migrationBuilder.DropIndex(
                name: "IX_ClientAssets_OrganizationId",
                table: "ClientAssets");

            migrationBuilder.DropIndex(
                name: "IX_AssetFolders_AccountId",
                table: "AssetFolders");

            migrationBuilder.DropIndex(
                name: "IX_AssetFolders_OrganizationId",
                table: "AssetFolders");

            migrationBuilder.DropColumn(
                name: "OrganizationId",
                table: "Solutions");

            migrationBuilder.DropColumn(
                name: "OrganizationId",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "OrganizationId",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "OrganizationId",
                table: "Layouts");

            migrationBuilder.DropColumn(
                name: "OrganizationId",
                table: "ClientAssets");

            migrationBuilder.DropColumn(
                name: "OrganizationId",
                table: "AssetFolders");

            migrationBuilder.AddColumn<string>(
                name: "OpenIds",
                table: "Accounts",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Products_AccountId",
                table: "Products",
                column: "AccountId",
                unique: true);
        }
    }
}
