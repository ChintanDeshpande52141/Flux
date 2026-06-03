import {
  useChatMessages,
  useChatSuggestions,
} from "@/modules/chat/features/messageFeed/hooks/useChatMessages";
import { sendChatMessage } from "@/modules/chat/features/messageFeed/services/messageFeedService";
import {
  LoggedTransaction,
  Message,
  UpdatedSetting,
} from "@/modules/chat/features/messageFeed/types";
import { useTheme } from "@/shared/theme";
import { useQueryClient } from "@tanstack/react-query";
import { Send, Zap } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChatProvider } from "../store/ChatProvider";

type LocalMessage = Message & {
  optimisticId?: string;
  isTyping?: boolean;
  logged?: LoggedTransaction | null;
  updated?: UpdatedSetting | null;
  isPulse?: boolean;
};

const CATEGORY_ICONS: Record<string, string> = {
  Food: "🍔",
  Transport: "🚗",
  Shopping: "🛍️",
  Entertainment: "🎬",
  Others: "💰",
};

const TypingIndicator = () => {
  const theme = useTheme();
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.delay(600 - delay),
        ]),
      ).start();
    animate(dot1, 0);
    animate(dot2, 200);
    animate(dot3, 400);
  }, [dot1, dot2, dot3]);

  return (
    <View style={styles.bubbleRow}>
      <View style={[styles.avatar, { backgroundColor: theme.veloBlue }]}>
        <Zap size={12} color="#FFFFFF" fill="#FFFFFF" />
      </View>
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: theme.surface,
            flexDirection: "row",
            gap: 4,
            paddingVertical: 14,
          },
        ]}
      >
        {[dot1, dot2, dot3].map((dot, i) => (
          <Animated.View
            key={i}
            style={[
              styles.dot,
              { backgroundColor: theme.subtext, opacity: dot },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const LoggedCard = ({ logged }: { logged: LoggedTransaction }) => {
  const theme = useTheme();
  const [isRecurring, setIsRecurring] = useState(false);
  const icon = CATEGORY_ICONS[logged.category] ?? "💰";
  return (
    <View
      style={[
        styles.loggedCard,
        { backgroundColor: theme.surface, borderColor: theme.border },
      ]}
    >
      <View style={styles.loggedCardTop}>
        <View
          style={[styles.loggedIcon, { backgroundColor: theme.surfaceVariant }]}
        >
          <Text style={styles.loggedIconText}>{icon}</Text>
        </View>
        <View style={styles.loggedCardInfo}>
          <Text style={[styles.loggedMerchant, { color: theme.text }]}>
            {logged.merchant}
          </Text>
          <Text style={[styles.loggedMeta, { color: theme.subtext }]}>
            {logged.category} · via {logged.paymentType}
          </Text>
        </View>
        <Text style={[styles.loggedAmount, { color: theme.text }]}>
          ₹{logged.amount.toLocaleString("en-IN")}
        </Text>
      </View>
      <View style={[styles.loggedDivider, { backgroundColor: theme.border }]} />
      <View style={styles.loggedCardBottom}>
        <View>
          <Text style={[styles.recurringLabel, { color: theme.text }]}>
            Mark as Recurring
          </Text>
          <Text style={[styles.recurringSubLabel, { color: theme.subtext }]}>
            Add to monthly fixed bills
          </Text>
        </View>
        <Switch
          value={isRecurring}
          onValueChange={() => {
            setIsRecurring((v) => !v);
            // TODO: next branch — silent subscription insert
          }}
          trackColor={{ false: theme.border, true: theme.veloBlue }}
          thumbColor="#FFFFFF"
        />
      </View>
    </View>
  );
};

const PulseMessage = ({ text }: { text: string }) => {
  const theme = useTheme();
  return (
    <View style={[styles.pulseRow]}>
      <Zap size={12} color={theme.veloBlue} fill={theme.veloBlue} />
      <Text style={[styles.pulseText, { color: theme.veloBlue }]}>{text}</Text>
    </View>
  );
};

const DateSeparator = ({ label }: { label: string }) => {
  const theme = useTheme();
  return (
    <View style={styles.dateSepRow}>
      <View style={[styles.dateSepLine, { backgroundColor: theme.border }]} />
      <Text style={[styles.dateSepText, { color: theme.subtext }]}>
        {label}
      </Text>
      <View style={[styles.dateSepLine, { backgroundColor: theme.border }]} />
    </View>
  );
};

function formatDateLabel(timestamp: string | undefined): string {
  if (!timestamp) return "TODAY";
  const d = new Date(timestamp);
  const now = new Date();
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
  if (isToday) return "TODAY";
  return d
    .toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
    .toUpperCase();
}

const MessageBubble = ({ message }: { message: LocalMessage }) => {
  const theme = useTheme();
  const isUser = message.sender === "user";

  if (message.isTyping) return <TypingIndicator />;
  if (message.isPulse) return <PulseMessage text={message.text} />;

  return (
    <View>
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
      {message.logged && message.logged.type === "transaction" && (
        <View style={styles.cardIndent}>
          <LoggedCard logged={message.logged} />
        </View>
      )}
    </View>
  );
};

const ChatContent = () => {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const { messages: history, isLoading } = useChatMessages();
  const { suggestions } = useChatSuggestions();
  const [localMessages, setLocalMessages] = useState<LocalMessage[]>([]);
  const [input, setInput] = useState("");
  const [isPending, setIsPending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (history.length > 0) {
      setLocalMessages(
        history.map((m) => ({
          ...m,
          timestamp: m.timestamp ?? new Date().toISOString(),
        })),
      );
      setTimeout(
        () => flatListRef.current?.scrollToEnd({ animated: false }),
        150,
      );
    } else if (!isLoading) {
      setLocalMessages([
        {
          id: "welcome",
          sender: "ai",
          text: "Hey! I'm Velo, your AI finance assistant. Tell me what you've spent and I'll track it instantly.",
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  }, [history, isLoading]);

  const scrollToBottom = () =>
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

  const handleSend = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isPending) return;

    const optimisticId = `opt-${Date.now()}`;
    const typingId = `typing-${Date.now()}`;

    const userBubble: LocalMessage = {
      id: optimisticId,
      optimisticId,
      sender: "user",
      text: trimmed,
      timestamp: new Date().toISOString(),
    };
    const typingBubble: LocalMessage = {
      id: typingId,
      sender: "ai",
      text: "",
      timestamp: new Date().toISOString(),
      isTyping: true,
    };

    setLocalMessages((prev) => [...prev, userBubble, typingBubble]);
    setInput("");
    setIsPending(true);
    scrollToBottom();

    try {
      const res = await sendChatMessage(trimmed);

      // Always invalidate chat-messages so history persists on refresh
      queryClient.invalidateQueries({ queryKey: ["chat-messages"] });

      setLocalMessages((prev) => {
        const withoutOptimistic = prev.filter(
          (m) => m.optimisticId !== optimisticId && m.id !== typingId,
        );
        const aiMessage: LocalMessage = {
          ...res.aiMessage,
          logged: res.logged,
          updated: res.updated,
        };
        const extras: LocalMessage[] = [];
        if (res.logged) {
          queryClient.invalidateQueries({ queryKey: ["safe-to-spend"] });
          queryClient.invalidateQueries({ queryKey: ["transactions"] });
          queryClient.invalidateQueries({ queryKey: ["spending-pulse"] });
          queryClient.invalidateQueries({ queryKey: ["spending-velocity"] });
          queryClient.invalidateQueries({ queryKey: ["spending-analysis"] });
          queryClient.invalidateQueries({ queryKey: ["chat-suggestions"] });
          queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
        }
        if (res.updated) {
          queryClient.invalidateQueries({ queryKey: ["safe-to-spend"] });
          queryClient.invalidateQueries({ queryKey: ["onboarding"] });
          const safeToSpend = queryClient.getQueryData<{
            data: { amount: number };
          }>(["safe-to-spend"]);
          const pulse: LocalMessage = {
            id: `pulse-${Date.now()}`,
            sender: "ai",
            text: `Pulse updated: Your settings have been saved${safeToSpend ? ` — safe-to-spend recalculating` : ""}.`,
            timestamp: new Date().toISOString(),
            isPulse: true,
          };
          extras.push(pulse);
        } else if (res.logged) {
          const pulse: LocalMessage = {
            id: `pulse-${Date.now()}`,
            sender: "ai",
            text: `Pulse updated: ₹${res.logged.amount.toLocaleString("en-IN")} logged — safe-to-spend recalculating.`,
            timestamp: new Date().toISOString(),
            isPulse: true,
          };
          extras.push(pulse);
        }
        return [...withoutOptimistic, res.userMessage, aiMessage, ...extras];
      });
    } catch {
      setLocalMessages((prev) =>
        prev
          .filter((m) => m.optimisticId !== optimisticId && m.id !== typingId)
          .concat({
            id: `err-${Date.now()}`,
            sender: "ai",
            text: "Something went wrong. Please try again.",
            timestamp: new Date().toISOString(),
          }),
      );
    } finally {
      setIsPending(false);
      scrollToBottom();
    }
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: LocalMessage;
    index: number;
  }) => {
    const showDate =
      index === 0 ||
      formatDateLabel(localMessages[index - 1]?.timestamp) !==
        formatDateLabel(item.timestamp);
    return (
      <>
        {showDate && <DateSeparator label={formatDateLabel(item.timestamp)} />}
        <MessageBubble message={item} />
      </>
    );
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
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={theme.veloBlue} />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={localMessages}
            keyExtractor={(m) => m.id}
            renderItem={renderItem}
            contentContainerStyle={styles.messageList}
            showsVerticalScrollIndicator={false}
            onLayout={() =>
              flatListRef.current?.scrollToEnd({ animated: false })
            }
          />
        )}

        <View style={styles.suggestionsRow}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chips}
          >
            {suggestions.map((s) => (
              <TouchableOpacity
                key={s.id}
                style={[
                  styles.chip,
                  {
                    backgroundColor: theme.surfaceVariant,
                    borderColor: theme.border,
                  },
                ]}
                onPress={() => handleSend(s.text)}
                activeOpacity={0.7}
                disabled={isPending}
              >
                <Text style={[styles.chipText, { color: theme.subtext }]}>
                  {s.text}
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
            placeholder="Type your expense (e.g., Coffee 150 Cash)"
            placeholderTextColor={theme.subtextLight}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => handleSend(input)}
            returnKeyType="send"
            multiline={false}
            editable={!isPending}
          />
          <TouchableOpacity
            style={[
              styles.sendBtn,
              {
                backgroundColor: theme.veloBlue,
                opacity: input.trim() && !isPending ? 1 : 0.4,
              },
            ]}
            onPress={() => handleSend(input)}
            activeOpacity={0.8}
            disabled={!input.trim() || isPending}
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
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
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
  messageList: { padding: 16, paddingBottom: 8 },
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
  dot: { width: 7, height: 7, borderRadius: 4 },
  cardIndent: { marginLeft: 36, marginBottom: 8 },
  loggedCard: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
    marginTop: 6,
  },
  loggedCardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
  },
  loggedIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  loggedIconText: { fontSize: 18 },
  loggedCardInfo: { flex: 1 },
  loggedMerchant: { fontSize: 14, fontFamily: "Inter-Bold" },
  loggedMeta: { fontSize: 12, fontFamily: "Inter-Regular", marginTop: 2 },
  loggedAmount: { fontSize: 16, fontFamily: "Inter-Bold" },
  loggedDivider: { height: StyleSheet.hairlineWidth, marginHorizontal: 12 },
  loggedCardBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  recurringLabel: { fontSize: 13, fontFamily: "Inter-Bold" },
  recurringSubLabel: {
    fontSize: 11,
    fontFamily: "Inter-Regular",
    marginTop: 1,
  },
  pulseRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  pulseText: { fontSize: 12, fontFamily: "Inter-Regular" },
  dateSepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginVertical: 12,
  },
  dateSepLine: { flex: 1, height: StyleSheet.hairlineWidth },
  dateSepText: {
    fontSize: 11,
    fontFamily: "Inter-Bold",
    letterSpacing: 0.5,
  },
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
