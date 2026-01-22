using ByteBattles.Core.Entities;

namespace ByteBattles.Core.Interfaces;

/// <summary>
/// Repository interface for test result operations.
/// </summary>
public interface ITestResultRepository
{
    Task<TestResult?> GetByIdAsync(int id);
    
    Task<TestResult?> GetByTestIdAndUserIdAsync(int testId, int userId);
    
    Task<IEnumerable<TestResult>> GetByUserIdAsync(int userId);
    
    Task<IEnumerable<TestResult>> GetByTestIdAsync(int testId);
    
    Task<TestResult> CreateAsync(TestResult testResult);
    
    Task<bool> ExistsAsync(int testId, int userId);
}

