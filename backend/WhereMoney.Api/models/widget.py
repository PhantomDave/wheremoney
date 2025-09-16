from models.dbConnector import db


class Widget(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    type = db.Column(db.String(50), nullable=False)

    table_id = db.Column(db.Integer, db.ForeignKey('table.id'), nullable=True)
    table = db.relationship('Table', backref=db.backref('widgets', lazy=True))

    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    owner = db.relationship('User', backref=db.backref('widgets', lazy=True))
    widget_data = db.Column(db.JSON, nullable=True)

    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(),
                           onupdate=db.func.now())

    def __repr__(self):
        return f'<Widget {self.name}>'
    
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'type': self.type,
            'widget_data': self.widget_data,
            'table_id': self.table_id,
            'owner_id': self.owner_id,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
        }
    
    def createWidget(self):
        try:
            existing = Widget.query.filter_by(name=self.name, owner_id=self.owner_id).first()
            if existing:
                raise ValueError("Widget with this name already exists for the user.")
            db.session.add(self)
            db.session.commit()
        except Exception as e:
            raise
        return self
    
    def updateWidget(self):
        try:
            # Check if name is being changed and if new name conflicts
            existing = Widget.query.filter_by(name=self.name, owner_id=self.owner_id).filter(Widget.id != self.id).first()
            if existing:
                raise ValueError("Widget with this name already exists for the user.")
            
            db.session.commit()
            return self
        except Exception as e:
            db.session.rollback()
            raise