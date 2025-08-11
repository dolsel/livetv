import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Edit, Trash2 } from "lucide-react-native";

export default function ChannelListItem({ item, onEdit, onDelete }) {
  return (
    <View
      style={{
        backgroundColor: "#252525",
        borderWidth: 1,
        borderColor: "#404040",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Image
        source={{
          uri:
            item.icon_url ||
            "https://via.placeholder.com/50x50/404040/white?text=CH",
        }}
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: "#404040",
          marginRight: 12,
        }}
        contentFit="cover"
        transition={100}
      />
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: "Inter_600SemiBold",
            fontSize: 14,
            color: "#FFFFFF",
            marginBottom: 2,
          }}
        >
          {item.name}
        </Text>
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 12,
            color: "#9A9A9A",
          }}
        >
          {item.category} • {item.user_count} users
        </Text>
      </View>
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          style={{
            backgroundColor: "#45B7D1",
            padding: 8,
            borderRadius: 6,
            marginRight: 8,
          }}
          onPress={() => onEdit(item)}
        >
          <Edit size={16} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: "#FF6B6B",
            padding: 8,
            borderRadius: 6,
          }}
          onPress={() => onDelete(item)}
        >
          <Trash2 size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
