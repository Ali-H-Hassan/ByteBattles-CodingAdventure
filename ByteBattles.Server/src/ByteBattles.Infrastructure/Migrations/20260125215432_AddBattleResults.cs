using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ByteBattles.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddBattleResults : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BattleResults",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UserId = table.Column<int>(type: "INTEGER", nullable: false),
                    ChallengeTitle = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    ChallengeDescription = table.Column<string>(type: "TEXT", nullable: false),
                    UserCode = table.Column<string>(type: "TEXT", nullable: false),
                    AiSolutionCode = table.Column<string>(type: "TEXT", nullable: false),
                    Winner = table.Column<string>(type: "TEXT", maxLength: 10, nullable: false),
                    UserExecutionTime = table.Column<double>(type: "REAL", nullable: false),
                    AiExecutionTime = table.Column<double>(type: "REAL", nullable: false),
                    UserPassed = table.Column<bool>(type: "INTEGER", nullable: false),
                    AiPassed = table.Column<bool>(type: "INTEGER", nullable: false),
                    UserOutput = table.Column<string>(type: "TEXT", nullable: false),
                    AiOutput = table.Column<string>(type: "TEXT", nullable: false),
                    AiFeedback = table.Column<string>(type: "TEXT", nullable: true),
                    CompletedAt = table.Column<DateTime>(type: "TEXT", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BattleResults", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BattleResults_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BattleResults_UserId",
                table: "BattleResults",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BattleResults");
        }
    }
}
