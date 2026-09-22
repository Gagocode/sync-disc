from flask import Blueprint, redirect, render_template, url_for

from controllers.auth_controller import login_required
from services.disc_service import get_initial_disc_result


page_bp = Blueprint("pages", __name__)


@page_bp.get("/login")
def login_page():
    return render_template("login.html")


@page_bp.get("/cadastro")
def register_page():
    return render_template("cadastro.html")


@page_bp.get("/dashboard")
@login_required
def dashboard_page(user):
    if not get_initial_disc_result(user.id):
        return redirect(url_for("disc.quiz_page"))
    if not user.classe:
        return redirect(url_for("profile.profile_page"))
    return render_template("index.html", user=user)
