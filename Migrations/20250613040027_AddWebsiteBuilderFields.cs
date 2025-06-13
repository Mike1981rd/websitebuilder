using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Hotel.Migrations
{
    /// <inheritdoc />
    public partial class AddWebsiteBuilderFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Domain",
                table: "WebSites",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SectionsConfigJson",
                table: "WebSites",
                type: "jsonb",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 6, 13, 4, 0, 26, 37, DateTimeKind.Utc).AddTicks(5378), new DateTime(2025, 6, 13, 4, 0, 26, 37, DateTimeKind.Utc).AddTicks(5379) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 6, 13, 4, 0, 26, 37, DateTimeKind.Utc).AddTicks(5386), new DateTime(2025, 6, 13, 4, 0, 26, 37, DateTimeKind.Utc).AddTicks(5386) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 6, 13, 4, 0, 26, 37, DateTimeKind.Utc).AddTicks(5389), new DateTime(2025, 6, 13, 4, 0, 26, 37, DateTimeKind.Utc).AddTicks(5389) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 6, 13, 4, 0, 26, 37, DateTimeKind.Utc).AddTicks(5392), new DateTime(2025, 6, 13, 4, 0, 26, 37, DateTimeKind.Utc).AddTicks(5393) });

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 6, 13, 4, 0, 26, 37, DateTimeKind.Utc).AddTicks(4593));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 6, 13, 4, 0, 26, 37, DateTimeKind.Utc).AddTicks(4606));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 6, 13, 4, 0, 26, 37, DateTimeKind.Utc).AddTicks(4608));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 6, 13, 4, 0, 26, 37, DateTimeKind.Utc).AddTicks(4610));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Domain",
                table: "WebSites");

            migrationBuilder.DropColumn(
                name: "SectionsConfigJson",
                table: "WebSites");

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 6, 9, 15, 13, 18, 181, DateTimeKind.Utc).AddTicks(3135), new DateTime(2025, 6, 9, 15, 13, 18, 181, DateTimeKind.Utc).AddTicks(3136) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 6, 9, 15, 13, 18, 181, DateTimeKind.Utc).AddTicks(3139), new DateTime(2025, 6, 9, 15, 13, 18, 181, DateTimeKind.Utc).AddTicks(3140) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 6, 9, 15, 13, 18, 181, DateTimeKind.Utc).AddTicks(3144), new DateTime(2025, 6, 9, 15, 13, 18, 181, DateTimeKind.Utc).AddTicks(3145) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 6, 9, 15, 13, 18, 181, DateTimeKind.Utc).AddTicks(3148), new DateTime(2025, 6, 9, 15, 13, 18, 181, DateTimeKind.Utc).AddTicks(3149) });

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 6, 9, 15, 13, 18, 181, DateTimeKind.Utc).AddTicks(2356));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 6, 9, 15, 13, 18, 181, DateTimeKind.Utc).AddTicks(2373));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 6, 9, 15, 13, 18, 181, DateTimeKind.Utc).AddTicks(2377));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 6, 9, 15, 13, 18, 181, DateTimeKind.Utc).AddTicks(2381));
        }
    }
}
