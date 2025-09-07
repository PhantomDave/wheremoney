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

        table = Table(name=name, owner_id=g.current_user)
        db.session.add(table)

        print(table)

        for col_data in columns_data:
            col_name = col_data.get('name')
            col_type = col_data.get('type')
            if not col_name or not col_type:
                api.abort(400, 'At least one column is required')
            column = Column(name=col_name, data_type=col_type, table_id=table.id)
            table.columns.append(column)

        db.session.commit()
        return table.serialize(), 201
