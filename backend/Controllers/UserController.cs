using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OneManager.Models;

namespace OneManager.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class UserController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public UserController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        // ✅ Tambah user baru (default role: Member)
        [HttpPost("add")]
        public async Task<IActionResult> AddUser([FromBody] AddUserDto dto)
        {
            var user = new ApplicationUser
            {
                UserName = dto.Username,
                FullName = dto.FullName,
                Email = dto.Email,
                LanguagePreference = dto.LanguagePreference
            };

            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            var role = dto.Role ?? "Member";
            if (!await _roleManager.RoleExistsAsync(role))
                await _roleManager.CreateAsync(new IdentityRole(role));

            await _userManager.AddToRoleAsync(user, role);

            return Ok(new { message = "User berhasil ditambahkan." });
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userManager.Users.ToListAsync();

            var userList = new List<object>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                userList.Add(new
                {
                    id = user.Id,
                    userName = user.UserName,
                    fullName = user.FullName,
                    email = user.Email,
                    languagePreference = user.LanguagePreference,
                    role = roles.FirstOrDefault() ?? "Member" // default role fallback
                });
            }

            return Ok(userList);
        }


        // ✅ Ubah role user
        [HttpPut("role/{userId}")]
        public async Task<IActionResult> UpdateRole(string userId, [FromBody] string newRole)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound("User tidak ditemukan.");

            if (!await _roleManager.RoleExistsAsync(newRole))
                await _roleManager.CreateAsync(new IdentityRole(newRole));

            var currentRoles = await _userManager.GetRolesAsync(user);
            await _userManager.RemoveFromRolesAsync(user, currentRoles);
            await _userManager.AddToRoleAsync(user, newRole);

            return Ok(new { message = $"Role user diubah menjadi {newRole}" });
        }

        // ✅ Reset password user
        [HttpPut("reset-password/{userId}")]
        public async Task<IActionResult> ResetPassword(string userId, [FromBody] string newPassword)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound("User tidak ditemukan.");

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, token, newPassword);

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok(new { message = "Password berhasil direset." });
        }

        // ✅ Hitung jumlah user
        [HttpGet("count")]
        public async Task<IActionResult> GetUserCount()
        {
            var count = await _userManager.Users.CountAsync();
            return Ok(new { count });
        }
    }

    public class AddUserDto
    {
        public string Username { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string LanguagePreference { get; set; }
        public string Password { get; set; }
        public string? Role { get; set; } // optional, default to "Member"
    }
}
