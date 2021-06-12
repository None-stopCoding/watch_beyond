from pprint import pprint
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from flask_sqlalchemy import SQLAlchemy
from flask_restful import inputs

from utils import create_timeline
import importlib

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db/main.db'
db = SQLAlchemy(app)


class Attributes(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), index=True, unique=True)
    icon = db.Column(db.String(64))
    moduleName = db.Column(db.String(64), unique=True)


class Companies(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), unique=True)
    imagesDir = db.Column(db.String(64), unique=True)


class AttributesCompanies(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    companyId = db.Column(db.Integer, db.ForeignKey('companies.id'), nullable=False)
    attributeId = db.Column(db.Integer, db.ForeignKey('attributes.id'), nullable=False)


db.create_all()

# Заполним БД, если пустая
if not Attributes.query.all():
    db.session.add(Attributes(name="Пол", icon="wc", moduleName="Gender"))
    db.session.add(Attributes(name="Возраст", icon="perm_contact_calendar", moduleName="Age"))
    db.session.add(Attributes(name="Эмоция", icon="emoji_emotions", moduleName="Emotion"))
    db.session.add(Attributes(name="Раса", icon="people_alt", moduleName="Race"))

    db.session.add(Companies(name="Тестовая компания", imagesDir="first"))

    db.session.add(AttributesCompanies(companyId="1", attributeId="1"))
    db.session.add(AttributesCompanies(companyId="1", attributeId="2"))
    db.session.add(AttributesCompanies(companyId="1", attributeId="3"))

    db.session.commit()


@app.route('/api/attributes/getAll')
def get_attributes():
    company_id = request.args.get('companyId', type=int)
    is_used = request.args.get('isUsed', type=inputs.boolean)
    attrs_in_company_raw = AttributesCompanies.query.filter_by(companyId=company_id).all()
    attrs_in_company = [{'id': attr.attributeId} for attr in attrs_in_company_raw]

    for attr in attrs_in_company:
        rest_params = Attributes.query.filter_by(id=attr['id']).first()
        attr['name'] = rest_params.name
        attr['icon'] = rest_params.icon

    if is_used:
        return jsonify(attrs_in_company)

    all_attrs = Attributes.query.all()
    attrs_in_company_ids = list(map(lambda attr: attr['id'], attrs_in_company))
    return jsonify([
        {
            'id': attr.id,
            'name': attr.name,
            'icon': attr.icon
        } for attr in
        list(filter(lambda attr: attr.id not in attrs_in_company_ids, all_attrs))
    ])


@app.route('/api/attribute/get')
def get_attribute_by_id():
    attribute = Attributes.query.filter_by(id=request.args.get('id', type=int)).first()
    return jsonify({
        'id': attribute.id,
        'name': attribute.name,
        'icon': attribute.icon
    })


@app.route('/api/attributes/trends')
def get_attributes_trends():
    company_id = request.args.get('companyId', type=int)
    date_from = request.args.get('dateFrom', type=str)
    date_to = request.args.get('dateTo', type=str)
    period = request.args.get('period', type=str)

    attrs_for_company = AttributesCompanies.query.filter_by(companyId=company_id).all()
    company = Companies.query.filter_by(id=company_id).first()

    graph_data = []
    for date in create_timeline(date_from, date_to, period):
        graph_point = {'name': date}

        for attr in attrs_for_company:
            attribute = Attributes.query.filter_by(id=attr.attributeId).first()
            res = importlib.import_module(f'attributes.{attribute.moduleName}')\
                .combined_analysis(f'{company.imagesDir}/{date}')

        graph_data.append(graph_point)

    return jsonify(graph_data)


if __name__ == '__main__':
    app.run(debug=True)
