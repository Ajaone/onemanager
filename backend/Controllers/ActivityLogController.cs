using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OneManager.Data;
using OneManager.Models;
using System.Text;

namespace OneManager.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class ActivityLogController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ActivityLogController(AppDbContext context)
        {
            _context = context;
        }

        // GET: /api/activitylog
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var logs = await _context.ActivityLogs
                .OrderByDescending(l => l.Timestamp)
                .Take(100) // limit log view
                .ToListAsync();

            return Ok(logs);
        }

        // GET: /api/activitylog/export
        [HttpGet("export")]
        public async Task<IActionResult> ExportCSV()
        {
            var logs = await _context.ActivityLogs
                .OrderByDescending(l => l.Timestamp)
                .ToListAsync();

            var csv = new StringBuilder();
            csv.AppendLine("Id,UserId,Action,Timestamp");

            foreach (var log in logs)
            {
                csv.AppendLine($"{log.Id},{log.UserId},{log.Action},{log.Timestamp:o}");
            }

            var bytes = Encoding.UTF8.GetBytes(csv.ToString());
            return File(bytes, "text/csv", $"activity_logs_{DateTime.UtcNow:yyyyMMddHHmm}.csv");
        }
    }
}
