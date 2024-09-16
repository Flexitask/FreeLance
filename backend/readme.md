Project Name
Overview
This project is a web application with three types of users: Client, Developer, and Admin. It uses Express for the backend, MongoDB for the database, and Zod for input validation. The application handles different roles with distinct permissions and functionalities for each type of user.

Features
Client: Can interact with the services, request projects, and view their project status.
Developer: Can manage and work on assigned projects, update progress, and communicate with clients.
Admin: Has full control over user management, project assignments, and the entire application.


Technologies
Backend Framework: Express.js
Database: MongoDB
Validation: Zod
Routing: Express Router
Environment Variables: dotenv
Project Structure
bash
Copy code
.
├── .env                         # Environment variables (PORT, DB connection, JWT_SECRET, etc.)
├── .gitignore                   # Files to be ignored by git
├── README.md                    # Project documentation
├── package.json                 # Project dependencies and scripts
├── src
│   ├── app.js                   # Main entry point of the application
│   ├── config                   # Configuration files (e.g., database connection)
│   │   └── db.js                # MongoDB connection setup
│   ├── controllers              # Controller functions to handle business logic
│   │   ├── clientController.js  # Handles client-related logic
│   │   ├── developerController.js # Handles developer-related logic
│   │   └── adminController.js   # Handles admin-related logic
│   ├── middleware               # Custom middleware (authentication, validation, etc.)
│   │   ├── authMiddleware.js    # JWT authentication middleware
│   │   └── roleMiddleware.js    # Role-based access control
│   ├── models                   # Mongoose models (MongoDB schemas)
│   │   ├── User.js              # User model for Client, Developer, and Admin
│   │   ├── Project.js           # Project model for handling project data
│   ├── routes                   # Route definitions for the API
│   │   ├── clientRoutes.js      # Routes related to clients
│   │   ├── developerRoutes.js   # Routes related to developers
│   │   └── adminRoutes.js       # Routes related to admins
│   ├── services                 # Services for business logic and utility functions
│   │   ├── userService.js       # User-related services (registration, login)
│   │   └── projectService.js    # Project-related services
│   └── validators               # Zod validation schemas for input validation
│       ├── clientValidator.js   # Input validation for client-related actions
│       ├── developerValidator.js # Input validation for developer-related actions
│       └── adminValidator.js    # Input validation for admin-related actions
└── test                         # Tests for different parts of the application (optional)
    ├── auth.test.js             # Unit tests for authentication
    └── project.test.js          # Unit tests for project-related functionality
Installation
Clone the repository:

bash
Copy code
git clone https://github.com/your-repo.git
Install dependencies:

bash
Copy code
npm install
Create an .env file in the root directory and add your environment variables (e.g., MongoDB URI, JWT secret, port number).

Start the server:

bash
Copy code
npm start
Environment Variables
In your .env file, define the following variables:

makefile
Copy code
PORT=3000
MONGODB_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
Running the Application
To start the server, run:

bash
Copy code
npm run start
By default, the server will run on the port specified in your .env file.

Routes
Clients
POST /api/client/register: Register a new client
POST /api/client/login: Login a client
GET /api/client/projects: View all projects for a client


Developers
POST /api/developer/register: Register a new developer
POST /api/developer/login: Login a developer
GET /api/developer/projects: View assigned projects for a developer



Admins
POST /api/admin/register: Register a new admin
POST /api/admin/login: Login an admin
POST /api/admin/assign: Assign a project to a developer



Input Validation
The Zod library is used for input validation.
Validation schemas for each role are defined in the validators directory.
Middleware
Authentication: Ensures that routes are protected and accessible only by logged-in users.
Role-based Access Control: Limits access to specific routes based on the user's role (Client, Developer, Admin).