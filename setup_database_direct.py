#!/usr/bin/env python3
"""
Script alternativo para configurar o banco de dados do SG - Servir e Gerir
Usa conexão direta com PostgreSQL do Supabase
"""

import os
import sys
import psycopg2
from dotenv import load_dotenv

def setup_database():
    """Configura o banco de dados executando o script SQL via psycopg2"""
    
    # Carregar variáveis de ambiente
    load_dotenv()
    
    # Para Supabase, a string de conexão geralmente é:
    # postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
    
    # Vamos tentar diferentes abordagens para conectar
    project_ref = "ncrwipqzshwjbvxgogkp"
    
    # Possíveis strings de conexão (vamos tentar diferentes senhas)
    connection_strings = [
        f"postgresql://postgres:Hi3Imz8kVoevWy+IEhT/UV8y4aQqkMNCYKs3PrNuI2lDnzSJZsj4FtrI7vN/sIqTaC8A/rQwGz8Ka4cqXQEosA==@db.{project_ref}.supabase.co:5432/postgres",
        f"postgresql://postgres@db.{project_ref}.supabase.co:5432/postgres",
    ]
    
    print("🚀 SG - Servir e Gerir - Configuração do Banco de Dados")
    print("=" * 60)
    
    connection = None
    
    for i, conn_str in enumerate(connection_strings, 1):
        try:
            print(f"🔗 Tentativa {i}: Conectando ao PostgreSQL do Supabase...")
            connection = psycopg2.connect(conn_str)
            print("✅ Conexão estabelecida com sucesso!")
            break
        except Exception as e:
            print(f"❌ Tentativa {i} falhou: {str(e)}")
            if i < len(connection_strings):
                print("🔄 Tentando próxima configuração...")
    
    if not connection:
        print("\n❌ Não foi possível conectar ao banco de dados.")
        print("📝 Vamos usar uma abordagem alternativa - executar o SQL manualmente.")
        print("\n📋 Instruções manuais:")
        print("1. Acesse: https://supabase.com/dashboard/project/ncrwipqzshwjbvxgogkp")
        print("2. Vá em 'SQL Editor'")
        print("3. Cole e execute o conteúdo do arquivo 'database_schema.sql'")
        return False
    
    try:
        cursor = connection.cursor()
        
        # Ler o script SQL
        with open('database_schema.sql', 'r', encoding='utf-8') as file:
            sql_script = file.read()
        
        print("📋 Executando script de criação do banco de dados...")
        
        # Executar o script completo
        cursor.execute(sql_script)
        connection.commit()
        
        print("✅ Script executado com sucesso!")
        
        # Testar a conexão fazendo uma consulta simples
        print("\n🧪 Testando tabelas criadas...")
        
        cursor.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;")
        tables = cursor.fetchall()
        
        print(f"✅ Tabelas criadas: {len(tables)}")
        for table in tables:
            print(f"   📋 {table[0]}")
        
        # Verificar usuário padrão
        cursor.execute("SELECT nome, email, nivel_acesso FROM usuarios LIMIT 1;")
        user = cursor.fetchone()
        
        if user:
            print(f"\n👤 Usuário padrão criado: {user[0]} ({user[1]}) - {user[2]}")
        
        print("\n🎉 Banco de dados configurado com sucesso!")
        print("\n📋 Próximos passos:")
        print("   1. Execute: python src/main.py")
        print("   2. Acesse: http://localhost:5000")
        print("   3. Login padrão: admin@adcs.com / admin123")
        
        return True
        
    except Exception as e:
        print(f"❌ Erro ao executar script SQL: {str(e)}")
        return False
    
    finally:
        if connection:
            connection.close()

if __name__ == "__main__":
    if setup_database():
        sys.exit(0)
    else:
        sys.exit(1)

