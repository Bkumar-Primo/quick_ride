import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type React from 'react';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '../../components/common/Avatar';
import { Colors } from '../../constants/colors';
import { Layout } from '../../constants/layout';
import type { RootStackParamList } from '../../navigation/types';
import { useRideStore } from '../../store/rideStore';

type Props = NativeStackScreenProps<RootStackParamList, 'DriverChat'>;
type Message = { id: string; text: string; fromRider: boolean };

const QUICK_REPLIES = [
  'I’m at the pickup point',
  'Please come to the main gate',
  'I’ll be there in 2 minutes',
];

export const DriverChatScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const driver = useRideStore((state) => state.activeRide?.driver);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 'driver-hello', text: 'Hi! I’m on my way to the pickup point.', fromRider: false },
  ]);

  useEffect(() => {
    if (!driver) navigation.goBack();
  }, [driver, navigation]);

  if (!driver) {
    return null;
  }

  const sendMessage = (text = draft) => {
    const value = text.trim();
    if (!value) return;
    setMessages((current) => [
      ...current,
      { id: `rider-${Date.now()}`, text: value, fromRider: true },
    ]);
    setDraft('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={[styles.header, { paddingTop: insets.top + Layout.spacing.sm }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Avatar name={driver.name} source={driver.avatar} size={40} />
        <View style={styles.headerCopy}>
          <Text style={styles.name}>{driver.name}</Text>
          <Text style={styles.online}>Online · {driver.carNumber}</Text>
        </View>
        <TouchableOpacity
          style={styles.callButton}
          onPress={() => navigation.navigate('DriverCall')}
        >
          <Ionicons name="call-outline" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.messages}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.notice}>Messages are shared only with your driver.</Text>
        {messages.map((message) => (
          <View
            key={message.id}
            style={[styles.bubble, message.fromRider ? styles.riderBubble : styles.driverBubble]}
          >
            <Text style={[styles.messageText, message.fromRider && styles.riderMessageText]}>
              {message.text}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.composerArea}>
        <ScrollView
          horizontal
          contentContainerStyle={styles.quickReplies}
          keyboardShouldPersistTaps="handled"
          showsHorizontalScrollIndicator={false}
        >
          {QUICK_REPLIES.map((reply) => (
            <TouchableOpacity
              key={reply}
              style={styles.quickReply}
              onPress={() => sendMessage(reply)}
            >
              <Text style={styles.quickReplyText}>{reply}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View
          style={[styles.composer, { marginBottom: Math.max(insets.bottom, Layout.spacing.sm) }]}
        >
          <TextInput
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={() => sendMessage()}
            placeholder="Write a message"
            placeholderTextColor={Colors.gray400}
            returnKeyType="send"
            style={styles.input}
          />
          <TouchableOpacity
            activeOpacity={0.85}
            disabled={!draft.trim()}
            onPress={() => sendMessage()}
            style={[styles.sendButton, !draft.trim() && styles.sendButtonDisabled]}
          >
            <Ionicons name="send" size={18} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  header: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderBottomColor: Colors.gray100,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: Layout.spacing.sm,
    paddingBottom: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.lg,
  },
  backButton: { padding: Layout.spacing.xs },
  headerCopy: { flex: 1 },
  name: { color: Colors.textPrimary, fontSize: 16, fontWeight: '800' },
  online: { color: Colors.accent, fontSize: 12, marginTop: 1 },
  callButton: {
    alignItems: 'center',
    backgroundColor: Colors.primarySubtle,
    borderRadius: Layout.borderRadius.full,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  messages: {
    gap: Layout.spacing.sm,
    padding: Layout.spacing.lg,
    paddingBottom: Layout.spacing.xxl,
  },
  notice: {
    alignSelf: 'center',
    color: Colors.gray500,
    fontSize: 11,
    marginBottom: Layout.spacing.sm,
    textAlign: 'center',
  },
  bubble: { borderRadius: Layout.borderRadius.lg, maxWidth: '82%', padding: Layout.spacing.md },
  driverBubble: { alignSelf: 'flex-start', backgroundColor: Colors.white },
  riderBubble: { alignSelf: 'flex-end', backgroundColor: Colors.primary },
  messageText: { color: Colors.textPrimary, fontSize: 14, lineHeight: 20 },
  riderMessageText: { color: Colors.white },
  composerArea: {
    backgroundColor: Colors.white,
    borderTopColor: Colors.gray100,
    borderTopWidth: 1,
  },
  quickReplies: {
    gap: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.sm,
  },
  quickReply: {
    backgroundColor: Colors.primarySubtle,
    borderRadius: Layout.borderRadius.full,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
  },
  quickReplyText: { color: Colors.primaryDark, fontSize: 12, fontWeight: '700' },
  composer: {
    alignItems: 'center',
    backgroundColor: Colors.gray100,
    borderRadius: Layout.borderRadius.full,
    flexDirection: 'row',
    marginHorizontal: Layout.spacing.lg,
    marginTop: Layout.spacing.sm,
    paddingLeft: Layout.spacing.md,
  },
  input: { color: Colors.textPrimary, flex: 1, fontSize: 14, minHeight: 48 },
  sendButton: {
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: Layout.borderRadius.full,
    height: 40,
    justifyContent: 'center',
    marginRight: Layout.spacing.xs,
    width: 40,
  },
  sendButtonDisabled: { backgroundColor: Colors.gray300 },
});

export default DriverChatScreen;
