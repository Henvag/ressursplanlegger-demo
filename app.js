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
let allocationMenu = null;
let activeAllocation = null;

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

function closeAllocationMenu({ keepAllocation = false } = {}) {
  allocationMenu?.remove();
  allocationMenu = null;

  if (!keepAllocation) {
    activeAllocation = null;
    plannerResourceColumn?.querySelectorAll(".add-allocation").forEach((button) => button.classList.remove("active"));
  }
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
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeAllocationMenu();
    attentionDrawer?.classList.remove("open");
    attentionDrawer?.setAttribute("aria-hidden", "true");
  }
});
