using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Hotel.Migrations
{
    /// <inheritdoc />
    public partial class InsertPagesPermissions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Permissions",
                columns: new[] { "Id", "Action", "Description", "DisplayOrder", "Module" },
                values: new object[,]
                {
                    { 22, "Read", "Ver páginas", 8, "Páginas" },
                    { 23, "Write", "Editar páginas", 8, "Páginas" },
                    { 24, "Create", "Crear páginas", 8, "Páginas" }
                });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 4, 16, 52, 35, 639, DateTimeKind.Utc).AddTicks(2557), new DateTime(2025, 7, 4, 16, 52, 35, 639, DateTimeKind.Utc).AddTicks(2558) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 4, 16, 52, 35, 639, DateTimeKind.Utc).AddTicks(2561), new DateTime(2025, 7, 4, 16, 52, 35, 639, DateTimeKind.Utc).AddTicks(2561) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 4, 16, 52, 35, 639, DateTimeKind.Utc).AddTicks(2563), new DateTime(2025, 7, 4, 16, 52, 35, 639, DateTimeKind.Utc).AddTicks(2564) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 4, 16, 52, 35, 639, DateTimeKind.Utc).AddTicks(2565), new DateTime(2025, 7, 4, 16, 52, 35, 639, DateTimeKind.Utc).AddTicks(2565) });

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 4, 16, 52, 35, 639, DateTimeKind.Utc).AddTicks(2283));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 4, 16, 52, 35, 639, DateTimeKind.Utc).AddTicks(2293));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 4, 16, 52, 35, 639, DateTimeKind.Utc).AddTicks(2296));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 4, 16, 52, 35, 639, DateTimeKind.Utc).AddTicks(2297));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 22);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 23);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 24);

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
    }
}
