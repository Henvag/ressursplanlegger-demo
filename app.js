const detailButton = document.querySelector(".text-button");
const attentionDrawer = document.querySelector("#attentionDrawer");
const drawerCloseButtons = document.querySelectorAll("[data-close-drawer]");
const pageLinks = document.querySelectorAll("[data-page-link]");
const pageViews = document.querySelectorAll(".page-view");
const mainContent = document.querySelector(".main-content");
const plannerWeekHeader = document.querySelector("#plannerWeekHeader");
const plannerResourceColumn = document.querySelector("#plannerResourceColumn");
const plannerCalendarGrid = document.querySelector("#plannerCalendarGrid");
const weekCountButtons = document.querySelectorAll("[data-week-count]");
const resourcePlanner = document.querySelector(".resource-planner");
const skillsHeaderRow = document.querySelector("#skillsHeaderRow");
const skillsRowHeader = document.querySelector("#skillsRowHeader");
const skillsGrid = document.querySelector("#skillsGrid");
const skillsTable = document.querySelector("#skillsTable");
const skillsSearch = document.querySelector("#skillsSearch");
const skillsDrawer = document.querySelector("#skillsDrawer");
const skillsDrawerBody = document.querySelector("#skillsDrawerBody");
const projectsGrid = document.querySelector("#projectsGrid");
const projectsSearch = document.querySelector("#projectsSearch");
const projectFilterButtons = document.querySelectorAll("[data-project-filter]");
const projectDetail = document.querySelector("#projectDetail");
const projectDetailTitle = document.querySelector("#projectDetailTitle");
const projectDetailStatus = document.querySelector("#projectDetailStatus");
const projectDetailContent = document.querySelector("#projectDetailContent");
let visibleWeeks = 3;
let allocationMenu = null;
let activeAllocation = null;
let allocationDialog = null;

const dayLabels = Array.from({ length: 56 }, (_, index) => `${index + 6}.`);
const weekLabels = Array.from({ length: 8 }, (_, index) => ({
  label: `Uke ${index + 15}`,
  month: index < 4 ? "april 2026" : "mai 2026",
  span: 7,
}));

const repeatToLength = (labels, colors, length) => ({
  pattern: Array.from({ length }, (_, index) => labels[index % labels.length]),
  colors: Array.from({ length }, (_, index) => colors[index % colors.length]),
});

const workWeek = repeatToLength(["BB", "BB", "BB", "BB", "BB", "AV", "AV"], ["green", "green", "green", "green", "green", "red", "red"], 56);
const mixedWeek = repeatToLength(["MK", "MK", "MK", "AV", "AV", "MK", "MK"], ["green", "green", "green", "red", "red", "green", "green"], 56);
const blankTail = repeatToLength(["MK", "MK", "MK", "MK", "MK", "AV", "AV", "MK", "MK", "", "", "", "", ""], ["green", "green", "green", "green", "green", "red", "red", "green", "green", "blank", "blank", "blank", "blank", "blank"], 56);

