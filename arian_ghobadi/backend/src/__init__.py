import os
import tradingeconomics as te
from flask import Flask
from dotenv import load_dotenv



def create_app():
    app = Flask(__name__,instance_relative_config=True)
    load_dotenv()
    te.login(os.environ["API_KEY"])

    with app.app_context():
        from .routes import routes
        app.register_blueprint(routes)
    
                
    # @app.teardown_appcontext
    # def tear_down(_):
    #     if 'db_session' in g:
    #         db_session = g.pop('db_session')
    #         db_session.close()

    return app