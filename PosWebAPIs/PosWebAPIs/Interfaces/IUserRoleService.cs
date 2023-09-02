//using Entities;
//using PHubApi.Helpers;
//using PHubApi.Model;
using PosWebAPIs.Models.DBModels;
using System.Collections.Generic;

namespace PosWebAPIs.Interfaces
{
    public interface IUserRoleService
    {
        dynamic GetAll(ModelContext _db);
        bool DuplicateCheck(ModelContext _db, UserRole model);
        bool Add(List<UserRole> model, ModelContext _db);
        UserRole GetUserRoleById(ModelContext _db, int Id);
        bool UpdateUserRoleById(ModelContext _db, UserRole model);
        bool DeleteUserRole(ModelContext _db, int id);
    }
}
