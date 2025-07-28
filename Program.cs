using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Server.IISIntegration;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Hotel.Data;

var builder = WebApplication.CreateBuilder(args);

// Configurar Npgsql para manejar correctamente DateTime con PostgreSQL
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

// Configure request size limits for large JSON payloads
builder.Services.Configure<FormOptions>(options =>
{
    options.ValueLengthLimit = int.MaxValue;
    options.MultipartBodyLengthLimit = int.MaxValue;
    options.MultipartHeadersLengthLimit = int.MaxValue;
});

// Configure Kestrel limits
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.Limits.MaxRequestBodySize = 100 * 1024 * 1024; // 100MB
    serverOptions.Limits.MaxRequestHeadersTotalSize = 1048576; // 1MB
});

// Configure IIS limits if hosted in IIS
builder.Services.Configure<IISServerOptions>(options =>
{
    options.MaxRequestBodySize = 100 * 1024 * 1024; // 100MB
});

// Add services to the container.
builder.Services.AddControllersWithViews()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

// Configurar DbContext con PostgreSQL
builder.Services.AddDbContext<HotelDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configurar autenticación con cookies
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Account/Login";
        options.LogoutPath = "/Account/Logout";
        options.AccessDeniedPath = "/Account/AccessDenied";
        options.ExpireTimeSpan = TimeSpan.FromHours(12);
        options.SlidingExpiration = true;
    });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Account}/{action=Login}/{id?}");

app.MapControllerRoute(
    name: "admin",
    pattern: "admin/{action=Index}/{id?}",
    defaults: new { controller = "Admin" });

app.MapControllerRoute(
    name: "checkout",
    pattern: "checkout",
    defaults: new { controller = "Checkout", action = "Index" });

app.MapControllerRoute(
    name: "cart",
    pattern: "cart",
    defaults: new { controller = "WebsiteBuilder", action = "Preview" });

app.MapControllerRoute(
    name: "product",
    pattern: "products/{handle}",
    defaults: new { controller = "WebsiteBuilder", action = "Preview" });

app.MapControllerRoute(
    name: "collections",
    pattern: "collections",
    defaults: new { controller = "WebsiteBuilder", action = "Preview" });

app.MapControllerRoute(
    name: "collection",
    pattern: "collections/{handle}",
    defaults: new { controller = "WebsiteBuilder", action = "Preview" });

app.MapControllerRoute(
    name: "policies",
    pattern: "policies",
    defaults: new { controller = "WebsiteBuilder", action = "Preview" });

app.MapControllerRoute(
    name: "policy",
    pattern: "policies/{type}",
    defaults: new { controller = "WebsiteBuilder", action = "Preview" });

app.MapControllerRoute(
    name: "pages",
    pattern: "pages",
    defaults: new { controller = "WebsiteBuilder", action = "Preview" });

app.MapControllerRoute(
    name: "page",
    pattern: "pages/{handle}",
    defaults: new { controller = "WebsiteBuilder", action = "Preview" });

// Map API controllers
app.MapControllers();

app.Run();
