from pathlib import Path

from flask import Flask, jsonify


BASE_DIR = Path(__file__).resolve().parent
DATABASE_PATH = BASE_DIR / "database" / "sync_disc.sqlite3"
UPLOAD_FOLDER = BASE_DIR / "uploads"


def create_app():
    app = Flask(__name__)
    app.config["DATABASE_PATH"] = DATABASE_PATH
    app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

    @app.get("/")
    def health_check():
        return jsonify(
            {
                "app": "Sync Disc",
                "status": "backend initialized",
            }
        )

    return app


app = create_app()


if __name__ == "__main__":
    app.run(debug=True)
