from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask import Flask
from flask_migrate import Migrate

db = SQLAlchemy()
migrate = Migrate()


def create_app():
    app = Flask(__name__)
    cors = CORS(app)
    app.config.from_pyfile('config.py')

    db.init_app(app)
    migrate.init_app(app, db)
    db.create_all(app=app)

    with app.app_context():
        from models import fill_database_if_empty
        from routes.attribute import attribute_bp
        from routes.profile import profile_bp

        fill_database_if_empty()
        app.register_blueprint(attribute_bp)
        app.register_blueprint(profile_bp)

    return app


if __name__ == '__main__':
    create_app().run(debug=True)
