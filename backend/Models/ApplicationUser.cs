using Microsoft.AspNetCore.Identity;

namespace OneManager.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; } = string.Empty;

        // ✅ Tambahkan ini
        public string LanguagePreference { get; set; } = "id";
    }
}
