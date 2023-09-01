//using Entities;
//using PHubApi.Helpers;
//using PHubApi.Model;
using PosWebAPIs.Models.DBModels;
using System.Collections.Generic;

namespace PosWebAPIs.Interfaces
{
    public interface IUserService
    {
        dynamic GetAll(ModelContext _db);
        dynamic CheckLogin(ModelContext _db, string name, string password);
        dynamic GetUserRoleAll(ModelContext _db);
        bool DuplicateCheck(ModelContext _db, User model);
        bool Add(List<User> model, ModelContext _db);
        User GetUserById(ModelContext _db, int Id);
        bool UpdateUserById(ModelContext _db, User model);
        bool DeleteUser(ModelContext _db, int id);
    }
}
