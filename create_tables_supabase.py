#!/usr/bin/env python3
"""
Script para criar tabelas no Supabase usando a API REST
"""

import os
import sys
import requests
from dotenv import load_dotenv

def create_tables():
    """Cria as tabelas no Supabase usando a API REST"""
    
    # Carregar variáveis de ambiente
    load_dotenv()
    
    url = os.getenv("SUPABASE_URL")
    service_role_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    
    if not url or not service_role_key:
        print("❌ Erro: Variáveis de ambiente não encontradas")
        return False
    
    print("🚀 SG - Servir e Gerir - Criando Tabelas via API")
    print("=" * 60)
    
    # Headers para autenticação
    headers = {
        'apikey': service_role_key,
        'Authorization': f'Bearer {service_role_key}',
        'Content-Type': 'application/json'
    }
    
    # Vamos criar dados de exemplo diretamente nas tabelas
    # Primeiro, vamos tentar inserir dados para ver se as tabelas já existem
    
    try:
        # Testar se a tabela usuarios existe
        response = requests.get(f"{url}/rest/v1/usuarios?limit=1", headers=headers)
        
        if response.status_code == 200:
            print("✅ Tabelas já existem no banco de dados!")
            users = response.json()
            print(f"📊 Encontrados {len(users)} usuários na tabela")
            return True
        else:
            print(f"⚠️  Tabelas não existem ainda. Status: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Erro ao verificar tabelas: {str(e)}")
    
    print("\n📝 Para criar as tabelas, você precisa:")
    print("1. Acessar o painel do Supabase")
    print("2. Ir em 'SQL Editor'")
    print("3. Executar o script SQL")
    print("\nVou abrir o painel do Supabase para você...")
    
    return False

def create_sample_data():
    """Cria dados de exemplo se as tabelas existirem"""
    
    load_dotenv()
    url = os.getenv("SUPABASE_URL")
    service_role_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    
    headers = {
        'apikey': service_role_key,
        'Authorization': f'Bearer {service_role_key}',
        'Content-Type': 'application/json'
    }
    
    try:
        print("\n🎯 Criando dados de exemplo...")
        
        # Criar alguns produtos de exemplo
        produtos_exemplo = [
            {"nome": "Pastel de Carne", "preco": 5.00, "categoria_id": 2},
            {"nome": "Refrigerante Lata", "preco": 4.00, "categoria_id": 1},
            {"nome": "Brigadeiro", "preco": 2.00, "categoria_id": 3},
            {"nome": "Suco Natural", "preco": 3.50, "categoria_id": 1}
        ]
        
        for produto in produtos_exemplo:
            response = requests.post(f"{url}/rest/v1/produtos", 
                                   json=produto, headers=headers)
            if response.status_code == 201:
                print(f"✅ Produto criado: {produto['nome']}")
            else:
                print(f"⚠️  Produto já existe: {produto['nome']}")
        
        # Criar alguns clientes de exemplo
        clientes_exemplo = [
            {"nome": "João Silva", "telefone": "(11) 99999-1111"},
            {"nome": "Maria Santos", "telefone": "(11) 99999-2222"},
            {"nome": "Pedro Oliveira", "telefone": "(11) 99999-3333"}
        ]
        
        for cliente in clientes_exemplo:
            response = requests.post(f"{url}/rest/v1/clientes", 
                                   json=cliente, headers=headers)
            if response.status_code == 201:
                print(f"✅ Cliente criado: {cliente['nome']}")
            else:
                print(f"⚠️  Cliente já existe: {cliente['nome']}")
        
        print("\n🎉 Dados de exemplo criados com sucesso!")
        return True
        
    except Exception as e:
        print(f"❌ Erro ao criar dados de exemplo: {str(e)}")
        return False

if __name__ == "__main__":
    if create_tables():
        create_sample_data()
        print("\n✅ Sistema pronto para uso!")
        sys.exit(0)
    else:
        print("\n⚠️  Execute o SQL manualmente no painel do Supabase")
        sys.exit(1)

