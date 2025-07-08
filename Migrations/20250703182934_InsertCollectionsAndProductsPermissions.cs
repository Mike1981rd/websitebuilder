using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Hotel.Migrations
{
    /// <inheritdoc />
    public partial class InsertCollectionsAndProductsPermissions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Permissions",
                columns: new[] { "Id", "Action", "Description", "DisplayOrder", "Module" },
                values: new object[,]
                {
                    { 16, "Read", "Ver colecciones", 6, "Colecciones" },
                    { 17, "Write", "Editar colecciones", 6, "Colecciones" },
                    { 18, "Create", "Crear colecciones", 6, "Colecciones" },
                    { 19, "Read", "Ver productos", 7, "Productos" },
                    { 20, "Write", "Editar productos", 7, "Productos" },
                    { 21, "Create", "Crear productos", 7, "Productos" }
                });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 3, 18, 29, 33, 395, DateTimeKind.Utc).AddTicks(1831), new DateTime(2025, 7, 3, 18, 29, 33, 395, DateTimeKind.Utc).AddTicks(1831) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 3, 18, 29, 33, 395, DateTimeKind.Utc).AddTicks(1835), new DateTime(2025, 7, 3, 18, 29, 33, 395, DateTimeKind.Utc).AddTicks(1835) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 3, 18, 29, 33, 395, DateTimeKind.Utc).AddTicks(1837), new DateTime(2025, 7, 3, 18, 29, 33, 395, DateTimeKind.Utc).AddTicks(1837) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 3, 18, 29, 33, 395, DateTimeKind.Utc).AddTicks(1838), new DateTime(2025, 7, 3, 18, 29, 33, 395, DateTimeKind.Utc).AddTicks(1839) });

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 3, 18, 29, 33, 395, DateTimeKind.Utc).AddTicks(1398));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 3, 18, 29, 33, 395, DateTimeKind.Utc).AddTicks(1412));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 3, 18, 29, 33, 395, DateTimeKind.Utc).AddTicks(1414));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 3, 18, 29, 33, 395, DateTimeKind.Utc).AddTicks(1416));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 18);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 19);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 20);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 21);

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
    }
}
