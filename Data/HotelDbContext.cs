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

            // Configuración de Reservation
            modelBuilder.Entity<Reservation>()
                .HasOne(r => r.Room)
                .WithMany(room => room.Reservations)
                .HasForeignKey(r => r.RoomId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Reservation>()
                .HasOne(r => r.Guest)
                .WithMany(g => g.Reservations)
                .HasForeignKey(r => r.GuestId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Reservation>()
                .Property(r => r.TotalAmount)
                .HasPrecision(18, 2);

            // Configuración de Payment
            modelBuilder.Entity<Payment>()
                .Property(p => p.Amount)
                .HasPrecision(18, 2);

            // Configuración de RoomType
            modelBuilder.Entity<RoomType>()
                .Property(rt => rt.BasePrice)
                .HasPrecision(18, 2);

            // Datos semilla para RoomTypes
            modelBuilder.Entity<RoomType>().HasData(
                new RoomType { Id = 1, Name = "Individual", Description = "Habitación individual estándar", BasePrice = 50.00m, MaxOccupancy = 1 },
                new RoomType { Id = 2, Name = "Doble", Description = "Habitación doble estándar", BasePrice = 80.00m, MaxOccupancy = 2 },
                new RoomType { Id = 3, Name = "Suite", Description = "Suite de lujo", BasePrice = 150.00m, MaxOccupancy = 4 },
                new RoomType { Id = 4, Name = "Suite Presidencial", Description = "Suite presidencial de lujo", BasePrice = 300.00m, MaxOccupancy = 6 }
            );
        }
    }
}