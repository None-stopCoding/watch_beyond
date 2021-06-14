from app import db


class Attributes(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), index=True, unique=True)
    icon = db.Column(db.String(64))
    moduleName = db.Column(db.String(64), unique=True)

    @staticmethod
    def get_attribute(sql_alchemy_result):
        return {
            'id': sql_alchemy_result.id,
            'name': sql_alchemy_result.name,
            'icon': sql_alchemy_result.icon,
            'moduleName': sql_alchemy_result.moduleName
        }


class Companies(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), unique=True)
    companyDir = db.Column(db.String(64), unique=True)

    @staticmethod
    def get_attribute(sql_alchemy_result):
        return {
            'id': sql_alchemy_result.id,
            'name': sql_alchemy_result.name,
            'companyDir': sql_alchemy_result.companyDir
        }


class AttributesCompanies(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    companyId = db.Column(db.Integer, db.ForeignKey('companies.id'), nullable=False)
    attributeId = db.Column(db.Integer, db.ForeignKey('attributes.id'), nullable=False)

    @staticmethod
    def get_attribute(sql_alchemy_result):
        return {
            'id': sql_alchemy_result.id,
            'companyId': sql_alchemy_result.companyId,
            'attributeId': sql_alchemy_result.attributeId
        }


def convert(result, method):
    """
    Конвертирует ответ sqlAlchemy в объект
    :param result: ответ sqlAlchemy запроса
    :param method: метод конвертации
    :return: объект/список, соответствующий ответу
    """
    if isinstance(result, list):
        return result and list(map(lambda attr: method(attr), result))
    else:
        return result and method(result)


def fill_database_if_empty():
    """
    Заполняет БД, если пустая
    """
    if not Attributes.query.all():
        db.session.add(Attributes(name="Пол", icon="wc", moduleName="Gender"))
        db.session.add(Attributes(name="Возраст", icon="perm_contact_calendar", moduleName="Age"))
        db.session.add(Attributes(name="Эмоция", icon="emoji_emotions", moduleName="Emotion"))
        db.session.add(Attributes(name="Раса", icon="people_alt", moduleName="Race"))

        db.session.add(Companies(name="Тестовая компания", companyDir="first"))

        db.session.add(AttributesCompanies(companyId="1", attributeId="1"))
        db.session.add(AttributesCompanies(companyId="1", attributeId="2"))
        db.session.add(AttributesCompanies(companyId="1", attributeId="3"))

        db.session.commit()
