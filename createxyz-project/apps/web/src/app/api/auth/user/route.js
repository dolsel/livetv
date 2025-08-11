import sql from "@/app/api/utils/sql";

// GET user by ID
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('id');
    
    if (!userId) {
      return Response.json({ error: 'User ID is required' }, { status: 400 });
    }

    const users = await sql`
      SELECT id, username, profile_image, is_admin, created_at 
      FROM users 
      WHERE id = ${userId}
    `;

    if (users.length === 0) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    return Response.json({ user: users[0] });
  } catch (error) {
    console.error('Get user error:', error);
    return Response.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

// GET all users (for admin or user listing)
export async function POST(request) {
  try {
    const body = await request.json();
    const { search, exclude_user_id } = body;

    let query = 'SELECT id, username, profile_image, is_admin, created_at FROM users WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (exclude_user_id) {
      query += ` AND id != $${paramCount}`;
      values.push(exclude_user_id);
      paramCount++;
    }

    if (search) {
      query += ` AND LOWER(username) LIKE LOWER($${paramCount})`;
      values.push(`%${search}%`);
      paramCount++;
    }

    query += ' ORDER BY created_at DESC LIMIT 50';

    const users = await sql(query, values);
    return Response.json({ users });
  } catch (error) {
    console.error('List users error:', error);
    return Response.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}