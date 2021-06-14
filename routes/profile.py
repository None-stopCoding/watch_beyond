from flask import request, jsonify, Blueprint

from models import AttributesCompanies, Companies
from app import create_app

app = create_app()


@app.route('/api/attribute/getAll')
def get_attributes_trends():
    company_id = request.args.get('companyId', type=int)
    date_from = request.args.get('dateFrom', type=str)
    date_to = request.args.get('dateTo', type=str)
    period = request.args.get('period', type=str)

    attrs_for_company = AttributesCompanies.query.filter_by(companyId=company_id).all()
    company = Companies.query.filter_by(id=company_id).first()

    graph_data = []
    # for date in create_timeline(date_from, date_to, period):
    #     graph_point = {'name': date}
    #
    #     # for attr in attrs_for_company:
    #     attribute = Attributes.query.filter_by(id=1).first()
    #     graph_point[attribute.moduleName] =\
    #         importlib.import_module(f'attributes.{attribute.moduleName}')\
    #             .combined_analysis(f'{company.imagesDir}/{date}')
    #
    #     graph_data.append(graph_point)

    return jsonify(graph_data)


profile_print = Blueprint('/api/profile', __name__)
profile_print.route('/getTrends')(get_attributes_trends)