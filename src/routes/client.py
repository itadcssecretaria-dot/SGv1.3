from flask import Blueprint, request, jsonify
from src.services.supabase_service import supabase_client

client_bp = Blueprint("client_bp", __name__)

@client_bp.route("/clients", methods=["GET"])
def get_clients():
    try:
        response = supabase_client.table("clientes").select("*").execute()
        return jsonify(response.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@client_bp.route("/clients", methods=["POST"])
def create_client():
    try:
        data = request.json
        
        # Dados básicos do cliente
        client_data = {
            "nome": data.get("nome"),
            "telefone": data.get("telefone"),
            "ativo": data.get("ativo", True)
        }

        response = supabase_client.table("clientes").insert(client_data).execute()
        return jsonify(response.data), 201
    except Exception as e:
        print(f"Erro ao criar cliente: {str(e)}")
        return jsonify({"error": str(e)}), 500

@client_bp.route("/clients/<int:client_id>", methods=["PUT"])
def update_client(client_id):
    try:
        data = request.json
        response = supabase_client.table("clientes").update(data).eq("id", client_id).execute()
        return jsonify(response.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@client_bp.route("/clients/<int:client_id>", methods=["DELETE"])
def delete_client(client_id):
    try:
        response = supabase_client.table("clientes").delete().eq("id", client_id).execute()
        return jsonify(response.data), 204
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@client_bp.route("/clients/<int:client_id>/debt", methods=["GET"])
def get_client_debt(client_id):
    try:
        # Buscar vendas a prazo não pagas do cliente
        response = supabase_client.table("vendas").select("*").eq("cliente_id", client_id).eq("forma_pagamento", "fiado").eq("pago", False).execute()
        
        total_debt = sum(venda["total"] for venda in response.data)
        
        return jsonify({
            "client_id": client_id,
            "total_debt": total_debt,
            "unpaid_sales": response.data
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

