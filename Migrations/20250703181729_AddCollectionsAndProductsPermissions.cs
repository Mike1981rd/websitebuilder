using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Hotel.Migrations
{
    /// <inheritdoc />
    public partial class AddCollectionsAndProductsPermissions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 3, 18, 17, 28, 682, DateTimeKind.Utc).AddTicks(4377), new DateTime(2025, 7, 3, 18, 17, 28, 682, DateTimeKind.Utc).AddTicks(4379) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 3, 18, 17, 28, 682, DateTimeKind.Utc).AddTicks(4384), new DateTime(2025, 7, 3, 18, 17, 28, 682, DateTimeKind.Utc).AddTicks(4385) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 3, 18, 17, 28, 682, DateTimeKind.Utc).AddTicks(4389), new DateTime(2025, 7, 3, 18, 17, 28, 682, DateTimeKind.Utc).AddTicks(4390) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 3, 18, 17, 28, 682, DateTimeKind.Utc).AddTicks(4393), new DateTime(2025, 7, 3, 18, 17, 28, 682, DateTimeKind.Utc).AddTicks(4394) });

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 3, 18, 17, 28, 682, DateTimeKind.Utc).AddTicks(3572));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 3, 18, 17, 28, 682, DateTimeKind.Utc).AddTicks(3584));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 3, 18, 17, 28, 682, DateTimeKind.Utc).AddTicks(3589));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 3, 18, 17, 28, 682, DateTimeKind.Utc).AddTicks(3590));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
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
    }
}
