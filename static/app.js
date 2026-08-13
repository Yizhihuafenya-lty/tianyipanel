(function () {
  "use strict";

  const ICON_TAGS = {
    refresh:
      '<path d="M21 12a9 9 0 0 1-9 9 9 9 0 0 1-9-9 9 9 0 0 1 9-9 9.9 9.9 0 0 1 7.6 3.8"/><path d="M21 3v5h-5"/>',
    gauge: '<path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>',
    activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    server:
      '<rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/>',
    folder:
      '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
    terminal:
      '<polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/>',
    command:
      '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
    search:
      '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
    save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>',
    key: '<path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"/>',
    "arrow-up":
      '<line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>',
    "corner-down-left":
      '<polyline points="9 10 4 15 9 20"/><path d="M20 4v7a4 4 0 0 1-4 4H4"/>',
    wrench:
      '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
    play: '<polygon points="5 3 19 12 5 21 5 3"/>',
    "log-in":
      '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>',
    package:
      '<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/>',
    copy: '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    power: '<path d="M12 2v10"/><path d="M18.4 6.6a9 9 0 1 1-12.77.04"/>',
    users:
      '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    trash:
      '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    square:
      '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>',
    "rotate-cw":
      '<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>',
    "file-text":
      '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
    home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    shield:
      '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1 1 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
    "hard-drive":
      '<line x1="22" x2="2" y1="12" y2="12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" x2="6.01" y1="16" y2="16"/><line x1="10" x2="10.01" y1="16" y2="16"/>',
    "memory-stick":
      '<path d="M6 19v-3"/><path d="M10 19v-3"/><path d="M14 19v-3"/><path d="M18 19v-3"/><path d="M8 11V9a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M8 11h8v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2z"/>',
    clock:
      '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    cpu: '<rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>'
    ,
    download:
      '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
    pause:
      '<rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/>',
    eye:
      '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    edit:
      '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>',
    boxes:
      '<path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z"/><path d="m7 16.5-4.74-2.85"/><path d="m7 16.5 5-3"/><path d="M7 16.5v5.17"/><path d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z"/><path d="m17 16.5-5-3"/><path d="m17 16.5 4.74-2.85"/><path d="M17 16.5v5.17"/><path d="M7.5 4.1 12 6.5l4.5-2.4a2 2 0 0 1 2 0l2.9 1.74a2 2 0 0 1 1 1.73v1.93a2 2 0 0 1-1 1.73l-2.9 1.74a2 2 0 0 1-2 0L12 10.5 7.1 12.87a2 2 0 0 1-2 0l-2.9-1.74A2 2 0 0 1 1.2 9.4V7.47a2 2 0 0 1 1-1.73l2.9-1.74a2 2 0 0 1 2 0Z"/>',
    link:
      '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    globe:
      '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
    flame:
      '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    "chevrons-left":
      '<polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/>',
    "chevrons-right":
      '<polyline points="9 17 14 12 9 7"/><polyline points="16 17 21 12 16 7"/>',
    database:
      '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/>',
    maximize:
      '<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>',
    upload:
      '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
    "folder-plus":
      '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/>',
    archive:
      '<rect x="2" y="3" width="20" height="5" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/>',
    unarchive:
      '<rect x="2" y="3" width="20" height="5" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M12 11v6"/><polyline points="9 14 12 17 15 14"/>'
  };

  const $ = (selector) => document.querySelector(selector);
  const modalRoot = $("#modalRoot");
  const toastWrap = $("#toastWrap");
  const state = {
    token: sessionStorage.getItem("panel_token") || "",
    verifyCode: "",
    page: "overview",
    system: null,
    processes: [],
    guardRules: [],
    runningProcs: [],
    toolbox: null,
    toolboxTab: "system",
    analytics: null,
    analyticsView: "realtime",
    tamper: null,
    tamperView: "anomalies",
    tamperEvents: [],
    tamperPermissions: [],
    containerData: null,
    containerTab: "containers",
    firewall: null,
    firewallTab: "ufw",
    fail2ban: null,
    modelsData: null,
    modelsTab: "local",
    modelJobsTimer: null,
    cronLines: [],
    sshEvents: [],
    apps: [],
    appsCategory: "all",
    theme: "deep",
    sidebarCollapsed: false,
    sidebarWidth: 224,
    services: [],
    files: null,
    logs: [],
    auditLogs: [],
    allowCommand: false,
    tokenModalOpen: false,
    refreshTimer: null,
    refreshBusy: false,
    dbData: null,
    dbEngine: "mysql",
    dbDatabases: [],
    dbBackups: [],
    backups: [],
    termSession: "", 
    termAlive: false,
    termTimer: null,
    term: null,
    termFit: null,
    termFullscreen: false
  };

  const QUICK_COMMANDS = [
    { label: "系统信息", command: "uname -a; uptime" },
    { label: "CPU 详情", command: "lscpu | head -n 20" },
    { label: "内存", command: "free -h" },
    { label: "时间时区", command: "timedatectl" },
    { label: "磁盘", command: "df -h" },
    { label: "磁盘 inode", command: "df -ih" },
    { label: "挂载列表", command: "findmnt | head -n 30" },
    { label: "网络", command: "ip -brief addr" },
    { label: "网络统计", command: "ss -s" },
    { label: "路由表", command: "ip route" },
    { label: "网卡统计", command: "ip -s link" },
    { label: "监听端口", command: "ss -tlnp" },
    { label: "启动时间", command: "who -b; last reboot | head -n 5" },
    { label: "最近登录", command: "last -n 10" },
    { label: "用户列表", command: "getent passwd | awk -F: '{print $1, $3, $7}'" },
    { label: "僵尸进程", command: "ps aux | awk '$8==\"Z\"' | head -n 20" },
    { label: "错误日志", command: "journalctl -p err -n 30 --no-pager" },
    { label: "开机自启", command: "systemctl list-unit-files --state=enabled --no-pager" },
    { label: "软件包数", command: "dpkg -l | wc -l" },
    { label: "环境变量", command: "env | sort" },
    { label: "CPU 前10", command: "ps aux --sort=-%cpu | head -n 10" },
    { label: "内存前10", command: "ps aux --sort=-%mem | head -n 10" },
    { label: "失败服务", command: "systemctl --failed --no-pager" }
  ];

  const urlToken = new URLSearchParams(location.search).get("token");
  if (urlToken) {
    state.token = urlToken;
    sessionStorage.setItem("panel_token", urlToken);
    history.replaceState(null, "", location.pathname);
  }
  const urlCode = location.pathname.match(/^\/(\d{6})$/);
  if (urlCode) {
    state.verifyCode = urlCode[1];
  }

  function icon(name) {
    return '<svg class="ic" aria-hidden="true" viewBox="0 0 24 24">' +
      (ICON_TAGS[name] || "") +
      "</svg>";
  }

  function renderIcons(root) {
    (root || document).querySelectorAll("i[data-icon]").forEach((el) => {
      el.innerHTML = icon(el.dataset.icon);
    });
  }

  function esc(value) {
    return String(value == null ? "" : value).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;"
        })[c]
    );
  }

  function formatBytes(value) {
    if (value == null || isNaN(value)) return "--";
    const units = ["B", "KB", "MB", "GB", "TB", "PB"];
    let num = Number(value);
    let unit = 0;
    while (num >= 1024 && unit < units.length - 1) {
      num /= 1024;
      unit += 1;
    }
    return (unit === 0 ? String(Math.round(num)) : num.toFixed(1)) + " " + units[unit];
  }

  function formatUptime(seconds) {
    if (!seconds) return "--";
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const parts = [];
    if (days) parts.push(days + " 天");
    if (hours) parts.push(hours + " 小时");
    if (mins || !parts.length) parts.push(mins + " 分");
    return parts.join(" ");
  }

  function barClass(percent) {
    if (percent >= 90) return "danger";
    if (percent >= 70) return "warn";
    return "";
  }

  function donut(percent, cls) {
    const p = Math.max(0, Math.min(100, Number(percent) || 0));
    const tone = p >= 90 ? " danger" : p >= 70 ? " warn" : "";
    return (
      '<div class="donut' +
      tone +
      (cls ? " " + cls : "") +
      '" style="background:conic-gradient(var(--donut-color) 0 ' +
      p +
      "%,var(--border-soft) " +
      p +
      '% 100%)"><div class="donut-hole"><span>' +
      Math.round(p) +
      "%</span></div></div>"
    );
  }

  function toast(message, type) {
    const el = document.createElement("div");
    el.className = "toast" + (type === "error" ? " error" : "");
    el.textContent = message;
    toastWrap.appendChild(el);
    setTimeout(() => el.remove(), 3400);
  }

  async function api(path, options) {
    const headers = Object.assign({}, (options && options.headers) || {});
    if (state.token) headers["X-Panel-Token"] = state.token;
    let res;
    try {
      res = await fetch(path, Object.assign({}, options, { headers }));
    } catch (err) {
      throw new Error("无法连接到面板服务");
    }
    if (res.status === 401) {
      showLoginModal();
      throw new Error("需要访问令牌");
    }
    if (!res.ok) {
      let message = res.statusText;
      let data = null;
      try {
        data = await res.json();
        message = data.message || data.error || message;
      } catch (err) {
        /* keep status text */
      }
      if (data && data.error === "password_required") {
        const password = await requestLocalPassword("此操作需要本机密码验证");
        if (password == null) throw new Error("已取消操作");
        let body = (options && options.body) || {};
        if (typeof body === "string") {
          try {
            const parsed = JSON.parse(body);
            parsed.password = password;
            body = JSON.stringify(parsed);
          } catch (err) {
            body = JSON.stringify({ password });
          }
        } else {
          body = JSON.stringify(
            Object.assign({}, body, { password })
          );
        }
        return api(path, Object.assign({}, options, { body }));
      }
      throw new Error(message);
    }
    return res.json();
  }

  function updateConn(ok, hostname) {
    const dot = $("#connDot");
    const text = $("#connText");
    dot.className = "status-dot " + (ok ? "ok" : "error");
    text.textContent = ok ? (hostname || "已连接") : "未连接";
  }

  function showConfirm(options) {
    const mask = document.createElement("div");
    mask.className = "modal-mask";
    mask.innerHTML =
      '<div class="modal">' +
      '<h3 class="modal-title">' + icon("shield") + esc(options.title || "确认操作") + "</h3>" +
      '<p class="modal-message">' + esc(options.message || "") + "</p>" +
      '<div class="modal-actions">' +
      '<button class="btn ghost" data-close>取消</button>' +
      '<button class="btn ' + (options.danger ? "danger" : "primary") + '" data-confirm>' +
      esc(options.confirmText || "确认") +
      "</button></div></div>";
    modalRoot.appendChild(mask);
    renderIcons(mask);

    const close = () => mask.remove();
    mask.querySelector("[data-close]").onclick = close;
    mask.addEventListener("click", (event) => {
      if (event.target === mask) close();
    });
    mask.querySelector("[data-confirm]").onclick = async (event) => {
      const btn = event.currentTarget;
      btn.disabled = true;
      try {
        await Promise.resolve(options.onConfirm());
        close();
      } catch (err) {
        btn.disabled = false;
        if (err.message !== "需要访问令牌") toast(err.message, "error");
      }
    };
  }

  function showLoginModal() {
    if (state.tokenModalOpen) return;
    state.tokenModalOpen = true;
    const mask = document.createElement("div");
    mask.className = "modal-mask";
    mask.innerHTML =
      '<div class="modal">' +
      '<h3 class="modal-title">' + icon("key") + "面板登录</h3>" +
      '<p class="modal-message">请输入访问验证码和服务器本机密码。</p>' +
      '<label class="form-label" for="loginCode">6 位访问验证码</label>' +
      '<input id="loginCode" class="modal-input" inputmode="numeric" maxlength="6" spellcheck="false" placeholder="端口后的 6 位验证码">' +
      '<label class="form-label" for="loginPassword">服务器本机密码</label>' +
      '<input id="loginPassword" class="modal-input" type="password" autocomplete="current-password" placeholder="本机密码">' +
      '<p class="login-error" id="loginError"></p>' +
      '<div class="modal-actions">' +
      '<button class="btn ghost" data-close>取消</button>' +
      '<button class="btn primary" data-confirm>登录</button>' +
      "</div></div>";
    modalRoot.appendChild(mask);
    renderIcons(mask);
    const codeInput = mask.querySelector("#loginCode");
    const passwordInput = mask.querySelector("#loginPassword");
    const errorEl = mask.querySelector("#loginError");
    if (state.verifyCode) codeInput.value = state.verifyCode;

    const close = () => {
      state.tokenModalOpen = false;
      mask.remove();
    };
    const submit = async () => {
      const code = codeInput.value.trim();
      const password = passwordInput.value;
      if (!code || !password) {
        errorEl.textContent = "请输入验证码和本机密码";
        return;
      }
      try {
        const data = await api("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, password })
        });
        state.token = data.token || "";
        sessionStorage.setItem("panel_token", state.token);
        close();
        await loadCurrent();
      } catch (err) {
        if (err.message !== "需要访问令牌") {
          errorEl.textContent = err.message;
        }
      }
    };
    mask.querySelector("[data-close]").onclick = close;
    mask.addEventListener("click", (event) => {
      if (event.target === mask) close();
    });
    mask.querySelector("[data-confirm]").onclick = submit;
    passwordInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") submit();
    });
    setTimeout(
      () => (state.verifyCode ? passwordInput : codeInput).focus(),
      50
    );
  }

  function showFileModal(title, content) {
    const mask = document.createElement("div");
    mask.className = "modal-mask";
    mask.innerHTML =
      '<div class="modal">' +
      '<h3 class="modal-title">' + icon("file-text") + esc(title) + "</h3>" +
      '<div class="file-viewer"></div>' +
      '<div class="modal-actions" style="margin-top:12px">' +
      '<button class="btn ghost" data-close>关闭</button></div></div>';
    mask.querySelector(".file-viewer").textContent = content;
    modalRoot.appendChild(mask);
    renderIcons(mask);
    mask.querySelector("[data-close]").onclick = () => mask.remove();
    mask.addEventListener("click", (event) => {
      if (event.target === mask) mask.remove();
    });
  }

  async function loadStatus() {
    try {
      const data = await api("/api/status");
      state.allowCommand = data.allow_command;
      updateConn(true, data.hostname);
      renderCommandState();
    } catch (err) {
      if (err.message !== "需要访问令牌") updateConn(false);
    }
  }

  function startAutoRefresh() {
    if (state.refreshTimer) {
      clearInterval(state.refreshTimer);
      state.refreshTimer = null;
    }
    const seconds = parseInt($("#refreshInterval").value, 10) || 0;
    if (seconds <= 0) return;
    state.refreshTimer = setInterval(() => {
      if (state.tokenModalOpen || document.hidden || state.refreshBusy) return;
      state.refreshBusy = true;
      loadCurrent(true).finally(() => {
        state.refreshBusy = false;
      });
    }, seconds * 1000);
  }

  function applyTheme(theme) {
    const valid = ["deep", "light", "ocean", "amber"];
    state.theme = valid.includes(theme) ? theme : "deep";
    document.body.dataset.theme = state.theme;
    const select = $("#themeSelect");
    if (select) select.value = state.theme;
    localStorage.setItem("panel_theme_v2", state.theme);
  }

  function setSidebarWidth(width) {
    const value = Math.max(180, Math.min(320, Number(width) || 224));
    state.sidebarWidth = value;
    const sidebar = document.querySelector(".sidebar");
    if (sidebar && !state.sidebarCollapsed) {
      sidebar.style.width = value + "px";
      sidebar.style.flexBasis = value + "px";
    }
    const range = $("#sidebarWidth");
    if (range) range.value = value;
    localStorage.setItem("panel_sidebar_width_v2", String(value));
  }

  function applySidebarState() {
    const sidebar = document.querySelector(".sidebar");
    if (!sidebar) return;
    sidebar.classList.toggle("collapsed", state.sidebarCollapsed);
    if (state.sidebarCollapsed) {
      sidebar.style.width = "64px";
      sidebar.style.flexBasis = "64px";
    } else {
      setSidebarWidth(state.sidebarWidth);
    }
    const toggle = $("#btnSidebarToggle");
    if (toggle) {
      const iconEl = toggle.querySelector("i[data-icon]");
      if (iconEl) {
        iconEl.dataset.icon = state.sidebarCollapsed
          ? "chevrons-right"
          : "chevrons-left";
      }
      renderIcons(toggle);
    }
    localStorage.setItem(
      "panel_sidebar_collapsed_v2",
      state.sidebarCollapsed ? "1" : "0"
    );
  }

  function toggleSidebar() {
    state.sidebarCollapsed = !state.sidebarCollapsed;
    applySidebarState();
  }

  async function loadOverview() {
    const data = await api("/api/system");
    state.system = data;
    updateConn(true, data.hostname);
    renderMetrics(data);
    renderSysTable(data);
    renderDisks(data.disks || []);
    renderNetwork(data.network || [], data.network_history || []);
    loadTrends();
  }

  function renderMetrics(data) {
    const memory = data.memory || {};
    const rootDisk =
      (data.disks || []).find((d) => d.mount === "/") || (data.disks || [])[0] || {};
    const cpu = data.cpu_percent == null ? null : Number(data.cpu_percent);
    const load = (data.loadavg || [0, 0, 0])[0];
    const power = data.power || {};
    const powerCard = renderPowerMetric(power);
    $("#metricGrid").innerHTML =
      '<div class="metric">' +
      '<div class="metric-head"><div class="metric-label">' + icon("cpu") + "CPU 使用率</div>" +
      donut(cpu || 0) +
      "</div>" +
      '<div class="metric-value">' + (cpu == null ? "--" : cpu.toFixed(1) + "%") +
      "<small> " + (data.cpu_cores || 0) + " 核</small></div>" +
      '<div class="metric-sub">负载 ' + (load || 0).toFixed(2) + "</div>" +
      "</div>" +
      '<div class="metric">' +
      '<div class="metric-head"><div class="metric-label">' + icon("memory-stick") + "内存</div>" +
      donut(memory.percent || 0) +
      "</div>" +
      '<div class="metric-value">' + formatBytes(memory.used) +
      "<small> / " + formatBytes(memory.total) + "</small></div>" +
      '<div class="metric-sub">可用 ' + formatBytes(memory.available) + "</div>" +
      "</div>" +
      '<div class="metric">' +
      '<div class="metric-head"><div class="metric-label">' + icon("hard-drive") + "磁盘</div>" +
      donut(rootDisk.percent || 0) +
      "</div>" +
      '<div class="metric-value">' + formatBytes(rootDisk.used) +
      "<small> / " + formatBytes(rootDisk.size) + "</small></div>" +
      '<div class="metric-sub">' + esc(rootDisk.mount || "/") + " 剩余 " + formatBytes(rootDisk.avail) + "</div>" +
      "</div>" +
      powerCard +
      '<div class="metric">' +
      '<div class="metric-head"><div class="metric-label">' + icon("clock") + "运行时间</div></div>" +
      '<div class="metric-value">' + esc(formatUptime(data.uptime)) + "</div>" +
      '<div class="metric-sub">进程 ' + (data.process_count || 0) + " 个</div></div>";
    renderIcons($("#metricGrid"));
  }

  function renderPowerMetric(power) {
    // 笔记本：显示电池容量与状态；非笔记本：显示市电
    if (!power || typeof power.is_battery !== "boolean") {
      return "";
    }
    if (power.is_battery) {
      const cap = power.capacity == null ? 0 : power.capacity;
      const statusText =
        power.status === "Charging" ? "充电中"
        : power.status === "Discharging" ? "使用电池"
        : power.status === "Full" ? "已充满"
        : "未知状态";
      const powerText = power.power_w != null ? " · " + power.power_w + " W" : "";
      return (
        '<div class="metric">' +
        '<div class="metric-head"><div class="metric-label">' + icon("power") + "电池</div>" +
        donut(cap) +
        "</div>" +
        '<div class="metric-value">' + cap + "%" +
        "<small>" + (power.online ? " 市电" : " 电池") + "</small></div>" +
        '<div class="metric-sub">' + statusText + powerText + "</div>" +
        "</div>"
      );
    }
    // 非笔记本：市电状态（无电池设备必然是市电供电）
    const onlineText =
      power.online === false ? "未接电源"
      : "市电供电";
    const powerText = power.power_w != null ? " · " + power.power_w + " W" : "";
    return (
      '<div class="metric">' +
      '<div class="metric-head"><div class="metric-label">' + icon("power") + "电源</div></div>" +
      '<div class="metric-value">' + onlineText + "</div>" +
      '<div class="metric-sub">' + (powerText || "无功耗数据") + "</div>" +
      "</div>"
    );
  }

  function renderSysTable(data) {
    const rows = [
      ["主机名", data.hostname],
      ["系统", data.distro],
      ["内核", data.kernel],
      ["架构", data.arch],
      ["Python", data.python],
      ["当前时间", data.time],
      ["平均负载", (data.loadavg || []).map((x) => x.toFixed(2)).join(" / ")]
    ];
    // 温度
    const temps = data.temperature || [];
    if (temps.length) {
      const tempText = temps
        .map((t) => t.name + " " + t.temp + "°C")
        .join(" · ");
      rows.push(["温度", tempText]);
    }
    // 电源状态
    const power = data.power || {};
    if (typeof power.is_battery === "boolean") {
      let powerText;
      if (power.is_battery) {
        powerText =
          "电池 " + (power.capacity == null ? "--" : power.capacity + "%") +
          " · " + (power.status || "未知");
        if (power.power_w != null) powerText += " · " + power.power_w + " W";
      } else {
        powerText = power.online === false ? "未接电源" : "市电供电";
        if (power.power_w != null) powerText += " · " + power.power_w + " W";
      }
      rows.push(["电源", powerText]);
    }
    $("#sysTable").innerHTML = rows
      .map(
        (row) =>
          '<tr><td class="muted">' +
          esc(row[0]) +
          '</td><td class="mono">' +
          esc(row[1]) +
          "</td></tr>"
      )
      .join("");
  }

  function renderDisks(disks) {
    const el = $("#diskList");
    if (!disks.length) {
      el.innerHTML = '<div class="muted">暂无磁盘数据</div>';
      return;
    }
    el.innerHTML = disks
      .slice(0, 8)
      .map(
        (disk) =>
          '<div class="disk-item">' +
          '<div class="disk-item-head"><strong title="' + esc(disk.mount) + '">' +
          esc(disk.mount) +
          '</strong><span>' +
          formatBytes(disk.used) +
          " / " +
          formatBytes(disk.size) +
          " (" +
          disk.percent +
          "%)</span></div>" +
          '<div class="disk-item-body">' +
          donut(disk.percent, "sm") +
          '<div class="disk-meta"><span>可用 ' +
          formatBytes(disk.avail) +
          "</span><span>已用 " +
          formatBytes(disk.used) +
          "</span></div></div></div>"
      )
      .join("");
  }

  function renderNetwork(networks, history) {
    const chart = $("#networkChart");
    if (history && history.length >= 2) {
      const width = 640;
      const height = 180;
      const pad = 10;
      const max = Math.max.apply(
        null,
        history.map((item) => Math.max(item.rx, item.tx, item.total)).concat([1])
      );
      const buildPoints = (key) =>
        history
          .map((item, index) => {
            const x =
              pad +
              (index / (history.length - 1)) * (width - pad * 2);
            const y =
              height -
              pad -
              (item[key] / max) * (height - pad * 2);
            return x.toFixed(1) + "," + y.toFixed(1);
          })
          .join(" ");
      const latest = history[history.length - 1];
      chart.innerHTML =
        '<svg class="line-chart" viewBox="0 0 ' +
        width +
        " " +
        height +
        '" preserveAspectRatio="none">' +
        '<line class="chart-grid" x1="' +
        pad +
        '" y1="' +
        (pad + (height - pad * 2) * 0.25) +
        '" x2="' +
        (width - pad) +
        '" y2="' +
        (pad + (height - pad * 2) * 0.25) +
        '"/>' +
        '<line class="chart-grid" x1="' +
        pad +
        '" y1="' +
        (pad + (height - pad * 2) * 0.5) +
        '" x2="' +
        (width - pad) +
        '" y2="' +
        (pad + (height - pad * 2) * 0.5) +
        '"/>' +
        '<line class="chart-grid" x1="' +
        pad +
        '" y1="' +
        (pad + (height - pad * 2) * 0.75) +
        '" x2="' +
        (width - pad) +
        '" y2="' +
        (pad + (height - pad * 2) * 0.75) +
        '"/>' +
        '<polyline class="chart-line rx" points="' +
        buildPoints("rx") +
        '"/>' +
        '<polyline class="chart-line tx" points="' +
        buildPoints("tx") +
        '"/>' +
        '<polyline class="chart-line total" points="' +
        buildPoints("total") +
        '"/></svg>' +
        '<div class="chart-legend">' +
        '<span><i class="legend-dot rx"></i>下载 ' +
        formatBytes(latest.rx) +
        "</span>" +
        '<span><i class="legend-dot tx"></i>上传 ' +
        formatBytes(latest.tx) +
        "</span>" +
        '<span><i class="legend-dot total"></i>总量 ' +
        formatBytes(latest.total) +
        "</span></div>";
    } else {
      chart.innerHTML = '<div class="analytics-empty">等待采样数据...</div>';
    }
    const el = $("#netList");
    if (!networks.length) {
      el.innerHTML = '<div class="muted">暂无网络数据</div>';
      return;
    }
    el.innerHTML = networks
      .map(
        (net) =>
          '<div class="net-item">' +
          '<div class="net-item-head"><strong>' +
          esc(net.interface) +
          "</strong><span>收 " +
          formatBytes(net.rx_bytes) +
          " · 发 " +
          formatBytes(net.tx_bytes) +
          "</span></div></div>"
      )
      .join("");
  }

  // ---- 资源趋势历史曲线 ----
  state.trendHours = 24;

  async function loadTrends() {
    try {
      const data = await api("/api/metrics/history?hours=" + state.trendHours);
      renderTrends(data.points || []);
    } catch (err) {
      if (err.message !== "需要访问令牌") toast(err.message, "error");
    }
  }

  function trendBuildSvg(points, seriesList, yMax) {
    const width = 640;
    const height = 160;
    const pad = 8;
    if (points.length < 2) {
      return '<div class="trend-empty">暂无历史数据，采样进行中（每 30 秒一次）…</div>';
    }
    const t0 = points[0].t;
    const t1 = points[points.length - 1].t;
    const span = Math.max(1, t1 - t0);
    let max = yMax;
    if (!max) {
      max = 0;
      points.forEach((p) => {
        seriesList.forEach((s) => {
          max = Math.max(max, Number(p[s.key]) || 0);
        });
      });
      max = Math.max(max, 1);
    }
    const toX = (t) => pad + ((t - t0) / span) * (width - pad * 2);
    const toY = (v) => height - pad - (Math.min(v, max) / max) * (height - pad * 2);
    let svg =
      '<svg class="line-chart trend-svg" viewBox="0 0 ' + width + " " + height +
      '" preserveAspectRatio="none">';
    for (let i = 1; i <= 3; i += 1) {
      const y = pad + ((height - pad * 2) * i) / 4;
      svg += '<line class="chart-grid" x1="' + pad + '" y1="' + y.toFixed(1) +
        '" x2="' + (width - pad) + '" y2="' + y.toFixed(1) + '"/>';
    }
    seriesList.forEach((s) => {
      const line = points
        .map((p) => toX(p.t).toFixed(1) + "," + toY(Number(p[s.key]) || 0).toFixed(1))
        .join(" ");
      if (s.fill) {
        svg += '<polygon class="chart-fill" style="fill:' + s.color + ';opacity:.12" points="' +
          pad + "," + (height - pad) + " " + line + " " + (width - pad) + "," + (height - pad) + '"/>';
      }
      svg += '<polyline class="chart-line" style="stroke:' + s.color + '" fill="none" stroke-width="1.6" points="' + line + '"/>';
    });
    svg += "</svg>";
    return svg;
  }

  function trendTimeLabels(points) {
    if (points.length < 2) return "";
    const fmt = (t) => {
      const d = new Date(t * 1000);
      const spanDays = state.trendHours > 48;
      const pad2 = (n) => (n < 10 ? "0" + n : "" + n);
      return spanDays
        ? d.getMonth() + 1 + "/" + d.getDate() + " " + pad2(d.getHours()) + ":00"
        : pad2(d.getHours()) + ":" + pad2(d.getMinutes());
    };
    return (
      '<div class="trend-axis"><span>' + fmt(points[0].t) + "</span><span>" +
      fmt(points[Math.floor(points.length / 2)].t) + "</span><span>" +
      fmt(points[points.length - 1].t) + "</span></div>"
    );
  }

  function renderTrends(points) {
    const cpuBox = $("#trendCpu");
    const memBox = $("#trendMem");
    const netBox = $("#trendNet");
    if (!cpuBox || !memBox || !netBox) return;
    cpuBox.innerHTML =
      trendBuildSvg(points, [{ key: "cpu", color: "#2dd4bf", fill: true }], 100) +
      trendTimeLabels(points);
    memBox.innerHTML =
      trendBuildSvg(points, [{ key: "mem", color: "#818cf8", fill: true }], 100) +
      trendTimeLabels(points);
    const last = points.length ? points[points.length - 1] : null;
    const legend = last
      ? '<div class="trend-legend"><span><i style="background:#34d399"></i>收 ' +
        formatBytes(last.net_in || 0) + "/s</span><span><i style=\"background:#f59e0b\"></i>发 " +
        formatBytes(last.net_out || 0) + "/s</span></div>"
      : "";
    netBox.innerHTML =
      trendBuildSvg(points, [
        { key: "net_in", color: "#34d399", fill: false },
        { key: "net_out", color: "#f59e0b", fill: false }
      ], 0) + legend + trendTimeLabels(points);
  }

  async function loadProcesses() {
    const data = await api("/api/processes");
    state.processes = data.processes || [];
    renderProcesses();
  }

  function renderProcesses() {
    const query = $("#procSearch").value.trim().toLowerCase();
    const kind = document
      .querySelector("#procFilter .seg.active")
      .dataset.kind;
    const list = state.processes.filter((p) => {
      if (kind !== "all" && p.kind !== kind) return false;
      if (!query) return true;
      return (
        String(p.pid).includes(query) ||
        String(p.user).toLowerCase().includes(query) ||
        String(p.comm).toLowerCase().includes(query) ||
        String(p.args).toLowerCase().includes(query)
      );
    });
    const sysCount = state.processes.filter((p) => p.kind === "system").length;
    const appCount = state.processes.length - sysCount;
    $("#procCount").textContent =
      "共 " +
      state.processes.length +
      " 个 · 系统 " +
      sysCount +
      " · 软件 " +
      appCount +
      " · 显示 " +
      list.length;
    if (!list.length) {
      $("#procBody").innerHTML =
        '<tr><td colspan="10" class="muted">没有匹配的进程</td></tr>';
      return;
    }
    const powerText = { high: "高", medium: "中", low: "低" };
    $("#procBody").innerHTML = list
      .map(
        (p) =>
          "<tr>" +
          '<td class="mono">' + p.pid + "</td>" +
          '<td><span class="state ' +
          (p.kind === "system" ? "system" : "app") +
          '">' +
          (p.kind === "system" ? "系统" : "软件") +
          "</span></td>" +
          "<td>" + esc(p.user) + "</td>" +
          '<td class="mono">' + p.cpu.toFixed(1) + "</td>" +
          '<td class="mono">' +
          formatBytes(p.rss * 1024) +
          ' <small class="muted">' +
          p.mem.toFixed(1) +
          "%</small></td>" +
          '<td><span class="power ' +
          esc(p.power) +
          '" title="按 CPU 占用估算，非实际瓦数">' +
          (powerText[p.power] || "--") +
          "</span></td>" +
          "<td>" + esc(p.state) + "</td>" +
          '<td class="mono" title="CPU 累计 ' + esc(p.cpu_time) + '">' +
          esc(p.elapsed) +
          "</td>" +
          '<td class="cmd mono" title="' + esc(p.args || p.comm) + '">' +
          esc(p.args || p.comm) +
          "</td>" +
          '<td class="col-actions"><div class="act">' +
          '<button class="icon-btn" data-kill="' + p.pid + '" data-sig="TERM" title="终止进程">' +
          icon("square") +
          '</button><button class="icon-btn danger" data-kill="' +
          p.pid +
          '" data-sig="KILL" title="强制终止">' +
          icon("trash") +
          "</button></div></td></tr>"
      )
      .join("");
    renderIcons($("#procBody"));
  }

  function killProcess(pid, sig) {
    const proc = state.processes.find((p) => p.pid === pid);
    const name = proc ? proc.comm : String(pid);
    showConfirm({
      title: (sig === "KILL" ? "强制终止" : "终止") + "进程 " + pid,
      message:
        "确定要对进程 " + pid + "（" + name + "）发送 " +
        (sig === "KILL" ? "SIGKILL" : "SIGTERM") + " 信号吗？",
      danger: sig === "KILL",
      confirmText: sig === "KILL" ? "强制终止" : "终止",
      onConfirm: async () => {
        await api("/api/processes/kill", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pid, signal: sig })
        });
        toast("已向进程 " + pid + " 发送 " + sig);
        await loadProcesses();
      }
    });
  }

  async function loadServices() {
    const data = await api("/api/services");
    state.services = data.services || [];
    renderServices();
  }

  function serviceStateClass(service) {
    if (service.sub === "failed") return "failed";
    if (service.active === "active") return "active";
    if (service.active === "inactive" || service.active === "dead") return "inactive";
    return "activating";
  }

  function renderServices() {
    const query = $("#serviceSearch").value.trim().toLowerCase();
    const list = state.services.filter((s) => {
      if (!query) return true;
      return (
        String(s.unit).toLowerCase().includes(query) ||
        String(s.description).toLowerCase().includes(query)
      );
    });
    $("#serviceCount").textContent =
      "共 " + state.services.length + " 个服务，显示 " + list.length + " 个";
    if (!list.length) {
      $("#serviceBody").innerHTML =
        '<tr><td colspan="6" class="muted">没有匹配的服务</td></tr>';
      return;
    }
    $("#serviceBody").innerHTML = list
      .map(
        (s) =>
          "<tr>" +
          '<td class="mono">' + esc(s.unit) + "</td>" +
          "<td>" + esc(s.description) + "</td>" +
          '<td><span class="state ' + serviceStateClass(s) + '">' + esc(s.active) + "</span></td>" +
          "<td>" + esc(s.sub) + "</td>" +
          "<td>" + esc(s.enabled || "--") + "</td>" +
          '<td class="col-actions"><div class="act">' +
          '<button class="icon-btn" data-service="' + esc(s.unit) + '" data-action="start" title="启动">' +
          icon("play") +
          '</button><button class="icon-btn" data-service="' +
          esc(s.unit) +
          '" data-action="restart" title="重启">' +
          icon("rotate-cw") +
          '</button><button class="icon-btn danger" data-service="' +
          esc(s.unit) +
          '" data-action="stop" title="停止">' +
          icon("square") +
          "</button></div></td></tr>"
      )
      .join("");
    renderIcons($("#serviceBody"));
  }

  function serviceAction(unit, action) {
    const labels = { start: "启动", stop: "停止", restart: "重启", reload: "重载" };
    showConfirm({
      title: labels[action] + "服务",
      message: "确定要" + labels[action] + "服务 " + unit + " 吗？",
      danger: action === "stop",
      confirmText: labels[action],
      onConfirm: async () => {
        const result = await api("/api/services/action", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ unit, action })
        });
        if (result.ok) {
          toast(labels[action] + "成功：" + unit);
        } else {
          toast(labels[action] + "失败：" + (result.stderr || "未知错误"), "error");
        }
        await loadServices();
      }
    });
  }

  async function loadGuard() {
    const data = await api("/api/guard");
    state.guardRules = data.rules || [];
    renderGuard();
  }

  function renderGuard() {
    const rules = state.guardRules || [];
    $("#guardCount").textContent = rules.length + " 条规则";
    if (!rules.length) {
      $("#guardBody").innerHTML =
        '<tr><td colspan="8" class="muted">还没有守护规则</td></tr>';
      return;
    }
    $("#guardBody").innerHTML = rules
      .map((rule) => {
        return (
          "<tr>" +
          "<td>" + esc(rule.name) + "</td>" +
          '<td class="cmd mono" title="' + esc(rule.pattern) + '">' +
          esc(rule.pattern) +
          "</td>" +
          '<td><span class="state ' +
          (rule.running ? "active" : "inactive") +
          '">' +
          (rule.running ? "运行中" : "已停止") +
          "</span></td>" +
          '<td class="mono">' + (rule.pid || "--") + "</td>" +
          '<td><span class="state ' +
          (rule.auto ? "active" : "inactive") +
          '">' +
          (rule.auto ? "守护中" : "未守护") +
          "</span></td>" +
          '<td class="mono">' + (rule.restarts || 0) + "</td>" +
          '<td class="mono">' +
          (rule.last_restart ? esc(rule.last_restart) : "--") +
          "</td>" +
          '<td class="col-actions"><div class="act">' +
          '<button class="icon-btn" data-guard-start="' +
          esc(rule.id) +
          '" title="立即拉起">' +
          icon("play") +
          '</button><button class="icon-btn" data-guard-toggle="' +
          esc(rule.id) +
          '" title="' +
          (rule.auto ? "关闭守护" : "开启守护") +
          '">' +
          icon("shield") +
          '</button><button class="icon-btn danger" data-guard-remove="' +
          esc(rule.id) +
          '" title="删除规则">' +
          icon("trash") +
          "</button></div></td></tr>"
        );
      })
      .join("");
    renderIcons($("#guardBody"));
  }

  function showGuardModal() {
    const mask = document.createElement("div");
    mask.className = "modal-mask";
    mask.innerHTML =
      '<div class="modal">' +
      '<h3 class="modal-title">' + icon("shield") + "添加守护规则</h3>" +
      '<label class="form-label" for="guardName">名称</label>' +
      '<input id="guardName" class="modal-input" placeholder="例如 nginx">' +
      '<label class="form-label" for="guardPattern">匹配规则</label>' +
      '<input id="guardPattern" class="modal-input" placeholder="进程名或命令行片段">' +
      '<label class="form-label" for="guardCommand">拉起命令</label>' +
      '<input id="guardCommand" class="modal-input" placeholder="例如 systemctl start nginx">' +
      '<label class="form-check"><input id="guardAuto" type="checkbox"> 启用自动守护</label>' +
      '<div class="modal-actions">' +
      '<button class="btn ghost" data-close>取消</button>' +
      '<button class="btn primary" data-save>保存</button>' +
      "</div></div>";
    modalRoot.appendChild(mask);
    renderIcons(mask);
    const close = () => mask.remove();
    mask.querySelector("[data-close]").onclick = close;
    mask.addEventListener("click", (event) => {
      if (event.target === mask) close();
    });
    mask.querySelector("[data-save]").onclick = async () => {
      const name = mask.querySelector("#guardName").value.trim();
      const pattern = mask.querySelector("#guardPattern").value.trim();
      const command = mask.querySelector("#guardCommand").value.trim();
      const auto = mask.querySelector("#guardAuto").checked;
      if (!name || !pattern || !command) {
        toast("请填写完整", "error");
        return;
      }
      try {
        await api("/api/guard/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, pattern, command, auto })
        });
        toast("守护规则已添加");
        close();
        await loadGuard();
      } catch (err) {
        if (err.message !== "需要访问令牌") toast(err.message, "error");
      }
    };
    setTimeout(() => mask.querySelector("#guardName").focus(), 50);
  }

  async function openRunningProcModal() {
    let data;
    try {
      data = await api("/api/processes");
    } catch (err) {
      if (err.message !== "需要访问令牌") toast(err.message, "error");
      return;
    }
    state.runningProcs = (data.processes || [])
      .filter((p) => p.kind === "app")
      .sort((a, b) => (b.rss || 0) - (a.rss || 0))
      .slice(0, 500);
    const mask = document.createElement("div");
    mask.className = "modal-mask";
    mask.innerHTML =
      '<div class="modal">' +
      '<h3 class="modal-title">' + icon("activity") + "从运行进程添加</h3>" +
      '<input id="runningProcSearch" class="modal-input" placeholder="搜索进程名或命令行">' +
      '<div class="proc-picker" id="runningProcList"></div>' +
      '<div class="modal-actions"><button class="btn ghost" data-close>关闭</button></div>' +
      "</div>";
    modalRoot.appendChild(mask);
    renderIcons(mask);
    const close = () => mask.remove();
    const list = mask.querySelector("#runningProcList");
    const search = mask.querySelector("#runningProcSearch");
    const render = () => renderRunningProcs(list, search.value);
    mask.querySelector("[data-close]").onclick = close;
    mask.addEventListener("click", (event) => {
      if (event.target === mask) close();
    });
    search.addEventListener("input", render);
    list.addEventListener("click", (event) => {
      const btn = event.target.closest("button[data-proc-index]");
      if (btn) {
        addGuardFromProcess(
          state.runningProcs[Number(btn.dataset.procIndex)],
          close
        );
      }
    });
    render();
    setTimeout(() => search.focus(), 50);
  }

  function renderRunningProcs(listEl, query) {
    const q = query.trim().toLowerCase();
    const filtered = [];
    state.runningProcs.forEach((proc, index) => {
      if (
        !q ||
        String(proc.comm).toLowerCase().includes(q) ||
        String(proc.args || "").toLowerCase().includes(q)
      ) {
        filtered.push({ proc, index });
      }
    });
    if (!filtered.length) {
      listEl.innerHTML = '<div class="proc-picker-empty">没有匹配进程</div>';
      return;
    }
    listEl.innerHTML = filtered
      .map(
        ({ proc, index }) =>
          '<div class="proc-picker-item">' +
          '<div class="proc-picker-main">' +
          "<strong>" + esc(proc.comm) + "</strong>" +
          '<span class="cmd mono">' + esc(proc.args || proc.comm) + "</span>" +
          "<small class=\"muted\">PID " +
          proc.pid +
          " · " +
          esc(proc.user) +
          " · " +
          formatBytes((proc.rss || 0) * 1024) +
          "</small></div>" +
          '<button class="btn sm primary" data-proc-index="' +
          index +
          '" title="一键加入守护">' +
          icon("shield") +
          " 加入</button></div>"
      )
      .join("");
    renderIcons(listEl);
  }

  function guardPatternFromProcess(proc) {
    const args = String(proc.args || "").trim();
    if (args && args.length <= 200) return args;
    return String(proc.comm || "app").slice(0, 200);
  }

  function deriveGuardCommand(proc) {
    const cgroup = proc.cgroup || "";
    const match = cgroup.match(/\/system\.slice\/([^/]+?\.service)/);
    if (match && match[1] && !match[1].startsWith("systemd-")) {
      return "systemctl restart " + match[1];
    }
    const args = String(proc.args || "").trim();
    if (args) return "nohup " + args + " >/dev/null 2>&1 &";
    return "nohup " + String(proc.comm || "app") + " >/dev/null 2>&1 &";
  }

  async function addGuardFromProcess(proc, close) {
    const name = String(proc.comm || "proc-" + proc.pid).slice(0, 50);
    const pattern = guardPatternFromProcess(proc);
    const command = deriveGuardCommand(proc);
    try {
      const result = await api("/api/guard/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, pattern, command, auto: true })
      });
      toast("已加入守护：" + result.name);
      if (close) close();
      await loadGuard();
    } catch (err) {
      if (err.message !== "需要访问令牌") toast(err.message, "error");
    }
  }

  function guardStart(id) {
    const rule = state.guardRules.find((item) => item.id === id);
    if (!rule) return;
    showConfirm({
      title: "立即拉起",
      message: "确定要立即执行守护规则“" + rule.name + "”的拉起命令吗？",
      confirmText: "立即拉起",
      onConfirm: async () => {
        const result = await api("/api/guard/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id })
        });
        toast(result.already_running ? "进程已在运行" : "拉起命令已执行");
        await loadGuard();
      }
    });
  }

  function guardToggle(id) {
    const rule = state.guardRules.find((item) => item.id === id);
    if (!rule) return;
    showConfirm({
      title: rule.auto ? "关闭守护" : "开启守护",
      message:
        "确定要" +
        (rule.auto ? "关闭" : "开启") +
        "守护规则“" +
        rule.name +
        "”吗？",
      confirmText: rule.auto ? "关闭守护" : "开启守护",
      onConfirm: async () => {
        await api("/api/guard/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, auto: !rule.auto })
        });
        toast(rule.auto ? "守护已关闭" : "守护已开启");
        await loadGuard();
      }
    });
  }

  function guardRemove(id) {
    const rule = state.guardRules.find((item) => item.id === id);
    if (!rule) return;
    showConfirm({
      title: "删除守护规则",
      message: "确定要删除守护规则“" + rule.name + "”吗？",
      danger: true,
      confirmText: "删除",
      onConfirm: async () => {
        await api("/api/guard/remove", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id })
        });
        toast("守护规则已删除");
        await loadGuard();
      }
    });
  }

  async function loadFiles(path) {
    const target = path || (state.files && state.files.path) || "/";
    const data = await api("/api/files?path=" + encodeURIComponent(target));
    state.files = data;
    renderFiles();
  }

  function renderFiles() {
    const files = state.files || { entries: [] };
    $("#pathInput").value = files.path || "/";
    $("#filePathTitle").textContent = files.path || "/";
    $("#fileCount").textContent = files.entries.length + " 个项目";
    const kindText = { dir: "目录", file: "文件", link: "链接", special: "特殊" };
    if (!files.entries.length) {
      $("#fileBody").innerHTML =
        '<tr><td colspan="7" class="muted">目录为空</td></tr>';
      return;
    }
    $("#fileBody").innerHTML = files.entries
      .map((entry) => {
        const name = entry.kind === "link" && entry.target ? entry.name + " -> " + entry.target : entry.name;
        const clickable = entry.kind === "dir" ? 'data-open="' + esc(entry.path) + '"' : 'data-view="' + esc(entry.path) + '"';
        const viewBtn =
          entry.kind === "file"
            ? '<button class="icon-btn" data-view="' + esc(entry.path) + '" title="查看内容">' +
              icon("file-text") +
              "</button>"
            : "";
        const downloadBtn =
          entry.kind === "file"
            ? '<button class="icon-btn" data-file-download="' +
              esc(entry.path) +
              '" title="下载">' +
              icon("download") +
              "</button>"
            : "";
        const renameBtn =
          '<button class="icon-btn" data-file-rename="' +
          esc(entry.path) +
          '" title="重命名">' +
          icon("edit") +
          "</button>";
        const permBtn =
          '<button class="icon-btn" data-file-perm="' +
          esc(entry.path) +
          '" title="权限 / 属主">' +
          icon("shield") +
          "</button>";
        return (
          "<tr>" +
          '<td><button class="file-link" ' + clickable + ' title="' + esc(name) + '"><span class="file-icon">' +
          icon(entry.kind === "dir" ? "folder" : entry.kind === "file" ? "file-text" : entry.kind === "link" ? "corner-down-left" : "hard-drive") +
          "</span>" +
          esc(name) +
          "</button></td>" +
          "<td>" + (kindText[entry.kind] || entry.kind) + "</td>" +
          '<td class="mono">' + (entry.kind === "dir" ? "--" : formatBytes(entry.size)) + "</td>" +
          '<td class="mono">' + esc(entry.mode) + "</td>" +
          "<td>" + esc(entry.owner + ":" + entry.group) + "</td>" +
          '<td class="mono">' + esc(entry.mtime) + "</td>" +
          '<td class="col-actions actions-wide"><div class="act">' +
          viewBtn +
          downloadBtn +
          renameBtn +
          permBtn +
          '<button class="icon-btn danger" data-delete="' + esc(entry.path) + '" title="移入回收站">' +
          icon("trash") +
          "</button></div></td></tr>"
        );
      })
      .join("");
    renderIcons($("#fileBody"));
  }

  function viewFile(path) {
    api("/api/files/read?path=" + encodeURIComponent(path))
      .then((data) => showFileModal(data.path, data.content))
      .catch((err) => {
        if (err.message !== "需要访问令牌") toast(err.message, "error");
      });
  }

  function deleteFile(path) {
    showConfirm({
      title: "移入回收站",
      message:
        "确定要把 " + path + " 移入回收站吗？回收站目录：~/.panel-trash",
      danger: true,
      confirmText: "移入回收站",
      onConfirm: async () => {
        const result = await api("/api/files/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path })
        });
        toast("已移入回收站：" + result.trash);
        await loadFiles(state.files && state.files.path);
      }
    });
  }


  function pathBase(path) {
    const parts = String(path || "").split("/").filter(Boolean);
    return parts.length ? parts[parts.length - 1] : path;
  }

  function pathDir(path) {
    const value = String(path || "/");
    const idx = value.lastIndexOf("/");
    return idx > 0 ? value.slice(0, idx) : "/";
  }

  async function uploadFiles(fileList) {
    if (!fileList || !fileList.length) return;
    const dir = (state.files && state.files.path) || "/";
    const form = new FormData();
    Array.from(fileList).forEach((file) => {
      form.append("files", file, file.name);
    });
    const btn = $("#btnFileUpload");
    if (btn) btn.disabled = true;
    try {
      const res = await fetch(
        "/api/files/upload?path=" + encodeURIComponent(dir),
        {
          method: "POST",
          headers: { "X-Panel-Token": state.token },
          body: form
        }
      );
      if (res.status === 401) {
        throw new Error("需要访问令牌");
      }
      if (!res.ok) {
        let message = "上传失败";
        let data = null;
        try {
          data = await res.json();
          message = (data && (data.message || data.error)) || message;
        } catch (err) {
          /* keep default */
        }
        if (data && data.error === "password_required") {
          const password = await requestLocalPassword(
            "上传文件前需要输入服务器本机密码"
          );
          if (password == null) return;
          form.append("password", password);
          const retry = await fetch(
            "/api/files/upload?path=" + encodeURIComponent(dir),
            {
              method: "POST",
              headers: { "X-Panel-Token": state.token },
              body: form
            }
          );
          if (!retry.ok) {
            let retryMessage = "上传失败";
            try {
              retryMessage = (await retry.json()).message || retryMessage;
            } catch (err) {
              /* keep default */
            }
            throw new Error(retryMessage);
          }
          const result = await retry.json();
          toast("上传完成：" + (result.files || []).length + " 个文件");
          await loadFiles(dir);
          return;
        }
        throw new Error(message);
      }
      const result = await res.json();
      toast("上传完成：" + (result.files || []).length + " 个文件");
      await loadFiles(dir);
    } catch (err) {
      if (err.message !== "需要访问令牌") toast(err.message, "error");
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  function showFileMkdirModal() {
    const dir = (state.files && state.files.path) || "/";
    const mask = document.createElement("div");
    mask.className = "modal-mask";
    mask.innerHTML =
      '<div class="modal"><h3 class="modal-title">' +
      icon("folder-plus") +
      "新建目录</h3><p class=\"modal-message\">当前目录：" +
      esc(dir) +
      '</p><label class="form-label" for="mkdirName">目录名</label>' +
      '<input id="mkdirName" class="modal-input" placeholder="例如 data" spellcheck="false">' +
      '<div class="modal-actions"><button class="btn ghost" data-close>取消</button>' +
      '<button class="btn primary" data-save>创建</button></div></div>';
    modalRoot.appendChild(mask);
    renderIcons(mask);
    const close = () => mask.remove();
    mask.querySelector("[data-close]").onclick = close;
    mask.addEventListener("click", (event) => {
      if (event.target === mask) close();
    });
    mask.querySelector("[data-save]").onclick = async () => {
      const name = mask.querySelector("#mkdirName").value.trim();
      if (!name) {
        toast("请输入目录名", "error");
        return;
      }
      try {
        await api("/api/files/mkdir", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: dir + "/" + name })
        });
        toast("目录已创建");
        close();
        await loadFiles(dir);
      } catch (err) {
        if (err.message !== "需要访问令牌") toast(err.message, "error");
      }
    };
    setTimeout(() => mask.querySelector("#mkdirName").focus(), 50);
  }

  function showFileUrlModal() {
    const dir = (state.files && state.files.path) || "/";
    const mask = document.createElement("div");
    mask.className = "modal-mask";
    mask.innerHTML =
      '<div class="modal"><h3 class="modal-title">' +
      icon("download") +
      '在线下载</h3><label class="form-label" for="dlUrl">文件地址</label>' +
      '<input id="dlUrl" class="modal-input" placeholder="https://example.com/file.zip" spellcheck="false">' +
      '<label class="form-label" for="dlTarget">保存目录</label>' +
      '<input id="dlTarget" class="modal-input" value="' +
      esc(dir) +
      '" spellcheck="false">' +
      '<div class="modal-actions"><button class="btn ghost" data-close>取消</button>' +
      '<button class="btn primary" data-save>下载</button></div></div>';
    modalRoot.appendChild(mask);
    renderIcons(mask);
    const close = () => mask.remove();
    mask.querySelector("[data-close]").onclick = close;
    mask.addEventListener("click", (event) => {
      if (event.target === mask) close();
    });
    mask.querySelector("[data-save]").onclick = async (event) => {
      const btn = event.currentTarget;
      btn.disabled = true;
      try {
        const url = mask.querySelector("#dlUrl").value.trim();
        const target = mask.querySelector("#dlTarget").value.trim() || "/";
        if (!url) throw new Error("请输入文件地址");
        const result = await api("/api/files/download-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, target })
        });
        toast("下载完成：" + result.name);
        close();
        await loadFiles(target);
      } catch (err) {
        btn.disabled = false;
        if (err.message !== "需要访问令牌") toast(err.message, "error");
      }
    };
    setTimeout(() => mask.querySelector("#dlUrl").focus(), 50);
  }

  function showFileArchiveModal() {
    const dir = (state.files && state.files.path) || "/";
    const mask = document.createElement("div");
    mask.className = "modal-mask";
    mask.innerHTML =
      '<div class="modal modal-lg"><h3 class="modal-title">' +
      icon("archive") +
      '压缩</h3><label class="form-label" for="archivePaths">要压缩的路径（每行一个）</label>' +
      '<textarea id="archivePaths" class="modal-textarea" spellcheck="false">' +
      esc(dir) +
      '</textarea><div class="form-grid">' +
      '<div><label class="form-label" for="archiveOut">输出目录</label>' +
      '<input id="archiveOut" class="modal-input" value="' +
      esc(dir) +
      '" spellcheck="false"></div>' +
      '<div><label class="form-label" for="archiveName">文件名</label>' +
      '<input id="archiveName" class="modal-input" value="backup" spellcheck="false"></div>' +
      '</div><label class="form-label" for="archiveFormat">格式</label>' +
      '<select id="archiveFormat" class="modal-input"><option value="tar.gz">tar.gz</option><option value="zip">zip</option></select>' +
      '<div class="modal-actions"><button class="btn ghost" data-close>取消</button>' +
      '<button class="btn primary" data-save>压缩</button></div></div>';
    modalRoot.appendChild(mask);
    renderIcons(mask);
    const close = () => mask.remove();
    mask.querySelector("[data-close]").onclick = close;
    mask.addEventListener("click", (event) => {
      if (event.target === mask) close();
    });
    mask.querySelector("[data-save]").onclick = async (event) => {
      const btn = event.currentTarget;
      btn.disabled = true;
      try {
        const paths = mask
          .querySelector("#archivePaths")
          .value.split("\n")
          .map((line) => line.trim())
          .filter(Boolean);
        const out = mask.querySelector("#archiveOut").value.trim() || "/";
        const name = mask.querySelector("#archiveName").value.trim() || "backup";
        const format = mask.querySelector("#archiveFormat").value;
        if (!paths.length) throw new Error("请至少填写一个路径");
        const result = await api("/api/files/archive", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paths,
            target: out + "/" + name + "." + (format === "zip" ? "zip" : "tar.gz"),
            format
          })
        });
        toast("压缩完成：" + pathBase(result.path));
        close();
        await loadFiles(out);
      } catch (err) {
        btn.disabled = false;
        if (err.message !== "需要访问令牌") toast(err.message, "error");
      }
    };
  }

  function showFileExtractModal() {
    const dir = (state.files && state.files.path) || "/";
    const mask = document.createElement("div");
    mask.className = "modal-mask";
    mask.innerHTML =
      '<div class="modal"><h3 class="modal-title">' +
      icon("unarchive") +
      '解压</h3><label class="form-label" for="extractArchive">压缩包路径</label>' +
      '<input id="extractArchive" class="modal-input" value="' +
      esc(dir) +
      '" spellcheck="false">' +
      '<label class="form-label" for="extractTarget">解压到目录</label>' +
      '<input id="extractTarget" class="modal-input" value="' +
      esc(dir) +
      '" spellcheck="false">' +
      '<div class="modal-actions"><button class="btn ghost" data-close>取消</button>' +
      '<button class="btn primary" data-save>解压</button></div></div>';
    modalRoot.appendChild(mask);
    renderIcons(mask);
    const close = () => mask.remove();
    mask.querySelector("[data-close]").onclick = close;
    mask.addEventListener("click", (event) => {
      if (event.target === mask) close();
    });
    mask.querySelector("[data-save]").onclick = async (event) => {
      const btn = event.currentTarget;
      btn.disabled = true;
      try {
        const archive = mask.querySelector("#extractArchive").value.trim();
        const target = mask.querySelector("#extractTarget").value.trim() || "/";
        if (!archive) throw new Error("请输入压缩包路径");
        await api("/api/files/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ archive, target })
        });
        toast("解压完成");
        close();
        await loadFiles(target);
      } catch (err) {
        btn.disabled = false;
        if (err.message !== "需要访问令牌") toast(err.message, "error");
      }
    };
  }

  function showFileRenameModal(path) {
    const mask = document.createElement("div");
    mask.className = "modal-mask";
    mask.innerHTML =
      '<div class="modal"><h3 class="modal-title">' +
      icon("edit") +
      '重命名</h3><p class="modal-message">' +
      esc(path) +
      '</p><label class="form-label" for="renameInput">新名称</label>' +
      '<input id="renameInput" class="modal-input" value="' +
      esc(pathBase(path)) +
      '" spellcheck="false">' +
      '<div class="modal-actions"><button class="btn ghost" data-close>取消</button>' +
      '<button class="btn primary" data-save>保存</button></div></div>';
    modalRoot.appendChild(mask);
    renderIcons(mask);
    const close = () => mask.remove();
    mask.querySelector("[data-close]").onclick = close;
    mask.addEventListener("click", (event) => {
      if (event.target === mask) close();
    });
    mask.querySelector("[data-save]").onclick = async () => {
      const newName = mask.querySelector("#renameInput").value.trim();
      if (!newName) {
        toast("请输入新名称", "error");
        return;
      }
      try {
        await api("/api/files/rename", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path, new_name: newName })
        });
        toast("已重命名");
        close();
        await loadFiles(pathDir(path));
      } catch (err) {
        if (err.message !== "需要访问令牌") toast(err.message, "error");
      }
    };
    mask.querySelector("#renameInput").select();
  }

  function showFilePermModal(path) {
    const mask = document.createElement("div");
    mask.className = "modal-mask";
    mask.innerHTML =
      '<div class="modal"><h3 class="modal-title">' +
      icon("shield") +
      '权限 / 属主</h3><p class="modal-message">' +
      esc(path) +
      '</p><div class="form-grid">' +
      '<div><label class="form-label" for="permMode">权限</label>' +
      '<input id="permMode" class="modal-input" value="755" maxlength="4" spellcheck="false"></div>' +
      '<div><label class="form-label" for="permOwner">属主</label>' +
      '<input id="permOwner" class="modal-input" placeholder="例如 www-data" spellcheck="false"></div>' +
      '</div><label class="form-label" for="permGroup">组（可选）</label>' +
      '<input id="permGroup" class="modal-input" placeholder="例如 www-data" spellcheck="false">' +
      '<div class="modal-actions"><button class="btn ghost" data-close>取消</button>' +
      '<button class="btn primary" data-save>保存</button></div></div>';
    modalRoot.appendChild(mask);
    renderIcons(mask);
    const close = () => mask.remove();
    mask.querySelector("[data-close]").onclick = close;
    mask.addEventListener("click", (event) => {
      if (event.target === mask) close();
    });
    mask.querySelector("[data-save]").onclick = async (event) => {
      const btn = event.currentTarget;
      btn.disabled = true;
      try {
        const mode = mask.querySelector("#permMode").value.trim();
        const owner = mask.querySelector("#permOwner").value.trim();
        const group = mask.querySelector("#permGroup").value.trim();
        if (mode) {
          await api("/api/files/chmod", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ path, mode })
          });
        }
        if (owner) {
          await api("/api/files/chown", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ path, owner, group })
          });
        }
        toast("权限已更新");
        close();
        await loadFiles(pathDir(path));
      } catch (err) {
        btn.disabled = false;
        if (err.message !== "需要访问令牌") toast(err.message, "error");
      }
    };
  }

  async function downloadFile(path) {
    try {
      const res = await fetch(
        "/api/files/download?path=" + encodeURIComponent(path),
        { headers: { "X-Panel-Token": state.token } }
      );
      if (!res.ok) {
        let message = "下载失败";
        try {
          message = (await res.json()).message || message;
        } catch (err) {
          /* keep default */
        }
        throw new Error(message);
      }
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = pathBase(path);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    } catch (err) {
      if (err.message !== "需要访问令牌") toast(err.message, "error");
    }
  }

  async function loadBackups() {
    try {
      const data = await api("/api/backups");
      state.backups = data.backups || [];
      renderBackups();
    } catch (err) {
      if (err.message !== "需要访问令牌") toast(err.message, "error");
    }
  }

  function renderBackups() {
    const backups = state.backups || [];
    $("#backupCount").textContent = backups.length + " 个";
    $("#backupBody").innerHTML = backups.length
      ? backups
          .map(
            (item) =>
              "<tr><td class=\"mono\">" +
              esc(item.name) +
              "</td><td class=\"mono\">" +
              formatBytes(item.size) +
              "</td><td class=\"mono\">" +
              esc(item.time) +
              '</td><td class="col-actions actions-wide"><div class="act">' +
              '<button class="icon-btn" data-backup-upload="' +
              esc(item.name) +
              '" title="上传到云端">' +
              icon("upload") +
              '</button><button class="icon-btn" data-backup-download="' +
              esc(item.name) +
              '" title="下载">' +
              icon("download") +
              '</button><button class="icon-btn" data-backup-restore="' +
              esc(item.name) +
              '" title="恢复">' +
              icon("rotate-cw") +
              '</button><button class="icon-btn danger" data-backup-delete="' +
              esc(item.name) +
              '" title="删除">' +
              icon("trash") +
              "</button></div></td></tr>"
          )
          .join("")
      : '<tr><td colspan="4" class="muted">暂无备份</td></tr>';
    renderIcons($("#backupBody"));
  }

  function showBackupCreateModal() {
    const mask = document.createElement("div");
    mask.className = "modal-mask";
    mask.innerHTML =
      '<div class="modal modal-lg"><h3 class="modal-title">' +
      icon("archive") +
      '新建备份</h3><label class="form-label" for="backupName">备份名称</label>' +
      '<input id="backupName" class="modal-input" value="backup" spellcheck="false">' +
      '<label class="form-label" for="backupFormat">格式</label>' +
      '<select id="backupFormat" class="modal-input"><option value="tar.gz">tar.gz</option><option value="zip">zip</option></select>' +
      '<label class="form-label" for="backupPaths">要备份的路径（每行一个）</label>' +
      '<textarea id="backupPaths" class="modal-textarea" spellcheck="false" placeholder="/etc/nginx&#10;/home/user/www"></textarea>' +
      '<div class="modal-actions"><button class="btn ghost" data-close>取消</button>' +
      '<button class="btn primary" data-save>开始备份</button></div></div>';
    modalRoot.appendChild(mask);
    renderIcons(mask);
    const close = () => mask.remove();
    mask.querySelector("[data-close]").onclick = close;
    mask.addEventListener("click", (event) => {
      if (event.target === mask) close();
    });
    mask.querySelector("[data-save]").onclick = async (event) => {
      const btn = event.currentTarget;
      btn.disabled = true;
      try {
        const name = mask.querySelector("#backupName").value.trim();
        const format = mask.querySelector("#backupFormat").value;
        const paths = mask
          .querySelector("#backupPaths")
          .value.split("\n")
          .map((line) => line.trim())
          .filter(Boolean);
        if (!name || !paths.length) throw new Error("请填写备份名称和路径");
        const result = await api("/api/backups/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, paths, format })
        });
        toast(result.message || "备份完成");
        close();
        await loadBackups();
      } catch (err) {
        btn.disabled = false;
        if (err.message !== "需要访问令牌") toast(err.message, "error");
      }
    };
    setTimeout(() => mask.querySelector("#backupName").focus(), 50);
  }

  // ---- WebDAV 云存储 ----

  async function loadWebdavState() {
    try {
      const config = await api("/api/webdav");
      const el = $("#cloudState");
      if (config.url && config.username) {
        el.textContent = "已配置：" + config.url;
        el.classList.add("on");
      } else {
        el.textContent = "未配置";
        el.classList.remove("on");
      }
    } catch (err) { /* ignore */ }
  }

  async function loadCloudBackups() {
    loadWebdavState();
    try {
      const data = await api("/api/webdav/files");
      const rows = data.files || [];
      $("#cloudBody").innerHTML = rows.length
        ? rows.map((item) =>
            "<tr><td class=\"mono\">" + esc(item.name) +
            '</td><td class="mono">' + formatBytes(item.size) +
            '</td><td class="mono">' + esc(item.time) +
            '</td><td class="col-actions actions-wide"><div class="act">' +
            '<button class="icon-btn" data-cloud-download="' + esc(item.name) + '" title="取回本地">' + icon("download") +
            '</button><button class="icon-btn danger" data-cloud-delete="' + esc(item.name) + '" title="删除">' + icon("trash") +
            "</button></div></td></tr>"
          ).join("")
        : '<tr><td colspan="4" class="muted">云端暂无备份</td></tr>';
      renderIcons($("#cloudBody"));
    } catch (err) {
      $("#cloudBody").innerHTML = '<tr><td colspan="4" class="muted">' + esc(err.message) + "</td></tr>";
    }
  }

  function showWebdavConfigModal() {
    api("/api/webdav").then((config) => {
      const mask = document.createElement("div");
      mask.className = "modal-mask";
      mask.innerHTML =
        '<div class="modal modal-lg"><h3 class="modal-title">' +
        icon("save") +
        'WebDAV 云存储设置</h3>' +
        '<label class="form-label">服务器地址</label>' +
        '<input id="wdUrl" class="modal-input" spellcheck="false" placeholder="https://dav.jianguoyun.com/dav/" value="' + esc(config.url || "") + '">' +
        '<label class="form-label">远端目录（相对路径）</label>' +
        '<input id="wdDir" class="modal-input" spellcheck="false" placeholder="panel-backups" value="' + esc(config.remote_dir || "") + '">' +
        '<label class="form-label">用户名</label>' +
        '<input id="wdUser" class="modal-input" spellcheck="false" value="' + esc(config.username || "") + '">' +
        '<label class="form-label">密码（留空则不修改）</label>' +
        '<input id="wdPass" class="modal-input" type="password" spellcheck="false" placeholder="应用专用密码">' +
        '<div class="modal-actions"><button class="btn ghost" data-close>取消</button>' +
        '<button class="btn primary" data-save>保存配置</button></div></div>';
      modalRoot.appendChild(mask);
      renderIcons(mask);
      const close = () => mask.remove();
      mask.querySelector("[data-close]").onclick = close;
      mask.addEventListener("click", (e) => { if (e.target === mask) close(); });
      mask.querySelector("[data-save]").onclick = async (e) => {
        const btn = e.currentTarget;
        btn.disabled = true;
        try {
          const body = {
            url: mask.querySelector("#wdUrl").value.trim(),
            remote_dir: mask.querySelector("#wdDir").value.trim(),
            username: mask.querySelector("#wdUser").value.trim(),
            dav_password: mask.querySelector("#wdPass").value
          };
          const result = await api("/api/webdav/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
          });
          toast(result.message || "已保存");
          close();
          loadCloudBackups();
        } catch (err) {
          btn.disabled = false;
          if (err.message !== "需要访问令牌") toast(err.message, "error");
        }
      };
    });
  }

  async function testWebdav() {
    try {
      toast("正在测试连接…");
      const result = await api("/api/webdav/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      });
      toast(result.message || "连接成功");
    } catch (err) {
      if (err.message !== "需要访问令牌") toast(err.message, "error");
    }
  }

  function cloudUpload(name) {
    showConfirm({
      title: "上传到云端",
      message: "确定将 " + name + " 上传到 WebDAV？",
      confirmText: "上传",
      onConfirm: async () => {
        const result = await api("/api/webdav/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name })
        });
        toast(result.message || "已上传");
        loadCloudBackups();
      }
    });
  }

  function cloudDownload(name) {
    showConfirm({
      title: "取回本地",
      message: "从云端下载 " + name + " 到本地备份目录？",
      confirmText: "取回",
      onConfirm: async () => {
        const result = await api("/api/webdav/download", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name })
        });
        toast(result.message || "已取回");
        loadBackups();
      }
    });
  }

  function cloudDelete(name) {
    showConfirm({
      title: "删除云端备份",
      message: "确定删除云端文件 " + name + "？",
      danger: true,
      confirmText: "确认删除",
      onConfirm: async () => {
        const result = await api("/api/webdav/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name })
        });
        toast(result.message || "已删除");
        loadCloudBackups();
      }
    });
  }

  // ---- 网站管理（Nginx 站点）----

  async function loadSites() {
    try {
      const data = await api("/api/sites");
      renderSites(data);
    } catch (err) {
      if (err.message !== "需要访问令牌") toast(err.message, "error");
    }
  }

  function renderSites(data) {
    const nginx = data.nginx || {};
    const badge = $("#nginxBadge");
    const installBtn = $("#btnNginxInstall");
    if (nginx.installed) {
      badge.textContent =
        "Nginx " + (nginx.version || "") + (nginx.running ? " · 运行中" : " · 未运行");
      installBtn.style.display = "none";
    } else {
      badge.textContent = "未安装 Nginx";
      installBtn.style.display = "";
    }
    const sites = data.sites || [];
    $("#siteCount").textContent = sites.length + " 个站点";
    const typeText = { static: "静态", proxy: "反向代理", php: "PHP" };
    $("#siteBody").innerHTML = sites.length
      ? sites
          .map(
            (item) =>
              "<tr><td class=\"mono\">" + esc(item.name) +
              '</td><td>' + (typeText[item.type] || item.type) +
              '</td><td class="mono">' + esc((item.domains || []).join(", ")) +
              '</td><td class="mono">' + item.port +
              '</td><td class="mono">' + esc(item.type === "proxy" ? item.proxy_target : item.root) +
              '</td><td><span class="state ' + (item.enabled ? "ok" : "warn") + '">' +
              (item.enabled ? "运行" : "停用") +
              (item.ssl ? " · HTTPS" : "") +
              '</td><td class="col-actions actions-wide"><div class="act">' +
              '<button class="icon-btn" data-site-ssl="' + esc(item.name) + '" title="' + (item.ssl ? "停用 SSL" : "签发 SSL 证书") + '">' + icon("shield") +
              '</button><button class="icon-btn" data-site-logs="' + esc(item.name) + '" title="查看站点日志">' + icon("terminal") +
              '</button><button class="icon-btn" data-site-config="' + esc(item.name) + '" title="编辑配置">' + icon("edit") +
              '</button><button class="icon-btn" data-site-toggle="' + esc(item.name) +
              '" data-enable="' + (item.enabled ? "0" : "1") + '" title="' + (item.enabled ? "停用" : "启用") + '">' +
              icon(item.enabled ? "pause" : "power") +
              '</button><button class="icon-btn danger" data-site-delete="' + esc(item.name) + '" title="删除">' + icon("trash") +
              "</button></div></td></tr>"
          )
          .join("")
      : '<tr><td colspan="7" class="muted">暂无站点，点击"新建站点"开始</td></tr>';
    renderIcons($("#siteBody"));
  }

  function showSiteCreateModal() {
    const mask = document.createElement("div");
    mask.className = "modal-mask";
    mask.innerHTML =
      '<div class="modal modal-lg"><h3 class="modal-title">' + icon("globe") +
      '新建站点</h3>' +
      '<label class="form-label">站点名（英文小写）</label>' +
      '<input id="siteName" class="modal-input" spellcheck="false" placeholder="myblog">' +
      '<label class="form-label">类型</label>' +
      '<select id="siteType" class="modal-input">' +
      '<option value="static">静态网站</option>' +
      '<option value="proxy">反向代理</option>' +
      '<option value="php">PHP 网站</option></select>' +
      '<label class="form-label">域名（每行一个，支持 *.example.com）</label>' +
      '<textarea id="siteDomains" class="modal-textarea" rows="2" spellcheck="false" placeholder="www.example.com"></textarea>' +
      '<label class="form-label">监听端口</label>' +
      '<input id="sitePort" class="modal-input" value="80" spellcheck="false">' +
      '<div id="siteStaticFields">' +
      '<label class="form-label">网站目录</label>' +
      '<input id="siteRoot" class="modal-input" spellcheck="false" placeholder="/var/www/myblog"></div>' +
      '<div id="siteProxyFields" style="display:none">' +
      '<label class="form-label">代理目标</label>' +
      '<input id="siteProxyTarget" class="modal-input" spellcheck="false" placeholder="http://127.0.0.1:8080"></div>' +
      '<div id="sitePhpFields" style="display:none">' +
      '<label class="form-label">PHP-FPM socket</label>' +
      '<input id="sitePhpSocket" class="modal-input" spellcheck="false" placeholder="/run/php/php8.2-fpm.sock"></div>' +
      '<div class="modal-actions"><button class="btn ghost" data-close>取消</button>' +
      '<button class="btn primary" data-save>创建站点</button></div></div>';
    modalRoot.appendChild(mask);
    renderIcons(mask);
    const close = () => mask.remove();
    mask.querySelector("[data-close]").onclick = close;
    mask.addEventListener("click", (e) => { if (e.target === mask) close(); });
    const typeSelect = mask.querySelector("#siteType");
    const syncFields = () => {
      const t = typeSelect.value;
      mask.querySelector("#siteStaticFields").style.display = t === "static" ? "" : "none";
      mask.querySelector("#siteProxyFields").style.display = t === "proxy" ? "" : "none";
      mask.querySelector("#sitePhpFields").style.display = t === "php" ? "" : "none";
    };
    typeSelect.addEventListener("change", syncFields);
    mask.querySelector("[data-save]").onclick = async (e) => {
      const btn = e.currentTarget;
      btn.disabled = true;
      try {
        const type = typeSelect.value;
        const body = {
          name: mask.querySelector("#siteName").value.trim(),
          type,
          domains: mask.querySelector("#siteDomains").value
            .split("\n").map((s) => s.trim()).filter(Boolean),
          port: Number(mask.querySelector("#sitePort").value) || 80
        };
        if (type === "proxy") {
          body.proxy_target = mask.querySelector("#siteProxyTarget").value.trim();
        } else {
          body.root = mask.querySelector("#siteRoot").value.trim();
          if (type === "php") {
            body.php_socket = mask.querySelector("#sitePhpSocket").value.trim();
          }
        }
        const result = await api("/api/sites/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        toast(result.message || "站点已创建");
        close();
        loadSites();
      } catch (err) {
        btn.disabled = false;
        if (err.message !== "需要访问令牌") toast(err.message, "error");
      }
    };
    setTimeout(() => mask.querySelector("#siteName").focus(), 50);
  }

  async function editSiteConfig(name) {
    try {
      const data = await api("/api/sites/config?name=" + encodeURIComponent(name));
      const mask = document.createElement("div");
      mask.className = "modal-mask";
      mask.innerHTML =
        '<div class="modal modal-lg"><h3 class="modal-title">' + icon("edit") +
        '编辑配置：' + esc(name) + '</h3>' +
        '<textarea id="siteConfEditor" class="modal-textarea mono" rows="18" spellcheck="false"></textarea>' +
        '<div class="modal-actions"><button class="btn ghost" data-close>取消</button>' +
        '<button class="btn primary" data-save>保存并重载</button></div></div>';
      modalRoot.appendChild(mask);
      renderIcons(mask);
      mask.querySelector("#siteConfEditor").value = data.content || "";
      const close = () => mask.remove();
      mask.querySelector("[data-close]").onclick = close;
      mask.addEventListener("click", (e) => { if (e.target === mask) close(); });
      mask.querySelector("[data-save]").onclick = async (e) => {
        const btn = e.currentTarget;
        btn.disabled = true;
        try {
          const result = await api("/api/sites/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, content: mask.querySelector("#siteConfEditor").value })
          });
          toast(result.message || "已保存");
          close();
        } catch (err) {
          btn.disabled = false;
          if (err.message !== "需要访问令牌") toast(err.message, "error");
        }
      };
    } catch (err) {
      if (err.message !== "需要访问令牌") toast(err.message, "error");
    }
  }

  function toggleSite(name, enable) {
    showConfirm({
      title: enable ? "启用站点" : "停用站点",
      message: (enable ? "启用站点 " : "停用站点 ") + name + "？",
      confirmText: "确定",
      onConfirm: async () => {
        const result = await api("/api/sites/toggle", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, enable })
        });
        toast(result.message || "已更新");
        loadSites();
      }
    });
  }

  function deleteSite(name) {
    showConfirm({
      title: "删除站点",
      message: "确定删除站点 " + name + "？（仅删除 Nginx 配置，网站目录保留）",
      danger: true,
      confirmText: "确认删除",
      onConfirm: async () => {
        const result = await api("/api/sites/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name })
        });
        toast(result.message || "已删除");
        loadSites();
      }
    });
  }

  function installNginx() {
    showConfirm({
      title: "安装 Nginx",
      message: "将通过系统包管理器（apt/dnf/yum）安装并启动 Nginx，可能需要几分钟。",
      confirmText: "开始安装",
      onConfirm: async () => {
        toast("正在安装 Nginx…");
        const result = await api("/api/sites/install-nginx", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({})
        });
        toast(result.message || "安装完成");
        loadSites();
      }
    });
  }

  // ---- 增强版计划任务 ----

  async function loadCronJobs() {
    try {
      const data = await api("/api/cron-jobs");
      state.cronJobs = data.jobs || [];
      renderCronJobs();
    } catch (err) {
      if (err.message !== "需要访问令牌") toast(err.message, "error");
    }
  }

  function renderCronJobs() {
    const jobs = state.cronJobs || [];
    $("#cronJobCount").textContent = jobs.length + " 个任务";
    const typeText = { shell: "Shell 脚本", backup: "目录备份", url: "访问 URL" };
    $("#cronJobBody").innerHTML = jobs.length
      ? jobs
          .map(
            (item) =>
              "<tr><td class=\"mono\">" + esc(item.name) +
              '</td><td>' + (typeText[item.type] || item.type) +
              '</td><td class="mono">' + esc(item.schedule) +
              '</td><td class="mono muted">' + esc(item.last_run || "未运行") +
              '</td><td><span class="state ' + (item.enabled ? "active" : "inactive") + '">' +
              (item.enabled ? "启用" : "停用") +
              '</span></td><td class="col-actions actions-wide"><div class="act">' +
              '<button class="icon-btn" data-job-run="' + esc(item.id) + '" title="立即执行">' + icon("play") +
              '</button><button class="icon-btn" data-job-log="' + esc(item.id) + '" title="查看日志">' + icon("terminal") +
              '</button><button class="icon-btn" data-job-toggle="' + esc(item.id) +
              '" data-enable="' + (item.enabled ? "0" : "1") + '" title="' + (item.enabled ? "停用" : "启用") + '">' +
              icon("power") +
              '</button><button class="icon-btn danger" data-job-delete="' + esc(item.id) + '" title="删除">' + icon("trash") +
              "</button></div></td></tr>"
          )
          .join("")
      : '<tr><td colspan="6" class="muted">还没有增强任务，点击"新建任务"创建</td></tr>';
    renderIcons($("#cronJobBody"));
  }

  function showCronJobModal() {
    const mask = document.createElement("div");
    mask.className = "modal-mask";
    mask.innerHTML =
      '<div class="modal modal-lg"><h3 class="modal-title">' + icon("clock") +
      '新建计划任务</h3>' +
      '<label class="form-label">任务名（英文/数字/下划线/连字符）</label>' +
      '<input id="jobName" class="modal-input" spellcheck="false" placeholder="daily-backup">' +
      '<label class="form-label">类型</label>' +
      '<select id="jobType" class="modal-input">' +
      '<option value="shell">Shell 脚本</option>' +
      '<option value="backup">目录备份</option>' +
      '<option value="url">访问 URL</option></select>' +
      '<label class="form-label">执行周期（cron 格式，5 段）</label>' +
      '<input id="jobSchedule" class="modal-input" spellcheck="false" placeholder="0 3 * * *  即每天凌晨3点">' +
      '<div id="jobShellFields">' +
      '<label class="form-label">脚本内容</label>' +
      '<textarea id="jobScript" class="modal-textarea mono" rows="5" spellcheck="false" placeholder="#!/bin/bash&#10;echo hello"></textarea></div>' +
      '<div id="jobBackupFields" style="display:none">' +
      '<label class="form-label">要备份的路径（每行一个）</label>' +
      '<textarea id="jobPaths" class="modal-textarea" rows="3" spellcheck="false" placeholder="/etc/nginx&#10;/var/www"></textarea>' +
      '<label class="check-row" style="margin-top:8px">' +
      '<input type="checkbox" id="jobCloudUpload"> 备份成功后自动上传到 WebDAV 云存储</label></div>' +
      '<div id="jobUrlFields" style="display:none">' +
      '<label class="form-label">URL</label>' +
      '<input id="jobUrl" class="modal-input" spellcheck="false" placeholder="https://example.com/health"></div>' +
      '<div class="modal-actions"><button class="btn ghost" data-close>取消</button>' +
      '<button class="btn primary" data-save>创建任务</button></div></div>';
    modalRoot.appendChild(mask);
    renderIcons(mask);
    const close = () => mask.remove();
    mask.querySelector("[data-close]").onclick = close;
    mask.addEventListener("click", (e) => { if (e.target === mask) close(); });
    const typeSelect = mask.querySelector("#jobType");
    const syncFields = () => {
      const t = typeSelect.value;
      mask.querySelector("#jobShellFields").style.display = t === "shell" ? "" : "none";
      mask.querySelector("#jobBackupFields").style.display = t === "backup" ? "" : "none";
      mask.querySelector("#jobUrlFields").style.display = t === "url" ? "" : "none";
    };
    typeSelect.addEventListener("change", syncFields);
    mask.querySelector("[data-save]").onclick = async (e) => {
      const btn = e.currentTarget;
      btn.disabled = true;
      try {
        const type = typeSelect.value;
        const body = {
          name: mask.querySelector("#jobName").value.trim(),
          type,
          schedule: mask.querySelector("#jobSchedule").value.trim()
        };
        if (type === "shell") body.script = mask.querySelector("#jobScript").value;
        if (type === "backup") {
          body.paths = mask.querySelector("#jobPaths").value.split("\n").map((s) => s.trim()).filter(Boolean);
          body.cloud_upload = mask.querySelector("#jobCloudUpload").checked;
        }
        if (type === "url") body.url = mask.querySelector("#jobUrl").value.trim();
        const result = await api("/api/cron-jobs/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        toast(result.message || "任务已创建");
        close();
        loadCronJobs();
      } catch (err) {
        btn.disabled = false;
        if (err.message !== "需要访问令牌") toast(err.message, "error");
      }
    };
    setTimeout(() => mask.querySelector("#jobName").focus(), 50);
  }

  async function showCronJobLog(id, name) {
    try {
      const data = await api("/api/cron-jobs/log?id=" + encodeURIComponent(id));
      const mask = document.createElement("div");
      mask.className = "modal-mask";
      mask.innerHTML =
        '<div class="modal modal-lg"><h3 class="modal-title">' + icon("terminal") +
        '执行日志：' + esc(name) + '</h3>' +
        '<pre class="toolbox-pre" style="max-height:60vh;overflow:auto">' +
        esc((data.lines || []).join("\n") || "暂无执行日志") +
        '</pre><div class="modal-actions"><button class="btn ghost" data-close>关闭</button></div></div>';
      modalRoot.appendChild(mask);
      renderIcons(mask);
      const close = () => mask.remove();
      mask.querySelector("[data-close]").onclick = close;
      mask.addEventListener("click", (e) => { if (e.target === mask) close(); });
    } catch (err) {
      if (err.message !== "需要访问令牌") toast(err.message, "error");
    }
  }

  function toggleCronJob(id, enable) {
    api("/api/cron-jobs/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, enable })
    }).then(() => loadCronJobs()).catch((err) => {
      if (err.message !== "需要访问令牌") toast(err.message, "error");
    });
  }

  function deleteCronJob(id) {
    showConfirm({
      title: "删除任务",
      message: "确定删除该计划任务？",
      danger: true,
      confirmText: "确认删除",
      onConfirm: async () => {
        const result = await api("/api/cron-jobs/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id })
        });
        toast(result.message || "已删除");
        loadCronJobs();
      }
    });
  }

  function runCronJob(id) {
    api("/api/cron-jobs/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    }).then((r) => {
      toast(r.message || "已执行");
      loadCronJobs();
    }).catch((err) => {
      if (err.message !== "需要访问令牌") toast(err.message, "error");
    });
  }

  // ---- SSL 证书 ----

  async function loadCerts() {
    try {
      const data = await api("/api/certs");
      state.certs = data;
    } catch (err) { /* ignore */ }
  }

  function issueCert(siteName) {
    showConfirm({
      title: "签发 SSL 证书",
      message: "为站点 " + siteName + " 申请 Let's Encrypt 免费证书并启用 HTTPS？\n\n首次会安装 acme.sh，并需要域名已解析到本机（HTTP-01 验证）。",
      confirmText: "开始签发",
      onConfirm: async () => {
        toast("正在签发证书，可能需要 1-2 分钟…");
        const result = await api("/api/certs/issue", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ site: siteName })
        });
        toast(result.message || "证书已签发");
        loadSites();
      }
    });
  }

  function disableCert(siteName) {
    showConfirm({
      title: "停用 SSL",
      message: "停用站点 " + siteName + " 的 HTTPS？（证书保留，自动续签仍生效）",
      danger: true,
      confirmText: "停用",
      onConfirm: async () => {
        const result = await api("/api/certs/disable", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ site: siteName })
        });
        toast(result.message || "已停用");
        loadSites();
      }
    });
  }

  // ---- 站点日志 ----

  async function showSiteLogs(name) {
    let kind = "access";
    async function fetchLogs(k) {
      const data = await api(
        "/api/sites/logs?name=" + encodeURIComponent(name) +
        "&kind=" + k + "&lines=100"
      );
      return data;
    }
    const mask = document.createElement("div");
    mask.className = "modal-mask";
    mask.innerHTML =
      '<div class="modal modal-lg"><h3 class="modal-title">' + icon("terminal") +
      "站点日志：" + esc(name) + "</h3>" +
      '<div class="segmented" style="margin-bottom:10px">' +
      '<button class="seg active" data-kind="access">访问日志</button>' +
      '<button class="seg" data-kind="error">错误日志</button></div>' +
      '<pre class="toolbox-pre" style="max-height:55vh;overflow:auto">加载中…</pre>' +
      '<div class="modal-actions"><button class="btn ghost" data-close>关闭</button></div></div>';
    modalRoot.appendChild(mask);
    renderIcons(mask);
    const pre = mask.querySelector("pre");
    const close = () => mask.remove();
    mask.querySelector("[data-close]").onclick = close;
    mask.addEventListener("click", (e) => { if (e.target === mask) close(); });
    const showKind = async (k) => {
      try {
        const data = await fetchLogs(k);
        const lines = data.lines || [];
        pre.textContent = lines.length ? lines.join("\n") : (data.message || "暂无日志");
      } catch (err) {
        if (err.message !== "需要访问令牌") toast(err.message, "error");
      }
    };
    mask.querySelectorAll(".seg").forEach((btn) => {
      btn.addEventListener("click", () => {
        mask.querySelectorAll(".seg").forEach((b) => b.classList.toggle("active", b === btn));
        kind = btn.dataset.kind;
        showKind(kind);
      });
    });
    showKind(kind);
  }

  // ---- SSH 管理 ----

  async function loadSshConfig() {
    try {
      const data = await api("/api/ssh-config");
      if (data.ok === false) {
        toast(data.error || "读取失败", "error");
        return;
      }
      $("#sshPort").value = data.port || "22";
      $("#sshRoot").value = data.permit_root || "prohibit-password";
      $("#sshPass").value = data.password_auth || "yes";
    } catch (err) {
      if (err.message !== "需要访问令牌") toast(err.message, "error");
    }
  }

  function saveSshConfig() {
    showConfirm({
      title: "保存 SSH 配置",
      message: "修改 SSH 配置并重启服务？\n\n⚠️ 如果改错了端口或禁用了密码登录，可能导致无法再连接，请谨慎操作。",
      danger: true,
      confirmText: "确认保存",
      onConfirm: async () => {
        try {
          const result = await api("/api/ssh-config/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              port: Number($("#sshPort").value) || 22,
              permit_root: $("#sshRoot").value,
              password_auth: $("#sshPass").value
            })
          });
          toast(result.message || "已保存");
          loadSshConfig();
        } catch (err) {
          if (err.message !== "需要访问令牌") toast(err.message, "error");
        }
      }
    });
  }

  // ---- 缓存清理 ----

  async function loadCleanStatus() {
    try {
      const data = await api("/api/clean/status");
      state.cleanItems = data.items || [];
      renderCleanList();
      $("#cleanTotal").textContent = "可释放约 " + formatBytes(data.total || 0);
    } catch (err) {
      if (err.message !== "需要访问令牌") toast(err.message, "error");
    }
  }

  function renderCleanList() {
    const items = state.cleanItems || [];
    $("#cleanList").innerHTML = items
      .map(
        (item) =>
          '<label class="clean-row">' +
          '<input type="checkbox" class="clean-check" data-key="' + esc(item.key) + '" checked>' +
          '<span class="clean-name">' + esc(item.name) + "</span>" +
          '<span class="clean-desc muted">' + esc(item.desc) + "</span>" +
          '<span class="clean-size">' + formatBytes(item.size) + "</span></label>"
      )
      .join("");
  }

  function runClean() {
    const keys = [];
    document.querySelectorAll(".clean-check:checked").forEach((el) => {
      keys.push(el.dataset.key);
    });
    if (!keys.length) {
      toast("请至少勾选一项", "error");
      return;
    }
    showConfirm({
      title: "缓存清理",
      message: "清理选中的 " + keys.length + " 项缓存？日志将保留最近 7 天。",
      confirmText: "开始清理",
      onConfirm: async () => {
        try {
          toast("正在清理…");
          const result = await api("/api/clean/run", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ keys })
          });
          toast(result.message || "清理完成");
          loadCleanStatus();
        } catch (err) {
          if (err.message !== "需要访问令牌") toast(err.message, "error");
        }
      }
    });
  }

  // ---- 面板设置 ----

  function showSettingsModal() {
    api("/api/settings").then((settings) => {
      const mask = document.createElement("div");
      mask.className = "modal-mask";
      mask.innerHTML =
        '<div class="modal"><h3 class="modal-title">' + icon("token") +
        "面板设置</h3>" +
        '<label class="form-label">访问验证码（6 位数字，登录后拼到 URL 即可访问）</label>' +
        '<input id="accessCodeInput" class="modal-input" maxlength="6" spellcheck="false" value="' +
        esc(settings.access_code || "") + '">' +
        '<div class="modal-actions"><button class="btn ghost" data-close>取消</button>' +
        '<button class="btn primary" data-save>更新验证码</button></div></div>';
      modalRoot.appendChild(mask);
      renderIcons(mask);
      const close = () => mask.remove();
      mask.querySelector("[data-close]").onclick = close;
      mask.addEventListener("click", (e) => { if (e.target === mask) close(); });
      mask.querySelector("[data-save]").onclick = async (e) => {
        const btn = e.currentTarget;
        btn.disabled = true;
        try {
          const code = mask.querySelector("#accessCodeInput").value.trim();
          const result = await api("/api/settings/access-code", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code })
          });
          toast(result.message || "已更新");
          close();
        } catch (err) {
          btn.disabled = false;
          if (err.message !== "需要访问令牌") toast(err.message, "error");
        }
      };
    });
  }

  // ---- 病毒扫描（ClamAV）----

  async function loadClamav() {
    try {
      const data = await api("/api/clamav/status");
      const badge = $("#clamavBadge");
      const installBtn = $("#btnClamavInstall");
      if (data.installed) {
        badge.textContent = "ClamAV " + (data.version || "") + (data.scanning ? " · 扫描中" : " · 就绪");
        installBtn.style.display = "none";
      } else {
        badge.textContent = "未安装 ClamAV";
        installBtn.style.display = "";
      }
      renderClamavResult();
    } catch (err) {
      if (err.message !== "需要访问令牌") toast(err.message, "error");
    }
  }

  async function renderClamavResult() {
    try {
      const result = await api("/api/clamav/last");
      const box = $("#clamavResult");
      if (!result || result.message === "暂无扫描记录") {
        box.innerHTML = '<p class="muted">暂无扫描记录</p>';
        return;
      }
      if (typeof result === "string") {
        box.innerHTML = '<p class="muted">' + esc(result) + "</p>";
        return;
      }
      if (result.ok === false && result.error) {
        box.innerHTML = '<p style="color:var(--danger)">' + esc(result.error) + "</p>";
        return;
      }
      if (result.ok === false && result.message) {
        box.innerHTML = '<p class="muted">' + esc(result.message) + "</p>";
        return;
      }
      let html = '<div class="panel-head"><h2>扫描结果：' + esc(result.path) + "</h2></div>";
      html += '<p>检测到 <strong>' + result.infected_count + "</strong> 个威胁</p>";
      if (result.infected && result.infected.length) {
        html += '<pre class="toolbox-pre" style="max-height:240px;overflow:auto">' +
          esc(result.infected.join("\n")) + "</pre>";
      }
      if (result.summary && result.summary.length) {
        html += '<pre class="toolbox-pre" style="margin-top:8px">' + esc(result.summary.join("\n")) + "</pre>";
      }
      box.innerHTML = html;
    } catch (err) {
      /* ignore */
    }
  }

  function installClamav() {
    showConfirm({
      title: "安装 ClamAV",
      message: "将通过 apt 安装 ClamAV 及病毒库守护进程，需要几分钟。",
      confirmText: "开始安装",
      onConfirm: async () => {
        toast("正在安装 ClamAV…");
        try {
          const result = await api("/api/clamav/install", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({})
          });
          toast(result.message || "安装完成");
          loadClamav();
        } catch (err) {
          if (err.message !== "需要访问令牌") toast(err.message, "error");
        }
      }
    });
  }

  function startClamScan() {
    const path = $("#clamavPath").value.trim() || "/";
    showConfirm({
      title: "开始病毒扫描",
      message: "将扫描 " + path + "（递归），全盘扫描耗时较长，确认开始？",
      confirmText: "开始扫描",
      onConfirm: async () => {
        try {
          const result = await api("/api/clamav/scan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ path })
          });
          toast(result.message || "扫描已启动");
          loadClamav();
        } catch (err) {
          if (err.message !== "需要访问令牌") toast(err.message, "error");
        }
      }
    });
  }

  // ---- 磁盘管理 ----

  async function loadDiskInfo() {
    try {
      const data = await api("/api/disk/info");
      renderDiskBlock(data.blockdevices || []);
      renderDiskUsage(data.usage || []);
    } catch (err) {
      if (err.message !== "需要访问令牌") toast(err.message, "error");
    }
  }

  function renderDiskBlock(devices) {
    const rows = [];
    function walk(dev, depth) {
      rows.push({ dev, depth });
      (dev.children || []).forEach((child) => walk(child, depth + 1));
    }
    devices.forEach((dev) => walk(dev, 0));
    $("#diskBlockBody").innerHTML = rows.length
      ? rows
          .map(({ dev, depth }) => {
            const indent = "&nbsp;".repeat(depth * 3);
            return (
              "<tr><td class=\"mono\">" + indent + (depth ? "└ " : "") + esc(dev.name) +
              '</td><td class="mono">' + esc(dev.size || "--") +
              '</td><td>' + esc(dev.type || "--") +
              '</td><td class="mono">' + esc(dev.fstype || "--") +
              '</td><td class="mono">' + esc(dev.mountpoint || "--") +
              '</td><td>' + esc(dev.model || "--") + "</td></tr>"
            );
          })
          .join("")
      : '<tr><td colspan="6" class="muted">无块设备信息</td></tr>';
  }

  function renderDiskUsage(usage) {
    $("#diskUsageList").innerHTML = usage.length
      ? usage
          .map((disk) => {
            const pct = Math.min(100, disk.percent || 0);
            const color = pct > 90 ? "var(--danger)" : pct > 70 ? "#f59e0b" : "var(--accent)";
            return (
              '<div class="disk-item">' +
              '<div class="disk-item-head"><strong class="mono">' + esc(disk.mount) +
              "</strong><span>" + formatBytes(disk.used) + " / " + formatBytes(disk.size) +
              " (" + pct + '%)</span></div>' +
              '<div class="disk-bar"><div class="disk-bar-fill" style="width:' + pct +
              '%;background:' + color + '"></div></div></div>'
            );
          })
          .join("")
      : '<p class="muted">无磁盘使用信息</p>';
  }

  // ---- 监控告警 ----

  async function loadAlerts() {
    try {
      const config = await api("/api/alerts/config");
      $("#alertEnabled").checked = !!config.enabled;
      $("#alertWebhook").value = config.webhook || "";
      $("#alertCpu").value = config.cpu_threshold || 90;
      $("#alertMem").value = config.mem_threshold || 90;
      $("#alertDisk").value = config.disk_threshold || 90;
      $("#alertCooldown").value = config.cooldown_minutes || 30;
    } catch (err) {
      if (err.message !== "需要访问令牌") toast(err.message, "error");
    }
  }

  async function saveAlerts() {
    try {
      const result = await api("/api/alerts/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enabled: $("#alertEnabled").checked,
          webhook: $("#alertWebhook").value.trim(),
          cpu_threshold: Number($("#alertCpu").value) || 90,
          mem_threshold: Number($("#alertMem").value) || 90,
          disk_threshold: Number($("#alertDisk").value) || 90,
          cooldown_minutes: Number($("#alertCooldown").value) || 30
        })
      });
      toast(result.message || "已保存");
    } catch (err) {
      if (err.message !== "需要访问令牌") toast(err.message, "error");
    }
  }

  async function testAlerts() {
    try {
      const webhook = $("#alertWebhook").value.trim();
      toast("正在发送测试消息…");
      const result = await api("/api/alerts/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ webhook })
      });
      toast(result.message || (result.ok ? "发送成功" : "发送失败"), result.ok ? "success" : "error");
    } catch (err) {
      if (err.message !== "需要访问令牌") toast(err.message, "error");
    }
  }

  function restoreBackup(name) {
    const mask = document.createElement("div");
    mask.className = "modal-mask";
    mask.innerHTML =
      '<div class="modal"><h3 class="modal-title">' +
      icon("rotate-cw") +
      '恢复备份</h3><p class="modal-message">' +
      esc(name) +
      '</p><label class="form-label" for="restoreTarget">恢复到目录</label>' +
      '<input id="restoreTarget" class="modal-input" value="/" spellcheck="false">' +
      '<div class="modal-actions"><button class="btn ghost" data-close>取消</button>' +
      '<button class="btn primary" data-save>恢复</button></div></div>';
    modalRoot.appendChild(mask);
    renderIcons(mask);
    const close = () => mask.remove();
    mask.querySelector("[data-close]").onclick = close;
    mask.addEventListener("click", (event) => {
      if (event.target === mask) close();
    });
    mask.querySelector("[data-save]").onclick = async (event) => {
      const btn = event.currentTarget;
      btn.disabled = true;
      try {
        const target = mask.querySelector("#restoreTarget").value.trim() || "/";
        const result = await api("/api/backups/restore", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, target })
        });
        toast(result.message || "恢复完成");
        close();
        await loadBackups();
      } catch (err) {
        btn.disabled = false;
        if (err.message !== "需要访问令牌") toast(err.message, "error");
      }
    };
  }

  function deleteBackup(name) {
    showConfirm({
      title: "删除备份",
      message: "确定删除备份文件 " + name + "？",
      danger: true,
      confirmText: "确认删除",
      onConfirm: async () => {
        const result = await api("/api/backups/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name })
        });
        toast(result.message || "已删除");
        await loadBackups();
      }
    });
  }

  async function downloadBackupFile(name) {
    try {
      const res = await fetch(
        "/api/backups/download?name=" + encodeURIComponent(name),
        { headers: { "X-Panel-Token": state.token } }
      );
      if (!res.ok) {
        let message = "下载失败";
        try {
          message = (await res.json()).message || message;
        } catch (err) {
          /* keep default */
        }
        throw new Error(message);
      }
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = name;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    } catch (err) {
      if (err.message !== "需要访问令牌") toast(err.message, "error");
    }
  }

  async function loadLogs() {
    const lines = $("#logLines").value;
    const data = await api("/api/logs?lines=" + encodeURIComponent(lines));
    state.logs = data.lines || [];
    $("#logSource").textContent = "来源：" + (data.source || "无");
    renderLogs();
  }

  async function loadToolbox() {
    const data = await api("/api/toolbox");
    state.toolbox = data;
    renderToolbox();
  }

  function syncToolboxTabs() {
    document.querySelectorAll(".toolbox-tab").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.toolboxTab === state.toolboxTab);
    });
    document.querySelectorAll(".toolbox-pane").forEach((pane) => {
      pane.classList.toggle("active", pane.dataset.tab === state.toolboxTab);
    });
  }

  async function loadCurrentToolboxTab() {
    syncToolboxTabs();
    const loaders = {
      system: loadToolbox,
      dns: loadToolbox,
      hosts: loadToolbox,
      cron: async () => {
        await loadCronJobs();
        await loadCron();
      },
      ssh: loadSshLogs,
      container: loadContainer,
      analytics: loadAnalytics,
      tamper: loadTamper,
      backup: async () => {
        await loadBackups();
        await loadCloudBackups();
      },
      logs: loadLogs,
      audit: loadAudit,
      sshmgr: loadSshConfig,
      clean: loadCleanStatus,
      clamav: loadClamav,
      disk: loadDiskInfo,
      alerts: loadAlerts
    };
    const loader = loaders[state.toolboxTab] || loadToolbox;
    await loader();
  }

  function switchToolboxTab(tab) {
    state.toolboxTab = tab;
    loadCurrentToolboxTab();
  }

  function renderToolbox() {
    const data = state.toolbox || {};
    const dns = data.dns || [];
    const localIps = data.local_ips || [];
    $("#dnsRows").innerHTML =
      '<div class="toolbox-row"><span class="label">DNS 服务器</span>' +
      '<span class="value mono">' +
      esc(dns.length ? dns.join(" ") : "--") +
      "</span></div>" +
      '<div class="toolbox-row"><span class="label">本机 IP</span>' +
      '<span class="value mono">' +
      esc(localIps.length ? localIps.join(" ") : "--") +
      "</span></div>";
    $("#hostsContent").textContent = data.hosts || "（空）";
    const swap = data.swap || {};
    const rows = [
      [
        "Swap",
        formatBytes(swap.total) +
          (swap.percent ? " · " + swap.percent + "%" : "")
      ],
      ["主机名", data.hostname || "--"],
      ["系统密码", "••••••"],
      ["NTP 服务器", (data.ntp || []).join(" ") || "--"],
      ["系统时区", data.timezone || "--"],
      ["服务器时间", data.server_time || "--"]
    ];
    $("#sysInfoRows").innerHTML = rows
      .map(
        (row) =>
          '<div class="toolbox-row"><span class="label">' +
          esc(row[0]) +
          '</span><span class="value mono"' +
          (row[0] === "系统密码" ? ' title="不显示明文密码"' : "") +
          ">" +
          esc(row[1]) +
          "</span></div>"
      )
      .join("");
  }

  async function resolveDomain() {
    const input = $("#dnsDomain");
    const domain = input.value.trim();
    if (!domain) {
      toast("请输入域名", "error");
      return;
    }
    const result = $("#dnsResult");
    result.textContent = "解析中...";
    try {
      const data = await api(
        "/api/toolbox/dns?domain=" + encodeURIComponent(domain)
      );
      result.textContent = data.error
        ? "解析失败：" + data.error
        : data.ips.length
          ? data.ips.join("\n")
          : "无解析结果";
    } catch (err) {
      if (err.message !== "需要访问令牌") {
        result.textContent = "解析失败：" + err.message;
      }
    }
  }

  async function loadCron() {
    const data = await api("/api/cron");
    state.cronLines = data.lines || [];
    renderCron();
  }

  function renderCron() {
    const lines = state.cronLines || [];
    $("#cronCount").textContent = lines.length + " 条任务";
    if (!lines.length) {
      $("#cronBody").innerHTML =
        '<tr><td colspan="4" class="muted">还没有计划任务</td></tr>';
      return;
    }
    $("#cronBody").innerHTML = lines
      .map(
        (item) =>
          "<tr>" +
          '<td class="mono">' + item.index + "</td>" +
          '<td class="cmd mono" title="' + esc(item.raw) + '">' +
          esc(item.raw) +
          "</td>" +
          '<td><span class="state ' +
          (item.enabled ? "active" : "inactive") +
          '">' +
          (item.enabled ? "启用" : "停用") +
          "</span></td>" +
          '<td class="col-actions"><div class="act">' +
          '<button class="icon-btn" data-cron-toggle="' +
          item.index +
          '" title="启用/停用">' +
          icon("power") +
          '</button><button class="icon-btn danger" data-cron-remove="' +
          item.index +
          '" title="删除任务">' +
          icon("trash") +
          "</button></div></td></tr>"
      )
      .join("");
    renderIcons($("#cronBody"));
  }

  function showCronModal() {
    const mask = document.createElement("div");
    mask.className = "modal-mask";
    mask.innerHTML =
      '<div class="modal">' +
      '<h3 class="modal-title">' + icon("clock") + "添加计划任务</h3>" +
      '<label class="form-label" for="cronSchedule">计划格式</label>' +
      '<input id="cronSchedule" class="modal-input" placeholder="*/5 * * * *" spellcheck="false">' +
      '<label class="form-label" for="cronCommand">命令</label>' +
      '<input id="cronCommand" class="modal-input" placeholder="/usr/bin/your-script.sh" spellcheck="false">' +
      '<div class="modal-actions">' +
      '<button class="btn ghost" data-close>取消</button>' +
      '<button class="btn primary" data-save>保存</button>' +
      "</div></div>";
    modalRoot.appendChild(mask);
    renderIcons(mask);
    const close = () => mask.remove();
    mask.querySelector("[data-close]").onclick = close;
    mask.addEventListener("click", (event) => {
      if (event.target === mask) close();
    });
    mask.querySelector("[data-save]").onclick = async () => {
      const schedule = mask.querySelector("#cronSchedule").value.trim();
      const command = mask.querySelector("#cronCommand").value.trim();
      if (!schedule || !command) {
        toast("请填写完整", "error");
        return;
      }
      try {
        await api("/api/cron/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ schedule, command })
        });
        toast("计划任务已添加");
        close();
        await loadCron();
      } catch (err) {
        if (err.message !== "需要访问令牌") toast(err.message, "error");
      }
    };
    setTimeout(() => mask.querySelector("#cronSchedule").focus(), 50);
  }

  function cronToggle(index) {
    api("/api/cron/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ index })
    })
      .then(() => {
        toast("任务状态已切换");
        loadCron();
      })
      .catch((err) => {
        if (err.message !== "需要访问令牌") toast(err.message, "error");
      });
  }

  function cronRemove(index) {
    const line = state.cronLines.find((item) => item.index === index);
    showConfirm({
      title: "删除计划任务",
      message: "确定要删除计划任务吗？" + (line ? "\n" + line.raw : ""),
      danger: true,
      confirmText: "删除",
      onConfirm: async () => {
        await api("/api/cron/remove", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ index })
        });
        toast("计划任务已删除");
        await loadCron();
      }
    });
  }

  async function loadSshLogs() {
    const lines = $("#sshLines").value;
    const data = await api(
      "/api/ssh-logs?lines=" + encodeURIComponent(lines)
    );
    state.sshEvents = data.events || [];
    renderSshLogs();
  }

  function renderSshLogs() {
    const kind = document
      .querySelector("#sshFilter .seg.active")
      .dataset.kind;
    const list = state.sshEvents.filter(
      (event) => kind === "all" || event.event === kind
    );
    $("#sshCount").textContent =
      "共 " + state.sshEvents.length + " 条，显示 " + list.length + " 条";
    if (!list.length) {
      $("#sshBody").innerHTML =
        '<tr><td colspan="5" class="muted">没有匹配的日志</td></tr>';
      return;
    }
    const eventCls = {
      success: "active",
      failed: "failed",
      session: "activating",
      other: "inactive"
    };
    const eventText = {
      success: "登录成功",
      failed: "登录失败",
      session: "会话",
      other: "其他"
    };
    $("#sshBody").innerHTML = list
      .map(
        (event) =>
          "<tr>" +
          '<td class="mono">' + esc(event.time || "--") + "</td>" +
          '<td><span class="state ' +
          (eventCls[event.event] || "inactive") +
          '">' +
          (eventText[event.event] || event.event) +
          "</span></td>" +
          "<td>" + esc(event.user || "--") + "</td>" +
          '<td class="mono">' + esc(event.ip || "--") + "</td>" +
          '<td class="cmd mono" title="' + esc(event.detail) + '">' +
          esc(event.detail) +
          "</td></tr>"
      )
      .join("");
  }

  async function loadAudit() {
    const lines = $("#auditLines").value || "200";
    try {
      const data = await api(
        "/api/audit?lines=" + encodeURIComponent(lines)
      );
      state.auditLogs = data.logs || [];
      renderAudit();
    } catch (err) {
      if (err.message !== "需要访问令牌") toast(err.message, "error");
    }
  }

  function renderAudit() {
    const list = state.auditLogs || [];
    $("#auditCount").textContent = list.length + " 条";
    $("#auditBody").innerHTML = list.length
      ? list
          .map(
            (item) =>
              "<tr>" +
              '<td class="mono">' + esc(item.time || "--") + "</td>" +
              '<td class="mono">' + esc(item.ip || "--") + "</td>" +
              '<td class="cmd mono" title="' + esc(item.route) + '">' +
              esc(item.route) +
              "</td>" +
              '<td class="cmd mono" title="' + esc(item.detail) + '">' +
              esc(item.detail || "--") +
              "</td>" +
              '<td><span class="state ' +
              (item.ok ? "active" : "failed") +
              '">' +
              (item.ok ? "成功" : "失败") +
              "</span></td>" +
              '<td class="mono">' +
              (item.duration_ms == null
                ? "--"
                : item.duration_ms + " ms") +
              "</td></tr>"
          )
          .join("")
      : '<tr><td colspan="6" class="muted">暂无操作记录</td></tr>';
  }

  function clearAudit() {
    showConfirm({
      title: "清空审计日志",
      message: "确定清空所有面板操作审计记录？此操作不可恢复。",
      danger: true,
      confirmText: "清空",
      onConfirm: async () => {
        const result = await api("/api/audit/clear", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({})
        });
        toast(result.message || "已清空");
        await loadAudit();
      }
    });
  }

  async function loadApps() {
    const data = await api("/api/apps");
    state.apps = data.apps || [];
    renderApps();
  }

  function renderApps() {
    const apps = state.apps || [];
    const query = $("#appsSearch").value.trim().toLowerCase();
    const updatable = apps.filter((app) => app.update_available);
    const categories = [];
    apps.forEach((app) => {
      const category = app.category || "其他";
      if (!categories.includes(category)) categories.push(category);
    });
    const chips = [
      { key: "all", label: "全部", count: apps.length },
      { key: "updatable", label: "可更新", count: updatable.length }
    ].concat(
      categories.map((category) => ({
        key: category,
        label: category,
        count: apps.filter((app) => (app.category || "其他") === category).length
      }))
    );
    $("#appsCategories").innerHTML = chips
      .map(
        (chip) =>
          '<button class="category-chip' +
          (state.appsCategory === chip.key ? " active" : "") +
          '" data-category="' +
          esc(chip.key) +
          '">' +
          esc(chip.label) +
          " <span>" +
          chip.count +
          "</span></button>"
      )
      .join("");
    let list = apps;
    if (state.appsCategory === "updatable") {
      list = list.filter((app) => app.update_available);
    } else if (state.appsCategory !== "all") {
      list = list.filter(
        (app) => (app.category || "其他") === state.appsCategory
      );
    }
    if (query) {
      list = list.filter((app) =>
        [app.name, app.category, app.desc, app.command].some((value) =>
          String(value || "")
            .toLowerCase()
            .includes(query)
        )
      );
    }
    $("#appsCount").textContent =
      "共 " +
      apps.length +
      " 个应用 · 可更新 " +
      updatable.length +
      " · 显示 " +
      list.length +
      " 个";
    if (!list.length) {
      $("#appsBody").innerHTML =
        '<tr><td colspan="6" class="muted">没有匹配的应用</td></tr>';
      return;
    }
    $("#appsBody").innerHTML = list
      .map(
        (app) => {
          const stateCls = app.update_available
            ? "activating"
            : app.installed
              ? "active"
              : "inactive";
          const stateText = app.update_available
            ? "可更新"
            : app.installed
              ? "已安装"
              : "未安装";
          const versionText = app.update_available
            ? (app.current_version || "--") +
              " → " +
              (app.available_version || "--")
            : app.installed
              ? app.current_version || "已安装"
              : "未安装";
          let actions =
            '<button class="icon-btn" data-copy="' +
            esc(app.command) +
            '" title="复制安装指令">' +
            icon("copy") +
            "</button>";
          if (app.update_available) {
            actions +=
              '<button class="icon-btn" data-update="' +
              esc(app.id) +
              '" title="一键更新">' +
              icon("rotate-cw") +
              "</button>";
          }
          if (app.installed) {
            actions +=
              '<button class="icon-btn danger" data-uninstall="' +
              esc(app.id) +
              '" title="卸载">' +
              icon("trash") +
              "</button>";
          }
          actions +=
            '<button class="icon-btn ' +
            (app.installed ? "" : "primary") +
            '" data-install="' +
            esc(app.id) +
            '" title="一键安装">' +
            icon("play") +
            "</button>";
          return (
            "<tr>" +
            "<td>" + esc(app.name) + "</td>" +
            '<td><span class="state app">' + esc(app.category) + "</span></td>" +
            "<td>" + esc(app.desc) + "</td>" +
            '<td class="cmd mono" title="' + esc(app.command) + '">' +
            esc(app.command) +
            "</td>" +
            '<td><span class="state ' +
            stateCls +
            '" title="' +
            esc(versionText) +
            '">' +
            stateText +
            "</span></td>" +
            '<td class="col-actions actions-wide"><div class="act">' +
            actions +
            "</div></td></tr>"
          );
        }
      )
      .join("");
    renderIcons($("#appsBody"));
  }

  async function checkAppUpdates() {
    try {
      const data = await api("/api/apps/check-updates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      });
      state.apps = data.apps || [];
      renderApps();
      toast(
        data.update_count
          ? "发现 " + data.update_count + " 个可更新应用"
          : "所有应用已是最新"
      );
    } catch (err) {
      if (err.message !== "需要访问令牌") toast(err.message, "error");
    }
  }

  function updateApp(id) {
    const app = state.apps.find((item) => item.id === id);
    if (!app) return;
    showConfirm({
      title: "一键更新 " + app.name,
      message:
        "将更新 " +
        app.name +
        "（" +
        (app.current_version || "--") +
        " → " +
        (app.available_version || "最新") +
        "），确认继续吗？",
      confirmText: "更新",
      onConfirm: async () => {
        try {
          toast("正在更新 " + app.name + "，请稍候...");
          const result = await api("/api/apps/install", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, update: true })
          });
          showInstallResult(app.name, result, "更新");
          await loadApps();
        } catch (err) {
          if (err.message !== "需要访问令牌") toast(err.message, "error");
        }
      }
    });
  }

  function fallbackCopy(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      toast("安装指令已复制");
    } catch (err) {
      toast("复制失败", "error");
    } finally {
      textarea.remove();
    }
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(text)
        .then(() => toast("安装指令已复制"))
        .catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  }

  function installApp(id) {
    const app = state.apps.find((item) => item.id === id);
    if (!app) return;
    showConfirm({
      title: "一键安装 " + app.name,
      message: "将执行：\n" + app.command + "\n\n确认开始安装吗？",
      danger: true,
      confirmText: "开始安装",
      onConfirm: async () => {
        try {
          toast("正在安装 " + app.name + "，请稍候...");
          const result = await api("/api/apps/install", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
          });
          showInstallResult(app.name, result);
        } catch (err) {
          if (err.message !== "需要访问令牌") toast(err.message, "error");
        }
      }
    });
  }

  function showInstallResult(name, result, action) {
    const mask = document.createElement("div");
    mask.className = "modal-mask";
    mask.innerHTML =
      '<div class="modal">' +
      '<h3 class="modal-title">' +
      icon("package") +
      esc(name) +
      " " +
      esc(action || "安装") +
      "结果</h3>" +
      '<div class="file-viewer"></div>' +
      '<div class="modal-actions" style="margin-top:12px">' +
      '<button class="btn ghost" data-close>关闭</button></div></div>';
    mask.querySelector(".file-viewer").textContent =
      (result.stdout || "") +
      (result.stderr || "") +
      "\n[退出码 " +
      result.returncode +
      "]";
    modalRoot.appendChild(mask);
    renderIcons(mask);
    mask.querySelector("[data-close]").onclick = () => mask.remove();
    mask.addEventListener("click", (event) => {
      if (event.target === mask) mask.remove();
    });
  }

  // ---- Docker 应用商店 ----

  async function loadDockerApps() {
    try {
      const data = await api("/api/docker-apps");
      state.dockerApps = data.apps || [];
      renderDockerApps();
    } catch (err) {
      if (err.message !== "需要访问令牌") toast(err.message, "error");
    }
  }

  function renderDockerApps() {
    const apps = state.dockerApps || [];
    $("#dockerAppsGrid").innerHTML = apps
      .map(
        (app) => {
          const badge = app.installed
            ? '<span class="state ' + (app.running ? "active" : "warn") + '">' +
              (app.running ? "运行中" : "已停止") + "</span>"
            : '<span class="state inactive">未安装</span>';
          let actions;
          if (!app.installed) {
            actions =
              '<button class="btn sm primary" data-dapp-install="' + esc(app.id) + '">' +
              icon("download") + "<span>安装</span></button>";
          } else {
            actions =
              '<button class="btn sm" data-dapp-action="' + esc(app.id) + '" data-act="' +
              (app.running ? "stop" : "up") + '">' +
              icon(app.running ? "pause" : "play") +
              "<span>" + (app.running ? "停止" : "启动") + "</span></button>" +
              '<button class="btn sm" data-dapp-logs="' + esc(app.id) + '">' +
              icon("terminal") + "<span>日志</span></button>" +
              '<button class="btn sm" data-dapp-backup="' + esc(app.id) + '">' +
              icon("archive") + "<span>备份</span></button>" +
              '<button class="btn sm danger" data-dapp-uninstall="' + esc(app.id) + '">' +
              icon("trash") + "<span>卸载</span></button>";
          }
          const docLink = app.doc
            ? '<a class="docker-app-doc" href="' + esc(app.doc) + '" target="_blank" rel="noopener">' +
              icon("globe") + " 官网文档</a>"
            : "";
          return (
            '<div class="docker-app-card">' +
            '<div class="docker-app-head"><strong>' + esc(app.name) + "</strong>" + badge + "</div>" +
            '<div class="docker-app-desc">' + esc(app.desc) + "</div>" +
            '<div class="docker-app-meta muted">' + esc(app.image) + " · 默认端口 " + app.port + "</div>" +
            (docLink ? '<div class="docker-app-meta">' + docLink + "</div>" : "") +
            '<div class="docker-app-actions">' + actions + "</div></div>"
          );
        }
      )
      .join("");
    renderIcons($("#dockerAppsGrid"));
  }

  function showDockerAppInstallModal(id) {
    const app = (state.dockerApps || []).find((item) => item.id === id);
    if (!app) return;
    const paramFields = (app.params || [])
      .map(
        (p) =>
          '<label class="form-label">' + esc(p.label) + '</label>' +
          '<input class="modal-input" data-param="' + esc(p.key) + '" type="' +
          (p.type === "password" ? "password" : "text") + '" spellcheck="false">'
      )
      .join("");
    const mask = document.createElement("div");
    mask.className = "modal-mask";
    mask.innerHTML =
      '<div class="modal modal-lg"><h3 class="modal-title">' + icon("download") +
      "安装 " + esc(app.name) + "</h3>" +
      '<label class="form-label">端口</label>' +
      '<input id="dappPort" class="modal-input" value="' + app.port + '" spellcheck="false">' +
      paramFields +
      '<p class="muted" style="font-size:12px;margin-top:8px">镜像：' + esc(app.image) +
      "，安装时会自动拉取，请保持网络畅通</p>" +
      '<div class="modal-actions"><button class="btn ghost" data-close>取消</button>' +
      '<button class="btn primary" data-save>开始安装</button></div></div>';
    modalRoot.appendChild(mask);
    renderIcons(mask);
    const close = () => mask.remove();
    mask.querySelector("[data-close]").onclick = close;
    mask.addEventListener("click", (e) => { if (e.target === mask) close(); });
    mask.querySelector("[data-save]").onclick = async (e) => {
      const btn = e.currentTarget;
      btn.disabled = true;
      try {
        const params = {};
        mask.querySelectorAll("[data-param]").forEach((input) => {
          params[input.dataset.param] = input.value;
        });
        const port = Number(mask.querySelector("#dappPort").value) || app.port;
        toast("正在安装 " + app.name + "（拉取镜像可能需要几分钟）…");
        close();
        const result = await api("/api/docker-apps/install", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, port, params })
        });
        toast(result.message || "安装完成");
        loadDockerApps();
      } catch (err) {
        btn.disabled = false;
        if (err.message !== "需要访问令牌") toast(err.message, "error");
      }
    };
  }

  function dockerAppAction(id, action) {
    api("/api/docker-apps/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action })
    })
      .then((r) => { toast(r.message || "操作完成"); loadDockerApps(); })
      .catch((err) => {
        if (err.message !== "需要访问令牌") toast(err.message, "error");
      });
  }

  async function showDockerAppLogs(id) {
    const app = (state.dockerApps || []).find((item) => item.id === id);
    try {
      const data = await api("/api/docker-apps/logs?id=" + encodeURIComponent(id));
      const mask = document.createElement("div");
      mask.className = "modal-mask";
      mask.innerHTML =
        '<div class="modal modal-lg"><h3 class="modal-title">' + icon("terminal") +
        esc(app ? app.name : id) + " 运行日志</h3>" +
        '<pre class="toolbox-pre" style="max-height:60vh;overflow:auto">' +
        esc((data.logs || []).join("\n") || "暂无日志") +
        '</pre><div class="modal-actions"><button class="btn ghost" data-close>关闭</button></div></div>';
      modalRoot.appendChild(mask);
      renderIcons(mask);
      const close = () => mask.remove();
      mask.querySelector("[data-close]").onclick = close;
      mask.addEventListener("click", (e) => { if (e.target === mask) close(); });
    } catch (err) {
      if (err.message !== "需要访问令牌") toast(err.message, "error");
    }
  }

  function uninstallDockerApp(id) {
    const app = (state.dockerApps || []).find((item) => item.id === id);
    if (!app) return;
    const mask = document.createElement("div");
    mask.className = "modal-mask";
    mask.innerHTML =
      '<div class="modal"><h3 class="modal-title">' + icon("trash") +
      "卸载 " + esc(app.name) + "</h3>" +
      '<p class="modal-message">将停止并移除容器，Compose 配置移入回收站。</p>' +
      '<label class="check-row"><input type="checkbox" id="dappPurge">同时删除数据卷（数据不可恢复！）</label>' +
      '<div class="modal-actions"><button class="btn ghost" data-close>取消</button>' +
      '<button class="btn danger" data-save>确认卸载</button></div></div>';
    modalRoot.appendChild(mask);
    renderIcons(mask);
    const close = () => mask.remove();
    mask.querySelector("[data-close]").onclick = close;
    mask.addEventListener("click", (e) => { if (e.target === mask) close(); });
    mask.querySelector("[data-save]").onclick = async (e) => {
      const btn = e.currentTarget;
      btn.disabled = true;
      const purge = mask.querySelector("#dappPurge").checked;
      try {
        const result = await api("/api/docker-apps/uninstall", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, purge })
        });
        toast(result.message || "已卸载");
        close();
        loadDockerApps();
      } catch (err) {
        btn.disabled = false;
        if (err.message !== "需要访问令牌") toast(err.message, "error");
      }
    };
  }

  function backupDockerApp(id) {
    const app = (state.dockerApps || []).find((item) => item.id === id);
    if (!app) return;
    showConfirm({
      title: "备份应用数据",
      message: "将 " + app.name + " 的数据卷打包到本地备份目录？\n\n备份期间应用会短暂停止，完成后自动恢复。",
      confirmText: "开始备份",
      onConfirm: async () => {
        try {
          toast("正在备份 " + app.name + " 的数据卷…");
          const result = await api("/api/docker-apps/backup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
          });
          toast(result.message || "备份完成");
          loadDockerApps();
        } catch (err) {
          if (err.message !== "需要访问令牌") toast(err.message, "error");
        }
      }
    });
  }

  function uninstallApp(id) {
    const app = state.apps.find((item) => item.id === id);
    if (!app) return;
    showConfirm({
      title: "卸载 " + app.name,
      message: "将执行 apt-get remove --purge 并自动清理依赖，确认卸载吗？",
      danger: true,
      confirmText: "确认卸载",
      onConfirm: async () => {
        try {
          toast("正在卸载 " + app.name + "…");
          const result = await api("/api/apps/uninstall", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
          });
          showInstallResult(app.name, result, "卸载");
          await loadApps();
        } catch (err) {
          if (err.message !== "需要访问令牌") toast(err.message, "error");
        }
      }
    });
  }

  async function loadAnalytics() {
    try {
      const status = await api("/api/analytics/status");
      if (status.paths && status.paths.length) {
        $("#analyticsPath").value = status.paths.join(", ");
      }
      if (status.ports && status.ports.length) {
        $("#analyticsPorts").value = status.ports.join(", ");
      }
    } catch (err) {
      if (err.message !== "需要访问令牌") toast(err.message, "error");
      return;
    }
    try {
      const data = await api("/api/analytics");
      state.analytics = data;
      renderAnalyticsMetrics(data);
      renderAnalyticsView();
    } catch (err) {
      if (err.message !== "需要访问令牌") toast(err.message, "error");
    }
  }

  async function saveAnalyticsPaths() {
    const value = $("#analyticsPath").value;
    const paths = value
      .split(/[,，\n]+/)
      .map((item) => item.trim())
      .filter(Boolean);
    const portValue = $("#analyticsPorts").value;
    const ports = portValue
      .split(/[,，\n]+/)
      .map((item) => item.trim())
      .filter(Boolean);
    if (!paths.length && !ports.length) {
      toast("请输入访问日志路径或端口", "error");
      return;
    }
    try {
      if (paths.length) {
        await api("/api/analytics/paths", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paths })
        });
      }
      if (ports.length) {
        await api("/api/analytics/ports", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ports })
        });
      }
      toast("监控配置已保存");
      await loadAnalytics();
    } catch (err) {
      if (err.message !== "需要访问令牌") toast(err.message, "error");
    }
  }

  function switchAnalyticsView(view) {
    state.analyticsView = view;
    document.querySelectorAll("#analyticsNav .seg").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.view === view);
    });
    renderAnalyticsView();
  }

  function renderAnalyticsMetrics(data) {
    const realtime = (data && data.realtime) || {};
    const last60 = realtime.last_60s || {};
    $("#analyticsMetrics").innerHTML =
      '<div class="metric"><div class="metric-label">' + icon("activity") + '总请求</div>' +
      '<div class="metric-value">' + (data.requests || 0) + '</div>' +
      '<div class="metric-sub">错误 ' + (data.errors || 0) + ' 次</div></div>' +
      '<div class="metric"><div class="metric-label">' + icon("users") + '独立访客</div>' +
      '<div class="metric-value">' + (data.unique_ips || 0) + '</div>' +
      '<div class="metric-sub">按 IP 统计</div></div>' +
      '<div class="metric"><div class="metric-label">' + icon("hard-drive") + '总流量</div>' +
      '<div class="metric-value">' + formatBytes(data.traffic || 0) + '</div>' +
      '<div class="metric-sub">最近日志总量</div></div>' +
      '<div class="metric"><div class="metric-label">' + icon("clock") + '60秒请求</div>' +
      '<div class="metric-value">' + (last60.requests || 0) + '</div>' +
      '<div class="metric-sub">流量 ' + formatBytes(last60.traffic || 0) + '</div></div>';
    renderIcons($("#analyticsMetrics"));
  }

  function renderAnalyticsView() {
    const data = state.analytics;
    const view = $("#analyticsView");
    if (!data) {
      view.innerHTML = '<div class="analytics-empty">暂无数据</div>';
      return;
    }
    if (state.analyticsView === "ports") {
      renderAnalyticsPorts();
      return;
    }
    if (data.requests === 0) {
      view.innerHTML =
        '<div class="analytics-empty">未找到访问日志，请先配置日志路径</div>';
      return;
    }
    if (state.analyticsView === "realtime") renderAnalyticsRealtime();
    else if (state.analyticsView === "trend") renderAnalyticsTrend();
    else if (state.analyticsView === "sources") renderAnalyticsSources();
    else if (state.analyticsView === "stats") renderAnalyticsStats();
    else renderAnalyticsRequests();
  }

  function renderAnalyticsRealtime() {
    const recent = (state.analytics.recent || []).slice(0, 30);
    $("#analyticsView").innerHTML =
      '<div class="panel table-panel"><div class="panel-head"><h2>最近请求</h2>' +
      '<span class="muted">最近 ' + recent.length + " 条</span></div>" +
      '<div class="table-wrap"><table class="data-table"><thead><tr>' +
      "<th>时间</th><th>IP</th><th>方法</th><th>路径</th><th>状态</th><th>大小</th><th>UA</th>" +
      "</tr></thead><tbody>" +
      (recent.length
        ? recent
            .map(
              (item) =>
                "<tr>" +
                '<td class="mono">' + esc(item.time) + "</td>" +
                '<td class="mono">' + esc(item.ip) + "</td>" +
                "<td>" + esc(item.method) + "</td>" +
                '<td class="cmd mono" title="' + esc(item.path) + '">' +
                esc(item.path) +
                "</td>" +
                '<td class="mono">' + item.status + "</td>" +
                '<td class="mono">' + formatBytes(item.bytes) + "</td>" +
                '<td class="cmd mono" title="' + esc(item.ua) + '">' +
                esc(item.ua) +
                "</td></tr>"
            )
            .join("")
        : '<tr><td colspan="7" class="muted">暂无请求</td></tr>') +
      "</tbody></table></div></div>";
  }

  function renderAnalyticsTrend() {
    const trend = state.analytics.trend || [];
    if (!trend.length) {
      $("#analyticsView").innerHTML =
        '<div class="analytics-empty">最近 24 小时暂无请求</div>';
      return;
    }
    const max = Math.max.apply(
      null,
      trend.map((item) => item.requests).concat([1])
    );
    $("#analyticsView").innerHTML =
      '<div class="panel"><div class="panel-head"><h2>访客趋势</h2>' +
      '<span class="muted">最近 24 小时</span></div><div class="trend-chart">' +
      trend
        .map(
          (item) =>
            '<div class="trend-col" title="' +
            esc(item.label) +
            " 请求 " +
            item.requests +
            " · 访客 " +
            item.visitors +
            '"><div class="trend-bar" style="height:' +
            Math.max(2, (item.requests / max) * 100) +
            '%"></div><span>' +
            esc(item.label) +
            "</span></div>"
        )
        .join("") +
      "</div></div>";
  }

  function analyticsTable(items, nameLabel, countLabel) {
    if (!items || !items.length) {
      return '<tr><td colspan="2" class="muted">暂无数据</td></tr>';
    }
    return items
      .map(
        (item) =>
          "<tr><td>" +
          esc(item.name) +
          "</td><td class=\"mono\">" +
          item.count +
          "</td></tr>"
      )
      .join("");
  }

  function renderAnalyticsSources() {
    const sources = state.analytics.sources || {};
    $("#analyticsView").innerHTML =
      '<div class="analytics-grid">' +
      '<div class="panel"><div class="panel-head"><h2>访客来源</h2></div>' +
      '<div class="table-wrap"><table class="data-table"><thead><tr><th>来源域名</th><th>请求数</th></tr></thead><tbody>' +
      analyticsTable(sources.referrers, "来源域名", "请求数") +
      "</tbody></table></div></div>" +
      '<div class="panel"><div class="panel-head"><h2>访客 IP 段</h2></div>' +
      '<div class="table-wrap"><table class="data-table"><thead><tr><th>IP 段</th><th>请求数</th></tr></thead><tbody>' +
      analyticsTable(sources.networks, "IP 段", "请求数") +
      "</tbody></table></div></div></div>";
  }

  function renderAnalyticsStats() {
    const stats = state.analytics.stats || {};
    $("#analyticsView").innerHTML =
      '<div class="analytics-grid">' +
      '<div class="panel"><div class="panel-head"><h2>请求状态</h2></div>' +
      '<div class="table-wrap"><table class="data-table"><thead><tr><th>状态码</th><th>次数</th></tr></thead><tbody>' +
      analyticsTable(stats.status, "状态码", "次数") +
      "</tbody></table></div></div>" +
      '<div class="panel"><div class="panel-head"><h2>访问设备</h2></div>' +
      '<div class="table-wrap"><table class="data-table"><thead><tr><th>设备</th><th>次数</th></tr></thead><tbody>' +
      analyticsTable(stats.devices, "设备", "次数") +
      "</tbody></table></div></div>" +
      '<div class="panel"><div class="panel-head"><h2>蜘蛛</h2></div>' +
      '<div class="table-wrap"><table class="data-table"><thead><tr><th>蜘蛛 UA</th><th>次数</th></tr></thead><tbody>' +
      analyticsTable(stats.spiders, "蜘蛛", "次数") +
      "</tbody></table></div></div>" +
      '<div class="panel"><div class="panel-head"><h2>热门页面</h2></div>' +
      '<div class="table-wrap"><table class="data-table"><thead><tr><th>路径</th><th>次数</th></tr></thead><tbody>' +
      analyticsTable(stats.pages, "路径", "次数") +
      "</tbody></table></div></div></div>";
  }

  function renderAnalyticsRequests() {
    $("#analyticsView").innerHTML =
      '<div class="panel table-panel"><div class="panel-head"><h2>请求日志</h2></div>' +
      '<div class="toolbox-body"><input id="analyticsReqSearch" class="analytics-request-search" placeholder="搜索 IP、路径或 UA" spellcheck="false"></div>' +
      '<div class="table-wrap"><table class="data-table"><thead><tr>' +
      "<th>时间</th><th>IP</th><th>方法</th><th>路径</th><th>状态</th><th>大小</th><th>UA</th>" +
      "</tr></thead><tbody id=\"analyticsReqBody\"></tbody></table></div></div>";
    renderAnalyticsRequestsTable("");
  }

  function renderAnalyticsRequestsTable(query) {
    const recent = state.analytics.recent || [];
    const q = query.trim().toLowerCase();
    const list = q
      ? recent.filter(
          (item) =>
            String(item.ip).toLowerCase().includes(q) ||
            String(item.path).toLowerCase().includes(q) ||
            String(item.ua).toLowerCase().includes(q)
        )
      : recent;
    $("#analyticsReqBody").innerHTML = list.length
      ? list
          .map(
            (item) =>
              "<tr>" +
              '<td class="mono">' + esc(item.time) + "</td>" +
              '<td class="mono">' + esc(item.ip) + "</td>" +
              "<td>" + esc(item.method) + "</td>" +
              '<td class="cmd mono" title="' + esc(item.path) + '">' +
              esc(item.path) +
              "</td>" +
              '<td class="mono">' + item.status + "</td>" +
              '<td class="mono">' + formatBytes(item.bytes) + "</td>" +
              '<td class="cmd mono" title="' + esc(item.ua) + '">' +
              esc(item.ua) +
              "</td></tr>"
          )
          .join("")
      : '<tr><td colspan="7" class="muted">没有匹配的请求</td></tr>';
  }

  function renderAnalyticsPorts() {
    const ports = (state.analytics && state.analytics.ports) || [];
    const events = (state.analytics && state.analytics.port_events) || [];
    const view = $("#analyticsView");
    if (!ports.length) {
      view.innerHTML =
        '<div class="analytics-empty">请先配置要监控的端口，例如 6000,6001</div>';
      return;
    }
    view.innerHTML = ports
      .map((item) => {
        const portEvents = events.filter((event) => event.port === item.port);
        return (
          '<div class="panel table-panel" style="margin-bottom:12px">' +
          '<div class="panel-head"><h2>端口 ' +
          item.port +
          '</h2><span class="muted">活动连接 ' +
          item.active +
          " · 新增 " +
          item.new +
          " · 来源 IP " +
          item.ips +
          "</span></div>" +
          '<div class="table-wrap"><table class="data-table"><thead><tr>' +
          "<th>时间</th><th>远端地址</th><th>事件</th>" +
          "</tr></thead><tbody>" +
          (portEvents.length
            ? portEvents
                .map(
                  (event) =>
                    "<tr>" +
                    '<td class="mono">' + esc(event.time) + "</td>" +
                    '<td class="mono">' + esc(event.remote) + "</td>" +
                    '<td><span class="state active">' +
                    esc(event.action) +
                    "</span></td></tr>"
                )
                .join("")
            : '<tr><td colspan="3" class="muted">暂无新连接</td></tr>') +
          "</tbody></table></div></div>"
        );
      })
      .join("");
  }

  async function loadTamper() {
    try {
      const data = await api("/api/tamper/status");
      if (data.paths && data.paths.length) {
        $("#tamperPath").value = data.paths.join(", ");
      }
      state.tamper = data;
      renderTamperMetrics(data);
      renderTamperView();
    } catch (err) {
      if (err.message !== "需要访问令牌") toast(err.message, "error");
    }
  }

  async function saveTamperPaths() {
    const value = $("#tamperPath").value;
    const paths = value
      .split(/[,，\n]+/)
      .map((item) => item.trim())
      .filter(Boolean);
    if (!paths.length) {
      toast("请输入监控路径", "error");
      return;
    }
    try {
      await api("/api/tamper/paths", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paths })
      });
      toast("监控路径已保存");
      await loadTamper();
    } catch (err) {
      if (err.message !== "需要访问令牌") toast(err.message, "error");
    }
  }

  function initTamperBaseline() {
    showConfirm({
      title: "初始化基线",
      message: "将以当前文件状态建立完整性基线，初始化后文件变更会被检测出来。",
      confirmText: "初始化",
      onConfirm: async () => {
        const result = await api("/api/tamper/init", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({})
        });
        toast("基线已初始化：" + result.count + " 个文件");
        await loadTamper();
      }
    });
  }

  async function scanTamper() {
    try {
      const result = await api("/api/tamper/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      });
      toast(
        result.anomalies.length
          ? "扫描完成，发现 " + result.anomalies.length + " 个异常"
          : "扫描完成，未发现异常"
      );
      await loadTamper();
    } catch (err) {
      if (err.message !== "需要访问令牌") toast(err.message, "error");
    }
  }

  function switchTamperView(view) {
    state.tamperView = view;
    document.querySelectorAll("#tamperNav .seg").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.view === view);
    });
    renderTamperView();
  }

  function renderTamperMetrics(data) {
    const anomalies = (data.last_anomalies || []).length;
    $("#tamperMetrics").innerHTML =
      '<div class="metric"><div class="metric-label">' + icon("shield") + "监控文件</div>" +
      '<div class="metric-value">' + (data.baseline_count || 0) + "</div>" +
      '<div class="metric-sub">基线文件数</div></div>' +
      '<div class="metric"><div class="metric-label">' + icon("activity") + "异常文件</div>" +
      '<div class="metric-value">' + anomalies + "</div>" +
      '<div class="metric-sub">最近扫描</div></div>' +
      '<div class="metric"><div class="metric-label">' + icon("clock") + "最近扫描</div>" +
      '<div class="metric-value">' + (data.last_scan ? "已扫描" : "--") + "</div>" +
      '<div class="metric-sub">' + esc(data.last_scan || "尚未扫描") + "</div></div>" +
      '<div class="metric"><div class="metric-label">' + icon("file-text") + "审计事件</div>" +
      '<div class="metric-value">' + (data.events_count || 0) + "</div>" +
      '<div class="metric-sub">累计记录</div></div>';
    renderIcons($("#tamperMetrics"));
  }

  function renderTamperView() {
    const data = state.tamper;
    const view = $("#tamperView");
    if (!data) {
      view.innerHTML = '<div class="analytics-empty">暂无数据</div>';
      return;
    }
    if (!data.paths || !data.paths.length) {
      view.innerHTML =
        '<div class="analytics-empty">请先配置监控路径并初始化基线</div>';
      return;
    }
    if (state.tamperView === "permissions") renderTamperPermissions();
    else if (state.tamperView === "events") renderTamperEvents();
    else renderTamperAnomalies();
  }

  function renderTamperAnomalies() {
    const anomalies = (state.tamper && state.tamper.last_anomalies) || [];
    $("#tamperView").innerHTML =
      '<div class="panel table-panel"><div class="panel-head"><h2>异常文件</h2>' +
      '<span class="muted">' + anomalies.length + " 条</span></div>" +
      '<div class="table-wrap"><table class="data-table"><thead><tr>' +
      "<th>路径</th><th>类型</th><th>详情</th>" +
      "</tr></thead><tbody>" +
      (anomalies.length
        ? anomalies
            .map(
              (item) =>
                "<tr>" +
                '<td class="cmd mono" title="' + esc(item.path) + '">' +
                esc(item.path) +
                "</td>" +
                '<td><span class="state failed">' + esc(item.type) + "</span></td>" +
                "<td>" + esc(item.detail) + "</td></tr>"
            )
            .join("")
        : '<tr><td colspan="3" class="muted">暂无异常</td></tr>') +
      "</tbody></table></div></div>";
  }

  async function renderTamperPermissions() {
    try {
      const data = await api("/api/tamper/permissions");
      state.tamperPermissions = data.risky || [];
    } catch (err) {
      if (err.message !== "需要访问令牌") toast(err.message, "error");
      return;
    }
    const items = state.tamperPermissions;
    $("#tamperView").innerHTML =
      '<div class="panel table-panel"><div class="panel-head"><h2>权限风险</h2>' +
      '<span class="muted">' + items.length + " 个可写文件</span></div>" +
      '<div class="table-wrap"><table class="data-table"><thead><tr>' +
      "<th>路径</th><th>权限</th><th>属主</th><th>风险</th>" +
      "</tr></thead><tbody>" +
      (items.length
        ? items
            .map(
              (item) =>
                "<tr>" +
                '<td class="cmd mono" title="' + esc(item.path) + '">' +
                esc(item.path) +
                "</td>" +
                '<td class="mono">' + esc(item.mode) + "</td>" +
                "<td>" + esc(item.owner + ":" + item.group) + "</td>" +
                '<td><span class="state failed">' + esc(item.risk) + "</span></td></tr>"
            )
            .join("")
        : '<tr><td colspan="4" class="muted">未发现权限风险</td></tr>') +
      "</tbody></table></div></div>";
  }

  async function renderTamperEvents() {
    try {
      const data = await api("/api/tamper/events?lines=200");
      state.tamperEvents = data.events || [];
    } catch (err) {
      if (err.message !== "需要访问令牌") toast(err.message, "error");
      return;
    }
    const items = state.tamperEvents;
    $("#tamperView").innerHTML =
      '<div class="panel table-panel"><div class="panel-head"><h2>审计日志</h2>' +
      '<span class="muted">' + items.length + " 条</span></div>" +
      '<div class="table-wrap"><table class="data-table"><thead><tr>' +
      "<th>时间</th><th>类型</th><th>路径</th><th>详情</th>" +
      "</tr></thead><tbody>" +
      (items.length
        ? items
            .map(
              (item) =>
                "<tr>" +
                '<td class="mono">' + esc(item.time) + "</td>" +
                '<td><span class="state ' +
                (item.type === "篡改" || item.type === "删除"
                  ? "failed"
                  : "active") +
                '">' +
                esc(item.type) +
                "</span></td>" +
                '<td class="cmd mono" title="' + esc(item.path) + '">' +
                esc(item.path) +
                "</td>" +
                "<td>" + esc(item.detail) + "</td></tr>"
            )
            .join("")
        : '<tr><td colspan="4" class="muted">暂无审计记录</td></tr>') +
      "</tbody></table></div></div>";
  }

  async function loadContainer() {
    try {
      const data = await api("/api/container");
      state.containerData = data;
      renderDockerError();
      renderContainerView();
    } catch (err) {
      if (err.message !== "需要访问令牌") toast(err.message, "error");
    }
  }

  function renderDockerError() {
    const errors = (state.containerData && state.containerData.errors) || [];
    $("#dockerError").innerHTML = errors.length
      ? errors
          .map(
            (item) =>
              '<div class="docker-error"><strong>' +
              icon("x") +
              esc(item.section) +
              "</strong><span>" +
              esc(item.message) +
              "</span></div>"
          )
          .join("")
      : "";
    renderIcons($("#dockerError"));
  }

  function switchContainerView(view) {
    state.containerTab = view;
    document.querySelectorAll("#containerNav .seg").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.view === view);
    });
    renderContainerView();
  }

  function renderContainerView() {
    const data = state.containerData;
    if (!data) {
      $("#containerView").innerHTML =
        '<div class="analytics-empty">加载中...</div>';
      return;
    }
    const views = {
      containers: renderContainers,
      images: renderImages,
      networks: renderNetworks,
      volumes: renderVolumes,
      compose: renderCompose,
      stats: renderContainerStats
    };
    (views[state.containerTab] || renderContainers)();
  }

  function containerStateClass(containerState) {
    const value = String(containerState || "").toLowerCase();
    if (value === "running") return "active";
    if (value === "paused") return "activating";
    if (value === "exited" || value === "dead") return "failed";
    return "inactive";
  }

  function renderContainers() {
    const list =
      (state.containerData && state.containerData.containers) || [];
    $("#containerView").innerHTML =
      '<div class="panel table-panel"><div class="panel-head"><h2>容器</h2>' +
      '<span class="muted">' + list.length + " 个</span></div>" +
      '<div class="table-wrap"><table class="data-table"><thead><tr>' +
      "<th>名称</th><th>镜像</th><th>状态</th><th>端口</th><th>CPU</th><th>内存</th><th>创建时间</th><th class=\"col-actions actions-wide\">操作</th>" +
      "</tr></thead><tbody>" +
      (list.length
        ? list
            .map((item) => {
              const running = item.state === "running";
              const paused = item.state === "paused";
              let act =
                '<button class="icon-btn" data-container-logs="' +
                esc(item.id) +
                '" title="查看日志">' +
                icon("file-text") +
                "</button>";
              if (running) {
                act +=
                  '<button class="icon-btn" data-container-console="' +
                  esc(item.id) +
                  '" title="控制台">' +
                  icon("terminal") +
                  "</button>";
                act +=
                  '<button class="icon-btn" data-container-action="stop" data-cid="' +
                  esc(item.id) +
                  '" title="停止">' +
                  icon("square") +
                  '</button><button class="icon-btn" data-container-action="pause" data-cid="' +
                  esc(item.id) +
                  '" title="暂停">' +
                  icon("pause") +
                  '</button><button class="icon-btn" data-container-action="restart" data-cid="' +
                  esc(item.id) +
                  '" title="重启">' +
                  icon("rotate-cw") +
                  "</button>";
              } else if (paused) {
                act +=
                  '<button class="icon-btn" data-container-action="unpause" data-cid="' +
                  esc(item.id) +
                  '" title="恢复">' +
                  icon("play") +
                  '</button><button class="icon-btn" data-container-action="stop" data-cid="' +
                  esc(item.id) +
                  '" title="停止">' +
                  icon("square") +
                  "</button>";
              } else {
                act +=
                  '<button class="icon-btn" data-container-action="start" data-cid="' +
                  esc(item.id) +
                  '" title="启动">' +
                  icon("play") +
                  "</button>";
              }
              act +=
                '<button class="icon-btn danger" data-container-action="remove" data-cid="' +
                esc(item.id) +
                '" title="删除">' +
                icon("trash") +
                "</button>";
              return (
                "<tr>" +
                '<td class="mono" title="' + esc(item.command) + '">' +
                esc(item.name) +
                "</td>" +
                '<td class="cmd mono" title="' + esc(item.image) + '">' +
                esc(item.image) +
                "</td>" +
                '<td><span class="state ' +
                containerStateClass(item.state) +
                '">' +
                esc(item.status || item.state) +
                "</span></td>" +
                '<td class="cmd mono" title="' + esc(item.ports) + '">' +
                esc(item.ports || "--") +
                "</td>" +
                '<td class="mono">' + esc(item.cpu_percent || "--") + "</td>" +
                '<td class="mono">' + esc(item.mem_percent || "--") + "</td>" +
                '<td class="mono">' + esc(item.created || "--") + "</td>" +
                '<td class="col-actions actions-wide"><div class="act">' +
                act +
                "</div></td></tr>"
              );
            })
            .join("")
        : '<tr><td colspan="8" class="muted">没有容器</td></tr>') +
      "</tbody></table></div></div>";
    renderIcons($("#containerView"));
  }

  function statBar(percent) {
    const value = Math.max(0, Math.min(100, parseFloat(percent) || 0));
    return (
      '<div class="stat-bar"><div class="stat-bar-fill" style="width:' +
      value.toFixed(1) +
      '%"></div></div><span class="mono">' +
      esc(percent || "0%") +
      "</span>"
    );
  }

  function renderContainerStats() {
    const list = (
      (state.containerData && state.containerData.containers) || []
    ).filter((item) => item.state === "running");
    let cpuTotal = 0;
    let memTotal = 0;
    let netTotal = 0;
    list.forEach((item) => {
      cpuTotal += parseFloat(item.cpu_percent) || 0;
      memTotal += parseFloat(item.mem_percent) || 0;
      const net = String(item.net_io || "").split("/");
      if (net.length) {
        const first = parseFloat(net[0]) || 0;
        const unit = (net[0] || "").trim().slice(-2).toLowerCase();
        const mult =
          unit === "kb" ? 1 : unit === "mb" ? 1024 : unit === "gb" ? 1024 * 1024 : 1;
        netTotal += first * mult;
      }
    });
    function fmtNet(kb) {
      if (kb >= 1024 * 1024) return (kb / (1024 * 1024)).toFixed(1) + " GB";
      if (kb >= 1024) return (kb / 1024).toFixed(1) + " MB";
      return kb.toFixed(0) + " KB";
    }
    $("#containerView").innerHTML =
      '<div class="metric-grid">' +
      '<div class="metric"><div class="metric-label">' + icon("boxes") + "运行容器</div>" +
      '<div class="metric-value">' + list.length + "</div>" +
      '<div class="metric-sub">全部容器 ' +
      ((state.containerData && state.containerData.containers) || []).length +
      " 个</div></div>" +
      '<div class="metric"><div class="metric-label">' + icon("cpu") + "总 CPU</div>" +
      '<div class="metric-value">' + cpuTotal.toFixed(1) + "%</div>" +
      '<div class="metric-sub">按容器累计</div></div>' +
      '<div class="metric"><div class="metric-label">' + icon("memory-stick") + "总内存</div>" +
      '<div class="metric-value">' + memTotal.toFixed(1) + "%</div>" +
      '<div class="metric-sub">按容器累计</div></div>' +
      '<div class="metric"><div class="metric-label">' + icon("activity") + "网络接收</div>" +
      '<div class="metric-value">' + fmtNet(netTotal) + "</div>" +
      '<div class="metric-sub">docker stats</div></div>' +
      "</div>" +
      '<div class="panel table-panel"><div class="panel-head"><h2>容器资源统计</h2>' +
      '<span class="muted">运行中 ' + list.length + " 个</span></div>" +
      '<div class="table-wrap"><table class="data-table"><thead><tr>' +
      "<th>名称</th><th>状态</th><th>CPU</th><th>内存</th><th>内存用量</th><th>网络 I/O</th><th>磁盘 I/O</th><th>PID</th><th class=\"col-actions\">操作</th>" +
      "</tr></thead><tbody>" +
      (list.length
        ? list.map((item) =>
            "<tr>" +
            '<td class="mono">' + esc(item.name) + "</td>" +
            '<td><span class="state active">running</span></td>' +
            '<td class="mono">' + statBar(item.cpu_percent) + "</td>" +
            '<td class="mono">' + statBar(item.mem_percent) + "</td>" +
            '<td class="mono">' + esc(item.mem_usage || "--") + "</td>" +
            '<td class="mono">' + esc(item.net_io || "--") + "</td>" +
            '<td class="mono">' + esc(item.block_io || "--") + "</td>" +
            '<td class="mono">' + esc(item.pids || "--") + "</td>" +
            '<td class="col-actions"><div class="act">' +
            '<button class="icon-btn" data-container-console="' + esc(item.id) + '" title="控制台">' + icon("terminal") + "</button>" +
            "</div></td></tr>"
          ).join("")
        : '<tr><td colspan="9" class="muted">没有运行中的容器</td></tr>') +
      "</tbody></table></div></div>";
    renderIcons($("#containerView"));
  }

  function renderImages() {
    const list = (state.containerData && state.containerData.images) || [];
    $("#containerView").innerHTML =
      '<div class="panel table-panel"><div class="panel-head"><h2>镜像</h2>' +
      '<span class="muted">' + list.length + " 个</span></div>" +
      '<div class="table-wrap"><table class="data-table"><thead><tr>' +
      "<th>镜像</th><th>标签</th><th>ID</th><th>大小</th><th>创建时间</th><th>容器数</th><th class=\"col-actions actions-wide\">操作</th>" +
      "</tr></thead><tbody>" +
      (list.length
        ? list
            .map(
              (item) =>
                "<tr>" +
                '<td class="mono">' + esc(item.repository || "--") + "</td>" +
                '<td class="mono">' + esc(item.tag || "--") + "</td>" +
                '<td class="mono">' + esc((item.id || "").slice(0, 19)) + "</td>" +
                '<td class="mono">' + esc(item.size || "--") + "</td>" +
                '<td class="mono">' + esc(item.created || "--") + "</td>" +
                '<td class="mono">' + esc(item.containers || "0") + "</td>" +
                '<td class="col-actions actions-wide"><div class="act">' +
                '<button class="icon-btn danger" data-image-remove="' +
                esc(item.id) +
                '" title="删除镜像">' +
                icon("trash") +
                "</button></div></td></tr>"
            )
            .join("")
        : '<tr><td colspan="7" class="muted">没有镜像</td></tr>') +
      "</tbody></table></div></div>";
    renderIcons($("#containerView"));
  }

  function renderNetworks() {
    const list = (state.containerData && state.containerData.networks) || [];
    $("#containerView").innerHTML =
      '<div class="toolbar"><button class="btn sm" data-create-network>' +
      icon("plus") +
      "<span>新建网络</span></button></div>" +
      '<div class="panel table-panel"><div class="panel-head"><h2>网络</h2>' +
      '<span class="muted">' + list.length + " 个</span></div>" +
      '<div class="table-wrap"><table class="data-table"><thead><tr>' +
      "<th>名称</th><th>驱动</th><th>作用域</th><th>内部</th><th>IPv6</th><th>创建时间</th><th class=\"col-actions\">操作</th>" +
      "</tr></thead><tbody>" +
      (list.length
        ? list
            .map(
              (item) =>
                "<tr>" +
                '<td class="mono">' + esc(item.name) + "</td>" +
                '<td class="mono">' + esc(item.driver || "--") + "</td>" +
                '<td class="mono">' + esc(item.scope || "--") + "</td>" +
                '<td class="mono">' + esc(item.internal || "false") + "</td>" +
                '<td class="mono">' + esc(item.ipv6 || "false") + "</td>" +
                '<td class="mono">' + esc(item.created || "--") + "</td>" +
                '<td class="col-actions"><div class="act">' +
                '<button class="icon-btn danger" data-network-remove="' +
                esc(item.name) +
                '" title="删除网络">' +
                icon("trash") +
                "</button></div></td></tr>"
            )
            .join("")
        : '<tr><td colspan="7" class="muted">没有自定义网络</td></tr>') +
      "</tbody></table></div></div>";
    renderIcons($("#containerView"));
  }

  function renderVolumes() {
    const list = (state.containerData && state.containerData.volumes) || [];
    $("#containerView").innerHTML =
      '<div class="toolbar"><button class="btn sm" data-create-volume>' +
      icon("plus") +
      "<span>新建卷</span></button></div>" +
      '<div class="panel table-panel"><div class="panel-head"><h2>存储卷</h2>' +
      '<span class="muted">' + list.length + " 个</span></div>" +
      '<div class="table-wrap"><table class="data-table"><thead><tr>' +
      "<th>名称</th><th>驱动</th><th>作用域</th><th>挂载点</th><th>标签</th><th class=\"col-actions\">操作</th>" +
      "</tr></thead><tbody>" +
      (list.length
        ? list
            .map(
              (item) =>
                "<tr>" +
                '<td class="mono">' + esc(item.name) + "</td>" +
                '<td class="mono">' + esc(item.driver || "--") + "</td>" +
                '<td class="mono">' + esc(item.scope || "--") + "</td>" +
                '<td class="cmd mono" title="' + esc(item.mountpoint) + '">' +
                esc(item.mountpoint || "--") +
                "</td>" +
                '<td class="cmd mono" title="' + esc(item.labels) + '">' +
                esc(item.labels || "--") +
                "</td>" +
                '<td class="col-actions"><div class="act">' +
                '<button class="icon-btn danger" data-volume-remove="' +
                esc(item.name) +
                '" title="删除卷">' +
                icon("trash") +
                "</button></div></td></tr>"
            )
            .join("")
        : '<tr><td colspan="6" class="muted">没有存储卷</td></tr>') +
      "</tbody></table></div></div>";
    renderIcons($("#containerView"));
  }

  function renderCompose() {
    const list = (state.containerData && state.containerData.compose) || [];
    $("#containerView").innerHTML =
      '<div class="panel table-panel"><div class="panel-head"><h2>Compose 项目</h2>' +
      '<span class="muted">' + list.length + " 个</span></div>" +
      '<div class="table-wrap"><table class="data-table"><thead><tr>' +
      "<th>项目</th><th>文件</th><th>容器</th><th class=\"col-actions actions-wide\">操作</th>" +
      "</tr></thead><tbody>" +
      (list.length
        ? list
            .map((item) => {
              const containers = (item.containers || [])
                .map(
                  (c) =>
                    esc(c.name) +
                    " " +
                    '<span class="state ' +
                    containerStateClass(c.state) +
                    '">' +
                    esc(c.state || c.status || "--") +
                    "</span>"
                )
                .join(" ");
              return (
                "<tr>" +
                '<td class="mono">' + esc(item.name) + "</td>" +
                '<td class="mono">' + esc(item.file) + "</td>" +
                "<td>" +
                (item.error
                  ? '<span class="state failed">' + esc(item.error) + "</span>"
                  : containers || '<span class="muted">未启动</span>') +
                "</td>" +
                '<td class="col-actions actions-wide"><div class="act">' +
                '<button class="icon-btn" data-compose-action="up" data-compose-name="' +
                esc(item.name) +
                '" title="启动">' +
                icon("play") +
                '</button><button class="icon-btn" data-compose-action="stop" data-compose-name="' +
                esc(item.name) +
                '" title="停止">' +
                icon("pause") +
                '</button><button class="icon-btn" data-compose-action="down" data-compose-name="' +
                esc(item.name) +
                '" title="下线">' +
                icon("square") +
                '</button><button class="icon-btn" data-compose-edit="' +
                esc(item.name) +
                '" title="编辑">' +
                icon("edit") +
                '</button><button class="icon-btn danger" data-compose-delete="' +
                esc(item.name) +
                '" title="删除项目">' +
                icon("trash") +
                "</button></div></td></tr>"
              );
            })
            .join("")
        : '<tr><td colspan="4" class="muted">还没有 Compose 项目，点上方“新建 Compose”开始</td></tr>') +
      "</tbody></table></div></div>";
    renderIcons($("#containerView"));
  }

  async function containerAction(cid, action) {
    if (action === "remove") {
      showConfirm({
        title: "删除容器",
        message: "确定要强制删除容器 " + cid + " 吗？",
        danger: true,
        confirmText: "删除",
        onConfirm: async () => {
          const result = await api("/api/container/action", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: cid, action })
          });
          toast(result.message || "容器已删除");
          await loadContainer();
        }
      });
      return;
    }
    try {
      const result = await api("/api/container/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: cid, action })
      });
      toast(result.message || "操作成功");
      await loadContainer();
    } catch (err) {
      if (err.message !== "需要访问令牌") toast(err.message, "error");
    }
  }

  function removeDockerResource(path, value, label, field) {
    showConfirm({
      title: "删除" + label,
      message: "确定要删除" + label + " " + value + " 吗？",
      danger: true,
      confirmText: "删除",
      onConfirm: async () => {
        const body = {};
        body[field] = value;
        const result = await api(path, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        toast(result.message || label + "已删除");
        await loadContainer();
      }
    });
  }

  function showContainerLogs(cid) {
    const container =
      ((state.containerData && state.containerData.containers) || []).find(
        (item) => item.id === cid || item.name === cid
      ) || {};
    const mask = document.createElement("div");
    mask.className = "modal-mask";
    mask.innerHTML =
      '<div class="modal modal-lg">' +
      '<h3 class="modal-title">' + icon("file-text") + esc(container.name || cid) + " 日志</h3>" +
      '<pre class="docker-log-view" id="containerLogView">加载中...</pre>' +
      '<div class="modal-actions" style="margin-top:12px">' +
      '<button class="btn sm" id="btnContainerLogRefresh"><i data-icon="refresh"></i><span>刷新</span></button>' +
      '<button class="btn ghost" data-close>关闭</button></div></div>';
    modalRoot.appendChild(mask);
    renderIcons(mask);
    const view = mask.querySelector("#containerLogView");
    const load = async () => {
      view.textContent = "加载中...";
      try {
        const data = await api(
          "/api/container/logs?id=" +
            encodeURIComponent(cid) +
            "&tail=400"
        );
        view.textContent = data.logs
          ? data.logs.join("\n")
          : data.error || "无日志";
      } catch (err) {
        if (err.message !== "需要访问令牌") view.textContent = err.message;
      }
    };
    mask.querySelector("#btnContainerLogRefresh").addEventListener(
      "click",
      load
    );
    mask.querySelector("[data-close]").onclick = () => mask.remove();
    mask.addEventListener("click", (event) => {
      if (event.target === mask) mask.remove();
    });
    load();
  }

  function showCreateContainerModal() {
    const mask = document.createElement("div");
    mask.className = "modal-mask";
    mask.innerHTML =
      '<div class="modal modal-lg">' +
      '<h3 class="modal-title">' + icon("plus") + "新建容器</h3>" +
      '<label class="form-label" for="containerName">容器名称</label>' +
      '<input id="containerName" class="modal-input" spellcheck="false" placeholder="my-app">' +
      '<label class="form-label" for="containerImage">镜像</label>' +
      '<input id="containerImage" class="modal-input" spellcheck="false" placeholder="nginx:latest">' +
      '<label class="form-label" for="containerCommand">启动命令（可选）</label>' +
      '<input id="containerCommand" class="modal-input" spellcheck="false" placeholder="-g daemon off;">' +
      '<div class="form-grid">' +
      '<div><label class="form-label" for="containerNetwork">网络</label>' +
      '<input id="containerNetwork" class="modal-input" spellcheck="false" placeholder="bridge"></div>' +
      '<div><label class="form-label" for="containerRestart">重启策略</label>' +
      '<select id="containerRestart" class="modal-input"><option value="">默认</option><option value="no">no</option><option value="always">always</option><option value="on-failure">on-failure</option><option value="unless-stopped">unless-stopped</option></select></div>' +
      "</div>" +
      '<div class="form-grid">' +
      '<div><label class="form-label" for="containerCpus">CPU 上限（可选）</label>' +
      '<input id="containerCpus" class="modal-input" spellcheck="false" placeholder="1.5"></div>' +
      '<div><label class="form-label" for="containerMemory">内存上限（可选）</label>' +
      '<input id="containerMemory" class="modal-input" spellcheck="false" placeholder="512m"></div>' +
      "</div>" +
      '<label class="form-label" for="containerPorts">端口映射（每行一条）</label>' +
      '<textarea id="containerPorts" class="modal-textarea" spellcheck="false" placeholder="8080:80"></textarea>' +
      '<label class="form-label" for="containerVolumes">存储卷（每行一条）</label>' +
      '<textarea id="containerVolumes" class="modal-textarea" spellcheck="false" placeholder="/data:/data"></textarea>' +
      '<label class="form-label" for="containerEnv">环境变量（每行一条）</label>' +
      '<textarea id="containerEnv" class="modal-textarea" spellcheck="false" placeholder="TZ=Asia/Shanghai"></textarea>' +
      '<div class="modal-actions">' +
      '<button class="btn ghost" data-close>取消</button>' +
      '<button class="btn primary" data-save>创建</button></div></div>';
    modalRoot.appendChild(mask);
    renderIcons(mask);
    const close = () => mask.remove();
    mask.querySelector("[data-close]").onclick = close;
    mask.addEventListener("click", (event) => {
      if (event.target === mask) close();
    });
    mask.querySelector("[data-save]").onclick = async () => {
      const payload = {
        name: mask.querySelector("#containerName").value.trim(),
        image: mask.querySelector("#containerImage").value.trim(),
        command: mask.querySelector("#containerCommand").value.trim(),
        network: mask.querySelector("#containerNetwork").value.trim(),
        restart: mask.querySelector("#containerRestart").value,
        cpus: mask.querySelector("#containerCpus").value.trim(),
        memory: mask.querySelector("#containerMemory").value.trim(),
        ports: mask.querySelector("#containerPorts").value,
        volumes: mask.querySelector("#containerVolumes").value,
        env: mask.querySelector("#containerEnv").value
      };
      if (!payload.name || !payload.image) {
        toast("请填写容器名称和镜像", "error");
        return;
      }
      try {
        const result = await api("/api/container/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        toast(result.message || "容器已创建");
        close();
        await loadContainer();
      } catch (err) {
        if (err.message !== "需要访问令牌") toast(err.message, "error");
      }
    };
    setTimeout(() => mask.querySelector("#containerName").focus(), 50);
  }

  function showPullImageModal() {
    const mask = document.createElement("div");
    mask.className = "modal-mask";
    mask.innerHTML =
      '<div class="modal">' +
      '<h3 class="modal-title">' + icon("download") + "拉取镜像</h3>" +
      '<label class="form-label" for="pullImageInput">镜像</label>' +
      '<input id="pullImageInput" class="modal-input" spellcheck="false" placeholder="nginx:latest">' +
      '<div class="modal-actions">' +
      '<button class="btn ghost" data-close>取消</button>' +
      '<button class="btn primary" data-save>拉取</button></div></div>';
    modalRoot.appendChild(mask);
    renderIcons(mask);
    const close = () => mask.remove();
    mask.querySelector("[data-close]").onclick = close;
    mask.addEventListener("click", (event) => {
      if (event.target === mask) close();
    });
    mask.querySelector("[data-save]").onclick = async () => {
      const image = mask.querySelector("#pullImageInput").value.trim();
      if (!image) {
        toast("请输入镜像", "error");
        return;
      }
      try {
        const result = await api("/api/container/images/pull", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image })
        });
        toast(result.message || "镜像已拉取");
        close();
        await loadContainer();
      } catch (err) {
        if (err.message !== "需要访问令牌") toast(err.message, "error");
      }
    };
    setTimeout(() => mask.querySelector("#pullImageInput").focus(), 50);
  }

  function showCreateNetworkModal() {
    const mask = document.createElement("div");
    mask.className = "modal-mask";
    mask.innerHTML =
      '<div class="modal">' +
      '<h3 class="modal-title">' + icon("link") + "新建网络</h3>" +
      '<label class="form-label" for="networkName">网络名称</label>' +
      '<input id="networkName" class="modal-input" spellcheck="false" placeholder="my-net">' +
      '<label class="form-label" for="networkDriver">驱动</label>' +
      '<select id="networkDriver" class="modal-input"><option value="">默认</option><option value="bridge">bridge</option><option value="host">host</option><option value="none">none</option><option value="overlay">overlay</option></select>' +
      '<div class="modal-actions">' +
      '<button class="btn ghost" data-close>取消</button>' +
      '<button class="btn primary" data-save>创建</button></div></div>';
    modalRoot.appendChild(mask);
    renderIcons(mask);
    const close = () => mask.remove();
    mask.querySelector("[data-close]").onclick = close;
    mask.addEventListener("click", (event) => {
      if (event.target === mask) close();
    });
    mask.querySelector("[data-save]").onclick = async () => {
      const name = mask.querySelector("#networkName").value.trim();
      if (!name) {
        toast("请输入网络名称", "error");
        return;
      }
      try {
        const result = await api("/api/container/networks/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, driver: mask.querySelector("#networkDriver").value })
        });
        toast(result.message || "网络已创建");
        close();
        await loadContainer();
      } catch (err) {
        if (err.message !== "需要访问令牌") toast(err.message, "error");
      }
    };
    setTimeout(() => mask.querySelector("#networkName").focus(), 50);
  }

  function showCreateVolumeModal() {
    const mask = document.createElement("div");
    mask.className = "modal-mask";
    mask.innerHTML =
      '<div class="modal">' +
      '<h3 class="modal-title">' + icon("hard-drive") + "新建卷</h3>" +
      '<label class="form-label" for="volumeName">卷名称</label>' +
      '<input id="volumeName" class="modal-input" spellcheck="false" placeholder="my-data">' +
      '<label class="form-label" for="volumeDriver">驱动</label>' +
      '<input id="volumeDriver" class="modal-input" spellcheck="false" placeholder="local">' +
      '<div class="modal-actions">' +
      '<button class="btn ghost" data-close>取消</button>' +
      '<button class="btn primary" data-save>创建</button></div></div>';
    modalRoot.appendChild(mask);
    renderIcons(mask);
    const close = () => mask.remove();
    mask.querySelector("[data-close]").onclick = close;
    mask.addEventListener("click", (event) => {
      if (event.target === mask) close();
    });
    mask.querySelector("[data-save]").onclick = async () => {
      const name = mask.querySelector("#volumeName").value.trim();
      if (!name) {
        toast("请输入卷名称", "error");
        return;
      }
      try {
        const result = await api("/api/container/volumes/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            driver: mask.querySelector("#volumeDriver").value.trim()
          })
        });
        toast(result.message || "卷已创建");
        close();
        await loadContainer();
      } catch (err) {
        if (err.message !== "需要访问令牌") toast(err.message, "error");
      }
    };
    setTimeout(() => mask.querySelector("#volumeName").focus(), 50);
  }

  function showComposeModal(name) {
    const mask = document.createElement("div");
    const editing = Boolean(name);
    mask.className = "modal-mask";
    mask.innerHTML =
      '<div class="modal modal-lg">' +
      '<h3 class="modal-title">' + icon("boxes") + (editing ? "编辑 Compose" : "新建 Compose") + "</h3>" +
      '<label class="form-label" for="composeName">项目名称</label>' +
      '<input id="composeName" class="modal-input" spellcheck="false" placeholder="my-stack"' +
      (editing ? " disabled" : "") +
      ">" +
      '<label class="form-label" for="composeContent">Compose 配置</label>' +
      '<textarea id="composeContent" class="modal-textarea compose-textarea" spellcheck="false" placeholder="services:\n  web:\n    image: nginx:latest\n    ports:\n      - \"8080:80\""></textarea>' +
      '<div class="modal-actions">' +
      '<button class="btn ghost" data-close>取消</button>' +
      '<button class="btn primary" data-save>保存</button></div></div>';
    modalRoot.appendChild(mask);
    renderIcons(mask);
    const close = () => mask.remove();
    mask.querySelector("[data-close]").onclick = close;
    mask.addEventListener("click", (event) => {
      if (event.target === mask) close();
    });
    const nameInput = mask.querySelector("#composeName");
    const contentInput = mask.querySelector("#composeContent");
    if (editing) {
      nameInput.value = name;
      contentInput.value = "加载中...";
      api("/api/container/compose?name=" + encodeURIComponent(name))
        .then((data) => {
          contentInput.value = data.content || "";
        })
        .catch((err) => {
          if (err.message !== "需要访问令牌")
            contentInput.value = "加载失败：" + err.message;
        });
    }
    mask.querySelector("[data-save]").onclick = async () => {
      const project = nameInput.value.trim();
      const content = contentInput.value;
      if (!project || !content.trim()) {
        toast("请填写项目名称和配置", "error");
        return;
      }
      try {
        const result = await api("/api/container/compose/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: project, content })
        });
        toast(result.message || "Compose 已保存");
        close();
        await loadContainer();
      } catch (err) {
        if (err.message !== "需要访问令牌") toast(err.message, "error");
      }
    };
    if (!editing) setTimeout(() => nameInput.focus(), 50);
  }

  function composeAction(name, action) {
    const run = async () => {
      try {
        const result = await api("/api/container/compose/" + action, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name })
        });
        toast(result.message || "操作成功");
        await loadContainer();
      } catch (err) {
        if (err.message !== "需要访问令牌") toast(err.message, "error");
      }
    };
    if (action === "down" || action === "delete") {
      showConfirm({
        title: action === "down" ? "下线 Compose" : "删除 Compose 项目",
        message:
          action === "down"
            ? "确定要下线 " + name + " 的所有容器吗？"
            : "确定要删除 " + name + " 项目吗？文件会移入回收站。",
        danger: true,
        confirmText: action === "down" ? "下线" : "删除",
        onConfirm: run
      });
      return;
    }
    run();
  }

  async function loadFirewall() {
    try {
      const data = await api("/api/firewall");
      state.firewall = data;
      renderFirewall();
    } catch (err) {
      if (err.message !== "需要访问令牌") toast(err.message, "error");
    }
  }

  function firewallActionClass(action) {
    const value = String(action || "").toUpperCase();
    if (value === "ALLOW") return "active";
    if (value === "LIMIT") return "activating";
    return "failed";
  }

  function renderFirewall() {
    const data = state.firewall;
    if (!data) return;
    const errors = [];
    if (!data.ok) errors.push({ section: "防火墙", message: data.error || "状态未知" });
    (data.errors || []).forEach((message) => {
      errors.push({ section: "UFW", message });
    });
    $("#firewallError").innerHTML = errors.length
      ? errors
          .map(
            (item) =>
              '<div class="docker-error"><strong>' +
              icon("x") +
              esc(item.section) +
              "</strong><span>" +
              esc(item.message) +
              "</span></div>"
          )
          .join("")
      : "";
    renderIcons($("#firewallError"));

    const active = Boolean(data.active);
    $("#firewallToggleText").textContent = active
      ? "停用防火墙"
      : "启用防火墙";
    $("#firewallMetrics").innerHTML =
      '<div class="metric"><div class="metric-label">' +
      icon("flame") +
      "防火墙状态</div>" +
      '<div class="metric-value">' +
      (active ? "已启用" : "未启用") +
      "</div>" +
      '<div class="metric-sub">' +
      esc(data.logging || "日志未开启") +
      "</div></div>" +
      '<div class="metric"><div class="metric-label">' +
      icon("shield") +
      "默认入站</div>" +
      '<div class="metric-value">' +
      esc(data.default_in || "--") +
      "</div>" +
      '<div class="metric-sub">incoming</div></div>' +
      '<div class="metric"><div class="metric-label">' +
      icon("activity") +
      "默认出站</div>" +
      '<div class="metric-value">' +
      esc(data.default_out || "--") +
      "</div>" +
      '<div class="metric-sub">outgoing</div></div>' +
      '<div class="metric"><div class="metric-label">' +
      icon("file-text") +
      "规则数</div>" +
      '<div class="metric-value">' +
      (data.rules || []).length +
      "</div>" +
      '<div class="metric-sub">应用配置 ' +
      (data.apps || []).length +
      " 个</div></div>";
    renderIcons($("#firewallMetrics"));

    const rules = data.rules || [];
    $("#firewallRuleCount").textContent = rules.length + " 条";
    $("#firewallBody").innerHTML = rules.length
      ? rules
          .map(
            (item) =>
              "<tr>" +
              '<td class="mono">' + item.number + "</td>" +
              '<td class="cmd mono" title="' + esc(item.rule) + '">' +
              esc(item.rule) +
              "</td>" +
              '<td><span class="state ' +
              firewallActionClass(item.action) +
              '">' +
              esc(item.action) +
              "</span></td>" +
              "<td>" + esc(item.direction) + "</td>" +
              '<td class="cmd mono" title="' + esc(item.from) + '">' +
              esc(item.from) +
              "</td>" +
              '<td class="col-actions"><div class="act">' +
              '<button class="icon-btn danger" data-firewall-delete="' +
              item.number +
              '" title="删除规则">' +
              icon("trash") +
              "</button></div></td></tr>"
          )
          .join("")
      : '<tr><td colspan="6" class="muted">暂无防火墙规则</td></tr>';
    renderIcons($("#firewallBody"));

    const apps = data.apps || [];
    $("#firewallAppCount").textContent = apps.length + " 个";
    $("#firewallApps").innerHTML = apps.length
      ? apps
          .map((app) => '<span class="chip">' + esc(app) + "</span>")
          .join("")
      : '<span class="muted">暂无应用配置</span>';
  }

  function switchFirewallView(view) {
    state.firewallTab = view;
    document.querySelectorAll("#firewallNav .seg").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.view === view);
    });
    $("#firewallUfwView").style.display = view === "ufw" ? "" : "none";
    $("#firewallFail2banView").style.display =
      view === "fail2ban" ? "block" : "none";
    if (view === "fail2ban" && !state.fail2ban) loadFail2ban();
  }

  async function loadFail2ban() {
    try {
      const data = await api("/api/fail2ban");
      state.fail2ban = data;
      renderFail2ban();
    } catch (err) {
      if (err.message !== "需要访问令牌") toast(err.message, "error");
    }
  }

  function renderFail2ban() {
    const data = state.fail2ban;
    if (!data) return;
    const installed = Boolean(data.installed);
    $("#btnF2bInstall").style.display = installed ? "none" : "";
    const active = data.service === "active";
    $("#btnF2bStart").style.display = active ? "none" : "";
    $("#btnF2bStop").style.display = active ? "" : "none";
    $("#btnF2bRestart").style.display = active ? "" : "none";
    $("#btnF2bReload").style.display = active ? "" : "none";
    $("#f2bError").innerHTML =
      data.ok === false && data.error
        ? '<div class="docker-error"><strong>' +
          icon("x") +
          "Fail2ban</strong><span>" +
          esc(data.error) +
          "</span></div>"
        : "";
    renderIcons($("#f2bError"));
    const jails = data.jails || [];
    let currentBanned = 0;
    let totalBanned = 0;
    jails.forEach((jail) => {
      currentBanned += jail.banned.length;
      totalBanned += jail.total_banned || 0;
    });
    const serviceLabel =
      data.service === "active"
        ? "运行中"
        : data.service === "inactive"
        ? "未运行"
        : "未安装";
    $("#f2bMetrics").innerHTML =
      '<div class="metric"><div class="metric-label">' + icon("shield") + "服务状态</div>" +
      '<div class="metric-value">' + esc(serviceLabel) + "</div>" +
      '<div class="metric-sub">fail2ban-client</div></div>' +
      '<div class="metric"><div class="metric-label">' + icon("boxes") + "规则数</div>" +
      '<div class="metric-value">' + jails.length + "</div>" +
      '<div class="metric-sub">启用中的 jail</div></div>' +
      '<div class="metric"><div class="metric-label">' + icon("users") + "当前封禁 IP</div>" +
      '<div class="metric-value">' + currentBanned + "</div>" +
      '<div class="metric-sub">等待解封</div></div>' +
      '<div class="metric"><div class="metric-label">' + icon("flame") + "累计封禁</div>" +
      '<div class="metric-value">' + totalBanned + "</div>" +
      '<div class="metric-sub">历史次数</div></div>';
    renderIcons($("#f2bMetrics"));
    $("#f2bJailCount").textContent = jails.length + " 个规则";
    $("#f2bBody").innerHTML = jails.length
      ? jails
          .map((jail) => {
            const ips = (jail.banned || []).length
              ? jail.banned
                  .map(
                    (ip) =>
                      '<span class="chip">' +
                      esc(ip) +
                      '<button class="chip-btn" data-f2b-unban="' +
                      esc(ip) +
                      '" data-jail="' +
                      esc(jail.name) +
                      '" title="解封">' +
                      icon("x") +
                      "</button></span>"
                  )
                  .join("")
              : '<span class="muted">无</span>';
            return (
              "<tr>" +
              '<td class="mono">' + esc(jail.name) + "</td>" +
              '<td class="mono">' + jail.currently_failed + "</td>" +
              '<td class="mono">' + jail.total_failed + "</td>" +
              '<td class="mono">' + jail.currently_banned + "</td>" +
              '<td class="mono">' + jail.total_banned + "</td>" +
              '<td class="cmd mono">' + ips + "</td></tr>"
            );
          })
          .join("")
      : '<tr><td colspan="6" class="muted">暂无 Fail2ban 规则</td></tr>';
    renderIcons($("#f2bBody"));
  }

  async function fail2banAction(action) {
    const labels = {
      start: "启动",
      stop: "停止",
      restart: "重启",
      reload: "重载规则"
    };
    const password = await requestLocalPassword(
      "Fail2ban " + (labels[action] || action) + " 需要服务器本机密码"
    );
    if (password == null) return;
    try {
      const result = await api("/api/fail2ban/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, password })
      });
      toast(result.message || "操作完成");
      await loadFail2ban();
    } catch (err) {
      if (err.message !== "需要访问令牌") toast(err.message, "error");
    }
  }

  async function fail2banUnban(ip, jail) {
    const label = jail ? jail + " / " + ip : ip;
    const password = await requestLocalPassword(
      "解封 " + label + " 需要服务器本机密码"
    );
    if (password == null) return;
    try {
      const result = await api("/api/fail2ban/unban", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ip, jail, password })
      });
      toast(result.message || "解封完成");
      await loadFail2ban();
    } catch (err) {
      if (err.message !== "需要访问令牌") toast(err.message, "error");
    }
  }

  async function installFail2ban() {
    const password = await requestLocalPassword(
      "安装 Fail2ban 需要服务器本机密码"
    );
    if (password == null) return;
    try {
      const result = await api("/api/apps/install", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: "fail2ban", password })
      });
      toast(result.message || "安装完成");
      await loadFail2ban();
    } catch (err) {
      if (err.message !== "需要访问令牌") toast(err.message, "error");
    }
  }

  function toggleFirewall() {
    const data = state.firewall;
    if (!data || !data.ok) {
      toast("防火墙状态不可用", "error");
      return;
    }
    const enabled = !data.active;
    const sshAllowed = (data.rules || []).some(
      (item) =>
        String(item.rule || "").includes("22/tcp") ||
        String(item.rule || "").includes("port 22")
    );
    showConfirm({
      title: enabled ? "启用防火墙" : "停用防火墙",
      message: enabled
        ? (sshAllowed
            ? "启用后未放行的端口会被拒绝访问，SSH(22) 已放行。"
            : "当前规则未放行 SSH(22)，启用后可能断开当前连接，确定继续？")
        : "确定要停用防火墙吗？",
      danger: enabled,
      confirmText: enabled ? "启用" : "停用",
      onConfirm: async () => {
        const result = await api("/api/firewall/toggle", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ enabled })
        });
        toast(result.message || (enabled ? "防火墙已启用" : "防火墙已停用"));
        await loadFirewall();
      }
    });
  }

  function showAddRuleModal() {
    const mask = document.createElement("div");
    mask.className = "modal-mask";
    mask.innerHTML =
      '<div class="modal">' +
      '<h3 class="modal-title">' + icon("plus") + "添加防火墙规则</h3>" +
      '<div class="form-grid">' +
      "<div>" +
      '<label class="form-label" for="firewallAction">动作</label>' +
      '<select id="firewallAction" class="modal-input">' +
      '<option value="allow">允许</option><option value="deny">拒绝</option><option value="limit">限速</option>' +
      "</select></div>" +
      "<div>" +
      '<label class="form-label" for="firewallProtocol">协议</label>' +
      '<select id="firewallProtocol" class="modal-input">' +
      '<option value="tcp">TCP</option><option value="udp">UDP</option><option value="any">TCP+UDP</option>' +
      "</select></div></div>" +
      '<label class="form-label" for="firewallPort">端口或范围</label>' +
      '<input id="firewallPort" class="modal-input" spellcheck="false" placeholder="例如 8080 或 8000:9000">' +
      '<label class="form-label" for="firewallSource">来源 IP/CIDR（可选）</label>' +
      '<input id="firewallSource" class="modal-input" spellcheck="false" placeholder="例如 192.168.1.0/24">' +
      '<div class="modal-actions">' +
      '<button class="btn ghost" data-close>取消</button>' +
      '<button class="btn primary" data-save>添加</button></div></div>';
    modalRoot.appendChild(mask);
    renderIcons(mask);
    const close = () => mask.remove();
    mask.querySelector("[data-close]").onclick = close;
    mask.addEventListener("click", (event) => {
      if (event.target === mask) close();
    });
    mask.querySelector("[data-save]").onclick = async () => {
      const payload = {
        action: mask.querySelector("#firewallAction").value,
        protocol: mask.querySelector("#firewallProtocol").value,
        port: mask.querySelector("#firewallPort").value.trim(),
        source: mask.querySelector("#firewallSource").value.trim()
      };
      if (!payload.port) {
        toast("请输入端口", "error");
        return;
      }
      try {
        const result = await api("/api/firewall/rule", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        toast(result.message || "规则已添加");
        close();
        await loadFirewall();
      } catch (err) {
        if (err.message !== "需要访问令牌") toast(err.message, "error");
      }
    };
    setTimeout(() => mask.querySelector("#firewallPort").focus(), 50);
  }

  function firewallDeleteRule(number) {
    showConfirm({
      title: "删除防火墙规则",
      message: "确定要删除第 " + number + " 条防火墙规则吗？",
      danger: true,
      confirmText: "删除",
      onConfirm: async () => {
        const result = await api("/api/firewall/rule/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ number })
        });
        toast(result.message || "规则已删除");
        await loadFirewall();
      }
    });
  }

  async function loadModels() {
    try {
      const data = await api("/api/models");
      state.modelsData = data;
      renderModels();
    } catch (err) {
      if (err.message !== "需要访问令牌") toast(err.message, "error");
    }
  }

  function switchModelsView(view) {
    state.modelsTab = view;
    document.querySelectorAll("#modelsNav .seg").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.view === view);
    });
    renderModelsView();
  }

  function renderModels() {
    renderModelsError();
    renderModelJobs();
    renderModelsMetrics();
    renderGpuChart();
    renderModelsView();
    scheduleModelJobPoll();
  }

  function renderModelsError() {
    const data = state.modelsData;
    const errors = [];
    if (data && !data.ollama_installed) {
      errors.push({
        section: "Ollama",
        message: data.error || "Ollama 未安装，请点击上方“安装 Ollama”"
      });
    } else if (data && data.error) {
      errors.push({ section: "Ollama", message: data.error });
    }
    $("#modelsError").innerHTML = errors.length
      ? errors
          .map(
            (item) =>
              '<div class="docker-error"><strong>' +
              icon("x") +
              esc(item.section) +
              "</strong><span>" +
              esc(item.message) +
              "</span></div>"
          )
          .join("")
      : "";
    renderIcons($("#modelsError"));
  }

  function renderModelJobs() {
    const jobs =
      (state.modelsData && state.modelsData.jobs) || [];
    const wrap = $("#modelJobs");
    if (!jobs.length) {
      wrap.innerHTML = "";
      return;
    }
    wrap.innerHTML = jobs
      .map(
        (job) =>
          '<div class="docker-error model-job"><strong>' +
          icon(job.kind === "install" ? "download" : "package") +
          esc(job.kind === "install" ? "安装" : "拉取") +
          " " +
          esc(job.model) +
          "</strong><span>" +
          esc(job.message) +
          "</span></div>"
      )
      .join("");
    renderIcons(wrap);
  }

  function scheduleModelJobPoll() {
    const jobs =
      (state.modelsData && state.modelsData.jobs) || [];
    const running = jobs.some((job) => job.status === "running");
    if (running) {
      if (!state.modelJobsTimer) {
        state.modelJobsTimer = setTimeout(pollModelJobs, 2000);
      }
    } else if (state.modelJobsTimer) {
      clearTimeout(state.modelJobsTimer);
      state.modelJobsTimer = null;
    }
  }

  async function pollModelJobs() {
    state.modelJobsTimer = null;
    try {
      const data = await api("/api/models/jobs");
      if (state.modelsData) {
        state.modelsData.jobs = data.jobs || [];
        renderModelJobs();
      }
      const stillRunning = (data.jobs || []).some(
        (job) => job.status === "running"
      );
      scheduleModelJobPoll();
      if (!stillRunning) await loadModels();
    } catch (err) {
      if (err.message !== "需要访问令牌") toast(err.message, "error");
    }
  }

  function renderModelsMetrics() {
    const data = state.modelsData;
    if (!data) return;
    const installed = Boolean(data.ollama_installed);
    const running = Boolean(data.ollama_running);
    const gpu = data.gpu || null;
    const models = data.models || [];
    $("#modelsMetrics").innerHTML =
      '<div class="metric"><div class="metric-label">' +
      icon("cpu") +
      "Ollama</div>" +
      '<div class="metric-value">' +
      (installed ? (running ? "已运行" : "未启动") : "未安装") +
      "</div>" +
      '<div class="metric-sub">' +
      esc(data.version || "--") +
      "</div></div>" +
      '<div class="metric"><div class="metric-label">' +
      icon("package") +
      "本地模型</div>" +
      '<div class="metric-value">' +
      models.length +
      "</div>" +
      '<div class="metric-sub">' +
      esc(data.models_dir || "--") +
      "</div></div>" +
      '<div class="metric"><div class="metric-label">' +
      icon("activity") +
      "GPU</div>" +
      '<div class="metric-value">' +
      (gpu ? Math.round(gpu.utilization) + "%" : "--") +
      "</div>" +
      '<div class="metric-sub">' +
      esc(gpu ? gpu.name : "未检测到 NVIDIA GPU") +
      "</div></div>" +
      '<div class="metric"><div class="metric-label">' +
      icon("memory-stick") +
      "显存</div>" +
      '<div class="metric-value">' +
      (gpu
        ? formatBytes(gpu.memory_used * 1024 * 1024)
        : "--") +
      "</div>" +
      '<div class="metric-sub">' +
      (gpu
        ? esc(
            "总 " +
              formatBytes(gpu.memory_total * 1024 * 1024) +
              " · " +
              Math.round(gpu.temperature) +
              "°C · " +
              gpu.power +
              "W"
          )
        : "暂无监控数据") +
      "</div></div>";
    renderIcons($("#modelsMetrics"));
  }

  function renderGpuChart() {
    const data = state.modelsData;
    const history = (data && data.gpu_history) || [];
    const summary = $("#gpuSummary");
    const chart = $("#gpuChart");
    const info = $("#gpuInfo");
    if (!history.length) {
      summary.textContent = "未检测到 NVIDIA GPU";
      chart.innerHTML =
        '<div class="analytics-empty">未检测到 NVIDIA GPU，暂无监控数据</div>';
      info.innerHTML = "";
      return;
    }
    const latest = history[history.length - 1];
    const gpu = data && data.gpu;
    summary.textContent =
      "GPU " +
      (gpu ? gpu.name : "") +
      " · " +
      Math.round(latest.temperature) +
      "°C · " +
      latest.power +
      "W";
    if (history.length < 2) {
      chart.innerHTML =
        '<div class="analytics-empty">正在采样 GPU 数据...</div>';
    } else {
      const width = 640;
      const height = 150;
      const pad = 10;
      const points = (key) =>
        history
          .map((item, index) => {
            const x = pad + (index / (history.length - 1)) * (width - pad * 2);
            const y =
              pad +
              (1 - Math.min(100, Number(item[key]) || 0) / 100) *
                (height - pad * 2);
            return x.toFixed(1) + "," + y.toFixed(1);
          })
          .join(" ");
      chart.innerHTML =
        '<svg class="line-chart" viewBox="0 0 ' +
        width +
        " " +
        height +
        '" preserveAspectRatio="none">' +
        '<line class="chart-grid" x1="' +
        pad +
        '" y1="' +
        (pad + 0.25 * (height - pad * 2)) +
        '" x2="' +
        (width - pad) +
        '" y2="' +
        (pad + 0.25 * (height - pad * 2)) +
        '"/><line class="chart-grid" x1="' +
        pad +
        '" y1="' +
        (pad + 0.5 * (height - pad * 2)) +
        '" x2="' +
        (width - pad) +
        '" y2="' +
        (pad + 0.5 * (height - pad * 2)) +
        '"/><line class="chart-grid" x1="' +
        pad +
        '" y1="' +
        (pad + 0.75 * (height - pad * 2)) +
        '" x2="' +
        (width - pad) +
        '" y2="' +
        (pad + 0.75 * (height - pad * 2)) +
        '"/><polyline class="chart-line rx" points="' +
        points("utilization") +
        '"/><polyline class="chart-line tx" points="' +
        points("memory_used") +
        '"/></svg><div class="chart-legend"><span><i class="legend-dot rx"></i>GPU 使用率 %</span><span><i class="legend-dot tx"></i>显存占用 MiB</span></div>';
    }
    const memPercent =
      latest.memory_total > 0
        ? Math.round((latest.memory_used / latest.memory_total) * 100)
        : 0;
    info.innerHTML =
      '<div class="toolbox-rows">' +
      '<div class="toolbox-row"><span class="label">GPU 使用率</span><span class="value mono">' +
      Math.round(latest.utilization) +
      "%</span></div>" +
      '<div class="toolbox-row"><span class="label">显存</span><span class="value mono">' +
      formatBytes(latest.memory_used * 1024 * 1024) +
      " / " +
      formatBytes(latest.memory_total * 1024 * 1024) +
      " (" +
      memPercent +
      "%)</span></div>" +
      '<div class="toolbox-row"><span class="label">温度</span><span class="value mono">' +
      Math.round(latest.temperature) +
      "°C</span></div>" +
      '<div class="toolbox-row"><span class="label">功耗</span><span class="value mono">' +
      latest.power +
      "W</span></div></div>";
  }

  function renderModelsView() {
    const data = state.modelsData;
    if (!data) {
      $("#modelsView").innerHTML =
        '<div class="analytics-empty">加载中...</div>';
      return;
    }
    const views = {
      local: renderModelsLocal,
      running: renderModelsRunning,
      catalog: renderModelsCatalog
    };
    (views[state.modelsTab] || renderModelsLocal)();
  }

  function renderModelsLocal() {
    const data = state.modelsData;
    const models = (data && data.models) || [];
    if (data && !data.ollama_installed) {
      $("#modelsView").innerHTML =
        '<div class="analytics-empty">Ollama 未安装，请先点击上方“安装 Ollama”。</div>';
      return;
    }
    $("#modelsView").innerHTML =
      '<div class="panel table-panel"><div class="panel-head"><h2>本地模型</h2>' +
      '<span class="muted">' + models.length + " 个</span></div>" +
      '<div class="table-wrap"><table class="data-table"><thead><tr>' +
      "<th>模型</th><th>ID</th><th>大小</th><th>修改时间</th><th class=\"col-actions actions-wide\">操作</th>" +
      "</tr></thead><tbody>" +
      (models.length
        ? models
            .map(
              (item) =>
                "<tr>" +
                '<td class="mono">' + esc(item.name) + "</td>" +
                '<td class="mono">' + esc(item.id) + "</td>" +
                '<td class="mono">' + esc(item.size) + "</td>" +
                '<td class="mono">' + esc(item.modified) + "</td>" +
                '<td class="col-actions actions-wide"><div class="act">' +
                '<button class="icon-btn" data-model-test="' +
                esc(item.name) +
                '" title="对话测试">' +
                icon("terminal") +
                '</button><button class="icon-btn danger" data-model-remove="' +
                esc(item.name) +
                '" title="删除模型">' +
                icon("trash") +
                "</button></div></td></tr>"
            )
            .join("")
        : '<tr><td colspan="5" class="muted">还没有本地模型，去“模型库”一键拉取</td></tr>') +
      "</tbody></table></div></div>";
    renderIcons($("#modelsView"));
  }

  function renderModelsRunning() {
    const running =
      (state.modelsData && state.modelsData.running) || [];
    $("#modelsView").innerHTML =
      '<div class="panel table-panel"><div class="panel-head"><h2>运行中模型</h2>' +
      '<span class="muted">' + running.length + " 个</span></div>" +
      '<div class="table-wrap"><table class="data-table"><thead><tr>' +
      "<th>模型</th><th>ID</th><th>内存</th><th>处理器</th><th>剩余时间</th>" +
      "</tr></thead><tbody>" +
      (running.length
        ? running
            .map(
              (item) =>
                "<tr>" +
                '<td class="mono">' + esc(item.name) + "</td>" +
                '<td class="mono">' + esc(item.id) + "</td>" +
                '<td class="mono">' + esc(item.size) + "</td>" +
                '<td class="mono">' + esc(item.processor) + "</td>" +
                '<td class="mono">' + esc(item.until) + "</td></tr>"
            )
            .join("")
        : '<tr><td colspan="5" class="muted">当前没有模型在运行</td></tr>') +
      "</tbody></table></div></div>";
  }

  function renderModelsCatalog() {
    const catalog =
      (state.modelsData && state.modelsData.catalog) || [];
    $("#modelsView").innerHTML =
      '<div class="toolbar">' +
      '<div class="search"><i data-icon="search"></i>' +
      '<input id="modelCatalogSearch" type="search" placeholder="搜索模型名/分类/说明/指令" spellcheck="false">' +
      "</div></div>" +
      '<div class="panel table-panel"><div class="panel-head"><h2>Ollama 模型库</h2>' +
      '<span class="muted" id="modelCatalogCount">' +
      catalog.length +
      " 个</span></div>" +
      '<div class="table-wrap"><table class="data-table"><thead><tr>' +
      "<th>模型</th><th>分类</th><th>大小</th><th>内存</th><th>说明</th><th>拉取指令</th><th class=\"col-actions\">操作</th>" +
      "</tr></thead><tbody id=\"modelCatalogBody\"></tbody></table></div></div>";
    renderIcons($("#modelsView"));
    renderModelsCatalogTable();
  }

  function renderModelsCatalogTable() {
    const catalog =
      (state.modelsData && state.modelsData.catalog) || [];
    const query = $("#modelCatalogSearch")
      ? $("#modelCatalogSearch").value.trim().toLowerCase()
      : "";
    const list = query
      ? catalog.filter((item) =>
          [item.name, item.model, item.category, item.desc, item.command].some(
            (value) =>
              String(value || "")
                .toLowerCase()
                .includes(query)
          )
        )
      : catalog;
    const count = $("#modelCatalogCount");
    if (count) {
      count.textContent =
        "共 " + catalog.length + " 个，显示 " + list.length + " 个";
    }
    $("#modelCatalogBody").innerHTML = list.length
      ? list
          .map(
            (item) =>
              "<tr>" +
              '<td class="mono">' + esc(item.name) + "</td>" +
              '<td><span class="state app">' + esc(item.category) + "</span></td>" +
              '<td class="mono">' + esc(item.size) + "</td>" +
              '<td class="mono">' + esc(item.memory) + "</td>" +
              '<td class="cmd mono" title="' + esc(item.desc) + '">' +
              esc(item.desc) +
              "</td>" +
              '<td class="cmd mono" title="' + esc(item.command) + '">' +
              esc(item.command) +
              "</td>" +
              '<td class="col-actions"><div class="act">' +
              '<button class="icon-btn" data-catalog-pull="' +
              esc(item.model) +
              '" title="一键拉取">' +
              icon("download") +
              "</button></div></td></tr>"
          )
          .join("")
      : '<tr><td colspan="7" class="muted">没有匹配的模型</td></tr>';
    renderIcons($("#modelCatalogBody"));
  }

  async function pullModel(model) {
    try {
      const result = await api("/api/models/pull", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model })
      });
      toast(result.job ? "已开始拉取 " + model : result.error || "拉取失败");
      await loadModels();
    } catch (err) {
      if (err.message !== "需要访问令牌") toast(err.message, "error");
    }
  }

  function installOllama() {
    showConfirm({
      title: "一键安装 Ollama",
      message:
        "将执行官方安装脚本 curl -fsSL https://ollama.com/install.sh | sh，确定继续吗？",
      confirmText: "安装",
      onConfirm: async () => {
        await api("/api/models/install", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({})
        });
        toast("已开始安装 Ollama");
        await loadModels();
      }
    });
  }

  function removeModel(model) {
    showConfirm({
      title: "删除模型",
      message: "确定要删除本地模型 " + model + " 吗？",
      danger: true,
      confirmText: "删除",
      onConfirm: async () => {
        const result = await api("/api/models/remove", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ model })
        });
        toast(result.message || "模型已删除");
        await loadModels();
      }
    });
  }

  function showPullModelModal() {
    const mask = document.createElement("div");
    mask.className = "modal-mask";
    mask.innerHTML =
      '<div class="modal">' +
      '<h3 class="modal-title">' + icon("download") + "拉取模型</h3>" +
      '<label class="form-label" for="modelPullInput">模型名称</label>' +
      '<input id="modelPullInput" class="modal-input" spellcheck="false" placeholder="例如 qwen2.5:1.5b">' +
      '<div class="modal-actions">' +
      '<button class="btn ghost" data-close>取消</button>' +
      '<button class="btn primary" data-save>开始拉取</button></div></div>';
    modalRoot.appendChild(mask);
    renderIcons(mask);
    const close = () => mask.remove();
    mask.querySelector("[data-close]").onclick = close;
    mask.addEventListener("click", (event) => {
      if (event.target === mask) close();
    });
    mask.querySelector("[data-save]").onclick = async () => {
      const model = mask.querySelector("#modelPullInput").value.trim();
      if (!model) {
        toast("请输入模型名称", "error");
        return;
      }
      try {
        const result = await api("/api/models/pull", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ model })
        });
        toast(result.job ? "已开始拉取 " + model : result.error || "拉取失败");
        close();
        await loadModels();
      } catch (err) {
        if (err.message !== "需要访问令牌") toast(err.message, "error");
      }
    };
    setTimeout(() => mask.querySelector("#modelPullInput").focus(), 50);
  }

  function showModelTestModal(selected) {
    const models =
      (state.modelsData && state.modelsData.models) || [];
    const options = models.length
      ? models
          .map(
            (item) =>
              '<option value="' +
              esc(item.name) +
              '"' +
              (item.name === selected ? " selected" : "") +
              ">" +
              esc(item.name) +
              "</option>"
          )
          .join("")
      : '<option value="">先拉取模型</option>';
    const mask = document.createElement("div");
    mask.className = "modal-mask";
    mask.innerHTML =
      '<div class="modal modal-lg">' +
      '<h3 class="modal-title">' + icon("terminal") + "对话测试</h3>" +
      '<label class="form-label" for="modelTestSelect">模型</label>' +
      '<select id="modelTestSelect" class="modal-input">' + options + "</select>" +
      '<label class="form-label" for="modelTestPrompt">提示词</label>' +
      '<textarea id="modelTestPrompt" class="modal-textarea compose-textarea" spellcheck="false" placeholder="输入你想问模型的话"></textarea>' +
      '<pre class="docker-log-view" id="modelTestOutput">等待测试...</pre>' +
      '<div class="modal-actions" style="margin-top:12px">' +
      '<button class="btn ghost" data-close>关闭</button>' +
      '<button class="btn primary" data-run><i data-icon="play"></i><span>发送</span></button>' +
      "</div></div>";
    modalRoot.appendChild(mask);
    renderIcons(mask);
    const close = () => mask.remove();
    mask.querySelector("[data-close]").onclick = close;
    mask.addEventListener("click", (event) => {
      if (event.target === mask) close();
    });
    mask.querySelector("[data-run]").onclick = async () => {
      const model = mask.querySelector("#modelTestSelect").value;
      const prompt = mask.querySelector("#modelTestPrompt").value.trim();
      const output = mask.querySelector("#modelTestOutput");
      if (!model) {
        toast("请先选择模型", "error");
        return;
      }
      if (!prompt) {
        toast("请输入提示词", "error");
        return;
      }
      output.textContent = "生成中...";
      try {
        const result = await api("/api/models/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ model, prompt })
        });
        output.textContent = result.response || result.error || "无输出";
      } catch (err) {
        if (err.message !== "需要访问令牌")
          output.textContent = "调用失败：" + err.message;
      }
    };
    setTimeout(() => mask.querySelector("#modelTestPrompt").focus(), 50);
  }

  function renderLogs() {
    const query = $("#logSearch").value.trim().toLowerCase();
    const lines = query
      ? state.logs.filter((line) => line.toLowerCase().includes(query))
      : state.logs;
    $("#logOutput").textContent = lines.length ? lines.join("\n") : "（无日志）";
  }

  function renderCommandState() {
    const enabled = state.allowCommand;
    $("#commandInput").disabled = !enabled;
    $("#btnCommandRun").disabled = !enabled;
    const quick = $("#quickCommands");
    if (quick && !quick.children.length) renderQuickCommands();
    if (quick) {
      quick.querySelectorAll(".quick-chip").forEach((btn) => {
        btn.disabled = !enabled;
      });
    }
    const badge = $("#commandBadge");
    badge.textContent = enabled ? "已开启" : "未开启";
    badge.className = "badge" + (enabled ? " on" : "");
    if (!enabled) {
      $("#commandOutput").textContent =
        "命令执行功能默认关闭。重启服务时加上 --allow-command 参数即可开启。";
    }
  }

  function renderQuickCommands() {
    const list = $("#quickCommands");
    if (!list) return;
    list.innerHTML = QUICK_COMMANDS.map(
      (item) =>
        '<button class="quick-chip" data-command="' +
        esc(item.command) +
        '" title="' +
        esc(item.command) +
        '">' +
        esc(item.label) +
        "</button>"
    ).join("");
    list.querySelectorAll(".quick-chip").forEach((btn) => {
      btn.addEventListener("click", () => {
        $("#commandInput").value = btn.dataset.command;
        runCommand();
      });
    });
  }

  function requestLocalPassword(label, detail) {
    return new Promise((resolve) => {
      const mask = document.createElement("div");
      mask.className = "modal-mask";
      mask.innerHTML =
        '<div class="modal">' +
        '<h3 class="modal-title">' + icon("key") + "本机密码验证</h3>" +
        '<p class="modal-message">' + esc(label || "此操作需要输入服务器本机密码") + "</p>" +
        (detail
          ? '<div class="command-password-cmd">' + esc(detail) + "</div>"
          : "") +
        '<input id="localPasswordInput" class="modal-input" type="password" autocomplete="current-password" placeholder="本机密码" spellcheck="false">' +
        '<div class="modal-actions">' +
        '<button class="btn ghost" data-close>取消</button>' +
        '<button class="btn primary" data-confirm>验证并执行</button>' +
        "</div></div>";
      modalRoot.appendChild(mask);
      renderIcons(mask);
      let done = false;
      const finish = (value) => {
        if (done) return;
        done = true;
        mask.remove();
        resolve(value);
      };
      mask.querySelector("[data-close]").onclick = () => finish(null);
      mask.addEventListener("click", (event) => {
        if (event.target === mask) finish(null);
      });
      mask.querySelector("[data-confirm]").onclick = () =>
        finish(mask.querySelector("#localPasswordInput").value);
      mask.querySelector("#localPasswordInput").addEventListener(
        "keydown",
        (event) => {
          if (event.key === "Enter")
            finish(mask.querySelector("#localPasswordInput").value);
        }
      );
      setTimeout(() => mask.querySelector("#localPasswordInput").focus(), 50);
    });
  }

  async function runCommand() {
    if (!state.allowCommand) {
      toast("命令执行未开启", "error");
      return;
    }
    const command = $("#commandInput").value.trim();
    if (!command) {
      toast("命令不能为空", "error");
      return;
    }
    const password = await requestLocalPassword(
      "执行命令前需要输入服务器本机密码",
      command
    );
    if (password == null) return;
    const out = $("#commandOutput");
    out.textContent = "$ " + command + "\n正在验证本机密码...";
    $("#btnCommandRun").disabled = true;
    try {
      const result = await api("/api/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command, password })
      });
      out.textContent =
        "$ " + command + "\n\n" +
        (result.stdout || "") +
        (result.stderr || "") +
        "\n[退出码 " + result.returncode + "，耗时 " + result.duration_ms + " ms]";
    } catch (err) {
      if (err.message !== "需要访问令牌") {
        out.textContent = "执行失败：" + err.message;
        toast(err.message, "error");
      }
    } finally {
      $("#btnCommandRun").disabled = !state.allowCommand;
    }
  }


  let dbLastLoad = 0;

  async function loadDatabase(force) {
    const now = Date.now();
    if (!force && state.dbData && now - dbLastLoad < 5000) {
      renderDbEngines();
      return;
    }
    dbLastLoad = now;
    try {
      const data = await api("/api/db");
      state.dbData = data;
      const backups = await api("/api/db/backups");
      state.dbBackups = backups.backups || [];
      renderDbEngines();
      await loadDbDatabases(state.dbEngine, true);
    } catch (err) {
      if (err.message !== "需要访问令牌") toast(err.message, "error");
    }
  }

  function dbStateClass(engine) {
    if (!engine.installed) return "failed";
    return engine.running ? "active" : "inactive";
  }

  function renderDbEngines() {
    const engines = (state.dbData && state.dbData.engines) || [];
    $("#dbEngines").innerHTML = engines
      .map(
        (engine) =>
          '<button class="db-engine-card' +
          (engine.key === state.dbEngine ? " active" : "") +
          '" data-db-engine="' +
          esc(engine.key) +
          '"><span class="db-engine-name">' +
          icon("database") +
          esc(engine.name) +
          '</span><span class="state ' +
          dbStateClass(engine) +
          '">' +
          (engine.installed ? (engine.running ? "运行中" : "已停止") : "未安装") +
          '</span><small class="db-engine-version">' +
          esc(engine.version || engine.detail || "") +
          "</small>" +
          (engine.error
            ? '<small class="db-engine-error">' + esc(engine.error) + "</small>"
            : "") +
          "</button>"
      )
      .join("");
    renderIcons($("#dbEngines"));
  }

  async function loadDbDatabases(engine, skipRender) {
    state.dbEngine = engine || state.dbEngine;
    if (!skipRender) renderDbEngines();
    const engines = (state.dbData && state.dbData.engines) || [];
    const selected = engines.find((item) => item.key === state.dbEngine);
    if (!selected || !selected.installed) {
      state.dbDatabases = [];
      $("#dbDetail").innerHTML =
        '<div class="analytics-empty">该引擎未安装，可到应用商店安装对应服务。</div>';
      return;
    }
    try {
      const data = await api(
        "/api/db/databases?engine=" + encodeURIComponent(state.dbEngine)
      );
      state.dbDatabases = data.databases || [];
    } catch (err) {
      state.dbDatabases = [];
      if (err.message !== "需要访问令牌") {
        $("#dbDetail").innerHTML =
          '<div class="analytics-empty">' + esc(err.message) + "</div>";
        return;
      }
    }
    renderDbDetail();
  }

  function renderDbDetail() {
    const dbs = state.dbDatabases || [];
    const backups = state.dbBackups || [];
    const dbRows = dbs
      .map(
        (db) =>
          "<tr><td class=\"mono\">" +
          esc(db.name) +
          "</td><td class=\"mono\">" +
          (db.keys != null ? String(db.keys) + " keys" : "--") +
          '</td><td class="col-actions actions-wide"><div class="act">' +
          '<button class="icon-btn" data-db-backup="' +
          esc(db.name) +
          '" title="备份">' +
          icon("download") +
          '</button><button class="icon-btn danger" data-db-drop="' +
          esc(db.name) +
          '" title="删除">' +
          icon("trash") +
          "</button></div></td></tr>"
      )
      .join("");
    const backupRows = backups
      .map(
        (item) =>
          "<tr><td class=\"mono\">" +
          esc(item.name) +
          "</td><td class=\"mono\">" +
          formatBytes(item.size) +
          "</td><td class=\"mono\">" +
          esc(item.time) +
          '</td><td class="col-actions actions-wide"><div class="act">' +
          '<button class="icon-btn" data-db-download="' +
          esc(item.name) +
          '" title="下载">' +
          icon("download") +
          '</button><button class="icon-btn danger" data-db-backup-delete="' +
          esc(item.name) +
          '" title="删除备份">' +
          icon("trash") +
          "</button></div></td></tr>"
      )
      .join("");
    $("#dbDetail").innerHTML =
      '<div class="panel table-panel"><div class="panel-head"><h2>' +
      esc(state.dbEngine) +
      " 数据库</h2><span class=\"muted\">" +
      dbs.length +
      ' 个</span></div><div class="table-wrap"><table class="data-table"><thead><tr>' +
      "<th>名称</th><th>信息</th><th class=\"col-actions\">操作</th>" +
      "</tr></thead><tbody>" +
      (dbRows || '<tr><td colspan="3" class="muted">暂无数据库</td></tr>') +
      '</tbody></table></div></div><div class="panel table-panel"><div class="panel-head"><h2>备份文件</h2><span class="muted">' +
      backups.length +
      ' 个</span></div><div class="table-wrap"><table class="data-table"><thead><tr>' +
      "<th>文件</th><th>大小</th><th>时间</th><th class=\"col-actions\">操作</th>" +
      "</tr></thead><tbody>" +
      (backupRows || '<tr><td colspan="4" class="muted">暂无备份</td></tr>') +
      "</tbody></table></div></div>";
    renderIcons($("#dbDetail"));
  }

  function showDbCreateModal() {
    const engine = state.dbEngine;
    const charsetField =
      engine === "mysql" || engine === "mariadb" || engine === "postgresql"
        ? '<label class="form-label" for="dbCharset">字符集</label>' +
          '<select id="dbCharset" class="modal-input">' +
          (engine === "postgresql"
            ? '<option value="UTF8">UTF8</option>'
            : '<option value="utf8mb4">utf8mb4</option><option value="utf8">utf8</option><option value="latin1">latin1</option><option value="ascii">ascii</option>') +
          "</select>"
        : "";
    const mask = document.createElement("div");
    mask.className = "modal-mask";
    mask.innerHTML =
      '<div class="modal"><h3 class="modal-title">' +
      icon("database") +
      "新建数据库</h3><p class=\"modal-message\">将在 " +
      esc(engine) +
      ' 中创建数据库。</p><label class="form-label" for="dbName">数据库名</label>' +
      '<input id="dbName" class="modal-input" placeholder="例如 app_prod" maxlength="64" spellcheck="false">' +
      charsetField +
      '<div class="modal-actions"><button class="btn ghost" data-close>取消</button>' +
      '<button class="btn primary" data-confirm>创建</button></div></div>';
    modalRoot.appendChild(mask);
    renderIcons(mask);
    const finish = () => {
      const name = mask.querySelector("#dbName").value.trim();
      if (!name) {
        toast("请输入数据库名", "error");
        return;
      }
      const charsetEl = mask.querySelector("#dbCharset");
      api("/api/db/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          engine,
          name,
          charset: charsetEl ? charsetEl.value : ""
        })
      })
        .then((result) => {
          if (result.ok === false) throw new Error(result.error || "创建失败");
          toast(result.message || "已创建");
          mask.remove();
          loadDatabase(true);
        })
        .catch((err) => {
          if (err.message !== "需要访问令牌") toast(err.message, "error");
        });
    };
    mask.querySelector("[data-close]").onclick = () => mask.remove();
    mask.addEventListener("click", (event) => {
      if (event.target === mask) mask.remove();
    });
    mask.querySelector("[data-confirm]").onclick = finish;
    setTimeout(() => mask.querySelector("#dbName").focus(), 50);
  }

  function showDbConnectModal() {
    const engine = state.dbEngine;
    const engines = (state.dbData && state.dbData.engines) || [];
    const current = engines.find((item) => item.key === engine) || {};
    const cfg = current.config || {};
    const mask = document.createElement("div");
    mask.className = "modal-mask";
    mask.innerHTML =
      '<div class="modal"><h3 class="modal-title">' +
      icon("database") +
      esc(current.name || engine) +
      ' 连接设置</h3><p class="modal-message">留空表示使用本机默认连接；密码仅保存在服务器本机配置中。</p>' +
      '<label class="form-label" for="dbUser">用户名</label>' +
      '<input id="dbUser" class="modal-input" value="' +
      esc(cfg.user || "") +
      '" placeholder="留空使用默认" spellcheck="false">' +
      '<label class="form-label" for="dbPassword">密码</label>' +
      '<input id="dbPassword" class="modal-input" type="password" value="" placeholder="未设置时留空" spellcheck="false">' +
      '<label class="form-label" for="dbHost">主机</label>' +
      '<input id="dbHost" class="modal-input" value="' +
      esc(cfg.host || "") +
      '" placeholder="默认本机" spellcheck="false">' +
      '<label class="form-label" for="dbPort">端口</label>' +
      '<input id="dbPort" class="modal-input" value="' +
      esc(cfg.port || "") +
      '" placeholder="默认端口" spellcheck="false">' +
      '<div class="modal-actions"><button class="btn ghost" data-close>取消</button>' +
      '<button class="btn primary" data-confirm>保存</button></div></div>';
    modalRoot.appendChild(mask);
    renderIcons(mask);
    const close = () => mask.remove();
    mask.querySelector("[data-close]").onclick = close;
    mask.addEventListener("click", (event) => {
      if (event.target === mask) close();
    });
    mask.querySelector("[data-confirm]").onclick = async (event) => {
      const btn = event.currentTarget;
      btn.disabled = true;
      try {
        const result = await api("/api/db/connect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            engine,
            config: {
              user: mask.querySelector("#dbUser").value.trim(),
              password: mask.querySelector("#dbPassword").value,
              host: mask.querySelector("#dbHost").value.trim(),
              port: mask.querySelector("#dbPort").value.trim()
            }
          })
        });
        if (result.ok === false) throw new Error(result.error || "保存失败");
        toast(result.message || "连接配置已保存");
        close();
        loadDatabase(true);
      } catch (err) {
        btn.disabled = false;
        if (err.message !== "需要访问令牌") toast(err.message, "error");
      }
    };
  }

  function backupDatabase(name) {
    showConfirm({
      title: "备份数据库",
      message: "备份 " + name + "？大数据库可能需要较长时间。",
      confirmText: "开始备份",
      onConfirm: async () => {
        const result = await api("/api/db/backup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ engine: state.dbEngine, name })
        });
        if (result.ok === false) throw new Error(result.error || "备份失败");
        toast(result.message || "备份完成");
        state.dbBackups = (await api("/api/db/backups")).backups || [];
        renderDbDetail();
      }
    });
  }

  function dropDatabase(name) {
    showConfirm({
      title: "删除数据库",
      message: "确定删除 " + name + "？数据将无法恢复。",
      danger: true,
      confirmText: "确认删除",
      onConfirm: async () => {
        const result = await api("/api/db/drop", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ engine: state.dbEngine, name })
        });
        if (result.ok === false) throw new Error(result.error || "删除失败");
        toast(result.message || "已删除");
        await loadDbDatabases(state.dbEngine);
      }
    });
  }

  function deleteDbBackup(name) {
    showConfirm({
      title: "删除备份",
      message: "确定删除备份文件 " + name + "？",
      danger: true,
      confirmText: "确认删除",
      onConfirm: async () => {
        const result = await api("/api/db/backups/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name })
        });
        if (result.ok === false) throw new Error(result.error || "删除失败");
        toast(result.message || "已删除");
        state.dbBackups = (await api("/api/db/backups")).backups || [];
        renderDbDetail();
      }
    });
  }

  async function downloadBackup(name) {
    try {
      const res = await fetch(
        "/api/db/backups/download?name=" + encodeURIComponent(name),
        { headers: { "X-Panel-Token": state.token } }
      );
      if (!res.ok) {
        let message = "下载失败";
        try {
          message = (await res.json()).message || message;
        } catch (err) {
          /* keep default */
        }
        throw new Error(message);
      }
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = name;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    } catch (err) {
      if (err.message !== "需要访问令牌") toast(err.message, "error");
    }
  }

  function renderTerminalState() {
    const badge = $("#termBadge");
    if (!badge) return;
    const connected = Boolean(state.termSession && state.termAlive);
    badge.textContent = connected
      ? "已连接"
      : state.termSession
      ? "已断开"
      : "未连接";
    badge.className = "badge" + (connected ? " on" : "");
    const closeBtn = $("#btnTermClose");
    if (closeBtn) closeBtn.disabled = !state.termSession;
  }

  function ensureTerminal() {
    if (state.term) return;
    const host = $("#terminalHost");
    if (!host) return;
    host.innerHTML = "";
    state.term = new Terminal({
      cursorBlink: true,
      fontSize: 13,
      fontFamily: '"Cascadia Code", Consolas, "Courier New", monospace',
      scrollback: 3000,
      theme: {
        background: "#0b0e14",
        foreground: "#d7dce4",
        cursor: "#7dd3fc",
        selectionBackground: "#2a3a4d"
      }
    });
    state.termFit = new FitAddon.FitAddon();
    state.term.loadAddon(state.termFit);
    state.term.open(host);
    state.term.onData((data) => sendTerminalInput(data));
    window.addEventListener("resize", fitTerminal);
    requestAnimationFrame(() => {
      try {
        state.termFit.fit();
      } catch (err) {
        /* ignore */
      }
    });
  }

  function fitTerminal() {
    if (!state.term || !state.termFit) return;
    try {
      state.termFit.fit();
      if (state.termSession && state.termAlive) {
        api("/api/terminal/resize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sid: state.termSession,
            cols: state.term.cols,
            rows: state.term.rows
          })
        }).catch(() => {});
      }
    } catch (err) {
      /* ignore */
    }
  }

  async function openTerminalSession() {
    if (
      typeof Terminal === "undefined" ||
      typeof FitAddon === "undefined"
    ) {
      toast("终端组件未加载，请刷新页面", "error");
      return;
    }
    const password = await requestLocalPassword(
      "打开 Web 终端需要服务器本机密码"
    );
    if (password == null) return;
    ensureTerminal();
    try {
      const result = await api("/api/terminal/open", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cols: (state.term && state.term.cols) || 120,
          rows: (state.term && state.term.rows) || 32,
          password
        })
      });
      if (!result.session) throw new Error(result.message || "会话创建失败");
      state.termSession = result.session;
      state.termAlive = true;
      renderTerminalState();
      if (state.term) {
        state.term.clear();
        state.term.write("\x1b[32m[会话已建立]\x1b[0m\r\n");
      }
      if (state.termTimer) clearInterval(state.termTimer);
      state.termTimer = setInterval(pollTerminal, 160);
      requestAnimationFrame(() => fitTerminal());
    } catch (err) {
      if (err.message !== "需要访问令牌") toast(err.message, "error");
    }
  }

  async function pollTerminal() {
    if (!state.termSession) return;
    try {
      const result = await api(
        "/api/terminal/output?sid=" + encodeURIComponent(state.termSession)
      );
      if (result.data && state.term) state.term.write(result.data);
      if (!result.alive) stopTerminalPolling(true);
    } catch (err) {
      if (err.message !== "需要访问令牌") stopTerminalPolling(true);
    }
  }

  function stopTerminalPolling(showEnd) {
    if (state.termTimer) {
      clearInterval(state.termTimer);
      state.termTimer = null;
    }
    state.termAlive = false;
    if (showEnd && state.term) {
      state.term.write("\r\n\x1b[33m[会话已结束]\x1b[0m\r\n");
    }
    renderTerminalState();
  }

  async function sendTerminalInput(data) {
    if (!state.termSession || !state.termAlive) return;
    try {
      await api("/api/terminal/input", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sid: state.termSession, data })
      });
    } catch (err) {
      if (err.message !== "需要访问令牌") stopTerminalPolling(true);
    }
  }

  async function closeTerminalSession() {
    if (!state.termSession) return;
    const sid = state.termSession;
    try {
      await api("/api/terminal/close", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sid })
      });
    } catch (err) {
      /* ignore */
    }
    state.termSession = "";
    stopTerminalPolling(false);
  }

  function openContainerConsole(cid) {
    const item = (
      (state.containerData && state.containerData.containers) || []
    ).find((c) => c.id === cid);
    if (!item || item.state !== "running") {
      toast("容器未运行，无法打开控制台", "error");
      return;
    }
    requestLocalPassword("打开容器控制台需要服务器本机密码").then(
      async (password) => {
        if (password == null) return;
        if (typeof Terminal === "undefined" || typeof FitAddon === "undefined") {
          toast("终端组件未加载，请刷新页面", "error");
          return;
        }
        const mask = document.createElement("div");
        mask.className = "modal-mask";
        mask.innerHTML =
          '<div class="modal modal-lg console-modal"><h3 class="modal-title">' +
          icon("terminal") +
          esc(item.name) +
          " 控制台</h3>" +
          '<div class="terminal-panel console-term" id="containerConsoleTerm"></div>' +
          '<div class="modal-actions"><button class="btn ghost" data-close>关闭</button></div></div>';
        modalRoot.appendChild(mask);
        renderIcons(mask);
        const host = mask.querySelector("#containerConsoleTerm");
        const term = new Terminal({
          cursorBlink: true,
          fontSize: 13,
          fontFamily: '"Cascadia Code", Consolas, "Courier New", monospace',
          scrollback: 3000,
          theme: {
            background: "#0b0e14",
            foreground: "#d7dce4",
            cursor: "#7dd3fc",
            selectionBackground: "#2a3a4d"
          }
        });
        const fit = new FitAddon.FitAddon();
        term.loadAddon(fit);
        term.open(host);
        let sid = "";
        let alive = false;
        let timer = null;
        const stop = () => {
          if (timer) {
            clearInterval(timer);
            timer = null;
          }
          alive = false;
        };
        const fitConsole = () => {
          try {
            fit.fit();
            if (sid && alive) {
              api("/api/terminal/resize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  sid,
                  cols: term.cols,
                  rows: term.rows
                })
              }).catch(() => {});
            }
          } catch (err) {
            /* ignore */
          }
        };
        const poll = async () => {
          if (!sid) return;
          try {
            const result = await api(
              "/api/terminal/output?sid=" + encodeURIComponent(sid)
            );
            if (result.data) term.write(result.data);
            if (!result.alive) {
              stop();
              term.write("\r\n\x1b[33m[会话已结束]\x1b[0m\r\n");
            }
          } catch (err) {
            if (err.message !== "需要访问令牌") {
              stop();
              term.write("\r\n\x1b[31m[连接已断开]\x1b[0m\r\n");
            }
          }
        };
        term.onData((data) => {
          if (!sid || !alive) return;
          api("/api/terminal/input", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sid, data })
          }).catch(() => {});
        });
        const close = async () => {
          if (sid) {
            try {
              await api("/api/terminal/close", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sid })
              });
            } catch (err) {
              /* ignore */
            }
          }
          window.removeEventListener("resize", fitConsole);
          stop();
          try {
            term.dispose();
          } catch (err) {
            /* ignore */
          }
          mask.remove();
        };
        mask.querySelector("[data-close]").onclick = close;
        mask.addEventListener("click", (event) => {
          if (event.target === mask) close();
        });
        try {
          const result = await api("/api/container/console/open", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: cid,
              cols: term.cols || 120,
              rows: term.rows || 32,
              password
            })
          });
          if (!result.session) throw new Error(result.message || "控制台创建失败");
          sid = result.session;
          alive = true;
          term.clear();
          term.write("\x1b[32m[控制台已建立]\x1b[0m\r\n");
          timer = setInterval(poll, 160);
          window.addEventListener("resize", fitConsole);
          requestAnimationFrame(fitConsole);
        } catch (err) {
          if (err.message !== "需要访问令牌") toast(err.message, "error");
          mask.remove();
        }
      }
    );
  }

  function toggleTerminalFullscreen() {
    const panel = $("#terminalPanel");
    if (!panel) return;
    panel.classList.toggle("fullscreen");
    state.termFullscreen = panel.classList.contains("fullscreen");
    const btn = $("#btnTermFullscreen");
    if (btn) btn.classList.toggle("active", state.termFullscreen);
    requestAnimationFrame(() => fitTerminal());
  }

  async function loadTerminal() {
    renderTerminalState();
    if (state.termSession && state.termAlive && !state.termTimer) {
      state.termTimer = setInterval(pollTerminal, 160);
    }
    return Promise.resolve();
  }

  const PAGES = {
    overview: {
      title: "概览",
      subtitle: "服务器状态一览",
      load: loadOverview
    },
    processes: {
      title: "进程管理",
      subtitle: "查看与控制运行中的进程",
      load: loadProcesses
    },
    guard: {
      title: "进程守护",
      subtitle: "监控并自动拉起指定进程",
      load: loadGuard
    },
    services: {
      title: "服务管理",
      subtitle: "systemd 服务状态与控制",
      load: loadServices
    },
    firewall: {
      title: "防火墙",
      subtitle: "UFW / Fail2ban 安全管理",
      load: loadFirewall
    },
    models: {
      title: "本地模型",
      subtitle: "Ollama 模型与 GPU 监控",
      load: loadModels
    },
    apps: {
      title: "应用商店",
      subtitle: "Docker 应用 + 常用应用安装与管理",
      load: async () => {
        await loadApps();
        await loadDockerApps();
      }
    },
    database: {
      title: "数据库",
      subtitle: "MySQL / MariaDB / PostgreSQL / Redis 管理",
      load: loadDatabase
    },
    sites: {
      title: "网站管理",
      subtitle: "Nginx 站点创建与管理",
      load: loadSites
    },
    files: {
      title: "文件管理",
      subtitle: "浏览服务器文件系统",
      load: () => loadFiles("/")
    },
    terminal: {
      title: "Web 终端",
      subtitle: "浏览器远程终端",
      load: loadTerminal
    },
    toolbox: {
      title: "工具箱",
      subtitle: "系统基础工具",
      load: loadCurrentToolboxTab
    },
    command: {
      title: "命令执行",
      subtitle: "以当前用户身份执行命令",
      load: () => Promise.resolve()
    }
  };

  async function loadCurrent(silent) {
    const page = PAGES[state.page];
    $("#pageTitle").textContent = page.title;
    $("#pageSubtitle").textContent = page.subtitle;
    try {
      await page.load();
    } catch (err) {
      if (!silent && err.message !== "需要访问令牌") toast(err.message, "error");
    }
  }

  function switchPage(page) {
    state.page = page;
    document.querySelectorAll(".nav-item").forEach((el) => {
      el.classList.toggle("active", el.dataset.page === page);
    });
    document.querySelectorAll(".page").forEach((el) => {
      el.classList.toggle("active", el.id === "page-" + page);
    });
    loadCurrent();
  }

  function bindEvents() {
    document.querySelectorAll(".nav-item").forEach((btn) => {
      btn.addEventListener("click", () => switchPage(btn.dataset.page));
    });
    $("#btnRefresh").addEventListener("click", () => loadCurrent());
    $("#btnToken").addEventListener("click", showLoginModal);
    $("#refreshInterval").addEventListener("change", (event) => {
      localStorage.setItem("panel_refresh_v2", event.target.value);
      startAutoRefresh();
    });
    $("#themeSelect").addEventListener("change", (event) => {
      applyTheme(event.target.value);
    });
    $("#btnSidebarToggle").addEventListener("click", toggleSidebar);
    $("#sidebarWidth").addEventListener("input", (event) => {
      setSidebarWidth(event.target.value);
    });

    $("#btnProcRefresh").addEventListener("click", loadProcesses);
    document.querySelectorAll("#procFilter .seg").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("#procFilter .seg").forEach((item) => {
          item.classList.toggle("active", item === btn);
        });
        renderProcesses();
      });
    });
    $("#procSearch").addEventListener("input", renderProcesses);
    $("#procBody").addEventListener("click", (event) => {
      const btn = event.target.closest("button[data-kill]");
      if (btn) killProcess(Number(btn.dataset.kill), btn.dataset.sig);
    });

    $("#btnGuardAdd").addEventListener("click", showGuardModal);
    $("#btnGuardFromRunning").addEventListener("click", openRunningProcModal);
    $("#btnGuardRefresh").addEventListener("click", loadGuard);
    $("#guardBody").addEventListener("click", (event) => {
      const startBtn = event.target.closest("button[data-guard-start]");
      const toggleBtn = event.target.closest("button[data-guard-toggle]");
      const removeBtn = event.target.closest("button[data-guard-remove]");
      if (startBtn) guardStart(startBtn.dataset.guardStart);
      else if (toggleBtn) guardToggle(toggleBtn.dataset.guardToggle);
      else if (removeBtn) guardRemove(removeBtn.dataset.guardRemove);
    });

    $("#btnServiceRefresh").addEventListener("click", loadServices);
    $("#serviceSearch").addEventListener("input", renderServices);
    $("#serviceBody").addEventListener("click", (event) => {
      const btn = event.target.closest("button[data-service]");
      if (btn) serviceAction(btn.dataset.service, btn.dataset.action);
    });

    $("#btnFirewallRefresh").addEventListener("click", loadFirewall);
    $("#btnFirewallToggle").addEventListener("click", toggleFirewall);
    $("#btnFirewallAdd").addEventListener("click", showAddRuleModal);
    $("#firewallBody").addEventListener("click", (event) => {
      const btn = event.target.closest("button[data-firewall-delete]");
      if (btn) firewallDeleteRule(Number(btn.dataset.firewallDelete));
    });
    document.querySelectorAll("#firewallNav .seg").forEach((btn) => {
      btn.addEventListener("click", () => switchFirewallView(btn.dataset.view));
    });
    $("#btnF2bRefresh").addEventListener("click", loadFail2ban);
    $("#btnF2bInstall").addEventListener("click", installFail2ban);
    $("#btnF2bStart").addEventListener("click", () => fail2banAction("start"));
    $("#btnF2bRestart").addEventListener("click", () => fail2banAction("restart"));
    $("#btnF2bReload").addEventListener("click", () => fail2banAction("reload"));
    $("#btnF2bStop").addEventListener("click", () => fail2banAction("stop"));
    $("#f2bBody").addEventListener("click", (event) => {
      const btn = event.target.closest("button[data-f2b-unban]");
      if (btn) fail2banUnban(btn.dataset.f2bUnban, btn.dataset.jail);
    });

    $("#btnModelsRefresh").addEventListener("click", loadModels);
    $("#btnModelsInstall").addEventListener("click", installOllama);
    $("#btnModelsPull").addEventListener("click", showPullModelModal);
    $("#btnModelsTest").addEventListener("click", () => showModelTestModal(""));
    document.querySelectorAll("#modelsNav .seg").forEach((btn) => {
      btn.addEventListener("click", () => {
        switchModelsView(btn.dataset.view);
      });
    });
    $("#modelsView").addEventListener("click", (event) => {
      const testBtn = event.target.closest("button[data-model-test]");
      const removeBtn = event.target.closest("button[data-model-remove]");
      const pullBtn = event.target.closest("button[data-catalog-pull]");
      if (testBtn) showModelTestModal(testBtn.dataset.modelTest);
      else if (removeBtn) removeModel(removeBtn.dataset.modelRemove);
      else if (pullBtn) pullModel(pullBtn.dataset.catalogPull);
    });
    $("#modelsView").addEventListener("input", (event) => {
      if (event.target.id === "modelCatalogSearch") {
        renderModelsCatalogTable();
      }
    });

    $("#btnFileGo").addEventListener("click", () => {
      const path = $("#pathInput").value.trim() || "/";
      loadFiles(path);
    });
    $("#pathInput").addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        const path = $("#pathInput").value.trim() || "/";
        loadFiles(path);
      }
    });
    $("#btnFileUp").addEventListener("click", () => {
      if (state.files && state.files.parent) loadFiles(state.files.parent);
    });
    $("#btnFileUpload").addEventListener("click", () => {
      $("#fileUploadInput").click();
    });
    $("#fileUploadInput").addEventListener("change", (event) => {
      uploadFiles(event.target.files);
      event.target.value = "";
    });
    $("#btnFileMkdir").addEventListener("click", showFileMkdirModal);
    $("#btnFileUrl").addEventListener("click", showFileUrlModal);
    $("#btnFileArchive").addEventListener("click", showFileArchiveModal);
    $("#btnFileExtract").addEventListener("click", showFileExtractModal);
    $("#fileBody").addEventListener("click", (event) => {
      const openBtn = event.target.closest("button[data-open]");
      const viewBtn = event.target.closest("button[data-view]");
      const deleteBtn = event.target.closest("button[data-delete]");
      const downloadBtn = event.target.closest("button[data-file-download]");
      const renameBtn = event.target.closest("button[data-file-rename]");
      const permBtn = event.target.closest("button[data-file-perm]");
      if (openBtn) loadFiles(openBtn.dataset.open);
      else if (viewBtn) viewFile(viewBtn.dataset.view);
      else if (downloadBtn) downloadFile(downloadBtn.dataset.fileDownload);
      else if (renameBtn) showFileRenameModal(renameBtn.dataset.fileRename);
      else if (permBtn) showFilePermModal(permBtn.dataset.filePerm);
      else if (deleteBtn) deleteFile(deleteBtn.dataset.delete);
    });

    $("#btnBackupCreate").addEventListener("click", showBackupCreateModal);
    $("#btnBackupRefresh").addEventListener("click", loadBackups);
    $("#backupBody").addEventListener("click", (event) => {
      const uploadBtn = event.target.closest("button[data-backup-upload]");
      const downloadBtn = event.target.closest("button[data-backup-download]");
      const restoreBtn = event.target.closest("button[data-backup-restore]");
      const deleteBtn = event.target.closest("button[data-backup-delete]");
      if (uploadBtn) cloudUpload(uploadBtn.dataset.backupUpload);
      else if (downloadBtn) downloadBackupFile(downloadBtn.dataset.backupDownload);
      else if (restoreBtn) restoreBackup(restoreBtn.dataset.backupRestore);
      else if (deleteBtn) deleteBackup(deleteBtn.dataset.backupDelete);
    });

    $("#cloudBody").addEventListener("click", (event) => {
      const dlBtn = event.target.closest("button[data-cloud-download]");
      const delBtn = event.target.closest("button[data-cloud-delete]");
      if (dlBtn) cloudDownload(dlBtn.dataset.cloudDownload);
      else if (delBtn) cloudDelete(delBtn.dataset.cloudDelete);
    });

    $("#btnWebdavConfig").addEventListener("click", showWebdavConfigModal);
    $("#btnWebdavTest").addEventListener("click", testWebdav);
    $("#btnWebdavRefresh").addEventListener("click", loadCloudBackups);

    $("#btnSiteCreate").addEventListener("click", showSiteCreateModal);
    $("#btnSiteRefresh").addEventListener("click", loadSites);
    $("#btnNginxInstall").addEventListener("click", installNginx);
    $("#btnSshRefresh").addEventListener("click", loadSshConfig);
    $("#btnSshSave").addEventListener("click", saveSshConfig);
    $("#btnCleanRefresh").addEventListener("click", loadCleanStatus);
    $("#btnCleanRun").addEventListener("click", runClean);
    $("#btnClamavInstall").addEventListener("click", installClamav);
    $("#btnClamavScan").addEventListener("click", startClamScan);
    $("#btnClamavRefresh").addEventListener("click", loadClamav);
    $("#btnDiskRefresh").addEventListener("click", loadDiskInfo);
    $("#btnAlertsRefresh").addEventListener("click", loadAlerts);
    $("#btnAlertsSave").addEventListener("click", saveAlerts);
    $("#btnAlertsTest").addEventListener("click", testAlerts);
    $("#btnSettings").addEventListener("click", showSettingsModal);
    $("#siteBody").addEventListener("click", (event) => {
      const sslBtn = event.target.closest("button[data-site-ssl]");
      const logsBtn = event.target.closest("button[data-site-logs]");
      const configBtn = event.target.closest("button[data-site-config]");
      const toggleBtn = event.target.closest("button[data-site-toggle]");
      const deleteBtn = event.target.closest("button[data-site-delete]");
      if (sslBtn) {
        const name = sslBtn.dataset.siteSsl;
        loadCerts().then(() => {
          const cert = ((state.certs || {}).certs || []).find((c) => c.site === name);
          if (cert && cert.enabled) disableCert(name);
          else issueCert(name);
        });
      } else if (logsBtn) showSiteLogs(logsBtn.dataset.siteLogs);
      else if (configBtn) editSiteConfig(configBtn.dataset.siteConfig);
      else if (toggleBtn)
        toggleSite(toggleBtn.dataset.siteToggle, toggleBtn.dataset.enable === "1");
      else if (deleteBtn) deleteSite(deleteBtn.dataset.siteDelete);
    });

    document.querySelectorAll("#trendRange .seg").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("#trendRange .seg").forEach((item) => {
          item.classList.toggle("active", item === btn);
        });
        state.trendHours = Number(btn.dataset.hours) || 24;
        loadTrends();
      });
    });

    $("#btnLogRefresh").addEventListener("click", loadLogs);
    $("#logSearch").addEventListener("input", renderLogs);
    $("#btnAuditRefresh").addEventListener("click", loadAudit);
    $("#btnAuditClear").addEventListener("click", clearAudit);
    $("#auditLines").addEventListener("change", loadAudit);
    $("#logLines").addEventListener("change", loadLogs);

    $("#btnToolboxRefresh").addEventListener("click", loadToolbox);
    $("#btnDnsResolve").addEventListener("click", resolveDomain);
    $("#dnsDomain").addEventListener("keydown", (event) => {
      if (event.key === "Enter") resolveDomain();
    });
    document.querySelectorAll(".toolbox-tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        switchToolboxTab(btn.dataset.toolboxTab);
      });
    });
    $("#btnAnalyticsSavePath").addEventListener("click", saveAnalyticsPaths);
    $("#btnAnalyticsRefresh").addEventListener("click", loadAnalytics);
    document.querySelectorAll("#analyticsNav .seg").forEach((btn) => {
      btn.addEventListener("click", () => {
        switchAnalyticsView(btn.dataset.view);
      });
    });
    $("#analyticsView").addEventListener("input", (event) => {
      if (event.target.id === "analyticsReqSearch") {
        renderAnalyticsRequestsTable(event.target.value);
      }
    });
    $("#btnTamperSavePath").addEventListener("click", saveTamperPaths);
    $("#btnTamperInit").addEventListener("click", initTamperBaseline);
    $("#btnTamperScan").addEventListener("click", scanTamper);
    $("#btnTamperRefresh").addEventListener("click", loadTamper);
    $("#tamperPath").addEventListener("keydown", (event) => {
      if (event.key === "Enter") saveTamperPaths();
    });
    document.querySelectorAll("#tamperNav .seg").forEach((btn) => {
      btn.addEventListener("click", () => {
        switchTamperView(btn.dataset.view);
      });
    });

    $("#btnCronJobAdd").addEventListener("click", showCronJobModal);
    $("#btnCronJobRefresh").addEventListener("click", loadCronJobs);
    $("#cronJobBody").addEventListener("click", (event) => {
      const runBtn = event.target.closest("button[data-job-run]");
      const logBtn = event.target.closest("button[data-job-log]");
      const toggleBtn = event.target.closest("button[data-job-toggle]");
      const deleteBtn = event.target.closest("button[data-job-delete]");
      if (runBtn) runCronJob(runBtn.dataset.jobRun);
      else if (logBtn) {
        const job = (state.cronJobs || []).find((j) => j.id === logBtn.dataset.jobLog);
        showCronJobLog(logBtn.dataset.jobLog, job ? job.name : "");
      } else if (toggleBtn)
        toggleCronJob(toggleBtn.dataset.jobToggle, toggleBtn.dataset.enable === "1");
      else if (deleteBtn) deleteCronJob(deleteBtn.dataset.jobDelete);
    });

    $("#btnCronAdd").addEventListener("click", showCronModal);
    $("#btnCronRefresh").addEventListener("click", loadCron);
    $("#cronBody").addEventListener("click", (event) => {
      const toggleBtn = event.target.closest("button[data-cron-toggle]");
      const removeBtn = event.target.closest("button[data-cron-remove]");
      if (toggleBtn) cronToggle(Number(toggleBtn.dataset.cronToggle));
      else if (removeBtn) cronRemove(Number(removeBtn.dataset.cronRemove));
    });

    document.querySelectorAll("#sshFilter .seg").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("#sshFilter .seg").forEach((item) => {
          item.classList.toggle("active", item === btn);
        });
        renderSshLogs();
      });
    });
    $("#sshLines").addEventListener("change", loadSshLogs);
    $("#btnSshRefresh").addEventListener("click", loadSshLogs);

    $("#btnAppsRefresh").addEventListener("click", loadApps);
    $("#btnAppsCheckUpdate").addEventListener("click", checkAppUpdates);
    $("#appsSearch").addEventListener("input", renderApps);
    $("#appsCategories").addEventListener("click", (event) => {
      const chip = event.target.closest("button[data-category]");
      if (chip) {
        state.appsCategory = chip.dataset.category;
        renderApps();
      }
    });
    $("#appsBody").addEventListener("click", (event) => {
      const copyBtn = event.target.closest("button[data-copy]");
      const installBtn = event.target.closest("button[data-install]");
      const updateBtn = event.target.closest("button[data-update]");
      const uninstallBtn = event.target.closest("button[data-uninstall]");
      if (copyBtn) copyText(copyBtn.dataset.copy);
      else if (installBtn) installApp(installBtn.dataset.install);
      else if (updateBtn) updateApp(updateBtn.dataset.update);
      else if (uninstallBtn) uninstallApp(uninstallBtn.dataset.uninstall);
    });

    $("#dockerAppsGrid").addEventListener("click", (event) => {
      const installBtn = event.target.closest("button[data-dapp-install]");
      const actionBtn = event.target.closest("button[data-dapp-action]");
      const logsBtn = event.target.closest("button[data-dapp-logs]");
      const uninstallBtn = event.target.closest("button[data-dapp-uninstall]");
      const backupBtn = event.target.closest("button[data-dapp-backup]");
      if (installBtn) showDockerAppInstallModal(installBtn.dataset.dappInstall);
      else if (actionBtn)
        dockerAppAction(actionBtn.dataset.dappAction, actionBtn.dataset.act);
      else if (logsBtn) showDockerAppLogs(logsBtn.dataset.dappLogs);
      else if (backupBtn) backupDockerApp(backupBtn.dataset.dappBackup);
      else if (uninstallBtn) uninstallDockerApp(uninstallBtn.dataset.dappUninstall);
    });

    $("#btnContainerRefresh").addEventListener("click", loadContainer);
    $("#btnContainerCreate").addEventListener("click", showCreateContainerModal);
    $("#btnContainerPull").addEventListener("click", showPullImageModal);
    $("#btnContainerCompose").addEventListener(
      "click",
      () => showComposeModal("")
    );
    document.querySelectorAll("#containerNav .seg").forEach((btn) => {
      btn.addEventListener("click", () => {
        switchContainerView(btn.dataset.view);
      });
    });
    $("#containerView").addEventListener("click", (event) => {
      const logBtn = event.target.closest("button[data-container-logs]");
      const consoleBtn = event.target.closest("button[data-container-console]");
      const actionBtn = event.target.closest("button[data-container-action]");
      const imageRemove = event.target.closest("button[data-image-remove]");
      const networkRemove = event.target.closest(
        "button[data-network-remove]"
      );
      const volumeRemove = event.target.closest("button[data-volume-remove]");
      const createNetwork = event.target.closest("button[data-create-network]");
      const createVolume = event.target.closest("button[data-create-volume]");
      const composeActionBtn = event.target.closest(
        "button[data-compose-action]"
      );
      const composeEditBtn = event.target.closest("button[data-compose-edit]");
      const composeDeleteBtn = event.target.closest(
        "button[data-compose-delete]"
      );
      if (logBtn) showContainerLogs(logBtn.dataset.containerLogs);
      else if (consoleBtn) openContainerConsole(consoleBtn.dataset.containerConsole);
      else if (actionBtn)
        containerAction(actionBtn.dataset.cid, actionBtn.dataset.containerAction);
      else if (imageRemove)
        removeDockerResource(
          "/api/container/images/remove",
          imageRemove.dataset.imageRemove,
          "镜像",
          "id"
        );
      else if (networkRemove)
        removeDockerResource(
          "/api/container/networks/remove",
          networkRemove.dataset.networkRemove,
          "网络",
          "name"
        );
      else if (volumeRemove)
        removeDockerResource(
          "/api/container/volumes/remove",
          volumeRemove.dataset.volumeRemove,
          "卷",
          "name"
        );
      else if (createNetwork) showCreateNetworkModal();
      else if (createVolume) showCreateVolumeModal();
      else if (composeActionBtn)
        composeAction(
          composeActionBtn.dataset.composeName,
          composeActionBtn.dataset.composeAction
        );
      else if (composeEditBtn) showComposeModal(composeEditBtn.dataset.composeEdit);
      else if (composeDeleteBtn)
        composeAction(composeDeleteBtn.dataset.composeDelete, "delete");
    });

    $("#btnCommandRun").addEventListener("click", runCommand);
    $("#btnCommandClear").addEventListener("click", () => {
      $("#commandInput").value = "";
      $("#commandOutput").textContent = "等待执行...";
    });
    $("#commandInput").addEventListener("keydown", (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") runCommand();
    });

    $("#btnDbRefresh").addEventListener("click", () => loadDatabase(true));
    $("#btnDbCreate").addEventListener("click", showDbCreateModal);
    $("#btnDbConnect").addEventListener("click", showDbConnectModal);
    $("#dbEngines").addEventListener("click", (event) => {
      const card = event.target.closest("button[data-db-engine]");
      if (card) loadDbDatabases(card.dataset.dbEngine);
    });
    $("#dbDetail").addEventListener("click", (event) => {
      const backupBtn = event.target.closest("button[data-db-backup]");
      const dropBtn = event.target.closest("button[data-db-drop]");
      const downloadBtn = event.target.closest("button[data-db-download]");
      const backupDeleteBtn = event.target.closest(
        "button[data-db-backup-delete]"
      );
      if (backupBtn) backupDatabase(backupBtn.dataset.dbBackup);
      else if (dropBtn) dropDatabase(dropBtn.dataset.dbDrop);
      else if (downloadBtn) downloadBackup(downloadBtn.dataset.dbDownload);
      else if (backupDeleteBtn)
        deleteDbBackup(backupDeleteBtn.dataset.dbBackupDelete);
    });

    $("#btnTermOpen").addEventListener("click", openTerminalSession);
    $("#btnTermClose").addEventListener("click", closeTerminalSession);
    $("#btnTermFullscreen").addEventListener(
      "click",
      toggleTerminalFullscreen
    );
  }

  async function init() {
    renderIcons(document);
    bindEvents();
    applyTheme(localStorage.getItem("panel_theme_v2") || "deep");
    const savedWidth = parseInt(
      localStorage.getItem("panel_sidebar_width_v2"),
      10
    );
    if (savedWidth >= 180 && savedWidth <= 320) {
      state.sidebarWidth = savedWidth;
    }
    state.sidebarCollapsed =
      localStorage.getItem("panel_sidebar_collapsed_v2") === "1";
    applySidebarState();
    const savedRefresh = localStorage.getItem("panel_refresh_v2");
    $("#refreshInterval").value = ["0", "1", "5", "10", "30", "60"].includes(
      savedRefresh
    )
      ? savedRefresh
      : "1";
    startAutoRefresh();
    await loadStatus();
    await loadCurrent();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
