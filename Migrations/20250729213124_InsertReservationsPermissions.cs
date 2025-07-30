using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Hotel.Migrations
{
    /// <inheritdoc />
    public partial class InsertReservationsPermissions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Permissions",
                columns: new[] { "Id", "Action", "Description", "DisplayOrder", "Module" },
                values: new object[,]
                {
                    { 28, "Read", "Ver reservaciones", 10, "Reservations" },
                    { 29, "Write", "Editar reservaciones", 10, "Reservations" },
                    { 30, "Create", "Crear reservaciones", 10, "Reservations" }
                });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 29, 21, 31, 23, 650, DateTimeKind.Utc).AddTicks(972), new DateTime(2025, 7, 29, 21, 31, 23, 650, DateTimeKind.Utc).AddTicks(973) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 29, 21, 31, 23, 650, DateTimeKind.Utc).AddTicks(976), new DateTime(2025, 7, 29, 21, 31, 23, 650, DateTimeKind.Utc).AddTicks(976) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 29, 21, 31, 23, 650, DateTimeKind.Utc).AddTicks(978), new DateTime(2025, 7, 29, 21, 31, 23, 650, DateTimeKind.Utc).AddTicks(978) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 29, 21, 31, 23, 650, DateTimeKind.Utc).AddTicks(980), new DateTime(2025, 7, 29, 21, 31, 23, 650, DateTimeKind.Utc).AddTicks(980) });

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 29, 21, 31, 23, 650, DateTimeKind.Utc).AddTicks(266));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 29, 21, 31, 23, 650, DateTimeKind.Utc).AddTicks(276));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 29, 21, 31, 23, 650, DateTimeKind.Utc).AddTicks(278));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 29, 21, 31, 23, 650, DateTimeKind.Utc).AddTicks(279));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 28);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 29);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 30);

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 29, 15, 31, 5, 398, DateTimeKind.Utc).AddTicks(2270), new DateTime(2025, 7, 29, 15, 31, 5, 398, DateTimeKind.Utc).AddTicks(2270) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 29, 15, 31, 5, 398, DateTimeKind.Utc).AddTicks(2274), new DateTime(2025, 7, 29, 15, 31, 5, 398, DateTimeKind.Utc).AddTicks(2274) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 29, 15, 31, 5, 398, DateTimeKind.Utc).AddTicks(2276), new DateTime(2025, 7, 29, 15, 31, 5, 398, DateTimeKind.Utc).AddTicks(2276) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 29, 15, 31, 5, 398, DateTimeKind.Utc).AddTicks(2278), new DateTime(2025, 7, 29, 15, 31, 5, 398, DateTimeKind.Utc).AddTicks(2278) });

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 29, 15, 31, 5, 398, DateTimeKind.Utc).AddTicks(1800));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 29, 15, 31, 5, 398, DateTimeKind.Utc).AddTicks(1807));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 29, 15, 31, 5, 398, DateTimeKind.Utc).AddTicks(1809));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 29, 15, 31, 5, 398, DateTimeKind.Utc).AddTicks(1811));
        }
    }
}
