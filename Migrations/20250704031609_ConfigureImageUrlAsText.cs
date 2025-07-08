using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Hotel.Migrations
{
    /// <inheritdoc />
    public partial class ConfigureImageUrlAsText : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 4, 3, 16, 8, 291, DateTimeKind.Utc).AddTicks(3405), new DateTime(2025, 7, 4, 3, 16, 8, 291, DateTimeKind.Utc).AddTicks(3406) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 4, 3, 16, 8, 291, DateTimeKind.Utc).AddTicks(3410), new DateTime(2025, 7, 4, 3, 16, 8, 291, DateTimeKind.Utc).AddTicks(3410) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 4, 3, 16, 8, 291, DateTimeKind.Utc).AddTicks(3412), new DateTime(2025, 7, 4, 3, 16, 8, 291, DateTimeKind.Utc).AddTicks(3412) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 4, 3, 16, 8, 291, DateTimeKind.Utc).AddTicks(3413), new DateTime(2025, 7, 4, 3, 16, 8, 291, DateTimeKind.Utc).AddTicks(3414) });

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 4, 3, 16, 8, 291, DateTimeKind.Utc).AddTicks(2997));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 4, 3, 16, 8, 291, DateTimeKind.Utc).AddTicks(3006));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 4, 3, 16, 8, 291, DateTimeKind.Utc).AddTicks(3008));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 4, 3, 16, 8, 291, DateTimeKind.Utc).AddTicks(3010));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 4, 3, 8, 16, 630, DateTimeKind.Utc).AddTicks(8010), new DateTime(2025, 7, 4, 3, 8, 16, 630, DateTimeKind.Utc).AddTicks(8010) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 4, 3, 8, 16, 630, DateTimeKind.Utc).AddTicks(8015), new DateTime(2025, 7, 4, 3, 8, 16, 630, DateTimeKind.Utc).AddTicks(8015) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 4, 3, 8, 16, 630, DateTimeKind.Utc).AddTicks(8017), new DateTime(2025, 7, 4, 3, 8, 16, 630, DateTimeKind.Utc).AddTicks(8017) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 4, 3, 8, 16, 630, DateTimeKind.Utc).AddTicks(8019), new DateTime(2025, 7, 4, 3, 8, 16, 630, DateTimeKind.Utc).AddTicks(8019) });

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 4, 3, 8, 16, 630, DateTimeKind.Utc).AddTicks(7307));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 4, 3, 8, 16, 630, DateTimeKind.Utc).AddTicks(7333));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 4, 3, 8, 16, 630, DateTimeKind.Utc).AddTicks(7336));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 4, 3, 8, 16, 630, DateTimeKind.Utc).AddTicks(7338));
        }
    }
}
