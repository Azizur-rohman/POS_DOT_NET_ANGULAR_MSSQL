using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using PosWebAPIs.Interfaces;
using PosWebAPIs.Models.DBModels;

namespace PosWebAPIs.Services
{
    public class UserCategoryService : IUserCategoryService
    {
        public bool DeleteUserCategory(ModelContext _db, int id)
        {
            bool isSaved = false;
            try
            {
                var data = _db.UserCategories.FirstOrDefault(x => x.Id == id);
                if (data != null)
                {
                    _db.UserCategories.Remove(data);
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

        public bool UpdateUserCategoryById(ModelContext _db, UserCategory model)
        {
            bool isSaved = false;

            var isExistData = _db.UserCategories.AsQueryable().FirstOrDefault(x => x.UserCategoryName == model.UserCategoryName);
            if (isExistData == null)
            {
                var oldData = _db.UserCategories.FirstOrDefault(x => x.Id == model.Id);
                if (oldData != null)
                {
                    oldData.UserCategoryName = model.UserCategoryName;
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

        public UserCategory GetUserCategoryById(ModelContext _db, int Id)
        {
            var data = _db.UserCategories.FirstOrDefault(x => x.Id == Id);
            if (data != null)
            {
                var getData = new UserCategory();

                getData.Id = data.Id;
                getData.UserCategoryName = data.UserCategoryName;
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
            var data = from ct in _db.UserCategories.AsNoTracking().ToList()
                       select new
                       {
                           id = (decimal)ct.Id,
                           user_category_name = ct.UserCategoryName,
                           user_category_code = ct.UserCategoryCode,
                           created_by = ct.CreatedBy,
                           created_date = ct.CreatedDate

                       };

            return data.Distinct().OrderBy(x=>x.created_date);
        }

        public bool DuplicateCheck(ModelContext _db, UserCategory model)
        {
            bool isDuplicate = false;
            var data = _db.UserCategories.AsQueryable().FirstOrDefault(x => x.UserCategoryName == model.UserCategoryName);
            if (data != null)
            {
                isDuplicate = true;
            }

            return isDuplicate;
        }

        public bool Add(List<UserCategory> model, ModelContext _db)
        {
            bool isSaved = false;
            string serial;
            int taracNumber = 1;

            var CategoryList = new List<UserCategory>();
            
            foreach (var i in model)
            {
                var last = _db.UserCategories.OrderByDescending(x => x.Id).FirstOrDefault();
                if (last == null)
                    serial = "001";
                else
                {
                    taracNumber = int.Parse(last.UserCategoryCode) + 1;
                    if (taracNumber.ToString().Length >= 3)
                        serial = taracNumber.ToString();
                    else
                        serial = taracNumber.ToString()
                            .PadLeft(3, '0');
                }
                var obj = new UserCategory();
                {
                    obj.UserCategoryName = i.UserCategoryName;
                    obj.UserCategoryCode = serial;
                    obj.CreatedBy = i.CreatedBy;
                    obj.CreatedDate = i.CreatedDate;
                }

                _db.UserCategories.AddRange(obj);
                _db.SaveChanges();
            };
            isSaved = true;
            return isSaved;
        }
    }
}
