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
        // Ensure database is created (this creates all tables based on the model)
        await context.Database.EnsureCreatedAsync();

        // Clean existing data in correct order (respecting foreign key constraints)
        try
        {
            // Delete in reverse order of dependencies
            if (context.TestResults.Any())
            {
                context.TestResults.RemoveRange(context.TestResults);
                await context.SaveChangesAsync();
            }

            if (context.ProgrammingTestCases.Any())
            {
                context.ProgrammingTestCases.RemoveRange(context.ProgrammingTestCases);
                await context.SaveChangesAsync();
            }

            if (context.ProgrammingQuestions.Any())
            {
                context.ProgrammingQuestions.RemoveRange(context.ProgrammingQuestions);
                await context.SaveChangesAsync();
            }

            if (context.McqOptions.Any())
            {
                context.McqOptions.RemoveRange(context.McqOptions);
                await context.SaveChangesAsync();
            }

            if (context.McqQuestions.Any())
            {
                context.McqQuestions.RemoveRange(context.McqQuestions);
                await context.SaveChangesAsync();
            }

            if (context.Tests.Any())
            {
                context.Tests.RemoveRange(context.Tests);
                await context.SaveChangesAsync();
            }

            if (context.UserCompletedChallenges.Any())
            {
                context.UserCompletedChallenges.RemoveRange(context.UserCompletedChallenges);
                await context.SaveChangesAsync();
            }

            if (context.ChallengeTestCases.Any())
            {
                context.ChallengeTestCases.RemoveRange(context.ChallengeTestCases);
                await context.SaveChangesAsync();
            }

            if (context.ChallengeTemplateCodes.Any())
            {
                context.ChallengeTemplateCodes.RemoveRange(context.ChallengeTemplateCodes);
                await context.SaveChangesAsync();
            }

            if (context.Challenges.Any())
            {
                context.Challenges.RemoveRange(context.Challenges);
                await context.SaveChangesAsync();
            }

            if (context.UserCourseProgress.Any())
            {
                context.UserCourseProgress.RemoveRange(context.UserCourseProgress);
                await context.SaveChangesAsync();
            }

            if (context.Courses.Any())
            {
                context.Courses.RemoveRange(context.Courses);
                await context.SaveChangesAsync();
            }

            if (context.UserRoles.Any())
            {
                context.UserRoles.RemoveRange(context.UserRoles);
                await context.SaveChangesAsync();
            }

            if (context.Users.Any())
            {
                context.Users.RemoveRange(context.Users);
                await context.SaveChangesAsync();
            }
        }
        catch (Exception ex)
        {
            // Log error but continue - might be first run
            System.Diagnostics.Debug.WriteLine($"Error cleaning database: {ex.Message}");
        }

        // Seed Users - Lebanese individuals
        var users = new List<User>
        {
            new User
            {
                Username = "ahmad_khoury",
                Email = "ahmad.khoury@example.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123!"),
                Name = "Ahmad Khoury",
                UserType = "individual",
                Country = "Lebanon",
                City = "Beirut",
                Address = "Hamra Street, Beirut",
                ContactNumber = "+961-3-123456",
                ExperiencePoints = 250,
                HighScore = 950,
                Rank = 4,
                LearningPath = "Frontend",
                CreatedAt = DateTime.UtcNow.AddDays(-45)
            },
            new User
            {
                Username = "layla_halabi",
                Email = "layla.halabi@example.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123!"),
                Name = "Layla Halabi",
                UserType = "individual",
                Country = "Lebanon",
                City = "Tripoli",
                Address = "Azmi Street, Tripoli",
                ContactNumber = "+961-6-789012",
                ExperiencePoints = 420,
                HighScore = 1350,
                Rank = 2,
                LearningPath = "Backend",
                CreatedAt = DateTime.UtcNow.AddDays(-35)
            },
            new User
            {
                Username = "karim_saad",
                Email = "karim.saad@example.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123!"),
                Name = "Karim Saad",
                UserType = "individual",
                Country = "Lebanon",
                City = "Sidon",
                Address = "Riad El Solh Street, Sidon",
                ContactNumber = "+961-7-345678",
                ExperiencePoints = 180,
                HighScore = 780,
                Rank = 6,
                LearningPath = "Frontend",
                CreatedAt = DateTime.UtcNow.AddDays(-25)
            },
            // Lebanese Companies
            new User
            {
                Username = "beirut_tech",
                Email = "hr@beiruttech.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Company123!"),
                Name = "Beirut Tech Solutions",
                UserType = "company",
                CompanyName = "Beirut Tech Solutions",
                CompanyAddress = "Downtown Beirut, Riad El Solh Square, Beirut, Lebanon",
                CompanyContactNumber = "+961-1-234567",
                Country = "Lebanon",
                City = "Beirut",
                CreatedAt = DateTime.UtcNow.AddDays(-20)
            },
            new User
            {
                Username = "cedar_innovations",
                Email = "recruitment@cedarinnovations.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Company123!"),
                Name = "Cedar Innovations",
                UserType = "company",
                CompanyName = "Cedar Innovations",
                CompanyAddress = "Zaitunay Bay, Beirut Waterfront, Beirut, Lebanon",
                CompanyContactNumber = "+961-1-987654",
                Country = "Lebanon",
                City = "Beirut",
                CreatedAt = DateTime.UtcNow.AddDays(-15)
            }
        };

        context.Users.AddRange(users);
        await context.SaveChangesAsync();

        // Seed User Roles
        var userRoles = new List<UserRole>
        {
            new UserRole { UserId = users[0].Id, Role = "learner" }, // Ahmad Khoury
            new UserRole { UserId = users[1].Id, Role = "learner" }, // Layla Halabi
            new UserRole { UserId = users[2].Id, Role = "learner" }, // Karim Saad
            new UserRole { UserId = users[3].Id, Role = "company" }, // Beirut Tech Solutions
            new UserRole { UserId = users[4].Id, Role = "company" }  // Cedar Innovations
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
            // Tests for Beirut Tech Solutions
            new Test
            {
                Title = "Frontend Developer Assessment - React & TypeScript",
                CreatedById = users[3].Id, // Beirut Tech Solutions
                CreatedAt = DateTime.UtcNow.AddDays(-12)
            },
            new Test
            {
                Title = "Full Stack Developer Assessment",
                CreatedById = users[3].Id, // Beirut Tech Solutions
                CreatedAt = DateTime.UtcNow.AddDays(-8)
            },
            // Tests for Cedar Innovations
            new Test
            {
                Title = "Backend Developer Assessment - Node.js & Express",
                CreatedById = users[4].Id, // Cedar Innovations
                CreatedAt = DateTime.UtcNow.AddDays(-10)
            },
            new Test
            {
                Title = "Senior Software Engineer Assessment",
                CreatedById = users[4].Id, // Cedar Innovations
                CreatedAt = DateTime.UtcNow.AddDays(-5)
            }
        };

        context.Tests.AddRange(tests);
        await context.SaveChangesAsync();

        // Seed MCQ Questions
        var mcqQuestions = new List<McqQuestion>
        {
            // Test 1: Frontend Developer Assessment (Beirut Tech)
            new McqQuestion
            {
                TestId = tests[0].Id,
                QuestionText = "What is the purpose of React hooks?"
            },
            new McqQuestion
            {
                TestId = tests[0].Id,
                QuestionText = "Which method is used to update state in React functional components?"
            },
            new McqQuestion
            {
                TestId = tests[0].Id,
                QuestionText = "What is TypeScript's main advantage over JavaScript?"
            },
            // Test 2: Full Stack Developer Assessment (Beirut Tech)
            new McqQuestion
            {
                TestId = tests[1].Id,
                QuestionText = "What is the difference between REST and GraphQL?"
            },
            new McqQuestion
            {
                TestId = tests[1].Id,
                QuestionText = "What is the purpose of middleware in Express.js?"
            },
            // Test 3: Backend Developer Assessment (Cedar Innovations)
            new McqQuestion
            {
                TestId = tests[2].Id,
                QuestionText = "What is the event loop in Node.js?"
            },
            new McqQuestion
            {
                TestId = tests[2].Id,
                QuestionText = "What is the difference between async/await and Promises?"
            },
            // Test 4: Senior Software Engineer Assessment (Cedar Innovations)
            new McqQuestion
            {
                TestId = tests[3].Id,
                QuestionText = "What is the SOLID principle in object-oriented programming?"
            },
            new McqQuestion
            {
                TestId = tests[3].Id,
                QuestionText = "What is the difference between microservices and monolithic architecture?"
            }
        };

        context.McqQuestions.AddRange(mcqQuestions);
        await context.SaveChangesAsync();

        // Seed MCQ Options
        var mcqOptions = new List<McqOption>
        {
            // Test 1 - Question 1: React hooks
            new McqOption { McqQuestionId = mcqQuestions[0].Id, Text = "To manage component state and side effects", IsCorrect = true },
            new McqOption { McqQuestionId = mcqQuestions[0].Id, Text = "To style components", IsCorrect = false },
            new McqOption { McqQuestionId = mcqQuestions[0].Id, Text = "To create routes", IsCorrect = false },
            new McqOption { McqQuestionId = mcqQuestions[0].Id, Text = "To handle HTTP requests", IsCorrect = false },
            
            // Test 1 - Question 2: React state
            new McqOption { McqQuestionId = mcqQuestions[1].Id, Text = "setState()", IsCorrect = false },
            new McqOption { McqQuestionId = mcqQuestions[1].Id, Text = "useState()", IsCorrect = true },
            new McqOption { McqQuestionId = mcqQuestions[1].Id, Text = "updateState()", IsCorrect = false },
            new McqOption { McqQuestionId = mcqQuestions[1].Id, Text = "changeState()", IsCorrect = false },
            
            // Test 1 - Question 3: TypeScript
            new McqOption { McqQuestionId = mcqQuestions[2].Id, Text = "Static type checking and better IDE support", IsCorrect = true },
            new McqOption { McqQuestionId = mcqQuestions[2].Id, Text = "Faster execution speed", IsCorrect = false },
            new McqOption { McqQuestionId = mcqQuestions[2].Id, Text = "Smaller file size", IsCorrect = false },
            new McqOption { McqQuestionId = mcqQuestions[2].Id, Text = "No compilation needed", IsCorrect = false },
            
            // Test 2 - Question 1: REST vs GraphQL
            new McqOption { McqQuestionId = mcqQuestions[3].Id, Text = "REST uses HTTP, GraphQL doesn't", IsCorrect = false },
            new McqOption { McqQuestionId = mcqQuestions[3].Id, Text = "GraphQL allows clients to request specific data", IsCorrect = true },
            new McqOption { McqQuestionId = mcqQuestions[3].Id, Text = "REST is faster than GraphQL", IsCorrect = false },
            new McqOption { McqQuestionId = mcqQuestions[3].Id, Text = "No difference", IsCorrect = false },
            
            // Test 2 - Question 2: Express middleware
            new McqOption { McqQuestionId = mcqQuestions[4].Id, Text = "To process requests and responses before reaching route handlers", IsCorrect = true },
            new McqOption { McqQuestionId = mcqQuestions[4].Id, Text = "To define routes", IsCorrect = false },
            new McqOption { McqQuestionId = mcqQuestions[4].Id, Text = "To connect to databases", IsCorrect = false },
            new McqOption { McqQuestionId = mcqQuestions[4].Id, Text = "To render views", IsCorrect = false },
            
            // Test 3 - Question 1: Node.js event loop
            new McqOption { McqQuestionId = mcqQuestions[5].Id, Text = "A mechanism that handles asynchronous operations", IsCorrect = true },
            new McqOption { McqQuestionId = mcqQuestions[5].Id, Text = "A way to loop through arrays", IsCorrect = false },
            new McqOption { McqQuestionId = mcqQuestions[5].Id, Text = "A database connection pool", IsCorrect = false },
            new McqOption { McqQuestionId = mcqQuestions[5].Id, Text = "A file system watcher", IsCorrect = false },
            
            // Test 3 - Question 2: async/await vs Promises
            new McqOption { McqQuestionId = mcqQuestions[6].Id, Text = "async/await provides cleaner syntax for handling asynchronous code", IsCorrect = true },
            new McqOption { McqQuestionId = mcqQuestions[6].Id, Text = "Promises are faster", IsCorrect = false },
            new McqOption { McqQuestionId = mcqQuestions[6].Id, Text = "async/await doesn't work with Promises", IsCorrect = false },
            new McqOption { McqQuestionId = mcqQuestions[6].Id, Text = "No difference", IsCorrect = false },
            
            // Test 4 - Question 1: SOLID principles
            new McqOption { McqQuestionId = mcqQuestions[7].Id, Text = "Design principles for writing maintainable and scalable code", IsCorrect = true },
            new McqOption { McqQuestionId = mcqQuestions[7].Id, Text = "A database design pattern", IsCorrect = false },
            new McqOption { McqQuestionId = mcqQuestions[7].Id, Text = "A testing framework", IsCorrect = false },
            new McqOption { McqQuestionId = mcqQuestions[7].Id, Text = "A deployment strategy", IsCorrect = false },
            
            // Test 4 - Question 2: Microservices vs Monolith
            new McqOption { McqQuestionId = mcqQuestions[8].Id, Text = "Microservices break applications into independent services", IsCorrect = true },
            new McqOption { McqQuestionId = mcqQuestions[8].Id, Text = "Monoliths are always better", IsCorrect = false },
            new McqOption { McqQuestionId = mcqQuestions[8].Id, Text = "Microservices are always faster", IsCorrect = false },
            new McqOption { McqQuestionId = mcqQuestions[8].Id, Text = "No difference", IsCorrect = false }
        };

        context.McqOptions.AddRange(mcqOptions);
        await context.SaveChangesAsync();

        // Seed Programming Questions
        var programmingQuestions = new List<ProgrammingQuestion>
        {
            // Test 1: Frontend Developer Assessment
            new ProgrammingQuestion
            {
                TestId = tests[0].Id,
                QuestionText = "Implement a React component that displays a counter with increment and decrement buttons. The counter should start at 0 and display the current count.",
                StarterCode = "import React, { useState } from 'react';\n\nfunction Counter() {\n  // Your code here\n  return (\n    <div>\n      {/* Counter UI */}\n    </div>\n  );\n}\n\nexport default Counter;"
            },
            // Test 2: Full Stack Developer Assessment
            new ProgrammingQuestion
            {
                TestId = tests[1].Id,
                QuestionText = "Write a function that validates an email address using regular expressions. The function should return true for valid emails and false for invalid ones.",
                StarterCode = "function validateEmail(email) {\n  // Your code here\n  return false;\n}"
            },
            // Test 3: Backend Developer Assessment
            new ProgrammingQuestion
            {
                TestId = tests[2].Id,
                QuestionText = "Create an Express.js middleware function that logs the request method, URL, and timestamp for every incoming request.",
                StarterCode = "function requestLogger(req, res, next) {\n  // Your code here\n  next();\n}\n\nmodule.exports = requestLogger;"
            },
            // Test 4: Senior Software Engineer Assessment
            new ProgrammingQuestion
            {
                TestId = tests[3].Id,
                QuestionText = "Implement a function that finds the longest common subsequence (LCS) between two strings. Return the length of the LCS.",
                StarterCode = "function longestCommonSubsequence(str1, str2) {\n  // Your code here\n  return 0;\n}"
            }
        };

        context.ProgrammingQuestions.AddRange(programmingQuestions);
        await context.SaveChangesAsync();

        // Seed Programming Test Cases
        var programmingTestCases = new List<ProgrammingTestCase>
        {
            // Test 1: Counter component
            new ProgrammingTestCase
            {
                ProgrammingQuestionId = programmingQuestions[0].Id,
                Input = "Component renders with initial count 0",
                ExpectedOutput = "Counter displays 0"
            },
            new ProgrammingTestCase
            {
                ProgrammingQuestionId = programmingQuestions[0].Id,
                Input = "Increment button clicked",
                ExpectedOutput = "Count increases by 1"
            },
            // Test 2: Email validation
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
            },
            new ProgrammingTestCase
            {
                ProgrammingQuestionId = programmingQuestions[1].Id,
                Input = "user@domain.co.uk",
                ExpectedOutput = "true"
            },
            // Test 3: Request logger middleware
            new ProgrammingTestCase
            {
                ProgrammingQuestionId = programmingQuestions[2].Id,
                Input = "GET /api/users request",
                ExpectedOutput = "Logs: GET /api/users [timestamp]"
            },
            // Test 4: Longest Common Subsequence
            new ProgrammingTestCase
            {
                ProgrammingQuestionId = programmingQuestions[3].Id,
                Input = "str1: 'ABCDGH', str2: 'AEDFHR'",
                ExpectedOutput = "3"
            },
            new ProgrammingTestCase
            {
                ProgrammingQuestionId = programmingQuestions[3].Id,
                Input = "str1: 'AGGTAB', str2: 'GXTXAYB'",
                ExpectedOutput = "4"
            }
        };

        context.ProgrammingTestCases.AddRange(programmingTestCases);
        await context.SaveChangesAsync();

        // Seed User Completed Challenges
        var completedChallenges = new List<UserCompletedChallenge>
        {
            new UserCompletedChallenge
            {
                UserId = users[0].Id, // Ahmad Khoury
                ChallengeId = challenges[0].Id,
                CompletedAt = DateTime.UtcNow.AddDays(-10)
            },
            new UserCompletedChallenge
            {
                UserId = users[1].Id, // Layla Halabi
                ChallengeId = challenges[0].Id,
                CompletedAt = DateTime.UtcNow.AddDays(-8)
            },
            new UserCompletedChallenge
            {
                UserId = users[1].Id, // Layla Halabi
                ChallengeId = challenges[1].Id,
                CompletedAt = DateTime.UtcNow.AddDays(-5)
            },
            new UserCompletedChallenge
            {
                UserId = users[2].Id, // Karim Saad
                ChallengeId = challenges[0].Id,
                CompletedAt = DateTime.UtcNow.AddDays(-7)
            }
        };

        context.UserCompletedChallenges.AddRange(completedChallenges);
        await context.SaveChangesAsync();
    }
}

