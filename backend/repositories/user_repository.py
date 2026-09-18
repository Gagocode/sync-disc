from database.connection import get_connection
from models.user import User


def create_user(nome, email, senha_hash, curso=None):
    with get_connection() as connection:
        cursor = connection.execute(
            """
            INSERT INTO users (nome, email, senha_hash, curso)
            VALUES (?, ?, ?, ?)
            """,
            (nome, email, senha_hash, curso),
        )
        connection.commit()
        return find_by_id(cursor.lastrowid)


def find_by_email(email):
    with get_connection() as connection:
        row = connection.execute(
            """
            SELECT id, nome, email, senha_hash, curso, created_at
            FROM users
            WHERE email = ?
            """,
            (email,),
        ).fetchone()
        return User.from_row(row) if row else None


def find_by_id(user_id):
    with get_connection() as connection:
        row = connection.execute(
            """
            SELECT id, nome, email, senha_hash, curso, created_at
            FROM users
            WHERE id = ?
            """,
            (user_id,),
        ).fetchone()
        return User.from_row(row) if row else None
