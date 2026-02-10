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
                Username = "omar_haddad",
                Email = "omar.haddad@example.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123!"),
                Name = "Omar Haddad",
                UserType = "individual",
                Country = "Lebanon",
                City = "Beirut",
                Address = "Verdun Street, Beirut",
                ContactNumber = "+961-3-456789",
                ExperiencePoints = 320,
                HighScore = 1100,
                Rank = 3,
                LearningPath = "Full Stack",
                CreatedAt = DateTime.UtcNow.AddDays(-60)
            },
            new User
            {
                Username = "nadia_mansour",
                Email = "nadia.mansour@example.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123!"),
                Name = "Nadia Mansour",
                UserType = "individual",
                Country = "Lebanon",
                City = "Jounieh",
                Address = "Maameltein, Jounieh",
                ContactNumber = "+961-9-234567",
                ExperiencePoints = 550,
                HighScore = 1480,
                Rank = 1,
                LearningPath = "Backend",
                CreatedAt = DateTime.UtcNow.AddDays(-50)
            },
            new User
            {
                Username = "rami_fakhouri",
                Email = "rami.fakhouri@example.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123!"),
                Name = "Rami Fakhouri",
                UserType = "individual",
                Country = "Lebanon",
                City = "Zahle",
                Address = "Boulevard Street, Zahle",
                ContactNumber = "+961-8-567890",
                ExperiencePoints = 210,
                HighScore = 850,
                Rank = 5,
                LearningPath = "Frontend",
                CreatedAt = DateTime.UtcNow.AddDays(-40)
            },
            new User
            {
                Username = "maya_nassar",
                Email = "maya.nassar@example.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123!"),
                Name = "Maya Nassar",
                UserType = "individual",
                Country = "Lebanon",
                City = "Byblos",
                Address = "Old Souk, Byblos",
                ContactNumber = "+961-9-876543",
                ExperiencePoints = 480,
                HighScore = 1320,
                Rank = 2,
                LearningPath = "Full Stack",
                CreatedAt = DateTime.UtcNow.AddDays(-30)
            },
            // Lebanese Companies
            new User
            {
                Username = "phoenix_digital",
                Email = "careers@phoenixdigital.lb",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Company123!"),
                Name = "Phoenix Digital Agency",
                UserType = "company",
                CompanyName = "Phoenix Digital Agency",
                CompanyAddress = "Achrafieh, Gemmayze Street, Beirut, Lebanon",
                CompanyContactNumber = "+961-1-345678",
                Country = "Lebanon",
                City = "Beirut",
                CreatedAt = DateTime.UtcNow.AddDays(-25)
            },
            new User
            {
                Username = "levant_software",
                Email = "hr@levantsoftware.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Company123!"),
                Name = "Levant Software Solutions",
                UserType = "company",
                CompanyName = "Levant Software Solutions",
                CompanyAddress = "Sin El Fil, Horsh Tabet, Beirut, Lebanon",
                CompanyContactNumber = "+961-1-654321",
                Country = "Lebanon",
                City = "Beirut",
                CreatedAt = DateTime.UtcNow.AddDays(-18)
            }
        };

        context.Users.AddRange(users);
        await context.SaveChangesAsync();

        // Seed User Roles
        var userRoles = new List<UserRole>
        {
            new UserRole { UserId = users[0].Id, Role = "learner" }, // Omar Haddad
            new UserRole { UserId = users[1].Id, Role = "learner" }, // Nadia Mansour
            new UserRole { UserId = users[2].Id, Role = "learner" }, // Rami Fakhouri
            new UserRole { UserId = users[3].Id, Role = "learner" }, // Maya Nassar
            new UserRole { UserId = users[4].Id, Role = "company" }, // Phoenix Digital
            new UserRole { UserId = users[5].Id, Role = "company" }  // Levant Software
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
                Progress = 85.00m,
                LastAccessed = DateTime.UtcNow.AddDays(-1)
            },
            new UserCourseProgress
            {
                UserId = users[0].Id,
                CourseId = courses[1].Id,
                Progress = 60.00m,
                LastAccessed = DateTime.UtcNow.AddDays(-2)
            },
            new UserCourseProgress
            {
                UserId = users[0].Id,
                CourseId = courses[2].Id,
                Progress = 25.00m,
                LastAccessed = DateTime.UtcNow.AddDays(-4)
            },
            new UserCourseProgress
            {
                UserId = users[1].Id,
                CourseId = courses[2].Id,
                Progress = 90.00m,
                LastAccessed = DateTime.UtcNow.AddDays(-1)
            },
            new UserCourseProgress
            {
                UserId = users[1].Id,
                CourseId = courses[3].Id,
                Progress = 70.00m,
                LastAccessed = DateTime.UtcNow.AddDays(-2)
            },
            new UserCourseProgress
            {
                UserId = users[2].Id,
                CourseId = courses[0].Id,
                Progress = 100.00m,
                LastAccessed = DateTime.UtcNow.AddDays(-5)
            },
            new UserCourseProgress
            {
                UserId = users[2].Id,
                CourseId = courses[1].Id,
                Progress = 40.00m,
                LastAccessed = DateTime.UtcNow.AddDays(-3)
            },
            new UserCourseProgress
            {
                UserId = users[3].Id,
                CourseId = courses[3].Id,
                Progress = 55.00m,
                LastAccessed = DateTime.UtcNow.AddDays(-1)
            },
            new UserCourseProgress
            {
                UserId = users[3].Id,
                CourseId = courses[2].Id,
                Progress = 80.00m,
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
                Title = "FizzBuzz",
                Description = "Write a function that returns an array of numbers from 1 to n, but for multiples of 3 return 'Fizz', for multiples of 5 return 'Buzz', and for multiples of both return 'FizzBuzz'.",
                Difficulty = "Easy",
                CreatedAt = DateTime.UtcNow.AddDays(-28)
            },
            new Challenge
            {
                Title = "Valid Parentheses",
                Description = "Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if open brackets are closed by the same type of brackets and in the correct order.",
                Difficulty = "Easy",
                CreatedAt = DateTime.UtcNow.AddDays(-24)
            },
            new Challenge
            {
                Title = "Merge Sorted Arrays",
                Description = "Given two sorted arrays nums1 and nums2, merge nums2 into nums1 as one sorted array. The number of elements initialized in nums1 and nums2 are m and n respectively.",
                Difficulty = "Medium",
                CreatedAt = DateTime.UtcNow.AddDays(-20)
            },
            new Challenge
            {
                Title = "Binary Search",
                Description = "Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return -1. You must write an algorithm with O(log n) runtime complexity.",
                Difficulty = "Medium",
                CreatedAt = DateTime.UtcNow.AddDays(-16)
            },
            new Challenge
            {
                Title = "Maximum Subarray",
                Description = "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
                Difficulty = "Hard",
                CreatedAt = DateTime.UtcNow.AddDays(-12)
            }
        };

        context.Challenges.AddRange(challenges);
        await context.SaveChangesAsync();

        // Seed Challenge Template Codes
        var templateCodes = new List<ChallengeTemplateCode>
        {
            // FizzBuzz
            new ChallengeTemplateCode
            {
                ChallengeId = challenges[0].Id,
                Language = "javascript",
                Code = "function fizzBuzz(n) {\n  // Your code here\n  return [];\n}"
            },
            new ChallengeTemplateCode
            {
                ChallengeId = challenges[0].Id,
                Language = "python",
                Code = "def fizz_buzz(n):\n    # Your code here\n    return []"
            },
            // Valid Parentheses
            new ChallengeTemplateCode
            {
                ChallengeId = challenges[1].Id,
                Language = "javascript",
                Code = "function isValid(s) {\n  // Your code here\n  return false;\n}"
            },
            new ChallengeTemplateCode
            {
                ChallengeId = challenges[1].Id,
                Language = "python",
                Code = "def is_valid(s):\n    # Your code here\n    return False"
            },
            // Merge Sorted Arrays
            new ChallengeTemplateCode
            {
                ChallengeId = challenges[2].Id,
                Language = "javascript",
                Code = "function merge(nums1, m, nums2, n) {\n  // Your code here - modify nums1 in-place\n}"
            },
            new ChallengeTemplateCode
            {
                ChallengeId = challenges[2].Id,
                Language = "python",
                Code = "def merge(nums1, m, nums2, n):\n    # Your code here - modify nums1 in-place\n    pass"
            },
            // Binary Search
            new ChallengeTemplateCode
            {
                ChallengeId = challenges[3].Id,
                Language = "javascript",
                Code = "function search(nums, target) {\n  // Your code here\n  return -1;\n}"
            },
            new ChallengeTemplateCode
            {
                ChallengeId = challenges[3].Id,
                Language = "python",
                Code = "def search(nums, target):\n    # Your code here\n    return -1"
            },
            // Maximum Subarray
            new ChallengeTemplateCode
            {
                ChallengeId = challenges[4].Id,
                Language = "javascript",
                Code = "function maxSubArray(nums) {\n  // Your code here\n  return 0;\n}"
            },
            new ChallengeTemplateCode
            {
                ChallengeId = challenges[4].Id,
                Language = "python",
                Code = "def max_sub_array(nums):\n    # Your code here\n    return 0"
            }
        };

        context.ChallengeTemplateCodes.AddRange(templateCodes);
        await context.SaveChangesAsync();

        // Seed Challenge Test Cases
        var challengeTestCases = new List<ChallengeTestCase>
        {
            // FizzBuzz
            new ChallengeTestCase
            {
                ChallengeId = challenges[0].Id,
                Input = "{\"n\": 5}",
                ExpectedOutput = "[\"1\", \"2\", \"Fizz\", \"4\", \"Buzz\"]"
            },
            new ChallengeTestCase
            {
                ChallengeId = challenges[0].Id,
                Input = "{\"n\": 15}",
                ExpectedOutput = "[\"1\", \"2\", \"Fizz\", \"4\", \"Buzz\", \"Fizz\", \"7\", \"8\", \"Fizz\", \"Buzz\", \"11\", \"Fizz\", \"13\", \"14\", \"FizzBuzz\"]"
            },
            // Valid Parentheses
            new ChallengeTestCase
            {
                ChallengeId = challenges[1].Id,
                Input = "{\"s\": \"()\"}",
                ExpectedOutput = "true"
            },
            new ChallengeTestCase
            {
                ChallengeId = challenges[1].Id,
                Input = "{\"s\": \"()[]{}\"}",
                ExpectedOutput = "true"
            },
            new ChallengeTestCase
            {
                ChallengeId = challenges[1].Id,
                Input = "{\"s\": \"(]\"}",
                ExpectedOutput = "false"
            },
            new ChallengeTestCase
            {
                ChallengeId = challenges[1].Id,
                Input = "{\"s\": \"([)]\"}",
                ExpectedOutput = "false"
            },
            // Merge Sorted Arrays
            new ChallengeTestCase
            {
                ChallengeId = challenges[2].Id,
                Input = "{\"nums1\": [1,2,3,0,0,0], \"m\": 3, \"nums2\": [2,5,6], \"n\": 3}",
                ExpectedOutput = "[1,2,2,3,5,6]"
            },
            new ChallengeTestCase
            {
                ChallengeId = challenges[2].Id,
                Input = "{\"nums1\": [1], \"m\": 1, \"nums2\": [], \"n\": 0}",
                ExpectedOutput = "[1]"
            },
            // Binary Search
            new ChallengeTestCase
            {
                ChallengeId = challenges[3].Id,
                Input = "{\"nums\": [-1,0,3,5,9,12], \"target\": 9}",
                ExpectedOutput = "4"
            },
            new ChallengeTestCase
            {
                ChallengeId = challenges[3].Id,
                Input = "{\"nums\": [-1,0,3,5,9,12], \"target\": 2}",
                ExpectedOutput = "-1"
            },
            new ChallengeTestCase
            {
                ChallengeId = challenges[3].Id,
                Input = "{\"nums\": [5], \"target\": 5}",
                ExpectedOutput = "0"
            },
            // Maximum Subarray
            new ChallengeTestCase
            {
                ChallengeId = challenges[4].Id,
                Input = "{\"nums\": [-2,1,-3,4,-1,2,1,-5,4]}",
                ExpectedOutput = "6"
            },
            new ChallengeTestCase
            {
                ChallengeId = challenges[4].Id,
                Input = "{\"nums\": [1]}",
                ExpectedOutput = "1"
            },
            new ChallengeTestCase
            {
                ChallengeId = challenges[4].Id,
                Input = "{\"nums\": [5,4,-1,7,8]}",
                ExpectedOutput = "23"
            }
        };

        context.ChallengeTestCases.AddRange(challengeTestCases);
        await context.SaveChangesAsync();

        // Seed Tests (created by companies)
        var tests = new List<Test>
        {
            // Tests for Phoenix Digital Agency
            new Test
            {
                Title = "Junior Frontend Developer Assessment",
                CreatedById = users[4].Id, // Phoenix Digital
                CreatedAt = DateTime.UtcNow.AddDays(-14)
            },
            new Test
            {
                Title = "UI/UX Developer Technical Test",
                CreatedById = users[4].Id, // Phoenix Digital
                CreatedAt = DateTime.UtcNow.AddDays(-10)
            },
            // Tests for Levant Software Solutions
            new Test
            {
                Title = "Python Backend Developer Assessment",
                CreatedById = users[5].Id, // Levant Software
                CreatedAt = DateTime.UtcNow.AddDays(-12)
            },
            new Test
            {
                Title = "Full Stack JavaScript Assessment",
                CreatedById = users[5].Id, // Levant Software
                CreatedAt = DateTime.UtcNow.AddDays(-6)
            }
        };

        context.Tests.AddRange(tests);
        await context.SaveChangesAsync();

        // Seed MCQ Questions
        var mcqQuestions = new List<McqQuestion>
        {
            // Test 1: Junior Frontend Developer (Phoenix Digital)
            new McqQuestion
            {
                TestId = tests[0].Id,
                QuestionText = "Which CSS property is used to create space between elements?"
            },
            new McqQuestion
            {
                TestId = tests[0].Id,
                QuestionText = "What does the 'box-sizing: border-box' property do?"
            },
            new McqQuestion
            {
                TestId = tests[0].Id,
                QuestionText = "Which HTML5 element is used for navigation links?"
            },
            // Test 2: UI/UX Developer (Phoenix Digital)
            new McqQuestion
            {
                TestId = tests[1].Id,
                QuestionText = "What is the purpose of CSS Grid?"
            },
            new McqQuestion
            {
                TestId = tests[1].Id,
                QuestionText = "Which unit is relative to the viewport width?"
            },
            // Test 3: Python Backend Developer (Levant Software)
            new McqQuestion
            {
                TestId = tests[2].Id,
                QuestionText = "What is a Python decorator?"
            },
            new McqQuestion
            {
                TestId = tests[2].Id,
                QuestionText = "Which method is used to handle HTTP POST requests in Flask?"
            },
            new McqQuestion
            {
                TestId = tests[2].Id,
                QuestionText = "What is the purpose of __init__.py in Python packages?"
            },
            // Test 4: Full Stack JavaScript (Levant Software)
            new McqQuestion
            {
                TestId = tests[3].Id,
                QuestionText = "What is the difference between 'let' and 'const' in JavaScript?"
            },
            new McqQuestion
            {
                TestId = tests[3].Id,
                QuestionText = "What does the spread operator (...) do in JavaScript?"
            }
        };

        context.McqQuestions.AddRange(mcqQuestions);
        await context.SaveChangesAsync();

        // Seed MCQ Options
        var mcqOptions = new List<McqOption>
        {
            // Test 1 - Question 1: CSS spacing
            new McqOption { McqQuestionId = mcqQuestions[0].Id, Text = "margin", IsCorrect = true },
            new McqOption { McqQuestionId = mcqQuestions[0].Id, Text = "padding", IsCorrect = false },
            new McqOption { McqQuestionId = mcqQuestions[0].Id, Text = "border", IsCorrect = false },
            new McqOption { McqQuestionId = mcqQuestions[0].Id, Text = "outline", IsCorrect = false },

            // Test 1 - Question 2: box-sizing
            new McqOption { McqQuestionId = mcqQuestions[1].Id, Text = "Includes padding and border in element's total width and height", IsCorrect = true },
            new McqOption { McqQuestionId = mcqQuestions[1].Id, Text = "Adds a border around all elements", IsCorrect = false },
            new McqOption { McqQuestionId = mcqQuestions[1].Id, Text = "Makes the element a block-level element", IsCorrect = false },
            new McqOption { McqQuestionId = mcqQuestions[1].Id, Text = "Removes margin from the element", IsCorrect = false },

            // Test 1 - Question 3: HTML5 nav
            new McqOption { McqQuestionId = mcqQuestions[2].Id, Text = "<nav>", IsCorrect = true },
            new McqOption { McqQuestionId = mcqQuestions[2].Id, Text = "<navigation>", IsCorrect = false },
            new McqOption { McqQuestionId = mcqQuestions[2].Id, Text = "<menu>", IsCorrect = false },
            new McqOption { McqQuestionId = mcqQuestions[2].Id, Text = "<links>", IsCorrect = false },

            // Test 2 - Question 1: CSS Grid
            new McqOption { McqQuestionId = mcqQuestions[3].Id, Text = "Create two-dimensional layouts with rows and columns", IsCorrect = true },
            new McqOption { McqQuestionId = mcqQuestions[3].Id, Text = "Only create one-dimensional layouts", IsCorrect = false },
            new McqOption { McqQuestionId = mcqQuestions[3].Id, Text = "Add animations to elements", IsCorrect = false },
            new McqOption { McqQuestionId = mcqQuestions[3].Id, Text = "Create database grids", IsCorrect = false },

            // Test 2 - Question 2: Viewport unit
            new McqOption { McqQuestionId = mcqQuestions[4].Id, Text = "vw", IsCorrect = true },
            new McqOption { McqQuestionId = mcqQuestions[4].Id, Text = "px", IsCorrect = false },
            new McqOption { McqQuestionId = mcqQuestions[4].Id, Text = "em", IsCorrect = false },
            new McqOption { McqQuestionId = mcqQuestions[4].Id, Text = "rem", IsCorrect = false },

            // Test 3 - Question 1: Python decorator
            new McqOption { McqQuestionId = mcqQuestions[5].Id, Text = "A function that modifies the behavior of another function", IsCorrect = true },
            new McqOption { McqQuestionId = mcqQuestions[5].Id, Text = "A way to add CSS styling to Python", IsCorrect = false },
            new McqOption { McqQuestionId = mcqQuestions[5].Id, Text = "A type of Python variable", IsCorrect = false },
            new McqOption { McqQuestionId = mcqQuestions[5].Id, Text = "A database connection method", IsCorrect = false },

            // Test 3 - Question 2: Flask POST
            new McqOption { McqQuestionId = mcqQuestions[6].Id, Text = "@app.route('/path', methods=['POST'])", IsCorrect = true },
            new McqOption { McqQuestionId = mcqQuestions[6].Id, Text = "@app.post('/path')", IsCorrect = false },
            new McqOption { McqQuestionId = mcqQuestions[6].Id, Text = "app.handle_post('/path')", IsCorrect = false },
            new McqOption { McqQuestionId = mcqQuestions[6].Id, Text = "request.post('/path')", IsCorrect = false },

            // Test 3 - Question 3: __init__.py
            new McqOption { McqQuestionId = mcqQuestions[7].Id, Text = "Marks a directory as a Python package", IsCorrect = true },
            new McqOption { McqQuestionId = mcqQuestions[7].Id, Text = "Initializes the Python interpreter", IsCorrect = false },
            new McqOption { McqQuestionId = mcqQuestions[7].Id, Text = "Defines the main entry point", IsCorrect = false },
            new McqOption { McqQuestionId = mcqQuestions[7].Id, Text = "Stores environment variables", IsCorrect = false },

            // Test 4 - Question 1: let vs const
            new McqOption { McqQuestionId = mcqQuestions[8].Id, Text = "let allows reassignment, const does not", IsCorrect = true },
            new McqOption { McqQuestionId = mcqQuestions[8].Id, Text = "const is faster than let", IsCorrect = false },
            new McqOption { McqQuestionId = mcqQuestions[8].Id, Text = "let is global, const is local", IsCorrect = false },
            new McqOption { McqQuestionId = mcqQuestions[8].Id, Text = "No difference", IsCorrect = false },

            // Test 4 - Question 2: Spread operator
            new McqOption { McqQuestionId = mcqQuestions[9].Id, Text = "Expands an iterable into individual elements", IsCorrect = true },
            new McqOption { McqQuestionId = mcqQuestions[9].Id, Text = "Concatenates strings", IsCorrect = false },
            new McqOption { McqQuestionId = mcqQuestions[9].Id, Text = "Creates a loop", IsCorrect = false },
            new McqOption { McqQuestionId = mcqQuestions[9].Id, Text = "Defines a rest parameter only", IsCorrect = false }
        };

        context.McqOptions.AddRange(mcqOptions);
        await context.SaveChangesAsync();

        // Seed Programming Questions
        var programmingQuestions = new List<ProgrammingQuestion>
        {
            // Test 1: Junior Frontend Developer
            new ProgrammingQuestion
            {
                TestId = tests[0].Id,
                QuestionText = "Write a JavaScript function that takes an array of numbers and returns a new array with only the even numbers, sorted in ascending order.",
                StarterCode = "function filterAndSortEven(numbers) {\n  // Your code here\n  return [];\n}"
            },
            // Test 2: UI/UX Developer
            new ProgrammingQuestion
            {
                TestId = tests[1].Id,
                QuestionText = "Create a function that converts a hex color code (e.g., '#FF5733') to RGB format (e.g., 'rgb(255, 87, 51)').",
                StarterCode = "function hexToRgb(hex) {\n  // Your code here\n  return '';\n}"
            },
            // Test 3: Python Backend Developer
            new ProgrammingQuestion
            {
                TestId = tests[2].Id,
                QuestionText = "Write a Python function that takes a list of dictionaries and groups them by a specified key, returning a dictionary where keys are the grouped values.",
                StarterCode = "def group_by_key(data, key):\n    # Your code here\n    return {}"
            },
            // Test 4: Full Stack JavaScript
            new ProgrammingQuestion
            {
                TestId = tests[3].Id,
                QuestionText = "Implement a debounce function that delays invoking a function until after a specified wait time has elapsed since the last time it was invoked.",
                StarterCode = "function debounce(func, wait) {\n  // Your code here\n  return function() {};\n}"
            }
        };

        context.ProgrammingQuestions.AddRange(programmingQuestions);
        await context.SaveChangesAsync();

        // Seed Programming Test Cases
        var programmingTestCases = new List<ProgrammingTestCase>
        {
            // Test 1: Filter and sort even
            new ProgrammingTestCase
            {
                ProgrammingQuestionId = programmingQuestions[0].Id,
                Input = "[5, 2, 8, 1, 4, 7, 6]",
                ExpectedOutput = "[2, 4, 6, 8]"
            },
            new ProgrammingTestCase
            {
                ProgrammingQuestionId = programmingQuestions[0].Id,
                Input = "[1, 3, 5, 7]",
                ExpectedOutput = "[]"
            },
            new ProgrammingTestCase
            {
                ProgrammingQuestionId = programmingQuestions[0].Id,
                Input = "[10, 2, 8, 4]",
                ExpectedOutput = "[2, 4, 8, 10]"
            },
            // Test 2: Hex to RGB
            new ProgrammingTestCase
            {
                ProgrammingQuestionId = programmingQuestions[1].Id,
                Input = "#FF5733",
                ExpectedOutput = "rgb(255, 87, 51)"
            },
            new ProgrammingTestCase
            {
                ProgrammingQuestionId = programmingQuestions[1].Id,
                Input = "#000000",
                ExpectedOutput = "rgb(0, 0, 0)"
            },
            new ProgrammingTestCase
            {
                ProgrammingQuestionId = programmingQuestions[1].Id,
                Input = "#FFFFFF",
                ExpectedOutput = "rgb(255, 255, 255)"
            },
            // Test 3: Group by key
            new ProgrammingTestCase
            {
                ProgrammingQuestionId = programmingQuestions[2].Id,
                Input = "[{'name': 'Ali', 'city': 'Beirut'}, {'name': 'Sara', 'city': 'Tripoli'}, {'name': 'Omar', 'city': 'Beirut'}], 'city'",
                ExpectedOutput = "{'Beirut': [{'name': 'Ali', 'city': 'Beirut'}, {'name': 'Omar', 'city': 'Beirut'}], 'Tripoli': [{'name': 'Sara', 'city': 'Tripoli'}]}"
            },
            // Test 4: Debounce
            new ProgrammingTestCase
            {
                ProgrammingQuestionId = programmingQuestions[3].Id,
                Input = "Function called multiple times within 100ms",
                ExpectedOutput = "Function executes once after 100ms delay"
            }
        };

        context.ProgrammingTestCases.AddRange(programmingTestCases);
        await context.SaveChangesAsync();

        // Seed User Completed Challenges
        var completedChallenges = new List<UserCompletedChallenge>
        {
            new UserCompletedChallenge
            {
                UserId = users[0].Id, // Omar Haddad
                ChallengeId = challenges[0].Id, // FizzBuzz
                CompletedAt = DateTime.UtcNow.AddDays(-15)
            },
            new UserCompletedChallenge
            {
                UserId = users[0].Id, // Omar Haddad
                ChallengeId = challenges[1].Id, // Valid Parentheses
                CompletedAt = DateTime.UtcNow.AddDays(-12)
            },
            new UserCompletedChallenge
            {
                UserId = users[1].Id, // Nadia Mansour
                ChallengeId = challenges[0].Id, // FizzBuzz
                CompletedAt = DateTime.UtcNow.AddDays(-18)
            },
            new UserCompletedChallenge
            {
                UserId = users[1].Id, // Nadia Mansour
                ChallengeId = challenges[1].Id, // Valid Parentheses
                CompletedAt = DateTime.UtcNow.AddDays(-14)
            },
            new UserCompletedChallenge
            {
                UserId = users[1].Id, // Nadia Mansour
                ChallengeId = challenges[2].Id, // Merge Sorted Arrays
                CompletedAt = DateTime.UtcNow.AddDays(-10)
            },
            new UserCompletedChallenge
            {
                UserId = users[1].Id, // Nadia Mansour
                ChallengeId = challenges[3].Id, // Binary Search
                CompletedAt = DateTime.UtcNow.AddDays(-6)
            },
            new UserCompletedChallenge
            {
                UserId = users[2].Id, // Rami Fakhouri
                ChallengeId = challenges[0].Id, // FizzBuzz
                CompletedAt = DateTime.UtcNow.AddDays(-8)
            },
            new UserCompletedChallenge
            {
                UserId = users[3].Id, // Maya Nassar
                ChallengeId = challenges[0].Id, // FizzBuzz
                CompletedAt = DateTime.UtcNow.AddDays(-20)
            },
            new UserCompletedChallenge
            {
                UserId = users[3].Id, // Maya Nassar
                ChallengeId = challenges[1].Id, // Valid Parentheses
                CompletedAt = DateTime.UtcNow.AddDays(-16)
            },
            new UserCompletedChallenge
            {
                UserId = users[3].Id, // Maya Nassar
                ChallengeId = challenges[2].Id, // Merge Sorted Arrays
                CompletedAt = DateTime.UtcNow.AddDays(-11)
            }
        };

        context.UserCompletedChallenges.AddRange(completedChallenges);
        await context.SaveChangesAsync();
    }
}
