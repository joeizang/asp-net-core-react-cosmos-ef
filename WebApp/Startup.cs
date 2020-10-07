using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Microsoft.Net.Http.Headers;
using WebApp.Options;
using WebApp.Repository;

namespace WebApp
{
    public class Startup
    {
        private const string ClientAppFolder = "ClientApp";

        private readonly IHostEnvironment _env;
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration, IHostEnvironment env)
        {
            _env = env;
            Configuration = configuration;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<CosmosDbOptions>(Configuration.GetSection(nameof(CosmosDbOptions)));

            services.AddDbContext<TasksContext>((provider, options) =>
            {
                var cosmosOptions = provider.GetService<IOptions<CosmosDbOptions>>().Value;

                options.UseCosmos(cosmosOptions.Account,
                    cosmosOptions.Key,
                    cosmosOptions.DatabaseName);
            });

            // for testing Cosmos without EF, comment out this
            services.AddScoped<IItemsRepo, ItemsRepoEf>();

            // for testing Cosmos without EF, comment in this
            //services.AddSingleton<IItemsRepo>(provider =>
            //{
            //    var cosmosOptions = provider.GetService<IOptions<CosmosDbOptions>>();

            //    return InitializeCosmosClientInstanceAsync(cosmosOptions.Value)
            //        .GetAwaiter()
            //        .GetResult();
            //});

            services.AddControllersWithViews();
            services.AddRazorPages();

            // In production, the React files will be served from this directory
            if (!_env.IsDevelopment())
            {
                services.AddSpaStaticFiles(configuration =>
                {
                    configuration.RootPath = $"{ClientAppFolder}/out";
                });
            }

            services.AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                    options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                })
                .AddCookie(options =>
                {
                    options.Cookie.Name = ".AspNet.SharedCookie";
                    options.Cookie.Path = "/";
                    options.LoginPath = "/Login";
                    options.LogoutPath = "/Login";
                    options.AccessDeniedPath = "/Error";
                });

            services.AddAuthorization(options =>
            {
                //options.FallbackPolicy = new AuthorizationPolicyBuilder()
                //    .RequireAuthenticatedUser()
                //    .Build();
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=TaskItemMvc}/{action=Index}/{id?}");

                endpoints.MapRazorPages();
            });

            const string spaPath = "/reactapp";
            if (env.IsDevelopment())
            {
                app.MapWhen(ctx => ctx.Request.Path.StartsWithSegments(spaPath),
                    client =>
                {
                    client.UseSpa(spa =>
                    {
                        spa.Options.SourcePath = ClientAppFolder;
                        spa.UseProxyToSpaDevelopmentServer("http://localhost:3000");
                    });
                });
            }
            else
            {
                app.Map(new PathString(spaPath), client =>
                {
                    // `https://github.com/dotnet/aspnetcore/issues/3147`
                    client.UseSpaStaticFiles(new StaticFileOptions
                    {
                        OnPrepareResponse = ctx =>
                        {
                            //if (ctx.Context.Request.Path.StartsWithSegments($"{spaPath}/_next/static"))
                            if (ctx.Context.Request.Path.ToString().Contains("_next/static"))
                            {
                                // Cache all static resources for 1 year (versioned file names)
                                var headers = ctx.Context.Response.GetTypedHeaders();
                                headers.CacheControl = new CacheControlHeaderValue
                                {
                                    Public = true,
                                    MaxAge = TimeSpan.FromDays(365)
                                };
                            }
                            else
                            {
                                // Do not cache explicit `/index.html` or any other files.  See also: `DefaultPageStaticFileOptions` below for implicit "/index.html"
                                var headers = ctx.Context.Response.GetTypedHeaders();
                                headers.CacheControl = new CacheControlHeaderValue
                                {
                                    Public = true,
                                    MaxAge = TimeSpan.FromDays(0)
                                };
                            }
                        }
                    });

                    client.UseSpa(spa =>
                    {
                        spa.Options.SourcePath = ClientAppFolder;

                        spa.Options.DefaultPageStaticFileOptions = new StaticFileOptions
                        {
                            OnPrepareResponse = ctx =>
                            {
                                // Do not cache implicit `/index.html`.  See also: `UseSpaStaticFiles` above
                                var headers = ctx.Context.Response.GetTypedHeaders();
                                headers.CacheControl = new CacheControlHeaderValue
                                {
                                    Public = true,
                                    MaxAge = TimeSpan.FromDays(0)
                                };
                            }
                        };
                    });
                });
            }
        }

        // ReSharper disable once UnusedMember.Local
        private static async Task<ItemsRepoCosmos> InitializeCosmosClientInstanceAsync(CosmosDbOptions cosmosDbOptions)
        {
            var client = new Microsoft.Azure.Cosmos.CosmosClient(
                cosmosDbOptions.Account, cosmosDbOptions.Key);

            var cosmosDbService = new ItemsRepoCosmos(
                client, cosmosDbOptions.DatabaseName, cosmosDbOptions.ContainerName);

            var database = await client.CreateDatabaseIfNotExistsAsync(
                cosmosDbOptions.DatabaseName);

            await database.Database.CreateContainerIfNotExistsAsync(
                cosmosDbOptions.ContainerName, "/id");

            return cosmosDbService;
        }
    }
}
