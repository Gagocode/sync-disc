from repositories import mission_repository


FIXED_MISSIONS = [
    {
        "key": "complete_profile",
        "nome": "Completar Perfil",
        "descricao": "Revise seus dados iniciais de perfil.",
        "xp_recompensa": 50,
    },
    {
        "key": "complete_disc_quiz",
        "nome": "Realizar Quiz DISC",
        "descricao": "Responda o quiz narrativo para gerar seu DISC Inicial.",
        "xp_recompensa": 100,
    },
    {
        "key": "first_project",
        "nome": "Adicionar Primeiro Projeto",
        "descricao": "Registre seu primeiro projeto quando essa area estiver disponivel.",
        "xp_recompensa": 150,
    },
    {
        "key": "first_certificate",
        "nome": "Adicionar Primeiro Certificado",
        "descricao": "Registre seu primeiro certificado quando essa area estiver disponivel.",
        "xp_recompensa": 150,
    },
]


class MissionError(Exception):
    pass


def create_initial_missions_for_user(user_id):
    return mission_repository.create_user_missions(user_id, FIXED_MISSIONS)


def get_user_missions(user_id):
    missions = mission_repository.list_by_user_id(user_id)
    if not missions:
        missions = create_initial_missions_for_user(user_id)
    return missions


def complete_user_mission(user_id, mission_id):
    mission = mission_repository.find_by_id_for_user(mission_id, user_id)
    if not mission:
        raise MissionError("Missao nao encontrada")

    if mission.status == "Concluida":
        return mission

    return mission_repository.complete_mission(mission_id, user_id)
