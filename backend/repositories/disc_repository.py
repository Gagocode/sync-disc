from database.connection import get_connection
from models.disc_result import InitialDiscResult


def save_initial_result(user_id, scores):
    with get_connection() as connection:
        connection.execute(
            """
            INSERT INTO initial_disc_results
              (user_id, d_score, i_score, s_score, c_score)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(user_id) DO UPDATE SET
              d_score = excluded.d_score,
              i_score = excluded.i_score,
              s_score = excluded.s_score,
              c_score = excluded.c_score,
              created_at = CURRENT_TIMESTAMP
            """,
            (
                user_id,
                scores["D"],
                scores["I"],
                scores["S"],
                scores["C"],
            ),
        )
        connection.commit()
        return find_initial_result_by_user_id(user_id)


def find_initial_result_by_user_id(user_id):
    with get_connection() as connection:
        row = connection.execute(
            """
            SELECT user_id, d_score, i_score, s_score, c_score, created_at
            FROM initial_disc_results
            WHERE user_id = ?
            """,
            (user_id,),
        ).fetchone()
        return InitialDiscResult.from_row(row) if row else None
