using ByteBattles.Core.Entities;
using ByteBattles.Core.Interfaces;
using ByteBattles.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ByteBattles.Infrastructure.Repositories;

/// <summary>
/// Repository implementation for Test entity operations.
/// </summary>
public class TestRepository : ITestRepository
{
    private readonly ByteBattlesDbContext _context;

    public TestRepository(ByteBattlesDbContext context)
    {
        _context = context;
    }

    public async Task<Test?> GetByIdAsync(int id)
    {
        return await _context.Tests
            .Include(t => t.McqQuestions)
                .ThenInclude(mq => mq.Options)
            .Include(t => t.ProgrammingQuestion)
                .ThenInclude(pq => pq!.TestCases)
            .FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task<IEnumerable<Test>> GetAllAsync()
    {
        return await _context.Tests
            .Include(t => t.McqQuestions)
                .ThenInclude(mq => mq.Options)
            .Include(t => t.ProgrammingQuestion)
                .ThenInclude(pq => pq!.TestCases)
            .ToListAsync();
    }

    public async Task<IEnumerable<Test>> GetByCompanyIdAsync(int companyId)
    {
        return await _context.Tests
            .Where(t => t.CreatedById == companyId)
            .Include(t => t.McqQuestions)
                .ThenInclude(mq => mq.Options)
            .Include(t => t.ProgrammingQuestion)
                .ThenInclude(pq => pq!.TestCases)
            .ToListAsync();
    }

    public async Task<Test> CreateAsync(Test test)
    {
        _context.Tests.Add(test);
        await _context.SaveChangesAsync();
        return test;
    }

    public async Task UpdateAsync(Test test)
    {
        _context.Tests.Update(test);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var test = await _context.Tests.FindAsync(id);
        if (test != null)
        {
            _context.Tests.Remove(test);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(int id)
    {
        return await _context.Tests.AnyAsync(t => t.Id == id);
    }
}

