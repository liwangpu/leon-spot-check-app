using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using ApiModel;
using ApiServer.Data;
using System.Net;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Serialization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using ApiServer.Services;
using BambooCore;

namespace ApiServer
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //init config
            SiteConfig.Instance.Init(Configuration);

            services.AddCors(options => options.AddPolicy("AllowAll", p => p.AllowAnyOrigin()
                                                                .AllowAnyMethod()
                                                                 .AllowAnyHeader()
                                                                 .AllowCredentials()));

            services.AddEntityFrameworkNpgsql();
            services.AddDbContext<ApiDbContext>(options => options.UseNpgsql(Configuration.GetConnectionString("MainDb")));
                        
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = false,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = "damaozhu.com",
                        ValidAudience = "damaozhu.com",
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(SiteConfig.Instance.Json.TokenKey))
                    };
                    //login and logout hook
                    //options.Events = new JwtBearerEvents();
                    //options.Events.OnAuthenticationFailed  OnTokenValidated OnChallenge OnMessageReceived
                });

            services.AddMvc()
                .AddJsonOptions(opts =>
                {
                    // Force Camel Case to JSON
                    opts.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
                    //ignore Entity framework Navigation property back reference problem. Blog >> Posts. Post >> Blog. Blog.post.blog will been ignored.
                    opts.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
                });

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Swashbuckle.AspNetCore.Swagger.Info { Title = "Damaozhu API", Version = "v1" });
                string dirPath = System.IO.Path.GetDirectoryName(typeof(Startup).Assembly.CodeBase);
                string xmlPath = dirPath + "/ApiServer.xml";
                if (System.IO.File.Exists(xmlPath))
                    c.IncludeXmlComments(xmlPath);
                else
                    Console.WriteLine("xml file for swagger api doc is missing. publish version need copy it manually, check path " + xmlPath);
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, IServiceProvider serviceProvider)
        {
            app.UseCors("AllowAll");

            //if (env.IsDevelopment())
            //{
            //    app.UseDeveloperExceptionPage();
            //}
            
            app.UseStaticFiles(new StaticFileOptions { ServeUnknownFileTypes = true });//支持所有文件类型，否则会出现404
            //app.UseDirectoryBrowser();//调试用，访问/upload时显示文件夹清单

            //app.UseExceptionHandler(
            //  builder =>
            //  {
            //      builder.Run(
            //        async context =>
            //        {
            //            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            //            context.Response.Headers.Add("Access-Control-Allow-Origin", "*");

            //            var error = context.Features.Get<IExceptionHandlerFeature>();
            //            if (error != null)
            //            {
            //                context.Response.AddApplicationError(error.Error.Message);
            //                await context.Response.WriteAsync(error.Error.Message).ConfigureAwait(false);
            //            }
            //        });
            //  });


            app.UseAuthentication();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");

                // Uncomment the following line to add a route for porting Web API 2 controllers.
                //routes.MapWebApiRoute("DefaultApi", "api/{controller}/{id?}");
            });

            // Enable middleware to serve generated Swagger as a JSON endpoint.
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Damaozhu API V1");
            });

            //初始化站点服务
            InitSiteServices(serviceProvider);
        }

        /// <summary>
        /// 初始化站点服务
        /// </summary>
        /// <param name="serviceProvider"></param>
        void InitSiteServices(IServiceProvider serviceProvider)
        {
            var dbContext = serviceProvider.GetService<ApiDbContext>();            

            SiteConfig.JsonConfig json = SiteConfig.Instance.Json;

            //init guid generator
            GuidGen.Init(json.ServerId, json.GuidSalt, json.GuidMinLen);

            SiteConfig.Instance.ReloadSettingsFromDb(dbContext);

            //init db
            DbInitializer.InitDbIfItsEmpty(dbContext);
        }
    }
}
