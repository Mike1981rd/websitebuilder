using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Hotel.Migrations
{
    /// <inheritdoc />
    public partial class CreateCollectionTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Collections",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Title = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Handle = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    ImageUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    SortOrder = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    SeoTitle = table.Column<string>(type: "character varying(60)", maxLength: 60, nullable: false),
                    SeoDescription = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false),
                    SalesChannels = table.Column<string>(type: "jsonb", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Collections", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CollectionProducts",
                columns: table => new
                {
                    CollectionId = table.Column<int>(type: "integer", nullable: false),
                    ProductId = table.Column<int>(type: "integer", nullable: false),
                    Position = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CollectionProducts", x => new { x.CollectionId, x.ProductId });
                    table.ForeignKey(
                        name: "FK_CollectionProducts_Collections_CollectionId",
                        column: x => x.CollectionId,
                        principalTable: "Collections",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 3, 18, 44, 40, 485, DateTimeKind.Utc).AddTicks(3261), new DateTime(2025, 7, 3, 18, 44, 40, 485, DateTimeKind.Utc).AddTicks(3261) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 3, 18, 44, 40, 485, DateTimeKind.Utc).AddTicks(3265), new DateTime(2025, 7, 3, 18, 44, 40, 485, DateTimeKind.Utc).AddTicks(3266) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 3, 18, 44, 40, 485, DateTimeKind.Utc).AddTicks(3267), new DateTime(2025, 7, 3, 18, 44, 40, 485, DateTimeKind.Utc).AddTicks(3268) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 3, 18, 44, 40, 485, DateTimeKind.Utc).AddTicks(3269), new DateTime(2025, 7, 3, 18, 44, 40, 485, DateTimeKind.Utc).AddTicks(3270) });

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 3, 18, 44, 40, 485, DateTimeKind.Utc).AddTicks(2806));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 3, 18, 44, 40, 485, DateTimeKind.Utc).AddTicks(2818));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 3, 18, 44, 40, 485, DateTimeKind.Utc).AddTicks(2820));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 3, 18, 44, 40, 485, DateTimeKind.Utc).AddTicks(2822));

            migrationBuilder.CreateIndex(
                name: "IX_Collections_Handle",
                table: "Collections",
                column: "Handle",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CollectionProducts");

            migrationBuilder.DropTable(
                name: "Collections");

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
    }
}
