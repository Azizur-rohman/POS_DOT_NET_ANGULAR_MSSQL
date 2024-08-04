using System;
using System.Collections.Generic;

#nullable disable

namespace PosWebAPIs.Models.DBModels
{
    public partial class MenuPath
    {
        public int Id { get; set; }
        public int? SerialNo { get; set; }
        public string PathId { get; set; }
        public string Path { get; set; }
        public string MenuId { get; set; }
        public string SubMenu { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}
