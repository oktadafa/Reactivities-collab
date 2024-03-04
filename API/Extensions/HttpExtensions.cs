using System.Text.Json;

namespace API.Extensions
{
    public static class HttpExtensions
    {
        public static void AddPaginationHeader(this HttpResponse response, int currentPage, int itemsPerPage, int totalItems, int totalPages)
        {
            var paginatinationHeader = new 
            {
                currentPage,
                itemsPerPage,
                totalItems,
                totalPages
            };
            response.Headers.Append("Pagination", JsonSerializer.Serialize(paginatinationHeader));
            response.Headers.Append("Access-Control-Expose-Headers", "Pagination");
          }
    }
}