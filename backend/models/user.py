from dataclasses import dataclass


@dataclass(frozen=True)
class User:
    id: int
    nome: str
    email: str
    senha_hash: str
    curso: str | None
    created_at: str

    @classmethod
    def from_row(cls, row):
        return cls(
            id=row["id"],
            nome=row["nome"],
            email=row["email"],
            senha_hash=row["senha_hash"],
            curso=row["curso"],
            created_at=row["created_at"],
        )

    def to_public_dict(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "email": self.email,
            "curso": self.curso,
            "created_at": self.created_at,
        }
