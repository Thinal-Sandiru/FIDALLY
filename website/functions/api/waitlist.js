// Cloudflare Pages Function: POST /api/waitlist
// Replaces the Express route in server.js when the site runs on Cloudflare.
//
// Needs (set in Cloudflare: Pages project -> Settings -> Bindings / Variables):
//   WAITLIST        KV namespace binding (required) - stores the emails
//   RESEND_API_KEY  secret (optional) - sends the welcome email via resend.com
//   MAIL_FROM       variable (optional) - e.g. "FIDALLY <hello@myfidally.com>"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export async function onRequestPost({ request, env, waitUntil }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, message: "Please enter a valid email address." }, 400);
  }

  const email = String(body?.email || "").trim().toLowerCase();
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return json({ ok: false, message: "Please enter a valid email address." }, 400);
  }

  if (!env.WAITLIST) {
    console.error("[waitlist] KV binding WAITLIST is missing");
    return json({ ok: false, message: "Server error. Please try again." }, 500);
  }

  const key = "email:" + email;
  if (await env.WAITLIST.get(key)) {
    return json({ ok: true, message: "You are already on the list: " + email });
  }

  await env.WAITLIST.put(key, JSON.stringify({ email, joinedAt: new Date().toISOString() }));

  // send in the background; a mail problem must not break signup
  if (env.RESEND_API_KEY) {
    waitUntil(
      sendWelcomeEmail(env, email).catch((err) =>
        console.error("[mail] could not send to " + email + ": " + err.message),
      ),
    );
  }

  return json({ ok: true, message: "Thank you! You are on the list: " + email });
}

export function onRequest() {
  return json({ ok: false, message: "Not found" }, 404);
}

async function sendWelcomeEmail(env, to) {
  const text =
    "Hi,\n\n" +
    "You are on the FIDALLY waitlist! Thank you for joining.\n" +
    "We will email you as soon as FIDALLY is ready to try.\n\n" +
    "FIDALLY - your faithful AI companion\n";

  const html = `
  <div style="font-family:Arial,sans-serif;background:#040a1e;padding:32px;color:#e8eeff">
    <div style="max-width:520px;margin:auto;background:#0e1c44;border:1px solid #1e3370;border-radius:16px;padding:32px">
      <h1 style="margin:0 0 12px;font-size:24px;color:#5aa2ff">You are on the list! 🎉</h1>
      <p style="line-height:1.6;color:#e8eeff">Thank you for joining the <strong>FIDALLY</strong> waitlist.</p>
      <p style="line-height:1.6;color:#9fb2dc">FIDALLY is a faithful AI companion that listens, remembers and helps. We will email you as soon as it is ready to try.</p>
      <p style="margin-top:28px;font-size:13px;color:#9fb2dc">Agile Team Project · Team CS-16</p>
    </div>
  </div>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + env.RESEND_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.MAIL_FROM || "FIDALLY <onboarding@resend.dev>",
      to: [to],
      subject: "You are on the FIDALLY waitlist 🎉",
      text,
      html,
    }),
  });
  if (!res.ok) throw new Error("Resend " + res.status + ": " + (await res.text()));
  console.log("[mail] sent to " + to);
}
