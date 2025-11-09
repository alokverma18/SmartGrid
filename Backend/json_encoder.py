from bson import ObjectId
from json import JSONEncoder

class MongoJSONEncoder(JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return super().default(o)


def serialize_document(doc):
    if doc is None:
        return None
    if isinstance(doc, dict):
        result = {}
        for key, value in doc.items():
            if key == '_id' and isinstance(value, ObjectId):
                result['id'] = str(value)
            elif isinstance(value, ObjectId):
                result[key] = str(value)
            else:
                result[key] = value
        return result
    return doc


def serialize_documents(docs):
    return [serialize_document(doc) for doc in docs]

