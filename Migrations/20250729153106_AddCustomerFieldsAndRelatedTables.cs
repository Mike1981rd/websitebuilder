using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Hotel.Migrations
{
    /// <inheritdoc />
    public partial class AddCustomerFieldsAndRelatedTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "AccountBalance",
                table: "Guests",
                type: "numeric(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "CouponsCount",
                table: "Guests",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "CustomerId",
                table: "Guests",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                table: "Guests",
                type: "timestamp without time zone",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Guests",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastLoginAt",
                table: "Guests",
                type: "timestamp without time zone",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "LoyaltyPoints",
                table: "Guests",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "LoyaltyTier",
                table: "Guests",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PasswordHash",
                table: "Guests",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProfileImageUrl",
                table: "Guests",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Guests",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "TotalSpent",
                table: "Guests",
                type: "numeric(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<bool>(
                name: "TwoFactorEnabled",
                table: "Guests",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "TwoFactorPhone",
                table: "Guests",
                type: "character varying(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Username",
                table: "Guests",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "WishlistCount",
                table: "Guests",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "CustomerAddresses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    GuestId = table.Column<int>(type: "integer", nullable: false),
                    Type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Street = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    City = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    State = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Country = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    PostalCode = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    IsDefault = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CustomerAddresses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CustomerAddresses_Guests_GuestId",
                        column: x => x.GuestId,
                        principalTable: "Guests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CustomerDevices",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    GuestId = table.Column<int>(type: "integer", nullable: false),
                    Browser = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Device = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    OperatingSystem = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Location = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    IpAddress = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    LastActivity = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CustomerDevices", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CustomerDevices_Guests_GuestId",
                        column: x => x.GuestId,
                        principalTable: "Guests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CustomerNotificationPreferences",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    GuestId = table.Column<int>(type: "integer", nullable: false),
                    Type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    EmailEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    BrowserEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    AppEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CustomerNotificationPreferences", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CustomerNotificationPreferences_Guests_GuestId",
                        column: x => x.GuestId,
                        principalTable: "Guests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CustomerPaymentMethods",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    GuestId = table.Column<int>(type: "integer", nullable: false),
                    Type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    CardType = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    LastFourDigits = table.Column<string>(type: "character varying(4)", maxLength: 4, nullable: false),
                    HolderName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    ExpiryDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    IsDefault = table.Column<bool>(type: "boolean", nullable: false),
                    BankName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    AccountType = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CustomerPaymentMethods", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CustomerPaymentMethods_Guests_GuestId",
                        column: x => x.GuestId,
                        principalTable: "Guests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

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

            migrationBuilder.CreateIndex(
                name: "IX_Guests_CustomerId",
                table: "Guests",
                column: "CustomerId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Guests_Username",
                table: "Guests",
                column: "Username",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CustomerAddresses_GuestId",
                table: "CustomerAddresses",
                column: "GuestId");

            migrationBuilder.CreateIndex(
                name: "IX_CustomerDevices_GuestId",
                table: "CustomerDevices",
                column: "GuestId");

            migrationBuilder.CreateIndex(
                name: "IX_CustomerNotificationPreferences_GuestId",
                table: "CustomerNotificationPreferences",
                column: "GuestId");

            migrationBuilder.CreateIndex(
                name: "IX_CustomerPaymentMethods_GuestId",
                table: "CustomerPaymentMethods",
                column: "GuestId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CustomerAddresses");

            migrationBuilder.DropTable(
                name: "CustomerDevices");

            migrationBuilder.DropTable(
                name: "CustomerNotificationPreferences");

            migrationBuilder.DropTable(
                name: "CustomerPaymentMethods");

            migrationBuilder.DropIndex(
                name: "IX_Guests_CustomerId",
                table: "Guests");

            migrationBuilder.DropIndex(
                name: "IX_Guests_Username",
                table: "Guests");

            migrationBuilder.DropColumn(
                name: "AccountBalance",
                table: "Guests");

            migrationBuilder.DropColumn(
                name: "CouponsCount",
                table: "Guests");

            migrationBuilder.DropColumn(
                name: "CustomerId",
                table: "Guests");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "Guests");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Guests");

            migrationBuilder.DropColumn(
                name: "LastLoginAt",
                table: "Guests");

            migrationBuilder.DropColumn(
                name: "LoyaltyPoints",
                table: "Guests");

            migrationBuilder.DropColumn(
                name: "LoyaltyTier",
                table: "Guests");

            migrationBuilder.DropColumn(
                name: "PasswordHash",
                table: "Guests");

            migrationBuilder.DropColumn(
                name: "ProfileImageUrl",
                table: "Guests");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Guests");

            migrationBuilder.DropColumn(
                name: "TotalSpent",
                table: "Guests");

            migrationBuilder.DropColumn(
                name: "TwoFactorEnabled",
                table: "Guests");

            migrationBuilder.DropColumn(
                name: "TwoFactorPhone",
                table: "Guests");

            migrationBuilder.DropColumn(
                name: "Username",
                table: "Guests");

            migrationBuilder.DropColumn(
                name: "WishlistCount",
                table: "Guests");

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 14, 20, 20, 2, 661, DateTimeKind.Utc).AddTicks(4220), new DateTime(2025, 7, 14, 20, 20, 2, 661, DateTimeKind.Utc).AddTicks(4221) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 14, 20, 20, 2, 661, DateTimeKind.Utc).AddTicks(4225), new DateTime(2025, 7, 14, 20, 20, 2, 661, DateTimeKind.Utc).AddTicks(4226) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 14, 20, 20, 2, 661, DateTimeKind.Utc).AddTicks(4230), new DateTime(2025, 7, 14, 20, 20, 2, 661, DateTimeKind.Utc).AddTicks(4231) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 14, 20, 20, 2, 661, DateTimeKind.Utc).AddTicks(4234), new DateTime(2025, 7, 14, 20, 20, 2, 661, DateTimeKind.Utc).AddTicks(4236) });

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 14, 20, 20, 2, 661, DateTimeKind.Utc).AddTicks(2957));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 14, 20, 20, 2, 661, DateTimeKind.Utc).AddTicks(2970));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 14, 20, 20, 2, 661, DateTimeKind.Utc).AddTicks(2975));

            migrationBuilder.UpdateData(
                table: "RoomTypes",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 14, 20, 20, 2, 661, DateTimeKind.Utc).AddTicks(2978));
        }
    }
}
