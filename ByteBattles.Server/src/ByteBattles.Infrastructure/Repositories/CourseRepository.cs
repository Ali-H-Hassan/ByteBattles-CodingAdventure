using ByteBattles.Core.Entities;
using ByteBattles.Core.Interfaces;
using ByteBattles.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ByteBattles.Infrastructure.Repositories;

/// <summary>
/// Repository implementation for Course entity operations.
/// </summary>
public class CourseRepository : ICourseRepository
{
    private readonly ByteBattlesDbContext _context;

    public CourseRepository(ByteBattlesDbContext context)
    {
        _context = context;
    }

    public async Task<Course?> GetByIdAsync(int id)
    {
        return await _context.Courses.FindAsync(id);
    }

    public async Task<IEnumerable<Course>> GetAllAsync()
    {
        return await _context.Courses.ToListAsync();
    }

    public async Task<IEnumerable<Course>> GetActiveAsync()
    {
        return await _context.Courses
            .Where(c => c.IsActive)
            .ToListAsync();
    }

    public async Task<Course> CreateAsync(Course course)
    {
        _context.Courses.Add(course);
        await _context.SaveChangesAsync();
        return course;
    }

    public async Task UpdateAsync(Course course)
    {
        course.UpdatedAt = DateTime.UtcNow;
        _context.Courses.Update(course);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var course = await _context.Courses.FindAsync(id);
        if (course != null)
        {
            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(int id)
    {
        return await _context.Courses.AnyAsync(c => c.Id == id);
    }
}

