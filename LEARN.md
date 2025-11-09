# SmartGrid - Learning Guide

## Project Overview

SmartGrid is a full-stack employee management application that demonstrates modern web development practices. It combines Angular 17 frontend with Flask backend and MongoDB database to provide a complete CRUD solution for managing employee records.

The application showcases:
- Reactive programming with RxJS and Angular
- RESTful API design with Flask
- NoSQL database management with MongoDB
- Professional data visualization with AG-Grid
- Enterprise-grade report generation
- Production-ready deployment patterns

## Technology Stack

### Frontend
- **Angular 17** - Latest Angular framework
- **AG-Grid** - Professional data grid with sorting, filtering, pagination
- **Angular Material** - Material Design components
- **TypeScript** - Type-safe development
- **RxJS** - Reactive programming for async operations
- **PptxGenJS** - PowerPoint report generation

### Backend
- **Python 3.8+** - Programming language
- **Flask** - Lightweight WSGI framework
- **PyMongo** - MongoDB driver
- **python-dotenv** - Environment configuration

### Database
- **MongoDB** - Document-oriented NoSQL database
- **MongoDB Atlas** - Cloud hosting with free tier

## Architecture Overview

### Data Flow

```
User Interface (Angular)
        ↓
   HTTP Requests (JSON)
        ↓
   Flask REST API
        ↓
   Input Validation & Sanitization
        ↓
   MongoDB Operations
        ↓
   JSON Response with Serialized Data
        ↓
   Angular Components & Templates
```

### Component Structure

**Frontend Components:**
- `app.component` - Root component
- `home.component` - Main dashboard with AG-Grid
- `create.component` - Employee creation form
- `header.component` - Navigation header

**Services:**
- `data.service.ts` - HTTP communication with backend
- `export.service.ts` - PowerPoint report generation

**Backend Routes:**
- `POST /employee/create` - Create employee
- `GET /employee` - List all employees
- `GET /employee/<id>` - Get single employee
- `PUT /employee/update` - Update employee
- `DELETE /employee/delete/<id>` - Delete employee

## Backend Architecture

### Flask Application (`app.py`)
Initializes Flask with CORS support for frontend communication.

```python
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
```

### MongoDB Configuration (`config.py`)

Connects to MongoDB Atlas and initializes the employees collection with email uniqueness index.

```python
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/smartgrid')
client = MongoClient(MONGODB_URI)
db = client['smartgrid']
employees_collection = db['employees']

# Create indexes for better performance
employees_collection.create_index('email', unique=True)
```
- Loads MongoDB connection string from environment variables
- Establishes connection to MongoDB database
- Creates indexes on frequently queried fields (email is unique)

### Input Validation (`validators.py`)

Comprehensive validation layer preventing security vulnerabilities:

| Field | Rules | Purpose |
|-------|-------|---------|
| **name** | 2-100 chars, letters/spaces/hyphens/apostrophes | Prevent injection attacks |
| **email** | RFC-compliant, 120 char max, unique | Valid format and prevent duplicates |
| **phone** | 7-20 chars, digits/spaces/+/-/(/) | Standard phone formats |
| **address** | 5-500 chars, alphanumeric with punctuation | Reasonable data sizes |
| **salary** | Numeric, $0-$10,000,000 range | Prevent type coercion |

**Validation Process:**
1. Type checking - Ensure correct data types
2. Format validation - Regex patterns for strings
3. Range validation - Min/max values for numbers
4. Uniqueness checks - Email doesn't exist
5. Sanitization - Remove dangerous characters

### API Routes (`main.py`)

#### 1. Create Employee
```python
@app.route('/employee/create', methods=['POST'])
```
- Validates input data
- Checks for duplicate email
- Inserts into MongoDB
- Returns 200 or 400/409

#### 2. Get All Employees
```python
@app.route('/employee')
```
- Fetches all documents
- Serializes ObjectIds to strings
- Returns array of employees

#### 3. Get Employee by ID
```python
@app.route('/employee/<employee_id>')
```
- Validates ObjectId format
- Returns single employee or 404

#### 4. Update Employee
```python
@app.route('/employee/update', methods=['PUT'])
```
- Validates ObjectId and data
- Prevents email duplicates
- Updates matching document

