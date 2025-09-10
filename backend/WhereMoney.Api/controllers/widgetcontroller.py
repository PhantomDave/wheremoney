from flask import request, g
from flask_restx import Namespace, Resource, fields
from typing_extensions import Required

from models.dbConnector import db
from models.widget import Widget

api = Namespace('widget', description='Widget operations')

widget_model = api.model('Widget', {
    'id': fields.Integer(readOnly=True, Required=False, description='The widget unique identifier'),
    'type': fields.String(required=True, description='The widget type'),
    'name': fields.String(required=True, description='The widget name'),
    'widget_data': fields.Raw(required=False, description='The widget data'),
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
        
        print(data)
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