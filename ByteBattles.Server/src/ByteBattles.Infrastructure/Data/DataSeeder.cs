using ByteBattles.Core.Entities;
using BCrypt.Net;

namespace ByteBattles.Infrastructure.Data;

/// <summary>
/// Seeds the database with initial test data.
/// </summary>
public static class DataSeeder
{
    public static async Task SeedAsync(ByteBattlesDbContext context)
    {
        // Ensure database is created
        await context.Database.EnsureCreatedAsync();

        // Skip if data already exists
        if (context.Users.Any())
        {
            return;
        }

        // Seed Users
        var users = new List<User>
        {
            new User
            {
                Username = "john_doe",
                Email = "john@example.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123!"),
                Name = "John Doe",
                UserType = "individual",
                ExperiencePoints = 150,
                HighScore = 850,
                Rank = 5,
                LearningPath = "Frontend",
                CreatedAt = DateTime.UtcNow.AddDays(-30)
            },
            new User
            {
                Username = "jane_smith",
                Email = "jane@example.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123!"),
                Name = "Jane Smith",
                UserType = "individual",
                ExperiencePoints = 300,
                HighScore = 1200,
                Rank = 3,
                LearningPath = "Backend",
                CreatedAt = DateTime.UtcNow.AddDays(-20)
            },
            new User
            {
                Username = "techcorp",
                Email = "admin@techcorp.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Company123!"),
                Name = "Tech Corp Admin",
                UserType = "company",
                CompanyName = "Tech Corp",
                CompanyAddress = "123 Tech Street, San Francisco, CA",
                CompanyContactNumber = "+1-555-0123",
                CreatedAt = DateTime.UtcNow.AddDays(-15)
            },
            new User
            {
                Username = "devstartup",
                Email = "hr@devstartup.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Company123!"),
                Name = "Dev Startup HR",
                UserType = "company",
                CompanyName = "Dev Startup Inc",
                CompanyAddress = "456 Startup Ave, New York, NY",
                CompanyContactNumber = "+1-555-0456",
                CreatedAt = DateTime.UtcNow.AddDays(-10)
            }
        };

        context.Users.AddRange(users);
        await context.SaveChangesAsync();

        // Seed User Roles
        var userRoles = new List<UserRole>
        {
            new UserRole { UserId = users[0].Id, Role = "learner" },
            new UserRole { UserId = users[1].Id, Role = "learner" },
            new UserRole { UserId = users[2].Id, Role = "company" },
            new UserRole { UserId = users[3].Id, Role = "company" }
        };

        context.UserRoles.AddRange(userRoles);
        await context.SaveChangesAsync();

        // Seed Courses
        var courses = new List<Course>
        {
            new Course
            {
                Title = "HTML Basics",
                Description = "Learn the fundamentals of HTML including tags, attributes, and document structure.",
                Difficulty = "Beginner",
                ImageUrl = "https://via.placeholder.com/400x300?text=HTML+Basics",
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddDays(-25),
                UpdatedAt = DateTime.UtcNow.AddDays(-25)
            },
            new Course
            {
                Title = "CSS Fundamentals",
                Description = "Master CSS styling including selectors, layouts, and responsive design.",
                Difficulty = "Beginner",
                ImageUrl = "https://via.placeholder.com/400x300?text=CSS+Fundamentals",
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddDays(-20),
                UpdatedAt = DateTime.UtcNow.AddDays(-20)
            },
            new Course
            {
                Title = "NodeJs Basics",
                Description = "Learn Node.js for server-side JavaScript development and building APIs.",
                Difficulty = "Intermediate",
                ImageUrl = "https://via.placeholder.com/400x300?text=NodeJs+Basics",
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddDays(-15),
                UpdatedAt = DateTime.UtcNow.AddDays(-15)
            },
            new Course
            {
                Title = "Python Fundamentals",
                Description = "Master Python programming from basics to advanced concepts and best practices.",
                Difficulty = "Intermediate",
                ImageUrl = "https://via.placeholder.com/400x300?text=Python+Fundamentals",
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddDays(-10),
                UpdatedAt = DateTime.UtcNow.AddDays(-10)
            }
        };

        context.Courses.AddRange(courses);
        await context.SaveChangesAsync();

        // Seed User Course Progress
        var courseProgress = new List<UserCourseProgress>
        {
            new UserCourseProgress
            {
                UserId = users[0].Id,
                CourseId = courses[0].Id,
                Progress = 45.50m,
                LastAccessed = DateTime.UtcNow.AddDays(-2)
            },
            new UserCourseProgress
            {
                UserId = users[0].Id,
                CourseId = courses[1].Id,
                Progress = 20.00m,
                LastAccessed = DateTime.UtcNow.AddDays(-5)
            },
            new UserCourseProgress
            {
                UserId = users[1].Id,
                CourseId = courses[2].Id,
                Progress = 75.00m,
                LastAccessed = DateTime.UtcNow.AddDays(-1)
            },
            new UserCourseProgress
            {
                UserId = users[1].Id,
                CourseId = courses[3].Id,
                Progress = 30.00m,
                LastAccessed = DateTime.UtcNow.AddDays(-3)
            }
        };

        context.UserCourseProgress.AddRange(courseProgress);
        await context.SaveChangesAsync();

        // Seed Challenges
        var challenges = new List<Challenge>
        {
            new Challenge
            {
                Title = "Two Sum",
                Description = "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
                Difficulty = "Easy",
                CreatedAt = DateTime.UtcNow.AddDays(-20)
            },
            new Challenge
            {
                Title = "Reverse Linked List",
                Description = "Given the head of a singly linked list, reverse the list, and return the reversed list.",
                Difficulty = "Medium",
                CreatedAt = DateTime.UtcNow.AddDays(-15)
            },
            new Challenge
            {
                Title = "Longest Palindromic Substring",
                Description = "Given a string s, return the longest palindromic substring in s.",
                Difficulty = "Hard",
                CreatedAt = DateTime.UtcNow.AddDays(-10)
            }
        };

        context.Challenges.AddRange(challenges);
        await context.SaveChangesAsync();

        // Seed Challenge Template Codes
        var templateCodes = new List<ChallengeTemplateCode>
        {
            new ChallengeTemplateCode
            {
                ChallengeId = challenges[0].Id,
                Language = "javascript",
                Code = "function twoSum(nums, target) {\n  // Your code here\n  return [];\n}"
            },
            new ChallengeTemplateCode
            {
                ChallengeId = challenges[0].Id,
                Language = "python",
                Code = "def two_sum(nums, target):\n    # Your code here\n    return []"
            },
            new ChallengeTemplateCode
            {
                ChallengeId = challenges[1].Id,
                Language = "javascript",
                Code = "function reverseList(head) {\n  // Your code here\n  return null;\n}"
            },
            new ChallengeTemplateCode
            {
                ChallengeId = challenges[2].Id,
                Language = "javascript",
                Code = "function longestPalindrome(s) {\n  // Your code here\n  return '';\n}"
            }
        };

        context.ChallengeTemplateCodes.AddRange(templateCodes);
        await context.SaveChangesAsync();

        // Seed Challenge Test Cases
        var challengeTestCases = new List<ChallengeTestCase>
        {
            new ChallengeTestCase
            {
                ChallengeId = challenges[0].Id,
                Input = "{\"nums\": [2, 7, 11, 15], \"target\": 9}",
                ExpectedOutput = "[0, 1]"
            },
            new ChallengeTestCase
            {
                ChallengeId = challenges[0].Id,
                Input = "{\"nums\": [3, 2, 4], \"target\": 6}",
                ExpectedOutput = "[1, 2]"
            },
            new ChallengeTestCase
            {
                ChallengeId = challenges[0].Id,
                Input = "{\"nums\": [3, 3], \"target\": 6}",
                ExpectedOutput = "[0, 1]"
            },
            new ChallengeTestCase
            {
                ChallengeId = challenges[1].Id,
                Input = "{\"head\": [1, 2, 3, 4, 5]}",
                ExpectedOutput = "[5, 4, 3, 2, 1]"
            },
            new ChallengeTestCase
            {
                ChallengeId = challenges[2].Id,
                Input = "\"babad\"",
                ExpectedOutput = "\"bab\""
            },
            new ChallengeTestCase
            {
                ChallengeId = challenges[2].Id,
                Input = "\"cbbd\"",
                ExpectedOutput = "\"bb\""
            }
        };

        context.ChallengeTestCases.AddRange(challengeTestCases);
        await context.SaveChangesAsync();

        // Seed Tests (created by companies)
        var tests = new List<Test>
        {
            new Test
            {
                Title = "Frontend Developer Assessment",
                CreatedById = users[2].Id, // Tech Corp
                CreatedAt = DateTime.UtcNow.AddDays(-5)
            },
            new Test
            {
                Title = "Backend Developer Assessment",
                CreatedById = users[3].Id, // Dev Startup
                CreatedAt = DateTime.UtcNow.AddDays(-3)
            }
        };

        context.Tests.AddRange(tests);
        await context.SaveChangesAsync();

        // Seed MCQ Questions
        var mcqQuestions = new List<McqQuestion>
        {
            new McqQuestion
            {
                TestId = tests[0].Id,
                QuestionText = "What is the purpose of React hooks?"
            },
            new McqQuestion
            {
                TestId = tests[0].Id,
                QuestionText = "Which method is used to update state in React?"
            },
            new McqQuestion
            {
                TestId = tests[1].Id,
                QuestionText = "What is the difference between REST and GraphQL?"
            }
        };

        context.McqQuestions.AddRange(mcqQuestions);
        await context.SaveChangesAsync();

        // Seed MCQ Options
        var mcqOptions = new List<McqOption>
        {
            // Question 1 options
            new McqOption { McqQuestionId = mcqQuestions[0].Id, Text = "To manage component state and side effects", IsCorrect = true },
            new McqOption { McqQuestionId = mcqQuestions[0].Id, Text = "To style components", IsCorrect = false },
            new McqOption { McqQuestionId = mcqQuestions[0].Id, Text = "To create routes", IsCorrect = false },
            new McqOption { McqQuestionId = mcqQuestions[0].Id, Text = "To handle HTTP requests", IsCorrect = false },
            
            // Question 2 options
            new McqOption { McqQuestionId = mcqQuestions[1].Id, Text = "setState()", IsCorrect = false },
            new McqOption { McqQuestionId = mcqQuestions[1].Id, Text = "useState()", IsCorrect = true },
            new McqOption { McqQuestionId = mcqQuestions[1].Id, Text = "updateState()", IsCorrect = false },
            new McqOption { McqQuestionId = mcqQuestions[1].Id, Text = "changeState()", IsCorrect = false },
            
            // Question 3 options
            new McqOption { McqQuestionId = mcqQuestions[2].Id, Text = "REST uses HTTP, GraphQL doesn't", IsCorrect = false },
            new McqOption { McqQuestionId = mcqQuestions[2].Id, Text = "GraphQL allows clients to request specific data", IsCorrect = true },
            new McqOption { McqQuestionId = mcqQuestions[2].Id, Text = "REST is faster than GraphQL", IsCorrect = false },
            new McqOption { McqQuestionId = mcqQuestions[2].Id, Text = "No difference", IsCorrect = false }
        };

        context.McqOptions.AddRange(mcqOptions);
        await context.SaveChangesAsync();

        // Seed Programming Questions
        var programmingQuestions = new List<ProgrammingQuestion>
        {
            new ProgrammingQuestion
            {
                TestId = tests[0].Id,
                QuestionText = "Implement a React component that displays a counter with increment and decrement buttons.",
                StarterCode = "import React from 'react';\n\nfunction Counter() {\n  // Your code here\n  return (\n    <div>\n      {/* Counter UI */}\n    </div>\n  );\n}\n\nexport default Counter;"
            },
            new ProgrammingQuestion
            {
                TestId = tests[1].Id,
                QuestionText = "Write a function that validates an email address using regular expressions.",
                StarterCode = "function validateEmail(email) {\n  // Your code here\n  return false;\n}"
            }
        };

        context.ProgrammingQuestions.AddRange(programmingQuestions);
        await context.SaveChangesAsync();

        // Seed Programming Test Cases
        var programmingTestCases = new List<ProgrammingTestCase>
        {
            new ProgrammingTestCase
            {
                ProgrammingQuestionId = programmingQuestions[0].Id,
                Input = "Counter component renders",
                ExpectedOutput = "Component displays count and buttons"
            },
            new ProgrammingTestCase
            {
                ProgrammingQuestionId = programmingQuestions[1].Id,
                Input = "test@example.com",
                ExpectedOutput = "true"
            },
            new ProgrammingTestCase
            {
                ProgrammingQuestionId = programmingQuestions[1].Id,
                Input = "invalid-email",
                ExpectedOutput = "false"
            }
        };

        context.ProgrammingTestCases.AddRange(programmingTestCases);
        await context.SaveChangesAsync();

        // Seed User Completed Challenges
        var completedChallenges = new List<UserCompletedChallenge>
        {
            new UserCompletedChallenge
            {
                UserId = users[0].Id,
                ChallengeId = challenges[0].Id,
                CompletedAt = DateTime.UtcNow.AddDays(-10)
            },
            new UserCompletedChallenge
            {
                UserId = users[1].Id,
                ChallengeId = challenges[0].Id,
                CompletedAt = DateTime.UtcNow.AddDays(-8)
            },
            new UserCompletedChallenge
            {
                UserId = users[1].Id,
                ChallengeId = challenges[1].Id,
                CompletedAt = DateTime.UtcNow.AddDays(-5)
            }
        };

        context.UserCompletedChallenges.AddRange(completedChallenges);
        await context.SaveChangesAsync();
    }
}

