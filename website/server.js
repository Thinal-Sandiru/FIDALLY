require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs/promises");
const { sendWelcomeEmail } = require("./mailer");

const app = express();
const PORT = process.env.PORT || 3000;

const PUBLIC_DIR = path.join(__dirname, "public");
const DATA_DIR = path.join(__dirname, "data");
const WAITLIST_FILE = path.join(DATA_DIR, "waitlist.json");

app.disable("x-powered-by");
app.use(express.json({ limit: "10kb" }));
app.use(express.static(PUBLIC_DIR));

// ---------- waitlist storage (JSON file) ----------
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
let queue = Promise.resolve(); // serialises writes so two requests never clash

async function readList() {
  try {
    return JSON.parse(await fs.readFile(WAITLIST_FILE, "utf8"));
  } catch {
    return [];
  }
}

function addEmail(email) {
  const job = queue.then(async () => {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const list = await readList();
    if (list.some((x) => x.email === email)) return false;
    list.push({ email, joinedAt: new Date().toISOString() });
    await fs.writeFile(WAITLIST_FILE, JSON.stringify(list, null, 2));
    return true;
  });
  queue = job.catch(() => {});
  return job;
}

// ---------- API ----------
app.get("/api/health", (req, res) => res.json({ ok: true }));

app.post("/api/waitlist", async (req, res, next) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
      return res
        .status(400)
        .json({ ok: false, message: "Please enter a valid email address." });
    }
    const added = await addEmail(email);
    if (added) {
      // send in the background; a mail problem must not break signup
      sendWelcomeEmail(email).catch((err) =>
        console.error("[mail] could not send to " + email + ":", err.message),
      );
    }
    res.json({
      ok: true,
      message: added
        ? "Thank you! You are on the list: " + email
        : "You are already on the list: " + email,
    });
  } catch (err) {
    next(err);
  }
});

// ---------- fallbacks ----------
app.use("/api", (req, res) =>
  res.status(404).json({ ok: false, message: "Not found" }),
);
app.use((req, res) => res.status(404).sendFile(path.join(PUBLIC_DIR, "index.html")));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ ok: false, message: "Server error. Please try again." });
});

app.listen(PORT, () => {
  console.log("FIDALLY landing page running at http://localhost:" + PORT);
});
