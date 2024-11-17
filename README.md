# auth-app
# Node.js (Express, MySQL) API for User Management

## Features
This project provides the following functionalities:
1. **Registration API**:
   - Accepts the following fields in the request body:
     - `first_name`
     - `last_name`
     - `email`
     - `password`
     - `nid`
     - `profile_photo`
     - `age`
     - `current_marital_status`
     - `auth_token`
   - Implementation Details:
     - `email` and `password` are stored in the `auth` table.
     - Other fields are stored in the `profile` table.
     - Ensures ACID properties:
       - If any table insertion fails, the other is rolled back.
     - Password encryption is implemented using the **Crypto Library**.
     - Photo upload is handled with the **Multer Library**:
       - Photos are stored locally, and their paths are saved in the database.
     - Returns:
       - **200** for success.
       - Generic responses for success and failure.

2. **Login API**:
   - Accepts the following fields in the request body:
     - `email`
     - `password`
   - Implementation Details:
     - Verifies email and password.
     - On success, generates a random UUID and stores it as `auth_token` in the `auth` table.

3. **Update Profile API**:
   - Route: `your-local-route/:user_id/`
   - Accepts profile table fields in the request body.
   - Ensures only the user can update their data.

4. **Delete Account API**:
   - Route: `your-local-route/:user_id/`
   - Allows a user to delete their account.

5. **View Profile API**:
   - Allows a user to see their profile data.
   - Ensures the password is excluded from the response.

---

## Coding Standards and Practices
1. **Naming Conventions**:
   - Use `camelCase` for all variable names.
   - Boolean fields follow meaningful conventions like `isActive`, `hasSeen`.
   
2. **Error Handling**:
   - Provide generic responses for both success and failure.

3. **Response Codes**:
   - Use proper HTTP response codes:
     - **200** for success.
     - Appropriate codes for failure based on [REST Best Practices](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#successful_responses).

4. **Libraries Used**:
   - **Crypto** for password encryption.
   - **Multer** for file upload.
   - **mysql2** for database operations.

5. **REST API Practices**:
   - Follow the best practices outlined in [this guide](https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/).
   - Ensure APIs are RESTful and maintain clean code standards.

6. **For JS Clean Code**:
   - Follow the best practices outlined in [this guide](https://github.com/ryanmcdermott/clean-code-javascript#error-handling).

---

## Installation and Setup
1. Clone this repository.
2. Install dependencies:
   ```bash
   npm install

