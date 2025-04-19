using System.ComponentModel.DataAnnotations;

namespace OneManager.Models
{
    public class ActivityLog
    {
        [Key]
        public int Id { get; set; }

        public string UserId { get; set; }

        public string Action { get; set; }

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
