# SmartGrid - Learning Guide

## Project Overview

SmartGrid is a full-stack web application designed for efficient data management. It demonstrates the integration of a modern Angular frontend with a lightweight Flask backend, utilizing MySQL for data persistence. The application provides CRUD (Create, Read, Update, Delete) operations for employee records and data export capabilities.

This project serves as an excellent learning resource for developers interested in:
- Building full-stack applications with Angular and Flask
- Implementing data grids with AG-Grid
- Integrating frontend and backend APIs
- Working with MySQL databases in Python

## Technology Stack

### Frontend
- **Angular 17**: A powerful framework for building scalable web applications
- **AG-Grid**: Advanced data grid component for displaying and manipulating tabular data
- **Angular Material**: UI component library for consistent design
- **RxJS**: Reactive programming library for handling asynchronous operations

### Backend
- **Flask**: Lightweight WSGI web application framework
- **Flask-CORS**: Extension for handling Cross-Origin Resource Sharing
- **Flask-MySQL**: Extension for MySQL database integration
- **PyMySQL**: Pure Python MySQL client library
- **python-dotenv**: Library for loading environment variables

### Database
- **MySQL**: Relational database management system

## Project Structure

```
SmartGrid/
├── Backend/
│   ├── app.py              # Flask application initialization
│   ├── config.py           # Database configuration
│   ├── main.py             # API routes and business logic
│   ├── check.py            # Additional utility functions
│   ├── requirements.txt    # Python dependencies
│   └── __pycache__/        # Compiled Python files
├── src/
│   ├── app/
│   │   ├── app.component.* # Root component
│   │   ├── app.config.ts   # Application configuration
│   │   ├── app.routes.ts   # Routing configuration
│   │   └── Components/
│   │       ├── auth/       # Authentication components
│   │       │   ├── auth.guard.ts      # Route guard
│   │       │   ├── auth.interceptor.ts # HTTP interceptor
│   │       │   ├── auth.service.ts    # Authentication service
│   │       │   ├── login/             # Login component
│   │       │   └── register/          # Registration component
│   │       ├── create/    # Create new record component
│   │       ├── header/    # Application header
│   │       └── home/      # Main dashboard component
│   │           ├── data.service.ts    # Data management service
│   │           └── export.service.ts  # Data export service
│   └── assets/            # Static assets
├── angular.json           # Angular CLI configuration
├── package.json           # Node.js dependencies and scripts
├── tsconfig.*             # TypeScript configuration
└── README.md              # Project documentation
```

## Backend Architecture

### Flask Application Setup (`app.py`)
```python
from flask import Flask
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)
```
- Initializes the Flask application
- Enables Cross-Origin Resource Sharing for frontend-backend communication

### Database Configuration (`config.py`)
```python
from app import app
from flaskext.mysql import MySQL
import os
from dotenv import load_dotenv

load_dotenv()

mysql = MySQL()
app.config['MYSQL_DATABASE_USER'] = os.getenv('MYSQL_DATABASE_USER')
app.config['MYSQL_DATABASE_PASSWORD'] = os.getenv('MYSQL_DATABASE_PASSWORD')
app.config['MYSQL_DATABASE_DB'] = os.getenv('MYSQL_DATABASE_DB')
app.config['MYSQL_DATABASE_HOST'] = os.getenv('MYSQL_DATABASE_HOST')
mysql.init_app(app)
```
- Loads environment variables from `.env` file
- Configures MySQL connection parameters
- Initializes MySQL extension with the Flask app

### API Routes (`main.py`)

The backend provides RESTful API endpoints for employee management:

#### GET /employee
Retrieves all employee records from the database.

#### GET /employee/<id>
Fetches a specific employee by ID.

#### POST /employee/create
Creates a new employee record. Expects JSON payload with:
- name
- email
- phone
- address
- salary

#### PUT /employee/update
Updates an existing employee record. Expects JSON payload with:
- id
- name
- email
- phone
- address
- salary

#### DELETE /employee/delete/<id>
Deletes an employee record by ID.

## Frontend Architecture

### Angular Application Structure

#### App Configuration (`app.config.ts`)
```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi())
  ]
};
```
- Configures the application with routing and HTTP client
- Uses dependency injection for HTTP interceptors

