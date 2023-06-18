using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Linq;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ShoppingCartController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;

        public ShoppingCartController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        [Authorize]
        public ActionResult<IEnumerable<ShoppingCartItem>> GetShoppingCart()
        {
            var userId = User.Identity.Name;

            var shoppingCartItems = _dbContext.ShoppingCartItems
                .Where(item => item.UserId == userId)
                .ToList();

            return Ok(shoppingCartItems);
        }

        [HttpPost]
        [Authorize]
        public ActionResult<ShoppingCartItem> AddToCart(int bookId)
        {
            var userId = User.Identity.Name; // Получаем идентификатор пользователя из контекста авторизации

            // Проверка наличия книги с заданным идентификатором
            var book = _dbContext.Books.Find(bookId);
            if (book == null)
            {
                return NotFound(); // Возвращаем ошибку 404 Not Found, если книга не найдена
            }

            // Создание объекта ShoppingCartItem с указанным bookId и Quantity = 1
            var item = new ShoppingCartItem
            {
                UserId = userId,
                BookId = bookId,
                Quantity = 1
            };

            // Добавление объекта в базу данных
            _dbContext.ShoppingCartItems.Add(item);
            _dbContext.SaveChanges();

            return Ok(item);
        }

        [HttpPost("checkout")]
        [Authorize]
        public ActionResult Checkout()
        {
            var userId = User.Identity.Name;

            var shoppingCartItems = _dbContext.ShoppingCartItems
                .Where(item => item.UserId == userId)
                .ToList();

            if (shoppingCartItems.Count == 0)
            {
                return BadRequest("Shopping cart is empty.");
            }

            var purchaseHistories = shoppingCartItems.Select(item => new PurchaseHistory
            {
                UserId = item.UserId,
                ProductId = item.BookId,
                Quantity = item.Quantity
            });

            _dbContext.PurchaseHistories.AddRange(purchaseHistories);
            _dbContext.ShoppingCartItems.RemoveRange(shoppingCartItems);
            _dbContext.SaveChanges();

            return Ok("Checkout successful. Purchase history updated.");
        }
    }
}
