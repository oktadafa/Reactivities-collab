using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class EditNotificationModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_AspNetUsers_ToId",
                table: "Notifications");

            migrationBuilder.DropIndex(
                name: "IX_Notifications_ToId",
                table: "Notifications");

            migrationBuilder.RenameColumn(
                name: "Image",
                table: "Notifications",
                newName: "type");

            migrationBuilder.AddColumn<string>(
                name: "AppUserId",
                table: "Notifications",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_AppUserId",
                table: "Notifications",
                column: "AppUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_AspNetUsers_AppUserId",
                table: "Notifications",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_AspNetUsers_AppUserId",
                table: "Notifications");

            migrationBuilder.DropIndex(
                name: "IX_Notifications_AppUserId",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "AppUserId",
                table: "Notifications");

            migrationBuilder.RenameColumn(
                name: "type",
                table: "Notifications",
                newName: "Image");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_ToId",
                table: "Notifications",
                column: "ToId");

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_AspNetUsers_ToId",
                table: "Notifications",
                column: "ToId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
