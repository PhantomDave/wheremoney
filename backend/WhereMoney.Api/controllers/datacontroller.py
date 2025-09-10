from flask import g
from flask_restx import Namespace, Resource

from models.table import Table

api = Namespace('data', description='Data operations')


@api.route('/<int:id>')
@api.response(404, 'Table not found')
class Get(Resource):
    def get(self, id):
        table = Table.query.filter_by(owner_id=g.current_user, id=id).first()

        if not table:
            api.abort(404, 'Table not found')

        return {
            'columns': [col.serialize() for col in table.columns],
            'data': table.getdata(),
        }
