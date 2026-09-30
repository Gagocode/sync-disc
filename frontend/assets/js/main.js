const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]));

const setTab = (name) => {
  document.querySelectorAll(".workspace-tab").forEach((tab) => {
    const selected = tab.dataset.tab === name;
    tab.classList.toggle("is-active", selected);
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  document.querySelectorAll(".workspace-panel").forEach((panel) => {
    const selected = panel.dataset.panel === name;
    panel.classList.toggle("is-active", selected);
    panel.hidden = !selected;
  });
};

const showFeedback = (message, isError = false) => {
  const feedback = document.querySelector("#dashboard-feedback");
  feedback.textContent = message;
  feedback.classList.toggle("is-error", isError);
  feedback.classList.toggle("is-visible", Boolean(message));
};

const formatDate = (value) => {
  if (!value) return "-";
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T12:00:00`) : new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(date);
};

const renderDisc = (disc) => {
  const element = document.querySelector("#disc-content");
  const profileElement = document.querySelector("#profile-disc");
  if (!disc) {
    element.innerHTML = '<div class="disc-empty"><span class="disc-empty-icon">D</span><div><h3>DISC Inicial pendente</h3><p>Seu resultado aparecera aqui quando estiver disponivel.</p></div></div>';
    profileElement.innerHTML = '<p class="muted">Resultado DISC Inicial ainda nao realizado.</p>';
    return;
  }
  const dimensions = Object.entries(disc.percentages || {});
  const bars = dimensions.map(([dimension, percentage]) => `<div class="disc-bar-row"><span>${escapeHtml(dimension)}</span><div class="mini-track"><i class="disc-${escapeHtml(dimension.toLowerCase())}" style="width:${Number(percentage) || 0}%"></i></div><strong>${Number(percentage) || 0}%</strong></div>`).join("");
  element.innerHTML = `<div class="disc-result"><div class="disc-dominant"><span class="disc-letter">${escapeHtml(disc.predominant_dimension)}</span><div><strong>${escapeHtml(disc.predominant_dimension)} em destaque</strong><p>Sua dimensao predominante</p></div></div><div class="disc-bars">${bars}</div></div>`;
  profileElement.innerHTML = `<div class="disc-comparison-grid"><div><h4>Inicial</h4><p class="muted">Resultado do quiz narrativo.</p>${renderDiscScores(disc.scores)}</div><div><h4>Observado</h4><p class="muted">Calculado pelas atividades realizadas.</p>${renderDiscScores(window.dashboardProfile?.observed_disc_result?.scores)}</div></div>`;
};

const renderDiscScores = (scores) => {
  if (!scores) return '<p class="muted">Aguardando atividades.</p>';
  return `<div class="disc-score-grid">${Object.entries(scores).map(([key, value]) => `<div><strong>${escapeHtml(key)}</strong><span>${escapeHtml(value)} pts</span></div>`).join("")}</div>`;
};

const renderMissions = (missions) => {
  const active = missions.find((mission) => mission.status !== "Concluida") || missions[missions.length - 1];
  const activeElement = document.querySelector("#active-mission");
  if (!active) activeElement.innerHTML = '<p class="mission-empty">Suas proximas conquistas aparecerao aqui.</p>';
  else activeElement.innerHTML = `<span class="mission-status">${escapeHtml(active.status === "Pendente" ? "Disponivel agora" : active.status)}</span><h3>${escapeHtml(active.nome)}</h3><p>${escapeHtml(active.descricao)}</p><div class="mission-reward"><span>Recompensa</span><strong>${escapeHtml(active.xp_recompensa)} XP</strong></div>`;

  const next = missions.filter((mission) => mission !== active && mission.status !== "Concluida").slice(0, 3);
  document.querySelector("#next-missions").innerHTML = next.length ? next.map((mission, index) => `<article class="mission-small card"><span class="mission-number">0${index + 2}</span><div><h3>${escapeHtml(mission.nome)}</h3><p>${escapeHtml(mission.descricao)}</p></div><strong>+${escapeHtml(mission.xp_recompensa)} XP</strong></article>`).join("") : '<p class="muted">Voce esta em dia. Continue registrando suas evidencias no Curriculo Vivo.</p>';
  document.querySelector("#mission-list").innerHTML = missions.length ? missions.map((mission) => `<article class="workspace-record-card mission-record ${mission.status === "Concluida" ? "is-complete" : ""}"><div class="record-main"><span class="mission-status">${escapeHtml(mission.status)}</span><h3>${escapeHtml(mission.nome)}</h3><p>${escapeHtml(mission.descricao)}</p>${mission.data_conclusao ? `<small>Concluida em ${escapeHtml(formatDate(mission.data_conclusao))}</small>` : ""}</div><strong class="record-reward">${escapeHtml(mission.xp_recompensa)} XP</strong></article>`).join("") : '<p class="empty-state">Nenhuma missao disponivel no momento.</p>';
};

const renderCollections = (projects, certificates) => {
  document.querySelector("#project-count").textContent = `${projects.length} ${projects.length === 1 ? "projeto registrado" : "projetos registrados"}`;
  document.querySelector("#certificate-count").textContent = `${certificates.length} ${certificates.length === 1 ? "certificado registrado" : "certificados registrados"}`;
  document.querySelector("#project-preview").innerHTML = projects.slice(0, 2).map((project) => `<span>${escapeHtml(project.titulo)}</span>`).join("");
  document.querySelector("#certificate-preview").innerHTML = certificates.slice(0, 2).map((certificate) => `<span>${escapeHtml(certificate.nome)}</span>`).join("");
  document.querySelector("#project-list").innerHTML = projects.length ? projects.map(renderProject).join("") : '<div class="empty-state"><p>Seu Curriculo Vivo ainda nao tem projetos.</p><button class="button button-soft" type="button" data-open-dialog="project-dialog">Adicionar primeiro projeto</button></div>';
  document.querySelector("#certificate-list").innerHTML = certificates.length ? certificates.map(renderCertificate).join("") : '<div class="empty-state"><p>Seus certificados aparecerao aqui.</p><button class="button button-soft" type="button" data-open-dialog="certificate-dialog">Adicionar primeiro certificado</button></div>';
};

const renderProject = (project) => `<article class="workspace-record-card"><div class="record-main"><p class="eyebrow">PROJETO</p><h3>${escapeHtml(project.titulo)}</h3><p>${escapeHtml(project.descricao)}</p><p class="record-meta"><strong>Tecnologias</strong> ${escapeHtml(project.tecnologias)}</p>${project.link ? `<a class="record-link" href="${escapeHtml(project.link)}" target="_blank" rel="noopener">Abrir projeto <span aria-hidden="true">↗</span></a>` : ""}<small>Adicionado em ${escapeHtml(formatDate(project.created_at))}</small></div><div class="record-actions"><button class="button button-ghost" type="button" data-edit="project" data-id="${project.id}">Editar</button><button class="button button-danger-ghost" type="button" data-delete="project" data-id="${project.id}">Excluir</button></div></article>`;

const renderCertificate = (certificate) => `<article class="workspace-record-card"><div class="record-main"><p class="eyebrow">CERTIFICADO</p><h3>${escapeHtml(certificate.nome)}</h3><p>${escapeHtml(certificate.instituicao)}</p><p class="record-meta"><strong>${escapeHtml(certificate.carga_horaria)}h</strong> · Concluido em ${escapeHtml(formatDate(certificate.data_conclusao))}</p>${certificate.arquivo_path ? `<a class="record-link" href="/certificados/${certificate.id}/arquivo" target="_blank" rel="noopener">Abrir arquivo <span aria-hidden="true">↗</span></a>` : ""}<small>Adicionado em ${escapeHtml(formatDate(certificate.created_at))}</small></div><div class="record-actions"><button class="button button-ghost" type="button" data-edit="certificate" data-id="${certificate.id}">Editar</button><button class="button button-danger-ghost" type="button" data-delete="certificate" data-id="${certificate.id}">Excluir</button></div></article>`;

const renderAchievements = (achievements) => {
  const unlocked = achievements?.unlocked || [];
  const count = `${unlocked.length} de ${achievements?.total_count || 0} desbloqueadas`;
  document.querySelector("#achievement-count").textContent = count;
  const content = unlocked.length ? unlocked.map((achievement) => `<article class="achievement-dashboard-card card"><span class="achievement-icon">OK</span><div><h3>${escapeHtml(achievement.nome)}</h3><p>${escapeHtml(achievement.descricao)}</p><small>${escapeHtml(formatDate(achievement.data_desbloqueio))}</small></div></article>`).join("") : '<p class="empty-state">Suas conquistas aparecem aqui conforme voce evolui.</p>';
  document.querySelector("#achievement-list").innerHTML = content;
  document.querySelector("#dashboard-achievement-list").innerHTML = unlocked.length ? unlocked.slice(0, 3).map((achievement) => `<article class="achievement-dashboard-card card"><span class="achievement-icon">OK</span><div><h3>${escapeHtml(achievement.nome)}</h3><p>${escapeHtml(achievement.descricao)}</p></div></article>`).join("") : '<p class="muted">Suas conquistas aparecem automaticamente conforme voce evolui.</p>';
};

const renderEvolutionHistory = (history) => history?.length
  ? history.map((event) => `<article class="activity-dashboard-card card"><span>${escapeHtml(event.titulo)}</span><strong>${escapeHtml(event.descricao)}</strong><small>${escapeHtml(formatDate(event.created_at))}</small></article>`).join("")
  : '<p class="muted">Nenhuma atividade registrada ainda.</p>';

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
  document.querySelector("#profile-xp").textContent = indicators.xp_current;
  document.querySelector("#evolution-level-title").textContent = `Nivel ${level.current}`;
  document.querySelector("#evolution-level-copy").textContent = nextText;
  document.querySelector("#evolution-progress").style.width = `${level.progress_percent}%`;
  document.querySelector("#evolution-progress-caption").textContent = `${level.progress_percent}% de progresso`;
  document.querySelector("#detail-projects").textContent = indicators.projects_created;
  document.querySelector("#detail-certificates").textContent = indicators.certificates_added;
  document.querySelector("#detail-missions").textContent = indicators.missions_completed;
  document.querySelector("#detail-achievements").textContent = indicators.achievements_unlocked;
  document.querySelector("#detail-xp").textContent = indicators.xp_current;
  const renderedHistory = renderEvolutionHistory(history);
  document.querySelector("#history-list").innerHTML = renderedHistory;
  document.querySelector("#evolution-history").innerHTML = renderedHistory;
};

const loadDashboard = async () => {
  const [profileResponse, missionsResponse] = await Promise.all([fetch("/perfil/json"), fetch("/missoes/json")]);
  if (!profileResponse.ok || !missionsResponse.ok) throw new Error("Nao foi possivel carregar o painel.");
  const profile = await profileResponse.json();
  const missions = (await missionsResponse.json()).missions || [];
  window.dashboardProfile = profile;
  const { user, disc_result: disc, projects = [], certificates = [], achievements, evolution } = profile;
  document.querySelector("#profile-email").textContent = user.email || "-";
  document.querySelector("#profile-created").textContent = formatDate(user.created_at);
  renderDisc(disc);
  renderMissions(missions);
  renderCollections(projects, certificates);
  renderAchievements(achievements);
  renderEvolution(evolution);
};

const openDialog = (type, record = null) => {
  const dialog = document.querySelector(`#${type}-dialog`);
  const form = document.querySelector(`#${type}-form`);
  form.reset();
  form.dataset.recordId = record?.id || "";
  form.querySelector(".dialog-error").textContent = "";
  const title = document.querySelector(`#${type}-dialog-title`);
  title.textContent = `${record ? "Editar" : "Adicionar"} ${type === "project" ? "projeto" : "certificado"}`;
  if (record) Object.entries(record).forEach(([key, value]) => {
    const input = form.elements.namedItem(key);
    if (input && input.type !== "file" && value != null) input.value = value;
  });
  dialog.showModal();
};

const submitRecord = async (event, type) => {
  event.preventDefault();
  const form = event.currentTarget;
  const recordId = form.dataset.recordId;
  const endpoint = type === "project" ? "/projetos/" : "/certificados/";
  const url = recordId ? `${endpoint}${recordId}/editar` : endpoint;
  const isCertificate = type === "certificate";
  const options = isCertificate
    ? { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } }
    : { method: "POST", body: JSON.stringify(Object.fromEntries(new FormData(form))), headers: { "Content-Type": "application/json", Accept: "application/json" } };
  const submitButton = form.querySelector('[type="submit"]');
  submitButton.disabled = true;
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Nao foi possivel salvar este registro.");
    document.querySelector(`#${type}-dialog`).close();
    await loadDashboard();
    showFeedback(`${type === "project" ? "Projeto" : "Certificado"} ${recordId ? "atualizado" : "adicionado"} com sucesso.`);
  } catch (error) {
    form.querySelector(".dialog-error").textContent = error.message;
  } finally {
    submitButton.disabled = false;
  }
};

