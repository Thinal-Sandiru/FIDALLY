const $ = (s) => document.querySelector(s),
  $$ = (s) => [...document.querySelectorAll(s)];

// mobile menu
$("#menu").onclick = () => $("#links").classList.toggle("open");
$$("#links a").forEach(
  (a) => (a.onclick = () => $("#links").classList.remove("open")),
);

// scroll reveal
const io = new IntersectionObserver(
  (e) =>
    e.forEach((x) => {
      if (x.isIntersecting) {
        x.target.classList.add("in");
        io.unobserve(x.target);
      }
    }),
  { threshold: 0.12 },
);
$$(".rv").forEach((el) => io.observe(el));

// stat count-up
const so = new IntersectionObserver(
  (e) =>
    e.forEach((x) => {
      if (!x.isIntersecting) return;
      so.unobserve(x.target);
      const el = x.target,
        n = +el.dataset.n,
        pre = el.dataset.pre || "",
        suf = el.dataset.suf || "",
        t0 = performance.now();
      (function tick(t) {
        const p = Math.min((t - t0) / 1400, 1);
        el.textContent = pre
          ? p < 1
            ? pre + Math.ceil(p * 6)
            : pre + "6"
          : Math.round(n * p) + suf;
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    }),
  { threshold: 0.6 },
);
$$(".stat strong").forEach((s) => {
  if (s.dataset.pre) s.dataset.pre = "1 in ";
  so.observe(s);
});

// neural network background
(() => {
  const c = $("#net"),
    x = c.getContext("2d");
  let w,
    h,
    pts = [];
  const size = () => {
    w = c.width = c.offsetWidth;
    h = c.height = c.offsetHeight;
    pts = Array.from({ length: Math.min(70, Math.floor(w / 18)) }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
    }));
  };
  size();
  addEventListener("resize", size);
  if (matchMedia("(prefers-reduced-motion:reduce)").matches) return;
  (function draw() {
    x.clearRect(0, 0, w, h);
    pts.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      x.fillStyle = "#5aa2ff";
      x.beginPath();
      x.arc(p.x, p.y, 1.8, 0, 7);
      x.fill();
      for (let j = i + 1; j < pts.length; j++) {
        const q = pts[j],
          d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 130) {
          x.strokeStyle = "rgba(90,162,255," + (1 - d / 130) * 0.5 + ")";
          x.beginPath();
          x.moveTo(p.x, p.y);
          x.lineTo(q.x, q.y);
          x.stroke();
        }
      }
    });
    requestAnimationFrame(draw);
  })();
})();

function pulseChip(selector) {
  const chip = $(selector);
  if (!chip) return;
  chip.classList.add("pulse-hi");
  setTimeout(() => chip.classList.remove("pulse-hi"), 1200);
}

// conversation-to-action demo
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let run = 0;
async function demo() {
  const id = ++run,
    chat = $("#chat"),
    out = $("#out");
  chat.innerHTML = "";
  out.innerHTML = '<div class="empty">Waiting for your confirmation…</div>';
  const say = async (cls, txt, wait) => {
    if (id !== run) return false;
    const d = document.createElement("div");
    d.className = "msg " + cls;
    d.textContent = txt;
    chat.appendChild(d);
    await sleep(wait);
    return id === run;
  };
  if (
    !(await say(
      "u",
      "I had a long study session today, and please remind me about my dentist on Friday at 4.",
      1500,
    ))
  )
    return;
  if (
    !(await say(
      "a",
      "Got it. Shall I add the reminder and write today in your diary?",
      1600,
    ))
  )
    return;
  if (!(await say("u", "Yes, please.", 900))) return;
  out.innerHTML = "";
  for (const [t, p, chipSel] of [
    ["⏰ Reminder", "Friday, 4:00 PM · Dentist appointment", "#hero .chip.c2"],
    [
      "📓 Diary",
      "A long, focused study session today. Dentist booked for Friday.",
      "#hero .chip.c1",
    ],
  ]) {
    if (id !== run) return;
    const d = document.createElement("div");
    d.className = "card";
    d.innerHTML = '<span class="ok">Confirmed ✓</span><small></small><p></p>';
    d.querySelector("small").textContent = t;
    d.querySelector("p").textContent = p;
    out.appendChild(d);
    pulseChip(chipSel);
    await sleep(700);
  }
}
const dio = new IntersectionObserver(
  (e) => {
    if (e[0].isIntersecting) {
      dio.disconnect();
      demo();
    }
  },
  { threshold: 0.4 },
);
dio.observe($("#chat"));
$("#replay").onclick = demo;

// modes + music
const M = {
  Study: [
    "Study Mode",
    "Fewer interruptions, only important reminders, a quiet voice and a gentle focus timer.",
  ],
  Sleep: [
    "Sleep Mode",
    "A dimmed display, a soft voice, calming music and a quiet wake-up reminder.",
  ],
};
function setMode(k) {
  $("#mt").textContent = M[k][0];
  $("#md").textContent = M[k][1];
  const orb = $(".orb");
  if (orb) orb.classList.toggle("sleep-mode", k === "Sleep");
  const c3 = $("#hero .chip.c3");
  if (c3) {
    c3.textContent = k === "Sleep" ? "🌙 Sleep Mode on" : "📚 Study Mode on";
    pulseChip("#hero .chip.c3");
  }
}
$$(".tab").forEach(
  (t) =>
    (t.onclick = () => {
      $$(".tab").forEach((x) => x.classList.remove("on"));
      t.classList.add("on");
      setMode(t.dataset.m);
    }),
);
setMode("Study");

