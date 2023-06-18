using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PurchaseHistoryController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;

        public PurchaseHistoryController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet("self")]
        [Authorize]
        public ActionResult<IEnumerable<PurchaseHistory>> GetPurchaseHistorySelf(string userId)
        {
            var purchaseHistory = _dbContext.PurchaseHistories
                .Where(ph => ph.UserId == userId)
                .ToList();

            return Ok(purchaseHistory);
        }

        [HttpGet]
        [Authorize]
        public ActionResult<IEnumerable<PurchaseHistory>> GetPurchaseHistory()
        {
            var purchaseHistory = _dbContext.PurchaseHistories
                .ToList();

            return Ok(purchaseHistory);
        }

        [HttpPost]
        public ActionResult<PurchaseHistory> AddPurchase([FromBody] PurchaseHistory purchase)
        {
            if (ModelState.IsValid)
            {
                _dbContext.PurchaseHistories.Add(purchase);
                _dbContext.SaveChanges();

                return Ok(purchase);
            }

            return BadRequest(ModelState);
        }
        
        [HttpGet("top-all-time")]
        public ActionResult<IEnumerable<Book>> GetTopBooksAllTime()
        {
            var topBooksAllTime = _dbContext.PurchaseHistories
                .GroupBy(ph => ph.ProductId)
                .Select(group => new { ProductId = group.Key, TotalSales = group.Sum(ph => ph.Quantity) })
                .OrderByDescending(item => item.TotalSales)
                .Take(4)
                .Join(_dbContext.Books, item => item.ProductId, book => book.Id, (item, book) => book)
                .ToList();

            return Ok(topBooksAllTime);
        }
        
        [HttpGet("top-month")]
        public ActionResult<IEnumerable<Book>> GetTopBooksMonth()
        {
            var startDate = DateTime.Now.AddMonths(-1);

            var topBooksMonth = _dbContext.PurchaseHistories
                .Where(ph => ph.Timestamp >= startDate)
                .GroupBy(ph => ph.ProductId)
                .Select(group => new { ProductId = group.Key, TotalSales = group.Sum(ph => ph.Quantity) })
                .OrderByDescending(item => item.TotalSales)
                .Take(4)
                .Join(_dbContext.Books, item => item.ProductId, book => book.Id, (item, book) => book)
                .ToList();

            return Ok(topBooksMonth);
        }
    }
}
