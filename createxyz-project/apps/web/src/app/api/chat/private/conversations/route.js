import sql from "@/app/api/utils/sql";

// GET conversations for a user
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('user_id');
    
    if (!userId) {
      return Response.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Get recent conversations with last message and unread count
    const conversations = await sql`
      WITH conversation_data AS (
        SELECT 
          CASE 
            WHEN pm.sender_id = ${userId} THEN pm.recipient_id 
            ELSE pm.sender_id 
          END as other_user_id,
          pm.message as last_message,
          pm.created_at as last_message_time,
          ROW_NUMBER() OVER (
            PARTITION BY CASE 
              WHEN pm.sender_id = ${userId} THEN pm.recipient_id 
              ELSE pm.sender_id 
            END 
            ORDER BY pm.created_at DESC
          ) as rn
        FROM private_messages pm
        WHERE pm.sender_id = ${userId} OR pm.recipient_id = ${userId}
      ),
      unread_counts AS (
        SELECT 
          sender_id as other_user_id,
          COUNT(*) as unread_count
        FROM private_messages 
        WHERE recipient_id = ${userId} AND is_read = false
        GROUP BY sender_id
      )
      SELECT 
        cd.other_user_id,
        cd.last_message,
        cd.last_message_time,
        u.username as other_user_name,
        u.profile_image as other_user_profile_image,
        COALESCE(uc.unread_count, 0) as unread_count
      FROM conversation_data cd
      JOIN users u ON cd.other_user_id = u.id
      LEFT JOIN unread_counts uc ON cd.other_user_id = uc.other_user_id
      WHERE cd.rn = 1
      ORDER BY cd.last_message_time DESC
    `;

    return Response.json({ conversations });
  } catch (error) {
    console.error('Get conversations error:', error);
    return Response.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}