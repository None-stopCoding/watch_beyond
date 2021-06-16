from flask import request, jsonify, Blueprint

from analysis import Analysis

profile_bp = Blueprint('profile_bp', __name__, url_prefix='/api/profile')


@profile_bp.route('/<int:company_id>/getTrends')
def get_attributes_trends(company_id):
    date_from = request.args.get('dateFrom', type=str)
    date_to = request.args.get('dateTo', type=str)
    period = request.args.get('period', type=str)

    return jsonify(Analysis(company_id).get_combined_attributes(
        date_from, date_to, period
    ))
