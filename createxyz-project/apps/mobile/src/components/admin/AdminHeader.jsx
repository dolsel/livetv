import React from "react";
import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AdminHeader({ title, subtitle }) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        paddingTop: insets.top + 20,
        paddingHorizontal: 24,
        paddingBottom: 20,
        backgroundColor: "#000000",
        borderBottomWidth: 1,
        borderBottomColor: "#404040",
      }}
    >
      <Text
        style={{
          fontFamily: "Inter_700Bold",
          fontSize: 28,
          color: "#FFFFFF",
          marginBottom: 4,
        }}
      >
        {title}
      </Text>
      {subtitle && (
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 14,
            color: "#9A9A9A",
          }}
        >
          {subtitle}
        </Text>
      )}
    </View>
  );
}
