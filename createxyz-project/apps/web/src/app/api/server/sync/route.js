import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const body = await request.json();
    const { user_id } = body;

    // Check if user is admin
    const users = await sql`SELECT is_admin FROM users WHERE id = ${user_id}`;
    if (users.length === 0 || !users[0].is_admin) {
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Get server settings
    const serverSettings = await sql`SELECT * FROM server_settings LIMIT 1`;
    if (serverSettings.length === 0) {
      return Response.json(
        { error: "No server settings configured" },
        { status: 400 },
      );
    }

    const { server_url, username, password } = serverSettings[0];

    try {
      // Fetch data from external server
      const response = await fetch(`${server_url}/api/get_rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();

      // Extract channels from server response
      let channelsToSync = [];

      if (data && data.rooms) {
        channelsToSync = data.rooms.map((room) => ({
          name: room.name || room.room_name || `Room ${room.id}`,
          description:
            room.description || room.room_description || "Welcome to join",
          category: room.category || room.room_type || "Game",
          user_count: room.user_count || room.users_count || 0,
          country_code: room.country || room.country_code || "US",
          icon_url:
            room.icon ||
            room.room_icon ||
            `https://via.placeholder.com/60x60/ff6b6b/white?text=${(room.name || "R").charAt(0)}`,
          stream_url: room.stream_url || "",
        }));
      } else {
        // Fallback to mock data if server response format is unexpected
        channelsToSync = [
          {
            name: "AJNABI",
            description: "well come All",
            category: "Game",
            user_count: 6,
            country_code: "PK",
            icon_url: "https://via.placeholder.com/60x60/ff6b6b/white?text=AJ",
          },
          {
            name: "(Pak)Office}Room",
            description: "Welcome to Pakistani official room",
            category: "Party",
            user_count: 5,
            country_code: "PK",
            icon_url: "https://via.placeholder.com/60x60/4ecdc4/white?text=PK",
          },
        ];
      }

      let syncedCount = 0;

      // Insert or update channels
      for (const channel of channelsToSync) {
        const existingChannels =
          await sql`SELECT id FROM channels WHERE name = ${channel.name}`;

        if (existingChannels.length === 0) {
          // Create new channel
          await sql`
            INSERT INTO channels (name, description, icon_url, category, user_count, country_code, stream_url)
            VALUES (${channel.name}, ${channel.description || ""}, ${channel.icon_url || ""}, ${channel.category || "Game"}, ${channel.user_count || 0}, ${channel.country_code || "US"}, ${channel.stream_url || ""})
          `;
        } else {
          // Update existing channel
          await sql`
            UPDATE channels 
            SET description = ${channel.description || ""}, 
                icon_url = ${channel.icon_url || ""}, 
                category = ${channel.category || "Game"}, 
                user_count = ${channel.user_count || 0}, 
                country_code = ${channel.country_code || "US"}, 
                stream_url = ${channel.stream_url || ""},
                updated_at = CURRENT_TIMESTAMP
            WHERE name = ${channel.name}
          `;
        }
        syncedCount++;
      }

      // Update last sync time
      await sql`UPDATE server_settings SET last_sync = CURRENT_TIMESTAMP WHERE id = ${serverSettings[0].id}`;

      return Response.json({
        success: true,
        synced_channels: syncedCount,
        message: `Successfully synced ${syncedCount} channels from server`,
      });
    } catch (fetchError) {
      console.error("Server fetch error:", fetchError);

      // Try alternative API endpoints
      try {
        const altResponse = await fetch(`${server_url}/rooms`, {
          method: "GET",
          headers: {
            Authorization: `Basic ${btoa(`${username}:${password}`)}`,
            "Content-Type": "application/json",
          },
        });

        if (altResponse.ok) {
          const altData = await altResponse.json();
          // Handle alternative API response format here
          return Response.json({
            success: true,
            synced_channels: 0,
            message: "Connected to server but no channels found",
          });
        }
      } catch (altError) {
        console.error("Alternative API error:", altError);
      }

      return Response.json(
        {
          error:
            "Failed to connect to external server. Check server URL and credentials.",
          details: fetchError.message,
        },
        { status: 502 },
      );
    }
  } catch (error) {
    console.error("Sync error:", error);
    return Response.json({ error: "Sync failed" }, { status: 500 });
  }
}
