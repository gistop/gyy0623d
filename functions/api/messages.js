export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}

export async function onRequestPost({ request, env }) {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*"
  };

  try {
    if (!env.DB) {
      return Response.json({ ok: false, error: "D1 binding DB is not configured" }, { status: 500, headers });
    }

    const body = await request.json().catch(() => ({}));
    const content = String(body.content || "").trim();

    if (!content) {
      return Response.json({ ok: false, error: "Message content is required" }, { status: 400, headers });
    }

    if (content.length > 2000) {
      return Response.json({ ok: false, error: "Message content is too long" }, { status: 400, headers });
    }

    await env.DB.prepare(
      "CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT NOT NULL)"
    ).run();

    const result = await env.DB.prepare(
      "INSERT INTO messages (content) VALUES (?) RETURNING id, content"
    ).bind(content).first();

    return Response.json({ ok: true, message: result || { content } }, { headers });
  } catch (error) {
    return Response.json(
      { ok: false, error: error && error.message ? error.message : "Failed to save message" },
      { status: 500, headers }
    );
  }
}
