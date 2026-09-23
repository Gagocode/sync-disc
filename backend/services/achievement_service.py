from repositories import achievement_repository
from repositories import certificate_repository
from repositories import disc_repository
from repositories import mission_repository
from repositories import project_repository


ACHIEVEMENT_CATALOG = [
    {
        "key": "primeiro_passo",
        "nome": "Primeiro Passo",
        "descricao": "Concluiu o DISC Inicial.",
    },
    {
        "key": "construtor",
        "nome": "Construtor",
        "descricao": "Cadastrou o primeiro projeto.",
    },
    {
        "key": "desenvolvendo_habilidades",
        "nome": "Desenvolvendo Habilidades",
        "descricao": "Cadastrou o primeiro certificado.",
    },
    {
        "key": "explorador",
        "nome": "Explorador",
        "descricao": "Concluiu 3 missoes.",
    },
    {
        "key": "curriculo_vivo",
        "nome": "Curriculo Vivo",
        "descricao": "Possui pelo menos 3 projetos e 3 certificados.",
    },
]


def get_user_achievements(user_id):
    evaluate_user_achievements(user_id)
    achievements = achievement_repository.list_unlocked_by_user_id(user_id)
    return {
        "unlocked": achievements,
        "unlocked_count": len(achievements),
        "total_count": achievement_repository.count_catalog(),
    }


def evaluate_user_achievements(user_id):
    _ensure_catalog()

    if disc_repository.find_initial_result_by_user_id(user_id):
        achievement_repository.unlock_for_user(user_id, "primeiro_passo")

    project_count = project_repository.count_by_user_id(user_id)
    if project_count >= 1:
        achievement_repository.unlock_for_user(user_id, "construtor")

    certificate_count = certificate_repository.count_by_user_id(user_id)
    if certificate_count >= 1:
        achievement_repository.unlock_for_user(user_id, "desenvolvendo_habilidades")

    completed_missions = [
        mission
        for mission in mission_repository.list_by_user_id(user_id)
        if mission.status == "Concluida"
    ]
    if len(completed_missions) >= 3:
        achievement_repository.unlock_for_user(user_id, "explorador")

    if project_count >= 3 and certificate_count >= 3:
        achievement_repository.unlock_for_user(user_id, "curriculo_vivo")


def _ensure_catalog():
    achievement_repository.sync_catalog(ACHIEVEMENT_CATALOG)
