using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PHubApi.Helpers
{
    public static class Toastr
    {
        public static string Added => "toastr.success('Information successfully Added!', 'Success!');";
        public static string Updated => "toastr.success('Information successfully Updated!', 'Success!');";
        public static string Deleted => "toastr.success('Information successfully Deleted!', 'Success!');";
        public static string BadRequest => "toastr.error('Bad request!', 'Error!');";
        public static string ValidationError => "toastr.error('Validation Error!', 'Error!');";
        public static string ServerError => "toastr.error('Server Error!', 'Error!');";
        public static string HttpNotFound => "toastr.error('Information not found!', 'Error!');";

        public static string DbError(string exceptionMessage) =>
            !string.IsNullOrWhiteSpace(exceptionMessage)
                ? $"toastr.error(\"{exceptionMessage}\", 'Database Error!');"
                : @"toastr.error('Error occured in database, Try again!', 'Database Error!');";

        public static string Error(string errorMessage) => $"toastr.error(\"{errorMessage}\", 'Error!');";
        public static string Error(string errorTitle, string errorMessage) => $"toastr.error(\"{errorMessage}\", \"{errorTitle}\");";
        public static string Success(string successMessage) => $"toastr.success(\"{successMessage}\", 'Success!');";
        public static string Success(string successTitle, string successMessage) => $"toastr.success(\"{successMessage}\", \"{successTitle}\");";
    }
}