const plannerRows = [
  {
    name: "Anita Jensen",
    role: "Prosjektleder",
    ...workWeek,
  },
  {
    name: "Bjørn Erik Nilsen",
    role: "Byggearbeider",
    ...blankTail,
  },
  {
    name: "Dimitrij Dimitrios",
    role: "Snekker",
    pattern: Array(56).fill("Syk"),
    colors: Array(56).fill("peach"),
  },
  {
    name: "Fridjof Knutsen",
    role: "Snekker",
    ...mixedWeek,
  },
  {
    name: "Georg Jensen",
    role: "Byggearbeider",
    ...repeatToLength(["Kurs", "Kurs", "Kurs", "Kurs", "Kurs", "AV", "AV", "BB", "BB", "BB", "BB", "BB", "AV", "AV"], ["blue", "blue", "blue", "blue", "blue", "red", "red", "green", "green", "green", "green", "green", "red", "red"], 56),
  },
  {
    name: "Hanne Hansen",
    role: "Byggansvarlig",
    pattern: Array(56).fill("Perm"),
    colors: Array(56).fill("purple"),
  },
  {
    name: "Ingrid Solbakken",
    role: "Snekker",
    ...repeatToLength(["Ferie", "Ferie", "Ferie", "Ferie", "Ferie", "Ferie", "Ferie", "DKB", "DKB", "DKB", "DKB", "DKB", "AV", "AV"], ["yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "green", "green", "green", "green", "green", "red", "red"], 56),
  },
  {
    name: "Iselin Wisnes",
    role: "Byggansvarlig",
    pattern: Array(56).fill("Ferie"),
    colors: Array(56).fill("yellow"),
  },
  {
    name: "Janne Eriksen",
    role: "Elektriker",
    ...repeatToLength(["FU", "FU", "FU", "FU", "FU", "AV", "AV", "FU", "FU", "FU", "FU", "", "", ""], ["green", "green", "green", "green", "green", "red", "red", "green", "green", "green", "green", "blank", "blank", "blank"], 56),
  },
  {
    name: "Knut Knutsen",
    role: "Prosjektleder",
    ...workWeek,
  },
  {
    name: "Kristofer Moe",
    role: "Elektriker",
    ...workWeek,
  },
  {
    name: "Martin Birkeland",
    role: "Prosjektleder",
    ...workWeek,
  },
  {
    name: "Ola Olsen",
    role: "Prosjektleder",
    ...repeatToLength(["PFG", "PFG", "PFG", "PFG", "PFG", "AV", "AV"], ["green", "green", "green", "green", "green", "red", "red"], 56),
  },
];

const allocationOptions = [
  {
    id: "project",
    label: "Prosjekt tildeling",
    shortLabel: "Prosjekt",
    color: "green",
    icon: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M19 8v6"/><path d="M22 11h-6"/></svg>`,
  },
  {
    id: "vacation",
    label: "Ferie",
    shortLabel: "Ferie",
    color: "yellow",
    icon: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10a8 8 0 0 1 16 0Z"/><path d="M12 10v9"/><path d="M12 19a2 2 0 0 0 4 0"/></svg>`,
  },
  {
    id: "sick",
    label: "Sykdom",
    shortLabel: "Syk",
    color: "peach",
    icon: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 8.5 15.5 15.5"/><path d="M15.5 8.5 8.5 15.5"/><rect x="7" y="7" width="10" height="10" rx="2"/></svg>`,
  },
  {
    id: "leave",
    label: "Permisjon",
    shortLabel: "Perm",
    color: "purple",
    icon: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-3-3.87"/><path d="M7 21v-2a4 4 0 0 1 3-3.87"/><circle cx="12" cy="8" r="3"/><path d="M2 21v-2a4 4 0 0 1 4-4"/><circle cx="6" cy="9" r="2"/><path d="M22 21v-2a4 4 0 0 0-4-4"/><circle cx="18" cy="9" r="2"/></svg>`,
  },
  {
    id: "course",
    label: "Kurs/Opplæring",
    shortLabel: "Kurs",
    color: "blue",
    icon: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10"/><path d="M7 12h7"/><path d="M7 16h5"/><path d="M16 14h3"/></svg>`,
  },
];

const skillsColumns = [
  "Maskinfører B",
  "HMS-kort",
  "ADK1",
  "Varmearbeider",
  "Truckførerbevis",
  "Stillasbygger",
  "Sikkerhet høyde",
  "M1 Kurs",
  "M2 Kurs",
  "Lastebilkran",
  "Lift / personløft",
  "Kranfører",
  "Sveisesertifikat",
  "Fallsikring",
];

const skillsRows = [
  { name: "Jon Eriksen", role: "Maskinfører" },
  { name: "Kari Nordmann", role: "Maskinfører" },
  { name: "Harald Henriksen", role: "Betongarbeider" },
  { name: "Ingrid Johansen", role: "Betongarbeider" },
  { name: "Martin Hansen", role: "Maskinfører" },
  { name: "Kjersti Kragerød", role: "HMS" },
  { name: "Erik Larsen", role: "Betongarbeider" },
  { name: "Astrid Johansen", role: "HMS" },
  { name: "Ola Hansen", role: "Maskinfører" },
  { name: "Joakim Jonsen", role: "Prosjektleder" },
  { name: "Fredrik Jonsen", role: "Anleggsleder" },
  { name: "Ida Johansen", role: "Maskinfører" },
];

const projects = [
  {
    name: "Fløbugga Mindeveien 14 - 60",
    client: "Veidekke ASA",
    weeks: "Uke 4 - Uke 38, 2026",
    status: "rute",
    progress: 48,
    peopleCount: 10,
    stats: { people: 10, machines: 4, alerts: 0 },
  },
  {
    name: "Fjellanlegg E39 Arna",
    client: "Statens Vegvesen",
    weeks: "Uke 1 - Uke 50, 2026",
    status: "rute",
    progress: 85,
    peopleCount: 16,
    stats: { people: 16, machines: 4, alerts: 3 },
  },
  {
    name: "Rehabilitering Damsgård",
    client: "Bergen Kommune",
    weeks: "Uke 8 - Uke 32, 2026",
    status: "pagaende",
    progress: 65,
    peopleCount: 4,
    stats: { people: 4, machines: 1, alerts: 0 },
  },
  {
    name: "Næringsbygg Kokstad",
    client: "Backer Bolig AS",
    weeks: "Uke 2 - Uke 28, 2026",
    status: "kritisk",
    progress: 35,
    peopleCount: 5,
    stats: { people: 5, machines: 0, alerts: 2 },
  },
  {
    name: "Leiligheter Paradis - OBOS",
    client: "OBOS",
    weeks: "Uke 24 - Uke 52, 2026",
    status: "fullfort",
    progress: 100,
    peopleCount: 5,
    stats: { people: 5, machines: 1, alerts: 0 },
  },
  {
    name: "Skole Ytrebygda",
    client: "Bergen Kommune",
    weeks: "Uke 4 - Uke 28, 2026",
    status: "kritisk",
    progress: 82,
    peopleCount: 8,
    stats: { people: 1, machines: 4, alerts: 1 },
  },
];

let activeProjectFilter = "all";

const skillStatus = () => {
  const roll = Math.random();
  if (roll < 0.62) return "ok";
  if (roll < 0.78) return "warn";
  return "muted";
};

const statusIcons = {
  ok: `<svg class="skills-icon ok" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>`,
  warn: `<svg class="skills-icon warn" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v6"/><path d="M12 17h.01"/></svg>`,
  muted: `<svg class="skills-icon muted" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M8.5 12h7"/></svg>`,
};

let isSyncingSkillsScroll = false;
function syncSkillsScroll() {
  if (!skillsGrid || !skillsHeaderRow || !skillsRowHeader) return;
  if (isSyncingSkillsScroll) return;
  isSyncingSkillsScroll = true;
  skillsHeaderRow.scrollLeft = skillsGrid.scrollLeft;
  skillsRowHeader.scrollTop = skillsGrid.scrollTop;
  queueMicrotask(() => {
    isSyncingSkillsScroll = false;
  });
}

function showPage(pageId) {
  pageViews.forEach((page) => {
    page.classList.toggle("active", page.id === pageId);
  });

  pageLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.pageLink === pageId);
  });

  if (mainContent) {
    mainContent.classList.toggle("planner-active", pageId === "plannerPage");
    mainContent.classList.toggle("skills-active", pageId === "skillsPage");
    mainContent.classList.toggle("projects-active", pageId === "projectsPage");
  }
}

