﻿using System;
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
    [Route("api/user-role")]
    [ApiController]
    public class UserRoleController : ControllerBase
    {
        private readonly IUserRoleService _UserRoleService;
        ApiReturnObj returnObj = new ApiReturnObj();
        private readonly ModelContext _db = new ModelContext();
        public UserRoleController(IUserRoleService UserRoleServices, ModelContext db)
        {
            _UserRoleService = UserRoleServices;
            _db = db;
        }

        [HttpGet("view")]
        //[Authorize(Policy = "OnlyNonBlockedCustomer")]
        public IActionResult ExecutePrecedure()
        {
            try
            {
                var data = _UserRoleService.GetAll(_db);

                if (data != null)
                {
                    returnObj.IsExecuted = true;
                    returnObj.Data = data;
                    return Ok(returnObj);
                }
                else
                {
                    returnObj.IsExecuted = false;
                    returnObj.Message = MessageConst.NotFound;
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

        [HttpPost]
        [Route("duplicate-check")]
        public IActionResult DuplicateCheck(UserRole model)
        {
            try
            {
                var data = _UserRoleService.DuplicateCheck(_db, model);

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
        public IActionResult Add(List<UserRole> model)
        {
            try
            {
                var data = _UserRoleService.Add(model, _db);
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
        public IActionResult GetUserRoleById(int Id)
        {
            try
            {
                var data = _UserRoleService.GetUserRoleById(_db, Id);
                if (data != null)
                {
                    var getData = new UserRole();

                    getData.Id = data.Id;
                    getData.UserCategory = data.UserCategory;
                    getData.PathId = data.PathId;
                    getData.CreatedBy = data.CreatedBy;
                    getData.CreatedDate = data.CreatedDate;
                    getData.UpdatedBy = data.UpdatedBy;
                    getData.UpdatedDate = data.UpdatedDate;

                    returnObj.IsExecuted = true;
                    returnObj.Data = getData;
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
        public IActionResult updateById(UserRole model)
        {
            using (var dbTransaction = _db.Database.BeginTransaction())
            {
                try
                {
                    var data = _UserRoleService.UpdateUserRoleById(_db, model);
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
            var data = _UserRoleService.DeleteUserRole(_db, id);
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
