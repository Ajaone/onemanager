using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OneManager.Data;
using OneManager.Models;
using System.Security.Claims;

namespace OneManager.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ForumController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IWebHostEnvironment _env;

        public ForumController(AppDbContext context, UserManager<ApplicationUser> userManager, IWebHostEnvironment env)
        {
            _context = context;
            _userManager = userManager;
            _env = env;
        }

        [HttpGet("count")]
        public async Task<IActionResult> GetPostCount()
        {
            var count = await _context.ForumPosts.CountAsync();
            return Ok(new { count });
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var posts = await _context.ForumPosts
                .Include(p => p.User)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return Ok(posts);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var post = await _context.ForumPosts.Include(p => p.User).FirstOrDefaultAsync(p => p.Id == id);
            if (post == null) return NotFound();

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var roles = await _userManager.GetRolesAsync(await _userManager.FindByIdAsync(userId));

            if (post.UserId != userId && !roles.Contains("Admin"))
                return Forbid();

            return Ok(post);
        }

        // ✅ POSTING dengan FormData (image + content)
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] CreatePostDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            string? imageUrl = null;

            if (dto.Image != null)
            {
                var uploadsFolder = Path.Combine(_env.WebRootPath ?? "wwwroot", "uploads");
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(dto.Image.FileName);
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.Image.CopyToAsync(stream);
                }

                imageUrl = $"/uploads/{uniqueFileName}";
            }

            var post = new ForumPost
            {
                Content = dto.Content,
                ImageUrl = imageUrl,
                CreatedAt = DateTime.UtcNow,
                UserId = userId
            };

            _context.ForumPosts.Add(post);
            await _context.SaveChangesAsync();

            return Ok(post);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] CreatePostDto dto, IFormFile? image)
        {
            var post = await _context.ForumPosts.FindAsync(id);
            if (post == null) return NotFound();

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var roles = await _userManager.GetRolesAsync(await _userManager.FindByIdAsync(userId));

            if (post.UserId != userId && !roles.Contains("Admin"))
                return Forbid();

            post.Content = dto.Content;

            // kalau ada file gambar baru, update
            if (image != null)
            {
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);
                var filePath = Path.Combine("wwwroot/uploads", fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await image.CopyToAsync(stream);
                }

                post.ImageUrl = $"/uploads/{fileName}";
            }

            await _context.SaveChangesAsync();

            return Ok(post);

        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var post = await _context.ForumPosts.FindAsync(id);
            if (post == null) return NotFound();

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var roles = await _userManager.GetRolesAsync(await _userManager.FindByIdAsync(userId));

            if (post.UserId != userId && !roles.Contains("Admin"))
                return Forbid();

            _context.ForumPosts.Remove(post);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Post berhasil dihapus." });
        }
    }

    public class CreatePostDto
    {
        public string Content { get; set; }
        public IFormFile? Image { get; set; }
        public string? ImageUrl { get; set; }
    }
}
