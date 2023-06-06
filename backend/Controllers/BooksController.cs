using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BooksController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public BooksController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult GetBooks()
    {
        var books = _context.Books.ToList();
        return Ok(books);
    }

    [HttpGet("ids")]
    [Authorize]
    public async Task<IActionResult> GetBooksByIds([FromQuery] List<int> bookIds)
    {
        try
        {
            var books = await _context.Books
                .Where(b => bookIds.Contains(b.Id))
                .ToListAsync();

            if (books == null || books.Count == 0)
            {
                return NotFound();
            }

            return Ok(books);
        }
        catch (Exception ex)
        {
            // Handle the exception
            return StatusCode(500, "An error occurred while retrieving books by IDs");
        }
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public IActionResult CreateBook(Book book)
    {
        _context.Books.Add(book);
        _context.SaveChanges();
        return Ok(book);
    }
}