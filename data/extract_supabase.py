import psycopg2
import os
import json
from datetime import datetime

# Configuration
DB_HOST = "aws-1-ap-northeast-2.pooler.supabase.com"
DB_PORT = 5432
DB_NAME = "postgres"
DB_USER = "postgres.mbvvsdlixtabnwvikqom"
DB_PASS = "r4T61bspuIFUvq43"

OUTPUT_DIR = "exports"

import urllib.parse

def connect():
    # Use DSN to avoid @ character issues in password
    password_encoded = urllib.parse.quote(DB_PASS, safe='')
    dsn = f"postgresql://{DB_USER}:{password_encoded}@{DB_HOST}:{DB_PORT}/{DB_NAME}?sslmode=require"
    return psycopg2.connect(dsn)

def ensure_dirs():
    os.makedirs(f"{OUTPUT_DIR}/schema", exist_ok=True)
    os.makedirs(f"{OUTPUT_DIR}/data", exist_ok=True)
    os.makedirs(f"{OUTPUT_DIR}/json", exist_ok=True)

def escape_sql(value):
    if value is None:
        return "NULL"
    if isinstance(value, bool):
        return "TRUE" if value else "FALSE"
    if isinstance(value, (int, float)):
        return str(value)
    if isinstance(value, (dict, list)):
        return escape_sql(json.dumps(value))
    if isinstance(value, bytes):
        return "\\x" + value.hex()
    # String escape
    return "'" + str(value).replace("'", "''").replace("\\", "\\\\") + "'"

def quote_ident(name):
    return '"' + name.replace('"', '""') + '"'

def get_schemas(conn):
    cur = conn.cursor()
    cur.execute("""
        SELECT schema_name FROM information_schema.schemata
        WHERE schema_name NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
        AND schema_name NOT LIKE 'pg_%'
        ORDER BY schema_name
    """)
    return [row[0] for row in cur.fetchall()]

def get_tables(conn, schema):
    cur = conn.cursor()
    cur.execute("""
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = %s AND table_type = 'BASE TABLE'
        ORDER BY table_name
    """, (schema,))
    return [row[0] for row in cur.fetchall()]

def get_table_columns(conn, schema, table):
    cur = conn.cursor()
    cur.execute("""
        SELECT column_name, data_type, is_nullable, column_default, character_maximum_length
        FROM information_schema.columns
        WHERE table_schema = %s AND table_name = %s
        ORDER BY ordinal_position
    """, (schema, table))
    return cur.fetchall()

def get_primary_keys(conn, schema, table):
    cur = conn.cursor()
    cur.execute("""
        SELECT kcu.column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        WHERE tc.constraint_type = 'PRIMARY KEY'
          AND tc.table_schema = %s AND tc.table_name = %s
        ORDER BY kcu.ordinal_position
    """, (schema, table))
    return [row[0] for row in cur.fetchall()]

def get_foreign_keys(conn, schema, table):
    cur = conn.cursor()
    cur.execute("""
        SELECT
            tc.constraint_name,
            kcu.column_name,
            ccu.table_schema AS foreign_table_schema,
            ccu.table_name AS foreign_table_name,
            ccu.column_name AS foreign_column_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_schema = %s AND tc.table_name = %s
    """, (schema, table))
    return cur.fetchall()

def get_indexes(conn, schema, table):
    cur = conn.cursor()
    cur.execute("""
        SELECT indexname, indexdef
        FROM pg_indexes
        WHERE schemaname = %s AND tablename = %s
    """, (schema, table))
    return cur.fetchall()

def get_unique_constraints(conn, schema, table):
    cur = conn.cursor()
    cur.execute("""
        SELECT tc.constraint_name,
               string_agg(kcu.column_name, ', ' ORDER BY kcu.ordinal_position)
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        WHERE tc.constraint_type = 'UNIQUE'
          AND tc.table_schema = %s AND tc.table_name = %s
        GROUP BY tc.constraint_name
    """, (schema, table))
    return cur.fetchall()

