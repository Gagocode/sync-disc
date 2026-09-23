const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]));

const renderDisc = (disc) => {
  const element = document.querySelector("#disc-content");
  if (!disc) {
    element.innerHTML = '<div class="disc-empty"><span class="disc-empty-icon">O</span><div><h3>Realize seu DISC Inicial</h3><p>Descubra seus pontos fortes e comece sua jornada.</p><a class="button button-primary" href="/disc/">Comecar agora <span>-></span></a></div></div>';
    return;
  }
  const dimensions = Object.entries(disc.percentages);
  element.innerHTML = `<div class="disc-result"><div class="disc-dominant"><span class="disc-letter">${escapeHtml(disc.predominant_dimension)}</span><div><strong>${escapeHtml(disc.predominant_dimension)} em destaque</strong><p>Sua dimensao predominante</p></div></div><div class="disc-bars">${dimensions.map(([dimension, percentage]) => `<div class="disc-bar-row"><span>${escapeHtml(dimension)}</span><div class="mini-track"><i class="disc-${dimension.toLowerCase()}" style="width:${percentage}%"></i></div><strong>${percentage}%</strong></div>`).join("")}</div><a class="text-link" href="/disc/resultado">Ver resultado completo -></a></div>`;
};

const renderMissions = (missions) => {
  const active = missions.find((mission) => mission.status !== "Concluida") || missions[missions.length - 1];
  const activeElement = document.querySelector("#active-mission");
  if (!active) activeElement.innerHTML = '<p class="mission-empty">Suas proximas conquistas aparecerao aqui.</p>';
  else activeElement.innerHTML = `<span class="mission-status">${escapeHtml(active.status === "Pendente" ? "Disponivel agora" : active.status)}</span><h3>${escapeHtml(active.nome)}</h3><p>${escapeHtml(active.descricao)}</p><div class="mission-reward"><span>Recompensa</span><strong>${active.xp_recompensa} XP</strong></div>`;
  const next = missions.filter((mission) => mission !== active && mission.status !== "Concluida").slice(0, 3);
  document.querySelector("#next-missions").innerHTML = next.length ? next.map((mission, index) => `<article class="mission-small card"><span class="mission-number">0${index + 2}</span><div><h3>${escapeHtml(mission.nome)}</h3><p>${escapeHtml(mission.descricao)}</p></div><strong>+${mission.xp_recompensa} XP</strong></article>`).join("") : '<p class="muted">Voce esta em dia. Continue registrando suas evidencias no Curriculo Vivo.</p>';
};

const renderCollections = (projects, certificates) => {
  document.querySelector("#project-count").textContent = `${projects.length} ${projects.length === 1 ? "experiencia registrada" : "experiencias registradas"}`;
  document.querySelector("#certificate-count").textContent = `${certificates.length} ${certificates.length === 1 ? "conquista registrada" : "conquistas registradas"}`;
  document.querySelector("#project-preview").innerHTML = projects.slice(0, 2).map((project) => `<span>${escapeHtml(project.titulo)}</span>`).join("");
  document.querySelector("#certificate-preview").innerHTML = certificates.slice(0, 2).map((certificate) => `<span>${escapeHtml(certificate.nome)}</span>`).join("");
};

const renderAchievements = (achievements) => {
  const unlocked = achievements?.unlocked || [];
  const total = achievements?.total_count || 0;
  document.querySelector("#achievement-count").textContent = `${unlocked.length} de ${total} desbloqueadas`;
  document.querySelector("#achievement-list").innerHTML = unlocked.length
    ? unlocked.map((achievement) => `<article class="achievement-dashboard-card card"><span class="achievement-icon">OK</span><div><h3>${escapeHtml(achievement.nome)}</h3><p>${escapeHtml(achievement.descricao)}</p><small>${escapeHtml(achievement.data_desbloqueio)}</small></div></article>`).join("")
    : '<p class="muted">Suas conquistas aparecem automaticamente conforme voce evolui.</p>';
};

const renderEvolution = (evolution) => {
  if (!evolution) return;

  const { level, indicators, history } = evolution;
  const nextText = level.next ? `${level.xp_to_next} XP para o Nivel ${level.next}` : "Nivel maximo alcancado";

  document.querySelector("#dashboard-xp").textContent = indicators.xp_current;
  document.querySelector("#dashboard-level").textContent = `Nivel ${level.current}`;
  document.querySelector("#dashboard-progress").style.width = `${level.progress_percent}%`;
  document.querySelector("#dashboard-progress-caption").innerHTML = `<strong>${indicators.xp_current} XP</strong> acumulados - ${nextText}`;
  document.querySelector("#evolution-projects").textContent = indicators.projects_created;
  document.querySelector("#evolution-certificates").textContent = indicators.certificates_added;
  document.querySelector("#evolution-missions").textContent = indicators.missions_completed;
  document.querySelector("#evolution-achievements").textContent = indicators.achievements_unlocked;
  document.querySelector("#evolution-xp").textContent = indicators.xp_current;

  document.querySelector("#history-list").innerHTML = history?.length
    ? history.map((event) => `<article class="activity-dashboard-card card"><span>${escapeHtml(event.titulo)}</span><strong>${escapeHtml(event.descricao)}</strong><small>${escapeHtml(event.created_at)}</small></article>`).join("")
    : '<p class="muted">Nenhuma atividade registrada ainda.</p>';
};

const loadDashboard = async () => {
  const [profileResponse, missionsResponse] = await Promise.all([fetch("/perfil/json"), fetch("/missoes/json")]);
  if (!profileResponse.ok || !missionsResponse.ok) throw new Error("Nao foi possivel carregar o painel.");
  const profile = await profileResponse.json();
  const { disc_result: disc, projects, certificates, achievements, evolution } = profile;
  renderDisc(disc);
  renderMissions((await missionsResponse.json()).missions || []);
  renderCollections(projects || [], certificates || []);
  renderAchievements(achievements);
  renderEvolution(evolution);
};

if (document.body.classList.contains("dashboard-page")) {
  loadDashboard().catch(() => document.querySelectorAll(".loading-state").forEach((element) => { element.textContent = "Nao foi possivel carregar os dados agora."; }));
}
