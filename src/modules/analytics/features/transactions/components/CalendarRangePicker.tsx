import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { useTheme } from "@/shared/theme";

export type DateRange = { start: string; end: string };

type MarkedDates = Record<string, {
  startingDay?: boolean;
  endingDay?: boolean;
  color?: string;
  textColor?: string;
  marked?: boolean;
}>;

type Props = {
  visible: boolean;
  initialRange?: DateRange;
  onClose: () => void;
  onApply: (range: DateRange) => void;
};

const toDateKey = (d: Date): string => d.toISOString().split("T")[0];

const buildMarked = (start: string, end: string, color: string): MarkedDates => {
  const marked: MarkedDates = {};
  const s = new Date(start);
  const e = new Date(end);
  let cur = new Date(s);
  while (cur <= e) {
    const key = toDateKey(cur);
    marked[key] = {
      color: key === start || key === end ? color : `${color}55`,
      textColor: "#FFFFFF",
      startingDay: key === start,
      endingDay: key === end,
    };
    cur.setDate(cur.getDate() + 1);
  }
  return marked;
};

export const CalendarRangePicker = ({
  visible,
  initialRange,
  onClose,
  onApply,
}: Props) => {
  const theme = useTheme();
  const [start, setStart] = useState<string | null>(initialRange?.start ?? null);
  const [end, setEnd] = useState<string | null>(initialRange?.end ?? null);

  const handleDayPress = (day: DateData) => {
    if (!start || (start && end)) {
      setStart(day.dateString);
      setEnd(null);
    } else {
      if (day.dateString < start) {
        setEnd(start);
        setStart(day.dateString);
      } else {
        setEnd(day.dateString);
      }
    }
  };

  const markedDates: MarkedDates =
    start && end
      ? buildMarked(start, end, theme.veloBlue)
      : start
        ? { [start]: { startingDay: true, endingDay: true, color: theme.veloBlue, textColor: "#FFFFFF" } }
        : {};

  const handleApply = () => {
    if (start && end) {
      onApply({ start, end });
      onClose();
    }
  };

  const handleClear = () => {
    setStart(null);
    setEnd(null);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.sheet, { backgroundColor: theme.surface }]}>
          <View style={styles.sheetHeader}>
            <Text style={[styles.sheetTitle, { color: theme.text }]}>
              Select Date Range
            </Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <Text style={[styles.closeBtn, { color: theme.subtext }]}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.hint, { color: theme.subtext }]}>
            {!start
              ? "Tap a start date"
              : !end
                ? "Now tap an end date"
                : `${start}  →  ${end}`}
          </Text>

          <Calendar
            markingType="period"
            markedDates={markedDates}
            onDayPress={handleDayPress}
            maxDate={toDateKey(new Date())}
            theme={{
              backgroundColor: theme.surface,
              calendarBackground: theme.surface,
              textSectionTitleColor: theme.subtext,
              selectedDayBackgroundColor: theme.veloBlue,
              selectedDayTextColor: "#FFFFFF",
              todayTextColor: theme.veloBlue,
              dayTextColor: theme.text,
              textDisabledColor: theme.subtextLight,
              dotColor: theme.veloBlue,
              monthTextColor: theme.text,
              arrowColor: theme.veloBlue,
              textDayFontFamily: "Inter-Regular",
              textMonthFontFamily: "Inter-Bold",
              textDayHeaderFontFamily: "Inter-Bold",
              textDayFontSize: 14,
              textMonthFontSize: 15,
              textDayHeaderFontSize: 12,
            }}
          />

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.clearBtn, { borderColor: theme.border }]}
              onPress={handleClear}
              activeOpacity={0.7}
            >
              <Text style={[styles.clearText, { color: theme.subtext }]}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.applyBtn,
                { backgroundColor: start && end ? theme.veloBlue : theme.surfaceVariant },
              ]}
              onPress={handleApply}
              disabled={!start || !end}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.applyText,
                  { color: start && end ? "#FFFFFF" : theme.subtext },
                ]}
              >
                Apply
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 32,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  sheetTitle: { fontSize: 17, fontFamily: "Inter-Bold" },
  closeBtn: { fontSize: 18, paddingHorizontal: 4 },
  hint: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    textAlign: "center",
    marginBottom: 8,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  clearBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  clearText: { fontSize: 14, fontFamily: "Inter-Bold" },
  applyBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  applyText: { fontSize: 14, fontFamily: "Inter-Bold" },
});
