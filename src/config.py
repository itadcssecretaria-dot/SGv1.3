import os
from dotenv import load_dotenv

# Carrega as variáveis de ambiente do arquivo .env
load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".env"))

class Config:
    SUPABASE_URL = os.environ.get("SUPABASE_URL")
    SUPABASE_ANON_KEY = os.environ.get("SUPABASE_ANON_KEY")
    SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    FLASK_SECRET_KEY = os.environ.get("FLASK_SECRET_KEY", "SG_Servir_e_Gerir_2025_ADCS_Secret_Key")


