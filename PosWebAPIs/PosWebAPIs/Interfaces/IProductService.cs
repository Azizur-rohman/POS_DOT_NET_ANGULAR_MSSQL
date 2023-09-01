//using Entities;
//using PHubApi.Helpers;
//using PHubApi.Model;
using PosWebAPIs.Models.DBModels;
using System.Collections.Generic;

namespace PosWebAPIs.Interfaces
{
    public interface IProductService
    {
        dynamic GetAll(ModelContext _db);
        bool DuplicateCheck(ModelContext _db, Product model);
        bool Add(List<Product> model, ModelContext _db);
        Product GetProductById(ModelContext _db, int Id);
        bool UpdateProductById(ModelContext _db, Product model);
        bool DeleteProduct(ModelContext _db, int id);
    }
}
