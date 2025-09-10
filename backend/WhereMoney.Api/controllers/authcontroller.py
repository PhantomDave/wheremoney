from flask import request
from flask_restx import Namespace, fields, Resource
from models.dbConnector import db
from controllers.usercontroller import user_model
from middleware.jwt_auth import public_endpoint, generate_token
from models.user import User

api = Namespace('auth', description='Authentication operations')


login_model = api.model('Login', {
    'email': fields.String(required=True, description='The email address'),
    'password': fields.String(required=True, description='The password')
})

register_model = api.model('Register', {
    'email': fields.String(required=True, description='The email address'),
    'username': fields.String(required=True, description='The username'),
    'password': fields.String(required=True, description='The password')
})

token_model = api.model('Token', {
    'token': fields.String(description='JWT access token'),
    'user': fields.Nested(user_model, description='User information')
})


@api.route('/register')
class UserRegister(Resource):
    @api.doc(security=[])
    @public_endpoint
    @api.expect(register_model)
    @api.marshal_with(token_model)
    def post(self):
        """Register a new user (public endpoint)"""
        data = request.get_json() or {}
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')

        if not username or not password or not email:
            api.abort(400, 'username, password and email are required')

        # Check if user already exists
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            api.abort(409, 'User already exists')

        # Check if email already exists
        existing_email = User.query.filter_by(email=email).first()
        if existing_email:
            api.abort(409, 'Email already in use')

        user = User(username=username, email=email)
        user.set_password(password)

        db.session.add(user)
        db.session.commit()

        return {
            'user': user.serialize()
        }, 201


@api.route('/login')
class UserLogin(Resource):
    @api.doc(security=[])  # Override global security for public endpoint
    @public_endpoint
    @api.expect(login_model)
    @api.marshal_with(token_model)
    def post(self):
        data = request.get_json() or {}
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            api.abort(400, 'email and password are required')

        # Find user and verify password using bcrypt
        user = User.query.filter_by(email=email).first()
        if not user or not user.check_password(password):
            api.abort(401, 'Invalid credentials')

        # Generate JWT token
        token = generate_token(user.id, user.username)

        return {
            'token': token,
            'user': user.serialize()
        }
