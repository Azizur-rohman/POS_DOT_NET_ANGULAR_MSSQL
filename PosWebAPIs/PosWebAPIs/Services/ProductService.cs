using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using PosWebAPIs.Interfaces;
using PosWebAPIs.Models.DBModels;

namespace PosWebAPIs.Services
{
    public class ProductService : IProductService
    {
        private readonly string connectionString;

        public ProductService(string connectionString)
        {
            this.connectionString = connectionString;
        }

        public bool DeleteProduct(ModelContext _db, int id)
        {
            bool isSaved = false;
            try
            {
                var data = _db.Products.FirstOrDefault(x => x.Id == id);
                if (data != null)
                {
                    _db.Products.Remove(data);
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

        public bool UpdateProductById(ModelContext _db, Product model)
        {
            bool isSaved = false;

            var isExistData = _db.Products.AsQueryable().FirstOrDefault(x => x.Name == model.Name && x.Category == model.Category && x.Image == model.Image && x.Price == model.Price);
            if (isExistData == null)
            {
                var oldData = _db.Products.FirstOrDefault(x => x.Id == model.Id);
                if (oldData != null)
                {
                    oldData.Name = model.Name;
                    oldData.Category = model.Category;
                    oldData.Image = model.Image;
                    oldData.Price = model.Price;
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

        public Product GetProductById(ModelContext _db, int Id)
        {
            var data = _db.Products.FirstOrDefault(x => x.Id == Id);
            if (data != null)
            {
                var getData = new Product();

                getData.Id = data.Id;
                getData.Name = data.Name;
                getData.Category = data.Category;
                getData.Image = data.Image;
                getData.Price = data.Price;
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
            //string base64Image = Convert.ToBase64String(imageBytes);
            var data = from pr in _db.Products.AsNoTracking().ToList()
                       select new
                       {

                           id = (decimal)pr.Id,
                           name = pr.Name,
                           product_code = pr.ProductCode,
                           category_code = pr.Category,
                           category = _db.Categories.FirstOrDefault(x=>x.CategoryCode == pr.Category)?.Name,
                           image = pr.Image,
                           price = pr.Price,
                           created_by = pr.CreatedBy,
                           created_date = pr.CreatedDate

                       };

            return data.Distinct().OrderBy(x=>x.created_date);
        }

        public bool DuplicateCheck(ModelContext _db, Product model)
        {
            bool isDuplicate = false;
            var data = _db.Products.AsQueryable().FirstOrDefault(x => x.Name == model.Name);
            if (data != null)
            {
                isDuplicate = true;
            }

            return isDuplicate;
        }

        public bool Add(List<Product> model, ModelContext _db)
        {
            bool isSaved = false;
            string serial;
            int taracNumber = 1;
            var productList = new List<Product>();
            foreach (var i in model)
            {
                var obj = new Product();
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    using (SqlCommand command = new SqlCommand("dbo.InsertData", connection))
                    {
                        var last = _db.Products.OrderByDescending(x => x.Id).FirstOrDefault();
                        if (last == null)
                            serial = "001";
                        else
                        {
                            taracNumber = int.Parse(last.ProductCode) + 1;
                            if (taracNumber.ToString().Length >= 3)
                                serial = taracNumber.ToString();
                            else
                                serial = taracNumber.ToString()
                                    .PadLeft(3, '0');
                        }
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@Name", i.Name);
                        command.Parameters.AddWithValue("@ProductCode", serial);
                        command.Parameters.AddWithValue("@Category", i.Category);
                        command.Parameters.AddWithValue("@Image", i.Image);
                        command.Parameters.AddWithValue("@Price", i.Price);
                        command.Parameters.AddWithValue("@CreatedBy", i.CreatedBy);
                        command.Parameters.AddWithValue("@CreatedDate", DateTime.Now);
                        command.ExecuteNonQuery();
                    }
                }

            };
            isSaved = true;
            return isSaved;
        }
    }
}