// To use real audio, add files ./music/track1.mp3 ... ./music/track10.mp3
const names = [
  "Calm Morning",
  "Focus Flow",
  "Deep Study",
  "Rainy Window",
  "Night Drift",
  "Soft Piano",
  "Ocean Breath",
  "Lo-fi Evening",
  "Gentle Guitar",
  "Starlight",
];
const au = new Audio();
let cur = -1,
  playing = false;
function view() {
  $("#eq").classList.toggle("on", playing);
  $("#pp").textContent = playing ? "❚❚" : "▶";
  $$(".tracks button").forEach((b, i) => b.classList.toggle("on", i === cur));
}
function play(i) {
  cur = i;
  playing = true;
  $("#np").textContent = names[i];
  $("#ns").textContent = "Track " + (i + 1) + " of 10";
  au.src = "./music/track" + (i + 1) + ".mp3";
  au.play().catch(() => {});
  view();
}
names.forEach((n, i) => {
  const li = document.createElement("li"),
    b = document.createElement("button");
  b.textContent = i + 1 + ". " + n;
  b.onclick = () => play(i);
  li.appendChild(b);
  $("#tracks").appendChild(li);
});
$("#pp").onclick = () => {
  if (cur < 0) return play(0);
  playing = !playing;
  playing ? au.play().catch(() => {}) : au.pause();
  view();
};
au.onended = () => play((cur + 1) % 10);

// privacy controls: toggles + 2-3 month auto-delete slider
const ret = $("#ret");
if (ret) {
  ret.oninput = () => {
    const v = +ret.value;
    $("#retv").textContent = v + (v > 1 ? " months" : " month");
    $("#fill").style.width = ((v - 1) / 2) * 100 + "%";
  };
  ret.oninput();
}
$$(".tg button").forEach((b) => {
  const row = b.closest(".tg");
  let stateEl = row?.querySelector(".tg-state");
  if (!stateEl && row) {
    stateEl = document.createElement("span");
    stateEl.className = "tg-state";
    const wrap = document.createElement("div");
    wrap.className = "tg-right";
    b.replaceWith(wrap);
    wrap.append(stateEl, b);
  }
  const syncState = () => {
    const on = b.getAttribute("aria-pressed") === "true";
    if (stateEl) {
      stateEl.textContent = on ? "ON" : "OFF";
      stateEl.classList.toggle("off", !on);
    }
  };
  syncState();
  b.onclick = () => {
    b.setAttribute("aria-pressed", b.getAttribute("aria-pressed") !== "true");
    syncState();
  };
});

// interactive roadmap deliverables (click + keyboard support)
const roadmapDetails = {
  1: [
    "Phase 1 · Design",
    "Requirements analysis, user workflows, and connected architecture for FIDALLY and its companion app.",
  ],
  2: [
    "Phase 2 · Hardware",
    "Prototyping the computing board, microphone, speaker, and display assembly.",
  ],
  3: [
    "Phase 3 · AI",
    "Building natural voice conversation, diary summarization, and confirmation prompts.",
  ],
  4: [
    "Phase 4 · Mobile app",
    "Developing diary management, reminders, Study/Sleep modes, music controls, and privacy settings.",
  ],
  5: [
    "Phase 5 · Integration",
    "Connecting the physical companion device and mobile app into one synced workflow.",
  ],
  6: [
    "Phase 6 · Test and demo",
    "Usability testing, bug fixes, documentation, and final prototype demonstration.",
  ],
};
$$("#roadmap .st").forEach((st) => {
  const selectStep = () => {
    $$("#roadmap .st").forEach((s) => s.classList.remove("active"));
    st.classList.add("active");
    const info = roadmapDetails[st.dataset.m];
    if (info && $("#rm-title") && $("#rm-desc")) {
      $("#rm-title").textContent = info[0];
      $("#rm-desc").textContent = info[1];
    }
  };
  st.onclick = selectStep;
  st.onkeydown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      selectStep();
    }
  };
});

// waitlist form -> Node.js API (POST /api/waitlist)
$("#form").onsubmit = async (e) => {
  e.preventDefault();
  const form = e.target,
    msg = $("#msg"),
    btn = form.querySelector("button");
  msg.className = "";
  msg.textContent = "Sending…";
  btn.disabled = true;
  try {
    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: $("#email").value }),
    });
    const data = await res.json();
    msg.textContent = data.message;
    if (!res.ok) msg.className = "err";
    else form.reset();
  } catch {
    msg.className = "err";
    msg.textContent = "Could not reach the server. Please try again.";
  } finally {
    btn.disabled = false;
  }
};