function projectStatusMeta(status) {
  if (status === "kritisk") return { pill: "Kritisk", cls: "warn" };
  if (status === "rute") return { pill: "I rute", cls: "ok" };
  if (status === "fullfort") return { pill: "Fullført", cls: "ok" };
  if (status === "ikke_pabegynt") return { pill: "Ikke påbegynt", cls: "muted" };
  return { pill: "Pågående", cls: "muted" };
}

const avatarPool = Array.from({ length: 10 }, (_, idx) => `./assets/avatars/avatar${idx + 1}.jpg`);

function projectAvatarSources(project, visibleCount = 3) {
  const base = hashString(project.name);
  const count = Math.max(0, Number(project.peopleCount ?? project.stats?.people ?? 0));
  const shown = Math.min(visibleCount, count);
  const sources = [];

  for (let i = 0; i < shown; i += 1) {
    const poolIndex = (base + i * 7) % avatarPool.length;
    sources.push(avatarPool[poolIndex]);
  }

  return { sources, remaining: Math.max(0, count - shown) };
}

function buildProjectCard(project) {
  const meta = projectStatusMeta(project.status);
  const alertColor = project.stats.alerts > 0 ? "#b53839" : "#6b7582";
  const avatars = projectAvatarSources(project, 3);
  return `
    <article class="project-card" data-project-name="${project.name}">
      <div class="project-card-head">
        <div>
          <strong>${project.name}</strong>
          <div class="project-meta">
            <span>Oppdragsgiver: ${project.client}</span>
            <span>${project.weeks}</span>
          </div>
        </div>
        <span class="project-status-pill ${meta.cls}">${meta.pill}</span>
      </div>

      <div class="project-stats" aria-label="Nøkkeltall">
        <span title="Ansatte">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-8 0v2"/><circle cx="12" cy="7" r="4"/></svg>
          ${project.stats.people}
        </span>
        <span title="Maskiner">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h11v8H3z"/><path d="M14 10h4l3 3v2h-7z"/><circle cx="7" cy="17" r="2"/><circle cx="18" cy="17" r="2"/></svg>
          ${project.stats.machines}
        </span>
        <span title="Varsler" style="color:${alertColor}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/></svg>
          ${project.stats.alerts}
        </span>
      </div>

      <div class="project-progress" aria-label="Fremdrift ${project.progress}%">
        <div style="width:${project.progress}%"></div>
      </div>

      <div class="project-footer">
        <div class="project-avatars" aria-label="Team">
          ${avatars.sources
            .map(
              (src, index) =>
                `<span class="project-avatar" aria-hidden="true"><img src="${src}" alt="" loading="lazy" decoding="async" /></span>`
            )
            .join("")}
          ${avatars.remaining ? `<span class="project-avatar more" aria-label="+${avatars.remaining}">+${avatars.remaining}</span>` : ""}
        </div>
        <button class="project-detail" type="button">SE DETALJER →</button>
      </div>
    </article>
  `;
}

function filterProjects(items, query, filter) {
  const q = query.trim().toLowerCase();
  let list = items;

  if (filter !== "all") {
    if (filter === "critical") list = list.filter((p) => p.status === "kritisk");
    if (filter === "completed") list = list.filter((p) => p.status === "fullfort");
    if (filter === "ongoing") list = list.filter((p) => p.status === "pagaende" || p.status === "rute" || p.status === "kritisk");
    if (filter === "not_started") list = list.filter((p) => p.status === "ikke_pabegynt");
  }

  if (!q) return list;
  return list.filter((p) => `${p.name} ${p.client}`.toLowerCase().includes(q));
}

function renderProjects() {
  if (!projectsGrid) return;
  const query = projectsSearch?.value ?? "";
  const filtered = filterProjects(projects, query, activeProjectFilter);
  projectsGrid.innerHTML = filtered.map(buildProjectCard).join("");
}

function closeProjectDetail() {
  projectDetail?.classList.remove("open");
  projectDetail?.setAttribute("aria-hidden", "true");
  if (projectDetailContent) projectDetailContent.scrollTop = 0;
}

