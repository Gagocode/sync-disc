from flask import Blueprint, jsonify, render_template

from controllers.auth_controller import login_required
from services.profile_service import get_profile


profile_bp = Blueprint("profile", __name__, url_prefix="/perfil")


@profile_bp.get("/")
@login_required
def profile_page(user):
    profile = get_profile(user.id)
    return render_template(
        "perfil.html",
        user=profile["user"],
        disc_result=profile["disc_result"],
        projects=profile["projects"],
        certificates=profile["certificates"],
    )


@profile_bp.get("/json")
@login_required
def profile_json(user):
    profile = get_profile(user.id)
    current_user = profile["user"]
    disc_result = profile["disc_result"]
    return jsonify(
        {
            "user": current_user.to_public_dict(),
            "disc_result": disc_result,
            "projects": [project.to_dict() for project in profile["projects"]],
            "certificates": [
                certificate.to_dict() for certificate in profile["certificates"]
            ],
        }
    )
