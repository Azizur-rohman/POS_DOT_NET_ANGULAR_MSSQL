//using Entities;
//using PHubApi.Helpers;
//using PHubApi.Model;
using PosWebAPIs.Models.DBModels;
using System.Collections.Generic;

namespace PosWebAPIs.Interfaces
{
    public interface ISaleService
    {
        dynamic GetAll(ModelContext _db);
        dynamic GetOrderDetails(ModelContext _db);
        dynamic GetAllDetail(ModelContext _db, string order_no);
        bool DuplicateCheck(ModelContext _db, Category model);
        bool Add(SaleFormDataModel model, ModelContext _db);
        dynamic GetSaleById(ModelContext _db, int Id);
        bool UpdateSaleById(ModelContext _db, SaleFormDataModel model);
        bool DeleteSale(ModelContext _db, int id);
    }
}
