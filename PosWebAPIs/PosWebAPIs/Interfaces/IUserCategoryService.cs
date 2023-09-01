//using Entities;
//using PHubApi.Helpers;
//using PHubApi.Model;
using PosWebAPIs.Models.DBModels;
using System.Collections.Generic;

namespace PosWebAPIs.Interfaces
{
    public interface IUserCategoryService
    {
        dynamic GetAll(ModelContext _db);
        bool DuplicateCheck(ModelContext _db, UserCategory model);
        bool Add(List<UserCategory> model, ModelContext _db);
        UserCategory GetUserCategoryById(ModelContext _db, int Id);
        bool UpdateUserCategoryById(ModelContext _db, UserCategory model);
        bool DeleteUserCategory(ModelContext _db, int id);
    }
}
