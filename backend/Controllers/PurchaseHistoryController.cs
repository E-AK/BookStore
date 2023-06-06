using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PurchaseHistoryController : ControllerBase
{
    private readonly ApplicationDbContext _dbContext;

    public PurchaseHistoryController(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    [Authorize]
    public ActionResult<IEnumerable<PurchaseHistory>> GetPurchaseHistory(int userId)
    {
        var purchaseHistory = _dbContext.PurchaseHistories
            .Where(ph => ph.UserId == userId)
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
}
