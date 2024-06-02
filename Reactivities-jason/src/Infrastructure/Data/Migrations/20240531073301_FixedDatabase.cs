using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Reactivities_jason.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class FixedDatabase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppTokens");

            migrationBuilder.DropColumn(
                name: "ExpireBearerToken",
                table: "AspNetUsers");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ExpireBearerToken",
                table: "AspNetUsers",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "AppTokens",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    nameSetting = table.Column<string>(type: "text", nullable: true),
                    values = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppTokens", x => x.id);
                });
        }
    }
}
