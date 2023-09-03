using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using PosWebAPIs.Interfaces;
using PosWebAPIs.Models.DBModels;

namespace PosWebAPIs.Services
{
    public class UserRoleService : IUserRoleService
    {
        public bool DeleteUserRole(ModelContext _db, int id)
        {
            bool isSaved = false;
            try
            {
                var data = _db.UserRoles.FirstOrDefault(x => x.Id == id);
                if (data != null)
                {
                    _db.UserRoles.Remove(data);
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

        public bool UpdateUserRoleById(ModelContext _db, UserRole model)
        {
            bool isSaved = false;

            var isExistData = _db.UserRoles.AsQueryable().FirstOrDefault(x => x.UserCategory == model.UserCategory && x.PathId == model.PathId);
            if (isExistData == null)
            {
                var oldData = _db.UserRoles.FirstOrDefault(x => x.Id == model.Id);
                if (oldData != null)
                {
                    oldData.UserCategory = model.UserCategory;
                    oldData.PathId = model.PathId;
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

        public UserRole GetUserRoleById(ModelContext _db, int Id)
        {
            var data = _db.UserRoles.FirstOrDefault(x => x.Id == Id);
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

                return getData;
            }
            else
            {
                return null;
            }
        }


        public dynamic GetAll(ModelContext _db)
        {
            var data = from ct in _db.UserRoles.AsNoTracking().ToList()
                       select new
                       {
                           id = (decimal)ct.Id,
                           user_category_code = ct.UserCategory,
                           user_category = _db.UserCategories.AsNoTracking().FirstOrDefault(x=> x.UserCategoryCode ==ct.UserCategory)?.UserCategoryName,
                           path_id = ct.PathId,
                           path = _db.MenuPaths.AsNoTracking().FirstOrDefault(x => x.PathId == ct.PathId)?.Path,
                           created_by = ct.CreatedBy,
                           created_date = ct.CreatedDate

                       };

            return data.Distinct().OrderBy(x=>x.created_date);
        }

        public bool DuplicateCheck(ModelContext _db, UserRole model)
        {
            bool isDuplicate = false;
            var data = _db.UserRoles.AsQueryable().FirstOrDefault(x => x.PathId == model.PathId && x.UserCategory == model.UserCategory);
            if (data != null)
            {
                isDuplicate = true;
            }

            return isDuplicate;
        }

        public bool Add(List<UserRole> model, ModelContext _db)
        {
            bool isSaved = false;
            
            foreach (var i in model)
            {
                var obj = new UserRole();
                {
                    obj.UserCategory = i.UserCategory;
                    obj.PathId = i.PathId;
                    obj.CreatedBy = i.CreatedBy;
                    obj.CreatedDate = i.CreatedDate;
                }

                _db.UserRoles.AddRange(obj);
                _db.SaveChanges();
            };
            isSaved = true;
            return isSaved;
        }
    }
}
