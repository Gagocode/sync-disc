from dataclasses import dataclass


@dataclass(frozen=True)
class InitialDiscResult:
    user_id: int
    d_score: int
    i_score: int
    s_score: int
    c_score: int
    created_at: str

    @classmethod
    def from_row(cls, row):
        return cls(
            user_id=row["user_id"],
            d_score=row["d_score"],
            i_score=row["i_score"],
            s_score=row["s_score"],
            c_score=row["c_score"],
            created_at=row["created_at"],
        )
