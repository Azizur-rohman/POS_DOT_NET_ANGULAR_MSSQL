//using Entities;
//using PHubApi.Helpers;
//using PHubApi.Model;
using PosWebAPIs.Models.DBModels;
using System.Collections.Generic;

namespace PosWebAPIs.Interfaces
{
    public interface IMenuPathService
    {
        dynamic GetAll(ModelContext _db);
        bool DuplicateCheck(ModelContext _db, MenuPath model);
        bool Add(List<MenuPath> model, ModelContext _db);
        MenuPath GetMenuPathById(ModelContext _db, int Id);
        bool UpdateMenuPathById(ModelContext _db, MenuPath model);
        bool DeleteMenuPath(ModelContext _db, int id);
    }
}
