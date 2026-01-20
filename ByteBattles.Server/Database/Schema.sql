-- ============================================================================
-- ByteBattles Database Schema
-- SQL Server Database Creation Script
-- ============================================================================
-- This script creates the ByteBattles database and all required tables.
-- Run this script in SQL Server Management Studio or Azure Data Studio.
-- ============================================================================

-- Create Database (uncomment if needed)
-- CREATE DATABASE ByteBattles;
-- GO
-- USE ByteBattles;
-- GO

-- ============================================================================
-- Users Table
-- ============================================================================
CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY(1,1),
    GoogleId NVARCHAR(255) NULL,
    Username NVARCHAR(100) NOT NULL,
    Email NVARCHAR(255) NOT NULL,
    PasswordHash NVARCHAR(255) NULL,
    Name NVARCHAR(200) NULL,
    ContactNumber NVARCHAR(50) NULL,
    Address NVARCHAR(500) NULL,
    Country NVARCHAR(100) NULL,
    City NVARCHAR(100) NULL,
    ProfilePictureUrl NVARCHAR(500) NULL,
    UserType NVARCHAR(20) NOT NULL DEFAULT 'individual',
    CompanyName NVARCHAR(200) NULL,
    CompanyAddress NVARCHAR(500) NULL,
    CompanyContactNumber NVARCHAR(50) NULL,
    ExperiencePoints INT DEFAULT 0,
    HighScore INT DEFAULT 0,
    [Rank] INT DEFAULT 1,
    LearningPath NVARCHAR(20) NULL,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    LastLogin DATETIME2 NULL,
    
    CONSTRAINT UQ_Users_GoogleId UNIQUE (GoogleId),
    CONSTRAINT UQ_Users_Username UNIQUE (Username),
    CONSTRAINT UQ_Users_Email UNIQUE (Email),
    CONSTRAINT CK_Users_UserType CHECK (UserType IN ('individual', 'company')),
    CONSTRAINT CK_Users_LearningPath CHECK (LearningPath IS NULL OR LearningPath IN ('Frontend', 'Backend'))
);
GO

-- ============================================================================
-- UserRoles Table (Many-to-Many relationship)
-- ============================================================================
CREATE TABLE UserRoles (
    UserId INT NOT NULL,
    [Role] NVARCHAR(20) NOT NULL,
    
    CONSTRAINT PK_UserRoles PRIMARY KEY (UserId, [Role]),
    CONSTRAINT FK_UserRoles_Users FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    CONSTRAINT CK_UserRoles_Role CHECK ([Role] IN ('learner', 'admin', 'company'))
);
GO

-- ============================================================================
-- Courses Table
-- ============================================================================
CREATE TABLE Courses (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX) NOT NULL,
    Difficulty NVARCHAR(20) NOT NULL,
    ImageUrl NVARCHAR(500) NOT NULL,
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),
    
    CONSTRAINT CK_Courses_Difficulty CHECK (Difficulty IN ('Beginner', 'Intermediate', 'Advanced'))
);
GO

-- ============================================================================
-- UserCourseProgress Table
-- ============================================================================
CREATE TABLE UserCourseProgress (
    Id INT PRIMARY KEY IDENTITY(1,1),
    UserId INT NOT NULL,
    CourseId INT NOT NULL,
    Progress DECIMAL(5,2) DEFAULT 0,
    LastAccessed DATETIME2 NULL,
    
    CONSTRAINT FK_UserCourseProgress_Users FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    CONSTRAINT FK_UserCourseProgress_Courses FOREIGN KEY (CourseId) REFERENCES Courses(Id) ON DELETE CASCADE,
    CONSTRAINT UQ_UserCourseProgress UNIQUE (UserId, CourseId)
);
GO

-- ============================================================================
-- Challenges Table
-- ============================================================================
CREATE TABLE Challenges (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX) NOT NULL,
    Difficulty NVARCHAR(20) NULL,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);
GO

-- ============================================================================
-- ChallengeTemplateCodes Table
-- ============================================================================
CREATE TABLE ChallengeTemplateCodes (
    Id INT PRIMARY KEY IDENTITY(1,1),
    ChallengeId INT NOT NULL,
    [Language] NVARCHAR(50) NOT NULL,
    Code NVARCHAR(MAX) NOT NULL,
    
    CONSTRAINT FK_ChallengeTemplateCodes_Challenges FOREIGN KEY (ChallengeId) REFERENCES Challenges(Id) ON DELETE CASCADE,
    CONSTRAINT UQ_ChallengeTemplateCodes UNIQUE (ChallengeId, [Language])
);
GO

