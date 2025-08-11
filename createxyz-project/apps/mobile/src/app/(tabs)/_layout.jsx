import { Tabs } from "expo-router";
import {
  Home,
  Settings,
  User,
  Shield,
  MessageCircle,
} from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#000000",
          borderTopWidth: 1,
          borderColor: "#404040",
          paddingTop: 4,
        },
        tabBarActiveTintColor: "#9AFF55",
        tabBarInactiveTintColor: "#6B6B6B",
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Channels",
          tabBarIcon: ({ color, size }) => <Home color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarIcon: ({ color, size }) => (
            <MessageCircle color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <User color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="admin"
        options={{
          title: "Admin",
          tabBarIcon: ({ color, size }) => <Shield color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="channel/[id]"
        options={{
          href: null, // Hidden from tab bar
        }}
      />
      <Tabs.Screen
        name="chat/[userId]"
        options={{
          href: null, // Hidden from tab bar
        }}
      />
    </Tabs>
  );
}
