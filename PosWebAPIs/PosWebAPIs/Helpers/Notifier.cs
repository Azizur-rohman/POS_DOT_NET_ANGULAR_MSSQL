using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PHubApi.Helpers
{
    public static class Notifier
    {
        public static string Message { get; private set; }

        public static void Remove() => Message = string.Empty;

        public static RedirectToRouteResult Notify(this RedirectToRouteResult result, string toastrMessage)
        {
            Message = toastrMessage;
            return result;
        }

        public static ViewResult Notify(this ViewResult result, string toastrMessage)
        {
            Message = toastrMessage;
            return result;
        }

        public static RedirectToRouteResult NotifySuccess(this RedirectToRouteResult result, string message)
        {
            Message = Toastr.Success(message);
            return result;
        }

        public static RedirectToRouteResult NotifyError(this RedirectToRouteResult result, string message)
        {
            Message = Toastr.Error(message);
            return result;
        }

        public static RedirectToRouteResult NotifyServerError(this RedirectToRouteResult result)
        {
            Message = Toastr.ServerError;
            return result;
        }

        public static RedirectToRouteResult NotifyBadRequest(this RedirectToRouteResult result)
        {
            Message = Toastr.BadRequest;
            return result;
        }

        public static RedirectToRouteResult NotifyValidationError(this RedirectToRouteResult result)
        {
            Message = Toastr.ValidationError;
            return result;
        }

        public static RedirectToRouteResult NotifyHttpNotFound(this RedirectToRouteResult result)
        {
            Message = Toastr.HttpNotFound;
            return result;
        }


        public static ViewResult NotifySuccess(this ViewResult result, string message)
        {
            Message = Toastr.Success(message);
            return result;
        }

        public static ViewResult NotifyError(this ViewResult result, string message)
        {
            Message = Toastr.Error(message);
            return result;
        }

        public static ViewResult NotifyServerError(this ViewResult result)
        {
            Message = Toastr.ServerError;
            return result;
        }

        public static ViewResult NotifyBadRequest(this ViewResult result)
        {
            Message = Toastr.BadRequest;
            return result;
        }

        public static ViewResult NotifyValidationError(this ViewResult result)
        {
            Message = Toastr.ValidationError;
            return result;
        }

        public static ViewResult NotifyHttpNotFound(this ViewResult result)
        {
            Message = Toastr.ValidationError;
            return result;
        }

        public static RedirectResult NotifySuccess(this RedirectResult result, string message)
        {
            Message = Toastr.Success(message);
            return result;
        }

        public static RedirectResult NotifyError(this RedirectResult result, string message)
        {
            Message = Toastr.Error(message);
            return result;
        }

        public static RedirectResult NotifyServerError(this RedirectResult result)
        {
            Message = Toastr.ServerError;
            return result;
        }

        public static RedirectResult NotifyBadRequest(this RedirectResult result)
        {
            Message = Toastr.BadRequest;
            return result;
        }

        public static RedirectResult NotifyValidationError(this RedirectResult result)
        {
            Message = Toastr.ValidationError;
            return result;
        }

        public static RedirectResult NotifyHttpNotFound(this RedirectResult result)
        {
            Message = Toastr.ValidationError;
            return result;
        }


        public static void NotifySuccess(string message) => Message = Toastr.Success(message);
        public static void NotifyError(string message) => Message = Toastr.Error(message);
    }
}
