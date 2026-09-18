import sqlite3
from pathlib import Path


DATABASE_PATH = Path(__file__).resolve().parent / "sync_disc.sqlite3"


def get_connection(database_path=DATABASE_PATH):
    connection = sqlite3.connect(database_path)
    connection.row_factory = sqlite3.Row
    return connection
