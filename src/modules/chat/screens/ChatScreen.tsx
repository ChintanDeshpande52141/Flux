import { useTheme } from "@/shared/theme";
import { Send, Zap } from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChatProvider } from "../store/ChatProvider";

type Message = {
  id: string;
  text: string;
  sender: "user" | "ai";
};

const SUGGESTIONS = [
  "How much did I spend this week?",
  "Where can I cut back?",
  "Show my top categories",
  "Am I on budget?",
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    sender: "ai",
    text: "Hey! I'm Velo, your AI finance assistant. Ask me anything about your spending, budget, or savings.",
  },
];

const MessageBubble = ({ message }: { message: Message }) => {
  const theme = useTheme();
  const isUser = message.sender === "user";

  return (
    <View style={[styles.bubbleRow, isUser && styles.bubbleRowUser]}>
      {!isUser && (
        <View style={[styles.avatar, { backgroundColor: theme.veloBlue }]}>
          <Zap size={12} color="#FFFFFF" fill="#FFFFFF" />
        </View>
      )}
      <View
        style={[
          styles.bubble,
          isUser
            ? { backgroundColor: theme.veloBlue }
            : { backgroundColor: theme.surface },
        ]}
      >
        <Text
          style={[
            styles.bubbleText,
            { color: isUser ? "#FFFFFF" : theme.text },
          ]}
        >
          {message.text}
        </Text>
      </View>
    </View>
  );
};

const ChatContent = () => {
  const theme = useTheme();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: text.trim(),
    };
    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      sender: "ai",
      text: "I'm analysing your spending data... (AI response coming soon once connected to the API)",
    };
    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInput("");
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <View style={[styles.headerIcon, { backgroundColor: theme.text }]}>
          <Zap size={14} color={theme.surface} fill={theme.surface} />
        </View>
        <View>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Velo</Text>
          <Text style={[styles.headerSub, { color: theme.veloBlue }]}>
            AI Finance Assistant
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={({ item }) => <MessageBubble message={item} />}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        <View style={[styles.suggestionsRow]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chips}
          >
            {SUGGESTIONS.map((s) => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.chip,
                  {
                    backgroundColor: theme.surfaceVariant,
                    borderColor: theme.border,
                  },
                ]}
                onPress={() => sendMessage(s)}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, { color: theme.subtext }]}>
                  {s}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View
          style={[
            styles.inputBar,
            { backgroundColor: theme.surface, borderTopColor: theme.border },
          ]}
        >
          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.surfaceVariant, color: theme.text },
            ]}
            placeholder="Ask Velo anything..."
            placeholderTextColor={theme.subtextLight}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => sendMessage(input)}
            returnKeyType="send"
            multiline={false}
          />
          <TouchableOpacity
            style={[
              styles.sendBtn,
              {
                backgroundColor: theme.veloBlue,
                opacity: input.trim() ? 1 : 0.5,
              },
            ]}
            onPress={() => sendMessage(input)}
            activeOpacity={0.8}
          >
            <Send size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export const ChatScreen = () => (
  <ChatProvider>
    <ChatContent />
  </ChatProvider>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize: 16, fontFamily: "Inter-Bold" },
  headerSub: { fontSize: 12, fontFamily: "Inter-Regular" },
  messageList: { padding: 16, gap: 12, paddingBottom: 8 },
  bubbleRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    marginBottom: 8,
  },
  bubbleRowUser: { justifyContent: "flex-end" },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  bubble: {
    maxWidth: "80%",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleText: { fontSize: 14, fontFamily: "Inter-Regular", lineHeight: 20 },
  suggestionsRow: { paddingVertical: 8 },
  chips: { paddingHorizontal: 16, gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
  chipText: { fontSize: 12, fontFamily: "Inter-Regular" },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  input: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: "Inter-Regular",
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
});
