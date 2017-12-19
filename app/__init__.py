from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy


# Instantiate the application
app = Flask(__name__)

# Config
app.config.from_object('app.config.base')
app.config.from_envvar('APP_CONFIG_FILE')

# Database
db = SQLAlchemy(app)

@app.route('/ping', methods=['GET'])
def ping_pong():
    return jsonify({ 'status': 'success', 'message': 'pong' })
