from deepface import DeepFace
from pprint import pprint
from flask import Flask
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/')
@cross_origin()
def hello():
    obj = DeepFace.analyze(["1.jpg", "2.jpg", "3.jpg"], actions=['age', 'race', 'gender', 'emotion'])
    pprint(obj)
    return obj
