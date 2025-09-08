from models.dbConnector import db

class Column(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    data_type = db.Column(db.String(50), nullable=False)  # e.g., 'string', 'integer', 'float', 'date'
    table_id = db.Column(db.Integer, db.ForeignKey('table.id'), nullable=False)

    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    def __repr__(self):
        return f'<Column {self.name} ({self.data_type})>'

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'data_type': self.data_type,
            'table_id': self.table_id,
        }

    def getdatabasetype(self):
        type_mapping = {
            'string': 'TEXT',
            'integer': 'INTEGER',
            'float': 'FLOAT',
            'date': 'DATE',
        }
        return type_mapping.get(self.data_type, 'VARCHAR(255)')
