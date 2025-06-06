using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Hotel.Migrations
{
    /// <inheritdoc />
    public partial class AddRolesAndPermissionsTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Permissions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Module = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Action = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Description = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    DisplayOrder = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Permissions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RolePermissions",
                columns: table => new
                {
                    RoleId = table.Column<int>(type: "integer", nullable: false),
                    PermissionId = table.Column<int>(type: "integer", nullable: false),
                    AssignedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RolePermissions", x => new { x.RoleId, x.PermissionId });
                    table.ForeignKey(
                        name: "FK_RolePermissions_Permissions_PermissionId",
                        column: x => x.PermissionId,
                        principalTable: "Permissions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RolePermissions_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Permissions",
                columns: new[] { "Id", "Action", "Description", "DisplayOrder", "Module" },
                values: new object[,]
                {
                    { 1, "Read", "Ver información de empresa", 1, "Empresa" },
                    { 2, "Write", "Editar información de empresa", 1, "Empresa" },
                    { 3, "Create", "Crear información de empresa", 1, "Empresa" },
                    { 4, "Read", "Ver roles", 2, "Roles" },
                    { 5, "Write", "Editar roles", 2, "Roles" },
                    { 6, "Create", "Crear roles", 2, "Roles" },
                    { 7, "Read", "Ver usuarios", 3, "Usuarios" },
                    { 8, "Write", "Editar usuarios", 3, "Usuarios" },
                    { 9, "Create", "Crear usuarios", 3, "Usuarios" },
                    { 10, "Read", "Ver clientes", 4, "Clientes" },
                    { 11, "Write", "Editar clientes", 4, "Clientes" },
                    { 12, "Create", "Crear clientes", 4, "Clientes" },
                    { 13, "Read", "Ver configuración del sitio web", 5, "SitioWeb" },
                    { 14, "Write", "Editar configuración del sitio web", 5, "SitioWeb" },
                    { 15, "Create", "Crear contenido del sitio web", 5, "SitioWeb" }
                });

            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "Id", "CreatedAt", "Description", "IsActive", "Name", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, new DateTime(2025, 6, 6, 0, 12, 52, 467, DateTimeKind.Utc).AddTicks(652), "Acceso completo al sistema", true, "Administrator", new DateTime(2025, 6, 6, 0, 12, 52, 467, DateTimeKind.Utc).AddTicks(653) },
                    { 2, new DateTime(2025, 6, 6, 0, 12, 52, 467, DateTimeKind.Utc).AddTicks(657), "Acceso de gestión", true, "Manager", new DateTime(2025, 6, 6, 0, 12, 52, 467, DateTimeKind.Utc).AddTicks(658) },
                    { 3, new DateTime(2025, 6, 6, 0, 12, 52, 467, DateTimeKind.Utc).AddTicks(660), "Acceso de soporte", true, "Support", new DateTime(2025, 6, 6, 0, 12, 52, 467, DateTimeKind.Utc).AddTicks(660) },
                    { 4, new DateTime(2025, 6, 6, 0, 12, 52, 467, DateTimeKind.Utc).AddTicks(662), "Acceso básico de usuario", true, "Users", new DateTime(2025, 6, 6, 0, 12, 52, 467, DateTimeKind.Utc).AddTicks(662) }
                });

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 6, 6, 0, 12, 52, 466, DateTimeKind.Utc).AddTicks(9908));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 6, 6, 0, 12, 52, 466, DateTimeKind.Utc).AddTicks(9923));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 6, 6, 0, 12, 52, 466, DateTimeKind.Utc).AddTicks(9926));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 6, 6, 0, 12, 52, 466, DateTimeKind.Utc).AddTicks(9928));

            migrationBuilder.CreateIndex(
                name: "IX_RolePermissions_PermissionId",
                table: "RolePermissions",
                column: "PermissionId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RolePermissions");

            migrationBuilder.DropTable(
                name: "Permissions");

            migrationBuilder.DropTable(
                name: "Roles");

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 6, 5, 21, 53, 13, 183, DateTimeKind.Utc).AddTicks(4298));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 6, 5, 21, 53, 13, 183, DateTimeKind.Utc).AddTicks(4308));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 6, 5, 21, 53, 13, 183, DateTimeKind.Utc).AddTicks(4310));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 6, 5, 21, 53, 13, 183, DateTimeKind.Utc).AddTicks(4323));
        }
    }
}
