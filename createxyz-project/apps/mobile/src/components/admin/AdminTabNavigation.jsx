import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  RefreshCw,
  Image as ImageIcon,
  Tv,
} from "lucide-react-native";

const tabs = [
  { id: "channels", title: "Channels", icon: Tv },
  { id: "banners", title: "Banners", icon: ImageIcon },
  { id: "sync", title: "Server Sync", icon: RefreshCw },
];

export default function AdminTabNavigation({ activeTab, setActiveTab }) {
  return (
    <View
      style={{
        paddingVertical: 15,
        paddingHorizontal: 24,
        backgroundColor: "#000000",
      }}
    >
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={{
                backgroundColor: isActive ? "#9AFF55" : "#252525",
                borderWidth: 1,
                borderColor: isActive ? "#9AFF55" : "#404040",
                borderRadius: 20,
                paddingHorizontal: 16,
                paddingVertical: 8,
                marginRight: 12,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <IconComponent
                size={16}
                color={isActive ? "#000000" : "#FFFFFF"}
                style={{ marginRight: 6 }}
              />
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 14,
                  color: isActive ? "#000000" : "#FFFFFF",
                }}
              >
                {tab.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