function openProjectDetail(project) {
  if (!projectDetail || !projectDetailTitle || !projectDetailStatus || !projectDetailContent) return;

  const meta = projectStatusMeta(project.status);
  projectDetailTitle.textContent = project.name;
  projectDetailStatus.className = `project-detail-status ${meta.cls}`;
  projectDetailStatus.textContent = meta.pill;

  const percent = Math.max(0, Math.min(100, Number(project.progress ?? 0)));
  const warningCount = project.stats?.alerts ?? 0;
  const weekLabel = project.weeks ?? "";

  // Simple “demo” detail data per project (stable per name).
  const base = hashString(project.name);
  const manager = ["Henrik Dahl", "Martin Birkeland", "Kari Nordmann", "Ola Olsen"][base % 4];
  const address = ["Kokstadvågen 23, 5257 Kokstad", "Arnatveit 12, 5262 Arna", "Damsgårdsveien 18, Bergen", "Paradisveien 4, Bergen"][base % 4];

  const warnings = Array.from({ length: Math.max(1, Math.min(3, warningCount || 2)) }, (_, idx) => {
    const type = idx === 0 && (warningCount > 1 || project.status === "kritisk") ? "Kritisk" : "Advarsel";
    const text =
      idx === 0
        ? "Underbemanning: 4 av 9 planlagte stillinger er ikke besatt"
        : idx === 1
          ? "Sertifikat utløper: Varmearbeid utløper 22. april 2026"
          : "Maskin ikke tilgjengelig: CAT 320 Gravemaskin er til service uke 16";
    const action = idx === 0 ? "SE LEDIGE RESSURSER" : idx === 1 ? "SE SERTIFIKAT" : "SE ALTERNATIVER";
    return { type, text, action };
  });

  const staffing = [
    { name: "Per Hansen", role: "Bas", bars: ["green", "green", "red", "red", "green", "muted", "muted"] },
    { name: "Thomas Berg", role: "Tømrer", bars: ["green", "green", "green", "green", "green", "muted", "muted"] },
    { name: "Silje Aas", role: "Elektriker", bars: ["green", "green", "green", "green", "muted", "muted", "muted"] },
    { name: "Erik Lunde", role: "Grunnarbeider", bars: ["green", "green", "green", "green", "green", "muted", "muted"] },
    { name: "Jonas Berge", role: "Lærling", bars: ["green", "green", "green", "muted", "muted", "muted", "muted"] },
  ];

  const machines = [
    { label: "Gravemaskin", value: "CAT 320 (ID: M-012)", pill: "Til service uke 16", cls: "warn" },
    { label: "Mobilkran", value: "Liebherr LTM 1060", pill: "Tilgjengelig", cls: "ok" },
    { label: "Brakkerigg", value: "Rigq A (12-mann)", pill: "Fast på prosjektet", cls: "ok" },
  ];

  const requiredCerts = [
    { label: "Varmearbeid", type: "Påkrevd", who: "Thomas Berg", note: "utløper 22. apr 2026", cls: "warn" },
    { label: "Stillasarbeid", type: "Påkrevd", who: "Alle OK", note: "", cls: "ok" },
    { label: "HMS-kort", type: "Påkrevd", who: "Alle OK", note: "", cls: "ok" },
    { label: "Førstehjelpskurs", type: "Anbefalt", who: "Jonas Berge", note: "mangler", cls: "warn" },
    { label: "Maskinførerbevis", type: "Påkrevd", who: "Erik Lunde", note: "gyldig til des 2027", cls: "ok" },
  ];

  const activity = [
    { when: "I dag 14:32", what: "Martin Birkeland allokert Silje Aas til prosjektet" },
    { when: "I dag 09:15", what: "Systemet oppdaget dobbelbooking: Per Hansen (uke 16)" },
    { when: "7. apr 08:00", what: "CAT 320 satt til service (planlagt retur uke 17)" },
  ];

  projectDetailContent.innerHTML = `
    <section class="project-detail-section">
      <div class="project-detail-card">
        <div class="project-summary-row">
          <div class="project-summary-item">
            <p>Oppdragsgiver</p>
            <strong>${project.client}</strong>
          </div>
          <div class="project-summary-item">
            <p>Prosjektleder</p>
            <strong>${manager}</strong>
          </div>
          <div class="project-summary-item">
            <p>Periode</p>
            <strong>${weekLabel}</strong>
          </div>
          <div class="project-summary-item">
            <p>Adresse</p>
            <strong>${address}</strong>
          </div>
        </div>

        <div class="project-detail-progress">
          <div class="project-detail-progress-bar"><div style="width:${percent}%"></div></div>
          <div class="project-detail-progress-meta">
            <span>Forventet fremdrift: ${percent}%</span>
            <span>${percent}% fullført</span>
          </div>
        </div>
      </div>

      <div class="project-detail-card">
        <div class="project-warnings-head">
          <strong>Varsler</strong>
          <span class="project-status-pill warn">${warnings.length}</span>
        </div>
        <div class="project-warnings">
          ${warnings
            .map(
              (w) => `
            <div class="project-warning">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/></svg>
              <div>
                <p>${w.type}</p>
                <span>${w.text}</span>
              </div>
              <button type="button">${w.action}</button>
            </div>
          `
            )
            .join("")}
        </div>
      </div>

      <div class="project-detail-card">
        <div class="project-warnings-head">
          <strong>Bemanning uke 16</strong>
          <span style="color:#6b7582;font-size:11px;font-weight:800;">UKE 16</span>
        </div>
        <table class="project-table" aria-label="Bemanning">
          <thead>
            <tr>
              <th>Navn</th>
              <th>Rolle</th>
              <th>Man</th>
              <th>Tir</th>
              <th>Ons</th>
              <th>Tor</th>
              <th>Fre</th>
              <th>Lør</th>
              <th>Søn</th>
            </tr>
          </thead>
          <tbody>
            ${staffing
              .map(
                (p) => `
              <tr>
                <td>${p.name}</td>
                <td>${p.role}</td>
                ${p.bars
                  .map((c) => `<td><div class="staff-bar ${c === "muted" ? "" : c}"></div></td>`)
                  .join("")}
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
        <div style="margin-top:10px;color:#b53839;font-size:11px;font-weight:850;">4 stillinger ubesatt denne uken (planlagt: 9)</div>
      </div>
    </section>

    <section class="project-detail-section">
      <div class="project-detail-card">
        <div class="project-warnings-head">
          <strong>Maskiner og utstyr</strong>
        </div>
        <table class="project-table" aria-label="Maskiner og utstyr">
          <tbody>
            ${machines
              .map(
                (m) => `
              <tr>
                <td style="width:180px;color:#2a2f38;font-weight:850;">${m.label}</td>
                <td style="color:#55606d;font-weight:650;">${m.value}</td>
                <td style="text-align:right;">
                  <span class="project-status-pill ${m.cls}">${m.pill}</span>
                </td>
              </tr>
            `
              )
              .join("")}
            <tr>
              <td colspan="3" style="color:#4c6ea6;font-weight:900;">+ LEGG TIL MASKIN/UTSTYR</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="project-detail-card">
        <div class="project-warnings-head">
          <strong>Påkrevde sertifikater for dette prosjektet</strong>
        </div>
        <table class="project-table" aria-label="Påkrevde sertifikater">
          <tbody>
            ${requiredCerts
              .map(
                (c) => `
              <tr>
                <td style="width:180px;color:#2a2f38;font-weight:850;">${c.label}</td>
                <td style="width:110px;color:#55606d;font-weight:800;">${c.type}</td>
                <td style="color:#55606d;font-weight:650;">${c.who}${c.note ? ` — <span style="color:${c.cls === "warn" ? "#b53839" : "#1d7e4e"};font-weight:850;">${c.note}</span>` : ""}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>

      <div class="project-detail-card">
        <div class="project-warnings-head">
          <strong>Siste aktivitet</strong>
        </div>
        <div style="display:grid;gap:10px;">
          ${activity
            .map(
              (a) => `
            <div style="display:grid;grid-template-columns:110px 1fr;gap:12px;">
              <div style="color:#6b7582;font-size:11px;font-weight:800;">${a.when}</div>
              <div style="color:#2a2f38;font-size:12px;font-weight:700;">${a.what}</div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    </section>
  `;

  projectDetail.classList.add("open");
  projectDetail.setAttribute("aria-hidden", "false");
}

function buildSkillsTable(filter = "") {
  if (!skillsHeaderRow || !skillsRowHeader || !skillsGrid || !skillsTable) return;

  const query = filter.trim().toLowerCase();
  const filteredRows = query
    ? skillsRows.filter((row) => `${row.name} ${row.role}`.toLowerCase().includes(query))
    : skillsRows;

  skillsHeaderRow.textContent = "";
  skillsRowHeader.textContent = "";
  skillsGrid.textContent = "";

  skillsTable.style.setProperty("--skills-cols", String(skillsColumns.length));
  skillsTable.style.setProperty("--skills-rows", String(filteredRows.length));

  skillsColumns.forEach((column) => {
    const el = document.createElement("div");
    el.className = "skills-col-label";
    el.textContent = column;
    skillsHeaderRow.appendChild(el);
  });

  filteredRows.forEach((row) => {
    const rowEl = document.createElement("div");
    rowEl.className = "skills-row";
    rowEl.innerHTML = `<strong>${row.name}</strong><span>${row.role}</span>`;
    rowEl.tabIndex = 0;
    rowEl.setAttribute("role", "button");
    rowEl.setAttribute("aria-label", `Åpne kompetanseoversikt for ${row.name}`);
    rowEl.addEventListener("click", () => openSkillsDrawer(row));
    rowEl.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openSkillsDrawer(row);
      }
    });
    skillsRowHeader.appendChild(rowEl);

    skillsColumns.forEach(() => {
      const status = skillStatus();
      const cell = document.createElement("div");
      cell.className = "skills-cell";
      cell.innerHTML = statusIcons[status];
      skillsGrid.appendChild(cell);
    });
  });
}

function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  return hash;
}

