import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Shield } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminLoginScreen({
  loginUsername,
  setLoginUsername,
  loginPassword,
  setLoginPassword,
  handleLogin,
  loading,
}) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: "#000000" }}>
      <StatusBar style="light" backgroundColor="#000000" />
      <AdminHeader
        title="Admin Panel"
        subtitle="Administrator access required"
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 40,
          paddingBottom: insets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            backgroundColor: "#252525",
            borderWidth: 1,
            borderColor: "#404040",
            borderRadius: 12,
            padding: 24,
          }}
        >
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <Shield size={40} color="#9AFF55" />
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 18,
                color: "#FFFFFF",
                marginTop: 10,
                textAlign: "center",
              }}
            >
              Admin Login Required
            </Text>
          </View>

          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 14,
                color: "#FFFFFF",
                marginBottom: 8,
              }}
            >
              Username
            </Text>
            <TextInput
              style={{
                height: 50,
                borderWidth: 1,
                borderColor: "#404040",
                borderRadius: 12,
                paddingHorizontal: 16,
                fontFamily: "Inter_400Regular",
                fontSize: 16,
                color: "#FFFFFF",
                backgroundColor: "#000000",
              }}
              placeholder="admin"
              placeholderTextColor="#9A9A9A"
              value={loginUsername}
              onChangeText={setLoginUsername}
              autoCapitalize="none"
            />
          </View>

          <View style={{ marginBottom: 30 }}>
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 14,
                color: "#FFFFFF",
                marginBottom: 8,
              }}
            >
              Password
            </Text>
            <TextInput
              style={{
                height: 50,
                borderWidth: 1,
                borderColor: "#404040",
                borderRadius: 12,
                paddingHorizontal: 16,
                fontFamily: "Inter_400Regular",
                fontSize: 16,
                color: "#FFFFFF",
                backgroundColor: "#000000",
              }}
              placeholder="admin123"
              placeholderTextColor="#9A9A9A"
              value={loginPassword}
              onChangeText={setLoginPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={{
              height: 50,
              backgroundColor: loading ? "#5A5A5A" : "#9AFF55",
              borderRadius: 12,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 16,
                color: "#000000",
              }}
            >
              {loading ? "Logging in..." : "Access Admin Panel"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
