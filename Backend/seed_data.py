import random
from config import employees_collection
from faker import Faker

fake = Faker()

# Sample salaries
salaries = [40000, 45000, 50000, 55000, 60000, 65000, 70000, 75000, 80000, 90000]

def seed_employees(count=10):
    """Generate and insert random employee records"""
    employees = []

    for i in range(count):
        employee = {
            'name': fake.name(),
            'email': fake.email(),
            'phone': fake.phone_number()[:15],  # Limit phone length
            'address': fake.address().replace('\n', ', '),
            'salary': random.choice(salaries)
        }
        employees.append(employee)

    try:
        result = employees_collection.insert_many(employees)
        print(f"✅ Successfully inserted {len(result.inserted_ids)} employee records!")
        print("\nSample records:")
        for emp in employees[:3]:
            print(f"  - {emp['name']} ({emp['email']}) - ${emp['salary']}")
        return result.inserted_ids
    except Exception as err:
        print(f"❌ Error inserting records: {err}")
        return None

def clear_employees():
    """Clear all employee records (use with caution)"""
    try:
        result = employees_collection.delete_many({})
        print(f"✅ Deleted {result.deleted_count} employee records")
    except Exception as err:
        print(f"❌ Error deleting records: {err}")

if __name__ == "__main__":
    print("🌱 Seeding employee database with random data...\n")
    seed_employees(10)
    print("\nDone! You can now test the application.")

