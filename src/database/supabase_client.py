import os
from supabase import create_client, Client
from src.config import Config

class SupabaseClient:
    _instance = None
    _client = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(SupabaseClient, cls).__new__(cls)
        return cls._instance
    
    def __init__(self):
        if self._client is None:
            url = Config.SUPABASE_URL
            key = Config.SUPABASE_ANON_KEY
            
            if not url or not key:
                raise ValueError("SUPABASE_URL e SUPABASE_ANON_KEY devem estar configurados")
            
            self._client = create_client(url, key)
    
    @property
    def client(self) -> Client:
        return self._client
    
    def get_client(self) -> Client:
        return self._client

# Instância global do cliente
supabase_client = SupabaseClient()
supabase = supabase_client.get_client()

