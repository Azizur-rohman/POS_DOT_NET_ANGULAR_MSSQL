using System.Collections.Generic;

namespace PHubApi.Helpers
{
    public class CreateUpdateDataModel<T>
    {
        public string UserId { get; set; }
        public string FeatureId { get; set; }
        public string UrlLink { get; set; }
        public T Data { get; set; }
        public List<T> ListData { get; set; }
        public long BranchId { get; set; }
        public long WingId { get; set; }
        public long SectionId { get; set; }
        public string TableName { get; set; }
        public long OfficeId { get; set; }
        public long UserLevelId { get; set; }
    }
}
