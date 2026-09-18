from flask import Blueprint, jsonify, redirect, render_template, request, url_for

from controllers.auth_controller import login_required
from services.mission_service import MissionError, complete_user_mission, get_user_missions


mission_bp = Blueprint("missions", __name__, url_prefix="/missoes")


@mission_bp.get("/")
@login_required
def missions_page(user):
    missions = get_user_missions(user.id)
    return render_template("missoes.html", user=user, missions=missions)


@mission_bp.get("/json")
@login_required
def missions_json(user):
    missions = get_user_missions(user.id)
    return jsonify({"missions": [mission.to_dict() for mission in missions]})


@mission_bp.post("/<int:mission_id>/concluir")
@login_required
def complete_mission(user, mission_id):
    try:
        mission = complete_user_mission(user.id, mission_id)
    except MissionError as error:
        if _wants_json():
            return jsonify({"error": str(error)}), 404
        return str(error), 404

    if _wants_json():
        return jsonify({"mission": mission.to_dict()})
    return redirect(url_for("missions.missions_page"))


def _wants_json():
    return request.is_json or (
        request.accept_mimetypes.accept_json
        and not request.accept_mimetypes.accept_html
    )
