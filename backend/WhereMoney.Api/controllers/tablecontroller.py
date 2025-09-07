from flask import g
from flask_restx import Namespace, fields, Resource
from models.column import Column
from models.table import Table

api = Namespace('table', description='Table operations')

column_model = api.model('Column', {
    'id': fields.Integer(readOnly=True, description='The column unique identifier'),
    'name': fields.String(required=True, description='The column name'),
    'data_type': fields.String(required=True, description='The data type of the column')
})

table_model = api.model('Table', {
    'id': fields.Integer(readOnly=True, description='The table unique identifier'),
    'name': fields.String(required=True, description='The table name'),
    'columns': fields.List(fields.Nested(column_model), description='List of columns')
})

@api.route('/')
@api.route('')
class TableGet(Resource):
    @api.marshal_list_with(table_model)
    def get(self):
        """List all tables for the authenticated user"""
        tables = Table.query.filter_by(owner_id=g.current_user).all()
        return [table.serialize() for table in tables]
