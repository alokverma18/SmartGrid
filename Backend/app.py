from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from dotenv import load_dotenv
from pymongo import MongoClient
from bson import ObjectId
from json_encoder import serialize_document, serialize_documents
from validators import EmployeeValidator, ValidationError

load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB Connection
MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/smartgrid')
client = MongoClient(MONGODB_URI)
db = client['smartgrid']
employees_collection = db['employees']

# Create indexes for better performance
employees_collection.create_index('email', unique=True)

# Define all routes directly in app.py

@app.route('/employee/create', methods=['POST'])
def create_employee():
    try:
        _json = request.json

        if not _json:
            response = jsonify({'error': 'Request body must be valid JSON'})
            response.status_code = 400
            return response

        try:
            validated_data = EmployeeValidator.validate_employee_data(_json)
        except ValidationError as ve:
            response = jsonify({'error': str(ve)})
            response.status_code = 400
            return response

        existing_employee = employees_collection.find_one({'email': validated_data['email']})
        if existing_employee:
            response = jsonify({'error': 'Email already exists!'})
            response.status_code = 409
            return response

        result = employees_collection.insert_one(validated_data)

        response = jsonify('Employee created successfully!')
        response.status_code = 200
        return response

    except Exception as err:
        app.logger.error(f"Error creating employee: {type(err).__name__}")
        response = jsonify({'error': 'An error occurred while creating the employee'})
        response.status_code = 500
        return response

@app.route('/employee')
def employee():
    try:
        empRows = list(employees_collection.find())
        empRows = serialize_documents(empRows)
        response = jsonify(empRows)
        response.status_code = 200
        return response
    except Exception as err:
        app.logger.error(f"Error fetching employees: {type(err).__name__}")
        response = jsonify({'error': 'An error occurred while fetching employees'})
        response.status_code = 500
        return response

@app.route('/employee/<employee_id>')
def employee_details(employee_id):
    try:
        if not ObjectId.is_valid(employee_id):
            return showMessage()

        empRow = employees_collection.find_one({'_id': ObjectId(employee_id)})
        if empRow is None:
            return showMessage()

        empRow = serialize_document(empRow)
        response = jsonify(empRow)
        response.status_code = 200
        return response
    except Exception as err:
        app.logger.error(f"Error fetching employee details: {type(err).__name__}")
        response = jsonify({'error': 'An error occurred while fetching employee details'})
        response.status_code = 500
        return response

@app.route('/employee/update', methods=['PUT'])
def update_employee():
    try:
        _json = request.json

        if not _json:
            response = jsonify({'error': 'Request body must be valid JSON'})
            response.status_code = 400
            return response

        try:
            employee_id, validated_data = EmployeeValidator.validate_update_data(_json)
        except ValidationError as ve:
            response = jsonify({'error': str(ve)})
            response.status_code = 400
            return response

        if not ObjectId.is_valid(employee_id):
            return showMessage()

        existing_employee = employees_collection.find_one({
            'email': validated_data['email'],
            '_id': {'$ne': ObjectId(employee_id)}
        })
        if existing_employee:
            response = jsonify({'error': 'Email already exists!'})
            response.status_code = 409
            return response

        result = employees_collection.update_one(
            {'_id': ObjectId(employee_id)},
            {'$set': validated_data}
        )

        if result.matched_count == 0:
            return showMessage()

        response = jsonify('Employee updated successfully!')
        response.status_code = 200
        return response

    except Exception as err:
        app.logger.error(f"Error updating employee: {type(err).__name__}")
        response = jsonify({'error': 'An error occurred while updating the employee'})
        response.status_code = 500
        return response

@app.route('/employee/delete/<employee_id>', methods=['DELETE'])
def delete_employee(employee_id):
    try:
        if not ObjectId.is_valid(employee_id):
            return showMessage()

        result = employees_collection.delete_one({'_id': ObjectId(employee_id)})

        if result.deleted_count == 0:
            return showMessage()

        response = jsonify('Employee deleted successfully!')
        response.status_code = 200
        return response

    except Exception as err:
        app.logger.error(f"Error deleting employee: {type(err).__name__}")
        response = jsonify({'error': 'An error occurred while deleting the employee'})
        response.status_code = 500
        return response

@app.errorhandler(404)
def showMessage(error=None):
    message = {
        'status': 404,
        'message': 'Record not found',
    }
    response = jsonify(message)
    response.status_code = 404
    return response

if __name__ == "__main__":
    app.run()
