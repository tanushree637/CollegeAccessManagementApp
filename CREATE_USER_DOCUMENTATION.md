# Create User Feature Documentation

## Overview

The Create User feature allows administrators to create new user accounts for Teachers, Students, and Security Guards. The system automatically generates login credentials and sends them via email to the user's personal email address.

## How It Works

### 1. Admin Creates User

- Admin enters:
  - **Full Name**: User's complete name (e.g., "John Doe")
  - **Personal Email**: User's personal email address (e.g., "john.doe@gmail.com")
  - **Role**: Teacher, Student, or Security Guard

### 2. System Auto-Generation

When the admin submits the form, the system automatically:

#### Generates College Email:

- Format: `{role_prefix}.{formatted_name}.{random_number}@college.edu`
- Examples:
  - Teacher: `t.john.doe.123@college.edu`
  - Student: `s.jane.smith.456@college.edu`
  - Guard: `g.mike.wilson.789@college.edu`

#### Generates Random Password:

- 8 characters long
- Contains: uppercase, lowercase, numbers, and special characters
- Example: `A3b@xY9z`

### 3. Email Notification

The system sends a welcome email to the user's personal email containing:

- College email address for login
- Auto-generated password
- Role information
- Instructions for first login
- Security reminders

### 4. User Login

Users can now log into the app using:

- **Email**: Their generated college email
- **Password**: The password received via email

## Technical Implementation

### Backend Changes

1. **Admin Controller (`adminController.js`)**:

   - Enhanced `createUser` function
   - Added credential generation logic
   - Integrated email sending

2. **Email Service (`emailService.js`)**:

   - Improved HTML email formatting
   - Better error handling
   - Professional email templates

3. **Auth Controller (`authController.js`)**:
   - Updated login to support new credential system
   - Added account status checking
   - Enhanced error messages

### Frontend Changes

1. **Create User Screen**:

   - Better form validation
   - Improved placeholders and UI
   - Enhanced user feedback
   - Loading states and error handling

2. **Login Screen**:
   - Updated placeholders to guide users
   - Improved email format hints

## Security Features

- Passwords contain mixed character types
- Account status checking (active/inactive)
- Email validation
- Duplicate email prevention
- Last login tracking

## Database Structure

```javascript
{
  fullName: "John Doe",
  personalEmail: "john.doe@gmail.com",  // Original email from admin
  email: "s.john.doe.123@college.edu",   // Generated college email for login
  role: "student",
  password: "A3b@xY9z",                  // Auto-generated password
  isActive: true,
  createdAt: "2024-01-15T10:30:00Z",
  createdBy: "admin",
  lastLogin: "2024-01-15T14:22:00Z"
}
```

## Testing

Use the test script in `backend/scripts/testCreateUser.js` to test the user creation functionality:

```bash
cd backend
node scripts/testCreateUser.js
```

## Environment Variables

For production, set these environment variables:

```
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## Future Enhancements

- Password complexity requirements
- Password expiration policies
- User profile completion reminders
- Bulk user creation via CSV import
- Role-based dashboard customization
