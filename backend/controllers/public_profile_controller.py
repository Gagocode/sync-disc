from flask import Blueprint, jsonify, render_template

from services.public_profile_service import PublicProfileError, get_public_profile


public_profile_bp = Blueprint("public_profile", __name__, url_prefix="/profile")


@public_profile_bp.get("/<int:user_id>")
def public_profile_page(user_id):
    try:
        profile = get_public_profile(user_id)
    except PublicProfileError as error:
        return str(error), 404

    return render_template(
        "perfil_publico.html",
        user=profile["user"],
        disc_result=profile["disc_result"],
        projects=profile["projects"],
        certificates=profile["certificates"],
        indicators=profile["indicators"],
    )


@public_profile_bp.get("/<int:user_id>/json")
def public_profile_json(user_id):
    try:
        profile = get_public_profile(user_id)
    except PublicProfileError as error:
        return jsonify({"error": str(error)}), 404

    user = profile["user"]
    return jsonify(
        {
            "user": {
                "id": user.id,
                "nome": user.nome,
                "curso": user.curso,
                "classe": user.classe,
                "xp": user.xp,
            },
            "disc_result": profile["disc_result"],
            "projects": [project.to_dict() for project in profile["projects"]],
            "certificates": [
                certificate.to_dict() for certificate in profile["certificates"]
            ],
            "indicators": profile["indicators"],
        }
    )
