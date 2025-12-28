# Backend API Documentation

This documentation describes the API endpoints for the backend application.

## Base URL
The API is typically served at `http://localhost:3000` (or your deployed URL).

## Authentication
Most endpoints require authentication using a JWT token.
Include the token in the `Authorization` header: `Bearer <token>`.

---

## 1. Auth Module
**Base Path:** `/auth`

### Sign Up
Register a new user.
- **Endpoint:** `POST /signup`
- **Content-Type:** `multipart/form-data`
- **Headers:** `accept-language` (optional)
- **Body Parameters:**
  - `username` (string, required): Unique username.
  - `email` (string, required): User email address.
  - `password` (string, required): Password (min 6 chars).
  - `firstName` (string, required): User's first name.
  - `lastName` (string, required): User's last name.
  - `image` (file, required): Profile image.

### Sign In
Authenticate an existing user.
- **Endpoint:** `POST /signin`
- **Body Parameters:**
  - `email` (string, required)
  - `password` (string, required)

### Verify Email
Verify user's email address using a token.
- **Endpoint:** `POST /verify-email`
- **Body Parameters:**
  - `token` (string, required)

### Get Current User
Get details of the currently authenticated user.
- **Endpoint:** `GET /me`
- **Authentication:** Required
- **Response:** `UserResponseDto`
  - `id`, `email`, `firstName`, `lastName`, `fullName`, `username`, `imageUrl`, `userRole`, `createdAt`, `updatedAt`

### Forgot Password
Request a password reset link.
- **Endpoint:** `POST /forgot-password`
- **Headers:** `accept-language` (optional)
- **Body Parameters:**
  - `email` (string, required)

### Reset Password
Reset password using a valid token.
- **Endpoint:** `POST /reset-password`
- **Body Parameters:**
  - `token` (string, required)
  - `newPassword` (string, required, min 6 chars)
  - `confirmPassword` (string, required, min 6 chars)

### Validate Reset Token
Check if a reset token is valid.
- **Endpoint:** `GET /validate-reset-token`
- **Query Parameters:**
  - `token` (string, required)

---

## 2. Organizations Module
**Base Path:** `/organizations`

### Create Organization
Create a new organization.
- **Endpoint:** `POST /`
- **Authentication:** Required
- **Content-Type:** `multipart/form-data`
- **Body Parameters:**
  - `orgName` (string, required): Organization name.
  - `slug` (string, required): Unique slug for the organization.
  - `imageUrl` (string, optional): URL if image hosted elsewhere.
  - `image` (file, optional): Organization logo upload (max 5MB, images only).

### Get All Organizations
Retrieve a list of organizations.
- **Endpoint:** `GET /`
- **Query Parameters:**
  - `search` (string, optional): Search by name.
  - `isVerified` (boolean, optional): Filter by verification status (`true` or `false`).

### Get Organization by User
Get organizations associated with a specific user.
- **Endpoint:** `GET /user/:userId`
- **Params:** `userId` (UUID context)

### Get Organization by ID
Get single organization details.
- **Endpoint:** `GET /:id`
- **Params:** `id` (UUID)

### Update Organization
Update organization details.
- **Endpoint:** `PATCH /:id`
- **Authentication:** Required
- **Content-Type:** `multipart/form-data`
- **Params:** `id` (UUID)
- **Body Parameters:**
  - `orgName` (string, optional)
  - `imageUrl` (string, optional)
  - `isVerified` (boolean, optional)
  - `isBanned` (boolean, optional)
  - `logo` (file, optional): New logo file.

### Delete Organization
- **Endpoint:** `DELETE /:id`
- **Authentication:** Required
- **Params:** `id` (UUID)

### Verify Organization
- **Endpoint:** `POST /:id/verify`
- **Authentication:** Required
- **Params:** `id` (UUID)

### Ban/Unban Organization
- **Endpoint:** `POST /:id/ban`
- **Endpoint:** `POST /:id/unban`
- **Authentication:** Required
- **Params:** `id` (UUID)

---

## 3. Job Listings Module
**Base Path:** `/job-listings`

### Create Job Listing
- **Endpoint:** `POST /`
- **Authentication:** Required
- **Body Parameters (CreateJobListingDto):**
  - `organizationId` (UUID, required)
  - `title` (string, required)
  - `description` (string, required)
  - `locationRequirement` (enum: `in-office`, `hybrid`, `remote`, required)
  - `experienceLevel` (enum: `junior`, `mid`, `senior`, `lead`, `ceo`, `director`, required)
  - `type` (enum: `internship`, `part-time`, `full-time`, required)
  - `wage` (number, optional)
  - `wageInterval` (enum: `hourly`, `yearly`, optional)
  - `stateAbbreviation` (string, optional)
  - `city` (string, optional)
  - `isFeatured` (boolean, optional)
  - `status` (enum: `draft`, `published`, `delisted`, optional)
  - `postedAt` (date string, optional)

### Get All Job Listings
- **Endpoint:** `GET /`
- **Query Parameters:**
  - `search` (string, optional)
  - `organizationId` (UUID, optional)
  - `status` (string, optional)
  - `type` (string, optional)
  - `locationRequirement` (string, optional)
  - `experienceLevel` (string, optional)

### Get Job Listing by ID
- **Endpoint:** `GET /:id`
- **Params:** `id` (UUID)

### Update Job Listing
- **Endpoint:** `PATCH /:id`
- **Authentication:** Required
- **Params:** `id` (UUID)
- **Body Parameters (UpdateJobListingDto):**
  - Includes all optional fields from CreateJobListingDto.

### Delete Job Listing
- **Endpoint:** `DELETE /:id`
- **Authentication:** Required
- **Params:** `id` (UUID)

### Publish/Delist Job Listing
- **Endpoint:** `POST /:id/publish`
- **Endpoint:** `POST /:id/delist`
- **Authentication:** Required
- **Params:** `id` (UUID)