def get_check_constraints(conn, schema, table):
    cur = conn.cursor()
    cur.execute("""
        SELECT conname, pg_get_constraintdef(oid)
        FROM pg_constraint
        WHERE conrelid = (quote_ident(%s) || '.' || quote_ident(%s))::regclass
          AND contype = 'c'
    """, (schema, table))
    return cur.fetchall()

def get_functions(conn):
    cur = conn.cursor()
    cur.execute("""
        SELECT 
            p.proname,
            pg_get_function_identity_arguments(p.oid) AS args,
            pg_get_functiondef(p.oid) AS def
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname NOT IN ('pg_catalog', 'information_schema')
        AND p.prokind = 'f'
        ORDER BY n.nspname, p.proname
    """)
    return cur.fetchall()

def get_triggers(conn):
    cur = conn.cursor()
    cur.execute("""
        SELECT 
            tgname,
            tgrelid::regclass::text,
            pg_get_triggerdef(oid)
        FROM pg_trigger
        WHERE NOT tgisinternal
        ORDER BY tgrelid::regclass::text, tgname
    """)
    return cur.fetchall()

def get_views(conn):
    cur = conn.cursor()
    cur.execute("""
        SELECT table_schema, table_name, view_definition
        FROM information_schema.views
        WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
        ORDER BY table_schema, table_name
    """)
    return cur.fetchall()

def get_policies(conn):
    cur = conn.cursor()
    cur.execute("""
        SELECT schemaname, tablename, policyname, permissive, roles,
               cmd, qual, with_check
        FROM pg_policies
        ORDER BY schemaname, tablename, policyname
    """)
    return cur.fetchall()

def get_extensions(conn):
    cur = conn.cursor()
    cur.execute("""
        SELECT extname, extversion
        FROM pg_extension
        WHERE extname NOT IN ('plpgsql')
        ORDER BY extname
    """)
    return cur.fetchall()

def get_sequences(conn):
    cur = conn.cursor()
    cur.execute("""
        SELECT sequence_name, start_value, minimum_value, maximum_value, increment
        FROM information_schema.sequences
        WHERE sequence_schema NOT IN ('pg_catalog', 'information_schema')
        ORDER BY sequence_schema, sequence_name
    """)
    return cur.fetchall()

def get_enums(conn):
    cur = conn.cursor()
    cur.execute("""
        SELECT n.nspname AS schema, t.typname AS name,
               array_agg(e.enumlabel ORDER BY e.enumsortorder) AS values
        FROM pg_type t
        JOIN pg_enum e ON t.oid = e.enumtypid
        JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
        WHERE n.nspname NOT IN ('pg_catalog', 'information_schema')
        GROUP BY n.nspname, t.typname
        ORDER BY n.nspname, t.typname
    """)
    return cur.fetchall()

def generate_create_table(conn, schema, table):
    columns = get_table_columns(conn, schema, table)
    pks = get_primary_keys(conn, schema, table)
    fks = get_foreign_keys(conn, schema, table)
    uniques = get_unique_constraints(conn, schema, table)
    checks = get_check_constraints(conn, schema, table)
    
    lines = []
    for col_name, data_type, is_nullable, default, max_len in columns:
        col_def = f"    {quote_ident(col_name)} {data_type}"
        if max_len and data_type in ('character varying', 'character'):
            col_def = f"    {quote_ident(col_name)} {data_type}({max_len})"
        if default:
            col_def += f" DEFAULT {default}"
        if is_nullable == 'NO':
            col_def += " NOT NULL"
        lines.append(col_def)
    
    if pks:
        lines.append(f"    PRIMARY KEY ({', '.join(quote_ident(c) for c in pks)})")
    
    for fk_name, col, ft_schema, ft_table, ft_col in fks:
        lines.append(f"    CONSTRAINT {quote_ident(fk_name)} FOREIGN KEY ({quote_ident(col)}) REFERENCES {quote_ident(ft_schema)}.{quote_ident(ft_table)}({quote_ident(ft_col)})")
    
    for uc_name, uc_cols in uniques:
        lines.append(f"    CONSTRAINT {quote_ident(uc_name)} UNIQUE ({', '.join(quote_ident(c.strip()) for c in uc_cols.split(','))})")
    
    for cc_name, cc_def in checks:
        lines.append(f"    CONSTRAINT {quote_ident(cc_name)} {cc_def}")
    
    create_stmt = f"CREATE TABLE {quote_ident(schema)}.{quote_ident(table)} (\n" + ",\n".join(lines) + "\n);\n"
    return create_stmt

