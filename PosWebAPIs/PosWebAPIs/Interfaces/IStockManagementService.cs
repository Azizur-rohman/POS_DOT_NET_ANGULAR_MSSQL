//using Entities;
//using PHubApi.Helpers;
//using PHubApi.Model;
using PosWebAPIs.Models.DBModels;
using System.Collections.Generic;

namespace PosWebAPIs.Interfaces
{
    public interface IStockManagementService
    {
        dynamic GetAll(ModelContext _db);
        bool DuplicateCheck(ModelContext _db, StockManagement model);
        bool Add(List<StockManagement> model, ModelContext _db);
        StockManagement GetStockManagementById(ModelContext _db, int Id);
        bool UpdateStockManagementById(ModelContext _db, StockManagement model);
        bool DeleteStockManagement(ModelContext _db, int id);
    }
}
