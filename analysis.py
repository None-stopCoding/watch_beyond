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
                    combined.append({**{'name': date}, **analysis['combined']})
            combined.sort(key=lambda x: get_date(x['name']))
            return combined

        return None

    def get_attributes_by_categories(self, date_from, date_to, period):
        report = self.get_report()
        attributes = {}
        unique_categories = {}

        if period == 'weeks':
            for date, analysis in report.items():
                if get_date(date_from) <= get_date(date) <= get_date(date_to):
                    for attr, categories in analysis['prepared'].items():
                        if attr not in attributes:
                            attributes[attr] = []
                        attributes[attr].append({**{'name': date}, **categories})
                        unique_categories[attr] = unique_categories.get(attr, set()).union(set(categories.keys()))

            # Заполняем знаечниями по умолчанию необнаруженные,
            # но существующие категории для каждой даты
            for attr, categories in unique_categories.items():
                full_points = []
                for point in attributes[attr]:
                    full_points.append(point)
                    for cat in categories:
                        if cat not in point.keys():
                            full_points[-1] = {**full_points[-1], **{cat: 0}}

                attributes[attr] = full_points

            for attr in attributes.values():
                attr.sort(key=lambda x: get_date(x['name']))

            return attributes

        return None

    def get_current_categories(self):
        report = self.get_report()
        last_analysis = report[self.company.lastUpdate]['prepared']
        attributes = {}

        for attr, categories in last_analysis.items():
            attributes[attr] = [{'name': category, 'value': value} for category, value in categories.items()]

        return attributes


if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        Analysis(company_id=1).fill_empty_report()
