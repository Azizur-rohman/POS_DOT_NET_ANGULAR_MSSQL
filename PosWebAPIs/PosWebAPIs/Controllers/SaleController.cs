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
    [Route("api/sale")]
    [ApiController]
    public class SaleController : ControllerBase
    {
        private readonly ISaleService _SaleService;
        ApiReturnObj returnObj = new ApiReturnObj();
        private readonly ModelContext _db = new ModelContext();
        public SaleController(ISaleService SaleServices, ModelContext db)
        {
            _SaleService = SaleServices;
            _db = db;
        }

        [HttpGet("view")]
        //[Authorize(Policy = "OnlyNonBlockedCustomer")]
        public IActionResult ExecutePrecedure()
        {
            try
            {
                var data = _SaleService.GetAll(_db);

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

        [HttpGet("view-detail/{order_no}")]
        //[Authorize(Policy = "OnlyNonBlockedCustomer")]
        public IActionResult GetAllDetail(string order_no)
        {
            try
            {
                var data = _SaleService.GetAllDetail(_db, order_no);

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
        public IActionResult DuplicateCheck(Category model)
        {
            try
            {
                var data = _SaleService.DuplicateCheck(_db, model);

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

        [HttpPost("add")]
        public IActionResult Add(SaleFormDataModel model)
        {
            using (var dbTransaction = _db.Database.BeginTransaction())
            {
                try
                {
                    var data = _SaleService.Add(model, _db);
                    if (data)
                    {
                        dbTransaction.Commit();
                        returnObj.IsExecuted = true;
                        returnObj.Message = MessageConst.Insert;
                        return Ok(returnObj);
                    }
                    else
                    {
                        dbTransaction.Rollback();
                        returnObj.IsExecuted = false;
                        returnObj.Message = MessageConst.InsertError;
                        return Ok(returnObj);
                    }
                }
                catch (Exception ex)
                {
                    dbTransaction.Rollback();
                    returnObj.IsExecuted = false;
                    returnObj.Message = ex.Message;
                    return Ok(returnObj);
                }

            }

        }


        [HttpGet("single-entry/{Id}")]
        //[Authorize(Policy = "OnlyNonBlockedCustomer")]
        public IActionResult GetSaleById(int Id)
        {
            try
            {
                var data = _SaleService.GetSaleById(_db, Id);
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
        public IActionResult updateById(SaleFormDataModel model)
        {
            using (var dbTransaction = _db.Database.BeginTransaction())
            {
                try
                {
                    var data = _SaleService.UpdateSaleById(_db, model);
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
            var data = _SaleService.DeleteSale(_db, id);
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
