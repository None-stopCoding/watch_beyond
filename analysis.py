from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy import create_engine
import json
import importlib

from models import Attributes, AttributesCompanies, Companies
from utils import Dir


class Analysis:
    def __init__(self, company_id):
        company = Companies.query.filter_by(id=company_id).first()
        self.company_id = company_id
        self.company_dir = company.companyDir
        # engine = create_engine(DATABASE_URL)
        # self.db = scoped_session(sessionmaker(bind=engine))

    def save(self, data):
        with open(f'{Dir.get_analysis_path()}/{self.company_dir}/main.json', 'w') as fp:
            json.dump(data, fp, indent=4)

    def get_report(self):
        with open(f'{Dir.get_analysis_path()}/{self.company_dir}/main.json', 'r') as fp:
            data = json.load(fp)
        return data

    def get_last_analysis_date(self):
        pass

    def analyze_company(self, date):
        attrs_for_company = AttributesCompanies.query.filter_by(companyId=self.company_id).all()
        stored_report = self.get_report()

        for attr in attrs_for_company:
            attribute = Attributes.query.filter_by(id=attr.attributeId).first()

            module_name = attribute.moduleName
            if attribute.moduleName in ['Gender', 'Race', 'Emotion', 'Age']:
                module_name = 'deepface'

            stored_report[date] = importlib.import_module(f'attributes.{module_name}')\
                .analyze_categories(f'{self.company_dir}/{date}')

        self.save(stored_report)

        # graph_data = []
        # for date in create_timeline(date_from, date_to, period):
        #     graph_point = {'name': date}
        #
        #     # for attr in attrs_for_company:
        #     attribute = Attributes.query.filter_by(id=1).first()
        #     graph_point[attribute.moduleName] = \
        #         importlib.import_module(f'attributes.{attribute.moduleName}') \
        #             .combined_analysis(f'{company.imagesDir}/{date}')
        #
        #     graph_data.append(graph_point)

    def get_attrs_for_company(self, date):
        pass


if __name__ == '__main__':
    Analysis(company_id=1).analyze_company('10.04.2021')
