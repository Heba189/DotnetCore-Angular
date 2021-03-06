using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
namespace zwajApp.API.Helpers
{
    public static class Extensions
    {
        public static void AddApplicationError(this HttpResponse response ,string message){
            response.Headers.Add("Application-Error",message);
            response.Headers.Add("Access-Control-Expose-Headers","Application-Error");
            response.Headers.Add("Access-control-Allow-Origin","*");
        }
        public static int CalculateAge(this DateTime dateTime){
            var age = DateTime.Today.Year -dateTime.Year;
            if(dateTime.AddYears(age) > DateTime.Today) age--;
            return age;
        }
        public static void AddPagination(this HttpResponse response,int currentPage,int itemsPerPage,int totalItems,int totalPages){
            var paginationHeader = new PaginationHeader(currentPage,itemsPerPage,totalItems,totalPages);
            var camelCasFormater = new JsonSerializerSettings();
            camelCasFormater.ContractResolver = new CamelCasePropertyNamesContractResolver();
            response.Headers.Add("Pagination",JsonConvert.SerializeObject(paginationHeader,camelCasFormater));
            response.Headers.Add("Access-control-Expose-Headers","Pagination");
        }

    }
}