#### Routing (`app.routes.ts`)
Defines the application's navigation structure, including protected routes.

#### Data Management
- **DataService**: Manages CRUD operations for employee data
- **ExportService**: Handles data export functionality (likely to PowerPoint)

#### Components
- **Login/Register**: User authentication interface
- **Home**: Main dashboard with AG-Grid for data display
- **Create**: Form for adding new employee records
- **Header**: Navigation and user interface elements

## Key Concepts and Learnings

### 1. Full-Stack Development
- Separation of concerns between frontend and backend
- RESTful API design principles
- CORS handling for cross-origin requests

### 2. Angular Best Practices
- Component-based architecture
- Service layer for business logic
- Reactive forms for data input
- Route guards for authentication
- HTTP interceptors for request/response handling

### 3. Flask Backend Development
- REST API implementation
- Database integration with MySQL
- Error handling and response formatting
- Environment variable management

### 4. Data Grid Implementation
- AG-Grid integration with Angular
- Dynamic data binding
- Sorting, filtering, and pagination
- CRUD operations within the grid

### 5. Database Design
- Relational data modeling
- SQL query optimization
- Connection pooling

## Setup and Installation

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.9 or higher)
- MySQL Server
- Angular CLI

### Backend Setup
1. Navigate to the Backend directory
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Create a `.env` file with database credentials:
   ```
   MYSQL_DATABASE_USER=your_username
   MYSQL_DATABASE_PASSWORD=your_password
   MYSQL_DATABASE_DB=your_database_name
   MYSQL_DATABASE_HOST=localhost
   ```
4. Ensure MySQL server is running and the database exists
5. Start the Flask server:
   ```bash
   python main.py
   ```

### Frontend Setup
1. Navigate to the root directory
2. Install Node.js dependencies:
   ```bash
   npm install
   ```
3. Start the Angular development server:
   ```bash
   ng serve
   ```
4. Access the application at `http://localhost:4200`

## Database Schema

The application uses a simple `employee` table:

```sql
CREATE TABLE employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    salary DECIMAL(10, 2)
);
```

## API Documentation

### Employee Management Endpoints
- GET `/employee` - Get all employees
- GET `/employee/{id}` - Get employee by ID
- POST `/employee/create` - Create new employee
- PUT `/employee/update` - Update employee
- DELETE `/employee/delete/{id}` - Delete employee

## Authentication Implementation Status

The project includes a partially implemented authentication system, primarily on the frontend, but it is not fully functional.

### What is Implemented:
- **Frontend Components**: Login and register forms with basic UI.
- **AuthService**: Handles login, logout, token storage, and refresh logic.
- **AuthGuard**: Route protection mechanism with role-based access.
- **AuthInterceptor**: Adds JWT tokens to HTTP requests.

### What is Incomplete:
- **Backend Endpoints**: No server-side authentication routes (e.g., /auth/login, /auth/register).
- **Route Protection**: Guards are not applied to main routes like /home and /create.
- **API Configuration**: Empty base URL in AuthService, causing requests to fail.
- **Navigation Issues**: Login redirects to non-existent routes (/reader, /owner).

### Is it Actually Required?
Authentication is not essential for the core functionality of managing employee data, as the app can operate without user accounts. However, it can be implemented for learning purposes or future enhancements.

## Development Best Practices Demonstrated

1. **Modular Code Structure**: Clear separation of concerns
2. **Error Handling**: Proper exception handling in both frontend and backend
3. **Security**: Input validation
4. **Performance**: Efficient database queries and frontend rendering
5. **Maintainability**: Well-organized code with meaningful naming
6. **Scalability**: Service-based architecture for easy extension

## Potential Enhancements

- Add unit and integration tests
- Complete authentication system implementation
- Add data validation and sanitization
- Implement caching for better performance
- Add logging and monitoring
- Create API documentation with Swagger/OpenAPI
- Implement pagination for large datasets
- Add search functionality
- Support for file uploads (e.g., employee photos)

## Learning Resources

- [Angular Documentation](https://angular.io/docs)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [AG-Grid Documentation](https://www.ag-grid.com/)
- [MySQL Documentation](https://dev.mysql.com/doc/)

This project provides a solid foundation for understanding modern web development practices and can be extended to build more complex applications.
