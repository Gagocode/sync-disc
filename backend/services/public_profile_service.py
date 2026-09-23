from repositories import user_repository
from services.certificate_service import list_certificates
from services.disc_service import get_initial_disc_result
from services.observed_disc_service import get_observed_disc_result
from services.profile_service import calculate_initial_class
from services.project_service import list_projects


class PublicProfileError(Exception):
    pass


def get_public_profile(user_id):
    user = user_repository.find_public_by_id(user_id)
    if not user:
        raise PublicProfileError("Perfil publico nao encontrado")

    disc_result = get_initial_disc_result(user_id)
    if disc_result:
        classe = calculate_initial_class(disc_result["predominant_dimension"])
        if user.classe != classe:
            user = user_repository.update_profile_class(user_id, classe)

    projects = list_projects(user_id)
    certificates = list_certificates(user_id)

    return {
        "user": user,
        "disc_result": disc_result,
        "observed_disc_result": get_observed_disc_result(user_id),
        "projects": projects,
        "certificates": certificates,
        "indicators": {
            "projects_count": len(projects),
            "certificates_count": len(certificates),
            "xp_total": user.xp,
        },
    }
