from models.dbConnector import db
import bcrypt

class Table(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)

    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    owner = db.relationship('User', backref=db.backref('tables', lazy=True))
    # Relazione one-to-many con Column
    columns = db.relationship('Column', backref='table', lazy=True, cascade='all, delete-orphan')

    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    def __repr__(self):
        return f'<Table {self.name}>'

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'columns': [column.serialize() for column in self.columns],
        }