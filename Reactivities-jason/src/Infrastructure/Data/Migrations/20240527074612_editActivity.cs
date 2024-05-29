using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Reactivities_jason.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class editActivity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "isPrivate",
                table: "Activities");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "isPrivate",
                table: "Activities",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }
    }
}
