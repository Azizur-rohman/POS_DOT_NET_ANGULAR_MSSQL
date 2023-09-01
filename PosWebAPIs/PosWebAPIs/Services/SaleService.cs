using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using PosWebAPIs.Interfaces;
using PosWebAPIs.Models.DBModels;

namespace PosWebAPIs.Services
{
    public static class EnumerableExtensions
    {
        public static IEnumerable<TSource> DistinctBy<TSource, TKey>(
            this IEnumerable<TSource> source,
            Func<TSource, TKey> keySelector)
        {
            HashSet<TKey> seenKeys = new HashSet<TKey>();
            foreach (TSource element in source)
            {
                if (seenKeys.Add(keySelector(element)))
                {
                    yield return element;
                }
            }
        }
    }
    public class SaleService : ISaleService
    {

        public bool DeleteSale(ModelContext _db, int id)
        {
            string OrderNo = "";
            var data = _db.Sales.FirstOrDefault(x => x.Id == id);
            if (data != null)
            {
                OrderNo = data.OrderNo;
            }
            var saledtl = _db.SaleDetails
                                       .Where(x => x.OrderNo == OrderNo)
                                       .ToList();
            try
            {
                _db.Sales.Remove(data);
                _db.SaleDetails.RemoveRange(saledtl);

                _db.SaveChanges();

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public bool UpdateSaleById(ModelContext _db, SaleFormDataModel model)
        {
            bool isSaved = false;
            var saleForm = model.saleForm;
            var saleDtlArr = model.saleDtlArr;
            var deleteSaleDtlArr = model.deleteSaleDtlArr;
            var saleDtlList = new List<SaleDetail>();

            try
            {
                var sl = _db.Sales.FirstOrDefault(x => x.Id == saleForm.Id);
                if (sl != null)
                {
                    sl.CustomerName = saleForm.CustomerName;
                    sl.CustomerPhone = saleForm.CustomerPhone;
                    sl.CustomerAddress = saleForm.CustomerAddress;
                    sl.Discount = saleForm.Discount;
                    sl.Vat = saleForm.Vat;
                    sl.TotalAmount = saleForm.TotalAmount;
                    sl.GrandTotalAmount = saleForm.GrandTotalAmount;
                    sl.UpdatedBy = saleForm.UpdatedBy;
                    sl.UpdatedDate = DateTime.Now;

                    _db.Entry(sl).State = EntityState.Modified;
                }

                if (saleDtlArr != null)
                {
                    foreach (var j in saleDtlArr)
                    {
                        if (j.Id > 0)
                        {
                            var slDtl = _db.SaleDetails.FirstOrDefault(x => x.Id == j.Id);
                            if (slDtl != null)
                            {
                                slDtl.ProductCode = j.ProductCode;
                                slDtl.CategoryCode = j.CategoryCode;
                                slDtl.SalePrice = j.SalePrice;
                                slDtl.Quantity = j.Quantity;
                                slDtl.SubTotalAmount = j.SubTotalAmount;
                                slDtl.UpdatedBy = saleForm.UpdatedBy;
                                slDtl.UpdatedDate = DateTime.Now;
                                _db.Entry(slDtl).State = EntityState.Modified;
                            }
                        }
                        else
                        {
                            var obj = new SaleDetail
                            {

                                OrderNo = saleForm.OrderNo,
                                ProductCode = j.ProductCode,
                                CategoryCode = j.CategoryCode,
                                SalePrice = j.SalePrice,
                                Quantity = j.Quantity,
                                SubTotalAmount = j.SubTotalAmount,
                                CreatedBy = saleForm.UpdatedBy,
                                CreatedDate = DateTime.Now
                            };
                            saleDtlList.Add(obj);
                        }
                    }
                }
                if(deleteSaleDtlArr != null)
                {

                    foreach (var k in deleteSaleDtlArr)
                    {
                        if (k.Id > 0)
                        {
                            var deleteSlDtl = _db.SaleDetails.FirstOrDefault(x => x.Id == k.Id);
                            if (deleteSlDtl != null)
                            {
                                _db.SaleDetails.Remove(deleteSlDtl);
                            }
                        }
                    }
                }
                _db.SaleDetails.AddRange(saleDtlList);
                _db.SaveChanges();
                isSaved = true;
            }
            catch (Exception)
            {
                isSaved = false;
            }
            return isSaved;
        }

        public dynamic GetSaleById(ModelContext _db, int Id)
        {
            var obj = _db.Sales.FirstOrDefault(x => x.Id == Id);
            if (obj != null)
            {
                var master = from a in _db.Sales
                                        .AsQueryable()
                                        .Where(x => x.Id == Id)
                             select new Sale
                             {
                                 Id = a.Id,
                                 OrderNo = a.OrderNo,
                                 CustomerName = a.CustomerName,
                                 CustomerPhone = a.CustomerPhone,
                                 CustomerAddress = a.CustomerAddress,
                                 TotalAmount = a.TotalAmount,
                                 Discount = a.Discount,
                                 Vat = a.Vat,
                                 GrandTotalAmount = a.GrandTotalAmount,
                             };

                var details = from a in _db.SaleDetails
                                            .AsQueryable()
                                            .Where(x => x.OrderNo == obj.OrderNo)
                                            .ToList()
                              select new SaleDetail
                              {
                                  Id = a.Id,
                                  ProductCode = a.ProductCode,
                                  CategoryCode = a.CategoryCode,
                                  SalePrice = a.SalePrice,
                                  Quantity = a.Quantity,
                                  SubTotalAmount = a.SubTotalAmount,
                              };
                var data = new { master, details };
                return data;
            }
            else
            {
                return null;
            }
        }


        public dynamic GetAll(ModelContext _db)
        {
            var data = (from sl in _db.Sales.AsNoTracking().ToList()
                        select new
                        {
                            id = (decimal)sl.Id,
                            order_no = sl.OrderNo,
                            customer_name = sl.CustomerName,
                            customer_phone = sl.CustomerPhone,
                            customer_address = sl.CustomerAddress,
                            total_amount = sl.TotalAmount,
                            discount = sl.Discount,
                            vat = sl.Vat,
                            grand_total_amount = sl.GrandTotalAmount,
                            created_by = sl.CreatedBy,
                            created_date = sl.CreatedDate
                        }).OrderBy(x => x.id);
            return data;
        }

        public dynamic GetAllDetail(ModelContext _db, string order_no)
        {
            var detailsData = (from sl in _db.SaleDetails.AsNoTracking().ToList()
                               where sl.OrderNo == order_no
                               select new
                               {
                                   id = (decimal)sl.Id,
                                   order_no = sl.OrderNo,
                                   category_code = sl.CategoryCode,
                                   category_name = _db.Categories.AsNoTracking().FirstOrDefault(x => x.CategoryCode == sl.CategoryCode)?.Name,
                                   product_code = sl.ProductCode,
                                   product_name = _db.Products.AsNoTracking().FirstOrDefault(x => x.ProductCode == sl.ProductCode)?.Name,
                                   sale_price = sl.SalePrice,
                                   quantity = sl.Quantity,
                                   sub_total_amount = sl.SubTotalAmount,
                                   created_by = sl.CreatedBy,
                                   created_date = sl.CreatedDate

                               }).OrderBy(x => x.id);

            return detailsData;
        }

        public bool DuplicateCheck(ModelContext _db, Category model)
        {
            bool isDuplicate = false;
            var data = _db.Categories.AsQueryable().FirstOrDefault(x => x.Name == model.Name);
            if (data != null)
            {
                isDuplicate = true;
            }

            return isDuplicate;
        }

        public bool Add(SaleFormDataModel model, ModelContext _db)
        {
            bool isSaved = false;
            var saleForm = model.saleForm;
            var saleDtlArr = model.saleDtlArr;
            var saleList = new List<Sale>();
            var saleDtlList = new List<SaleDetail>();
            var data = model;
            string code;
            string subst;
            string aftersubst;
            int taracNumber = 1;
            decimal? serial;

            try
            {
                var sale = new Sale
                {
                    OrderNo = saleForm.OrderNo,
                    CustomerName = saleForm.CustomerName,
                    CustomerPhone = saleForm.CustomerPhone,
                    CustomerAddress = saleForm.CustomerAddress,
                    TotalAmount = saleForm.TotalAmount,
                    Discount = saleForm.Discount,
                    Vat = saleForm.Vat,
                    GrandTotalAmount = saleForm.GrandTotalAmount,
                    CreatedBy = saleForm.CreatedBy,
                    CreatedDate = DateTime.Now
                };
                saleList.Add(sale);

                if (saleDtlArr != null)
                {
                    foreach (var j in saleDtlArr)
                    {
                        var slDtl = _db.StockManagements.FirstOrDefault(x => x.Product == j.ProductCode);
                        if (slDtl != null)
                        {
                            slDtl.Quantity = slDtl.Quantity - j.Quantity;
                            _db.Entry(slDtl).State = EntityState.Modified;
                        }

                        var obj = new SaleDetail
                        {
                            OrderNo = saleForm.OrderNo,
                            ProductCode = j.ProductCode,
                            CategoryCode = j.CategoryCode,
                            SalePrice = j.SalePrice,
                            Quantity = j.Quantity,
                            SubTotalAmount = j.SubTotalAmount,
                            CreatedBy = saleForm.CreatedBy,
                            CreatedDate = DateTime.Now
                        };
                        saleDtlList.Add(obj);
                    }
                }
                _db.Sales.AddRange(saleList);
                _db.SaleDetails.AddRange(saleDtlList);
                _db.SaveChanges();

                isSaved = true;
            }
            catch (Exception)
            {
                isSaved = false;
            }
            return isSaved;
        }
    }
}
