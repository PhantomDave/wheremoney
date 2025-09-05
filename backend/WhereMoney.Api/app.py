from flask import Flask
from flask_restx import Api
from flask_migrate import Migrate
from flask_cors import CORS
from models.dbConnector import db
from middleware.jwt_auth import authenticate
import os
from config import config_by_name

config_name = os.getenv('FLASK_CONFIG', 'default')

app = Flask(__name__)
app.config.from_object(config_by_name.get(config_name, config_by_name['default']))
config_by_name.get(config_name, config_by_name['default']).init_app(app)

# Enable CORS for all origins
CORS(app, origins=app.config.get('CORS_ORIGINS', '*'), methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"], allow_headers=["Content-Type", "Authorization"])

# Initialize database and migrations
db.init_app(app)

migrate = Migrate(app, db)

authorizations = {
    'Bearer': {
        'type': 'apiKey',
        'in': 'header',
        'name': 'Authorization',
        'description': 'Enter your JWT token in the format **Bearer &lt;token&gt;**'
    }
}

api = Api(
    app,
    version='1.0',
    title='User API',
    description='OpenAPI / Swagger docs for the User endpoints with JWT authentication',
    doc='/docs',
    authorizations=authorizations,
    security='Bearer'
)

from controllers.usercontroller import api as user_ns
api.add_namespace(user_ns)
from controllers.authcontroller import api as auth_ns
api.add_namespace(auth_ns)
from controllers.importcontroller import api as import_ns
api.add_namespace(import_ns)

app.before_request(authenticate)


with app.app_context():
    pass

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.getenv('PORT', 5000)), debug=app.config.get('DEBUG', True))