function formatNorwegianDate(date) {
  try {
    return new Intl.DateTimeFormat("nb-NO", { day: "numeric", month: "long", year: "numeric" }).format(date);
  } catch {
    return date.toISOString().slice(0, 10);
  }
}

function formatNorwegianShortDate(date) {
  try {
    return new Intl.DateTimeFormat("nb-NO", { day: "numeric", month: "short", year: "numeric" }).format(date);
  } catch {
    return date.toISOString().slice(0, 10);
  }
}

function buildSkillsDrawerDemoData(row) {
  const base = hashString(row.name);
  const phone = `412 ${String(10 + (base % 80)).padStart(2, "0")} ${String(10 + ((base >>> 7) % 80)).padStart(2, "0")}`;
  const email = `${row.name
    .toLowerCase()
    .replace(/[^a-zæøå\s.-]/g, "")
    .trim()
    .replace(/\s+/g, ".")}@wizrd.no`;

  const projectA = (base % 3) + 1;
  const projectB = ((base >>> 5) % 3) + 1;
  const projects = [
    {
      name: ["Næringsbygg Kokstad", "Fjellanlegg E39 Arna", "Marineholmen kai"][projectA - 1],
      state: ["kritisk", "rute", "normal"][projectA - 1],
    },
    {
      name: ["Dokken kontorbygg", "Prosjekt Lofoten", "Bjørnefjorden"][projectB - 1],
      state: ["rute", "normal", "rute"][projectB - 1],
    },
  ];

  const allocationWarning = base % 4 === 0 ? "Allokert til 2 prosjekter samtidig uke 16" : "";

  const now = new Date();
  const certs = skillsColumns.map((label, index) => {
    const seed = `${row.name}|${label}|${index}`;
    const h = hashString(seed);
    const roll = (h % 1000) / 1000;
    const expiry = new Date(now);

    // Spread expiries between -120 and +520 days for believable mix.
    const deltaDays = Math.round(((h >>> 3) % 640) - 120);
    expiry.setDate(expiry.getDate() + deltaDays);

    if (roll < 0.18) {
      return { label, status: "muted", pill: "Mangler", expiresAt: null, note: "" };
    }
    if (deltaDays < 0) {
      return {
        label,
        status: "warn",
        pill: "Utløpt",
        expiresAt: expiry,
        note: `${projects[0].name} krever gyldig ${label}`,
      };
    }
    if (deltaDays <= 45) {
      return {
        label,
        status: "warn",
        pill: `Utløper om ${deltaDays} dager`,
        expiresAt: expiry,
        note: "",
      };
    }
    return { label, status: "ok", pill: "Gyldig", expiresAt: expiry, note: "" };
  });

  return { phone, email, projects, allocationWarning, certs };
}

