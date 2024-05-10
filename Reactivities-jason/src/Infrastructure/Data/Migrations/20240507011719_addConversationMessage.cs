using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Reactivities_jason.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class addConversationMessage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ConvesationsFiles_Messages_MessagesId",
                table: "ConvesationsFiles");

            migrationBuilder.DropIndex(
                name: "IX_ConvesationsFiles_MessagesId",
                table: "ConvesationsFiles");

            migrationBuilder.DropColumn(
                name: "MessagesId",
                table: "ConvesationsFiles");

            migrationBuilder.AddColumn<Guid>(
                name: "MessageId",
                table: "ConvesationsFiles",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_ConvesationsFiles_MessageId",
                table: "ConvesationsFiles",
                column: "MessageId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ConvesationsFiles_Messages_MessageId",
                table: "ConvesationsFiles",
                column: "MessageId",
                principalTable: "Messages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ConvesationsFiles_Messages_MessageId",
                table: "ConvesationsFiles");

            migrationBuilder.DropIndex(
                name: "IX_ConvesationsFiles_MessageId",
                table: "ConvesationsFiles");

            migrationBuilder.DropColumn(
                name: "MessageId",
                table: "ConvesationsFiles");

            migrationBuilder.AddColumn<Guid>(
                name: "MessagesId",
                table: "ConvesationsFiles",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ConvesationsFiles_MessagesId",
                table: "ConvesationsFiles",
                column: "MessagesId");

            migrationBuilder.AddForeignKey(
                name: "FK_ConvesationsFiles_Messages_MessagesId",
                table: "ConvesationsFiles",
                column: "MessagesId",
                principalTable: "Messages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
