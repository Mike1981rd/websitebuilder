using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Hotel.Migrations
{
    /// <inheritdoc />
    public partial class AddPagesConfigJsonToWebSite : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PagesConfigJson",
                table: "WebSites",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 14, 20, 20, 2, 661, DateTimeKind.Utc).AddTicks(4220), new DateTime(2025, 7, 14, 20, 20, 2, 661, DateTimeKind.Utc).AddTicks(4221) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 14, 20, 20, 2, 661, DateTimeKind.Utc).AddTicks(4225), new DateTime(2025, 7, 14, 20, 20, 2, 661, DateTimeKind.Utc).AddTicks(4226) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 14, 20, 20, 2, 661, DateTimeKind.Utc).AddTicks(4230), new DateTime(2025, 7, 14, 20, 20, 2, 661, DateTimeKind.Utc).AddTicks(4231) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 14, 20, 20, 2, 661, DateTimeKind.Utc).AddTicks(4234), new DateTime(2025, 7, 14, 20, 20, 2, 661, DateTimeKind.Utc).AddTicks(4236) });

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 14, 20, 20, 2, 661, DateTimeKind.Utc).AddTicks(2957));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 14, 20, 20, 2, 661, DateTimeKind.Utc).AddTicks(2970));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 14, 20, 20, 2, 661, DateTimeKind.Utc).AddTicks(2975));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 14, 20, 20, 2, 661, DateTimeKind.Utc).AddTicks(2978));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PagesConfigJson",
                table: "WebSites");

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
        }
    }
}
