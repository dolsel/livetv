import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Search, MessageCircle } from 'lucide-react-native';
import { useUser } from '@/utils/auth/useUser';

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  const [conversations, setConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchConversations = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      // Get recent private messages grouped by conversation
      const response = await fetch(`/api/chat/private/conversations?user_id=${user.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }
      const data = await response.json();
      setConversations(data.conversations || []);
    } catch (error) {
      console.error('Fetch conversations error:', error);
      Alert.alert('خطأ', 'فشل في تحميل المحادثات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [user?.id]);

  const handleConversationPress = (otherUser) => {
    router.push(`/(tabs)/chat/${otherUser.id}`);
  };

  const filteredConversations = conversations.filter(conv =>
    conv.other_user_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user) {
    return (
      <View style={{ 
        flex: 1, 
        backgroundColor: '#000000',
        justifyContent: 'center', 
        alignItems: 'center',
        paddingTop: insets.top 
      }}>
        <StatusBar style="light" />
        <Text style={{ color: '#ffffff', fontSize: 18, textAlign: 'center' }}>
          يرجى تسجيل الدخول للوصول إلى الرسائل
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000000', paddingTop: insets.top }}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
        <Text style={{ 
          fontSize: 28, 
          fontWeight: 'bold', 
          color: '#ffffff',
          textAlign: 'center',
          marginBottom: 20 
        }}>
          الرسائل الخاصة
        </Text>

        {/* Search */}
        <View style={{
          backgroundColor: '#1a1a1a',
          borderRadius: 12,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 15,
          paddingVertical: 12,
          borderWidth: 1,
          borderColor: '#333',
        }}>
          <Search size={20} color="#9AFF55" />
          <TextInput
            style={{
              flex: 1,
              marginLeft: 10,
              color: '#ffffff',
              fontSize: 16,
            }}
            placeholder="البحث في المحادثات..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Conversations List */}
      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: '#666', fontSize: 16 }}>جاري التحميل...</Text>
          </View>
        ) : filteredConversations.length === 0 ? (
          <View style={{ 
            flex: 1, 
            justifyContent: 'center', 
            alignItems: 'center',
            paddingTop: 100 
          }}>
            <MessageCircle size={64} color="#333" />
            <Text style={{ 
              color: '#666', 
              fontSize: 18, 
              marginTop: 20,
              textAlign: 'center' 
            }}>
              {searchQuery ? 'لا توجد محادثات مطابقة' : 'لا توجد محادثات بعد'}
            </Text>
            <Text style={{ 
              color: '#666', 
              fontSize: 14, 
              marginTop: 8,
              textAlign: 'center' 
            }}>
              ابدأ محادثة من ملف شخصي للمستخدم
            </Text>
          </View>
        ) : (
          <View style={{ paddingHorizontal: 20 }}>
            {filteredConversations.map((conversation) => (
              <TouchableOpacity
                key={conversation.other_user_id}
                style={{
                  backgroundColor: '#1a1a1a',
                  borderRadius: 12,
                  padding: 15,
                  marginBottom: 12,
                  borderWidth: 1,
                  borderColor: '#333',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                onPress={() => handleConversationPress(conversation)}
              >
                <Image
                  source={{ uri: conversation.other_user_profile_image || 'https://via.placeholder.com/50x50/9AFF55/000?text=👤' }}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    marginRight: 12,
                  }}
                  contentFit="cover"
                  transition={100}
                />
                
                <View style={{ flex: 1 }}>
                  <Text style={{
                    color: '#ffffff',
                    fontSize: 16,
                    fontWeight: 'bold',
                    marginBottom: 4,
                  }}>
                    {conversation.other_user_name}
                  </Text>
                  
                  <Text style={{
                    color: '#9AFF55',
                    fontSize: 14,
                  }} numberOfLines={1}>
                    {conversation.last_message}
                  </Text>
                  
                  <Text style={{
                    color: '#666',
                    fontSize: 12,
                    marginTop: 4,
                  }}>
                    {new Date(conversation.last_message_time).toLocaleDateString('ar')}
                  </Text>
                </View>
                
                {conversation.unread_count > 0 && (
                  <View style={{
                    backgroundColor: '#9AFF55',
                    borderRadius: 10,
                    minWidth: 20,
                    height: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 6,
                  }}>
                    <Text style={{
                      color: '#000000',
                      fontSize: 12,
                      fontWeight: 'bold',
                    }}>
                      {conversation.unread_count}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}