using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using System.Collections.Concurrent;
using Hotel.Data;

namespace Hotel.Middleware
{
    /// <summary>
    /// Middleware que intercepta peticiones de dominios personalizados y las redirige al Website Builder Preview.
    /// Este middleware permite que múltiples dominios apunten al mismo preview mientras mantiene
    /// el sistema administrativo accesible por su IP o dominio principal.
    /// </summary>
    public class CustomDomainMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<CustomDomainMiddleware> _logger;
        private readonly IConfiguration _configuration;
        private readonly IServiceProvider _serviceProvider;
        
        // Cache estático para dominios activos (compartido entre todas las peticiones)
        private static readonly ConcurrentDictionary<string, CustomDomainCacheEntry> _domainCache = new();
        private static readonly TimeSpan CacheDuration = TimeSpan.FromMinutes(5);

        public CustomDomainMiddleware(
            RequestDelegate next,
            ILogger<CustomDomainMiddleware> logger,
            IConfiguration configuration,
            IServiceProvider serviceProvider)
        {
            _next = next ?? throw new ArgumentNullException(nameof(next));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
            _serviceProvider = serviceProvider ?? throw new ArgumentNullException(nameof(serviceProvider));
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                var host = context.Request.Host.Host?.ToLowerInvariant() ?? string.Empty;
                
                _logger.LogDebug($"[CustomDomainMiddleware] Processing request for host: {host}");

                // Obtener la lista de dominios del sistema desde configuración
                var systemDomains = _configuration.GetSection("SystemDomains:AllowedHosts")
                    .Get<List<string>>() ?? new List<string>();

                // Si es un dominio del sistema, continuar con el pipeline normal
                if (IsSystemDomain(host, systemDomains))
                {
                    _logger.LogDebug($"[CustomDomainMiddleware] System domain detected: {host}, bypassing custom domain check");
                    await _next(context);
                    return;
                }

                // Verificar si es un dominio personalizado activo
                // Primero intentar obtener del cache
                if (_domainCache.TryGetValue(host, out var cachedEntry) && 
                    cachedEntry.Expiration > DateTime.UtcNow)
                {
                    _logger.LogDebug($"[CustomDomainMiddleware] Domain found in cache: {host}");
                    
                    if (cachedEntry.IsActive)
                    {
                        // Usar datos del cache
                        context.Items["IsCustomDomain"] = true;
                        context.Items["CustomDomainId"] = cachedEntry.DomainId;
                        context.Items["WebSiteId"] = cachedEntry.WebSiteId;
                        
                        var originalPath = context.Request.Path.Value ?? "/";
                        if (originalPath == "/")
                        {
                            context.Request.Path = "/WebsiteBuilder/Preview";
                        }
                        
                        _logger.LogDebug($"[CustomDomainMiddleware] Request path: {originalPath} -> {context.Request.Path} (from cache)");
                    }
                }
                else
                {
                    // No está en cache, consultar la base de datos
                    using (var scope = _serviceProvider.CreateScope())
                    {
                        var dbContext = scope.ServiceProvider.GetRequiredService<HotelDbContext>();
                        
                        var customDomain = await dbContext.CustomDomains
                            .AsNoTracking()
                            .Include(cd => cd.WebSite)
                            .FirstOrDefaultAsync(cd => 
                                cd.DomainName == host && 
                                cd.IsActive == true &&
                                cd.Status == "active");

                        // Actualizar cache
                        var cacheEntry = new CustomDomainCacheEntry
                        {
                            IsActive = customDomain != null,
                            DomainId = customDomain?.Id ?? 0,
                            WebSiteId = customDomain?.WebSiteId ?? 0,
                            Expiration = DateTime.UtcNow.Add(CacheDuration)
                        };
                        
                        _domainCache.AddOrUpdate(host, cacheEntry, (key, old) => cacheEntry);

                        if (customDomain != null)
                        {
                            _logger.LogInformation($"[CustomDomainMiddleware] Custom domain found: {host} (ID: {customDomain.Id}, WebSiteId: {customDomain.WebSiteId})");
                            
                            // Guardar información del dominio personalizado en Items para uso posterior
                            context.Items["IsCustomDomain"] = true;
                            context.Items["CustomDomainId"] = customDomain.Id;
                            context.Items["WebSiteId"] = customDomain.WebSiteId;
                            
                            // Preservar el path original para que las rutas del preview funcionen correctamente
                            var originalPath = context.Request.Path.Value ?? "/";
                            
                            // Si la ruta es la raíz, redirigir al preview
                            if (originalPath == "/")
                            {
                                context.Request.Path = "/WebsiteBuilder/Preview";
                            }
                            // Si la ruta es una de las rutas del website, dejar que el routing normal la maneje
                            // Las rutas como /cart, /products, etc. ya están mapeadas a WebsiteBuilder/Preview en Program.cs
                            
                            _logger.LogDebug($"[CustomDomainMiddleware] Request path: {originalPath} -> {context.Request.Path}");
                        }
                        else
                        {
                            _logger.LogWarning($"[CustomDomainMiddleware] No active custom domain found for host: {host}");
                        }
                    }
                }

                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[CustomDomainMiddleware] Error processing custom domain request");
                // En caso de error, continuar con el pipeline normal
                await _next(context);
            }
        }

        /// <summary>
        /// Determina si el host es un dominio del sistema (no un dominio personalizado)
        /// </summary>
        private bool IsSystemDomain(string host, List<string> systemDomains)
        {
            // Verificar lista de configuración
            if (systemDomains.Any(sd => host.Equals(sd, StringComparison.OrdinalIgnoreCase)))
            {
                return true;
            }

            // Verificar patrones comunes de desarrollo y Azure
            if (host.Contains("localhost", StringComparison.OrdinalIgnoreCase) ||
                host.Contains("127.0.0.1") ||
                host.Contains("::1") ||
                host.Contains("azurewebsites.net", StringComparison.OrdinalIgnoreCase) ||
                host.Contains("azure.com", StringComparison.OrdinalIgnoreCase) ||
                host.EndsWith(".local", StringComparison.OrdinalIgnoreCase))
            {
                return true;
            }

            return false;
        }
    }

    /// <summary>
    /// Clase para almacenar en cache la información de dominios personalizados
    /// </summary>
    internal class CustomDomainCacheEntry
    {
        public bool IsActive { get; set; }
        public int DomainId { get; set; }
        public int WebSiteId { get; set; }
        public DateTime Expiration { get; set; }
    }

    /// <summary>
    /// Extension methods para facilitar el registro del middleware
    /// </summary>
    public static class CustomDomainMiddlewareExtensions
    {
        public static IApplicationBuilder UseCustomDomainRouting(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<CustomDomainMiddleware>();
        }
    }
}