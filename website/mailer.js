const nodemailer = require("nodemailer");

const { EMAIL_USER, EMAIL_PASS } = process.env;
const configured = Boolean(EMAIL_USER && EMAIL_PASS);

const transporter = configured
  ? nodemailer.createTransport({
      service: "gmail",
      auth: { user: EMAIL_USER, pass: EMAIL_PASS },
    })
  : null;

if (transporter) {
  transporter.verify().then(
    () => console.log("[mail] Gmail login OK - emails will be sent from " + EMAIL_USER),
    (err) => console.error("[mail] Gmail login FAILED: " + err.message),
  );
}

if (!configured) {
  console.warn(
    "[mail] EMAIL_USER / EMAIL_PASS not set in .env - confirmation emails are disabled.",
  );
}

async function sendWelcomeEmail(to) {
  if (!transporter) return false;

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

  const info = await transporter.sendMail({
    from: '"FIDALLY" <' + EMAIL_USER + ">",
    to,
    subject: "You are on the FIDALLY waitlist 🎉",
    text,
    html,
  });
  console.log("[mail] sent to " + to + " (" + info.response + ")");
  return true;
}

module.exports = { sendWelcomeEmail };