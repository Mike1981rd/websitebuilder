using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Hotel.Migrations
{
    /// <inheritdoc />
    public partial class AddDisplayOrderToProductCollection : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 4, 15, 55, 50, 735, DateTimeKind.Utc).AddTicks(4064), new DateTime(2025, 7, 4, 15, 55, 50, 735, DateTimeKind.Utc).AddTicks(4065) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 4, 15, 55, 50, 735, DateTimeKind.Utc).AddTicks(4071), new DateTime(2025, 7, 4, 15, 55, 50, 735, DateTimeKind.Utc).AddTicks(4072) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 4, 15, 55, 50, 735, DateTimeKind.Utc).AddTicks(4073), new DateTime(2025, 7, 4, 15, 55, 50, 735, DateTimeKind.Utc).AddTicks(4074) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 4, 15, 55, 50, 735, DateTimeKind.Utc).AddTicks(4075), new DateTime(2025, 7, 4, 15, 55, 50, 735, DateTimeKind.Utc).AddTicks(4075) });

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 4, 15, 55, 50, 735, DateTimeKind.Utc).AddTicks(3645));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 4, 15, 55, 50, 735, DateTimeKind.Utc).AddTicks(3655));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 4, 15, 55, 50, 735, DateTimeKind.Utc).AddTicks(3658));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 4, 15, 55, 50, 735, DateTimeKind.Utc).AddTicks(3659));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 4, 4, 46, 22, 472, DateTimeKind.Utc).AddTicks(9106), new DateTime(2025, 7, 4, 4, 46, 22, 472, DateTimeKind.Utc).AddTicks(9107) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 4, 4, 46, 22, 472, DateTimeKind.Utc).AddTicks(9112), new DateTime(2025, 7, 4, 4, 46, 22, 472, DateTimeKind.Utc).AddTicks(9112) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 4, 4, 46, 22, 472, DateTimeKind.Utc).AddTicks(9115), new DateTime(2025, 7, 4, 4, 46, 22, 472, DateTimeKind.Utc).AddTicks(9115) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 4, 4, 46, 22, 472, DateTimeKind.Utc).AddTicks(9117), new DateTime(2025, 7, 4, 4, 46, 22, 472, DateTimeKind.Utc).AddTicks(9117) });

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 4, 4, 46, 22, 472, DateTimeKind.Utc).AddTicks(8372));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 4, 4, 46, 22, 472, DateTimeKind.Utc).AddTicks(8383));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 4, 4, 46, 22, 472, DateTimeKind.Utc).AddTicks(8386));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 4, 4, 46, 22, 472, DateTimeKind.Utc).AddTicks(8388));
        }
    }
}
