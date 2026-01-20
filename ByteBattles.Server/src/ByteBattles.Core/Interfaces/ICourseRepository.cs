using ByteBattles.Core.Entities;

namespace ByteBattles.Core.Interfaces;

/// <summary>
/// Repository interface for Course entity operations.
/// </summary>
public interface ICourseRepository
{
    Task<Course?> GetByIdAsync(int id);
    Task<IEnumerable<Course>> GetAllAsync();
    Task<IEnumerable<Course>> GetActiveAsync();
    Task<Course> CreateAsync(Course course);
    Task UpdateAsync(Course course);
    Task DeleteAsync(int id);
    Task<bool> ExistsAsync(int id);
}

