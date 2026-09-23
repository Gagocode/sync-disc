const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]));

const renderDisc = (disc) => {
  const element = document.querySelector("#disc-content");
  if (!disc) {
    element.innerHTML = '<div class="disc-empty"><span class="disc-empty-icon">◌</span><div><h3>Realize seu DISC Inicial</h3><p>Descubra seus pontos fortes e comece sua jornada.</p><a class="button button-primary" href="/disc/">Começar agora <span>→</span></a></div></div>';
    return;
  }
  const dimensions = Object.entries(disc.percentages);
  element.innerHTML = `<div class="disc-result"><div class="disc-dominant"><span class="disc-letter">${escapeHtml(disc.predominant_dimension)}</span><div><strong>${escapeHtml(disc.predominant_dimension)} em destaque</strong><p>Sua dimensão predominante</p></div></div><div class="disc-bars">${dimensions.map(([dimension, percentage]) => `<div class="disc-bar-row"><span>${escapeHtml(dimension)}</span><div class="mini-track"><i class="disc-${dimension.toLowerCase()}" style="width:${percentage}%"></i></div><strong>${percentage}%</strong></div>`).join("")}</div><a class="text-link" href="/disc/resultado">Ver resultado completo →</a></div>`;
};

const renderMissions = (missions) => {
  const active = missions.find((mission) => mission.status !== "Concluida") || missions[missions.length - 1];
  const activeElement = document.querySelector("#active-mission");
  if (!active) activeElement.innerHTML = '<p class="mission-empty">Suas próximas conquistas aparecerão aqui.</p>';
  else activeElement.innerHTML = `<span class="mission-status">${escapeHtml(active.status === "Pendente" ? "Disponível agora" : active.status)}</span><h3>${escapeHtml(active.nome)}</h3><p>${escapeHtml(active.descricao)}</p><div class="mission-reward"><span>Recompensa</span><strong>⚡ ${active.xp_recompensa} XP</strong></div>`;
  const next = missions.filter((mission) => mission !== active && mission.status !== "Concluida").slice(0, 3);
  document.querySelector("#next-missions").innerHTML = next.length ? next.map((mission, index) => `<article class="mission-small card"><span class="mission-number">0${index + 2}</span><div><h3>${escapeHtml(mission.nome)}</h3><p>${escapeHtml(mission.descricao)}</p></div><strong>+${mission.xp_recompensa} XP</strong></article>`).join("") : '<p class="muted">Você está em dia. Continue registrando suas evidências no Currículo Vivo.</p>';
  document.querySelector("#evolution-missions").textContent = missions.filter((mission) => mission.status === "Concluida").length;
};

const renderCollections = (projects, certificates) => {
  document.querySelector("#project-count").textContent = `${projects.length} ${projects.length === 1 ? "experiência registrada" : "experiências registradas"}`;
  document.querySelector("#certificate-count").textContent = `${certificates.length} ${certificates.length === 1 ? "conquista registrada" : "conquistas registradas"}`;
  document.querySelector("#evolution-projects").textContent = projects.length;
  document.querySelector("#evolution-certificates").textContent = certificates.length;
  document.querySelector("#project-preview").innerHTML = projects.slice(0, 2).map((project) => `<span>${escapeHtml(project.titulo)}</span>`).join("");
  document.querySelector("#certificate-preview").innerHTML = certificates.slice(0, 2).map((certificate) => `<span>${escapeHtml(certificate.nome)}</span>`).join("");
};

const loadDashboard = async () => {
  const [profileResponse, missionsResponse] = await Promise.all([fetch("/perfil/json"), fetch("/missoes/json")]);
  if (!profileResponse.ok || !missionsResponse.ok) throw new Error("Não foi possível carregar o painel.");
  const profile = await profileResponse.json();
  const { disc_result: disc, projects, certificates } = profile;
  renderDisc(disc);
  renderMissions((await missionsResponse.json()).missions || []);
  renderCollections(projects || [], certificates || []);
};

if (document.body.classList.contains("dashboard-page")) {
  loadDashboard().catch(() => document.querySelectorAll(".loading-state").forEach((element) => { element.textContent = "Não foi possível carregar os dados agora."; }));
}
