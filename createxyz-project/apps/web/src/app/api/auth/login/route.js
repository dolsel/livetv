import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return Response.json({ error: 'Username and password are required' }, { status: 400 });
    }

    // Check user credentials
    const users = await sql`SELECT * FROM users WHERE username = ${username} AND password = ${password}`;
    
    if (users.length === 0) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = users[0];
    
    return Response.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        profile_image: user.profile_image,
        is_admin: user.is_admin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return Response.json({ error: 'Login failed' }, { status: 500 });
  }
}