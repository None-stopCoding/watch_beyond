from models import Attributes, AttributesCompanies, convert

from flask import request, jsonify, Blueprint
from flask_restful import inputs

attribute_bp = Blueprint('attribute_bp', __name__, url_prefix='/api/attribute')


@attribute_bp.route('/<int:company_id>/getAll')
def get_attributes(company_id):
    is_used = request.args.get('isUsed', type=inputs.boolean)
    attrs_in_company_raw = AttributesCompanies.query.filter_by(companyId=company_id).all()
    attrs_in_company = []

    for attr in attrs_in_company_raw:
        attribute = Attributes.query.filter_by(id=attr.attributeId).first()
        attrs_in_company.append(convert(attribute, Attributes.get_attribute))

    if is_used:
        return jsonify(attrs_in_company)

    all_attrs = Attributes.query.all()
    attrs_in_company_ids = list(map(lambda attr: attr['id'], attrs_in_company))
    return jsonify(
        convert(
            list(filter(lambda attr: attr.id not in attrs_in_company_ids, all_attrs)),
            Attributes.get_attribute
        )
    )


@attribute_bp.route('getOne/<int:attribute_id>')
def get_attribute_by_id(attribute_id):
    attribute = Attributes.query.filter_by(id=attribute_id).first()
    return jsonify(convert(attribute, Attributes.get_attribute))
