using Microsoft.EntityFrameworkCore;
using Hotel.Models;

namespace Hotel.Data
{
    public class HotelDbContext : DbContext
    {
        public HotelDbContext(DbContextOptions<HotelDbContext> options)
            : base(options)
        {
        }

        // DbSets para las tablas
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Guest> Guests { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<RoomType> RoomTypes { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Company> Companies { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<RolePermission> RolePermissions { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<WebSite> WebSites { get; set; }
        public DbSet<Collection> Collections { get; set; }
        public DbSet<CollectionProduct> CollectionProducts { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductImage> ProductImages { get; set; }
        public DbSet<ProductVideo> ProductVideos { get; set; }
        public DbSet<ProductVariant> ProductVariants { get; set; }
        public DbSet<Page> Pages { get; set; }
        public DbSet<Policy> Policies { get; set; }
        
        // DbSets para Customer (Guest) relacionados
        public DbSet<CustomerAddress> CustomerAddresses { get; set; }
        public DbSet<CustomerPaymentMethod> CustomerPaymentMethods { get; set; }
        public DbSet<CustomerDevice> CustomerDevices { get; set; }
        public DbSet<CustomerNotificationPreference> CustomerNotificationPreferences { get; set; }
        
        // DbSets para sistema de pagos
        public DbSet<PaymentGateway> PaymentGateways { get; set; }
        public DbSet<PaymentTransaction> PaymentTransactions { get; set; }
        
        // DbSet para dominios personalizados
        public DbSet<CustomDomain> CustomDomains { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuración de Room
            modelBuilder.Entity<Room>()
                .HasIndex(r => r.RoomNumber)
                .IsUnique();

            // Configuración de Guest
            modelBuilder.Entity<Guest>()
                .HasIndex(g => g.Email)
                .IsUnique();
                
            modelBuilder.Entity<Guest>()
                .HasIndex(g => g.CustomerId)
                .IsUnique();
                
            modelBuilder.Entity<Guest>()
                .HasIndex(g => g.Username)
                .IsUnique();
                
            modelBuilder.Entity<Guest>()
                .Property(g => g.TotalSpent)
                .HasPrecision(18, 2);
                
            modelBuilder.Entity<Guest>()
                .Property(g => g.AccountBalance)
                .HasPrecision(18, 2);
                
            modelBuilder.Entity<Guest>()
                .Property(g => g.ProfileImageUrl)
                .HasColumnType("text");
                
            // Configuración de relaciones Customer
            modelBuilder.Entity<CustomerAddress>()
                .HasOne(ca => ca.Guest)
                .WithMany(g => g.Addresses)
                .HasForeignKey(ca => ca.GuestId)
                .OnDelete(DeleteBehavior.Cascade);
                
            modelBuilder.Entity<CustomerPaymentMethod>()
                .HasOne(cpm => cpm.Guest)
                .WithMany(g => g.PaymentMethods)
                .HasForeignKey(cpm => cpm.GuestId)
                .OnDelete(DeleteBehavior.Cascade);
                
            modelBuilder.Entity<CustomerDevice>()
                .HasOne(cd => cd.Guest)
                .WithMany(g => g.Devices)
                .HasForeignKey(cd => cd.GuestId)
                .OnDelete(DeleteBehavior.Cascade);
                
            modelBuilder.Entity<CustomerNotificationPreference>()
                .HasOne(cnp => cnp.Guest)
                .WithMany(g => g.NotificationPreferences)
                .HasForeignKey(cnp => cnp.GuestId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configuración de Reservation
            modelBuilder.Entity<Reservation>()
                .HasOne(r => r.Product)
                .WithMany(product => product.Reservations)
                .HasForeignKey(r => r.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Reservation>()
                .HasOne(r => r.Guest)
                .WithMany(g => g.Reservations)
                .HasForeignKey(r => r.GuestId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Reservation>()
                .Property(r => r.TotalAmount)
                .HasPrecision(18, 2);

            // Configuración de PaymentTransaction
            modelBuilder.Entity<PaymentTransaction>()
                .HasOne(pt => pt.Reservation)
                .WithMany()
                .HasForeignKey(pt => pt.ReservationId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PaymentTransaction>()
                .Property(pt => pt.Amount)
                .HasPrecision(18, 2);

            modelBuilder.Entity<PaymentTransaction>()
                .Property(pt => pt.Tax)
                .HasPrecision(18, 2);

            modelBuilder.Entity<PaymentTransaction>()
                .HasIndex(pt => pt.OrderId);

            modelBuilder.Entity<PaymentTransaction>()
                .HasIndex(pt => pt.TransactionId);

            // Configuración de Payment
            modelBuilder.Entity<Payment>()
                .Property(p => p.Amount)
                .HasPrecision(18, 2);

            // Configuración de RoomType
            modelBuilder.Entity<RoomType>()
                .Property(rt => rt.BasePrice)
                .HasPrecision(18, 2);

            // Configuración de Role y Permission (many-to-many)
            modelBuilder.Entity<RolePermission>()
                .HasKey(rp => new { rp.RoleId, rp.PermissionId });

            modelBuilder.Entity<RolePermission>()
                .HasOne(rp => rp.Role)
                .WithMany(r => r.RolePermissions)
                .HasForeignKey(rp => rp.RoleId);

            modelBuilder.Entity<RolePermission>()
                .HasOne(rp => rp.Permission)
                .WithMany(p => p.RolePermissions)
                .HasForeignKey(rp => rp.PermissionId);

            // Configuración de User
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(u => u.UserName)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasOne(u => u.Role)
                .WithMany()
                .HasForeignKey(u => u.RoleId)
                .OnDelete(DeleteBehavior.SetNull);

            // Configuración de WebSite
            modelBuilder.Entity<WebSite>()
                .HasIndex(w => w.Subdomain)
                .IsUnique();

            modelBuilder.Entity<WebSite>()
                .HasIndex(w => w.CustomDomain)
                .IsUnique()
                .HasFilter("\"CustomDomain\" IS NOT NULL");

            modelBuilder.Entity<WebSite>()
                .HasOne(w => w.Company)
                .WithMany()
                .HasForeignKey(w => w.CompanyId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configurar propiedades JSON como jsonb en PostgreSQL
            modelBuilder.Entity<WebSite>()
                .Property(w => w.GlobalThemeSettingsJson)
                .HasColumnType("jsonb");
                
            modelBuilder.Entity<WebSite>()
                .Property(w => w.SectionsConfigJson)
                .HasColumnType("jsonb");

            modelBuilder.Entity<WebSite>()
                .Property(w => w.PagesJson)
                .HasColumnType("jsonb");

            // Configuración de Collection
            modelBuilder.Entity<Collection>()
                .HasIndex(c => c.Handle)
                .IsUnique();

            modelBuilder.Entity<Collection>()
                .Property(c => c.SalesChannels)
                .HasColumnType("jsonb");

            modelBuilder.Entity<Collection>()
                .Property(c => c.ImageUrl)
                .HasColumnType("text");

            // Configuración de CollectionProduct (relación muchos a muchos)
            modelBuilder.Entity<CollectionProduct>()
                .HasKey(cp => new { cp.CollectionId, cp.ProductId });

            modelBuilder.Entity<CollectionProduct>()
                .HasOne(cp => cp.Collection)
                .WithMany(c => c.CollectionProducts)
                .HasForeignKey(cp => cp.CollectionId)
                .OnDelete(DeleteBehavior.Cascade);

            // Relación con Product
            modelBuilder.Entity<CollectionProduct>()
                .HasOne(cp => cp.Product)
                .WithMany(p => p.CollectionProducts)
                .HasForeignKey(cp => cp.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<WebSite>()
                .Property(w => w.NavigationJson)
                .HasColumnType("jsonb");

            modelBuilder.Entity<WebSite>()
                .Property(w => w.SeoSettingsJson)
                .HasColumnType("jsonb");

            // Configuración de CustomDomain
            modelBuilder.Entity<CustomDomain>()
                .HasIndex(cd => cd.DomainName)
                .IsUnique();
                
            modelBuilder.Entity<CustomDomain>()
                .HasOne(cd => cd.WebSite)
                .WithMany()
                .HasForeignKey(cd => cd.WebSiteId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configuración de Product
            modelBuilder.Entity<Product>()
                .HasIndex(p => p.Handle)
                .IsUnique();

            modelBuilder.Entity<Product>()
                .Property(p => p.Price)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Product>()
                .Property(p => p.CompareAtPrice)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Product>()
                .Property(p => p.CostPerItem)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Product>()
                .Property(p => p.Weight)
                .HasPrecision(10, 3);

            // Configuración de ProductImage
            modelBuilder.Entity<ProductImage>()
                .HasOne(pi => pi.Product)
                .WithMany(p => p.Images)
                .HasForeignKey(pi => pi.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ProductImage>()
                .Property(pi => pi.ImageUrl)
                .HasColumnType("text");

            // Configuración de ProductVideo
            modelBuilder.Entity<ProductVideo>()
                .HasOne(pv => pv.Product)
                .WithMany(p => p.Videos)
                .HasForeignKey(pv => pv.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ProductVideo>()
                .Property(pv => pv.VideoUrl)
                .HasColumnType("text");

            modelBuilder.Entity<ProductVideo>()
                .Property(pv => pv.ThumbnailUrl)
                .HasColumnType("text");

            // Configuración de ProductVariant
            modelBuilder.Entity<ProductVariant>()
                .HasOne(pv => pv.Product)
                .WithMany(p => p.Variants)
                .HasForeignKey(pv => pv.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ProductVariant>()
                .Property(pv => pv.Price)
                .HasPrecision(18, 2);

            modelBuilder.Entity<ProductVariant>()
                .Property(pv => pv.CompareAtPrice)
                .HasPrecision(18, 2);

            modelBuilder.Entity<ProductVariant>()
                .Property(pv => pv.CostPerItem)
                .HasPrecision(18, 2);

            modelBuilder.Entity<ProductVariant>()
                .Property(pv => pv.Weight)
                .HasPrecision(10, 3);

            // Configuración de Page
            modelBuilder.Entity<Page>()
                .HasIndex(p => new { p.CompanyId, p.Handle })
                .IsUnique();

            modelBuilder.Entity<Page>()
                .Property(p => p.Content)
                .HasColumnType("text");

            modelBuilder.Entity<Page>()
                .HasOne(p => p.Company)
                .WithMany()
                .HasForeignKey(p => p.CompanyId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configuración de Policy
            modelBuilder.Entity<Policy>()
                .HasIndex(p => p.CompanyId)
                .IsUnique();

            modelBuilder.Entity<Policy>()
                .Property(p => p.RefundPolicyContent)
                .HasColumnType("text");

            modelBuilder.Entity<Policy>()
                .Property(p => p.PrivacyPolicyContent)
                .HasColumnType("text");

            modelBuilder.Entity<Policy>()
                .Property(p => p.TermsOfServiceContent)
                .HasColumnType("text");

            modelBuilder.Entity<Policy>()
                .Property(p => p.ShippingPolicyContent)
                .HasColumnType("text");

            modelBuilder.Entity<Policy>()
                .Property(p => p.ContactInformationContent)
                .HasColumnType("text");

            modelBuilder.Entity<Policy>()
                .HasOne(p => p.Company)
                .WithMany()
                .HasForeignKey(p => p.CompanyId)
                .OnDelete(DeleteBehavior.Restrict);

            // Datos semilla para RoomTypes
            modelBuilder.Entity<RoomType>().HasData(
                new RoomType { Id = 1, Name = "Individual", Description = "Habitación individual estándar", BasePrice = 50.00m, MaxOccupancy = 1 },
                new RoomType { Id = 2, Name = "Doble", Description = "Habitación doble estándar", BasePrice = 80.00m, MaxOccupancy = 2 },
                new RoomType { Id = 3, Name = "Suite", Description = "Suite de lujo", BasePrice = 150.00m, MaxOccupancy = 4 },
                new RoomType { Id = 4, Name = "Suite Presidencial", Description = "Suite presidencial de lujo", BasePrice = 300.00m, MaxOccupancy = 6 }
            );

            // Datos semilla para Permissions basados en el menú lateral
            var permissions = new List<Permission>();
            int permissionId = 1;
            
            // Empresa
            permissions.Add(new Permission { Id = permissionId++, Module = "Empresa", Action = "Read", Description = "Ver información de empresa", DisplayOrder = 1 });
            permissions.Add(new Permission { Id = permissionId++, Module = "Empresa", Action = "Write", Description = "Editar información de empresa", DisplayOrder = 1 });
            permissions.Add(new Permission { Id = permissionId++, Module = "Empresa", Action = "Create", Description = "Crear información de empresa", DisplayOrder = 1 });
            
            // Roles
            permissions.Add(new Permission { Id = permissionId++, Module = "Roles", Action = "Read", Description = "Ver roles", DisplayOrder = 2 });
            permissions.Add(new Permission { Id = permissionId++, Module = "Roles", Action = "Write", Description = "Editar roles", DisplayOrder = 2 });
            permissions.Add(new Permission { Id = permissionId++, Module = "Roles", Action = "Create", Description = "Crear roles", DisplayOrder = 2 });
            
            // Usuarios
            permissions.Add(new Permission { Id = permissionId++, Module = "Usuarios", Action = "Read", Description = "Ver usuarios", DisplayOrder = 3 });
            permissions.Add(new Permission { Id = permissionId++, Module = "Usuarios", Action = "Write", Description = "Editar usuarios", DisplayOrder = 3 });
            permissions.Add(new Permission { Id = permissionId++, Module = "Usuarios", Action = "Create", Description = "Crear usuarios", DisplayOrder = 3 });
            
            // Clientes
            permissions.Add(new Permission { Id = permissionId++, Module = "Clientes", Action = "Read", Description = "Ver clientes", DisplayOrder = 4 });
            permissions.Add(new Permission { Id = permissionId++, Module = "Clientes", Action = "Write", Description = "Editar clientes", DisplayOrder = 4 });
            permissions.Add(new Permission { Id = permissionId++, Module = "Clientes", Action = "Create", Description = "Crear clientes", DisplayOrder = 4 });
            
            // Sitio Web
            permissions.Add(new Permission { Id = permissionId++, Module = "SitioWeb", Action = "Read", Description = "Ver configuración del sitio web", DisplayOrder = 5 });
            permissions.Add(new Permission { Id = permissionId++, Module = "SitioWeb", Action = "Write", Description = "Editar configuración del sitio web", DisplayOrder = 5 });
            permissions.Add(new Permission { Id = permissionId++, Module = "SitioWeb", Action = "Create", Description = "Crear contenido del sitio web", DisplayOrder = 5 });
            
            // Colecciones
            permissions.Add(new Permission { Id = permissionId++, Module = "Colecciones", Action = "Read", Description = "Ver colecciones", DisplayOrder = 6 });
            permissions.Add(new Permission { Id = permissionId++, Module = "Colecciones", Action = "Write", Description = "Editar colecciones", DisplayOrder = 6 });
            permissions.Add(new Permission { Id = permissionId++, Module = "Colecciones", Action = "Create", Description = "Crear colecciones", DisplayOrder = 6 });
            
            // Productos
            permissions.Add(new Permission { Id = permissionId++, Module = "Productos", Action = "Read", Description = "Ver productos", DisplayOrder = 7 });
            permissions.Add(new Permission { Id = permissionId++, Module = "Productos", Action = "Write", Description = "Editar productos", DisplayOrder = 7 });
            permissions.Add(new Permission { Id = permissionId++, Module = "Productos", Action = "Create", Description = "Crear productos", DisplayOrder = 7 });
            
            // Páginas
            permissions.Add(new Permission { Id = permissionId++, Module = "Páginas", Action = "Read", Description = "Ver páginas", DisplayOrder = 8 });
            permissions.Add(new Permission { Id = permissionId++, Module = "Páginas", Action = "Write", Description = "Editar páginas", DisplayOrder = 8 });
            permissions.Add(new Permission { Id = permissionId++, Module = "Páginas", Action = "Create", Description = "Crear páginas", DisplayOrder = 8 });
            
            // Políticas
            permissions.Add(new Permission { Id = permissionId++, Module = "Políticas", Action = "Read", Description = "Ver políticas", DisplayOrder = 9 });
            permissions.Add(new Permission { Id = permissionId++, Module = "Políticas", Action = "Write", Description = "Editar políticas", DisplayOrder = 9 });
            permissions.Add(new Permission { Id = permissionId++, Module = "Políticas", Action = "Create", Description = "Crear políticas", DisplayOrder = 9 });
            
            // Reservations
            permissions.Add(new Permission { Id = permissionId++, Module = "Reservations", Action = "Read", Description = "Ver reservaciones", DisplayOrder = 10 });
            permissions.Add(new Permission { Id = permissionId++, Module = "Reservations", Action = "Write", Description = "Editar reservaciones", DisplayOrder = 10 });
            permissions.Add(new Permission { Id = permissionId++, Module = "Reservations", Action = "Create", Description = "Crear reservaciones", DisplayOrder = 10 });
            
            // Dominios
            permissions.Add(new Permission { Id = permissionId++, Module = "Dominios", Action = "Read", Description = "Ver dominios personalizados", DisplayOrder = 11 });
            permissions.Add(new Permission { Id = permissionId++, Module = "Dominios", Action = "Write", Description = "Editar dominios personalizados", DisplayOrder = 11 });
            permissions.Add(new Permission { Id = permissionId++, Module = "Dominios", Action = "Create", Description = "Crear dominios personalizados", DisplayOrder = 11 });

            modelBuilder.Entity<Permission>().HasData(permissions);

            // Datos semilla para Roles
            modelBuilder.Entity<Role>().HasData(
                new Role { Id = 1, Name = "Administrator", Description = "Acceso completo al sistema", IsActive = true },
                new Role { Id = 2, Name = "Manager", Description = "Acceso de gestión", IsActive = true },
                new Role { Id = 3, Name = "Support", Description = "Acceso de soporte", IsActive = true },
                new Role { Id = 4, Name = "Users", Description = "Acceso básico de usuario", IsActive = true }
            );
        }
    }
}