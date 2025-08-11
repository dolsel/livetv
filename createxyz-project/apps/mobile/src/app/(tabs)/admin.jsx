import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import { useFonts } from "expo-font";
import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { Plus } from "lucide-react-native";
import useUpload from "@/utils/useUpload";

import AdminLoginScreen from "@/components/admin/AdminLoginScreen";
import AdminForm from "@/components/admin/AdminForm";
import ChannelListItem from "@/components/admin/ChannelListItem";
import BannerListItem from "@/components/admin/BannerListItem";
import GiftListItem from "@/components/admin/GiftListItem";
import SyncTabContent from "@/components/admin/SyncTabContent";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminTabNavigation from "@/components/admin/AdminTabNavigation";

export default function AdminScreen() {
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("channels"); // channels, banners, gifts, sync
  const [channels, setChannels] = useState([]);
  const [banners, setBanners] = useState([]);
  const [gifts, setGifts] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Game",
    user_count: "0",
    country_code: "US",
    title: "",
    display_order: "0",
    cost: "0",
  });
  const [selectedImage, setSelectedImage] = useState(null);

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

      if (data.success && data.user.is_admin) {
        setUser(data.user);
        setIsLoggedIn(true);
        fetchData();
        Alert.alert("Success", "Admin logged in successfully!");
      } else {
        Alert.alert("Error", data.error || "Admin access required");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const channelsResponse = await fetch("/api/channels");
      if (channelsResponse.ok) {
        const channelsData = await channelsResponse.json();
        setChannels(channelsData.channels || []);
      }

      const bannersResponse = await fetch("/api/banners");
      if (bannersResponse.ok) {
        const bannersData = await bannersResponse.json();
        setBanners(bannersData.banners || []);
      }

      const giftsResponse = await fetch("/api/gifts");
      if (giftsResponse.ok) {
        const giftsData = await giftsResponse.json();
        setGifts(giftsData.gifts || []);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  const handleSync = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await fetch("/api/server/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert("Success", data.message);
        fetchData();
      } else {
        Alert.alert(
          "Sync Notice",
          data.error || "Sync completed with demo data",
        );
        fetchData();
      }
    } catch (error) {
      console.error("Sync error:", error);
      Alert.alert("Error", "Sync failed");
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  const handleSave = async () => {
    if (activeTab === "channels" && !formData.name) {
      Alert.alert("Error", "Channel name is required");
      return;
    }
    if (activeTab === "banners" && !selectedImage && !editingItem) {
      Alert.alert("Error", "Banner image is required");
      return;
    }

    setLoading(true);
    try {
      let imageUrl = editingItem?.image_url || editingItem?.icon_url;

      if (selectedImage) {
        const uploadResult = await upload({ reactNativeAsset: selectedImage });
        if (uploadResult.error) {
          Alert.alert("Error", "Failed to upload image");
          setLoading(false);
          return;
        }
        imageUrl = uploadResult.url;
      }

      const endpoint =
        activeTab === "channels" ? "/api/channels" : "/api/banners";
      const method = editingItem ? "PUT" : "POST";

      let body;
      if (activeTab === "channels") {
        body = {
          name: formData.name,
          description: formData.description,
          category: formData.category,
          user_count: parseInt(formData.user_count) || 0,
          country_code: formData.country_code,
          icon_url: imageUrl,
        };
        if (editingItem) body.id = editingItem.id;
      } else {
        body = {
          title: formData.title,
          display_order: parseInt(formData.display_order) || 0,
          image_url: imageUrl,
        };
        if (editingItem) body.id = editingItem.id;
      }

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert(
          "Success",
          `${activeTab.slice(0, -1)} ${
            editingItem ? "updated" : "created"
          } successfully!`,
        );
        resetForm();
        fetchData();
      } else {
        Alert.alert("Error", data.error);
      }
    } catch (error) {
      console.error("Save error:", error);
      Alert.alert("Error", "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item) => {
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete this ${activeTab.slice(0, -1)}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const endpoint =
                activeTab === "channels" ? "/api/channels" : "/api/banners";
              const response = await fetch(endpoint, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: item.id }),
              });

              const data = await response.json();
              if (data.success) {
                fetchData();
                Alert.alert("Success", "Deleted successfully!");
              } else {
                Alert.alert("Error", data.error || "Failed to delete");
              }
            } catch (error) {
              Alert.alert("Error", "Failed to delete");
            }
          },
        },
      ],
    );
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    if (activeTab === "channels") {
      setFormData({
        name: item.name || "",
        description: item.description || "",
        category: item.category || "Game",
        user_count: (item.user_count || 0).toString(),
        country_code: item.country_code || "US",
        title: "",
        display_order: "0",
      });
    } else {
      setFormData({
        title: item.title || "",
        display_order: (item.display_order || 0).toString(),
        name: "",
        description: "",
        category: "Game",
        user_count: "0",
        country_code: "US",
      });
    }
    setShowAddForm(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setShowAddForm(false);
    setSelectedImage(null);
    setFormData({
      name: "",
      description: "",
      category: "Game",
      user_count: "0",
      country_code: "US",
      title: "",
      display_order: "0",
    });
  };

  if (!fontsLoaded) {
    return null;
  }

  if (!isLoggedIn) {
    return (
      <AdminLoginScreen
        loginUsername={loginUsername}
        setLoginUsername={setLoginUsername}
        loginPassword={loginPassword}
        setLoginPassword={setLoginPassword}
        handleLogin={handleLogin}
        loading={loading}
      />
    );
  }

  if (showAddForm) {
    return (
      <AdminForm
        editingItem={editingItem}
        activeTab={activeTab}
        resetForm={resetForm}
        selectedImage={selectedImage}
        pickImage={pickImage}
        formData={formData}
        setFormData={setFormData}
        handleSave={handleSave}
        loading={loading}
        uploading={uploading}
      />
    );
  }

  const renderContent = () => {
    if (activeTab === "sync") {
      return <SyncTabContent handleSync={handleSync} loading={loading} />;
    }

    let data, ItemComponent;
    if (activeTab === "channels") {
      data = channels;
      ItemComponent = ChannelListItem;
    } else if (activeTab === "banners") {
      data = banners;
      ItemComponent = BannerListItem;
    } else if (activeTab === "gifts") {
      data = gifts;
      ItemComponent = GiftListItem;
    }

    return (
      <View>
        <TouchableOpacity
          style={{
            backgroundColor: "#9AFF55",
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderRadius: 8,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
          }}
          onPress={() => setShowAddForm(true)}
        >
          <Plus size={16} color="#000000" style={{ marginRight: 8 }} />
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 14,
              color: "#000000",
            }}
          >
            Add {activeTab.slice(0, -1)}
          </Text>
        </TouchableOpacity>

        {data.length === 0 ? (
          <View style={{ padding: 40, alignItems: "center" }}>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 16,
                color: "#9A9A9A",
                textAlign: "center",
              }}
            >
              No {activeTab} found
            </Text>
          </View>
        ) : (
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <ItemComponent
                item={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        )}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#000000" }}>
      <StatusBar style="light" backgroundColor="#000000" />
      <AdminHeader title="Admin Panel" subtitle="Manage channels and banners" />
      <AdminTabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 20,
          paddingBottom: insets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {renderContent()}
      </ScrollView>
    </View>
  );
}
