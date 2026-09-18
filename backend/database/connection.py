import sqlite3
from pathlib import Path


DATABASE_PATH = Path(__file__).resolve().parent / "sync_disc.sqlite3"
SCHEMA_PATH = Path(__file__).resolve().parent / "schema.sql"


def get_connection(database_path=DATABASE_PATH):
    database_path.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(str(database_path.resolve()))
    connection.row_factory = sqlite3.Row
    return connection


def init_database(database_path=DATABASE_PATH):
    with get_connection(database_path) as connection:
        connection.executescript(SCHEMA_PATH.read_text(encoding="utf-8"))
        connection.commit()
