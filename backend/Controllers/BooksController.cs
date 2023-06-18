using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Controllers
{
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

        [HttpGet("{id}/preview")]
        public IActionResult GetBookPreview(int id)
        {
            var book = _context.Books.Find(id);

            if (book == null)
            {
                return NotFound();
            }

            // Get the file path for the preview image
            string filePath = Path.Combine("previews", book.Preview);

            // Read the file contents
            byte[] fileContents = System.IO.File.ReadAllBytes(filePath);

            // Determine the content type based on the file extension
            string contentType = GetContentType(filePath);

            // Return the file contents as the response
            return File(fileContents, contentType);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public IActionResult CreateBook([FromForm] BookCreate request)
        {
            try
            {
                // Get the uploaded file
                IFormFile file = request.Preview;

                // Generate a unique file name
                string previewFileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";

                // Save the file on the server
                string filePath = Path.Combine("previews", previewFileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    file.CopyTo(stream);
                }

                // Create a new Book object and set its properties
                Book book = new Book
                {
                    // Set other properties of the book
                    Title = request.Title,
                    Author = request.Author,
                    Description = request.Description,
                    Price = request.Price,
                    Genre = request.Genre,
                    Preview = previewFileName // Store the file name in the database
                };

                // Save the book in the database
                _context.Books.Add(book);
                _context.SaveChanges();

                return Ok(book);
            }
            catch (Exception ex)
            {
                // Handle the exception
                return StatusCode(500, "An error occurred while creating the book" + ex);
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult DeleteBook(int id)
        {
            var book = _context.Books.Find(id);

            if (book == null)
            {
                return NotFound();
            }

            _context.Books.Remove(book);
            _context.SaveChanges();
            return Ok(book);
        }

        private string GetContentType(string filePath)
        {
            // Determine the content type based on the file extension
            string extension = Path.GetExtension(filePath)?.ToLowerInvariant();

            switch (extension)
            {
                case ".jpg":
                case ".jpeg":
                    return "image/jpeg";
                case ".png":
                    return "image/png";
                case ".gif":
                    return "image/gif";
                default:
                    return "application/octet-stream";
            }
        }
    }
}
