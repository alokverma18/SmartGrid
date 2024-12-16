# SmartGrid

A basic full-stack application to manage data efficiently, including fetching data from a MySQL database, and providing the functionality to display, add, update, and delete records using a Flask backend and an Angular frontend with AG-Grid for a dynamic user interface.

## Tech Stack⚙️
  - **Frontend**:
    - **Angular**: Framework for building the user interface.
    - **AG-Grid**: Advanced grid library for displaying and manipulating data efficiently.
    - **Angular Material**: Optional library for UI components and styling.

  - **Backend**:
    - **Python**: Programming language for the backend.
    - **Flask**: Lightweight web framework to handle routing and APIs.
    - **MySQL**: Relational database used for storing data.
    - **MySQL Connector (pymysql)**: Library to interact with the MySQL database.


## Features✨
  - **Display Records**: View all records in a dynamic grid.
  - **Add Record**: Add new record.
  - **Update Record**: Edit existing records.
  - **Delete Record(s)**: Remove records from the database.
  - **Filter & Sort**: Easily filter and sort data within the grid.

## Project Workflow🔄
1. **Backend**:
   - **Fetch Data**: API to fetch data from MySQL.
   - **Add/Update/Delete**: APIs to manipulate data.
   - **Flask** handles the server-side logic and interacts with the database.

2. **Frontend**:
   - **AG-Grid** displays data in a structured and sortable table format.
   - User actions (Add, Edit, Delete) are handled through Angular service, making HTTP calls to the Flask backend.

3. **Database**:
   - MySQL database stores data with tables designed for efficient querying and manipulation.

## Setup Instructions🛠️
### Prerequisites:
- **Backend**: Python (3.9+), MySQL Server.
- **Frontend**: Node.js (16+), Angular CLI.

### Setup:
1. Clone the repository:
   ```bash
   git clone https://github.com/alokverma18/SmartGrid.git
   cd SmartGrid
2. Install backend dependencies:
   ```bash
   cd Backend
   pip install -r requirements.txt
3. Configure the database by creating a .env file (sample given below):
   ```bash
   MYSQL_DATABASE_USER=root
   MYSQL_DATABASE_PASSWORD=xyz
   MYSQL_DATABASE_DB=employee
   MYSQL_DATABASE_HOST=localhost
4. Start the Flask server:
   ```bash
   python main.py
   ```
5. Navigate baack to the root directory (SmartGrid) and install frontend dependencies:
   ```bash
   cd ..
   npm install
6. Start the Angular development server:
   ```bash
   ng serve
7. Access the application at [localhost](http://localhost:4200) (or as specified in your terminal)
   
## Snapshot📸
![Home page](snapshot.png)

## Contributions 🤝
All contributions are welcome! If you spot any issues, have suggestions, or want to add features, feel free to create a PR. Thanks for contributing to this project! 🚀

## Connect🌐
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/alokverma18/)

### Leave a 🌟 if you like it!

### Thank You!

