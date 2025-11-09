from flask import Flask
from flask_cors import CORS
import os
from dotenv import load_dotenv
from pymongo import MongoClient

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
