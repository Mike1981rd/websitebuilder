using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Hotel.Migrations
{
    /// <inheritdoc />
    public partial class AddUserNameAndProfileImageToUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ProfileImagePath",
                table: "Users",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UserName",
                table: "Users",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 6, 6, 2, 8, 12, 742, DateTimeKind.Utc).AddTicks(3366), new DateTime(2025, 6, 6, 2, 8, 12, 742, DateTimeKind.Utc).AddTicks(3367) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 6, 6, 2, 8, 12, 742, DateTimeKind.Utc).AddTicks(3371), new DateTime(2025, 6, 6, 2, 8, 12, 742, DateTimeKind.Utc).AddTicks(3372) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 6, 6, 2, 8, 12, 742, DateTimeKind.Utc).AddTicks(3374), new DateTime(2025, 6, 6, 2, 8, 12, 742, DateTimeKind.Utc).AddTicks(3374) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 6, 6, 2, 8, 12, 742, DateTimeKind.Utc).AddTicks(3376), new DateTime(2025, 6, 6, 2, 8, 12, 742, DateTimeKind.Utc).AddTicks(3377) });

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 6, 6, 2, 8, 12, 742, DateTimeKind.Utc).AddTicks(2954));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 6, 6, 2, 8, 12, 742, DateTimeKind.Utc).AddTicks(2966));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 6, 6, 2, 8, 12, 742, DateTimeKind.Utc).AddTicks(2968));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 6, 6, 2, 8, 12, 742, DateTimeKind.Utc).AddTicks(2971));

            migrationBuilder.CreateIndex(
                name: "IX_Users_UserName",
                table: "Users",
                column: "UserName",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Users_UserName",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "ProfileImagePath",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "UserName",
                table: "Users");

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 6, 6, 1, 51, 26, 634, DateTimeKind.Utc).AddTicks(3520), new DateTime(2025, 6, 6, 1, 51, 26, 634, DateTimeKind.Utc).AddTicks(3521) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 6, 6, 1, 51, 26, 634, DateTimeKind.Utc).AddTicks(3526), new DateTime(2025, 6, 6, 1, 51, 26, 634, DateTimeKind.Utc).AddTicks(3526) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 6, 6, 1, 51, 26, 634, DateTimeKind.Utc).AddTicks(3528), new DateTime(2025, 6, 6, 1, 51, 26, 634, DateTimeKind.Utc).AddTicks(3528) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 6, 6, 1, 51, 26, 634, DateTimeKind.Utc).AddTicks(3530), new DateTime(2025, 6, 6, 1, 51, 26, 634, DateTimeKind.Utc).AddTicks(3531) });

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 6, 6, 1, 51, 26, 634, DateTimeKind.Utc).AddTicks(3199));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 6, 6, 1, 51, 26, 634, DateTimeKind.Utc).AddTicks(3209));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 6, 6, 1, 51, 26, 634, DateTimeKind.Utc).AddTicks(3212));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 6, 6, 1, 51, 26, 634, DateTimeKind.Utc).AddTicks(3214));
        }
    }
}
