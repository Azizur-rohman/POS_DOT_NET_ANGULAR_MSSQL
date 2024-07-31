using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using PosWebAPIs.Interfaces;
using PosWebAPIs.Models.DBModels;

namespace PosWebAPIs.Services
{
    public class MenuService : IMenuService
    {
        public bool DeleteMenu(ModelContext _db, int id)
        {
            bool isSaved = false;
            try
            {
                var data = _db.Menus.FirstOrDefault(x => x.Id == id);
                if (data != null)
                {
                    _db.Menus.Remove(data);
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

        public bool UpdateMenuById(ModelContext _db, Menu model)
        {
            bool isSaved = false;

            var isExistData = _db.Menus.AsQueryable().FirstOrDefault(x => x.MenuName == model.MenuName && x.MenuPath == model.MenuPath);
            if (isExistData == null)
            {
                var oldData = _db.Menus.FirstOrDefault(x => x.Id == model.Id);
                if (oldData != null)
                {
                    oldData.MenuName = model.MenuName;
                    oldData.MenuPath = model.MenuPath;
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

        public Menu GetMenuById(ModelContext _db, int Id)
        {

            var data = _db.Menus.FirstOrDefault(x => x.Id == Id);
            if (data != null)
            {
                var getData = new Menu();

                getData.Id = data.Id;
                getData.MenuName = data.MenuName;
                getData.MenuPath = data.MenuPath;
                getData.MenuId = data.MenuId;
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
            var data = from ct in _db.Menus.AsNoTracking().ToList()
                       select new
                       {
                           id = (decimal)ct.Id,
                           menu_name = ct.MenuName,
                           menu_path = ct.MenuPath,
                           menu_id = ct.MenuId,
                           created_by = ct.CreatedBy,
                           created_date = ct.CreatedDate,
                           children = _db.MenuPaths.AsQueryable().Where(x => x.MenuId == ct.MenuId)
                                     .Select(x=> new {
                                         name = x.SubMenu,
                                         url = ct.MenuPath + "/" + x.Path
                                     }).ToList(),

                       };

            return data.Distinct().OrderBy(x=>x.created_date);
        }

        public bool DuplicateCheck(ModelContext _db, Menu model)
        {
            bool isDuplicate = false;
            var data = _db.Menus.AsQueryable().FirstOrDefault(x => x.MenuPath == model.MenuPath || x.MenuName == model.MenuName);
            if (data != null)
            {
                isDuplicate = true;
            }

            return isDuplicate;
        }

        public bool Add(List<Menu> model, ModelContext _db)
        {
            bool isSaved = false;
            string serial;
            int taracNumber = 1;

            var MenuList = new List<Menu>();
            
            foreach (var i in model)
            {
                var last = _db.Menus.OrderByDescending(x => x.Id).FirstOrDefault();
                if (last == null)
                    serial = "001";
                else
                {
                    taracNumber = int.Parse(last.MenuId) + 1;
                    if (taracNumber.ToString().Length >= 3)
                        serial = taracNumber.ToString();
                    else
                        serial = taracNumber.ToString()
                            .PadLeft(3, '0');
                }
                var obj = new Menu();
                {
                    obj.MenuName = i.MenuName;
                    obj.MenuPath = i.MenuPath;
                    obj.MenuId = serial;
                    obj.CreatedBy = i.CreatedBy;
                    obj.CreatedDate = i.CreatedDate;
                }

                _db.Menus.AddRange(obj);
                _db.SaveChanges();
            };
            isSaved = true;
            return isSaved;
        }
    }
}
