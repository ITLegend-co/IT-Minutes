const STORAGE_KEY = "itMeetingMinutesDraftV1";
const cloneData = (value) => {
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
};
const state = cloneData(DEFAULT_MEETING);
let allCollapsed = false;
let firebaseRecords = [];
let latestFirebaseId = "";
let currentFirebaseId = "";
let firebaseAutoLoaded = false;

const elements = {
  form: document.getElementById("meetingForm"),
  meetingTitle: document.getElementById("meetingTitle"),
  preparedBy: document.getElementById("preparedBy"),
  meetingDate: document.getElementById("meetingDate"),
  meetingTime: document.getElementById("meetingTime"),
  attendance: document.getElementById("attendance"),
  objective: document.getElementById("objective"),
  taskList: document.getElementById("taskList"),
  taskTemplate: document.getElementById("taskTemplate"),
  statusFilter: document.getElementById("statusFilter"),
  sectionFilter: document.getElementById("sectionFilter"),
  searchInput: document.getElementById("searchInput"),
  minutesOutput: document.getElementById("minutesOutput"),
  summaryStrip: document.getElementById("summaryStrip"),
  recordsSelect: document.getElementById("recordsSelect"),
  loadSelectedRecordBtn: document.getElementById("loadSelectedRecordBtn"),
  refreshRecordsBtn: document.getElementById("refreshRecordsBtn"),
  loadLatestDataBtn: document.getElementById("loadLatestDataBtn"),
  importJsonInput: document.getElementById("importJsonInput"),
  dataStatus: document.getElementById("dataStatus"),
  downloadJsonBtn: document.getElementById("downloadJsonBtn"),
  saveFirebaseBtn: document.getElementById("saveFirebaseBtn"),
  saveFirebaseTopBtn: document.getElementById("saveFirebaseTopBtn"),
  saveFirebaseOutputBtn: document.getElementById("saveFirebaseOutputBtn"),
  firebaseEmail: document.getElementById("firebaseEmail"),
  firebasePassword: document.getElementById("firebasePassword"),
  firebaseSignInBtn: document.getElementById("firebaseSignInBtn"),
  firebaseSignOutBtn: document.getElementById("firebaseSignOutBtn"),
  firebaseAuthStatus: document.getElementById("firebaseAuthStatus")
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalize(value) {
  return String(value ?? "").trim();
}

function slug(value) {
  return normalize(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "meeting-minutes";
}

function formatDateForDisplay(dateValue) {
  if (!dateValue) return "-";
  const date = new Date(dateValue + "T00:00:00");
  if (Number.isNaN(date.getTime())) return dateValue;
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function resetGeneratedOutput() {
  elements.minutesOutput.innerHTML = `
    <div class="empty-state">
      <p class="eyebrow">Ready</p>
      <h3>Your minutes will appear here.</h3>
      <p>Click <strong>Generate</strong> after updating the meeting details and task list.</p>
    </div>`;
}

function setDataStatus(message) {
  if (elements.dataStatus) elements.dataStatus.textContent = message;
}

function cleanMeetingData(data) {
  const cleaned = {
    title: normalize(data?.title) || "I.T Meeting",
    preparedBy: normalize(data?.preparedBy) || "Prepared by: IT Legend",
    date: normalize(data?.date) || todayIso(),
    time: normalize(data?.time),
    attendance: normalize(data?.attendance),
    objective: normalize(data?.objective),
    tasks: []
  };

  cleaned.tasks = Array.isArray(data?.tasks) ? data.tasks.map(task => ({
    section: normalize(task.section) || "IT Support",
    pic: normalize(task.pic),
    task: normalize(task.task) || "Untitled task",
    status: normalize(task.status) || "Still In Progress",
    description: normalize(task.description),
    instruction: normalize(task.instruction),
    taskDate: normalize(task.taskDate),
    deadline: normalize(task.deadline),
    extendedDeadline: normalize(task.extendedDeadline),
    dateComplete: normalize(task.dateComplete),
    comment: normalize(task.comment)
  })) : [];

  if (normalize(data?.firebaseId)) cleaned.firebaseId = normalize(data.firebaseId);

  return cleaned;
}

function replaceStateWith(data, sourceLabel = "meeting record") {
  const cleaned = cleanMeetingData(data);
  Object.keys(state).forEach(key => delete state[key]);
  Object.assign(state, cleaned);
  populateMeetingDetails();
  renderTasks();
  refreshSummaryStrip();
  resetGeneratedOutput();
  setDataStatus(`Loaded: ${sourceLabel}`);
}

function getFirebaseStore() {
  if (window.ITMinutesFirebase) return Promise.resolve(window.ITMinutesFirebase);
  if (window.ITMinutesFirebaseReady) return window.ITMinutesFirebaseReady;

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Firebase did not initialize. Check firebase-config.js and internet connection.")), 10000);

    window.addEventListener("it-minutes-firebase-ready", (event) => {
      clearTimeout(timeout);
      resolve(event.detail || window.ITMinutesFirebase);
    }, { once: true });
  });
}

function setAuthStatus(message) {
  if (elements.firebaseAuthStatus) elements.firebaseAuthStatus.textContent = message;
}

function firebaseErrorMessage(error) {
  const raw = String(error?.message || error || "Unknown Firebase error");
  if (raw.includes("Permission denied") || raw.includes("permission_denied")) {
    return "Permission denied. Please sign in or check Firebase Realtime Database rules.";
  }
  if (raw.includes("auth/invalid-credential") || raw.includes("auth/user-not-found") || raw.includes("auth/wrong-password")) {
    return "Invalid Firebase email or password.";
  }
  return raw;
}

function meetingLabel(record) {
  const date = record.date ? formatDateForDisplay(record.date) : "No date";
  return `${date} — ${record.title || record.id || "Meeting Record"}`;
}

function populateRecordsSelect() {
  if (!elements.recordsSelect) return;

  if (!firebaseRecords.length) {
    elements.recordsSelect.innerHTML = `<option value="">No Firebase record found</option>`;
    return;
  }

  elements.recordsSelect.innerHTML = firebaseRecords.map(record => `
    <option value="${escapeHtml(record.id)}">${escapeHtml(meetingLabel(record))}</option>`).join("");

  if (currentFirebaseId) elements.recordsSelect.value = currentFirebaseId;
  else if (latestFirebaseId) elements.recordsSelect.value = latestFirebaseId;
}

async function loadFirebaseRecords({ autoLoadLatest = false, showAlert = false } = {}) {
  try {
    setDataStatus("Loading Firebase records...");
    const store = await getFirebaseStore();
    const result = await store.listMeetings();
    firebaseRecords = Array.isArray(result.records) ? result.records : [];
    latestFirebaseId = result.latestId || firebaseRecords[0]?.id || "";
    populateRecordsSelect();
    setDataStatus(firebaseRecords.length ? `${firebaseRecords.length} Firebase record(s) found` : "No Firebase record found");

    if (autoLoadLatest && latestFirebaseId) {
      firebaseAutoLoaded = true;
      await loadFirebaseRecordById(latestFirebaseId, "latest Firebase record");
    }
  } catch (error) {
    console.warn(error);
    firebaseRecords = [];
    latestFirebaseId = "";
    if (elements.recordsSelect) elements.recordsSelect.innerHTML = `<option value="">Firebase not loaded</option>`;
    const message = firebaseErrorMessage(error);
    setDataStatus(message.includes("Permission denied") ? "Sign in required" : "Firebase not loaded");
    if (showAlert) alert(message);
  }
}

async function loadFirebaseRecordById(id, label = "Firebase record") {
  if (!id) {
    alert("Please select a Firebase meeting record first.");
    return;
  }

  try {
    setDataStatus("Loading meeting data...");
    const store = await getFirebaseStore();
    const data = await store.getMeeting(id);
    const record = firebaseRecords.find(item => item.id === id);
    currentFirebaseId = id;
    replaceStateWith(data, record?.title || label);
    if (elements.recordsSelect) elements.recordsSelect.value = id;
    setDataStatus(`Loaded from Firebase: ${record?.title || data.title || id}`);
  } catch (error) {
    console.error(error);
    setDataStatus("Failed to load Firebase record");
    alert(firebaseErrorMessage(error));
  }
}

function loadSelectedRecord() {
  const id = elements.recordsSelect?.value || "";
  loadFirebaseRecordById(id, "selected Firebase record");
}

function loadLatestData() {
  if (latestFirebaseId) {
    loadFirebaseRecordById(latestFirebaseId, "latest Firebase record");
    return;
  }
  loadFirebaseRecords({ autoLoadLatest: true, showAlert: true });
}

function currentMeetingData() {
  collectMeetingDetails();
  const data = cleanMeetingData(state);
  if (currentFirebaseId) data.firebaseId = currentFirebaseId;
  return data;
}

function suggestedDataFilename() {
  const data = currentMeetingData();
  return `${data.date || todayIso()}-${slug(data.title)}.json`;
}

function downloadMeetingJson() {
  const data = currentMeetingData();
  downloadBlob(JSON.stringify(data, null, 2), suggestedDataFilename(), "application/json;charset=utf-8");
  flashButton(elements.downloadJsonBtn, "Downloaded");
}

async function saveMeetingToFirebase() {
  try {
    const data = currentMeetingData();
    setDataStatus("Saving to Firebase...");
    const store = await getFirebaseStore();
    const result = await store.saveMeeting(currentFirebaseId, data);
    currentFirebaseId = result.id;
    setDataStatus("Saved to Firebase");
    [elements.saveFirebaseBtn, elements.saveFirebaseTopBtn, elements.saveFirebaseOutputBtn].filter(Boolean).forEach(btn => flashButton(btn, "Saved"));
    await loadFirebaseRecords();
    if (elements.recordsSelect) elements.recordsSelect.value = currentFirebaseId;
  } catch (error) {
    console.error(error);
    setDataStatus("Failed to save");
    alert(firebaseErrorMessage(error));
  }
}

async function signInFirebase() {
  const email = normalize(elements.firebaseEmail?.value);
  const password = elements.firebasePassword?.value || "";

  if (!email || !password) {
    alert("Please enter your Firebase email and password.");
    return;
  }

  try {
    setAuthStatus("Signing in...");
    const store = await getFirebaseStore();
    await store.signIn(email, password);
    if (elements.firebasePassword) elements.firebasePassword.value = "";
    setAuthStatus(`Signed in as ${email}`);
    await loadFirebaseRecords({ autoLoadLatest: !firebaseAutoLoaded });
  } catch (error) {
    console.error(error);
    setAuthStatus("Sign in failed");
    alert(firebaseErrorMessage(error));
  }
}

async function signOutFirebase() {
  try {
    const store = await getFirebaseStore();
    await store.signOutUser();
    currentFirebaseId = "";
    setAuthStatus("Signed out");
    setDataStatus("Signed out from Firebase");
  } catch (error) {
    console.error(error);
    alert(firebaseErrorMessage(error));
  }
}

async function initializeFirebaseConnection() {
  try {
    const store = await getFirebaseStore();
    store.onAuthChanged((user) => {
      if (user) {
        setAuthStatus(`Signed in as ${user.email || "Firebase user"}`);
        loadFirebaseRecords({ autoLoadLatest: !firebaseAutoLoaded });
      } else {
        setAuthStatus("Not signed in");
      }
    });

    // This will also work if your Realtime Database rules allow public read.
    await loadFirebaseRecords({ autoLoadLatest: true });
  } catch (error) {
    console.warn(error);
    setDataStatus("Firebase not ready");
    setAuthStatus("Firebase not ready");
  }
}


function importJsonFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      currentFirebaseId = normalize(data.firebaseId);
      replaceStateWith(data, file.name);
    } catch (error) {
      console.error(error);
      alert("Invalid JSON file. Please select a meeting data JSON file exported from this website.");
    } finally {
      event.target.value = "";
    }
  };
  reader.readAsText(file);
}

