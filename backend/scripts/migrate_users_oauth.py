import sqlite3
import os
import sys

def migrate_users_table(db_path: str):
    if not os.path.exists(db_path):
        print(f"Database not found at: {db_path}")
        return

    print(f"Applying migration to: {db_path}")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # 1. Inspect existing table structure
    cursor.execute("PRAGMA table_info(users)")
    table_info = cursor.fetchall()
    print("--- BEFORE MIGRATION: PRAGMA table_info(users) ---")
    for col in table_info:
        print(col)

    # Check if hashed_password is NOT NULL (col[3] == 1)
    hashed_pw_not_null = any(col[1] == "hashed_password" and col[3] == 1 for col in table_info)
    
    # 2. Count existing users
    cursor.execute("SELECT COUNT(*) FROM users")
    user_count_before = cursor.fetchone()[0]
    print(f"Existing user records before migration: {user_count_before}")

    if hashed_pw_not_null:
        print("hashed_password has NOT NULL constraint. Performing table rebuild to make it nullable...")
        
        cursor.execute("PRAGMA foreign_keys=OFF;")
        cursor.execute("BEGIN TRANSACTION;")

        # Create temporary table with exact nullable schema
        cursor.execute("""
            CREATE TABLE users_new (
                id CHAR(32) NOT NULL,
                email VARCHAR(255) NOT NULL,
                hashed_password VARCHAR(255),
                github_id VARCHAR(100),
                github_username VARCHAR(100),
                github_avatar_url VARCHAR(500),
                github_access_token VARCHAR(500),
                is_active BOOLEAN NOT NULL,
                created_at DATETIME NOT NULL,
                PRIMARY KEY (id)
            );
        """)

        # Copy data from users to users_new
        cursor.execute("""
            INSERT INTO users_new (id, email, hashed_password, github_id, github_username, github_avatar_url, github_access_token, is_active, created_at)
            SELECT id, email, hashed_password, github_id, github_username, github_avatar_url, github_access_token, is_active, created_at
            FROM users;
        """)

        # Drop old table and rename new table
        cursor.execute("DROP TABLE users;")
        cursor.execute("ALTER TABLE users_new RENAME TO users;")

        # Recreate indexes
        cursor.execute("CREATE UNIQUE INDEX IF NOT EXISTS ix_users_email ON users (email);")
        cursor.execute("CREATE UNIQUE INDEX IF NOT EXISTS ix_users_github_id ON users (github_id);")

        cursor.execute("COMMIT;")
        cursor.execute("PRAGMA foreign_keys=ON;")
        print("Table rebuild complete.")
    else:
        print("hashed_password is already nullable. No rebuild needed.")

    # Verify after migration
    cursor.execute("PRAGMA table_info(users)")
    table_info_after = cursor.fetchall()
    print("--- AFTER MIGRATION: PRAGMA table_info(users) ---")
    for col in table_info_after:
        print(col)

    cursor.execute("PRAGMA index_list(users)")
    indexes_after = cursor.fetchall()
    print("--- AFTER MIGRATION: PRAGMA index_list(users) ---")
    for idx in indexes_after:
        print(idx)

    cursor.execute("SELECT COUNT(*) FROM users")
    user_count_after = cursor.fetchone()[0]
    print(f"Existing user records after migration: {user_count_after}")

    assert user_count_before == user_count_after, f"User count mismatch: {user_count_before} vs {user_count_after}"

    conn.close()
    print("Migration verified and finished successfully.")

if __name__ == "__main__":
    project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    db_file = os.path.join(project_root, "data", "dev.db")
    migrate_users_table(db_file)
