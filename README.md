# FIDALLY – Your Faithful AI Ally

FIDALLY is a physical AI companion paired with a dedicated mobile app. It holds natural voice conversations, remembers details the user approves, keeps a personal diary and manages reminders. The user stays in control of their own data throughout.

The name combines **Fidelis** (faithful, loyal) and **Ally** (a trusted companion).

🌐 **Website:** [myfidally.com](https://myfidally.com)

📋 **Task board:** [Trello – FIDALLY Task Board](https://trello.com/b/Ysdd87HR)

---

## The problem

Loneliness and social isolation are a growing global concern. The WHO (2025) estimates that about 1 in 6 people worldwide experience loneliness. Many people have no one to share their daily experiences, thoughts and plans with.

## The solution

FIDALLY combines companionship with practical daily support through a **conversation-to-action workflow**. The user talks to FIDALLY about their day or upcoming tasks. Once the user confirms, the conversation becomes a **diary entry, a task or a reminder**. Nothing is saved without the user's approval, and everything can be reviewed in the app.

### Key features

| Feature | Description |
|---|---|
| AI conversations | Natural voice interaction whenever the user wants help or someone to talk to |
| Personalised memory | Remembers user-approved details for continuity between conversations |
| Digital diary | Turns daily conversations into organised diary entries |
| Smart reminders | Manages tasks, appointments and deadlines with timely reminders |
| Modes | Study and Sleep modes |
| Mobile app | One place to manage diary entries, memories, schedules and device settings |
| Privacy controls | Local-first storage, user-controlled sharing and automatic deletion after a set period |

---

## Repository structure

```
fidally/
├── website/      # Landing page marketing website
├── backend/      # Backend API and data management
├── mobile-app/   # Companion mobile application
├── device/       # Hardware and device firmware
├── ai/           # Voice and AI conversation components
└── docs/         # Diagrams and supporting documentation
```

---

## Landing page website

The marketing website is live at **https://myfidally.com**.

```
website/
├── public/                 # The site: index.html, css/, js/, images/
├── functions/api/          # Cloudflare Pages Functions (serverless API)
│   ├── waitlist.js         #   POST /api/waitlist – saves sign-ups
│   └── health.js           #   GET  /api/health   – status check
├── server.js, mailer.js    # Optional local Node.js/Express version
└── package.json
```

| Part | Technology |
|---|---|
| Front end | HTML, CSS and JavaScript |
| Hosting | Cloudflare Pages, with HTTPS |
| Domain | `myfidally.com` (DNS on Cloudflare) |
| Waitlist API | Cloudflare Pages Functions |
| Waitlist storage | Cloudflare Workers KV |
| Welcome email | Resend |

### Deployment

The site deploys automatically:

| Action | Result |
|---|---|
| Merge a pull request into `main` | The live site updates within about a minute |
| Push to any other branch | Cloudflare builds a preview link; the live site does not change |

API keys and other secrets are stored in Cloudflare's project settings, never in this repository.

---

## Branching strategy

| Branch | Purpose |
|---|---|
| `main` | Stable, release-ready code. Protected: changes only through an approved pull request |
| `develop` | Integration branch where completed features are merged |
| `feature/<name>` | One branch per task, e.g. `feature/landing-page` |
| `fix/<name>` | Bug fixes |

### Workflow

1. Create a branch from `develop`: `git checkout develop && git pull && git checkout -b feature/<name>`
2. Commit small, clear changes, e.g. `Add reminders section to landing page`
3. Push the branch and open a **pull request** into `develop`
4. At least **one teammate reviews and approves** before merging
5. `develop` is merged into `main` at the end of each sprint

### Commit message style

Use the imperative mood and keep the summary under about 60 characters:
`Add`, `Update`, `Fix`, `Remove`, `Refactor`. For example: `Fix navbar layout on mobile`.

---

## Running the landing page locally

```bash
git clone https://github.com/Thinal-Sandiru/FIDALLY.git
cd FIDALLY/website/public
# open index.html in a browser, or serve it locally:
python3 -m http.server 8000
# then visit http://localhost:8000
```

The waitlist form needs the API, so it only works on the live site.

---

## Team

| Member | Role |
|---|---|
| Danuja Perera | Hardware integration |
| Michelle Peiris | AI and voice |
| Chamindu Wijesinghe | Mobile application |
| Thinal Sandiru | Backend and data management |
| Thisumi Kapuge | Privacy, QA and documentation |

---

*FIDALLY is intended to complement, not replace, human relationships and professional mental health support.*
