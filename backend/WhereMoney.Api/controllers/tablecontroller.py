from typing import List

from flask import g
from flask_restx import Namespace, fields, Resource
from models.column import Column
from models.table import Table
from models.dbConnector import db

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
class TableGet(Resource):
    @api.marshal_list_with(table_model)
    def get(self):
        tables = Table.query.filter_by(owner_id=g.current_user).all()
        return [table.serialize() for table in tables]

    @api.expect(table_model)
    @api.marshal_with(table_model, code=201)
    def post(self):
        data = api.payload
        name = data.get('name')
        columns_data: List[Column] = data.get('columns', [])

        if not name:
            api.abort(400, 'Table name is required')

        existing_table = Table.query.filter_by(name=name, owner_id=g.current_user).first()
        if existing_table:
            api.abort(409, 'Table with this name already exists')

        if len(columns_data) == 0:
            api.abort(400, 'At least one column is required')


        table = Table.createtable(name=name, owner_id=g.current_user, columns=columns_data)

        if not isinstance(table, Table):
            api.abort(400, table.get('error', 'One or more fields are invalid'))

        table.createdatabasetable()
        return table.serialize(), 201

@api.route('/<int:id>')
@api.response(404, 'Table not found')
class TableResource(Resource):
    @api.marshal_with(table_model)
    def get(self, id):
        table = Table.query.filter_by(id=id, owner_id=g.current_user).first()
        if not table:
            api.abort(404, 'Table not found')
        return table.serialize()

    def delete(self, id):
        table = Table.query.filter_by(id=id, owner_id=g.current_user).first()
        if not table:
            api.abort(404, 'Table not found')
        return table.deletetable(), 204