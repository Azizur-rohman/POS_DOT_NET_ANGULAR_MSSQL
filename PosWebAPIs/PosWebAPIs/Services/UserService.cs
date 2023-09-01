using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
//using Common.Helpers;
//using Entities;
//using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
//using PHubApi.Helpers;
using PosWebAPIs.Interfaces;
using PosWebAPIs.Models.DBModels;

namespace PosWebAPIs.Services
{
    public class UserService : IUserService
    {
        public dynamic GetAll(ModelContext _db)
        {
            var data = from user in _db.Users.AsNoTracking().ToList()
                       select new
                       {
                           id = user.Id,
                           userId = user.UserId,
                           name = user.Name,
                           userCategory = _db.UserCategories.AsNoTracking().FirstOrDefault(x=>x.UserCategoryCode == user.UserCategory)?.UserCategoryName,
                           address = user.Address,
                           phoneNo = user.PhoneNumber,
                           created_by = user.CreatedBy,
                           created_date = user.CreatedDate
                       };

            return data.Distinct();
        }

        public dynamic CheckLogin(ModelContext _db, string name, string password)
        {
            var data = from user in _db.Users.AsNoTracking()
                       .Where(x => x.Name == name
                                        && x.Password == password
                        )
                       select new
                       {
                           id = user.Id,
                           name = user.Name,
                           role = _db.UserCategories.FirstOrDefault(x => x.UserCategoryCode == user.UserCategory).UserCategoryName,
                           isLoggedIn = true
                       };

            if (data.Any())
            {
                return data;
            }
            else
            {
                return data = null;
            }
        }

        public dynamic GetUserRoleAll(ModelContext _db)
        {
            var data = from userRole in _db.UserRoles.AsNoTracking().ToList()
                       select new
                       {
                           user_category = _db.UserCategories.FirstOrDefault(x=>x.UserCategoryCode == userRole.UserCategory).UserCategoryName,
                           path = _db.MenuPaths.FirstOrDefault(x => x.PathId == userRole.PathId).Path,
                       };

            return data.Distinct();
        }

        public bool DuplicateCheck(ModelContext _db, User model)
        {
            bool isDuplicate = false;
            var data = _db.Users.AsQueryable().FirstOrDefault(x => x.Name == model.Name);
            if (data != null)
            {
                isDuplicate = true;
            }

            return isDuplicate;
        }

        public bool Add(List<User> model, ModelContext _db)
        {
            bool isSaved = false;
            string serial;
            int taracNumber = 1;

            var UserList = new List<User>();

            foreach (var i in model)
            {
                var last = _db.Users.OrderByDescending(x => x.Id).FirstOrDefault();
                if (last == null)
                    serial = "001";
                else
                {
                    taracNumber = int.Parse(last.UserId) + 1;
                    if (taracNumber.ToString().Length >= 3)
                        serial = taracNumber.ToString();
                    else
                        serial = taracNumber.ToString()
                            .PadLeft(3, '0');
                }
                var obj = new User();
                {
                    obj.Name = i.Name;
                    obj.UserId = serial;
                    obj.UserCategory = i.UserCategory;
                    obj.Address = i.Address;
                    obj.PhoneNumber = i.PhoneNumber;
                    obj.Password = i.Password;
                    obj.CreatedBy = i.CreatedBy;
                    obj.CreatedDate = i.CreatedDate;
                }

                _db.Users.AddRange(obj);
                _db.SaveChanges();
            };
            isSaved = true;
            return isSaved;
        }

        public bool UpdateUserById(ModelContext _db, User model)
        {
            bool isSaved = false;

            var isExistData = _db.Users.AsQueryable().FirstOrDefault(x => x.Name == model.Name 
                                                                         && x.UserCategory == model.UserCategory 
                                                                         && x.Address == model.Address 
                                                                         && x.PhoneNumber == model.PhoneNumber);
            if (isExistData == null)
            {
                var oldData = _db.Users.FirstOrDefault(x => x.Id == model.Id);
                if (oldData != null)
                {
                    oldData.Name = model.Name;
                    oldData.UserCategory = model.UserCategory;
                    oldData.Address = model.Address;
                    oldData.PhoneNumber = model.PhoneNumber;
                    oldData.Password = model.Password;
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

        public User GetUserById(ModelContext _db, int Id)
        {
            var data = _db.Users.FirstOrDefault(x => x.Id == Id);
            if (data != null)
            {
                var getData = new User();

                getData.Id = data.Id;
                getData.Name = data.Name;
                getData.UserCategory = data.UserCategory;
                getData.Address = data.Address;
                getData.PhoneNumber = data.PhoneNumber;
                getData.Password = data.Password;
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

        public bool DeleteUser(ModelContext _db, int id)
        {
            bool isSaved = false;
            try
            {
                var data = _db.Users.FirstOrDefault(x => x.Id == id);
                if (data != null)
                {
                    _db.Users.Remove(data);
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
    }
}
