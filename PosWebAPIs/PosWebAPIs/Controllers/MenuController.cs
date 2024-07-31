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
    [Route("api/menu")]
    [ApiController]
    public class MenuController : ControllerBase
    {
        private readonly IMenuService _MenuService;
        ApiReturnObj returnObj = new ApiReturnObj();
        private readonly ModelContext _db = new ModelContext();
        public MenuController(IMenuService MenuService, ModelContext db)
        {
            _MenuService = MenuService;
            _db = db;
        }

        [HttpGet("view")]
        //[Authorize(Policy = "OnlyNonBlockedCustomer")]
        public IActionResult ExecutePrecedure()
        {
            try
            {
                var data = _MenuService.GetAll(_db);

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
        public IActionResult DuplicateCheck(Menu model)
        {
            try
            {
                var data = _MenuService.DuplicateCheck(_db, model);

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
        public IActionResult Add(List<Menu> model)
        {
            try
            {
                var data = _MenuService.Add(model, _db);
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
        public IActionResult GetMenuPathById(int Id)
        {
            try
            {
                var data = _MenuService.GetMenuById(_db, Id);
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
        public IActionResult updateById(Menu model)
        {
            using (var dbTransaction = _db.Database.BeginTransaction())
            {
                try
                {
                    var data = _MenuService.UpdateMenuById(_db, model);
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
            var data = _MenuService.DeleteMenu(_db, id);
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
