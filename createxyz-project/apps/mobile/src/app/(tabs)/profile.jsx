import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { useFonts } from "expo-font";
import { User, Camera, Save, MessageCircle, Search } from "lucide-react-native";
import useUpload from "@/utils/useUpload";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // User discovery for messaging
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showUserSearch, setShowUserSearch] = useState(false);

  const [upload, { loading: uploading }] = useUpload();

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const handleLogin = async () => {
    if (!loginUsername || !loginPassword) {
      Alert.alert("Error", "Please enter username and password");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginUsername,
          password: loginPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        setUsername(data.user.username);
        setProfileImage(data.user.profile_image);
        setIsLoggedIn(true);
        Alert.alert("Success", "Logged in successfully!");
      } else {
        Alert.alert("Error", data.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setLoginUsername("");
    setLoginPassword("");
    setUsername("");
    setProfileImage(null);
    setSelectedImage(null);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  const searchUsers = async (query) => {
    if (!query.trim() || !user?.id) return;

    try {
      const response = await fetch("/api/auth/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          search: query,
          exclude_user_id: user.id,
        }),
      });

      if (!response.ok) return;
      const data = await response.json();
      setSearchResults(data.users || []);
    } catch (error) {
      console.error("Search users error:", error);
    }
  };

  const handleUserSearch = (query) => {
    setSearchQuery(query);
    if (query.length > 2) {
      searchUsers(query);
    } else {
      setSearchResults([]);
    }
  };

  const startPrivateChat = (otherUser) => {
    router.push(`/(tabs)/chat/${otherUser.id}`);
  };

  const saveProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      let imageUrl = profileImage;

      // Upload new image if selected
      if (selectedImage) {
        const uploadResult = await upload({ reactNativeAsset: selectedImage });
        if (uploadResult.error) {
          Alert.alert("Error", "Failed to upload image");
          return;
        }
        imageUrl = uploadResult.url;
      }

      // For demo purposes, just show success
      // In a real app, you'd call an API to update the user profile
      setProfileImage(imageUrl);
      setSelectedImage(null);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error("Save error:", error);
      Alert.alert("Error", "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  if (!isLoggedIn) {
    return (
      <View style={{ flex: 1, backgroundColor: "#000000" }}>
        <StatusBar style="light" backgroundColor="#000000" />

        {/* Header */}
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
            Login
          </Text>
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 14,
              color: "#9A9A9A",
            }}
          >
            Sign in to your account
          </Text>
        </View>

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
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 18,
                color: "#FFFFFF",
                marginBottom: 20,
                textAlign: "center",
              }}
            >
              Account Login
            </Text>

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
                placeholder="Enter username"
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
                placeholder="Enter password"
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
                {loading ? "Logging in..." : "Login"}
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              backgroundColor: "#252525",
              borderWidth: 1,
              borderColor: "#404040",
              borderRadius: 12,
              padding: 16,
              marginTop: 20,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 14,
                color: "#9A9A9A",
                textAlign: "center",
                lineHeight: 20,
              }}
            >
              Demo credentials:{"\n"}Admin: admin / admin123{"\n"}Or create your
              own account
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#000000" }}>
      <StatusBar style="light" backgroundColor="#000000" />

      {/* Header */}
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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 28,
                color: "#FFFFFF",
                marginBottom: 4,
              }}
            >
              Profile
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 14,
                color: "#9A9A9A",
              }}
            >
              Manage your account
            </Text>
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: "#FF6B6B",
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 8,
            }}
            onPress={handleLogout}
          >
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 12,
                color: "#FFFFFF",
              }}
            >
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 40,
          paddingBottom: insets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Info Card */}
        <View
          style={{
            backgroundColor: "#252525",
            borderWidth: 1,
            borderColor: "#404040",
            borderRadius: 12,
            padding: 24,
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          {/* Profile Image */}
          <TouchableOpacity
            onPress={pickImage}
            style={{ position: "relative" }}
          >
            <Image
              source={{
                uri:
                  selectedImage?.uri ||
                  profileImage ||
                  "https://via.placeholder.com/120x120/404040/white?text=U",
              }}
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: "#404040",
                marginBottom: 16,
              }}
              contentFit="cover"
              transition={100}
            />
            <View
              style={{
                position: "absolute",
                bottom: 20,
                right: 5,
                backgroundColor: "#9AFF55",
                width: 32,
                height: 32,
                borderRadius: 16,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Camera size={16} color="#000000" />
            </View>
          </TouchableOpacity>

          <Text
            style={{
              fontFamily: "Inter_700Bold",
              fontSize: 20,
              color: "#FFFFFF",
              marginBottom: 4,
            }}
          >
            {username}
          </Text>

          {user?.is_admin && (
            <View
              style={{
                backgroundColor: "#9AFF55",
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderRadius: 12,
                marginBottom: 16,
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 12,
                  color: "#000000",
                }}
              >
                Admin
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={{
              backgroundColor: loading || uploading ? "#5A5A5A" : "#9AFF55",
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 8,
              flexDirection: "row",
              alignItems: "center",
            }}
            onPress={saveProfile}
            disabled={loading || uploading}
          >
            <Save size={16} color="#000000" style={{ marginRight: 8 }} />
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 14,
                color: "#000000",
              }}
            >
              {loading || uploading ? "Saving..." : "Save Profile"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* User Search & Messaging */}
        <View
          style={{
            backgroundColor: "#252525",
            borderWidth: 1,
            borderColor: "#404040",
            borderRadius: 12,
            padding: 20,
            marginBottom: 24,
          }}
        >
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 18,
              color: "#FFFFFF",
              marginBottom: 16,
            }}
          >
            العثور على المستخدمين
          </Text>

          {/* Search Input */}
          <View
            style={{
              backgroundColor: "#000000",
              borderRadius: 12,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 15,
              paddingVertical: 12,
              borderWidth: 1,
              borderColor: "#404040",
              marginBottom: 16,
            }}
          >
            <Search size={20} color="#9AFF55" />
            <TextInput
              style={{
                flex: 1,
                marginLeft: 10,
                color: "#ffffff",
                fontSize: 16,
                fontFamily: "Inter_400Regular",
              }}
              placeholder="ابحث عن المستخدمين..."
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={handleUserSearch}
            />
          </View>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <View>
              {searchResults.slice(0, 5).map((searchUser) => (
                <TouchableOpacity
                  key={searchUser.id}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 12,
                    backgroundColor: "#000000",
                    borderRadius: 8,
                    marginBottom: 8,
                    borderWidth: 1,
                    borderColor: "#404040",
                  }}
                  onPress={() => startPrivateChat(searchUser)}
                >
                  <Image
                    source={{
                      uri:
                        searchUser.profile_image ||
                        "https://via.placeholder.com/40x40/9AFF55/000?text=👤",
                    }}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      marginRight: 12,
                    }}
                    contentFit="cover"
                    transition={100}
                  />

                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: "#ffffff",
                        fontSize: 16,
                        fontFamily: "Inter_600SemiBold",
                        marginBottom: 2,
                      }}
                    >
                      {searchUser.username}
                    </Text>
                    {searchUser.is_admin && (
                      <Text
                        style={{
                          color: "#9AFF55",
                          fontSize: 12,
                          fontFamily: "Inter_400Regular",
                        }}
                      >
                        مدير
                      </Text>
                    )}
                  </View>

                  <MessageCircle size={20} color="#9AFF55" />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Account Details */}
        <View
          style={{
            backgroundColor: "#252525",
            borderWidth: 1,
            borderColor: "#404040",
            borderRadius: 12,
            padding: 20,
          }}
        >
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 18,
              color: "#FFFFFF",
              marginBottom: 20,
            }}
          >
            Account Details
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 14,
                color: "#9A9A9A",
              }}
            >
              Account Type
            </Text>
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 14,
                color: "#FFFFFF",
              }}
            >
              {user?.is_admin ? "Administrator" : "Regular User"}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 14,
                color: "#9A9A9A",
              }}
            >
              User ID
            </Text>
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 14,
                color: "#FFFFFF",
              }}
            >
              #{user?.id}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
