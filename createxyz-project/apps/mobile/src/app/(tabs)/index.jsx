import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import { router } from "expo-router";
import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { useFonts } from "expo-font";

export default function ChannelsScreen() {
  const insets = useSafeAreaInsets();
  const [channels, setChannels] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    fetchData();
  }, [selectedCategory]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch banners
      const bannersResponse = await fetch("/api/banners");
      if (bannersResponse.ok) {
        const bannersData = await bannersResponse.json();
        setBanners(bannersData.banners || []);
      }

      // Fetch channels
      const channelsUrl =
        selectedCategory === "all"
          ? "/api/channels"
          : `/api/channels?category=${selectedCategory}`;

      const channelsResponse = await fetch(channelsUrl);
      if (channelsResponse.ok) {
        const channelsData = await channelsResponse.json();
        setChannels(channelsData.channels || []);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      Alert.alert("Error", "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleChannelPress = (channel) => {
    router.push(`/(tabs)/channel/${channel.id}`);
  };

  const categories = [
    { id: "all", title: "All" },
    { id: "Game", title: "Game" },
    { id: "Party", title: "Party" },
    { id: "جديد", title: "جديد" },
  ];

  const getCategoryColor = (category) => {
    switch (category) {
      case "Game":
        return "#FF6B6B";
      case "Party":
        return "#4ECDC4";
      case "جديد":
        return "#45B7D1";
      default:
        return "#9A9A9A";
    }
  };

  const getCountryFlag = (countryCode) => {
    const flags = {
      PK: "🇵🇰",
      IN: "🇮🇳",
      PH: "🇵🇭",
      US: "🇺🇸",
      SA: "🇸🇦",
      EG: "🇪🇬",
    };
    return flags[countryCode] || "🌍";
  };

  if (!fontsLoaded) {
    return null;
  }

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#000000",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <StatusBar style="light" backgroundColor="#000000" />
        <ActivityIndicator size="large" color="#9AFF55" />
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 16,
            color: "#FFFFFF",
            marginTop: 10,
          }}
        >
          Loading channels...
        </Text>
      </View>
    );
  }

  const renderBanner = ({ item }) => (
    <View
      style={{
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      <Image
        source={{ uri: item.image_url }}
        style={{
          width: "100%",
          height: 100,
          backgroundColor: "#252525",
        }}
        contentFit="cover"
        transition={100}
      />
      {item.title && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            padding: 8,
          }}
        >
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 14,
              color: "#FFFFFF",
              textAlign: "center",
            }}
          >
            {item.title}
          </Text>
        </View>
      )}
    </View>
  );

  const renderChannel = ({ item }) => (
    <TouchableOpacity
      style={{
        backgroundColor: "#252525",
        borderWidth: 1,
        borderColor: "#404040",
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
      }}
      onPress={() => handleChannelPress(item)}
    >
      {/* Channel Icon */}
      <Image
        source={{
          uri:
            item.icon_url ||
            "https://via.placeholder.com/60x60/404040/white?text=CH",
        }}
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: "#404040",
          marginRight: 16,
        }}
        contentFit="cover"
        transition={100}
      />

      {/* Channel Info */}
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 4,
          }}
        >
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

          {/* Country Flag */}
          <Text style={{ fontSize: 16, marginLeft: 8 }}>
            {getCountryFlag(item.country_code)}
          </Text>
        </View>

        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 14,
            color: "#9A9A9A",
            marginBottom: 8,
            numberOfLines: 2,
          }}
        >
          {item.description}
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Category Tag */}
          <View
            style={{
              backgroundColor: getCategoryColor(item.category),
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 6,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 12,
                color: "#FFFFFF",
              }}
            >
              {item.category}
            </Text>
          </View>

          {/* User Count */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 14,
                color: "#9A9A9A",
              }}
            >
              👥 {item.user_count}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

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
          Live Channels
        </Text>
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 14,
            color: "#9A9A9A",
          }}
        >
          Choose a channel to join
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Banners Section */}
        {banners.length > 0 && (
          <View style={{ marginTop: 20 }}>
            <FlatList
              data={banners}
              renderItem={renderBanner}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 16 }}
            />
          </View>
        )}

        {/* Category Filter */}
        <View
          style={{
            paddingVertical: 20,
            paddingHorizontal: 16,
          }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16 }}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => setSelectedCategory(category.id)}
                style={{
                  backgroundColor:
                    selectedCategory === category.id ? "#9AFF55" : "#252525",
                  borderWidth: 1,
                  borderColor:
                    selectedCategory === category.id ? "#9AFF55" : "#404040",
                  borderRadius: 20,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  marginRight: 12,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter_600SemiBold",
                    fontSize: 14,
                    color:
                      selectedCategory === category.id ? "#000000" : "#FFFFFF",
                  }}
                >
                  {category.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Channels List */}
        <View style={{ paddingBottom: insets.bottom + 20 }}>
          {channels.length === 0 ? (
            <View
              style={{
                padding: 40,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 16,
                  color: "#9A9A9A",
                  textAlign: "center",
                }}
              >
                No channels found for this category
              </Text>
            </View>
          ) : (
            <FlatList
              data={channels}
              renderItem={renderChannel}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
