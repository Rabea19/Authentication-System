# Authentication System

A full-stack authentication application built with React, Node.js, Express, and MongoDB.

The project demonstrates a complete authentication workflow with email verification, secure cookie-based authentication, password recovery, protected routes, validation, automated tests, and security-focused middleware.

## Features

* User registration
* Email verification using a 6-digit verification code
* Resend verification code
* User login
* Authenticated user profile
* Protected frontend routes
* Logout
* Forgot password
* Password reset through an email link
* Change password
* Automatic logout after password change
* Responsive authentication interface
* User dashboard

## Security Features

The application includes several security controls:

* Password hashing with `bcryptjs`
* JWT-based authentication
* HttpOnly authentication cookies
* Secure cookie configuration for production
* SameSite cookie protection
* CORS configuration
* CSRF protection
* Helmet security headers
* Authentication rate limiting
* Input validation
* Protected API routes
* Hashed email verification codes
* Hashed password reset tokens
* Generic responses for sensitive authentication flows
* Environment-based secret management

> This project demonstrates security-conscious authentication practices, but it should still undergo a dedicated security review before use in a production environment.

## Tech Stack

### Frontend

* React
* Vite
* React Router
* Axios
* Tailwind CSS
* Vitest
* React Testing Library

### Backend

* Node.js
* Express
* MongoDB
* Mongoose
* JSON Web Tokens
* bcryptjs
* Zod
* express-validator
* Helmet
* express-rate-limit
* Mailtrap
* Supertest
* Node.js Test Runner

## Project Structure

```text
Authentication-System/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   └── pages/
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── services/
│   ├── tests/
│   ├── utils/
│   ├── validators/
│   ├── app.js
│   └── server.js
│
├── docs/
│   └── superpowers/
│
└── README.md
```

## Authentication Flow

### Registration

```text
User
  ↓
Register
  ↓
Account created in MongoDB
  ↓
Verification code generated
  ↓
Verification email sent
  ↓
Email verified
```

### Login

```text
User credentials
  ↓
Backend validation
  ↓
Password verification
  ↓
JWT generated
  ↓
HttpOnly cookie created
  ↓
Protected dashboard
```

### Password Reset

```text
Forgot Password
  ↓
Reset token generated
  ↓
Hashed token stored
  ↓
Reset email sent
  ↓
User opens reset link
  ↓
New password saved
```

### Change Password

After a successful password change, the authentication cookie is cleared and the user must log in again using the new password.

## API Endpoints

Base URL:

```text
http://localhost:5000/api
```

### Authentication

| Method | Endpoint                         | Description                          | Authentication |
| ------ | -------------------------------- | ------------------------------------ | -------------- |
| POST   | `/auth/register`                 | Create a new user account            | Public         |
| POST   | `/auth/verify-email`             | Verify email using a code            | Public         |
| POST   | `/auth/resend-verification-code` | Request a new verification code      | Public         |
| POST   | `/auth/login`                    | Log in                               | Public         |
| GET    | `/auth/me`                       | Get authenticated user               | Required       |
| POST   | `/auth/logout`                   | Log out                              | Cookie-based   |
| POST   | `/auth/forgot-password`          | Request password reset               | Public         |
| POST   | `/auth/reset-password`           | Reset password using token           | Public         |
| POST   | `/auth/change-password`          | Change authenticated user's password | Required       |

### Health Check

```text
GET /api/health
```

## Environment Variables

Create a `.env` file inside the `server` directory.

Example:

```env
PORT=5000
NODE_ENV=development

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=replace_with_a_long_random_secret
ACCESS_TOKEN_EXPIRES_IN=15m

VERIFICATION_CODE_SECRET=replace_with_a_long_random_secret

CLIENT_URL=http://localhost:5173

MAILTRAP_API_TOKEN=your_mailtrap_api_token
MAILTRAP_INBOX_ID=your_mailtrap_inbox_id

EMAIL_FROM_NAME=Authentication System
EMAIL_FROM_ADDRESS=no-reply@example.com

COOKIE_SECURE=false
COOKIE_SAME_SITE=lax
ACCESS_TOKEN_COOKIE_MAX_AGE_MS=900000
```

Never commit real credentials or secrets to Git.

The repository `.gitignore` files exclude local `.env` files.

## Frontend Environment

Create:

```text
client/.env
```

Example:

```env
VITE_API_URL=http://localhost:5000/api
```

## Installation

Clone the repository:

```bash
git clone https://github.com/Rabea19/Authentication-System.git
cd Authentication-System
```

### Install Backend Dependencies

```bash
cd server
npm install
```

### Install Frontend Dependencies

Open another terminal:

```bash
cd client
npm install
```

## Running the Application

### Start Backend

From the `server` directory:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

### Start Frontend

From the `client` directory:

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

## Testing

### Backend Tests

From the `server` directory:

```bash
npm test
```

Current backend test suite:

```text
72 tests
72 passing
0 failing
```

The backend tests cover areas including:

* Registration
* Login
* Logout
* Email verification
* Resend verification
* Forgot password
* Reset password
* Change password
* JWT utilities
* Password hashing
* Verification code utilities
* Password reset token utilities
* CSRF protection
* Security headers
* Validation
* User model behavior
* Protected profile endpoint

### Frontend Tests

From the `client` directory:

```bash
npx vitest run
```

Current frontend test suite:

```text
10 test files
35 tests
35 passing
```

The frontend tests cover:

* API integration layer
* Authentication context
* Home authentication form
* Protected routes
* Dashboard
* Email verification
* Forgot password
* Reset password
* Change password
* Application routing

## Production Build

Create a production frontend build:

```bash
cd client
npm run build
```

The generated production files are placed in:

```text
client/dist/
```

## Security Notes

* Authentication tokens are stored in HttpOnly cookies rather than browser storage.
* Production cookies use a secure cookie configuration.
* Verification codes are stored as hashes rather than plain values.
* Password reset tokens are hashed before storage.
* Passwords are never stored in plain text.
* Sensitive configuration is loaded through environment variables.
* CORS and CSRF protections restrict untrusted browser requests.
* Authentication endpoints use rate limiting.

## Future Improvements

Potential future improvements include:

* Refresh token rotation
* Multi-device session management
* Session revocation
* Two-factor authentication
* OAuth providers
* Account deletion
* User profile management
* Role-based authorization
* Docker support
* Production deployment
* End-to-end browser testing
* Expanded CI/CD automation

## Repository

GitHub:

`Rabea19/Authentication-System`

## License

This project currently uses the ISC license defined in the backend package configuration.

