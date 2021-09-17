namespace zwajApp.API.Helpers
{
    public class PaginationHeader 
    {
        public int currentPage { get; set; }
        public int ItemsPerPage { get; set; }
        public int TotalItems { get; set; }
        public int TotalPages { get; set; }
        public PaginationHeader(int currentPage, int itemssPerPage, int TotalItems, int TotalPages){
            this.currentPage =currentPage;
            this.ItemsPerPage =itemssPerPage;
            this.TotalItems = TotalItems;
            this.TotalPages = TotalPages;
        }
    }
}