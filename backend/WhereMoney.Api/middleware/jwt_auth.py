import jwt
from flask import request, jsonify, current_app, g
from datetime import datetime, timedelta, timezone

def public_endpoint(f):
    f._is_public = True
    return f

def generate_token(user_id, username=None):
    """Generate a JWT token for a user"""
    payload = {
        'user_id': user_id,
        'username': username,
        'exp': datetime.now(timezone.utc) + timedelta(hours=24),  # Token expires in 24 hours
        'iat': datetime.now(timezone.utc)
    }
    key = current_app.config.get('JWT_SECRET_KEY', 'your-secret-key-change-this-in-production')
    return jwt.encode(payload, key, algorithm='HS256')

def verify_token(token):
    try:
        key = current_app.config.get('JWT_SECRET_KEY', 'your-secret-key-change-this-in-production')
        payload = jwt.decode(token, key, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def authenticate():
    # Allow public paths without authentication
    public_paths = ['/docs', '/openapi.json', '/swaggerui']
    if request.path in public_paths or request.path.startswith('/static') or request.path.startswith('/swagger'):
        return None

    # Always allow OPTIONS requests (for CORS preflight)
    if request.method == 'OPTIONS':
        return None

    endpoint = request.endpoint
    method = request.method.lower()

    # Check if endpoint is public
    if endpoint:
        view_func = current_app.view_functions.get(endpoint)

        # For Flask-RESTX Resource classes
        if hasattr(view_func, 'view_class'):
            resource_class = view_func.view_class
            if hasattr(resource_class, method):
                actual_method = getattr(resource_class, method)
                # Check if the specific method is marked as public
                if getattr(actual_method, '_is_public', False):
                    return None

        # For regular Flask view functions
        if view_func and getattr(view_func, '_is_public', False):
            return None

    # Require authentication for non-public endpoints
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({'message': 'Authorization header is required'}), 401
    
    try:
        token = auth_header.split(' ')[1]
    except IndexError:
        return jsonify({'message': 'Invalid authorization header format. Use: Bearer <token>'}), 401
    
    payload = verify_token(token)
    if not payload:
        return jsonify({'message': 'Invalid or expired token'}), 401
    
    g.current_user = payload
    return None