function closeSkillsDrawer() {
  skillsDrawer?.classList.remove("open");
  skillsDrawer?.setAttribute("aria-hidden", "true");
}

function openSkillsDrawer(row) {
  if (!skillsDrawer || !skillsDrawerBody) return;

  const demo = buildSkillsDrawerDemoData(row);
  const initials = row.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const summaryCounts = demo.certs.reduce(
    (acc, item) => {
      acc[item.status] += 1;
      return acc;
    },
    { ok: 0, warn: 0, muted: 0 }
  );

  skillsDrawerBody.innerHTML = `
    <div class="skills-person-card">
      <div class="skills-person-avatar" aria-hidden="true">${initials || "?"}</div>
      <div class="skills-person-meta">
        <strong>${row.name}</strong>
        <span>${row.role}</span>
        <div class="skills-person-contact" aria-label="Kontaktinfo">
          <a class="skills-contact-link" href="tel:${demo.phone.replace(/\s/g, "")}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 11.2 19a19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.4 2.1L8.1 9.6a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.4c.8.3 1.7.5 2.6.6A2 2 0 0 1 22 16.9Z"/></svg>
            ${demo.phone}
          </a>
          <a class="skills-contact-link" href="mailto:${demo.email}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v16H4z"/><path d="m22 6-10 7L2 6"/></svg>
            ${demo.email}
          </a>
        </div>
      </div>
    </div>

    <section class="skills-allocation" aria-label="Allokert til">
      <p class="skills-section-label">ALLOKERT TIL</p>
      <div class="skills-projects">
        ${demo.projects
          .map((p) => {
            const pillClass = p.state === "kritisk" ? "warn" : p.state === "rute" ? "ok" : "muted";
            const pillText = p.state === "kritisk" ? "Kritisk" : p.state === "rute" ? "rute" : "Normal";
            return `
              <div class="skills-project-card">
                <strong>${p.name}</strong>
                <span class="skills-project-pill ${pillClass}">${pillText}</span>
              </div>
            `;
          })
          .join("")}
      </div>
      ${demo.allocationWarning ? `<p class="skills-allocation-warning">${demo.allocationWarning}</p>` : ""}
    </section>

    <section class="skills-certs" aria-label="Sertifikater og kurs">
      <div class="skills-certs-header">
        <h3>Sertifikater og kurs</h3>
        <span>${summaryCounts.ok} OK · ${summaryCounts.warn} utl&oslash;pt · ${summaryCounts.muted} mangler</span>
      </div>
      <div class="skills-cert-list">
        ${demo.certs
          .map((item) => {
            const expires = item.expiresAt ? formatNorwegianDate(item.expiresAt) : "—";
            const expiresLabel = item.expiresAt ? `Utløpsdato: ${formatNorwegianShortDate(item.expiresAt)}` : "Utløpsdato: —";
            const canRemind = item.status !== "ok";
            return `
              <article class="skills-cert-card ${item.status}">
                <div class="skills-cert-card-top">
                  <div>
                    <strong>${item.label}</strong>
                    <span>${expiresLabel}</span>
                  </div>
                  <span class="skills-cert-pill ${item.status}">${item.pill}</span>
                </div>
                ${item.note ? `<p class="skills-cert-note">${item.note}</p>` : ""}
                ${
                  canRemind
                    ? `<button type="button" class="skills-remind" data-remind="${item.label}">
                         <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>
                         SEND P&Aring;MINNELSE
                       </button>`
                    : ""
                }
              </article>
            `;
          })
          .join("")}
      </div>
    </section>

    <div class="skills-drawer-footer">
      <button type="button" data-go-planner>SE I RESSURSPLANLEGGER</button>
    </div>
  `;

  skillsDrawerBody.querySelectorAll("[data-remind]").forEach((button) => {
    button.addEventListener("click", () => {
      button.textContent = "PÅMINNELSE SENDT";
      button.setAttribute("disabled", "true");
    });
  });

  skillsDrawerBody.querySelector("[data-go-planner]")?.addEventListener("click", () => {
    closeSkillsDrawer();
    showPage("plannerPage");
  });

  skillsDrawer.classList.add("open");
  skillsDrawer.setAttribute("aria-hidden", "false");
}

pageLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showPage(link.dataset.pageLink);
    renderProjects();
  });
});

// Initial render for default view (in case projects is first opened later).
renderProjects();

projectsSearch?.addEventListener("input", () => {
  renderProjects();
});

projectFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeProjectFilter = button.dataset.projectFilter ?? "all";
    projectFilterButtons.forEach((b) => b.classList.toggle("active", b === button));
    renderProjects();
  });
});

projectsGrid?.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const detail = target.closest(".project-detail");
  if (!detail) return;

  const card = target.closest("[data-project-name]");
  const name = card?.getAttribute("data-project-name");
  const project = projects.find((p) => p.name === name);
  if (project) openProjectDetail(project);
});

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  if (target.closest("[data-close-project-detail]")) closeProjectDetail();
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  closeProjectDetail();
});

function closeAllocationMenu({ keepAllocation = false } = {}) {
  allocationMenu?.remove();
  allocationMenu = null;

  if (!keepAllocation) {
    activeAllocation = null;
    plannerResourceColumn?.querySelectorAll(".add-allocation").forEach((button) => button.classList.remove("active"));
  }
}

function closeAllocationDialog() {
  allocationDialog?.remove();
  allocationDialog = null;
}

function openProjectOverlapDialog(personName) {
  closeAllocationDialog();

  const dialog = document.createElement("div");
  dialog.className = "allocation-dialog";
  dialog.setAttribute("aria-hidden", "false");

  dialog.innerHTML = `
    <div class="allocation-dialog-backdrop" data-close-dialog></div>
    <div class="allocation-dialog-panel" role="dialog" aria-modal="true" aria-label="Overlappende tildelinger">
      <div class="allocation-dialog-kicker">Ny tildeling: ${personName}</div>
      <div class="allocation-dialog-card">
        <header class="allocation-dialog-header">
          <span class="allocation-dialog-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></svg>
          </span>
          <h2>Overlappende tildelinger</h2>
        </header>

        <div class="allocation-dialog-body">
          <div class="allocation-dialog-item">
            <strong>Dokken kontorbygg</strong>
            <span>09 april, 2026 - 31 mai, 2026</span>
          </div>

          <p class="allocation-dialog-warning">
            Tildelingen du prøver å legge til, overlapper med følgende eksisterende tildelinger:
          </p>

          <div class="allocation-dialog-item">
            <strong>Marineholmen kai</strong>
            <span>06 april, 2026 - 14 april, 2026</span>
          </div>
        </div>

        <footer class="allocation-dialog-actions">
          <button class="allocation-dialog-button secondary" type="button" data-close-dialog>AVBRYT</button>
          <div class="allocation-dialog-primary">
            <button class="allocation-dialog-button primary" type="button" data-replace-allocation>ERSTATT</button>
            <span class="allocation-dialog-hint">Fjern overlappende eksisterende tildelinger og legg til ny tildeling</span>
          </div>
        </footer>
      </div>
    </div>
  `;

  document.body.appendChild(dialog);
  allocationDialog = dialog;

  dialog.addEventListener("click", (event) => {
    const target = event.target;
    const close = target.closest("[data-close-dialog]");
    if (close) {
      closeAllocationDialog();
      closeAllocationMenu({ keepAllocation: false });
      return;
    }

    const replace = target.closest("[data-replace-allocation]");
    if (replace) {
      closeAllocationDialog();
      closeAllocationMenu({ keepAllocation: false });
    }
  });
}

function openAllocationMenu(anchorButton, rowIndex) {
  closeAllocationMenu();
  if (!anchorButton) return;

  const rect = anchorButton.getBoundingClientRect();
  const menu = document.createElement("div");
  menu.className = "allocation-popover";
  menu.setAttribute("role", "menu");
  menu.innerHTML = `
    <div class="allocation-popover-title">Velg type</div>
    <div class="allocation-popover-list">
      ${allocationOptions
        .map(
          (option) => `
            <button class="allocation-option" type="button" role="menuitem" data-allocation-id="${option.id}">
              <span class="allocation-icon" aria-hidden="true">${option.icon}</span>
              <span class="allocation-label">${option.label}</span>
            </button>
          `,
        )
        .join("")}
    </div>
  `;

  menu.style.left = `${Math.min(window.innerWidth - 12, Math.max(12, rect.left + rect.width / 2))}px`;
  menu.style.top = `${Math.min(window.innerHeight - 12, Math.max(12, rect.bottom + 10))}px`;
  menu.style.transform = "translateX(-50%)";
  document.body.appendChild(menu);
  allocationMenu = menu;

  const handleDocumentClick = (event) => {
    if (allocationMenu?.contains(event.target) || anchorButton.contains(event.target)) return;
    closeAllocationMenu();
    document.removeEventListener("click", handleDocumentClick, true);
  };

  document.addEventListener("click", handleDocumentClick, true);

  menu.addEventListener("click", (event) => {
    const button = event.target.closest("[data-allocation-id]");
    if (!button) return;

    const option = allocationOptions.find((item) => item.id === button.dataset.allocationId);
    if (!option) return;

    if (option.id === "project") {
      closeAllocationMenu({ keepAllocation: false });
      openProjectOverlapDialog(plannerRows[rowIndex]?.name ?? "Ukjent");
      return;
    }

    activeAllocation = { rowIndex, option };
    plannerResourceColumn?.querySelectorAll(".add-allocation").forEach((item, index) => {
      item.classList.toggle("active", index === rowIndex);
    });

    closeAllocationMenu({ keepAllocation: true });
  });
}

