import os
import sys

# DON\"T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory
from src.models.user import db
from src.routes.user import user_bp
from src.routes.product import product_bp
from src.routes.client import client_bp
from src.routes.sale import sale_bp

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), \'static\'))
app.config[\'SECRET_KEY\'] = \'asdf#FGSgvasgf$5$WGT\'

# Registrar blueprints da API (DEVE SER FEITO ANTES DAS ROTAS ESTÁTICAS)
app.register_blueprint(user_bp, url_prefix=\'/api\')
app.register_blueprint(product_bp, url_prefix=\'/api\')
app.register_blueprint(client_bp, url_prefix=\'/api\')
app.register_blueprint(sale_bp, url_prefix=\'/api\')

# uncomment if you need to use database
app.config[\'SQLALCHEMY_DATABASE_URI\'] = f\"sqlite:///{os.path.join(os.path.dirname(__file__), \'database\', \'app.db\')}\"
app.config[\'SQLALCHEMY_TRACK_MODIFICATIONS\'] = False
db.init_app(app)
with app.app_context():
    db.create_all()




