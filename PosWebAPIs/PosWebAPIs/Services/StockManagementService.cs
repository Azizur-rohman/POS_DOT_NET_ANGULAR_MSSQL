using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using PosWebAPIs.Interfaces;
using PosWebAPIs.Models.DBModels;

namespace PosWebAPIs.Services
{
    public class StockManagementService : IStockManagementService
    {
        public bool DeleteStockManagement(ModelContext _db, int id)
        {
            bool isSaved = false;
            try
            {
                var data = _db.StockManagements.FirstOrDefault(x => x.Id == id);
                if (data != null)
                {
                    _db.StockManagements.Remove(data);
                    _db.SaveChanges();
                }
                isSaved = true;
            }
            catch (Exception ex)
            {
                isSaved = false;
            }
            return isSaved;
        }

        public bool UpdateStockManagementById(ModelContext _db, StockManagement model)
        {
            bool isSaved = false;

            var isExistData = _db.StockManagements.AsQueryable().FirstOrDefault(x => x.SalePrice == model.SalePrice && x.Quantity == model.Quantity);
            if (isExistData == null)
            {
                var oldData = _db.StockManagements.FirstOrDefault(x => x.Id == model.Id);
                if (oldData != null)
                {
                    oldData.SalePrice = model.SalePrice;
                    oldData.Quantity = model.Quantity;
                    oldData.UpdatedBy = model.UpdatedBy;
                    oldData.UpdatedDate = model.UpdatedDate;

                    _db.Entry(oldData).State = EntityState.Modified;
                    _db.SaveChanges();
                    isSaved = true;
                }
            }
            else
            {
                isSaved = false;
            }
            return isSaved;
        }

        public StockManagement GetStockManagementById(ModelContext _db, int Id)
        {
            var data = _db.StockManagements.FirstOrDefault(x => x.Id == Id);
            if (data != null)
            {
                var getData = new StockManagement();

                getData.Id = data.Id;
                getData.Product = data.Product;
                getData.Category = data.Category;
                getData.SalePrice = data.SalePrice;
                getData.Quantity = data.Quantity;
                getData.CreatedBy = data.CreatedBy;
                getData.CreatedDate = data.CreatedDate;
                getData.UpdatedBy = data.UpdatedBy;
                getData.UpdatedDate = data.UpdatedDate;

                return getData;
            }
            else
            {
                return null;
            }
        }


        public dynamic GetAll(ModelContext _db)
        {
            //string base64Image = Convert.ToBase64String(imageBytes);
            var data = from a in _db.StockManagements.AsNoTracking().ToList()
                       select new
                       {

                           id = (decimal)a.Id,
                           productCode = a.Product,
                           product = _db.Products.FirstOrDefault(x => x.ProductCode == a.Product)?.Name,
                           categoryCode = a.Category,
                           category = _db.Categories.FirstOrDefault(x=>x.CategoryCode == a.Category)?.Name,
                           image = _db.Products.FirstOrDefault(x => x.ProductCode == a.Product)?.Image,
                           product_price = _db.Products.FirstOrDefault(x => x.ProductCode == a.Product)?.Price,
                           sale_price = a.SalePrice,
                           quantity = a.Quantity,
                           created_by = a.CreatedBy,
                           created_date = a.CreatedDate

                       };

            return data.Distinct().OrderByDescending(x=>x.id);
        }

        public dynamic GetAllProductPurchaseHistory(ModelContext _db)
        {
            //string base64Image = Convert.ToBase64String(imageBytes);
            var data = from a in _db.ProductPurchaseHistories.AsNoTracking().ToList()
                       select new
                       {

                           id = (decimal)a.Id,
                           productCode = a.Product,
                           product = _db.Products.FirstOrDefault(x => x.ProductCode == a.Product)?.Name,
                           categoryCode = a.Category,
                           category = _db.Categories.FirstOrDefault(x => x.CategoryCode == a.Category)?.Name,
                           image = _db.Products.FirstOrDefault(x => x.ProductCode == a.Product)?.Image,
                           purchase_price = a.PurchasePrice,
                           sale_price = a.SalePrice,
                           quantity = a.Quantity,
                           created_by = a.CreatedBy,
                           created_date = a.CreatedDate

                       };

            return data.Distinct().OrderByDescending(x => x.id);
        }

        public bool DuplicateCheck(ModelContext _db, StockManagement model)
        {
            bool isDuplicate = false;
            var data = _db.StockManagements.AsQueryable().FirstOrDefault(x => x.Product == model.Product && x.Category == model.Category);
            if (data != null)
            {
                isDuplicate = true;
            }

            return isDuplicate;
        }

        public bool Add(List<StockManagement> model, ModelContext _db)
        {
            bool isSaved = false;

            foreach (var i in model)
            {
                var obj = new StockManagement();
                {
                    obj.Product = i.Product;
                    obj.Category = i.Category;
                    obj.SalePrice = i.SalePrice;
                    obj.Quantity = i.Quantity;
                    obj.CreatedBy = i.CreatedBy;
                    obj.CreatedDate = i.CreatedDate;
                }

                var objProductPurchaseHistory = new ProductPurchaseHistory();
                {
                    objProductPurchaseHistory.Product = i.Product;
                    objProductPurchaseHistory.Category = i.Category;
                    objProductPurchaseHistory.PurchasePrice = i.PurchasePrice;
                    objProductPurchaseHistory.SalePrice = i.SalePrice;
                    objProductPurchaseHistory.Quantity = i.Quantity;
                    objProductPurchaseHistory.CreatedBy = i.CreatedBy;
                    objProductPurchaseHistory.CreatedDate = i.CreatedDate;
                }

                _db.StockManagements.AddRange(obj);
                _db.ProductPurchaseHistories.AddRange(objProductPurchaseHistory);
                _db.SaveChanges();
            };
            isSaved = true;
            return isSaved;
        }
    }
}
