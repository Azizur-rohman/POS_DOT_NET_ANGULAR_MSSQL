//using Entities;
//using PHubApi.Helpers;
//using PHubApi.Model;
using PosWebAPIs.Models.DBModels;
using System.Collections.Generic;

namespace PosWebAPIs.Interfaces
{
    public interface IMenuService
    {
        dynamic GetAll(ModelContext _db);
        bool DuplicateCheck(ModelContext _db, Menu model);
        bool Add(List<Menu> model, ModelContext _db);
        Menu GetMenuById(ModelContext _db, int Id);
        bool UpdateMenuById(ModelContext _db, Menu model);
        bool DeleteMenu(ModelContext _db, int id);
    }
}
