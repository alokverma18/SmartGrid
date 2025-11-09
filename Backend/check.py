from config import employees_collection
from json_encoder import serialize_documents

def check():
    try:
        # Fetch all employees from MongoDB
        employees = list(employees_collection.find())
        serialized = serialize_documents(employees)
        print(serialized)
    except Exception as err:
        print(err)

if __name__ == "__main__":
    check()
