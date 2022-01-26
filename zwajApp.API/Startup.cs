using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Data;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Stripe;
using zwajApp.API.Data;
using zwajApp.API.Helpers;
using zwajApp.API.Models;
namespace zwajApp.API
{
    public class Startup
    {
     
        public Startup(IConfiguration configuration)
        {
            this.Configuration = configuration;

        }
        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<DataContext>(x => x.UseSqlite(Configuration.GetConnectionString("DefaultConnection")));
            
            IdentityBuilder builder = services.AddIdentityCore<User>(opt =>{
                opt.Password.RequireDigit = false;
                opt.Password.RequiredLength = 4;
                opt.Password.RequireNonAlphanumeric = false;
                opt.Password.RequireUppercase =false;
            });
            builder = new IdentityBuilder(builder.UserType, typeof(Role),builder.Services);
            builder.AddEntityFrameworkStores<DataContext>();
            builder.AddRoleValidator<RoleValidator<Role>>();
            builder.AddRoleManager<RoleManager<Role>>();
            builder.AddSignInManager<SignInManager<User>>();

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(Options =>{
                Options.TokenValidationParameters = new TokenValidationParameters{
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes
                    (Configuration.GetSection("AppSettings:Token").Value)),
                    ValidateIssuer = false,
                    ValidateAudience = false

                };
            });    

            services.AddAuthorization(
                Options =>{
                    Options.AddPolicy("RequireAdminRole",policy=>policy.RequireRole("Admin"));
                    Options.AddPolicy("ModeratePhotoRole",policy=>policy.RequireRole("Admin","Moderator"));
                    Options.AddPolicy("VipOnly",policy=>policy.RequireRole("VIP"));

                }
            );   
            services.AddMvc(options =>{
                var policy = new AuthorizationPolicyBuilder()
                .RequireAuthenticatedUser()
                .Build();
                options.Filters.Add(new AuthorizeFilter(policy));
            }).SetCompatibilityVersion(CompatibilityVersion.Version_2_1)
            .AddJsonOptions(Options => {
                Options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
            });
            
            services.AddCors();
            services.AddSignalR();
            services.AddAutoMapper();
        //   Mapper.Reset();
            services.Configure<CloudinarySettings>(Configuration.GetSection("CloudinarySettins"));
            services.Configure<StripeSettings>(Configuration.GetSection("Srtipe"));
            services.AddTransient<TrialData>();
            // services.AddScoped<IAuthRepository, AuthRepository>();
            services.AddScoped<IzwajRepository,ZwajRepository>();
            services.AddScoped<LogUserActivity>();
            //Authentication MiddleWare
            // services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            // .AddJwtBearer(Options =>{
            //     Options.TokenValidationParameters = new TokenValidationParameters{
            //         ValidateIssuerSigningKey = true,
            //         IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes
            //         (Configuration.GetSection("AppSettings:Token").Value)),
            //         ValidateIssuer = false,
            //         ValidateAudience = false

            //     };
            // });
        }

        private void JwtBearerDefault(AuthenticationOptions obj)
        {
            throw new NotImplementedException();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        [Obsolete]
        public void Configure(IApplicationBuilder app, IHostingEnvironment env,TrialData trialData)
        {
            StripeConfiguration.SetApiKey(Configuration.GetSection("Srtipe:Secretkey").Value);
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                //  app.UseHsts();
                app.UseExceptionHandler(BuilderExtensions =>{
                    BuilderExtensions.Run(async context =>{
                        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                        var error = context.Features.Get<IExceptionHandlerFeature>();
                        if(error != null){
                            context.Response.AddApplicationError(error.Error.Message);
                            await context.Response.WriteAsync(error.Error.Message);
                        }
                    });
                });

            }

            //app.UseHttpsRedirection();
            
        //  trialData.TrialUsers();
            app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader().AllowCredentials());
           app.UseSignalR(routes => {
               routes.MapHub<ChatHub>("/chat");
           });
            app.UseAuthentication();
            app.UseMvc();
        }
    }
}
