import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import { Image as ImageIcon } from "lucide-react-native";

const FormHeader = ({ editingItem, activeTab, resetForm }) => {
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
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontFamily: "Inter_700Bold",
            fontSize: 24,
            color: "#FFFFFF",
          }}
        >
          {editingItem ? "Edit" : "Add"} {activeTab.slice(0, -1)}
        </Text>
        <TouchableOpacity
          onPress={resetForm}
          style={{
            backgroundColor: "#404040",
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 8,
          }}
        >
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 12,
              color: "#FFFFFF",
            }}
          >
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ImageUpload = ({ activeTab, pickImage, selectedImage, editingItem }) => (
  <View style={{ marginBottom: 24 }}>
    <Text
      style={{
        fontFamily: "Inter_600SemiBold",
        fontSize: 14,
        color: "#FFFFFF",
        marginBottom: 8,
      }}
    >
      {activeTab === "channels" ? "Channel Icon" : "Banner Image"}
    </Text>
    <TouchableOpacity
      onPress={pickImage}
      style={{
        height: activeTab === "channels" ? 120 : 150,
        borderWidth: 2,
        borderColor: "#404040",
        borderStyle: "dashed",
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#252525",
      }}
    >
      {selectedImage || editingItem?.image_url || editingItem?.icon_url ? (
        <Image
          source={{
            uri:
              selectedImage?.uri ||
              editingItem?.image_url ||
              editingItem?.icon_url,
          }}
          style={{ width: "100%", height: "100%", borderRadius: 10 }}
          contentFit="cover"
          transition={100}
        />
      ) : (
        <View style={{ alignItems: "center" }}>
          <ImageIcon size={32} color="#9A9A9A" />
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 14,
              color: "#9A9A9A",
              marginTop: 8,
            }}
          >
            Tap to select image
          </Text>
        </View>
      )}
    </TouchableOpacity>
  </View>
);

const ChannelFormFields = ({ formData, setFormData }) => (
  <>
    <View style={{ marginBottom: 20 }}>
      <Text
        style={{
          fontFamily: "Inter_600SemiBold",
          fontSize: 14,
          color: "#FFFFFF",
          marginBottom: 8,
        }}
      >
        Channel Name *
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
          backgroundColor: "#252525",
        }}
        placeholder="Enter channel name"
        placeholderTextColor="#9A9A9A"
        value={formData.name}
        onChangeText={(text) => setFormData((prev) => ({ ...prev, name: text }))}
      />
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
        Description
      </Text>
      <TextInput
        style={{
          height: 80,
          borderWidth: 1,
          borderColor: "#404040",
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingTop: 16,
          fontFamily: "Inter_400Regular",
          fontSize: 16,
          color: "#FFFFFF",
          backgroundColor: "#252525",
        }}
        placeholder="Enter description"
        placeholderTextColor="#9A9A9A"
        value={formData.description}
        onChangeText={(text) =>
          setFormData((prev) => ({ ...prev, description: text }))
        }
        multiline
        textAlignVertical="top"
      />
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
        Category
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {["Game", "Party", "جديد", "Other"].map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => setFormData((prev) => ({ ...prev, category }))}
            style={{
              backgroundColor:
                formData.category === category ? "#9AFF55" : "#252525",
              borderWidth: 1,
              borderColor:
                formData.category === category ? "#9AFF55" : "#404040",
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
                color: formData.category === category ? "#000000" : "#FFFFFF",
              }}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
    <View style={{ flexDirection: "row", marginBottom: 20 }}>
      <View style={{ flex: 1, marginRight: 10 }}>
        <Text
          style={{
            fontFamily: "Inter_600SemiBold",
            fontSize: 14,
            color: "#FFFFFF",
            marginBottom: 8,
          }}
        >
          User Count
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
            backgroundColor: "#252525",
          }}
          placeholder="0"
          placeholderTextColor="#9A9A9A"
          value={formData.user_count}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, user_count: text }))
          }
          keyboardType="numeric"
        />
      </View>
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text
          style={{
            fontFamily: "Inter_600SemiBold",
            fontSize: 14,
            color: "#FFFFFF",
            marginBottom: 8,
          }}
        >
          Country
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
            backgroundColor: "#252525",
          }}
          placeholder="US"
          placeholderTextColor="#9A9A9A"
          value={formData.country_code}
          onChangeText={(text) =>
            setFormData((prev) => ({
              ...prev,
              country_code: text.toUpperCase(),
            }))
          }
          maxLength={2}
        />
      </View>
    </View>
  </>
);

const BannerFormFields = ({ formData, setFormData }) => (
  <>
    <View style={{ marginBottom: 20 }}>
      <Text
        style={{
          fontFamily: "Inter_600SemiBold",
          fontSize: 14,
          color: "#FFFFFF",
          marginBottom: 8,
        }}
      >
        Banner Title
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
          backgroundColor: "#252525",
        }}
        placeholder="Enter banner title"
        placeholderTextColor="#9A9A9A"
        value={formData.title}
        onChangeText={(text) => setFormData((prev) => ({ ...prev, title: text }))}
      />
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
        Display Order
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
          backgroundColor: "#252525",
        }}
        placeholder="0"
        placeholderTextColor="#9A9A9A"
        value={formData.display_order}
        onChangeText={(text) =>
          setFormData((prev) => ({ ...prev, display_order: text }))
        }
        keyboardType="numeric"
      />
    </View>
  </>
);

export default function AdminForm({
  editingItem,
  activeTab,
  resetForm,
  selectedImage,
  pickImage,
  formData,
  setFormData,
  handleSave,
  loading,
  uploading,
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: "#000000" }}>
      <StatusBar style="light" backgroundColor="#000000" />
      <FormHeader
        editingItem={editingItem}
        activeTab={activeTab}
        resetForm={resetForm}
      />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 20,
          paddingBottom: insets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <ImageUpload
          activeTab={activeTab}
          pickImage={pickImage}
          selectedImage={selectedImage}
          editingItem={editingItem}
        />

        {activeTab === "channels" ? (
          <ChannelFormFields formData={formData} setFormData={setFormData} />
        ) : (
          <BannerFormFields formData={formData} setFormData={setFormData} />
        )}

        <TouchableOpacity
          style={{
            height: 50,
            backgroundColor: loading || uploading ? "#5A5A5A" : "#9AFF55",
            borderRadius: 12,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
          }}
          onPress={handleSave}
          disabled={loading || uploading}
        >
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 16,
              color: "#000000",
            }}
          >
            {loading || uploading
              ? "Saving..."
              : `${editingItem ? "Update" : "Create"} ${activeTab.slice(
                  0,
                  -1,
                )}`}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
