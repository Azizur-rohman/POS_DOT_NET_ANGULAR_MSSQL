using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

#nullable disable

namespace PosWebAPIs.Models.DBModels
{
    public partial class ModelContext : DbContext
    {
        public ModelContext()
        {
        }

        public ModelContext(DbContextOptions<ModelContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Category> Categories { get; set; }
        public virtual DbSet<MenuPath> MenuPaths { get; set; }
        public virtual DbSet<Product> Products { get; set; }
        public virtual DbSet<Sale> Sales { get; set; }
        public virtual DbSet<SaleDetail> SaleDetails { get; set; }
        public virtual DbSet<StockManagement> StockManagements { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<UserCategory> UserCategories { get; set; }
        public virtual DbSet<UserRole> UserRoles { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseSqlServer("Data Source=DESKTOP-QV4K23J\\SQLEXPRESS;Initial Catalog=POS;Integrated Security=True");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Category>(entity =>
            {
                entity.ToTable("Category");

                entity.Property(e => e.CategoryCode).HasMaxLength(50);

                entity.Property(e => e.CreatedBy).HasMaxLength(50);

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.Name).HasMaxLength(50);

                entity.Property(e => e.UpdatedBy).HasMaxLength(50);

                entity.Property(e => e.UpdatedDate).HasColumnType("datetime");
            });

            modelBuilder.Entity<MenuPath>(entity =>
            {
                entity.ToTable("Menu_Path");

                entity.Property(e => e.CreatedBy).HasMaxLength(50);

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.Path).HasMaxLength(50);

                entity.Property(e => e.PathId).HasMaxLength(50);

                entity.Property(e => e.UpdatedBy).HasMaxLength(50);

                entity.Property(e => e.UpdatedDate).HasColumnType("datetime");
            });

            modelBuilder.Entity<Product>(entity =>
            {
                entity.ToTable("Product");

                entity.Property(e => e.Category).HasMaxLength(50);

                entity.Property(e => e.CreatedBy).HasMaxLength(50);

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.Name).HasMaxLength(50);

                entity.Property(e => e.Price).HasColumnType("decimal(18, 0)");

                entity.Property(e => e.ProductCode).HasMaxLength(50);

                entity.Property(e => e.UpdatedBy).HasMaxLength(50);

                entity.Property(e => e.UpdatedDate).HasColumnType("datetime");
            });

            modelBuilder.Entity<Sale>(entity =>
            {
                entity.ToTable("Sale");

                entity.Property(e => e.CreatedBy).HasMaxLength(50);

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.CustomerName).HasMaxLength(50);

                entity.Property(e => e.CustomerPhone).HasMaxLength(14);

                entity.Property(e => e.GrandTotalAmount).HasColumnType("decimal(18, 0)");

                entity.Property(e => e.TotalAmount).HasColumnType("decimal(18, 0)");

                entity.Property(e => e.UpdatedBy).HasMaxLength(50);

                entity.Property(e => e.UpdatedDate).HasColumnType("datetime");
            });

            modelBuilder.Entity<SaleDetail>(entity =>
            {
                entity.ToTable("Sale_Detail");

                entity.Property(e => e.CategoryCode).HasMaxLength(50);

                entity.Property(e => e.CreatedBy).HasMaxLength(50);

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.ProductCode).HasMaxLength(50);

                entity.Property(e => e.SalePrice).HasColumnType("decimal(18, 0)");

                entity.Property(e => e.SubTotalAmount).HasColumnType("decimal(18, 0)");

                entity.Property(e => e.UpdatedBy).HasMaxLength(50);

                entity.Property(e => e.UpdatedDate).HasColumnType("datetime");
            });

            modelBuilder.Entity<StockManagement>(entity =>
            {
                entity.ToTable("Stock_Management");

                entity.Property(e => e.Category).HasMaxLength(50);

                entity.Property(e => e.CreatedBy).HasMaxLength(50);

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.Product).HasMaxLength(50);

                entity.Property(e => e.SalePrice)
                    .HasColumnType("decimal(18, 0)")
                    .HasColumnName("Sale_Price");

                entity.Property(e => e.UpdatedBy).HasMaxLength(50);

                entity.Property(e => e.UpdatedDate).HasColumnType("datetime");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("User");

                entity.Property(e => e.Address).HasMaxLength(100);

                entity.Property(e => e.CreatedBy).HasMaxLength(50);

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.Name).HasMaxLength(50);

                entity.Property(e => e.Password).HasMaxLength(50);

                entity.Property(e => e.PhoneNumber)
                    .HasMaxLength(14)
                    .IsFixedLength(true);

                entity.Property(e => e.UpdatedBy).HasMaxLength(50);

                entity.Property(e => e.UpdatedDate).HasColumnType("datetime");

                entity.Property(e => e.UserCategory).HasMaxLength(10);

                entity.Property(e => e.UserId).HasMaxLength(10);
            });

            modelBuilder.Entity<UserCategory>(entity =>
            {
                entity.ToTable("User_Category");

                entity.Property(e => e.CreatedBy).HasMaxLength(50);

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.UpdatedBy).HasMaxLength(50);

                entity.Property(e => e.UpdatedDate).HasColumnType("datetime");

                entity.Property(e => e.UserCategoryCode).HasMaxLength(10);

                entity.Property(e => e.UserCategoryName).HasMaxLength(50);
            });

            modelBuilder.Entity<UserRole>(entity =>
            {
                entity.ToTable("User_Role");

                entity.Property(e => e.CreatedBy).HasMaxLength(50);

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.PathId).HasMaxLength(10);

                entity.Property(e => e.UpdatedBy).HasMaxLength(50);

                entity.Property(e => e.UpdatedDate).HasColumnType("datetime");

                entity.Property(e => e.UserCategory).HasMaxLength(10);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
