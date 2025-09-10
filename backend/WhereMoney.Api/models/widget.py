from models.dbConnector import db


class Widget(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    type = db.Column(db.String(50), nullable=False)

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
            print(f"Error checking existing widget: {e}")
            raise
        return self