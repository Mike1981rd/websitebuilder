using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Hotel.Migrations
{
    /// <inheritdoc />
    public partial class AddCheckoutLogoFieldsToCompany : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CheckoutLogoPosition",
                table: "Companies",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CheckoutLogoUrl",
                table: "Companies",
                type: "text",
                nullable: true);

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CheckoutLogoPosition",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "CheckoutLogoUrl",
                table: "Companies");

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 31, 3, 58, 28, 379, DateTimeKind.Utc).AddTicks(8139), new DateTime(2025, 7, 31, 3, 58, 28, 379, DateTimeKind.Utc).AddTicks(8141) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 31, 3, 58, 28, 379, DateTimeKind.Utc).AddTicks(8145), new DateTime(2025, 7, 31, 3, 58, 28, 379, DateTimeKind.Utc).AddTicks(8146) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 31, 3, 58, 28, 379, DateTimeKind.Utc).AddTicks(8148), new DateTime(2025, 7, 31, 3, 58, 28, 379, DateTimeKind.Utc).AddTicks(8148) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 31, 3, 58, 28, 379, DateTimeKind.Utc).AddTicks(8150), new DateTime(2025, 7, 31, 3, 58, 28, 379, DateTimeKind.Utc).AddTicks(8150) });

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 31, 3, 58, 28, 379, DateTimeKind.Utc).AddTicks(7402));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 31, 3, 58, 28, 379, DateTimeKind.Utc).AddTicks(7414));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 31, 3, 58, 28, 379, DateTimeKind.Utc).AddTicks(7418));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 31, 3, 58, 28, 379, DateTimeKind.Utc).AddTicks(7420));
        }
    }
}
