import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Edit, Trash2 } from "lucide-react-native";

export default function BannerListItem({ item, onEdit, onDelete }) {
  return (
    <View
      style={{
        backgroundColor: "#252525",
        borderWidth: 1,
        borderColor: "#404040",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
      }}
    >
      <Image
        source={{ uri: item.image_url }}
        style={{
          width: "100%",
          height: 80,
          borderRadius: 8,
          backgroundColor: "#404040",
          marginBottom: 12,
        }}
        contentFit="cover"
        transition={100}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 14,
              color: "#FFFFFF",
              marginBottom: 2,
            }}
          >
            {item.title || "Untitled Banner"}
          </Text>
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 12,
              color: "#9A9A9A",
            }}
          >
            Order: {item.display_order}
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
    </View>
  );
}
