using System;
using System.Collections.Generic;

#nullable disable

namespace PosWebAPIs.Models.DBModels
{
    public partial class Menu
    {
        public int Id { get; set; }
        public int? SerialNo { get; set; }
        public string MenuId { get; set; }
        public string MenuName { get; set; }
        public string MenuPath { get; set; }
        public string IconComponent { get; set; }
        public string BadgeColor { get; set; }
        public string BadgeText { get; set; }
        public bool? Title { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}
