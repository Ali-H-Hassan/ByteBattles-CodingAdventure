using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ByteBattles.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddTestResults : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TestResults",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    TestId = table.Column<int>(type: "INTEGER", nullable: false),
                    UserId = table.Column<int>(type: "INTEGER", nullable: false),
                    Score = table.Column<decimal>(type: "TEXT", precision: 5, scale: 2, nullable: false),
                    McqCorrectCount = table.Column<int>(type: "INTEGER", nullable: false),
                    McqTotalCount = table.Column<int>(type: "INTEGER", nullable: false),
                    ProgrammingCorrect = table.Column<bool>(type: "INTEGER", nullable: false),
                    McqAnswers = table.Column<string>(type: "TEXT", maxLength: 2000, nullable: true),
                    ProgrammingAnswer = table.Column<string>(type: "TEXT", maxLength: 10000, nullable: true),
                    CompletedAt = table.Column<DateTime>(type: "TEXT", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TestResults", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TestResults_Tests_TestId",
                        column: x => x.TestId,
                        principalTable: "Tests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TestResults_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TestResults_TestId_UserId",
                table: "TestResults",
                columns: new[] { "TestId", "UserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TestResults_UserId",
                table: "TestResults",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TestResults");
        }
    }
}
