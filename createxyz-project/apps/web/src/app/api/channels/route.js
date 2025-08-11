import sql from "@/app/api/utils/sql";

// GET all channels
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const id = url.searchParams.get("id");

    let channels;
    if (id) {
      // Get specific channel by ID
      channels =
        await sql`SELECT * FROM channels WHERE id = ${id} AND is_active = true`;
    } else if (category && category !== "all") {
      channels =
        await sql`SELECT * FROM channels WHERE category = ${category} AND is_active = true ORDER BY created_at DESC`;
    } else {
      channels =
        await sql`SELECT * FROM channels WHERE is_active = true ORDER BY created_at DESC`;
    }

    return Response.json({ channels });
  } catch (error) {
    console.error("Get channels error:", error);
    return Response.json(
      { error: "Failed to fetch channels" },
      { status: 500 },
    );
  }
}

// POST create new channel
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      icon_url,
      category,
      user_count,
      country_code,
      stream_url,
    } = body;

    if (!name) {
      return Response.json(
        { error: "Channel name is required" },
        { status: 400 },
      );
    }

    const result = await sql`
      INSERT INTO channels (name, description, icon_url, category, user_count, country_code, stream_url)
      VALUES (${name}, ${description || ""}, ${icon_url || ""}, ${category || "Game"}, ${user_count || 0}, ${country_code || "US"}, ${stream_url || ""})
      RETURNING *
    `;

    return Response.json({ success: true, channel: result[0] });
  } catch (error) {
    console.error("Create channel error:", error);
    return Response.json(
      { error: "Failed to create channel" },
      { status: 500 },
    );
  }
}

// PUT update channel
export async function PUT(request) {
  try {
    const body = await request.json();
    const {
      id,
      name,
      description,
      icon_url,
      category,
      user_count,
      country_code,
      stream_url,
      is_active,
    } = body;

    if (!id) {
      return Response.json(
        { error: "Channel ID is required" },
        { status: 400 },
      );
    }

    // Build dynamic update query
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCount}`);
      values.push(name);
      paramCount++;
    }
    if (description !== undefined) {
      updates.push(`description = $${paramCount}`);
      values.push(description);
      paramCount++;
    }
    if (icon_url !== undefined) {
      updates.push(`icon_url = $${paramCount}`);
      values.push(icon_url);
      paramCount++;
    }
    if (category !== undefined) {
      updates.push(`category = $${paramCount}`);
      values.push(category);
      paramCount++;
    }
    if (user_count !== undefined) {
      updates.push(`user_count = $${paramCount}`);
      values.push(user_count);
      paramCount++;
    }
    if (country_code !== undefined) {
      updates.push(`country_code = $${paramCount}`);
      values.push(country_code);
      paramCount++;
    }
    if (stream_url !== undefined) {
      updates.push(`stream_url = $${paramCount}`);
      values.push(stream_url);
      paramCount++;
    }
    if (is_active !== undefined) {
      updates.push(`is_active = $${paramCount}`);
      values.push(is_active);
      paramCount++;
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `UPDATE channels SET ${updates.join(", ")} WHERE id = $${paramCount} RETURNING *`;
    const result = await sql(query, values);

    if (result.length === 0) {
      return Response.json({ error: "Channel not found" }, { status: 404 });
    }

    return Response.json({ success: true, channel: result[0] });
  } catch (error) {
    console.error("Update channel error:", error);
    return Response.json(
      { error: "Failed to update channel" },
      { status: 500 },
    );
  }
}

// DELETE channel
export async function DELETE(request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return Response.json(
        { error: "Channel ID is required" },
        { status: 400 },
      );
    }

    const result = await sql`DELETE FROM channels WHERE id = ${id} RETURNING *`;

    if (result.length === 0) {
      return Response.json({ error: "Channel not found" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Delete channel error:", error);
    return Response.json(
      { error: "Failed to delete channel" },
      { status: 500 },
    );
  }
}
