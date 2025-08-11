import React, { useState, useEffect, useRef } from 'react';
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
import { router, useLocalSearchParams } from 'expo-router';
import { 
  ArrowLeft, 
  Send, 
  Gift, 
  Heart,
  Crown,
  Star 
} from 'lucide-react-native';
import { useUser } from '@/utils/auth/useUser';
import KeyboardAvoidingAnimatedView from '@/components/KeyboardAvoidingAnimatedView';

export default function PrivateChatScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  const { userId: otherUserId } = useLocalSearchParams();
  const scrollViewRef = useRef(null);
  
  const [otherUser, setOtherUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showGifts, setShowGifts] = useState(false);
  const [gifts, setGifts] = useState([]);

  const fetchChatData = async () => {
    if (!user?.id || !otherUserId) return;
    
    try {
      // Get other user info
      const userResponse = await fetch(`/api/auth/user?id=${otherUserId}`);
      if (!userResponse.ok) throw new Error('Failed to fetch user');
      const userData = await userResponse.json();
      setOtherUser(userData.user);

      // Get private messages
      const messagesResponse = await fetch(`/api/chat/private?user_id=${user.id}&other_user_id=${otherUserId}`);
      if (!messagesResponse.ok) throw new Error('Failed to fetch messages');
      const messagesData = await messagesResponse.json();
      setMessages(messagesData.messages || []);

      // Get available gifts
      const giftsResponse = await fetch('/api/gifts');
      if (!giftsResponse.ok) throw new Error('Failed to fetch gifts');
      const giftsData = await giftsResponse.json();
      setGifts(giftsData.gifts || []);
      
    } catch (error) {
      console.error('Fetch chat data error:', error);
      Alert.alert('خطأ', 'فشل في تحميل بيانات المحادثة');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatData();
    
    // Auto-refresh messages every 2 seconds for real-time feel
    const interval = setInterval(() => {
      if (user?.id && otherUserId) {
        fetchMessages();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [user?.id, otherUserId]);

  const fetchMessages = async () => {
    if (!user?.id || !otherUserId) return;
    
    try {
      const response = await fetch(`/api/chat/private?user_id=${user.id}&other_user_id=${otherUserId}`);
      if (!response.ok) return;
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Refresh messages error:', error);
    }
  };

  const sendMessage = async (message, messageType = 'text', giftType = null) => {
    if (!user?.id || !otherUserId || !message.trim()) return;

    try {
      const response = await fetch('/api/chat/private', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_id: user.id,
          recipient_id: otherUserId,
          message: message.trim(),
          message_type: messageType,
          gift_type: giftType
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      setMessages(prev => [...prev, data.message]);
      setNewMessage('');
      setShowGifts(false);
      
      // Scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
      
    } catch (error) {
      console.error('Send message error:', error);
      Alert.alert('خطأ', 'فشل في إرسال الرسالة');
    }
  };

  const sendGift = (gift) => {
    sendMessage(`أرسل ${gift.name} 🎁`, 'gift', gift.name);
  };

  const renderMessage = (message, index) => {
    const isOwnMessage = message.sender_id === user?.id;
    const isGiftMessage = message.message_type === 'gift';

    return (
      <View
        key={message.id}
        style={{
          marginBottom: 12,
          alignItems: isOwnMessage ? 'flex-end' : 'flex-start',
        }}
      >
        {!isOwnMessage && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Image
              source={{ uri: message.sender_profile_image || 'https://via.placeholder.com/24x24/9AFF55/000?text=👤' }}
              style={{ width: 24, height: 24, borderRadius: 12, marginRight: 8 }}
              contentFit="cover"
              transition={100}
            />
            <Text style={{ color: '#9AFF55', fontSize: 12, fontWeight: 'bold' }}>
              {message.sender_username}
            </Text>
          </View>
        )}
        
        <View
          style={{
            backgroundColor: isOwnMessage ? '#9AFF55' : '#1a1a1a',
            borderRadius: 16,
            paddingHorizontal: 12,
            paddingVertical: 8,
            maxWidth: '75%',
            borderWidth: isGiftMessage ? 2 : 0,
            borderColor: isGiftMessage ? '#FFD700' : 'transparent',
          }}
        >
          {isGiftMessage && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <Gift size={16} color={isOwnMessage ? '#000000' : '#FFD700'} />
              <Text style={{
                color: isOwnMessage ? '#000000' : '#FFD700',
                fontSize: 12,
                fontWeight: 'bold',
                marginLeft: 4,
              }}>
                هدية خاصة
              </Text>
            </View>
          )}
          
          <Text
            style={{
              color: isOwnMessage ? '#000000' : '#ffffff',
              fontSize: 15,
              lineHeight: 20,
            }}
          >
            {message.message}
          </Text>
          
          <Text
            style={{
              color: isOwnMessage ? '#333' : '#666',
              fontSize: 11,
              marginTop: 4,
              textAlign: 'right',
            }}
          >
            {new Date(message.created_at).toLocaleTimeString('ar', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={{ 
        flex: 1, 
        backgroundColor: '#000000',
        justifyContent: 'center', 
        alignItems: 'center',
        paddingTop: insets.top 
      }}>
        <StatusBar style="light" />
        <Text style={{ color: '#ffffff', fontSize: 18 }}>جاري التحميل...</Text>
      </View>
    );
  }

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
          يرجى تسجيل الدخول للمحادثة
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingAnimatedView style={{ flex: 1 }} behavior="padding">
      <View style={{ flex: 1, backgroundColor: '#000000', paddingTop: insets.top }}>
        <StatusBar style="light" />
        
        {/* Header */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 15,
          borderBottomWidth: 1,
          borderBottomColor: '#333',
        }}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#9AFF55" />
          </TouchableOpacity>
          
          <Image
            source={{ uri: otherUser?.profile_image || 'https://via.placeholder.com/40x40/9AFF55/000?text=👤' }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              marginLeft: 12,
              marginRight: 12,
            }}
            contentFit="cover"
            transition={100}
          />
          
          <View style={{ flex: 1 }}>
            <Text style={{
              color: '#ffffff',
              fontSize: 18,
              fontWeight: 'bold',
            }}>
              {otherUser?.username || 'مستخدم'}
            </Text>
            
            <Text style={{ color: '#9AFF55', fontSize: 12 }}>
              محادثة خاصة
            </Text>
          </View>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ 
            padding: 20,
            paddingBottom: showGifts ? 220 : 20
          }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.length === 0 ? (
            <View style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 100,
            }}>
              <Heart size={48} color="#333" />
              <Text style={{
                color: '#666',
                fontSize: 16,
                marginTop: 16,
                textAlign: 'center',
              }}>
                ابدأ المحادثة مع {otherUser?.username}
              </Text>
            </View>
          ) : (
            messages.map((message, index) => renderMessage(message, index))
          )}
        </ScrollView>

        {/* Gifts Panel */}
        {showGifts && (
          <View style={{
            position: 'absolute',
            bottom: 90,
            left: 0,
            right: 0,
            backgroundColor: '#1a1a1a',
            borderTopWidth: 1,
            borderTopColor: '#333',
            padding: 15,
            height: 150,
          }}>
            <Text style={{
              color: '#ffffff',
              fontSize: 16,
              fontWeight: 'bold',
              marginBottom: 12,
              textAlign: 'center',
            }}>
              أرسل هدية خاصة
            </Text>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {gifts.map((gift) => (
                <TouchableOpacity
                  key={gift.id}
                  style={{
                    alignItems: 'center',
                    marginRight: 20,
                    padding: 8,
                    backgroundColor: '#333',
                    borderRadius: 12,
                    minWidth: 70,
                  }}
                  onPress={() => sendGift(gift)}
                >
                  <Image
                    source={{ uri: gift.icon_url }}
                    style={{ width: 32, height: 32, marginBottom: 4 }}
                    contentFit="cover"
                    transition={100}
                  />
                  <Text style={{
                    color: '#ffffff',
                    fontSize: 10,
                    textAlign: 'center',
                    marginBottom: 2,
                  }}>
                    {gift.name}
                  </Text>
                  <Text style={{
                    color: '#9AFF55',
                    fontSize: 10,
                    fontWeight: 'bold',
                  }}>
                    {gift.cost} نقطة
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Message Input */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 15,
          borderTopWidth: 1,
          borderTopColor: '#333',
          backgroundColor: '#000000',
        }}>
          <TouchableOpacity
            style={{
              backgroundColor: showGifts ? '#9AFF55' : '#333',
              borderRadius: 20,
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 10,
            }}
            onPress={() => setShowGifts(!showGifts)}
          >
            <Gift size={20} color={showGifts ? '#000000' : '#9AFF55'} />
          </TouchableOpacity>
          
          <TextInput
            style={{
              flex: 1,
              backgroundColor: '#1a1a1a',
              borderRadius: 20,
              paddingHorizontal: 15,
              paddingVertical: 10,
              color: '#ffffff',
              fontSize: 16,
              marginRight: 10,
              borderWidth: 1,
              borderColor: '#333',
            }}
            placeholder="اكتب رسالة خاصة..."
            placeholderTextColor="#666"
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
            maxLength={500}
          />
          
          <TouchableOpacity
            style={{
              backgroundColor: newMessage.trim() ? '#9AFF55' : '#333',
              borderRadius: 20,
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => sendMessage(newMessage)}
            disabled={!newMessage.trim()}
          >
            <Send size={20} color={newMessage.trim() ? '#000000' : '#666'} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingAnimatedView>
  );
}