using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Reactivities_jason.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class addCityACtivity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "Activities",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "City",
                table: "Activities");
        }
    }
}
