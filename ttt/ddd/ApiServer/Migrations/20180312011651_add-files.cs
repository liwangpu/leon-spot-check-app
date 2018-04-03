using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace ApiServer.Migrations
{
    public partial class addfiles : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "OrganizationId",
                table: "Files",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Files_OrganizationId",
                table: "Files",
                column: "OrganizationId");

            migrationBuilder.AddForeignKey(
                name: "FK_Files_Organizations_OrganizationId",
                table: "Files",
                column: "OrganizationId",
                principalTable: "Organizations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Files_Organizations_OrganizationId",
                table: "Files");

            migrationBuilder.DropIndex(
                name: "IX_Files_OrganizationId",
                table: "Files");

            migrationBuilder.DropColumn(
                name: "OrganizationId",
                table: "Files");
        }
    }
}