function splitIntoBullets(text) {
  const raw = normalize(text);
  if (!raw) return [];
  return raw
    .split(/\n+/)
    .map(line => line.replace(/^\s*\d+[.)-]?\s*/, "").replace(/^[-•]\s*/, "").trim())
    .filter(Boolean);
}

function makeBadge(status) {
  const value = normalize(status) || "No Status";
  let tone = "neutral";
  if (/complete|resolved|done/i.test(value)) tone = "success";
  if (/progress|monitor/i.test(value)) tone = "info";
  if (/pending|hold|delay/i.test(value)) tone = "warning";
  if (/urgent|overdue|issue/i.test(value)) tone = "danger";
  return `<span class="badge ${tone}">${escapeHtml(value)}</span>`;
}

function collectMeetingDetails() {
  state.title = normalize(elements.meetingTitle.value);
  state.preparedBy = normalize(elements.preparedBy.value);
  state.date = normalize(elements.meetingDate.value);
  state.time = normalize(elements.meetingTime.value);
  state.attendance = normalize(elements.attendance.value);
  state.objective = normalize(elements.objective.value);
}

function populateMeetingDetails() {
  elements.meetingTitle.value = state.title || "";
  elements.preparedBy.value = state.preparedBy || "";
  elements.meetingDate.value = state.date || "";
  elements.meetingTime.value = state.time || "";
  elements.attendance.value = state.attendance || "";
  elements.objective.value = state.objective || "";
}

