using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using PosWebAPIs.Interfaces;
using PosWebAPIs.Models.DBModels;

namespace PosWebAPIs.Services
{
    public class MenuPathService : IMenuPathService
    {
        public bool DeleteMenuPath(ModelContext _db, int id)
        {
            bool isSaved = false;
            try
            {
                var data = _db.MenuPaths.FirstOrDefault(x => x.Id == id);
                if (data != null)
                {
                    _db.MenuPaths.Remove(data);
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

        public bool UpdateMenuPathById(ModelContext _db, MenuPath model)
        {
            bool isSaved = false;

            var isExistData = _db.MenuPaths.AsQueryable().FirstOrDefault(x => x.Path == model.Path);
            if (isExistData == null)
            {
                var oldData = _db.MenuPaths.FirstOrDefault(x => x.Id == model.Id);
                if (oldData != null)
                {
                    oldData.Path = model.Path;
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

        public MenuPath GetMenuPathById(ModelContext _db, int Id)
        {

            var data = _db.MenuPaths.FirstOrDefault(x => x.Id == Id);
            if (data != null)
            {
                var getData = new MenuPath();

                getData.Id = data.Id;
                getData.Path = data.Path;
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
            var data = from ct in _db.MenuPaths.AsNoTracking().ToList()
                       select new
                       {
                           id = (decimal)ct.Id,
                           path = ct.Path,
                           path_id = ct.PathId,
                           created_by = ct.CreatedBy,
                           created_date = ct.CreatedDate

                       };

            return data.Distinct().OrderBy(x=>x.created_date);
        }

        public bool DuplicateCheck(ModelContext _db, MenuPath model)
        {
            bool isDuplicate = false;
            var data = _db.MenuPaths.AsQueryable().FirstOrDefault(x => x.Path == model.Path);
            if (data != null)
            {
                isDuplicate = true;
            }

            return isDuplicate;
        }

        public bool Add(List<MenuPath> model, ModelContext _db)
        {
            bool isSaved = false;
            string serial;
            int taracNumber = 1;

            var MenuPathList = new List<MenuPath>();
            
            foreach (var i in model)
            {
                var last = _db.MenuPaths.OrderByDescending(x => x.Id).FirstOrDefault();
                if (last == null)
                    serial = "001";
                else
                {
                    taracNumber = int.Parse(last.PathId) + 1;
                    if (taracNumber.ToString().Length >= 3)
                        serial = taracNumber.ToString();
                    else
                        serial = taracNumber.ToString()
                            .PadLeft(3, '0');
                }
                var obj = new MenuPath();
                {
                    obj.Path = i.Path;
                    obj.PathId = serial;
                    obj.CreatedBy = i.CreatedBy;
                    obj.CreatedDate = i.CreatedDate;
                }

                _db.MenuPaths.AddRange(obj);
                _db.SaveChanges();
            };
            isSaved = true;
            return isSaved;
        }
    }
}