#### 5. Delete Employee
```python
@app.route('/employee/delete/<employee_id>', methods=['DELETE'])
```
- Validates ObjectId
- Deletes document
- Returns 200 or 404

### ObjectId Serialization (`json_encoder.py`)

MongoDB uses ObjectId for primary keys, which aren't JSON-serializable. The serialization utility converts them to strings:

```python
def serialize_document(doc):
    if isinstance(doc, dict):
        result = {}
        for key, value in doc.items():
            if key == '_id' and isinstance(value, ObjectId):
                result['id'] = str(value)  # Convert _id to id string
            else:
                result[key] = value
        return result
    return doc
```

This allows seamless communication between MongoDB and JSON APIs.

## MongoDB Database Design

### Collection: employees

**Document Structure:**
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "address": "123 Main St, City, State 12345",
  "salary": 55000
}
```

**Schema Flexibility:**
MongoDB's schema-less nature allows:
- Adding new fields without migrations
- Storing different data types
- Evolving schema over time
- Easy horizontal scaling

**Indexes:**
- `email` - Unique index prevents duplicate emails
- Improves query performance
- Automatic by MongoDB

### Why MongoDB?

1. **Cloud-Native** - MongoDB Atlas free tier
2. **Flexible Schema** - No migrations needed
3. **JSON Documents** - Natural fit for JavaScript
4. **Scalability** - Easy horizontal scaling
5. **Developer-Friendly** - Intuitive query syntax

## Frontend Architecture

### Home Component (`home.component.ts`)

Displays employee data in interactive AG-Grid with:
- Real-time inline editing
- Multi-row selection and deletion
- Sorting and filtering
- Pagination (10 rows per page)
- PowerPoint export
- Error handling with Material Snackbar

**Key Features:**
```typescript
// Load data on component init
onGridReady(params) {
  this.dataService.getData().subscribe(...)
}

// Handle inline edits
onCellEdit(event) {
  this.dataService.updateData(event.data.id, event.data)
}

// Batch delete selected rows
delete() {
  const selectedRows = this.gridApi.getSelectedRows()
  // Delete each row
}
```

### Create Component (`create.component.ts`)

Reactive form with validation matching backend constraints:

```typescript
form = this.fb.group({
  name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
  email: ['', [Validators.required, Validators.email, Validators.maxLength(120)]],
  phone: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(20)]],
  address: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(500)]],
  salary: ['', [Validators.required, Validators.min(0), Validators.max(10000000)]]
});
```

**Validation:**
- Real-time validation as user types
- Error messages show specific validation rules
- Submit button disabled until form is valid
- Server-side validation as backup

### Data Service (`data.service.ts`)

HTTP service communicating with Flask backend:

```typescript
@Injectable({ providedIn: 'root' })
export class DataService {
  private apiUrl = 'http://127.0.0.1:5000/employee';
  
  getData(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }
  
