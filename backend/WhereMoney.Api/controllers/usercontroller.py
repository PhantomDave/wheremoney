from flask import request, g
from flask_restx import Namespace, Resource, fields
from models.dbConnector import db
from models.user import User
from middleware.jwt_auth import public_endpoint, generate_token

api = Namespace('users', description='User operations')

user_model = api.model('User', {
    'id': fields.Integer(readOnly=True, description='The user unique identifier'),
    'username': fields.String(required=True, description='The username'),
    'email': fields.String(required=True, description='The email address')
})

user_input = api.model('UserInput', {
    'username': fields.String(required=True, description='The username'),
    'email': fields.String(required=True, description='The email address')
})

@api.route('/')
class UserList(Resource):
    @api.doc(security=[])  # Override global security for public endpoint
    @public_endpoint
    @api.marshal_list_with(user_model)
    def get(self):
        """List all users (public endpoint)"""
        users = User.query.all()
        return [user.serialize() for user in users]

@api.route('/<int:id>')
@api.response(404, 'User not found')
class UserResource(Resource):
    # No @api.doc(security='Bearer') needed - uses global default
    @api.marshal_with(user_model)
    def get(self, id):
        """Get a user by ID (requires authentication)"""
        user = User.query.filter_by(id=id).first()
        if not user:
            api.abort(404, 'User not found')
        return user.serialize()

    # No @api.doc(security='Bearer') needed - uses global default
    @api.expect(user_input)
    @api.marshal_with(user_model)
    def put(self, id):
        """Update a user by ID (requires authentication)"""
        user = User.query.filter_by(id=id).first()
        if not user:
            api.abort(404, 'User not found')
        data = request.get_json() or {}
        user.username = data.get('username', user.username)
        user.email = data.get('email', user.email)
        db.session.commit()
        return user.serialize()

    # No @api.doc(security='Bearer') needed - uses global default
    def delete(self, id):
        """Delete a user by ID (requires authentication)"""
        user = User.query.filter_by(id=id).first()
        if not user:
            api.abort(404, 'User not found')
        db.session.delete(user)
        db.session.commit()
        return {'message': 'User deleted'}

@api.route('/profile')
class UserProfile(Resource):
    # No @api.doc(security='Bearer') needed - uses global default
    @api.marshal_with(user_model)
    def get(self):
        """Get current user profile (requires authentication)"""
        # Access current user from JWT token stored in Flask's g object
        current_user_data = g.current_user
        user = User.query.filter_by(id=current_user_data['user_id']).first()
        if not user:
            api.abort(404, 'User not found')
        return user.serialize()