const removeRecord = async (type, recordId) => {
  const label = type === "project" ? "projeto" : "certificado";
  if (!window.confirm(`Excluir este ${label}?`)) return;
  try {
    const endpoint = type === "project" ? "/projetos/" : "/certificados/";
    const response = await fetch(`${endpoint}${recordId}/excluir`, { method: "POST", headers: { Accept: "application/json" } });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || `Nao foi possivel excluir o ${label}.`);
    await loadDashboard();
    showFeedback(`${label[0].toUpperCase()}${label.slice(1)} excluido com sucesso.`);
  } catch (error) {
    showFeedback(error.message, true);
  }
};

if (document.body.classList.contains("dashboard-page")) {
  document.querySelectorAll(".workspace-tab").forEach((tab) => tab.addEventListener("click", () => setTab(tab.dataset.tab)));
  document.querySelectorAll("[data-open-tab]").forEach((button) => button.addEventListener("click", () => {
    setTab(button.dataset.openTab);
    document.querySelector(`#tab-${button.dataset.openTab}`).focus();
  }));
  document.querySelectorAll(".workspace-tab").forEach((tab) => tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const tabs = [...document.querySelectorAll(".workspace-tab")];
    const current = tabs.indexOf(tab);
    const next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (current + (event.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length;
    setTab(tabs[next].dataset.tab);
    tabs[next].focus();
  }));
  document.addEventListener("click", (event) => {
    const openButton = event.target.closest("[data-open-dialog]");
    if (openButton) openDialog(openButton.dataset.openDialog.replace("-dialog", ""));
    const closeButton = event.target.closest("[data-close-dialog]");
    if (closeButton) closeButton.closest("dialog").close();
    const editButton = event.target.closest("[data-edit]");
    if (editButton) {
      const type = editButton.dataset.edit;
      const records = type === "project" ? window.dashboardProfile.projects : window.dashboardProfile.certificates;
      openDialog(type, records.find((record) => String(record.id) === editButton.dataset.id));
    }
    const deleteButton = event.target.closest("[data-delete]");
    if (deleteButton) removeRecord(deleteButton.dataset.delete, deleteButton.dataset.id);
  });
  document.querySelector("#project-form").addEventListener("submit", (event) => submitRecord(event, "project"));
  document.querySelector("#certificate-form").addEventListener("submit", (event) => submitRecord(event, "certificate"));
  loadDashboard().catch(() => document.querySelectorAll(".loading-state").forEach((element) => { element.textContent = "Nao foi possivel carregar os dados agora."; }));
}
