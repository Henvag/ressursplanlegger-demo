const detailButton = document.querySelector(".text-button");
const attentionDrawer = document.querySelector("#attentionDrawer");
const drawerCloseButtons = document.querySelectorAll("[data-close-drawer]");
const pageLinks = document.querySelectorAll("[data-page-link]");
const pageViews = document.querySelectorAll(".page-view");
const plannerWeekHeader = document.querySelector("#plannerWeekHeader");
const plannerResourceColumn = document.querySelector("#plannerResourceColumn");
const plannerCalendarGrid = document.querySelector("#plannerCalendarGrid");
const weekCountButtons = document.querySelectorAll("[data-week-count]");
const resourcePlanner = document.querySelector(".resource-planner");
let visibleWeeks = 3;

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

function showPage(pageId) {
  pageViews.forEach((page) => {
    page.classList.toggle("active", page.id === pageId);
  });

  pageLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.pageLink === pageId);
  });
}

pageLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showPage(link.dataset.pageLink);
  });
});

function buildPlanner() {
  if (!plannerWeekHeader || !plannerResourceColumn || !plannerCalendarGrid) return;

  const visibleDayCount = visibleWeeks * 7;

  plannerWeekHeader.textContent = "";
  plannerResourceColumn.textContent = "";
  plannerCalendarGrid.textContent = "";
  resourcePlanner?.style.setProperty("--planner-days", visibleDayCount);
  resourcePlanner?.style.setProperty("--planner-rows", plannerRows.length);
  resourcePlanner?.setAttribute("data-weeks", String(visibleWeeks));

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
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    attentionDrawer?.classList.remove("open");
    attentionDrawer?.setAttribute("aria-hidden", "true");
  }
});