def extract_schema(conn):
    print("Extracting schema...")
    schemas = get_schemas(conn)
    
    # Extensions
    with open(f"{OUTPUT_DIR}/schema/extensions.sql", 'w') as f:
        f.write("-- Extensions\n")
        for ext_name, ext_version in get_extensions(conn):
            f.write(f"CREATE EXTENSION IF NOT EXISTS {quote_ident(ext_name)} WITH SCHEMA public;\n")
            f.write(f"ALTER EXTENSION {quote_ident(ext_name)} UPDATE TO '{ext_version}';\n")
    
    # Enums
    with open(f"{OUTPUT_DIR}/schema/enums.sql", 'w') as f:
        f.write("-- Enums\n")
        for schema, name, values in get_enums(conn):
            f.write(f"CREATE TYPE {quote_ident(schema)}.{quote_ident(name)} AS ENUM ({', '.join(escape_sql(v) for v in values)});\n")
    
    # Sequences
    with open(f"{OUTPUT_DIR}/schema/sequences.sql", 'w') as f:
        f.write("-- Sequences\n")
        for name, start, minv, maxv, inc in get_sequences(conn):
            f.write(f"CREATE SEQUENCE IF NOT EXISTS {quote_ident(name)} START WITH {start} INCREMENT BY {inc} MINVALUE {minv} MAXVALUE {maxv};\n")
    
    # Tables
    with open(f"{OUTPUT_DIR}/schema/tables.sql", 'w') as f:
        f.write("-- Tables\n")
        for schema in schemas:
            tables = get_tables(conn, schema)
            for table in tables:
                f.write(f"-- Table: {schema}.{table}\n")
                f.write(generate_create_table(conn, schema, table))
                f.write("\n")
    
    # Indexes
    with open(f"{OUTPUT_DIR}/schema/indexes.sql", 'w') as f:
        f.write("-- Indexes\n")
        for schema in schemas:
            tables = get_tables(conn, schema)
            for table in tables:
                for idx_name, idx_def in get_indexes(conn, schema, table):
                    if "UNIQUE" not in idx_def.upper():
                        f.write(idx_def + ";\n")
    
    # Functions
    with open(f"{OUTPUT_DIR}/schema/functions.sql", 'w') as f:
        f.write("-- Functions\n")
        for name, args, defn in get_functions(conn):
            f.write(defn + ";\n\n")
    
    # Views
    with open(f"{OUTPUT_DIR}/schema/views.sql", 'w') as f:
        f.write("-- Views\n")
        for schema, name, defn in get_views(conn):
            if defn:
                f.write(f"CREATE OR REPLACE VIEW {quote_ident(schema)}.{quote_ident(name)} AS\n{defn};\n\n")
    
    # Triggers
    with open(f"{OUTPUT_DIR}/schema/triggers.sql", 'w') as f:
        f.write("-- Triggers\n")
        for name, table, defn in get_triggers(conn):
            f.write(defn + ";\n\n")
    
    # Policies (RLS)
    with open(f"{OUTPUT_DIR}/schema/policies.sql", 'w') as f:
        f.write("-- Row Level Security Policies\n")
        for schema, table, policy, permissive, roles, cmd, qual, with_check in get_policies(conn):
            f.write(f"-- Enable RLS on {schema}.{table}\n")
            f.write(f"ALTER TABLE {quote_ident(schema)}.{quote_ident(table)} ENABLE ROW LEVEL SECURITY;\n")
            f.write(f"CREATE POLICY {quote_ident(policy)} ON {quote_ident(schema)}.{quote_ident(table)}\n")
            f.write(f"    FOR {cmd}\n")
            f.write(f"    TO {roles}\n")
            if qual:
                f.write(f"    USING ({qual})\n")
            if with_check:
                f.write(f"    WITH CHECK ({with_check})\n")
            f.write(";\n\n")
    
    print("Schema extraction complete!")

