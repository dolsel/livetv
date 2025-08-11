import sql from "@/app/api/utils/sql";

// GET all active banners
export async function GET(request) {
  try {
    const banners = await sql`SELECT * FROM banners WHERE is_active = true ORDER BY display_order ASC, created_at DESC`;
    return Response.json({ banners });
  } catch (error) {
    console.error('Get banners error:', error);
    return Response.json({ error: 'Failed to fetch banners' }, { status: 500 });
  }
}

// POST create new banner
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, image_url, display_order, is_active } = body;

    if (!image_url) {
      return Response.json({ error: 'Image URL is required' }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO banners (title, image_url, display_order, is_active)
      VALUES (${title || ''}, ${image_url}, ${display_order || 0}, ${is_active !== undefined ? is_active : true})
      RETURNING *
    `;

    return Response.json({ success: true, banner: result[0] });
  } catch (error) {
    console.error('Create banner error:', error);
    return Response.json({ error: 'Failed to create banner' }, { status: 500 });
  }
}

// PUT update banner
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, title, image_url, display_order, is_active } = body;

    if (!id) {
      return Response.json({ error: 'Banner ID is required' }, { status: 400 });
    }

    // Build dynamic update query
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (title !== undefined) {
      updates.push(`title = $${paramCount}`);
      values.push(title);
      paramCount++;
    }
    if (image_url !== undefined) {
      updates.push(`image_url = $${paramCount}`);
      values.push(image_url);
      paramCount++;
    }
    if (display_order !== undefined) {
      updates.push(`display_order = $${paramCount}`);
      values.push(display_order);
      paramCount++;
    }
    if (is_active !== undefined) {
      updates.push(`is_active = $${paramCount}`);
      values.push(is_active);
      paramCount++;
    }

    values.push(id);
    const query = `UPDATE banners SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const result = await sql(query, values);

    if (result.length === 0) {
      return Response.json({ error: 'Banner not found' }, { status: 404 });
    }

    return Response.json({ success: true, banner: result[0] });
  } catch (error) {
    console.error('Update banner error:', error);
    return Response.json({ error: 'Failed to update banner' }, { status: 500 });
  }
}

// DELETE banner
export async function DELETE(request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return Response.json({ error: 'Banner ID is required' }, { status: 400 });
    }

    const result = await sql`DELETE FROM banners WHERE id = ${id} RETURNING *`;

    if (result.length === 0) {
      return Response.json({ error: 'Banner not found' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Delete banner error:', error);
    return Response.json({ error: 'Failed to delete banner' }, { status: 500 });
  }
}