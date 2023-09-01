﻿using System;
using System.Collections.Generic;

#nullable disable

namespace PosWebAPIs.Models.DBModels
{
    public partial class UserRole
    {
        public int Id { get; set; }
        public string UserCategory { get; set; }
        public string PathId { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}
