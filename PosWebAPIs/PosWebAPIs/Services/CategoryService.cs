using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using PosWebAPIs.Interfaces;
using PosWebAPIs.Models.DBModels;

namespace PosWebAPIs.Services
{
    public class CategoryService : ICategoryService
    {
        public bool DeleteCategory(ModelContext _db, int id)
        {
            bool isSaved = false;
            try
            {
                var data = _db.Categories.FirstOrDefault(x => x.Id == id);
                if (data != null)
                {
                    _db.Categories.Remove(data);
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

        public bool UpdateCategoryById(ModelContext _db, Category model)
        {
            bool isSaved = false;

            var isExistData = _db.Categories.AsQueryable().FirstOrDefault(x => x.Name == model.Name);
            if (isExistData == null)
            {
                var oldData = _db.Categories.FirstOrDefault(x => x.Id == model.Id);
                if (oldData != null)
                {
                    oldData.Name = model.Name;
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

        public Category GetCategoryById(ModelContext _db, int Id)
        {
            //var data = new List<Category>();
            var data = _db.Categories.FirstOrDefault(
                                     x => x.Id == Id
               );

            return data;
        }


        public dynamic GetAll(ModelContext _db)
        {
            var data = from ct in _db.Categories.AsNoTracking().ToList()
                       select new
                       {
                           id = (decimal)ct.Id,
                           name = ct.Name,
                           category_code = ct.CategoryCode,
                           created_by = ct.CreatedBy,
                           created_date = ct.CreatedDate

                       };

            return data.Distinct().OrderBy(x=>x.created_date);
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

        public bool Add(List<Category> model, ModelContext _db)
        {
            bool isSaved = false;
            string serial;
            int taracNumber = 1;

            var CategoryList = new List<Category>();
            
            foreach (var i in model)
            {
                var last = _db.Categories.OrderByDescending(x => x.Id).FirstOrDefault();
                if (last == null)
                    serial = "001";
                else
                {
                    taracNumber = int.Parse(last.CategoryCode) + 1;
                    if (taracNumber.ToString().Length >= 3)
                        serial = taracNumber.ToString();
                    else
                        serial = taracNumber.ToString()
                            .PadLeft(3, '0');
                }
                var obj = new Category();
                {
                    obj.Name = i.Name;
                    obj.CategoryCode = serial;
                    obj.CreatedBy = i.CreatedBy;
                    obj.CreatedDate = i.CreatedDate;
                }

                _db.Categories.AddRange(obj);
                _db.SaveChanges();
            };
            isSaved = true;
            return isSaved;
        }
    }
}
