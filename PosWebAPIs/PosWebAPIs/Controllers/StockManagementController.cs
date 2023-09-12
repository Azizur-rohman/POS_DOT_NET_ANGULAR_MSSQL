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
    [Route("api/stock-management")]
    [ApiController]
    public class StockManagementController : ControllerBase
    {
        private readonly IStockManagementService _StockManagementService;
        ApiReturnObj returnObj = new ApiReturnObj();
        private readonly ModelContext _db = new ModelContext();
        public StockManagementController(IStockManagementService StockManagementService, ModelContext db)
        {
            _StockManagementService = StockManagementService;
            _db = db;
        }

        [HttpGet("view")]
        //[Authorize(Policy = "OnlyNonBlockedCustomer")]
        public IActionResult ExecutePrecedure()
        {
            try
            {
                var data = _StockManagementService.GetAll(_db);

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

        [HttpGet("view-all-product-purchase-history")]
        //[Authorize(Policy = "OnlyNonBlockedCustomer")]
        public IActionResult GetAllProductPurchaseHistory()
        {
            try
            {
                var data = _StockManagementService.GetAllProductPurchaseHistory(_db);

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
        public IActionResult DuplicateCheck(StockManagement model)
        {
            try
            {
                var data = _StockManagementService.DuplicateCheck(_db, model);

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
        public IActionResult Add(List<StockManagement> model)
        {
            try
            {
                var data = _StockManagementService.Add(model, _db);
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
        public IActionResult GetStockManagementById(int Id)
        {
            try
            {
                var data = _StockManagementService.GetStockManagementById(_db, Id);
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
        public IActionResult updateById(StockManagement model)
        {
            using (var dbTransaction = _db.Database.BeginTransaction())
            {
                try
                {
                    var data = _StockManagementService.UpdateStockManagementById(_db, model);
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
            var data = _StockManagementService.DeleteStockManagement(_db, id);
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