  postData(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, data);
  }
  
  updateData(id: Number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update`, data);
  }
  
  deleteData(id: Number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
}
```

Handles all HTTP communication with automatic JSON serialization.

### Export Service (`export.service.ts`)

Generates professional PowerPoint reports with:

**Structure:**
1. **Title Slide** - Orange header with project name
2. **Data Slides** - 8 employees per slide
3. **Summary Slide** - Statistics and insights

**Features:**
- Color-coded salary highlighting (>$75k highlighted)
- Alternating row colors for readability
- Column-specific formatting (bold names, blue emails)
- Summary statistics (total, average, min, max salary)
- Page numbers and timestamps
- Professional typography

**Design:**
- Orange (#FF6400) branding matching UI
- Calibri font for consistency
- 9-inch table width for proper slide fit
- Equal column distribution

## Deployment Architecture

### Vercel (Frontend)

**Advantages:**
- Zero-configuration for Angular
- Automatic deployment on Git push
- Global CDN for fast content delivery
- Serverless functions support
- Free tier unlimited projects
- Instant rollbacks

**Deployment Steps:**
1. Connect GitHub repository
2. Select Angular framework preset
3. Set environment variables (API URL)
4. Deploy automatically on every push

**Result:** Frontend accessible at `yourproject.vercel.app`

### Render (Backend)

**Advantages:**
- Native Python support
- Auto-deploys from Git
- Automatic SSL/TLS certificates
- Health checks and monitoring
- Environment variable management
- Free tier available

**Deployment Steps:**
1. Create `Backend/Procfile` for startup command
2. Connect GitHub repository to Render
3. Configure build and start commands
4. Set environment variables (MongoDB URI)
5. Auto-deploy on Git push

**Configuration:**
```
Build Command: pip install -r Backend/requirements.txt
Start Command: gunicorn app:app --chdir Backend
```

**Result:** Backend accessible at `yourproject.onrender.com`

### MongoDB Atlas (Database)

**Cloud Database Setup:**
1. Create free M0 cluster
2. Set database user and password
3. Configure IP whitelist (0.0.0.0/0 for production)
4. Get connection string

**Benefits:**
- No database server maintenance
- Automatic backups
- Vertical and horizontal scaling
- Security features built-in
- Free tier suitable for development

## Input Validation & Security

### Frontend Validation (`create.component.html`)

Real-time error messages guide users:

```html
<div class="error-message" *ngIf="form.get('salary')?.invalid && form.get('salary')?.touched">
  <span *ngIf="form.get('salary')?.errors?.['max']">
    Salary cannot exceed $10,000,000
  </span>
</div>
```

### Backend Validation (`validators.py`)

Comprehensive protection against:
- **NoSQL Injection** - Whitelist validation prevents operators
- **Type Coercion** - Explicit type checking
- **DoS Attacks** - Field length limits
- **Data Overflow** - Range validation for numbers
- **Information Leakage** - Generic error messages

### Security Best Practices

1. **Whitelist Validation** - Only allow known-good inputs
2. **Type Safety** - Explicit type checking
3. **Error Handling** - Generic responses prevent information leakage
4. **CORS Protection** - Restrict cross-origin requests
5. **Data Sanitization** - Remove dangerous characters

See `Backend/SECURITY.md` for detailed security documentation.

## Sample Data Seeding

The `seed_data.py` script generates 10 random employees using Faker library:

```bash
cd Backend
python seed_data.py
```

Generates realistic data:
- Random names, emails, addresses
- Random phone numbers
- Salaries between $40k-$90k

Useful for testing and demonstration.

## Local Development Workflow

1. **Start MongoDB Atlas** - Ensure cluster is running
2. **Start Backend:**
   ```bash
   cd Backend
   python main.py
   ```
3. **Start Frontend (new terminal):**
   ```bash
   npm start
   ```
4. **Access Application:** `http://localhost:4200`

### API Testing

Use curl or Postman:

```bash
# Get all employees
curl http://localhost:5000/employee

# Create employee
curl -X POST http://localhost:5000/employee/create \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","phone":"9876543210","address":"456 Oak Ave","salary":65000}'
```

## Troubleshooting

### Common Issues

**MongoDB Connection Failed:**
- Verify MongoDB Atlas IP whitelist
- Check connection string in .env
- Ensure database user has correct password

**API 400 Errors:**
- Check validation constraints in create form
- Verify email format is valid
- Ensure salary is within $0-$10,000,000 range

**CORS Errors:**
- Ensure backend is running
- Verify CORS enabled in Flask app
- Check API URL in data.service.ts

**Build Errors:**
- Delete node_modules and reinstall
- Clear Python cache and recreate venv
- Check Node.js and Python versions



## Key Takeaways

This project demonstrates:
- ✅ Modern full-stack architecture
- ✅ MongoDB for cloud-native applications
- ✅ RESTful API design
- ✅ Form validation strategies
- ✅ Security best practices
- ✅ Professional deployment patterns
- ✅ Data export functionality
- ✅ Error handling and UX

## Resources

- **Angular**: [https://angular.io](https://angular.io)
- **Flask**: [https://flask.palletsprojects.com](https://flask.palletsprojects.com)
- **MongoDB**: [https://docs.mongodb.com](https://docs.mongodb.com)
- **Vercel**: [https://vercel.com/docs](https://vercel.com/docs)
- **Render**: [https://render.com/docs](https://render.com/docs)
- **AG-Grid**: [https://www.ag-grid.com/documentation/](https://www.ag-grid.com/documentation/)

## Summary

SmartGrid provides a solid foundation for building full-stack applications with modern technologies. The project emphasizes clean architecture, security, and best practices that scale from development to production.

Start with the [README.md](README.md) for setup instructions, and refer to individual component files for implementation details.

Happy coding! 🚀
