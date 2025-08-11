import sql from "@/app/api/utils/sql";

// GET all available gifts
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    
    let gifts;
    if (category && category !== 'all') {
      gifts = await sql`SELECT * FROM gifts WHERE category = ${category} AND is_active = true ORDER BY cost ASC`;
    } else {
      gifts = await sql`SELECT * FROM gifts WHERE is_active = true ORDER BY cost ASC`;
    }

    return Response.json({ gifts });
  } catch (error) {
    console.error('Get gifts error:', error);
    return Response.json({ error: 'Failed to fetch gifts' }, { status: 500 });
  }
}

// POST create new gift
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, icon_url, cost, category } = body;

    if (!name || !icon_url) {
      return Response.json({ error: 'Gift name and icon URL are required' }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO gifts (name, icon_url, cost, category)
      VALUES (${name}, ${icon_url}, ${cost || 0}, ${category || 'general'})
      RETURNING *
    `;

    return Response.json({ success: true, gift: result[0] });
  } catch (error) {
    console.error('Create gift error:', error);
    return Response.json({ error: 'Failed to create gift' }, { status: 500 });
  }
}

// PUT update gift
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, name, icon_url, cost, category, is_active } = body;

    if (!id) {
      return Response.json({ error: 'Gift ID is required' }, { status: 400 });
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
    if (icon_url !== undefined) {
      updates.push(`icon_url = $${paramCount}`);
      values.push(icon_url);
      paramCount++;
    }
    if (cost !== undefined) {
      updates.push(`cost = $${paramCount}`);
      values.push(cost);
      paramCount++;
    }
    if (category !== undefined) {
      updates.push(`category = $${paramCount}`);
      values.push(category);
      paramCount++;
    }
    if (is_active !== undefined) {
      updates.push(`is_active = $${paramCount}`);
      values.push(is_active);
      paramCount++;
    }

    values.push(id);
    const query = `UPDATE gifts SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const result = await sql(query, values);

    if (result.length === 0) {
      return Response.json({ error: 'Gift not found' }, { status: 404 });
    }

    return Response.json({ success: true, gift: result[0] });
  } catch (error) {
    console.error('Update gift error:', error);
    return Response.json({ error: 'Failed to update gift' }, { status: 500 });
  }
}

// DELETE gift
export async function DELETE(request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return Response.json({ error: 'Gift ID is required' }, { status: 400 });
    }

    const result = await sql`DELETE FROM gifts WHERE id = ${id} RETURNING *`;

    if (result.length === 0) {
      return Response.json({ error: 'Gift not found' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Delete gift error:', error);
    return Response.json({ error: 'Failed to delete gift' }, { status: 500 });
  }
}