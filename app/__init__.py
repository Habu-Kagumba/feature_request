from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy


# Instantiate the application
app = Flask(__name__)

# Config
app.config.from_object('app.config.base')
app.config.from_envvar('APP_CONFIG_FILE')

# Database
db = SQLAlchemy(app)

@app.route('/hello', methods=['GET'])
def hello_world():
    return jsonify({ 'status': 'success', 'message': 'world' })
