# Cleanup Company Test Results

This script removes all test results from company users from the database.

## How to Use

### Option 1: Using the API Endpoint (Recommended)

Call the cleanup endpoint as an admin user:

```bash
# Using curl
curl -X DELETE "https://your-api-url/api/test-results/cleanup/company-results" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Using Postman or similar tool
DELETE /api/test-results/cleanup/company-results
Headers: Authorization: Bearer YOUR_ADMIN_TOKEN
```

### Option 2: Direct Database Query (SQL Server)

If you need to clean up directly from the database:

```sql
-- Delete test results from company users
DELETE tr
FROM TestResults tr
INNER JOIN Users u ON tr.UserId = u.Id
WHERE u.UserType = 'company';
```

### Option 3: Using Entity Framework (Development)

You can also run this in a development environment using Entity Framework migrations or a console application.

## Notes

- This operation is irreversible. Make sure you want to delete all company test results.
- The endpoint requires admin role authorization.
- After cleanup, companies will no longer appear in leaderboards or test takers lists.

