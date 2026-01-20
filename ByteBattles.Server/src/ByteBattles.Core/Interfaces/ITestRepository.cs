using ByteBattles.Core.Entities;

namespace ByteBattles.Core.Interfaces;

/// <summary>
/// Repository interface for Test entity operations.
/// </summary>
public interface ITestRepository
{
    Task<Test?> GetByIdAsync(int id);
    Task<IEnumerable<Test>> GetAllAsync();
    Task<IEnumerable<Test>> GetByCompanyIdAsync(int companyId);
    Task<Test> CreateAsync(Test test);
    Task UpdateAsync(Test test);
    Task DeleteAsync(int id);
    Task<bool> ExistsAsync(int id);
}

