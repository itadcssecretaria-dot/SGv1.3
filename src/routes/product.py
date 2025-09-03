from flask import Blueprint, request, jsonify
from src.services.supabase_service import supabase_client

product_bp = Blueprint("product_bp", __name__)

@product_bp.route("/products", methods=["GET"])
def get_products():
    try:
        response = supabase_client.table("produtos").select("*").execute()
        return jsonify(response.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@product_bp.route("/products", methods=["POST"])
def create_product():
    try:
        data = request.json
        
        # Simplificar - usar apenas os campos básicos que existem na tabela
        produto_data = {
            "nome": data.get("nome"),
            "preco": float(data.get("preco", 0)),
            "ativo": data.get("ativo", True)
        }
        
        # Adicionar categoria_id se fornecida
        if "categoria" in data:
            # Por enquanto, vamos usar um ID fixo para teste
            produto_data["categoria_id"] = 1

        response = supabase_client.table("produtos").insert(produto_data).execute()
        return jsonify(response.data), 201
    except Exception as e:
        print(f"Erro ao criar produto: {str(e)}")
        return jsonify({"error": str(e)}), 500

@product_bp.route("/products/<int:product_id>", methods=["PUT"])
def update_product(product_id):
    try:
        data = request.json
        # Remover campos que não existem na tabela produtos do Supabase
        data.pop("custo", None)
        data.pop("controlar_estoque", None)
        data.pop("quantidade_estoque", None)
        data.pop("descricao", None)

        response = supabase_client.table("produtos").update(data).eq("id", product_id).execute()
        return jsonify(response.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@product_bp.route("/products/<int:product_id>", methods=["DELETE"])
def delete_product(product_id):
    try:
        response = supabase_client.table("produtos").delete().eq("id", product_id).execute()
        return jsonify(response.data), 204
    except Exception as e:
        return jsonify({"error": str(e)}), 500