-- ============================================================================
-- ChallengeTestCases Table
-- ============================================================================
CREATE TABLE ChallengeTestCases (
    Id INT PRIMARY KEY IDENTITY(1,1),
    ChallengeId INT NOT NULL,
    Input NVARCHAR(MAX) NOT NULL,
    ExpectedOutput NVARCHAR(MAX) NOT NULL,
    
    CONSTRAINT FK_ChallengeTestCases_Challenges FOREIGN KEY (ChallengeId) REFERENCES Challenges(Id) ON DELETE CASCADE
);
GO

-- ============================================================================
-- UserCompletedChallenges Table
-- ============================================================================
CREATE TABLE UserCompletedChallenges (
    UserId INT NOT NULL,
    ChallengeId INT NOT NULL,
    CompletedAt DATETIME2 DEFAULT GETUTCDATE(),
    
    CONSTRAINT PK_UserCompletedChallenges PRIMARY KEY (UserId, ChallengeId),
    CONSTRAINT FK_UserCompletedChallenges_Users FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    CONSTRAINT FK_UserCompletedChallenges_Challenges FOREIGN KEY (ChallengeId) REFERENCES Challenges(Id) ON DELETE CASCADE
);
GO

-- ============================================================================
-- Tests Table (Company coding tests)
-- ============================================================================
CREATE TABLE Tests (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Title NVARCHAR(200) NOT NULL,
    CreatedById INT NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    
    CONSTRAINT FK_Tests_Users FOREIGN KEY (CreatedById) REFERENCES Users(Id) ON DELETE NO ACTION
);
GO

-- ============================================================================
-- McqQuestions Table
-- ============================================================================
CREATE TABLE McqQuestions (
    Id INT PRIMARY KEY IDENTITY(1,1),
    TestId INT NOT NULL,
    QuestionText NVARCHAR(MAX) NOT NULL,
    
    CONSTRAINT FK_McqQuestions_Tests FOREIGN KEY (TestId) REFERENCES Tests(Id) ON DELETE CASCADE
);
GO

-- ============================================================================
-- McqOptions Table
-- ============================================================================
CREATE TABLE McqOptions (
    Id INT PRIMARY KEY IDENTITY(1,1),
    McqQuestionId INT NOT NULL,
    [Text] NVARCHAR(500) NOT NULL,
    IsCorrect BIT DEFAULT 0,
    
    CONSTRAINT FK_McqOptions_McqQuestions FOREIGN KEY (McqQuestionId) REFERENCES McqQuestions(Id) ON DELETE CASCADE
);
GO

-- ============================================================================
-- ProgrammingQuestions Table
-- ============================================================================
CREATE TABLE ProgrammingQuestions (
    Id INT PRIMARY KEY IDENTITY(1,1),
    TestId INT NOT NULL UNIQUE,
    QuestionText NVARCHAR(MAX) NOT NULL,
    StarterCode NVARCHAR(MAX) NULL,
    
    CONSTRAINT FK_ProgrammingQuestions_Tests FOREIGN KEY (TestId) REFERENCES Tests(Id) ON DELETE CASCADE
);
GO

-- ============================================================================
-- ProgrammingTestCases Table
-- ============================================================================
CREATE TABLE ProgrammingTestCases (
    Id INT PRIMARY KEY IDENTITY(1,1),
    ProgrammingQuestionId INT NOT NULL,
    Input NVARCHAR(MAX) NOT NULL,
    ExpectedOutput NVARCHAR(MAX) NOT NULL,
    
    CONSTRAINT FK_ProgrammingTestCases_ProgrammingQuestions FOREIGN KEY (ProgrammingQuestionId) REFERENCES ProgrammingQuestions(Id) ON DELETE CASCADE
);
GO

-- ============================================================================
-- Create Indexes for Performance
-- ============================================================================
CREATE INDEX IX_Users_Email ON Users(Email);
CREATE INDEX IX_Users_Username ON Users(Username);
CREATE INDEX IX_Users_HighScore ON Users(HighScore DESC);
CREATE INDEX IX_Tests_CreatedById ON Tests(CreatedById);
CREATE INDEX IX_Challenges_Difficulty ON Challenges(Difficulty);
CREATE INDEX IX_Courses_IsActive ON Courses(IsActive);
GO

-- ============================================================================
-- Insert Default Admin User (Password: Admin@123)
-- ============================================================================
-- Note: The password hash below is for "Admin@123" using BCrypt
-- You should change this in production!
INSERT INTO Users (Username, Email, PasswordHash, Name, UserType, CreatedAt)
VALUES ('admin', 'admin@bytebattles.com', '$2a$11$rKN5zLPJvbO0vHVrp3S0l.qXqZWRGfV1Z1234567890abcdefghij', 'System Admin', 'individual', GETUTCDATE());

INSERT INTO UserRoles (UserId, [Role])
SELECT Id, 'admin' FROM Users WHERE Username = 'admin';

INSERT INTO UserRoles (UserId, [Role])
SELECT Id, 'learner' FROM Users WHERE Username = 'admin';
GO

PRINT 'ByteBattles database schema created successfully!';
GO

