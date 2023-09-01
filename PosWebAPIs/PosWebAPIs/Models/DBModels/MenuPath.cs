using System;
using System.Collections.Generic;

#nullable disable

namespace PosWebAPIs.Models.DBModels
{
    public partial class MenuPath
    {
        public int Id { get; set; }
        public string PathId { get; set; }
        public string Path { get; set; }
    }
}
