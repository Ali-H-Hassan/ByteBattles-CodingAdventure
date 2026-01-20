using ByteBattles.Core.DTOs.Test;

namespace ByteBattles.Application.Interfaces;

/// <summary>
/// Interface for test service operations.
/// </summary>
public interface ITestService
{
    Task<TestResponseDto?> GetByIdAsync(int id);
    Task<IEnumerable<TestResponseDto>> GetAllAsync();
    Task<IEnumerable<TestResponseDto>> GetByCompanyIdAsync(int companyId);
    Task<TestResponseDto> CreateAsync(CreateTestDto dto);
    Task<TestResponseDto?> UpdateAsync(int id, CreateTestDto dto);
    Task<bool> DeleteAsync(int id);
}

