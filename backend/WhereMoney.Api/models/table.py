from sqlalchemy import text

from models.column import Column
from models.dbConnector import db


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

    @staticmethod
    def createtable(name, owner_id, columns):
        table = Table(name=name, owner_id=owner_id)
        db.session.add(table)

        for col_data in columns:
            col_name = col_data.get('name')
            col_type = col_data.get('type')
            if not col_name or not col_type:
                return {
                    'error': 'Column name and type are required'
                }
            column = Column(name=col_name, data_type=col_type, table_id=table.id)
            table.columns.append(column)
        db.session.commit()
        return table

    def deletetable(self):
        try:
            table_name = f"{self.name}_{self.owner_id}"
            drop_table_sql = f"DROP TABLE {table_name} CASCADE;"
            db.session.execute(text(drop_table_sql))
            db.session.delete(self)
            db.session.commit()
            return {'message': 'Table deleted successfully'}

        except Exception as e:
            db.session.rollback()
            print("Error deleting table:", e)
            return {'error': str(e)}

    def createdatabasetable(self):
        column_definitions = []
        for column in self.columns:
            col_def = f'"{column.name}" {column.getdatabasetype()}'
            column_definitions.append(col_def)
        columns_sql = ", ".join(column_definitions)
        create_table_sql = f'CREATE TABLE "{self.name}_{self.owner_id}" (id SERIAL PRIMARY KEY, {columns_sql});'
        try:
            db.session.execute(text(create_table_sql))
            db.session.commit()
            return {'message': f'Table {self.name} created successfully in the database'}
        except Exception as e:
            db.session.rollback()
            print("Error creating table:", e)
            return {'error': str(e)}

    def populate_from_sheets(self, sheets_data):
        try:
            table_name = f"{self.name}_{self.owner_id}"
            for sheet_name, sheet_info in sheets_data.items():
                columns = sheet_info['columns']
                data = sheet_info['data']

                for row in data:
                    col_names = []
                    col_values = []
                    param_map = {}
                    for col in columns:
                        if col in row:
                            safe_col = col.replace(" ", "_")
                            col_names.append(f'"{col}"')
                            col_values.append(f":{safe_col}")
                            param_map[safe_col] = row[col]

                    insert_sql = f'INSERT INTO "{table_name}" ({", ".join(col_names)}) VALUES ({", ".join(col_values)})'
                    db.session.execute(text(insert_sql), param_map)
            db.session.commit()
            return {'message': 'Data populated successfully'}
        except Exception as e:
            db.session.rollback()
            print("Error populating data:", e)
            return {'error': str(e)}

    def getdata(self):
        try:
            table_name = f"{self.name}_{self.owner_id}"
            select_sql = f'SELECT * FROM "{table_name}"'
            result = db.session.execute(text(select_sql))
            rows = [dict(row) for row in result]
            return rows
        except Exception as e:
            print("Error retrieving data:", e)
            return {'error': str(e)}