function getFilteredTasks() {
  const status = elements.statusFilter.value;
  const section = elements.sectionFilter.value;
  const search = normalize(elements.searchInput.value).toLowerCase();

  return state.tasks
    .map((task, index) => ({ ...task, originalIndex: index }))
    .filter(task => status === "All" || task.status === status)
    .filter(task => section === "All" || task.section === section)
    .filter(task => {
      if (!search) return true;
      return [task.pic, task.task, task.description, task.instruction, task.comment, task.section]
        .join(" ")
        .toLowerCase()
        .includes(search);
    });
}

function updateTaskPreview(card, task) {
  card.querySelector(".task-section-label").textContent = task.section || "Task";
  card.querySelector(".task-title-preview").textContent = task.task || "Untitled task";
  card.querySelector(".task-meta-preview").textContent = `${task.pic || "No PIC"} · ${task.status || "No status"}`;
}

function renderTasks() {
  const filteredTasks = getFilteredTasks();
  elements.taskList.innerHTML = "";

  if (!filteredTasks.length) {
    elements.taskList.innerHTML = `
      <div class="empty-state small">
        <h3>No task found</h3>
        <p>Try changing the filter or add a new task update.</p>
      </div>`;
    return;
  }

  filteredTasks.forEach(task => {
    const fragment = elements.taskTemplate.content.cloneNode(true);
    const card = fragment.querySelector(".task-card");
    card.dataset.index = task.originalIndex;

    updateTaskPreview(card, task);
    if (allCollapsed) card.classList.add("collapsed");

    card.querySelectorAll("[data-field]").forEach(input => {
      const field = input.dataset.field;
      input.value = task[field] ?? "";
      input.addEventListener("input", () => {
        state.tasks[task.originalIndex][field] = input.value;
        updateTaskPreview(card, state.tasks[task.originalIndex]);
        refreshSummaryStrip();
      });
      input.addEventListener("change", () => {
        state.tasks[task.originalIndex][field] = input.value;
        updateTaskPreview(card, state.tasks[task.originalIndex]);
        refreshSummaryStrip();
      });
    });

    card.querySelector(".toggle-task").addEventListener("click", () => {
      card.classList.toggle("collapsed");
      card.querySelector(".toggle-task").textContent = card.classList.contains("collapsed") ? "Expand" : "Collapse";
    });

    card.querySelector(".remove-task").addEventListener("click", () => {
      const confirmed = confirm("Remove this task from the meeting minutes?");
      if (!confirmed) return;
      state.tasks.splice(task.originalIndex, 1);
      renderTasks();
      refreshSummaryStrip();
    });

    card.querySelector(".duplicate-task").addEventListener("click", () => {
      const copy = cloneData(state.tasks[task.originalIndex]);
      copy.task = `${copy.task || "Task"} Copy`;
      state.tasks.splice(task.originalIndex + 1, 0, copy);
      renderTasks();
      refreshSummaryStrip();
    });

    elements.taskList.appendChild(fragment);
  });
}

