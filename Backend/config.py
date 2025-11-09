from app import app
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB Connection
MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/smartgrid')
client = MongoClient(MONGODB_URI)
db = client['smartgrid']
employees_collection = db['employees']

# Create indexes for better performance
employees_collection.create_index('email', unique=True)
