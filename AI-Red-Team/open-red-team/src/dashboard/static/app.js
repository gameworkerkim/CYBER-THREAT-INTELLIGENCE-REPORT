"use strict";

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const TOKEN_KEY = "ort_dashboard_token";
const authHeaders = () => {
  const token = localStorage.getItem(TOKEN_KEY) ?? "";
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ---------- tabs ---------- */
$$(".tab").forEach((btn) =>
  btn.addEventListener("click", () => {
    $$(".tab").forEach((b) => b.classList.remove("active"));
    $$(".panel").forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    $(`#panel-${btn.dataset.tab}`).classList.add("active");
    if (btn.dataset.tab === "audit") loadAudit();
    if (btn.dataset.tab === "config") loadConfig();
    if (btn.dataset.tab === "skills") loadSkills();
  }),
);

/* ---------- health ---------- */
async function loadHealth() {
  try {
    const res = await fetch("/api/health", { headers: authHeaders() });
    if (res.status === 401) {
      $("#backend-text").textContent = "unauthorized — set token";
      $("#backend-dot").className = "dot warn";
      promptToken();
      return;
    }
    const h = await res.json();
    $("#provider-badge").textContent = `${h.provider} / ${h.model}`;
    $("#backend-text").textContent = `LLM backend: ${h.backend} · ${h.skills} skills`;
    $("#backend-dot").className = `dot ${h.backend === "ok" ? "good" : "bad"}`;
    $("#skills-count").textContent = `(${h.skills})`;
  } catch (e) {
    $("#backend-text").textContent = "api unreachable";
    $("#backend-dot").className = "dot bad";
  }
}

function promptToken() {
  const token = localStorage.getItem(TOKEN_KEY);
  const next = prompt("Dashboard API token (ORT_DASHBOARD_TOKEN):", token ?? "");
  if (next !== null) {
    if (next === "") localStorage.removeItem(TOKEN_KEY);
    else localStorage.setItem(TOKEN_KEY, next);
    loadHealth();
    loadSkills();
  }
}

/* ---------- chat (SSE) ---------- */
function addBubble(role, text, skills) {
  const box = $("#chat-box");
  const div = document.createElement("div");
  div.className = `bubble ${role}`;
  if (skills && skills.length) {
    const chips = document.createElement("div");
    chips.className = "chips";
    skills.forEach((s) => {
      const c = document.createElement("span");
      c.className = "chip";
      c.textContent = s;
      chips.appendChild(c);
    });
    div.appendChild(chips);
  }
  const pre = document.createElement("div");
  pre.className = "bubble-text";
  pre.textContent = text;
  div.appendChild(pre);
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
  return pre;
}

async function sendChat() {
  const input = $("#chat-input");
  const message = input.value.trim();
  if (!message) return;
  input.value = "";
  $("#btn-send").disabled = true;
  $("#chat-status").textContent = "thinking…";

  addBubble("user", message);

  const assistant = addBubble("assistant", "", null);
  assistant.textContent = "";
  let buf = "";

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ message }),
  });
  if (res.status === 401) {
    assistant.textContent = "unauthorized — set the dashboard token";
    promptToken();
    finishSend();
    return;
  }
  if (!res.ok || !res.body) {
    assistant.textContent = `error: HTTP ${res.status}`;
    finishSend();
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  const handleEvent = (event, data) => {
    let payload = {};
    try { payload = JSON.parse(data); } catch { payload = {}; }
    if (event === "delta") {
      buf += payload.text ?? "";
      assistant.textContent = buf;
      $("#chat-box").scrollTop = $("#chat-box").scrollHeight;
    } else if (event === "done") {
      if (payload.matchedSkills?.length) {
        const chips = assistant.parentElement.querySelector(".chips") ?? document.createElement("div");
        if (!chips.className) chips.className = "chips";
        payload.matchedSkills.forEach((s) => {
          if (![...chips.children].some((c) => c.textContent === s)) {
            const c = document.createElement("span");
            c.className = "chip";
            c.textContent = s;
            chips.appendChild(c);
          }
        });
        assistant.parentElement.insertBefore(chips, assistant);
      }
    } else if (event === "error") {
      assistant.textContent = `error: ${payload.message ?? "unknown"}`;
    }
  };

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let idx;
    while ((idx = buf.indexOf("\n\n")) >= 0) {
      const raw = buf.slice(0, idx);
      buf = buf.slice(idx + 2);
      let event = "message";
      let data = "";
      for (const line of raw.split("\n")) {
        if (line.startsWith("event:")) event = line.slice(6).trim();
        else if (line.startsWith("data:")) data += line.slice(5).trim();
      }
      handleEvent(event, data);
    }
  }
  finishSend();
}

