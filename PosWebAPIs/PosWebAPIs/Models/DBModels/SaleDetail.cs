using System;
using System.Collections.Generic;

#nullable disable

namespace PosWebAPIs.Models.DBModels
{
    public partial class SaleDetail
    {
        public int Id { get; set; }
        public string OrderNo { get; set; }
        public string CategoryCode { get; set; }
        public string ProductCode { get; set; }
        public decimal? SalePrice { get; set; }
        public int? Quantity { get; set; }
        public decimal? SubTotalAmount { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}
