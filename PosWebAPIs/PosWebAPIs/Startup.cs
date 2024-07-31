using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using PosWebAPIs.Interfaces;
using PosWebAPIs.Models.DBModels;
using PosWebAPIs.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PosWebAPIs
{
    public class Startup
    {
        readonly string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            string connectionString = Configuration.GetConnectionString("POS");

            // Register the data service in the dependency injection container

            services.AddDbContext<ModelContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("POS")));

            services.AddScoped<IUserService, UserService>();
            services.AddScoped<ICategoryService, CategoryService>();
            services.AddScoped<IProductService>(sp => new ProductService(connectionString));
            services.AddScoped<IStockManagementService, StockManagementService>();
            services.AddScoped<IUserCategoryService, UserCategoryService>();
            services.AddScoped<ISaleService, SaleService>();
            services.AddScoped<IUserRoleService, UserRoleService>();
            services.AddScoped<IMenuPathService, MenuPathService>();
            services.AddScoped<IMenuService, MenuService>();
            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "PosWebAPIs", Version = "v1" });
            });
            services.AddCors(options =>
            {
                //options.AddPolicy(MyAllowSpecificOrigins,
                //                  builder =>
                //                  {
                //                      builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
                //                  });
                options.AddPolicy(MyAllowSpecificOrigins, builder => builder
                 .SetIsOriginAllowed(_ => true)
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials()
                );
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment() || env.IsProduction())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "PosWebAPIs v1"));
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseCors(MyAllowSpecificOrigins);

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
