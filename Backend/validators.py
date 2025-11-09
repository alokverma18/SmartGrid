import re
from typing import Dict, Any, Tuple

class ValidationError(Exception):
    """Custom exception for validation errors"""
    pass


class EmployeeValidator:
    """Comprehensive input validation for employee records"""

    # Constants for validation
    MAX_NAME_LENGTH = 100
    MAX_EMAIL_LENGTH = 120
    MAX_PHONE_LENGTH = 20
    MAX_ADDRESS_LENGTH = 500
    MIN_SALARY = 0
    MAX_SALARY = 10000000  # 10 million

    # Regex patterns
    EMAIL_PATTERN = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    PHONE_PATTERN = r'^[\d\s\-\+\(\)]{7,20}$'

    @staticmethod
    def validate_email(email: str) -> str:
        """Validate and sanitize email"""
        if not email or not isinstance(email, str):
            raise ValidationError("Email is required and must be a string")

        email = email.strip()

        if len(email) > EmployeeValidator.MAX_EMAIL_LENGTH:
            raise ValidationError(f"Email must not exceed {EmployeeValidator.MAX_EMAIL_LENGTH} characters")

        if not re.match(EmployeeValidator.EMAIL_PATTERN, email):
            raise ValidationError("Email format is invalid")

        # Additional check: prevent common email injection patterns
        if '<' in email or '>' in email or '\n' in email or '\r' in email:
            raise ValidationError("Email contains invalid characters")

        return email.lower()

    @staticmethod
    def validate_name(name: str) -> str:
        """Validate and sanitize name"""
        if not name or not isinstance(name, str):
            raise ValidationError("Name is required and must be a string")

        name = name.strip()

        if len(name) < 2:
            raise ValidationError("Name must be at least 2 characters")

        if len(name) > EmployeeValidator.MAX_NAME_LENGTH:
            raise ValidationError(f"Name must not exceed {EmployeeValidator.MAX_NAME_LENGTH} characters")

        # Allow only alphanumeric, spaces, hyphens, and apostrophes
        if not re.match(r"^[a-zA-Z\s\-']{2,}$", name):
            raise ValidationError("Name contains invalid characters. Only letters, spaces, hyphens, and apostrophes are allowed")

        # Prevent multiple consecutive spaces
        if '  ' in name:
            raise ValidationError("Name contains multiple consecutive spaces")

        return name.strip()

    @staticmethod
    def validate_phone(phone: str) -> str:
        """Validate and sanitize phone number"""
        if not phone or not isinstance(phone, str):
            raise ValidationError("Phone number is required and must be a string")

        phone = phone.strip()

        if len(phone) < 7:
            raise ValidationError("Phone number must be at least 7 characters")

        if len(phone) > EmployeeValidator.MAX_PHONE_LENGTH:
            raise ValidationError(f"Phone number must not exceed {EmployeeValidator.MAX_PHONE_LENGTH} characters")

        # Check for valid phone characters
        if not re.match(EmployeeValidator.PHONE_PATTERN, phone):
            raise ValidationError("Phone number contains invalid characters. Only digits, spaces, hyphens, +, (, ) are allowed")

        # Prevent injection patterns
        if '\n' in phone or '\r' in phone or '\0' in phone:
            raise ValidationError("Phone number contains invalid characters")

        return phone

    @staticmethod
    def validate_address(address: str) -> str:
        """Validate and sanitize address"""
        if not address or not isinstance(address, str):
            raise ValidationError("Address is required and must be a string")

        address = address.strip()

        if len(address) < 5:
            raise ValidationError("Address must be at least 5 characters")

        if len(address) > EmployeeValidator.MAX_ADDRESS_LENGTH:
            raise ValidationError(f"Address must not exceed {EmployeeValidator.MAX_ADDRESS_LENGTH} characters")

        # Remove potentially dangerous characters but allow basic address format
        if '\x00' in address or '\r' in address:
            raise ValidationError("Address contains invalid characters")

        # Allow alphanumeric, spaces, commas, periods, hyphens, numbers, #, &
        if not re.match(r"^[a-zA-Z0-9\s,.\-#&]{5,}$", address):
            raise ValidationError("Address contains invalid characters")

        # Prevent multiple consecutive spaces
        if '  ' in address:
            address = re.sub(r'\s+', ' ', address)

        return address

    @staticmethod
    def validate_salary(salary) -> float:
        """Validate and sanitize salary"""
        if salary is None:
            raise ValidationError("Salary is required")

        # Try to convert to float
        try:
            if isinstance(salary, str):
                salary = float(salary.strip())
            else:
                salary = float(salary)
        except (ValueError, TypeError):
            raise ValidationError("Salary must be a valid number")

        # Check salary range
        if salary < EmployeeValidator.MIN_SALARY:
            raise ValidationError(f"Salary cannot be negative or less than {EmployeeValidator.MIN_SALARY}")

        if salary > EmployeeValidator.MAX_SALARY:
            raise ValidationError(f"Salary cannot exceed {EmployeeValidator.MAX_SALARY}")

        # Round to 2 decimal places
        return round(salary, 2)

    @staticmethod
    def validate_employee_data(data: Dict[str, Any]) -> Dict[str, Any]:
        """Validate complete employee data"""
        if not isinstance(data, dict):
            raise ValidationError("Employee data must be a JSON object")

        validated_data = {}

        try:
            validated_data['name'] = EmployeeValidator.validate_name(data.get('name'))
            validated_data['email'] = EmployeeValidator.validate_email(data.get('email'))
            validated_data['phone'] = EmployeeValidator.validate_phone(data.get('phone'))
            validated_data['address'] = EmployeeValidator.validate_address(data.get('address'))
            validated_data['salary'] = EmployeeValidator.validate_salary(data.get('salary'))
        except (ValidationError, KeyError, TypeError) as e:
            raise ValidationError(str(e))

        return validated_data

    @staticmethod
    def validate_update_data(data: Dict[str, Any]) -> Tuple[str, Dict[str, Any]]:
        """Validate update data and return employee ID and validated fields"""
        if not isinstance(data, dict):
            raise ValidationError("Update data must be a JSON object")

        employee_id = data.get('id')
        if not employee_id or not isinstance(employee_id, str):
            raise ValidationError("Employee ID is required and must be a valid string")

        # Validate employee data
        validated_data = EmployeeValidator.validate_employee_data(data)

        return employee_id, validated_data

