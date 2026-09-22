from database.connection import get_connection
from models.mission import Mission


def create_user_missions(user_id, missions):
    with get_connection() as connection:
        connection.executemany(
            """
            INSERT OR IGNORE INTO user_missions
              (user_id, mission_key, nome, descricao, status, xp_recompensa)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            [
                (
                    user_id,
                    mission["key"],
                    mission["nome"],
                    mission["descricao"],
                    mission["status"],
                    mission["xp_recompensa"],
                )
                for mission in missions
            ],
        )
        connection.commit()
        return list_by_user_id(user_id)


def list_by_user_id(user_id):
    with get_connection() as connection:
        rows = connection.execute(
            """
            SELECT id, user_id, mission_key, nome, descricao, status,
                   xp_recompensa, data_conclusao, created_at
            FROM user_missions
            WHERE user_id = ?
            ORDER BY id
            """,
            (user_id,),
        ).fetchall()
        return [Mission.from_row(row) for row in rows]


def find_by_id_for_user(mission_id, user_id):
    with get_connection() as connection:
        row = connection.execute(
            """
            SELECT id, user_id, mission_key, nome, descricao, status,
                   xp_recompensa, data_conclusao, created_at
            FROM user_missions
            WHERE id = ? AND user_id = ?
            """,
            (mission_id, user_id),
        ).fetchone()
        return Mission.from_row(row) if row else None


def find_by_key_for_user(mission_key, user_id):
    with get_connection() as connection:
        row = connection.execute(
            """
            SELECT id, user_id, mission_key, nome, descricao, status,
                   xp_recompensa, data_conclusao, created_at
            FROM user_missions
            WHERE mission_key = ? AND user_id = ?
            """,
            (mission_key, user_id),
        ).fetchone()
        return Mission.from_row(row) if row else None


def complete_mission(mission_id, user_id):
    with get_connection() as connection:
        row = connection.execute(
            """
            SELECT id, user_id, mission_key, nome, descricao, status,
                   xp_recompensa, data_conclusao, created_at
            FROM user_missions
            WHERE id = ? AND user_id = ?
            """,
            (mission_id, user_id),
        ).fetchone()
        if not row:
            return None

        mission = Mission.from_row(row)
        if mission.status == "Concluida":
            return mission

        connection.execute(
            """
            UPDATE user_missions
            SET status = 'Concluida',
                data_conclusao = CURRENT_TIMESTAMP
            WHERE id = ? AND user_id = ?
            """,
            (mission_id, user_id),
        )
        connection.execute(
            """
            UPDATE users
            SET xp = xp + ?
            WHERE id = ?
            """,
            (mission.xp_recompensa, user_id),
        )
        connection.commit()

    return find_by_id_for_user(mission_id, user_id)


def has_available_mission(user_id):
    with get_connection() as connection:
        row = connection.execute(
            """
            SELECT 1
            FROM user_missions
            WHERE user_id = ? AND status = 'Pendente'
            LIMIT 1
            """,
            (user_id,),
        ).fetchone()
        return row is not None


def activate_next_pending_mission(user_id):
    with get_connection() as connection:
        row = connection.execute(
            """
            SELECT id
            FROM user_missions
            WHERE user_id = ? AND status = 'Bloqueada'
            ORDER BY id
            LIMIT 1
            """,
            (user_id,),
        ).fetchone()
        if not row:
            return None

        connection.execute(
            """
            UPDATE user_missions
            SET status = 'Pendente'
            WHERE id = ?
            """,
            (row["id"],),
        )
        connection.commit()
        return find_by_id_for_user(row["id"], user_id)