function buildPlanner() {
  if (!plannerWeekHeader || !plannerResourceColumn || !plannerCalendarGrid) return;

  const visibleDayCount = visibleWeeks * 7;

  plannerWeekHeader.textContent = "";
  plannerResourceColumn.textContent = "";
  plannerCalendarGrid.textContent = "";
  resourcePlanner?.style.setProperty("--planner-days", visibleDayCount);
  resourcePlanner?.style.setProperty("--planner-rows", plannerRows.length);
  resourcePlanner?.setAttribute("data-weeks", String(visibleWeeks));
  activeAllocation = null;

  weekLabels.slice(0, visibleWeeks).forEach((week) => {
    const weekGroup = document.createElement("div");
    weekGroup.className = "week-group";
    weekGroup.style.gridColumn = `span ${week.span}`;
    weekGroup.innerHTML = `<span><strong>${week.label}</strong>${week.month}</span>`;
    plannerWeekHeader.appendChild(weekGroup);
  });

  dayLabels.slice(0, visibleDayCount).forEach((day) => {
    const dayHead = document.createElement("div");
    dayHead.className = day === "9." ? "day-head today" : "day-head";
    dayHead.textContent = day;
    plannerWeekHeader.appendChild(dayHead);
  });

  plannerRows.forEach((row) => {
    const person = document.createElement("div");
    person.className = "resource-person";
    person.innerHTML = `
      <div>
        <strong>${row.name}</strong>
        <span>${row.role}</span>
      </div>
      <button class="add-allocation" aria-label="Ny allokering for ${row.name}" title="Ny allokering">+</button>
    `;
    plannerResourceColumn.appendChild(person);

    row.pattern.slice(0, visibleDayCount).forEach((label, index) => {
      const cell = document.createElement("div");
      cell.className = `plan-cell ${row.colors[index]}`;
      cell.textContent = label || "-";
      plannerCalendarGrid.appendChild(cell);
    });
  });
}

buildPlanner();
buildSkillsTable();

skillsGrid?.addEventListener("scroll", syncSkillsScroll, { passive: true });

skillsSearch?.addEventListener("input", () => {
  buildSkillsTable(skillsSearch.value);
});

plannerResourceColumn?.addEventListener("click", (event) => {
  const button = event.target.closest(".add-allocation");
  if (!button) return;

  const buttons = Array.from(plannerResourceColumn.querySelectorAll(".add-allocation"));
  const rowIndex = buttons.indexOf(button);
  if (rowIndex < 0) return;

  const isTogglingSame = activeAllocation?.rowIndex === rowIndex && allocationMenu === null;
  if (isTogglingSame) {
    activeAllocation = null;
    button.classList.remove("active");
    return;
  }

  openAllocationMenu(button, rowIndex);
});

plannerCalendarGrid?.addEventListener("click", (event) => {
  if (!activeAllocation) return;
  const cell = event.target.closest(".plan-cell");
  if (!cell) return;

  const visibleDayCount = visibleWeeks * 7;
  const cellIndex = Array.from(plannerCalendarGrid.querySelectorAll(".plan-cell")).indexOf(cell);
  if (cellIndex < 0) return;

  const rowIndex = Math.floor(cellIndex / visibleDayCount);
  if (rowIndex !== activeAllocation.rowIndex) return;

  const option = activeAllocation.option;
  cell.className = `plan-cell ${option.color}`;
  cell.textContent = option.shortLabel;
  closeAllocationMenu({ keepAllocation: false });
});

weekCountButtons.forEach((button) => {
  button.addEventListener("click", () => {
    visibleWeeks = Number(button.dataset.weekCount);
    weekCountButtons.forEach((item) => item.classList.toggle("active", item === button));
    buildPlanner();
  });
});

detailButton?.addEventListener("click", () => {
  attentionDrawer?.classList.add("open");
  attentionDrawer?.setAttribute("aria-hidden", "false");
});

drawerCloseButtons.forEach((button) => {
  button.addEventListener("click", () => {
    attentionDrawer?.classList.remove("open");
    attentionDrawer?.setAttribute("aria-hidden", "true");
    closeSkillsDrawer();
  });
});

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  if (target.closest("[data-close-skills-drawer]")) {
    closeSkillsDrawer();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  closeSkillsDrawer();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeAllocationDialog();
    closeAllocationMenu();
    attentionDrawer?.classList.remove("open");
    attentionDrawer?.setAttribute("aria-hidden", "true");
  }
});
