export async function onRequest(context) {
  if (context.request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { message } = await context.request.json();

    if (!message || typeof message !== "string") {
      return new Response("Missing or invalid message", { status: 400 });
    }

    await context.env.DB.prepare(
      "CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT NOT NULL)"
    ).run();

    const result = await context.env.DB.prepare(
      "INSERT INTO messages (content) VALUES (?)"
    )
      .bind(message)
      .run();

    return Response.json({
      id: result.meta.last_row_id,
    });
  } catch (err) {
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}