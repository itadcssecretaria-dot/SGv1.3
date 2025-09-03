import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Carrega as variáveis de ambiente
load_dotenv()

class SupabaseService:
    _instance = None
    _client = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(SupabaseService, cls).__new__(cls)
        return cls._instance
    
    def __init__(self):
        if self._client is None:
            url = os.environ.get("SUPABASE_URL")
            key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
            
            if not url or not key:
                raise ValueError("SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY devem estar configurados")
            
            self._client = create_client(url, key)
    
    @property
    def client(self) -> Client:
        return self._client

# Instância global
supabase_service = SupabaseService()
supabase_client = supabase_service.client
