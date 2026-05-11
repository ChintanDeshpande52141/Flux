import { useTheme } from "@/shared/theme";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react-native";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar, DateData } from "react-native-calendars";

type Props = {
  value: string;
  onChange: (date: string) => void;
  label?: string;
  placeholder?: string;
};

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const YEARS = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i);

export function DatePicker({
  value,
  onChange,
  label,
  placeholder = "Select date",
}: Props) {
  const theme = useTheme();
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentDate, setCurrentDate] = useState(() => {
    const date = value ? new Date(value) : new Date();
    return { year: date.getFullYear(), month: date.getMonth() };
  });
  const [showYearMonthPicker, setShowYearMonthPicker] = useState(false);

  const handleDayPress = (day: DateData) => {
    onChange(day.dateString);
    setShowCalendar(false);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleMonthChange = (direction: "next" | "prev") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev.year, prev.month + (direction === "next" ? 1 : -1), 1);
      return { year: newDate.getFullYear(), month: newDate.getMonth() };
    });
  };

  const handleYearMonthSelect = (year: number, month: number) => {
    setCurrentDate({ year, month });
    setShowYearMonthPicker(false);
  };

  const monthYearLabel = `${MONTHS[currentDate.month]} ${currentDate.year}`;

  return (
    <View>
      {label && (
        <Text style={[styles.label, { color: theme.subtext }]}>{label}</Text>
      )}
      <TouchableOpacity
        style={[
          styles.dateButton,
          {
            backgroundColor: theme.background,
            borderColor: theme.border,
          },
        ]}
        onPress={() => setShowCalendar(true)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.dateText,
            { color: value ? theme.text : theme.subtext },
          ]}
        >
          {value ? formatDate(value) : placeholder}
        </Text>
        <ChevronDown size={16} color={theme.subtext} />
      </TouchableOpacity>

      <Modal
        visible={showCalendar}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCalendar(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowCalendar(false)}
        >
          <View
            style={[
              styles.calendarContainer,
              { backgroundColor: theme.surface },
            ]}
          >
            {/* Custom Header */}
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => handleMonthChange("prev")}
                hitSlop={10}
              >
                <ChevronLeft size={20} color={theme.text} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowYearMonthPicker(true)}
                style={styles.monthYearBtn}
                hitSlop={10}
              >
                <Text style={[styles.monthYearText, { color: theme.text }]}>
                  {monthYearLabel}
                </Text>
                <ChevronDown size={14} color={theme.subtext} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleMonthChange("next")}
                hitSlop={10}
              >
                <ChevronRight size={20} color={theme.text} />
              </TouchableOpacity>
            </View>

            <Calendar
              current={`${currentDate.year}-${String(currentDate.month + 1).padStart(2, "0")}-01`}
              onDayPress={handleDayPress}
              onMonthChange={(month) => {
                setCurrentDate({ year: month.year, month: month.month - 1 });
              }}
              markedDates={{
                [value]: {
                  selected: true,
                  selectedColor: theme.veloBlue,
                  selectedTextColor: "#fff",
                },
              }}
              hideExtraDays
              theme={{
                backgroundColor: "transparent",
                calendarBackground: theme.background,
                textSectionTitleColor: theme.text,
                selectedDayBackgroundColor: theme.veloBlue,
                selectedDayTextColor: "#fff",
                todayTextColor: theme.veloBlue,
                dayTextColor: theme.text,
                textDisabledColor: theme.subtext,
                arrowColor: theme.text,
                monthTextColor: theme.text,
                textDayFontFamily: "Inter-Regular",
                textMonthFontFamily: "Inter-Bold",
                textDayHeaderFontFamily: "Inter-Bold",
              }}
              customHeader={() => null}
            />
            <TouchableOpacity
              style={[styles.closeBtn, { backgroundColor: theme.veloBlue }]}
              onPress={() => setShowCalendar(false)}
            >
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Year/Month Picker Modal */}
      <Modal
        visible={showYearMonthPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowYearMonthPicker(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowYearMonthPicker(false)}
        >
          <View
            style={[
              styles.pickerContainer,
              { backgroundColor: theme.surface },
            ]}
          >
            <Text style={[styles.pickerTitle, { color: theme.text }]}>
              Select Month & Year
            </Text>
            
            <View style={styles.pickerRow}>
              <ScrollView style={styles.pickerScroll} nestedScrollEnabled>
                <View style={styles.pickerColumn}>
                  {MONTHS.map((month, index) => (
                    <TouchableOpacity
                      key={month}
                      style={[
                        styles.pickerItem,
                        currentDate.month === index && {
                          backgroundColor: theme.veloBlue + "20",
                          borderColor: theme.veloBlue,
                        },
                      ]}
                      onPress={() => handleYearMonthSelect(currentDate.year, index)}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          {
                            color:
                              currentDate.month === index
                                ? theme.veloBlue
                                : theme.text,
                            fontFamily:
                              currentDate.month === index
                                ? "Inter-Bold"
                                : "Inter-Regular",
                          },
                        ]}
                      >
                        {month}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              <ScrollView style={styles.pickerScroll} nestedScrollEnabled>
                <View style={styles.pickerColumn}>
                  {YEARS.map((year) => (
                    <TouchableOpacity
                      key={year}
                      style={[
                        styles.pickerItem,
                        currentDate.year === year && {
                          backgroundColor: theme.veloBlue + "20",
                          borderColor: theme.veloBlue,
                        },
                      ]}
                      onPress={() => handleYearMonthSelect(year, currentDate.month)}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          {
                            color:
                              currentDate.year === year
                                ? theme.veloBlue
                                : theme.text,
                            fontFamily:
                              currentDate.year === year
                                ? "Inter-Bold"
                                : "Inter-Regular",
                          },
                        ]}
                      >
                        {year}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            <TouchableOpacity
              style={[styles.closeBtn, { backgroundColor: theme.veloBlue }]}
              onPress={() => setShowYearMonthPicker(false)}
            >
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    fontFamily: "Inter-Bold",
    marginBottom: 8,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
  },
  dateText: {
    fontSize: 15,
    fontFamily: "Inter-Regular",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  calendarContainer: {
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxWidth: 350,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  monthYearBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  monthYearText: {
    fontSize: 16,
    fontFamily: "Inter-Bold",
  },
  pickerContainer: {
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxWidth: 350,
  },
  pickerTitle: {
    fontSize: 16,
    fontFamily: "Inter-Bold",
    marginBottom: 16,
    textAlign: "center",
  },
  pickerRow: {
    flexDirection: "row",
    gap: 12,
    maxHeight: 200,
  },
  pickerScroll: {
    flex: 1,
  },
  pickerColumn: {
    gap: 4,
  },
  pickerItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "transparent",
  },
  pickerItemText: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    textAlign: "center",
  },
  closeBtn: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  closeBtnText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Inter-Bold",
  },
});
