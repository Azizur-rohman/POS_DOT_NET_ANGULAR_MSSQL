using System;
using System.Collections.Generic;

#nullable disable

namespace PosWebAPIs.Models.DBModels
{
    public partial class StockManagement
    {
        public int Id { get; set; }
        public string Category { get; set; }
        public string Product { get; set; }
        public decimal? SalePrice { get; set; }
        public int? Quantity { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}
