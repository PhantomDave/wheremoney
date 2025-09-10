import os
import warnings
from datetime import datetime, date

import numpy as np
import pandas as pd
from flask import request, g
from flask_restx import Namespace, Resource
from werkzeug.datastructures import FileStorage

from models.table import Table

# Suppress openpyxl warnings about print areas and other Excel-specific features
warnings.filterwarnings('ignore', category=UserWarning, module='openpyxl')

api = Namespace('import', description='import operations', path='/import')

def make_json_serializable(obj):
    """Convert non-JSON serializable objects to serializable format"""
    if isinstance(obj, (datetime, date)):
        return obj.strftime('%Y-%m-%d %H:%M:%S') if hasattr(obj, 'strftime') else str(obj)
    elif isinstance(obj, (np.integer, np.floating)):
        return obj.item()
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif pd.isna(obj) or obj is pd.NaT:
        return ''
    elif hasattr(obj, '__dict__'):
        return str(obj)
    else:
        return str(obj)

upload_parser = api.parser()
upload_parser.add_argument('file', location='files', type=FileStorage, required=True, help='XLSX file to upload')
upload_parser.add_argument('header_row', location='form', type=int, required=False, default=0, help='Row index to use as header (0-based)')
upload_parser.add_argument('start_row', location='form', type=int, required=False, default=None, help='Row index to start reading data from (0-based). If not specified, will start from header_row + 1')
upload_parser.add_argument('tableId', location='form', type=int, required=True, help='ID of the table to import data into')

@api.route('/xlsx')
class XLSXUpload(Resource):
    @api.expect(upload_parser)
    @api.doc('upload_xlsx_file')
    def post(self):
        try:
            # Get the uploaded file
            if 'file' not in request.files:
                return {'error': 'No file provided'}, 400

            file = request.files['file']

            if file.filename == '':
                return {'error': 'No file selected'}, 400

            if not file.filename.lower().endswith('.xlsx'):
                return {'error': 'Only XLSX files are allowed'}, 400

            upload_dir = 'uploads'
            if not os.path.exists(upload_dir):
                os.makedirs(upload_dir)

            if hasattr(g, 'current_user') and isinstance(g.current_user, dict) and 'user_id' in g.current_user:
                filename = f"{g.current_user['user_id']}_{file.filename}"
            else:
                filename = file.filename
            filepath = os.path.join(upload_dir, filename)
            file.save(filepath)

            try:
                excel_file = pd.ExcelFile(filepath)
                sheets_data = {}

                # Get the header row from the request args
                header_row = int(request.form.get('header_row', 0))

                for sheet_name in excel_file.sheet_names:
                    df = pd.read_excel(filepath, sheet_name=sheet_name, header=header_row)

                    for col in df.columns:
                        if df[col].dtype == 'datetime64[ns]':
                            df[col] = df[col].dt.strftime('%Y-%m-%d %H:%M:%S')
                        elif pd.api.types.is_datetime64_any_dtype(df[col]):
                            df[col] = df[col].astype(str)

                    df = df.fillna('')

                    sheets_data[sheet_name] = {
                        'columns': df.columns.tolist(),
                        'rows_count': len(df),
                        'data': df.map(make_json_serializable).to_dict('records'),
                    }

                # Clean up - remove temporary file
                os.remove(filepath)

                table = Table.query.filter_by(id=request.form.get('tableId')).first()
                if not table:
                    return {'error': 'Table not found'}, 404

                populatersp = table.populate_from_sheets(sheets_data)

                if populatersp.get("error"):
                    return api.abort(populatersp.get("error"))

                return {
                    'message': 'File uploaded and processed successfully',
                    'filename': file.filename,
                    'sheets': list(sheets_data.keys()),
                    'data': sheets_data
                }, 200

            except Exception as e:
                if os.path.exists(filepath):
                    os.remove(filepath)
                print(e)
                return {'error': f'Error processing XLSX file: {str(e)}'}, 400

        except Exception as e:
            print(e)
            return {'error': f'Upload failed: {str(e)}'}, 500