function blankTask(section = "IT Support") {
  return {
    section,
    pic: "",
    task: "",
    status: "Still In Progress",
    description: "",
    instruction: "",
    taskDate: "",
    deadline: "",
    extendedDeadline: "",
    dateComplete: "",
    comment: ""
  };
}

function addTask(section) {
  state.tasks.push(blankTask(section));
  elements.statusFilter.value = "All";
  elements.sectionFilter.value = "All";
  elements.searchInput.value = "";
  renderTasks();
  refreshSummaryStrip();
  requestAnimationFrame(() => {
    const cards = elements.taskList.querySelectorAll(".task-card");
    cards[cards.length - 1]?.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

function getStats() {
  const total = state.tasks.length;
  const completed = state.tasks.filter(t => /complete|resolved|done/i.test(t.status)).length;
  const inProgress = state.tasks.filter(t => /progress|monitor/i.test(t.status)).length;
  const pending = state.tasks.filter(t => /pending|hold|delay/i.test(t.status)).length;
  const support = state.tasks.filter(t => t.section === "IT Support").length;
  const project = state.tasks.filter(t => t.section === "Project").length;
  return { total, completed, inProgress, pending, support, project };
}

function refreshSummaryStrip() {
  const stats = getStats();
  elements.summaryStrip.innerHTML = `
    <div><strong>${stats.total}</strong><span>Total Items</span></div>
    <div><strong>${stats.completed}</strong><span>Completed</span></div>
    <div><strong>${stats.inProgress}</strong><span>In Progress / Monitoring</span></div>
    <div><strong>${stats.pending}</strong><span>Pending / On Hold</span></div>
    <div><strong>${stats.support}</strong><span>IT Support</span></div>
    <div><strong>${stats.project}</strong><span>Projects</span></div>
  `;
}

function timelineLine(task) {
  const parts = [];
  if (task.taskDate) parts.push(`<span><strong>Task Date:</strong> ${escapeHtml(task.taskDate)}</span>`);
  if (task.deadline) parts.push(`<span><strong>Deadline:</strong> ${escapeHtml(task.deadline)}</span>`);
  if (task.extendedDeadline) parts.push(`<span><strong>Extended:</strong> ${escapeHtml(task.extendedDeadline)}</span>`);
  if (task.dateComplete) parts.push(`<span><strong>Completed:</strong> ${escapeHtml(task.dateComplete)}</span>`);
  return parts.length ? `<div class="timeline-line">${parts.join("")}</div>` : "";
}

function renderTaskMinutes(task, number) {
  const bullets = splitIntoBullets(task.description);
  const instructionBullets = splitIntoBullets(task.instruction);
  const commentBullets = splitIntoBullets(task.comment);

  return `
    <section class="minute-item">
      <div class="minute-item-head">
        <div>
          <p class="eyebrow">Item ${number} · ${escapeHtml(task.section || "General")}</p>
          <h4>${escapeHtml(task.task || "Untitled task")}</h4>
          <p class="muted"><strong>Person In Charge:</strong> ${escapeHtml(task.pic || "-")}</p>
        </div>
        ${makeBadge(task.status)}
      </div>

      ${bullets.length ? `
        <div class="minute-block">
          <h5>Discussion / Progress Update</h5>
          <ul>${bullets.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </div>` : ""}

      ${instructionBullets.length ? `
        <div class="minute-block highlight-block">
          <h5>Instruction / Decision / Latest Update</h5>
          <ul>${instructionBullets.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </div>` : ""}

      ${timelineLine(task)}

      ${commentBullets.length ? `
        <div class="minute-block note-block">
          <h5>Comment / Note</h5>
          <ul>${commentBullets.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </div>` : ""}
    </section>`;
}

function renderSectionMinutes(sectionName, tasks) {
  if (!tasks.length) return "";
  return `
    <section class="minutes-section">
      <h3>${escapeHtml(sectionName)}</h3>
      ${tasks.map((task, index) => renderTaskMinutes(task, index + 1)).join("")}
    </section>`;
}

function renderDecisions() {
  const decisions = state.tasks
    .filter(t => normalize(t.instruction) || normalize(t.comment))
    .map(t => ({ title: t.task, pic: t.pic, instruction: t.instruction, comment: t.comment }));

  if (!decisions.length) {
    return `<p class="muted">No specific decision or instruction recorded yet.</p>`;
  }

  return `<ul class="decision-list">
    ${decisions.map(item => `
      <li>
        <strong>${escapeHtml(item.title || "Task")}</strong>
        <span>${escapeHtml(item.pic || "-")}</span>
        ${item.instruction ? `<p>${escapeHtml(item.instruction)}</p>` : ""}
        ${item.comment ? `<p>${escapeHtml(item.comment)}</p>` : ""}
      </li>`).join("")}
  </ul>`;
}

function renderActionItems() {
  const actionable = state.tasks.filter(t => !/complete|resolved|done/i.test(t.status));
  if (!actionable.length) {
    return `<p class="muted">No outstanding action items. Completed items may remain under observation if required.</p>`;
  }

  return `
    <div class="action-table-wrap">
      <table class="action-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Action Item</th>
            <th>PIC</th>
            <th>Target / Deadline</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${actionable.map((task, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${escapeHtml(task.task || "-")}</td>
              <td>${escapeHtml(task.pic || "-")}</td>
              <td>${escapeHtml(task.extendedDeadline || task.deadline || "To be confirmed")}</td>
              <td>${escapeHtml(task.status || "-")}</td>
            </tr>`).join("")}
        </tbody>
      </table>
    </div>`;
}

function generateMinutesHtml() {
  collectMeetingDetails();
  const stats = getStats();
  const sections = [...new Set(state.tasks.map(task => task.section || "General"))];
  const details = {
    title: state.title || "I.T Meeting",
    date: formatDateForDisplay(state.date),
    time: state.time || "-",
    attendance: state.attendance || "-",
    preparedBy: state.preparedBy || "-",
    objective: state.objective || "-"
  };

  return `
    <div class="minutes-document">
      <header class="minutes-title">
        <p class="eyebrow">Minutes of Meeting</p>
        <h2>${escapeHtml(details.title)}</h2>
        <p>${escapeHtml(details.objective)}</p>
      </header>

      <section class="minutes-section compact-section">
        <h3>1. Meeting Details</h3>
        <div class="details-grid">
          <div><strong>Date</strong><span>${escapeHtml(details.date)}</span></div>
          <div><strong>Time</strong><span>${escapeHtml(details.time)}</span></div>
          <div><strong>Prepared By</strong><span>${escapeHtml(details.preparedBy)}</span></div>
          <div><strong>Attendance</strong><span>${escapeHtml(details.attendance)}</span></div>
        </div>
      </section>

      <section class="minutes-section compact-section">
        <h3>2. Summary Overview</h3>
        <div class="mini-stats">
          <div><strong>${stats.total}</strong><span>Total Items</span></div>
          <div><strong>${stats.completed}</strong><span>Completed</span></div>
          <div><strong>${stats.inProgress}</strong><span>In Progress / Monitoring</span></div>
          <div><strong>${stats.pending}</strong><span>Pending / On Hold</span></div>
        </div>
      </section>

      <section class="minutes-section compact-section">
        <h3>3. Matters Discussed & Task Updates</h3>
      </section>

      ${sections.map(section => renderSectionMinutes(section, state.tasks.filter(task => (task.section || "General") === section))).join("")}

      <section class="minutes-section">
        <h3>4. Key Decisions / Instructions</h3>
        ${renderDecisions()}
      </section>

      <section class="minutes-section">
        <h3>5. Action Items</h3>
        ${renderActionItems()}
      </section>

      <section class="minutes-section conclusion-section">
        <h3>6. Conclusion</h3>
        <p>The meeting reviewed the current IT support matters, project updates, outstanding follow-up items, and required actions. Completed items will remain under observation where necessary, while pending and in-progress tasks will be followed up according to the assigned person in charge and target timeline.</p>
      </section>
    </div>`;
}

function generateMinutes() {
  elements.minutesOutput.innerHTML = generateMinutesHtml();
  refreshSummaryStrip();
  elements.minutesOutput.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function copyMinutes() {
  const text = elements.minutesOutput.innerText.trim();
  if (!text || text.includes("Your minutes will appear here")) {
    generateMinutes();
  }
  await navigator.clipboard.writeText(elements.minutesOutput.innerText.trim());
  flashButton(document.getElementById("copyBtn"), "Copied");
}

function printMinutes() {
  if (elements.minutesOutput.innerText.includes("Your minutes will appear here")) generateMinutes();
  window.print();
}

function downloadBlob(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function documentHtml() {
  if (elements.minutesOutput.innerText.includes("Your minutes will appear here")) generateMinutes();
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${escapeHtml(state.title)}</title><style>${exportStyles()}</style></head><body>${elements.minutesOutput.innerHTML}</body></html>`;
}

function downloadHtml() {
  collectMeetingDetails();
  downloadBlob(documentHtml(), `${slug(state.title)}-${state.date || "date"}.html`, "text/html;charset=utf-8");
}

function downloadWord() {
  collectMeetingDetails();
  downloadBlob(documentHtml(), `${slug(state.title)}-${state.date || "date"}.doc`, "application/msword;charset=utf-8");
}

function exportStyles() {
  return `
    body{font-family:Arial,sans-serif;color:#111827;line-height:1.5;margin:32px;background:white}.minutes-document{max-width:900px;margin:auto}.eyebrow{text-transform:uppercase;letter-spacing:.12em;color:#2563eb;font-size:12px;font-weight:bold}.minutes-title{border-bottom:3px solid #111827;padding-bottom:20px;margin-bottom:24px}.minutes-title h2{font-size:30px;margin:4px 0 10px}.minutes-section{margin:22px 0;page-break-inside:avoid}.minutes-section h3{font-size:20px;border-bottom:1px solid #d1d5db;padding-bottom:8px}.details-grid,.mini-stats{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}.details-grid div,.mini-stats div{border:1px solid #d1d5db;padding:12px;border-radius:8px}.details-grid strong,.mini-stats strong{display:block;color:#111827}.details-grid span,.mini-stats span{display:block;color:#374151}.minute-item{border:1px solid #d1d5db;border-radius:10px;padding:16px;margin:14px 0}.minute-item-head{display:flex;justify-content:space-between;gap:16px}.minute-item h4{font-size:18px;margin:4px 0}.badge{border:1px solid #9ca3af;border-radius:999px;padding:5px 10px;font-size:12px;font-weight:bold;height:max-content}.badge.success{background:#dcfce7;color:#166534}.badge.info{background:#dbeafe;color:#1d4ed8}.badge.warning{background:#fef3c7;color:#92400e}.badge.danger{background:#fee2e2;color:#991b1b}.minute-block{margin-top:12px}.minute-block h5{margin:0 0 6px}.highlight-block{background:#eff6ff;border-left:4px solid #2563eb;padding:10px}.note-block{background:#f9fafb;border-left:4px solid #6b7280;padding:10px}.timeline-line{display:flex;flex-wrap:wrap;gap:10px;margin-top:12px}.timeline-line span{background:#f3f4f6;border-radius:999px;padding:6px 10px}.decision-list li{margin-bottom:12px}.decision-list span{display:block;color:#6b7280}.action-table{width:100%;border-collapse:collapse}.action-table th,.action-table td{border:1px solid #d1d5db;padding:8px;text-align:left}.action-table th{background:#f3f4f6}`;
}

function saveDraft() {
  collectMeetingDetails();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  flashButton(document.getElementById("saveDraftBtn"), "Saved");
}

function loadDraft() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    alert("No saved draft found in this browser.");
    return;
  }
  const parsed = JSON.parse(stored);
  currentFirebaseId = normalize(parsed.firebaseId);
  Object.assign(state, parsed);
  populateMeetingDetails();
  renderTasks();
  refreshSummaryStrip();
  flashButton(document.getElementById("loadDraftBtn"), "Loaded");
}

function resetAll() {
  const confirmed = confirm("Reset the form back to the default sample data?");
  if (!confirmed) return;
  currentFirebaseId = "";
  const fresh = cloneData(DEFAULT_MEETING);
  Object.keys(state).forEach(key => delete state[key]);
  Object.assign(state, fresh);
  populateMeetingDetails();
  renderTasks();
  refreshSummaryStrip();
  resetGeneratedOutput();
}

function flashButton(button, text) {
  const original = button.textContent;
  button.textContent = text;
  setTimeout(() => { button.textContent = original; }, 1400);
}

function bindEvents() {
  document.getElementById("addSupportBtn").addEventListener("click", () => addTask("IT Support"));
  document.getElementById("addProjectBtn").addEventListener("click", () => addTask("Project"));
  document.getElementById("collapseAllBtn").addEventListener("click", () => {
    allCollapsed = !allCollapsed;
    document.getElementById("collapseAllBtn").textContent = allCollapsed ? "Expand All" : "Collapse All";
    renderTasks();
  });
  document.getElementById("generateBtn").addEventListener("click", generateMinutes);
  document.getElementById("copyBtn").addEventListener("click", copyMinutes);
  document.getElementById("printBtn").addEventListener("click", printMinutes);
  document.getElementById("downloadHtmlBtn").addEventListener("click", downloadHtml);
  document.getElementById("downloadWordBtn").addEventListener("click", downloadWord);
  elements.downloadJsonBtn?.addEventListener("click", downloadMeetingJson);
  elements.saveFirebaseBtn?.addEventListener("click", saveMeetingToFirebase);
  elements.saveFirebaseTopBtn?.addEventListener("click", saveMeetingToFirebase);
  elements.saveFirebaseOutputBtn?.addEventListener("click", saveMeetingToFirebase);
  elements.firebaseSignInBtn?.addEventListener("click", signInFirebase);
  elements.firebaseSignOutBtn?.addEventListener("click", signOutFirebase);
  elements.loadSelectedRecordBtn?.addEventListener("click", loadSelectedRecord);
  elements.refreshRecordsBtn?.addEventListener("click", () => loadFirebaseRecords({ showAlert: true }));
  elements.loadLatestDataBtn?.addEventListener("click", loadLatestData);
  elements.importJsonInput?.addEventListener("change", importJsonFile);
  document.getElementById("saveDraftBtn").addEventListener("click", saveDraft);
  document.getElementById("loadDraftBtn").addEventListener("click", loadDraft);
  document.getElementById("resetBtn").addEventListener("click", resetAll);

  [elements.statusFilter, elements.sectionFilter, elements.searchInput].forEach(input => {
    input.addEventListener("input", renderTasks);
    input.addEventListener("change", renderTasks);
  });

  [elements.meetingTitle, elements.preparedBy, elements.meetingDate, elements.meetingTime, elements.attendance, elements.objective].forEach(input => {
    input.addEventListener("input", collectMeetingDetails);
  });
}

populateMeetingDetails();
renderTasks();
refreshSummaryStrip();
bindEvents();
initializeFirebaseConnection();
