from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask import Flask

db = SQLAlchemy()


def create_app():
    app = Flask(__name__)
    cors = CORS(app)
    app.config.from_pyfile('config.py')

    db.init_app(app)
    db.create_all(app=app)

    with app.app_context():
        from models import fill_database_if_empty
        from routes.attribute import attribute_bp

        fill_database_if_empty()
        app.register_blueprint(attribute_bp)

    return app


if __name__ == '__main__':
    create_app().run(debug=True)
