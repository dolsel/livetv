import sql from "@/app/api/utils/sql";

// GET private messages between users
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('user_id');
    const otherUserId = url.searchParams.get('other_user_id');
    const limit = url.searchParams.get('limit') || 50;
    
    if (!userId || !otherUserId) {
      return Response.json({ error: 'User ID and other user ID are required' }, { status: 400 });
    }

    const messages = await sql`
      SELECT 
        pm.id,
        pm.message,
        pm.message_type,
        pm.gift_type,
        pm.is_read,
        pm.created_at,
        sender.username as sender_username,
        sender.profile_image as sender_profile_image,
        sender.id as sender_id,
        recipient.username as recipient_username,
        recipient.profile_image as recipient_profile_image,
        recipient.id as recipient_id
      FROM private_messages pm
      JOIN users sender ON pm.sender_id = sender.id
      JOIN users recipient ON pm.recipient_id = recipient.id
      WHERE (pm.sender_id = ${userId} AND pm.recipient_id = ${otherUserId})
         OR (pm.sender_id = ${otherUserId} AND pm.recipient_id = ${userId})
      ORDER BY pm.created_at DESC
      LIMIT ${limit}
    `;

    // Mark messages as read
    await sql`
      UPDATE private_messages 
      SET is_read = true 
      WHERE recipient_id = ${userId} AND sender_id = ${otherUserId} AND is_read = false
    `;

    return Response.json({ messages: messages.reverse() });
  } catch (error) {
    console.error('Get private messages error:', error);
    return Response.json({ error: 'Failed to fetch private messages' }, { status: 500 });
  }
}

// POST send private message
export async function POST(request) {
  try {
    const body = await request.json();
    const { sender_id, recipient_id, message, message_type = 'text', gift_type } = body;

    if (!sender_id || !recipient_id || !message) {
      return Response.json({ error: 'Sender ID, recipient ID, and message are required' }, { status: 400 });
    }

    // Verify users exist
    const users = await sql`SELECT id FROM users WHERE id IN (${sender_id}, ${recipient_id})`;
    if (users.length !== 2) {
      return Response.json({ error: 'One or both users not found' }, { status: 404 });
    }

    const result = await sql`
      INSERT INTO private_messages (sender_id, recipient_id, message, message_type, gift_type)
      VALUES (${sender_id}, ${recipient_id}, ${message}, ${message_type}, ${gift_type})
      RETURNING *
    `;

    // Get user info for response
    const userInfo = await sql`
      SELECT u1.username as sender_username, u1.profile_image as sender_profile_image,
             u2.username as recipient_username, u2.profile_image as recipient_profile_image
      FROM users u1, users u2 
      WHERE u1.id = ${sender_id} AND u2.id = ${recipient_id}
    `;

    return Response.json({ 
      success: true, 
      message: {
        ...result[0],
        sender_username: userInfo[0].sender_username,
        sender_profile_image: userInfo[0].sender_profile_image,
        recipient_username: userInfo[0].recipient_username,
        recipient_profile_image: userInfo[0].recipient_profile_image
      }
    });
  } catch (error) {
    console.error('Send private message error:', error);
    return Response.json({ error: 'Failed to send private message' }, { status: 500 });
  }
}