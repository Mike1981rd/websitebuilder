using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Hotel.Migrations
{
    /// <inheritdoc />
    public partial class AddCheckoutLogoSizeToCompany : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CheckoutLogoSize",
                table: "Companies",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 1, 21, 16, 40, 211, DateTimeKind.Utc).AddTicks(1717), new DateTime(2025, 8, 1, 21, 16, 40, 211, DateTimeKind.Utc).AddTicks(1718) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 1, 21, 16, 40, 211, DateTimeKind.Utc).AddTicks(1723), new DateTime(2025, 8, 1, 21, 16, 40, 211, DateTimeKind.Utc).AddTicks(1723) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 1, 21, 16, 40, 211, DateTimeKind.Utc).AddTicks(1726), new DateTime(2025, 8, 1, 21, 16, 40, 211, DateTimeKind.Utc).AddTicks(1726) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 1, 21, 16, 40, 211, DateTimeKind.Utc).AddTicks(1728), new DateTime(2025, 8, 1, 21, 16, 40, 211, DateTimeKind.Utc).AddTicks(1728) });

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 1, 21, 16, 40, 211, DateTimeKind.Utc).AddTicks(998));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 1, 21, 16, 40, 211, DateTimeKind.Utc).AddTicks(1009));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 1, 21, 16, 40, 211, DateTimeKind.Utc).AddTicks(1012));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 1, 21, 16, 40, 211, DateTimeKind.Utc).AddTicks(1015));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CheckoutLogoSize",
                table: "Companies");

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 1, 20, 49, 41, 299, DateTimeKind.Utc).AddTicks(7894), new DateTime(2025, 8, 1, 20, 49, 41, 299, DateTimeKind.Utc).AddTicks(7895) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 1, 20, 49, 41, 299, DateTimeKind.Utc).AddTicks(7899), new DateTime(2025, 8, 1, 20, 49, 41, 299, DateTimeKind.Utc).AddTicks(7899) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 1, 20, 49, 41, 299, DateTimeKind.Utc).AddTicks(7902), new DateTime(2025, 8, 1, 20, 49, 41, 299, DateTimeKind.Utc).AddTicks(7902) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 1, 20, 49, 41, 299, DateTimeKind.Utc).AddTicks(7904), new DateTime(2025, 8, 1, 20, 49, 41, 299, DateTimeKind.Utc).AddTicks(7904) });

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 1, 20, 49, 41, 299, DateTimeKind.Utc).AddTicks(7313));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 1, 20, 49, 41, 299, DateTimeKind.Utc).AddTicks(7324));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 1, 20, 49, 41, 299, DateTimeKind.Utc).AddTicks(7328));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 1, 20, 49, 41, 299, DateTimeKind.Utc).AddTicks(7330));
        }
    }
}
