#!/usr/bin/env python3
"""
Script para configurar o banco de dados do SG - Servir e Gerir no Supabase
"""

import os
import sys
from dotenv import load_dotenv
from supabase import create_client, Client

def setup_database():
    """Configura o banco de dados executando o script SQL"""
    
    # Carregar variáveis de ambiente
    load_dotenv()
    
    # Configurações do Supabase
    url = os.getenv("SUPABASE_URL")
    service_role_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    
    if not url or not service_role_key:
        print("❌ Erro: Variáveis de ambiente SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórias")
        return False
    
    try:
        # Criar cliente Supabase com service role (admin)
        supabase: Client = create_client(url, service_role_key)
        
        print("🔗 Conectando ao Supabase...")
        
        # Ler o script SQL
        with open('database_schema.sql', 'r', encoding='utf-8') as file:
            sql_script = file.read()
        
        print("📋 Executando script de criação do banco de dados...")
        
        # Dividir o script em comandos individuais
        commands = [cmd.strip() for cmd in sql_script.split(';') if cmd.strip()]
        
        success_count = 0
        error_count = 0
        
        for i, command in enumerate(commands, 1):
            if command.strip():
                try:
                    # Executar comando SQL via RPC (Remote Procedure Call)
                    result = supabase.rpc('exec_sql', {'sql': command}).execute()
                    success_count += 1
                    print(f"✅ Comando {i}/{len(commands)} executado com sucesso")
                except Exception as e:
                    error_count += 1
                    print(f"⚠️  Comando {i}/{len(commands)} falhou: {str(e)}")
                    # Continuar mesmo com erros (algumas tabelas podem já existir)
        
        print(f"\n📊 Resumo da execução:")
        print(f"   ✅ Comandos executados com sucesso: {success_count}")
        print(f"   ⚠️  Comandos com erro/aviso: {error_count}")
        print(f"   📝 Total de comandos: {len(commands)}")
        
        # Testar a conexão fazendo uma consulta simples
        print("\n🧪 Testando conexão com o banco...")
        test_result = supabase.table('usuarios').select('id, nome, email, nivel_acesso').limit(5).execute()
        
        if test_result.data:
            print(f"✅ Conexão testada com sucesso! Encontrados {len(test_result.data)} usuários.")
            for user in test_result.data:
                print(f"   👤 {user['nome']} ({user['email']}) - {user['nivel_acesso']}")
        else:
            print("⚠️  Nenhum usuário encontrado, mas conexão está funcionando.")
        
        print("\n🎉 Banco de dados configurado com sucesso!")
        print("\n📋 Próximos passos:")
        print("   1. Execute: python src/main.py")
        print("   2. Acesse: http://localhost:5000")
        print("   3. Login padrão: admin@adcs.com / admin123")
        
        return True
        
    except Exception as e:
        print(f"❌ Erro ao configurar banco de dados: {str(e)}")
        return False

if __name__ == "__main__":
    print("🚀 SG - Servir e Gerir - Configuração do Banco de Dados")
    print("=" * 60)
    
    if setup_database():
        sys.exit(0)
    else:
        sys.exit(1)

