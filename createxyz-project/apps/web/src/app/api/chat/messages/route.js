import sql from "@/app/api/utils/sql";

// GET chat messages for a channel
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const channelId = url.searchParams.get('channel_id');
    const limit = url.searchParams.get('limit') || 50;
    
    if (!channelId) {
      return Response.json({ error: 'Channel ID is required' }, { status: 400 });
    }

    const messages = await sql`
      SELECT 
        cm.id,
        cm.message,
        cm.message_type,
        cm.gift_type,
        cm.created_at,
        u.username,
        u.profile_image,
        u.id as user_id
      FROM chat_messages cm
      JOIN users u ON cm.user_id = u.id
      WHERE cm.channel_id = ${channelId}
      ORDER BY cm.created_at DESC
      LIMIT ${limit}
    `;

    return Response.json({ messages: messages.reverse() });
  } catch (error) {
    console.error('Get chat messages error:', error);
    return Response.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

// POST send new chat message
export async function POST(request) {
  try {
    const body = await request.json();
    const { channel_id, user_id, message, message_type = 'text', gift_type } = body;

    if (!channel_id || !user_id || !message) {
      return Response.json({ error: 'Channel ID, user ID, and message are required' }, { status: 400 });
    }

    // Verify user exists
    const users = await sql`SELECT id FROM users WHERE id = ${user_id}`;
    if (users.length === 0) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify channel exists
    const channels = await sql`SELECT id FROM channels WHERE id = ${channel_id}`;
    if (channels.length === 0) {
      return Response.json({ error: 'Channel not found' }, { status: 404 });
    }

    const result = await sql`
      INSERT INTO chat_messages (channel_id, user_id, message, message_type, gift_type)
      VALUES (${channel_id}, ${user_id}, ${message}, ${message_type}, ${gift_type})
      RETURNING *
    `;

    // Update user activity
    await sql`
      INSERT INTO user_channel_activity (user_id, channel_id, last_seen, is_online)
      VALUES (${user_id}, ${channel_id}, CURRENT_TIMESTAMP, true)
      ON CONFLICT (user_id, channel_id) 
      DO UPDATE SET last_seen = CURRENT_TIMESTAMP, is_online = true
    `;

    // Get user info for response
    const userInfo = await sql`SELECT username, profile_image FROM users WHERE id = ${user_id}`;

    return Response.json({ 
      success: true, 
      message: {
        ...result[0],
        username: userInfo[0].username,
        profile_image: userInfo[0].profile_image
      }
    });
  } catch (error) {
    console.error('Send message error:', error);
    return Response.json({ error: 'Failed to send message' }, { status: 500 });
  }
}