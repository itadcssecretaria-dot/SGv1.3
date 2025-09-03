from flask import Blueprint, request, jsonify
from src.services.supabase_service import supabase_client
from datetime import datetime

sale_bp = Blueprint("sale_bp", __name__)

@sale_bp.route("/sales", methods=["GET"])
def get_sales():
    try:
        response = supabase_client.table("vendas").select("*, clientes(nome), usuarios(nome)").execute()
        return jsonify(response.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@sale_bp.route("/sales", methods=["POST"])
def create_sale():
    try:
        data = request.json
        
        # Dados da venda
        sale_data = {
            "cliente_id": data.get("cliente_id"),  # NULL se for venda à vista
            "usuario_id": data.get("usuario_id", 1),  # ID do usuário logado
            "valor_bruto": data.get("valor_bruto"),
            "desconto": data.get("desconto", 0.00),
            "valor_total": data.get("valor_total"),
            "forma_pagamento_id": data.get("forma_pagamento_id", 1),
            "tipo_venda": data.get("tipo_venda", "vista"),  # vista ou prazo
            "status": "finalizada",
            "observacoes": data.get("observacoes", "")
        }

        # Inserir venda
        response = supabase_client.table("vendas").insert(sale_data).execute()
        venda_id = response.data[0]["id"]
        
        # Inserir itens da venda
        items = data.get("items", [])
        for item in items:
            item_data = {
                "venda_id": venda_id,
                "produto_id": item["produto_id"],
                "quantidade": item["quantidade"],
                "preco_unitario": item["preco_unitario"],
                "subtotal": item["subtotal"]
            }
            supabase_client.table("venda_itens").insert(item_data).execute()
        
        # Se for venda a prazo, atualizar saldo devedor do cliente
        if data.get("tipo_venda") == "prazo" and data.get("cliente_id"):
            cliente_response = supabase_client.table("clientes").select("saldo_devedor").eq("id", data.get("cliente_id")).execute()
            if cliente_response.data:
                saldo_atual = cliente_response.data[0]["saldo_devedor"] or 0
                novo_saldo = saldo_atual + data.get("valor_total")
                supabase_client.table("clientes").update({"saldo_devedor": novo_saldo}).eq("id", data.get("cliente_id")).execute()
        
        return jsonify(response.data), 201
    except Exception as e:
        print(f"Erro ao criar venda: {str(e)}")
        return jsonify({"error": str(e)}), 500

@sale_bp.route("/sales/<int:sale_id>", methods=["GET"])
def get_sale(sale_id):
    try:
        response = supabase_client.table("vendas").select("*, venda_itens(*, produtos(nome)), clientes(nome)").eq("id", sale_id).execute()
        return jsonify(response.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@sale_bp.route("/sales/<int:sale_id>", methods=["DELETE"])
def cancel_sale(sale_id):
    try:
        # Marcar venda como cancelada
        response = supabase_client.table("vendas").update({"status": "cancelada"}).eq("id", sale_id).execute()
        
        # Se for venda a prazo, reverter saldo devedor do cliente
        venda = supabase_client.table("vendas").select("*").eq("id", sale_id).execute()
        if venda.data and venda.data[0]["tipo_venda"] == "prazo" and venda.data[0]["cliente_id"]:
            cliente_id = venda.data[0]["cliente_id"]
            valor_total = venda.data[0]["valor_total"]
            
            cliente_response = supabase_client.table("clientes").select("saldo_devedor").eq("id", cliente_id).execute()
            if cliente_response.data:
                saldo_atual = cliente_response.data[0]["saldo_devedor"] or 0
                novo_saldo = max(0, saldo_atual - valor_total)
                supabase_client.table("clientes").update({"saldo_devedor": novo_saldo}).eq("id", cliente_id).execute()
        
        return jsonify(response.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@sale_bp.route("/sales/today", methods=["GET"])
def get_today_sales():
    try:
        today = datetime.now().strftime("%Y-%m-%d")
        response = supabase_client.table("vendas").select("*").gte("data_hora", f"{today} 00:00:00").lte("data_hora", f"{today} 23:59:59").eq("status", "finalizada").execute()
        
        total = sum(sale["valor_total"] for sale in response.data)
        return jsonify({
            "sales": response.data,
            "total": total,
            "count": len(response.data)
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

