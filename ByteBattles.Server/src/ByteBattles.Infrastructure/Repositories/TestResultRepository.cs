using ByteBattles.Core.Entities;
using ByteBattles.Core.Interfaces;
using ByteBattles.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ByteBattles.Infrastructure.Repositories;

/// <summary>
/// Repository implementation for TestResult entity operations.
/// </summary>
public class TestResultRepository : ITestResultRepository
{
    private readonly ByteBattlesDbContext _context;

    public TestResultRepository(ByteBattlesDbContext context)
    {
        _context = context;
    }

    public async Task<TestResult?> GetByIdAsync(int id)
    {
        return await _context.TestResults
            .Include(tr => tr.Test)
                .ThenInclude(t => t.CreatedBy)
            .Include(tr => tr.User)
            .FirstOrDefaultAsync(tr => tr.Id == id);
    }

    public async Task<TestResult?> GetByTestIdAndUserIdAsync(int testId, int userId)
    {
        return await _context.TestResults
            .Include(tr => tr.Test)
                .ThenInclude(t => t.CreatedBy)
            .Include(tr => tr.User)
            .FirstOrDefaultAsync(tr => tr.TestId == testId && tr.UserId == userId);
    }

    public async Task<IEnumerable<TestResult>> GetByUserIdAsync(int userId)
    {
        return await _context.TestResults
            .Where(tr => tr.UserId == userId)
            .Include(tr => tr.Test)
                .ThenInclude(t => t.CreatedBy)
            .Include(tr => tr.User)
            .OrderByDescending(tr => tr.CompletedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<TestResult>> GetByTestIdAsync(int testId)
    {
        var results = await _context.TestResults
            .Where(tr => tr.TestId == testId)
            .Include(tr => tr.Test)
                .ThenInclude(t => t.CreatedBy)
            .Include(tr => tr.User)
            .ToListAsync();

        // Order in memory since SQLite doesn't support decimal in ORDER BY
        return results.OrderByDescending(tr => tr.Score).ThenBy(tr => tr.CompletedAt);
    }

    public async Task<TestResult> CreateAsync(TestResult testResult)
    {
        _context.TestResults.Add(testResult);
        await _context.SaveChangesAsync();
        
        // Get the ID after save (it's assigned by EF)
        var savedId = testResult.Id;
        
        // Reload with navigation properties
        var reloaded = await _context.TestResults
            .Include(tr => tr.Test)
                .ThenInclude(t => t.CreatedBy)
            .Include(tr => tr.User)
            .FirstOrDefaultAsync(tr => tr.Id == savedId);
            
        return reloaded ?? testResult;
    }

    public async Task<bool> ExistsAsync(int testId, int userId)
    {
        return await _context.TestResults
            .AnyAsync(tr => tr.TestId == testId && tr.UserId == userId);
    }

    public async Task<IEnumerable<TestResult>> GetAllAsync()
    {
        return await _context.TestResults
            .Include(tr => tr.User)
            .Include(tr => tr.Test)
            .ToListAsync();
    }

    public async Task<IEnumerable<TestResult>> GetByCompanyIdAsync(int companyId)
    {
        return await _context.TestResults
            .Include(tr => tr.User)
            .Include(tr => tr.Test)
                .ThenInclude(t => t.CreatedBy)
            .Where(tr => tr.Test.CreatedById == companyId)
            .ToListAsync();
    }

    public async Task<int> DeleteByUserTypeAsync(string userType)
    {
        var companyResults = await _context.TestResults
            .Include(tr => tr.User)
            .Where(tr => tr.User.UserType == userType)
            .ToListAsync();
        
        _context.TestResults.RemoveRange(companyResults);
        await _context.SaveChangesAsync();
        return companyResults.Count;
    }
}