function finishSend() {
  $("#btn-send").disabled = false;
  $("#chat-status").textContent = "idle";
}

$("#btn-send").addEventListener("click", sendChat);
$("#chat-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendChat();
  }
});
$("#btn-reset").addEventListener("click", async () => {
  await fetch("/api/reset", { method: "POST", headers: authHeaders() });
  $("#chat-box").innerHTML = "";
});

/* ---------- skills ---------- */
let allSkills = [];

async function loadSkills() {
  const res = await fetch("/api/skills", { headers: authHeaders() });
  if (!res.ok) return;
  allSkills = await res.json();
  const categories = [...new Set(allSkills.map((s) => s.category))].sort();
  const select = $("#skill-category");
  select.innerHTML = '<option value="">All categories</option>' +
    categories.map((c) => `<option value="${esc(c)}">${esc(c)}</option>`).join("");
  renderSkills();
}

function renderSkills() {
  const q = $("#skill-search").value.toLowerCase();
  const cat = $("#skill-category").value;
  const rows = allSkills
    .filter((s) => (cat ? s.category === cat : true))
    .filter((s) => {
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.triggers.some((t) => t.toLowerCase().includes(q))
      );
    })
    .map(
      (s) => `<tr data-name="${esc(s.name)}">
        <td><a href="#" class="skill-link">${esc(s.name)}</a></td>
        <td><span class="chip">${esc(s.category)}</span></td>
        <td>${esc(s.description)}</td>
        <td>${s.triggers.slice(0, 5).map((t) => `<span class="chip dim">${esc(t)}</span>`).join(" ")}${s.triggers.length > 5 ? " …" : ""}</td>
      </tr>`,
    )
    .join("");
  $("#skills-table tbody").innerHTML = rows;
  $$(".skill-link").forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      showSkill(a.closest("tr").dataset.name);
    }),
  );
}

async function showSkill(name) {
  const res = await fetch(`/api/skills/${encodeURIComponent(name)}`, { headers: authHeaders() });
  if (!res.ok) return;
  const skill = await res.json();
  $("#detail-name").textContent = `${skill.frontmatter.name} — ${skill.frontmatter.category}`;
  $("#detail-body").textContent = `---\nname: ${skill.frontmatter.name}\ndescription: ${skill.frontmatter.description}\ntriggers:\n${skill.frontmatter.triggers.map((t) => `  - ${t}`).join("\n")}\ncategory: ${skill.frontmatter.category}\n---\n\n${skill.body}`;
  $("#skill-detail").classList.remove("hidden");
}

$("#skill-detail").addEventListener("click", (e) => {
  if (e.target === $("#skill-detail") || e.target.id === "detail-close") {
    $("#skill-detail").classList.add("hidden");
  }
});
$("#skill-search").addEventListener("input", renderSkills);
$("#skill-category").addEventListener("change", renderSkills);

/* ---------- audit ---------- */
async function loadAudit() {
  const res = await fetch("/api/audit", { headers: authHeaders() });
  const data = await res.json();
  $("#audit-note").textContent = data.file ? `Audit log: ${data.file}` : "Audit log not configured (ORT_AUDIT_LOG).";
  $("#audit-table tbody").innerHTML = (data.entries ?? [])
    .map(
      (e) => `<tr>
        <td>${esc(e.ts)}</td>
        <td>${esc(e.provider)} / ${esc(e.model)}</td>
        <td>${(e.matchedSkills ?? []).map((s) => `<span class="chip">${esc(s)}</span>`).join(" ")}</td>
        <td>${e.promptChars} → ${e.responseChars}</td>
      </tr>`,
    )
    .join("");
}

/* ---------- config ---------- */
async function loadConfig() {
  const res = await fetch("/api/config", { headers: authHeaders() });
  if (!res.ok) return;
  const cfg = await res.json();
  $("#config-table tbody").innerHTML = Object.entries(cfg)
    .map(
      ([k, v]) => `<tr><td><strong>${esc(k)}</strong></td><td>${esc(typeof v === "boolean" ? (v ? "on" : "off") : String(v))}</td></tr>`,
    )
    .join("");
}

loadHealth();
loadSkills();
