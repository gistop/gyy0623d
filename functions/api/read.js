export async function onRequest(context) {
  if (context.request.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    // Ensure table exists
    await context.env.DB.prepare(
      "CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT NOT NULL)"
    ).run();

    const { results } = await context.env.DB.prepare(
      "SELECT * FROM messages ORDER BY id DESC"
    ).all();

    return Response.json(results);
  } catch (err) {
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}