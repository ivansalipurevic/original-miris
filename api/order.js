const nodemailer = require("nodemailer");

function json(res, statusCode, body) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

async function readJsonBody(req) {
  // Vercel Node functions may provide parsed req.body, but not always.
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return null;
    }
  }

  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  const raw = Buffer.concat(chunks).toString("utf8").trim();
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatKM(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "";
  return `${n.toFixed(2).replace(".", ",")} KM`;
}

function validateOrderPayload(body) {
  if (!body || typeof body !== "object") return { ok: false, error: "Invalid body" };

  const customer = body.customer;
  if (!customer || typeof customer !== "object") return { ok: false, error: "Missing customer" };

  const email = customer.email;
  if (typeof email !== "string" || !email.includes("@")) return { ok: false, error: "Invalid customer.email" };

  const fullName = typeof customer.fullName === "string" ? customer.fullName.trim() : "";
  const phone = typeof customer.phone === "string" ? customer.phone.trim() : "";
  const address = typeof customer.address === "string" ? customer.address.trim() : "";
  const city = typeof customer.city === "string" ? customer.city.trim() : "";
  const note = typeof customer.note === "string" ? customer.note.trim() : "";

  const items = Array.isArray(body.items) ? body.items : [];
  if (items.length < 1) return { ok: false, error: "Order must have at least 1 item" };

  const cleanItems = [];
  for (const it of items) {
    if (!it || typeof it !== "object") continue;
    const name = typeof it.name === "string" ? it.name.trim() : "";
    const qty = Number(it.qty);
    const priceKM = Number(it.priceKM);
    if (!name || !Number.isFinite(qty) || qty <= 0) continue;
    cleanItems.push({ name, qty: Math.floor(qty), priceKM: Number.isFinite(priceKM) ? priceKM : null });
  }
  if (cleanItems.length < 1) return { ok: false, error: "Order items invalid" };

  const totals = body.totals && typeof body.totals === "object" ? body.totals : {};
  const totalKM = Number(totals.totalKM);
  const subtotalKM = Number(totals.subtotalKM);
  const discountKM = Number(totals.discountKM);

  return {
    ok: true,
    value: {
      customer: { email, fullName, phone, address, city, note },
      items: cleanItems,
      totals: {
        subtotalKM: Number.isFinite(subtotalKM) ? subtotalKM : null,
        discountKM: Number.isFinite(discountKM) ? discountKM : null,
        totalKM: Number.isFinite(totalKM) ? totalKM : null,
      },
    },
  };
}

function renderAdminText(order) {
  const lines = [];
  lines.push("Nova narudžba:");
  lines.push("");
  lines.push(`Kupac: ${order.customer.fullName || "(nije uneseno)"}`);
  lines.push(`Email: ${order.customer.email}`);
  if (order.customer.phone) lines.push(`Telefon: ${order.customer.phone}`);
  if (order.customer.address || order.customer.city) lines.push(`Adresa: ${order.customer.address} ${order.customer.city}`.trim());
  if (order.customer.note) lines.push(`Napomena: ${order.customer.note}`);
  lines.push("");
  lines.push("Stavke:");
  for (const it of order.items) {
    lines.push(`- ${it.name} x${it.qty}${it.priceKM == null ? "" : ` (${formatKM(it.priceKM)})`}`);
  }
  if (order.totals.totalKM != null) {
    lines.push("");
    if (order.totals.subtotalKM != null) lines.push(`Subtotal: ${formatKM(order.totals.subtotalKM)}`);
    if (order.totals.discountKM != null) lines.push(`Popust: ${formatKM(order.totals.discountKM)}`);
    lines.push(`Ukupno: ${formatKM(order.totals.totalKM)}`);
  }
  return lines.join("\n");
}

function renderCustomerHtml(order) {
  const itemsHtml = order.items
    .map((it) => {
      const price = it.priceKM == null ? "" : ` <span style="color:#666">(${escapeHtml(formatKM(it.priceKM))})</span>`;
      return `<li>${escapeHtml(it.name)} <strong>x${escapeHtml(it.qty)}</strong>${price}</li>`;
    })
    .join("");

  const totalsHtml =
    order.totals.totalKM == null
      ? ""
      : `<p style="margin:12px 0 0 0">
            ${order.totals.subtotalKM != null ? `<div>Subtotal: <strong>${escapeHtml(formatKM(order.totals.subtotalKM))}</strong></div>` : ""}
            ${order.totals.discountKM != null ? `<div>Popust: <strong>${escapeHtml(formatKM(order.totals.discountKM))}</strong></div>` : ""}
            <div>Ukupno: <strong>${escapeHtml(formatKM(order.totals.totalKM))}</strong></div>
          </p>`;

  return `<!doctype html>
  <html>
    <body style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; line-height:1.5; color:#111">
      <h2 style="margin:0 0 8px 0">Hvala na narudžbi</h2>
      <p style="margin:0 0 12px 0">Primili smo tvoju narudžbu. Javićemo se uskoro sa detaljima isporuke.</p>
      <h3 style="margin:16px 0 8px 0">Stavke</h3>
      <ul style="margin:0; padding-left:18px">${itemsHtml}</ul>
      ${totalsHtml}
      <hr style="margin:20px 0; border:none; border-top:1px solid #eee" />
      <p style="margin:0; color:#666; font-size:12px">Ako imaš pitanje, odgovori na ovaj email.</p>
    </body>
  </html>`;
}

module.exports = async (req, res) => {
  try {
    if (req.method !== "POST") return json(res, 405, { ok: false, error: "Method not allowed" });

    const body = await readJsonBody(req);
    const parsed = validateOrderPayload(body);
    if (!parsed.ok) return json(res, 400, { ok: false, error: parsed.error });
    const order = parsed.value;

    // SMTP settings
    // - Preferred: SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS (+ SMTP_SECURE=true for 465)
    // - Backwards compat: MAILTRAP_* (dev inbox)
    const host = process.env.SMTP_HOST || process.env.MAILTRAP_HOST;
    const port = Number(process.env.SMTP_PORT || process.env.MAILTRAP_PORT || 587);
    const secure =
      String(process.env.SMTP_SECURE || "").toLowerCase() === "true" ? true : port === 465;
    const user = process.env.SMTP_USER || process.env.MAILTRAP_USER;
    const pass = process.env.SMTP_PASS || process.env.MAILTRAP_PASS;
    const from = process.env.MAIL_FROM;
    const adminTo = process.env.ADMIN_EMAIL_TO;

    if (!host || !user || !pass || !from || !adminTo) {
      return json(res, 500, {
        ok: false,
        error: "Missing email env vars",
        missing: {
          SMTP_HOST: !host,
          SMTP_USER: !user,
          SMTP_PASS: !pass,
          MAIL_FROM: !from,
          ADMIN_EMAIL_TO: !adminTo,
        },
      });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });

    const subject = "Potvrda narudžbine — Original Miris";
    const adminSubject = `Nova narudžba — ${order.customer.email}`;

    await transporter.sendMail({
      from,
      to: order.customer.email,
      replyTo: from,
      subject,
      html: renderCustomerHtml(order),
      text: renderAdminText(order),
    });

    await transporter.sendMail({
      from,
      to: adminTo,
      replyTo: order.customer.email,
      subject: adminSubject,
      text: renderAdminText(order),
    });

    return json(res, 200, { ok: true });
  } catch (err) {
    return json(res, 500, { ok: false, error: err instanceof Error ? err.message : "Unknown error" });
  }
};

