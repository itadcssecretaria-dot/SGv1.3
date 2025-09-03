from src.services.supabase_service import supabase_client

def get_category_id_by_name(category_name: str):
    response = supabase_client.table("categorias").select("id").eq("nome", category_name).limit(1).execute()
    if response.data and len(response.data) > 0:
        return response.data[0]["id"]
    return None


