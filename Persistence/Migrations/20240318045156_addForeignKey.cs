using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class addForeignKey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "From",
                table: "Notifications",
                newName: "Image");

            migrationBuilder.AddColumn<string>(
                name: "FromId",
                table: "Notifications",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_FromId",
                table: "Notifications",
                column: "FromId");

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_AspNetUsers_FromId",
                table: "Notifications",
                column: "FromId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_AspNetUsers_FromId",
                table: "Notifications");

            migrationBuilder.DropIndex(
                name: "IX_Notifications_FromId",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "FromId",
                table: "Notifications");

            migrationBuilder.RenameColumn(
                name: "Image",
                table: "Notifications",
                newName: "From");
        }
    }
}
