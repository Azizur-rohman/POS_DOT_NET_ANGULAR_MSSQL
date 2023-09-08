using System;
using System.Collections.Generic;
using System.Linq;
using Common.Helpers;
//using Common.Helpers;
//using Entities;
//using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PHubApi.Helpers;
using PosWebAPIs.Interfaces;
using PosWebAPIs.Models.DBModels;

namespace PosWebAPIs.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _UserService;
        ApiReturnObj returnObj = new ApiReturnObj();
        private readonly ModelContext _db = new ModelContext();
        public UserController(IUserService UserServices, ModelContext db)
        {
            _UserService = UserServices;
            _db = db;
        }

        [HttpGet("view")]
        //[Authorize(Policy = "OnlyNonBlockedCustomer")]
        public IActionResult ExecutePrecedure()
        {
            try
            {
                var data = _UserService.GetAll(_db);

                if (data != null)
                {
                    returnObj.IsExecuted = true;
                    returnObj.Data = data;
                    return Ok(returnObj);
                }
                else
                {
                    returnObj.IsExecuted = false;
                    returnObj.Message = "Not Found";
                    returnObj.Data = null;
                    return Ok(returnObj);
                }
            }
            catch (Exception ex)
            {
                returnObj.IsExecuted = false;
                returnObj.Message = ex.Message;
                returnObj.Data = null;
                return Ok(returnObj);
            }

            return Ok(returnObj);
        }

        [HttpPost("login/")]
        /*[Authorize(Policy = "OnlyNonBlockedCustomer")]*/
        public IActionResult CheckLogin(User formValue)
        {
            var data = _UserService.CheckLogin(_db, formValue.Name, formValue.Password);
            if (data != null)
            {
                returnObj.IsExecuted = true;
                returnObj.Data = data;
                return Ok(returnObj);
            }
            else
            {
                returnObj.IsExecuted = false;
                returnObj.Data = null;
                return Ok(returnObj);
            }
        }

        [HttpGet("user-role")]
        //[Authorize(Policy = "OnlyNonBlockedCustomer")]
        public IActionResult GetUserRole()
        {
                var data = _UserService.GetUserRoleAll(_db);

                if (data != null)
                {
                    returnObj.IsExecuted = true;
                    returnObj.Data = data;
                    return Ok(returnObj);
                }
                else
                {
                    returnObj.IsExecuted = false;
                    returnObj.Data = null;
                    return Ok(returnObj);
                }

            return Ok(returnObj);
        }
        [HttpPost]
        [Route("duplicate-check")]
        public IActionResult DuplicateCheck(User model)
        {
            try
            {
                var data = _UserService.DuplicateCheck(_db, model);

                if (data)
                {
                    returnObj.IsExecuted = false;
                    returnObj.Message = MessageConst.IsExist;
                    return Ok(returnObj);
                }
                else
                {
                    returnObj.IsExecuted = true;
                    return Ok(returnObj);
                }
            }
            catch (Exception ex)
            {
                returnObj.IsExecuted = false;
                returnObj.Message = ex.Message;
                return Ok(returnObj);
            }
        }

        [HttpPost("add/")]
        /*[Authorize(Policy = "OnlyNonBlockedCustomer")]*/
        public IActionResult Add(List<User> model)
        {
            try
            {
                var data = _UserService.Add(model, _db);
                if (data != null)
                {
                    returnObj.IsExecuted = true;
                    returnObj.Message = MessageConst.Insert;
                    returnObj.Data = data;
                    return Ok(returnObj);
                }
                else
                {

                    returnObj.Message = MessageConst.SystemError;
                    returnObj.IsExecuted = false;
                    returnObj.Data = null;
                    return Ok(returnObj);
                }
            }
            catch (Exception ex)
            {
                returnObj.IsExecuted = false;
                returnObj.Message = ex.Message;
                returnObj.Data = null;
                return Ok(returnObj);
            }
        }

        [HttpGet("single-entry/{Id}")]
        //[Authorize(Policy = "OnlyNonBlockedCustomer")]
        public IActionResult GetUserById(int Id)
        {
            try
            {
                var data = _UserService.GetUserById(_db, Id);
                if (data != null)
                {
                    returnObj.IsExecuted = true;
                    returnObj.Data = data;
                    return Ok(returnObj);
                }
                else
                {
                    returnObj.IsExecuted = false;
                    returnObj.Data = null;
                    return Ok(returnObj);
                }
            }
            catch (Exception ex)
            {
                returnObj.IsExecuted = false;
                returnObj.Message = ex.Message;
                returnObj.Data = null;
                return Ok(returnObj);
            }
        }

        [HttpPost("update/")]
        //[Authorize(Policy = "OnlyNonBlockedCustomer")]
        public IActionResult updateById(User model)
        {
            using (var dbTransaction = _db.Database.BeginTransaction())
            {
                try
                {
                    var data = _UserService.UpdateUserById(_db, model);
                    if (data)
                    {
                        dbTransaction.Commit();
                        returnObj.IsExecuted = true;
                        returnObj.Data = true;
                        returnObj.Message = MessageConst.Update;
                        return Ok(returnObj);
                    }
                    else
                    {
                        dbTransaction.Rollback();
                        returnObj.IsExecuted = false;
                        returnObj.Data = null;
                        returnObj.Message = MessageConst.IsExist;
                        return Ok(returnObj);
                    }
                }
                catch (Exception ex)
                {
                    dbTransaction.Rollback();
                    returnObj.IsExecuted = false;
                    returnObj.Data = null;
                    return Ok(returnObj);
                }
            }
        }

        [HttpPost("update-loggedin-time/")]
        //[Authorize(Policy = "OnlyNonBlockedCustomer")]
        public IActionResult UpdateUserLoggedInTime(User model)
        {
            using (var dbTransaction = _db.Database.BeginTransaction())
            {
                try
                {
                    var data = _UserService.UpdateUserLoggedInTime(_db, model);
                    if (data)
                    {
                        dbTransaction.Commit();
                        returnObj.IsExecuted = true;
                        returnObj.Data = true;
                        returnObj.Message = MessageConst.Update;
                        return Ok(returnObj);
                    }
                    else
                    {
                        dbTransaction.Rollback();
                        returnObj.IsExecuted = false;
                        returnObj.Data = null;
                        returnObj.Message = MessageConst.IsExist;
                        return Ok(returnObj);
                    }
                }
                catch (Exception ex)
                {
                    dbTransaction.Rollback();
                    returnObj.IsExecuted = false;
                    returnObj.Data = null;
                    return Ok(returnObj);
                }
            }
        }

        [HttpDelete("delete/{id}")]
        public IActionResult Delete(int id)
        {
            var data = _UserService.DeleteUser(_db, id);
            if (data)
            {
                returnObj.IsExecuted = true;
                returnObj.Message = MessageConst.Delete;
                returnObj.Data = true;
                return Ok(returnObj);
            }
            else
            {
                returnObj.IsExecuted = false;
                returnObj.Data = null;
                return Ok(returnObj);
            }
        }
    }
}
