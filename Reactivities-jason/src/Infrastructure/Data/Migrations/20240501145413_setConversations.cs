using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Reactivities_jason.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class setConversations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ConversationsParticipants_UserId",
                table: "ConversationsParticipants");

            migrationBuilder.CreateIndex(
                name: "IX_ConversationsParticipants_UserId",
                table: "ConversationsParticipants",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ConversationsParticipants_UserId",
                table: "ConversationsParticipants");

            migrationBuilder.CreateIndex(
                name: "IX_ConversationsParticipants_UserId",
                table: "ConversationsParticipants",
                column: "UserId",
                unique: true);
        }
    }
}
