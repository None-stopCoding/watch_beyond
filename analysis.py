import json
import importlib

from models import Attributes, AttributesCompanies, Companies
from app import create_app
from utils import Dir


class Analysis:
    def __init__(self, company_id):
        company = Companies.query.filter_by(id=company_id).first()
        self.company_id = company_id
        self.company_dir = company.companyDir

    def save(self, data):
        with open(f'{Dir.get_analysis_path()}/{self.company_dir}/main.json', 'w') as fp:
            json.dump(data, fp, indent=4)

    def get_report(self):
        with open(f'{Dir.get_analysis_path()}/{self.company_dir}/main.json', 'r') as fp:
            data = json.load(fp)
        return data

    def get_last_analysis_date(self):
        pass

    def run(self, date):
        attrs_for_company = AttributesCompanies.query.filter_by(companyId=self.company_id).all()
        stored_report = self.get_report()
        stored_report[date] = {
            'raw': {},
            'prepared': {},
            'combined': {}
        }
        deepface_modules = []

        for attr in attrs_for_company:
            attribute = Attributes.query.filter_by(id=attr.attributeId).first()

            if attribute.moduleName in ['Gender', 'Race', 'Emotion', 'Age']:
                deepface_modules.append(attribute.moduleName.lower())
                continue

            raw = importlib.import_module(f'attributes.{attribute.moduleName}')\
                .analyze_categories(f'{self.company_dir}/{date}')
            stored_report[date]['raw'].update(raw)

        deepface_analysis = importlib.import_module(f'attributes.deepface')\
            .analyze_categories(f'{self.company_dir}/{date}', deepface_modules)
        stored_report[date]['raw'].update(deepface_analysis)

        self.save(stored_report)

    def set_used_attributes(self, date):
        pass


if __name__ == '__main__':
    app = create_app()
    context = app.app_context()
    context.push()
    Analysis(company_id=1).run('10.04.2021')

    context.pop()
