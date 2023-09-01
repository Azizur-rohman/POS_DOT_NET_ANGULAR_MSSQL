//using Entities;
//using PHubApi.Helpers;
//using PHubApi.Model;
using PosWebAPIs.Models.DBModels;
using System.Collections.Generic;

namespace PosWebAPIs.Interfaces
{
    public interface ICategoryService
    {
        dynamic GetAll(ModelContext _db);
        bool DuplicateCheck(ModelContext _db, Category model);
        bool Add(List<Category> model, ModelContext _db);
        Category GetCategoryById(ModelContext _db, int Id);
        bool UpdateCategoryById(ModelContext _db, Category model);
        bool DeleteCategory(ModelContext _db, int id);
    }
}
