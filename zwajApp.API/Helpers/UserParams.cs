namespace zwajApp.API.Helpers
{
    public class  UserParams
    {
        private const int MaxPageSize = 50;

        public int PageNumber{get;set;}=1;

        private int pageSize=10;
        public int PageSize
        {
            get { return pageSize; }
            set { pageSize =(value>MaxPageSize)?MaxPageSize:value; }
        }
        
        public int userId{get;set;}
        public string Gender{set;get;}

        public int MinAge {get;set;} =18;
        public int MaxAge {get;set;} =99;
        public string orderBy{get;set;}

        public bool Likees {get;set;} =false;
        public bool likers {get;set;} =false;

    }
}