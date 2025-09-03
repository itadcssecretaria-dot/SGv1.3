import os
import sys
from flask import Flask, send_from_directory
from flask_cors import CORS

# Adiciona o diretório src ao path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

# Carrega as variáveis de ambiente
from dotenv import load_dotenv
load_dotenv()

# Importa os blueprints
from routes.user import user_bp
from routes.product import product_bp
from routes.client import client_bp
from routes.sale import sale_bp

def create_app():
    app = Flask(__name__, static_folder='src/static')
    
    # Configuração CORS para permitir requisições do frontend
    CORS(app, origins="*")
    
    # Configuração da chave secreta
    app.config['SECRET_KEY'] = os.environ.get('FLASK_SECRET_KEY', 'SG_Servir_e_Gerir_2025_ADCS_Secret_Key')
    
    # Registra os blueprints
    app.register_blueprint(user_bp, url_prefix='/api')
    app.register_blueprint(product_bp, url_prefix='/api')
    app.register_blueprint(client_bp, url_prefix='/api')
    app.register_blueprint(sale_bp, url_prefix='/api')
    
    # Rota para servir arquivos estáticos e SPA
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        static_folder_path = app.static_folder
        if static_folder_path is None:
            return "Static folder not configured", 404

        if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
            return send_from_directory(static_folder_path, path)
        else:
            index_path = os.path.join(static_folder_path, 'index.html')
            if os.path.exists(index_path):
                return send_from_directory(static_folder_path, 'index.html')
            else:
                return "index.html not found", 404
    
    return app

# Para Vercel
app = create_app()

# Para execução local
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

