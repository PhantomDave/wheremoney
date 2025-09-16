from flask import request, g
from flask_restx import Namespace, Resource, fields
from typing_extensions import Required

from models.dbConnector import db
from models.widget import Widget

api = Namespace('widget', description='Widget operations')

# Constants
WIDGET_NOT_FOUND = "Widget not found"

widget_model = api.model('Widget', {
    'id': fields.Integer(readOnly=True, Required=False, description='The widget unique identifier'),
    'type': fields.String(required=True, description='The widget type'),
    'name': fields.String(required=True, description='The widget name'),
    'widget_data': fields.Raw(required=False, description='The widget data'),
    'table_id': fields.Integer(required=False, description='The associated table ID'),
})

@api.route('/')
class WidgetList(Resource):
    @api.marshal_list_with(widget_model)
    def get(self):
        widgets = Widget.query.filter_by(owner_id=g.current_user).all()
        return [widget.serialize() for widget in widgets]

    @api.expect(widget_model)
    @api.marshal_with(widget_model, code=201)
    def post(self):
        data = request.get_json() or {}
        
        new_widget = Widget(
            name=data.get('name'),
            owner_id=g.current_user,
            type=data.get('type'),
            widget_data=data.get('widget_data', {})
        )
        success = new_widget.createWidget()
        if not success:
            api.abort(409, "Widget with this name already exists for the user.")
        return new_widget, 201
    
@api.route('/<int:id>')
@api.response(404, WIDGET_NOT_FOUND)
class WidgetResource(Resource):
    @api.marshal_with(widget_model)
    def get(self, id):
        widget = Widget.query.filter_by(id=id, owner_id=g.current_user).first()
        if widget is None:
            api.abort(404, WIDGET_NOT_FOUND)
        return widget.serialize()

    @api.expect(widget_model)
    @api.marshal_with(widget_model)
    def put(self, id):
        widget = Widget.query.filter_by(id=id, owner_id=g.current_user).first()
        if widget is None:
            api.abort(404, WIDGET_NOT_FOUND)
        
        data = request.get_json() or {}
        widget.name = data.get('name', widget.name)
        widget.type = data.get('type', widget.type)
        widget.widget_data = data.get('widget_data', widget.widget_data)
        widget.table_id = data.get('table_id', widget.table_id)

        try:
            widget.updateWidget()
            return widget.serialize()
        except ValueError as e:
            api.abort(409, str(e))
        except Exception as e:
            api.abort(500, f"Internal server error: {str(e)}")

    @api.response(204, 'Widget deleted')
    def delete(self, id):
        widget = Widget.query.filter_by(id=id, owner_id=g.current_user).first()
        if widget is None:
            api.abort(404, WIDGET_NOT_FOUND)
        
        db.session.delete(widget)
        db.session.commit()
        return '', 204