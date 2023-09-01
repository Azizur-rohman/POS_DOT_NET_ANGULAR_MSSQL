using System;
using System.Collections.Generic;

#nullable disable

namespace PosWebAPIs.Models.DBModels
{
    public class SaleFormDataModel
    {
        public Sale? saleForm { get; set; }
        public List<SaleDetail>? saleDtlArr { get; set; }
        public List<SaleDetail>? deleteSaleDtlArr { get; set; }
    }
    public partial class Sale
    {
        public int Id { get; set; }
        public string OrderNo { get; set; }
        public string CustomerName { get; set; }
        public string CustomerPhone { get; set; }
        public string CustomerAddress { get; set; }
        public decimal? TotalAmount { get; set; }
        public int? Discount { get; set; }
        public int? Vat { get; set; }
        public decimal? GrandTotalAmount { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}
