using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Hotel.Migrations
{
    /// <inheritdoc />
    public partial class CreatePoliciesTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Policies",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CompanyId = table.Column<int>(type: "integer", nullable: false),
                    RefundPolicyContent = table.Column<string>(type: "text", nullable: true),
                    PrivacyPolicyContent = table.Column<string>(type: "text", nullable: true),
                    TermsOfServiceContent = table.Column<string>(type: "text", nullable: true),
                    ShippingPolicyContent = table.Column<string>(type: "text", nullable: true),
                    ContactInformationContent = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Policies", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Policies_Companies_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Companies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 4, 18, 32, 30, 422, DateTimeKind.Utc).AddTicks(891), new DateTime(2025, 7, 4, 18, 32, 30, 422, DateTimeKind.Utc).AddTicks(892) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 4, 18, 32, 30, 422, DateTimeKind.Utc).AddTicks(896), new DateTime(2025, 7, 4, 18, 32, 30, 422, DateTimeKind.Utc).AddTicks(896) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 4, 18, 32, 30, 422, DateTimeKind.Utc).AddTicks(898), new DateTime(2025, 7, 4, 18, 32, 30, 422, DateTimeKind.Utc).AddTicks(898) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 4, 18, 32, 30, 422, DateTimeKind.Utc).AddTicks(900), new DateTime(2025, 7, 4, 18, 32, 30, 422, DateTimeKind.Utc).AddTicks(900) });

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 4, 18, 32, 30, 422, DateTimeKind.Utc).AddTicks(292));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 4, 18, 32, 30, 422, DateTimeKind.Utc).AddTicks(303));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 4, 18, 32, 30, 422, DateTimeKind.Utc).AddTicks(305));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 4, 18, 32, 30, 422, DateTimeKind.Utc).AddTicks(307));

            migrationBuilder.CreateIndex(
                name: "IX_Policies_CompanyId",
                table: "Policies",
                column: "CompanyId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Policies");

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 4, 18, 11, 11, 617, DateTimeKind.Utc).AddTicks(1268), new DateTime(2025, 7, 4, 18, 11, 11, 617, DateTimeKind.Utc).AddTicks(1269) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 4, 18, 11, 11, 617, DateTimeKind.Utc).AddTicks(1274), new DateTime(2025, 7, 4, 18, 11, 11, 617, DateTimeKind.Utc).AddTicks(1274) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 4, 18, 11, 11, 617, DateTimeKind.Utc).AddTicks(1276), new DateTime(2025, 7, 4, 18, 11, 11, 617, DateTimeKind.Utc).AddTicks(1277) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 4, 18, 11, 11, 617, DateTimeKind.Utc).AddTicks(1278), new DateTime(2025, 7, 4, 18, 11, 11, 617, DateTimeKind.Utc).AddTicks(1279) });

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 4, 18, 11, 11, 617, DateTimeKind.Utc).AddTicks(753));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 4, 18, 11, 11, 617, DateTimeKind.Utc).AddTicks(765));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 4, 18, 11, 11, 617, DateTimeKind.Utc).AddTicks(768));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 4, 18, 11, 11, 617, DateTimeKind.Utc).AddTicks(771));
        }
    }
}
