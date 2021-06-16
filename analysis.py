import json
import importlib

from models import Attributes, AttributesCompanies, Companies
from app import create_app, db
from utils import Dir, get_date


class Analysis:
    def __init__(self, company_id):
        self.company = Companies.query.filter_by(id=company_id).first()
        self.company_id = company_id
        self.company_dir = self.company.companyDir

    def save(self, data):
        with open(f'{Dir.get_analysis_path()}/{self.company_dir}/main.json', 'w') as fp:
            json.dump(data, fp, indent=4)

    def get_report(self):
        with open(f'{Dir.get_analysis_path()}/{self.company_dir}/main.json', 'r') as fp:
            data = json.load(fp)
        return data

    def run(self, date):
        """
        Обновляет аналитические данные по дате в компании
        TODO при анализе очередного признака, данные прошлого будут стерты
        """
        def prepare_to_store(analysis, methods):
            prepared = methods[0](analysis)
            combined = methods[1](prepared)

            return {
                'raw': analysis,
                'prepared': prepared,
                'combined': combined
            }

        attrs_for_company = AttributesCompanies.query.filter_by(companyId=self.company_id).all()
        stored_report = self.get_report()
        if not len(stored_report.keys()):
            self.company.firstUpdate = date

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

            module = importlib.import_module(f'attributes.{attribute.moduleName}')
            stored_report[date].update(
                prepare_to_store(
                    module.analyze_categories(f'{self.company_dir}/{date}'),
                    [
                        module.combine_categories,
                        module.combine_attributes
                    ]
                )
            )

        module = importlib.import_module(f'attributes.deepface')
        stored_report[date].update(
            prepare_to_store(
                module.analyze_categories(f'{self.company_dir}/{date}', deepface_modules),
                [
                    module.combine_categories,
                    module.combine_attributes
                ]
            )
        )

        self.save(stored_report)
        self.company.lastUpdate = date
        db.session.commit()

    def fill_empty_report(self):
        for image in Dir.get_images(self.company_dir):
            self.run(image.split('/').pop())

    def set_used_attributes(self, date):
        pass

    def get_combined_attributes(self, date_from, date_to, period):
        report = self.get_report()
        combined = []

        if period == 'weeks':
            for date, analysis in report.items():
                if get_date(date_from) <= get_date(date) <= get_date(date_to):
                    point = {'name': date}
                    point.update(analysis['combined'])
                    combined.append(point)
            return combined

        return None


if __name__ == '__main__':
    app = create_app()
    context = app.app_context()
    context.push()
    Analysis(company_id=1).fill_empty_report()

    context.pop()