def extract_data(conn):
    print("Extracting data...")
    schemas = get_schemas(conn)
    
    for schema in schemas:
        tables = get_tables(conn, schema)
        for table in tables:
            print(f"  Exporting {schema}.{table}...")
            cur = conn.cursor()
            cur.execute(f'SELECT * FROM {quote_ident(schema)}.{quote_ident(table)}')
            rows = cur.fetchall()
            
            if not rows:
                continue
            
            col_names = [desc[0] for desc in cur.description]
            
            # SQL INSERTs
            sql_file = f"{OUTPUT_DIR}/data/{schema}_{table}.sql"
            with open(sql_file, 'w', encoding='utf-8') as f:
                f.write(f"-- Data for {schema}.{table}\n")
                for row in rows:
                    values = [escape_sql(v) for v in row]
                    cols = ', '.join(quote_ident(c) for c in col_names)
                    vals = ', '.join(values)
                    f.write(f"INSERT INTO {quote_ident(schema)}.{quote_ident(table)} ({cols}) VALUES ({vals});\n")
            
            # JSON backup
            json_file = f"{OUTPUT_DIR}/json/{schema}_{table}.json"
            with open(json_file, 'w', encoding='utf-8') as f:
                data = [dict(zip(col_names, row)) for row in rows]
                # Convert non-serializable types
                for item in data:
                    for k, v in item.items():
                        if isinstance(v, datetime):
                            item[k] = v.isoformat()
                        elif isinstance(v, bytes):
                            item[k] = v.hex()
                json.dump(data, f, indent=2, default=str)
    
    print("Data extraction complete!")

def generate_metadata(conn):
    print("Generating metadata...")
    schemas = get_schemas(conn)
    metadata = {
        "exported_at": datetime.now().isoformat(),
        "source": {
            "host": DB_HOST,
            "database": DB_NAME,
            "user": DB_USER
        },
        "schemas": {}
    }
    
    for schema in schemas:
        tables = get_tables(conn, schema)
        metadata["schemas"][schema] = {
            "tables": {},
            "table_count": len(tables)
        }
        for table in tables:
            cur = conn.cursor()
            cur.execute(f"SELECT COUNT(*) FROM {quote_ident(schema)}.{quote_ident(table)}")
            count = cur.fetchone()[0]
            columns = get_table_columns(conn, schema, table)
            metadata["schemas"][schema]["tables"][table] = {
                "row_count": count,
                "columns": [{"name": c[0], "type": c[1]} for c in columns]
            }
    
    with open(f"{OUTPUT_DIR}/metadata.json", 'w') as f:
        json.dump(metadata, f, indent=2)
    print("Metadata generated!")

def main():
    print("Starting Supabase extraction...")
    ensure_dirs()
    conn = connect()
    print("Connected to database.")
    
    extract_schema(conn)
    extract_data(conn)
    generate_metadata(conn)
    
    conn.close()
    print(f"\nDone! All exports saved to ./{OUTPUT_DIR}/")
    print("Files:")
    print(f"  - {OUTPUT_DIR}/schema/      (DDL - structure)")
    print(f"  - {OUTPUT_DIR}/data/        (INSERT statements)")
    print(f"  - {OUTPUT_DIR}/json/        (JSON backups)")
    print(f"  - {OUTPUT_DIR}/metadata.json (summary)")

if __name__ == "__main__":
    main()
