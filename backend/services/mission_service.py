from repositories import mission_repository


FIXED_MISSIONS = [
    {
        "key": "complete_disc_quiz",
        "nome": "Realizar Quiz DISC",
        "descricao": "Responda o quiz narrativo para gerar seu DISC Inicial.",
        "xp_recompensa": 100,
    },
    {
        "key": "complete_profile",
        "nome": "Completar Perfil",
        "descricao": "Acesse o perfil inicial apos concluir o DISC.",
        "xp_recompensa": 50,
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
    {
        "key": "second_project",
        "nome": "Adicionar Segundo Projeto",
        "descricao": "Registre seu segundo projeto no Curriculo Vivo.",
        "xp_recompensa": 150,
    },
    {
        "key": "second_certificate",
        "nome": "Adicionar Segundo Certificado",
        "descricao": "Registre seu segundo certificado no Curriculo Vivo.",
        "xp_recompensa": 150,
    },
    {
        "key": "continue_evolution",
        "nome": "Continuar Evolucao",
        "descricao": "Continue adicionando evidencias ao Curriculo Vivo.",
        "xp_recompensa": 0,
    },
]


def create_initial_missions_for_user(user_id):
    has_available = mission_repository.has_available_mission(user_id)
    missions = []

    for index, mission in enumerate(FIXED_MISSIONS):
        missions.append(
            {
                **mission,
                "status": "Pendente" if index == 0 and not has_available else "Bloqueada",
            }
        )

    mission_repository.create_user_missions(user_id, missions)
    ensure_available_mission(user_id)
    return mission_repository.list_by_user_id(user_id)


def get_user_missions(user_id):
    missions = mission_repository.list_by_user_id(user_id)
    if len(missions) < len(FIXED_MISSIONS):
        create_initial_missions_for_user(user_id)
    ensure_available_mission(user_id)
    return mission_repository.list_by_user_id(user_id)


def complete_user_mission_by_key(user_id, mission_key):
    mission = mission_repository.find_by_key_for_user(mission_key, user_id)
    if not mission:
        create_initial_missions_for_user(user_id)
        mission = mission_repository.find_by_key_for_user(mission_key, user_id)

    if not mission:
        raise MissionError("Missao nao encontrada")

    if mission.status == "Concluida":
        return mission

    completed_mission = mission_repository.complete_mission(mission.id, user_id)
    ensure_available_mission(user_id)
    return completed_mission


def ensure_available_mission(user_id):
    if not mission_repository.has_available_mission(user_id):
        mission_repository.activate_next_pending_mission(user_id)
