import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Edit, Trash2 } from "lucide-react-native";

export default function GiftListItem({ item, onEdit, onDelete }) {
  const getCategoryColor = (category) => {
    switch (category) {
      case 'romantic': return '#FF69B4';
      case 'special': return '#FFD700';
      case 'premium': return '#9C27B0';
      case 'energy': return '#FF5722';
      default: return '#9A9A9A';
    }
  };

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
      {/* Gift Icon */}
      <Image
        source={{ uri: item.icon_url || 'https://via.placeholder.com/50x50/404040/white?text=🎁' }}
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: "#404040",
          marginRight: 16,
        }}
        contentFit="cover"
        transition={100}
      />

      {/* Gift Info */}
      <View style={{ flex: 1 }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 4
        }}>
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 16,
              color: "#FFFFFF",
              flex: 1,
            }}
          >
            {item.name}
          </Text>
          
          <Text
            style={{
              fontFamily: "Inter_700Bold",
              fontSize: 14,
              color: "#9AFF55",
            }}
          >
            {item.cost} نقطة
          </Text>
        </View>

        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Category Tag */}
          <View style={{
            backgroundColor: getCategoryColor(item.category),
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 6
          }}>
            <Text style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 12,
              color: "#FFFFFF"
            }}>{item.category}</Text>
          </View>

          {/* Status */}
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 12,
              color: item.is_active ? "#9AFF55" : "#FF6B6B",
            }}
          >
            {item.is_active ? "Active" : "Inactive"}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={{ flexDirection: "row", marginLeft: 12 }}>
        <TouchableOpacity
          style={{
            backgroundColor: "#404040",
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