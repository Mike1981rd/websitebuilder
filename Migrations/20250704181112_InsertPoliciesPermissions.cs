using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Hotel.Migrations
{
    /// <inheritdoc />
    public partial class InsertPoliciesPermissions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Handle",
                table: "Pages",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(200)",
                oldMaxLength: 200);

            migrationBuilder.InsertData(
                table: "Permissions",
                columns: new[] { "Id", "Action", "Description", "DisplayOrder", "Module" },
                values: new object[,]
                {
                    { 25, "Read", "Ver políticas", 9, "Políticas" },
                    { 26, "Write", "Editar políticas", 9, "Políticas" },
                    { 27, "Create", "Crear políticas", 9, "Políticas" }
                });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 4, 18, 11, 11, 617, DateTimeKind.Utc).AddTicks(1268), new DateTime(2025, 7, 4, 18, 11, 11, 617, DateTimeKind.Utc).AddTicks(1269) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 4, 18, 11, 11, 617, DateTimeKind.Utc).AddTicks(1274), new DateTime(2025, 7, 4, 18, 11, 11, 617, DateTimeKind.Utc).AddTicks(1274) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 4, 18, 11, 11, 617, DateTimeKind.Utc).AddTicks(1276), new DateTime(2025, 7, 4, 18, 11, 11, 617, DateTimeKind.Utc).AddTicks(1277) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 4, 18, 11, 11, 617, DateTimeKind.Utc).AddTicks(1278), new DateTime(2025, 7, 4, 18, 11, 11, 617, DateTimeKind.Utc).AddTicks(1279) });

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 4, 18, 11, 11, 617, DateTimeKind.Utc).AddTicks(753));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 4, 18, 11, 11, 617, DateTimeKind.Utc).AddTicks(765));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 4, 18, 11, 11, 617, DateTimeKind.Utc).AddTicks(768));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 4, 18, 11, 11, 617, DateTimeKind.Utc).AddTicks(771));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 25);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 26);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 27);

            migrationBuilder.AlterColumn<string>(
                name: "Handle",
                table: "Pages",
                type: "character varying(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(200)",
                oldMaxLength: 200,
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 4, 17, 23, 19, 979, DateTimeKind.Utc).AddTicks(9722), new DateTime(2025, 7, 4, 17, 23, 19, 979, DateTimeKind.Utc).AddTicks(9722) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 4, 17, 23, 19, 979, DateTimeKind.Utc).AddTicks(9727), new DateTime(2025, 7, 4, 17, 23, 19, 979, DateTimeKind.Utc).AddTicks(9728) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 4, 17, 23, 19, 979, DateTimeKind.Utc).AddTicks(9729), new DateTime(2025, 7, 4, 17, 23, 19, 979, DateTimeKind.Utc).AddTicks(9730) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 4, 17, 23, 19, 979, DateTimeKind.Utc).AddTicks(9731), new DateTime(2025, 7, 4, 17, 23, 19, 979, DateTimeKind.Utc).AddTicks(9732) });

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 4, 17, 23, 19, 979, DateTimeKind.Utc).AddTicks(9228));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 4, 17, 23, 19, 979, DateTimeKind.Utc).AddTicks(9241));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 4, 17, 23, 19, 979, DateTimeKind.Utc).AddTicks(9244));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 4, 17, 23, 19, 979, DateTimeKind.Utc).AddTicks(9246));
        }
    }
}
