import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { RefreshCw } from "lucide-react-native";

export default function SyncTabContent({ handleSync, loading }) {
  return (
    <View>
      <View
        style={{
          backgroundColor: "#252525",
          borderWidth: 1,
          borderColor: "#404040",
          borderRadius: 12,
          padding: 20,
          marginBottom: 20,
          alignItems: "center",
        }}
      >
        <RefreshCw size={40} color="#9AFF55" />
        <Text
          style={{
            fontFamily: "Inter_600SemiBold",
            fontSize: 18,
            color: "#FFFFFF",
            marginTop: 10,
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          Server Synchronization
        </Text>
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 14,
            color: "#9A9A9A",
            textAlign: "center",
            marginBottom: 20,
            lineHeight: 20,
          }}
        >
          Sync channels from the external server{"\n"}s1.shortdns.xyz:80
        </Text>

        <TouchableOpacity
          style={{
            backgroundColor: loading ? "#5A5A5A" : "#9AFF55",
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 8,
            flexDirection: "row",
            alignItems: "center",
          }}
          onPress={handleSync}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator
              size="small"
              color="#000000"
              style={{ marginRight: 8 }}
            />
          ) : (
            <RefreshCw size={16} color="#000000" style={{ marginRight: 8 }} />
          )}
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 14,
              color: "#000000",
            }}
          >
            {loading ? "Syncing..." : "Sync from Server"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
