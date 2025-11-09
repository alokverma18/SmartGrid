from flask import jsonify, request
from bson import ObjectId
from json_encoder import serialize_document, serialize_documents
from validators import EmployeeValidator, ValidationError

def register_routes(app):
    """Register all routes with the Flask app"""

    # Import here to avoid circular imports
    from app import employees_collection

    @app.route('/employee/create', methods=['POST'])
    def create_employee():
        try:
            _json = request.json

            if not _json:
                response = jsonify({'error': 'Request body must be valid JSON'})
                response.status_code = 400
                return response

            # Validate all input data
            try:
                validated_data = EmployeeValidator.validate_employee_data(_json)
            except ValidationError as ve:
                response = jsonify({'error': str(ve)})
                response.status_code = 400
                return response

            # Check if email already exists (case-insensitive)
            existing_employee = employees_collection.find_one({'email': validated_data['email']})
            if existing_employee:
                response = jsonify({'error': 'Email already exists!'})
                response.status_code = 409
                return response

            # Insert new employee document
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
            # Fetch all employees from MongoDB
            empRows = list(employees_collection.find())
            # Serialize documents (convert ObjectId to string)
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
            # Validate if employee_id is a valid ObjectId
            if not ObjectId.is_valid(employee_id):
                return showMessage()

            # Find employee by _id
            empRow = employees_collection.find_one({'_id': ObjectId(employee_id)})
            if empRow is None:
                return showMessage()

            # Serialize the document
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

            # Validate update data
            try:
                employee_id, validated_data = EmployeeValidator.validate_update_data(_json)
            except ValidationError as ve:
                response = jsonify({'error': str(ve)})
                response.status_code = 400
                return response

            # Validate if _id is a valid ObjectId
            if not ObjectId.is_valid(employee_id):
                return showMessage()

            # Check if email is already used by another employee
            existing_employee = employees_collection.find_one({
                'email': validated_data['email'],
                '_id': {'$ne': ObjectId(employee_id)}
            })
            if existing_employee:
                response = jsonify({'error': 'Email already exists!'})
                response.status_code = 409
                return response

            # Update the employee document
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
            # Validate if employee_id is a valid ObjectId
            if not ObjectId.is_valid(employee_id):
                return showMessage()

            # Delete the employee document
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


# Register routes when main.py is imported (required for gunicorn/deployment)
from app import app
register_routes(app)

if __name__ == "__main__":
    app.run()
