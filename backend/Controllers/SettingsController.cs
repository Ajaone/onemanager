using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using OneManager.Models;
using System.Security.Claims;

namespace OneManager.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SettingsController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public SettingsController(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        // GET: api/settings/profile
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var user = await GetCurrentUser();
            return Ok(new
            {
                user.UserName,
                user.FullName,
                user.LanguagePreference,
                user.Email
            });
        }

        // PUT: api/settings/profile
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
        {
            var user = await GetCurrentUser();

            user.FullName = dto.FullName;
            user.LanguagePreference = dto.LanguagePreference;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok(new { message = "Profil berhasil diperbarui." });
        }

        // PUT: api/settings/password
        [HttpPut("password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            var user = await GetCurrentUser();

            var result = await _userManager.ChangePasswordAsync(user, dto.CurrentPassword, dto.NewPassword);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok(new { message = "Password berhasil diubah." });
        }

        private async Task<ApplicationUser> GetCurrentUser()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return await _userManager.FindByIdAsync(userId);
        }
    }

    public class UpdateProfileDto
    {
        public string FullName { get; set; }
        public string LanguagePreference { get; set; }
    }

    public class ChangePasswordDto
    {
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
    }
}
