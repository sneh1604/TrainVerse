import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

type RunDays = {
  sun: boolean;
  mon: boolean;
  tue: boolean;
  wed: boolean;
  thu: boolean;
  fri: boolean;
  sat: boolean;
};

type TrainClass = {
  value: string;
  name: string;
};

type LiveTrain = {
  trainNumber: string;
  trainName: string;
  trainType: string;
  arrivalTime: string;
  departureTime: string;
  runDays: RunDays;
  classes: TrainClass[];
};

const TrainTypeIcon = ({ type, color }: { type: string; color: string }) => {
  let iconName: keyof typeof Ionicons.glyphMap = 'train-outline';
  if (type.includes('EXPRESS')) iconName = 'flash-outline';
  if (type.includes('PASSENGER')) iconName = 'bus-outline';
  if (type.includes('SUPERFAST')) iconName = 'rocket-outline';
  return <Ionicons name={iconName} size={28} color={color} style={styles.trainIcon} />;
};

export default function LiveStationScreen() {
  const [fromStation, setFromStation] = useState<string>("MAN");
  const [toStation, setToStation] = useState<string>("ND");
  const [hours, setHours] = useState<string>("6");
  const [loading, setLoading] = useState<boolean>(false);
  const [trains, setTrains] = useState<LiveTrain[]>([]);
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';

  const fetchLiveStation = async () => {
    try {
      setLoading(true);
      let url = `https://irctc1.p.rapidapi.com/api/v3/getLiveStation?fromStationCode=${fromStation.toUpperCase()}&hours=${hours}`;
      
      if (toStation.trim()) {
        url += `&toStationCode=${toStation.toUpperCase()}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "x-rapidapi-host": "irctc1.p.rapidapi.com",
          "x-rapidapi-key": "22e9b8a2aemsh0912f6a2da48e8cp1e2cc0jsnba91c3220474",
          "x-rapidapi-ua": "RapidAPI-Playground"
        }
      });

      const json = await response.json();
      console.log("Live Station API Response:", json);
      
      if (json.message && json.message.includes("exceeded")) {
        alert("API quota exceeded. Please try again later or upgrade your plan.");
        setTrains([]);
      } else if (json.status && json.data) {
        setTrains(json.data);
      } else {
        alert("No trains found for the given criteria");
        setTrains([]);
      }
    } catch (error) {
      console.log(error);
      alert("Error fetching live station data");
    } finally {
      setLoading(false);
    }
  };

  const getRunDaysString = (runDays: RunDays) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const activeDays = [
      runDays.sun, runDays.mon, runDays.tue, 
      runDays.wed, runDays.thu, runDays.fri, runDays.sat
    ];
    
    const allDays = activeDays.every(day => day);
    if (allDays) return "Daily";
    
    return days.filter((_, index) => activeDays[index]).join(', ');
  };

  const getClassColor = (classValue: string) => {
    const colorMap: { [key: string]: string } = {
      '1A': '#8B4513', '2A': '#E91E63', '3A': '#00BCD4', 'SL': '#4CAF50',
      '2S': '#FF9800', 'CC': '#795548', 'EC': '#9C27B0', '3E': '#607D8B',
    };
    return colorMap[classValue] || colors.textSecondary;
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={[styles.headerContainer, { backgroundColor: colors.primary }]}>
        <Ionicons name="train-outline" size={48} color={colors.card} style={styles.icon} />
        <Text style={[styles.header, { color: colors.card }]}>Live Station Trains</Text>
        <Text style={[styles.headerSubtitle, { color: isDark ? colors.text : colors.background }]}>Find trains between stations</Text>
      </View>

      {/* Search Form */}
      <View style={[styles.searchCard, { backgroundColor: colors.card }]}>
        <View style={styles.formRow}>
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>From Station *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
              placeholder="e.g., MAN"
              value={fromStation}
              onChangeText={setFromStation}
              autoCapitalize="characters"
              placeholderTextColor={colors.placeholder}
            />
          </View>
          <View style={styles.arrowContainer}>
            <Ionicons name="arrow-forward-outline" size={24} color={colors.primary} />
          </View>
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>To Station</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
              placeholder="e.g., ND"
              value={toStation}
              onChangeText={setToStation}
              autoCapitalize="characters"
              placeholderTextColor={colors.placeholder}
            />
          </View>
        </View>

        <View style={styles.hoursContainer}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Time Window (Hours) *</Text>
          <View style={styles.hoursButtons}>
            {['2', '4', '6', '12', '24'].map((h) => (
              <TouchableOpacity
                key={h}
                style={[
                  styles.hourButton, 
                  { 
                    backgroundColor: hours === h ? colors.primary : colors.inputBg,
                    borderColor: hours === h ? colors.primary : colors.border
                  }
                ]}
                onPress={() => setHours(h)}
              >
                <Text style={[
                  styles.hourButtonText, 
                  { color: hours === h ? colors.card : colors.textSecondary }
                ]}>
                  {h}h
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={[styles.searchButton, { backgroundColor: colors.primary }]} onPress={fetchLiveStation}>
          <Ionicons name="search-outline" size={20} color={colors.card} />
          <Text style={[styles.searchButtonText, { color: colors.card }]}>Search Trains</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Searching trains...</Text>
        </View>
      )}

      {trains.length > 0 && (
        <View>
          {/* Results Header */}
          <View style={[styles.resultsHeader, { backgroundColor: colors.card }]}>
            <Text style={[styles.resultsTitle, { color: colors.text }]}>
              <Ionicons name="list-outline" size={20} color={colors.text} /> Found {trains.length} Train{trains.length > 1 ? 's' : ''}
            </Text>
            <Text style={[styles.resultsSubtitle, { color: colors.textSecondary }]}>
              From {fromStation.toUpperCase()} {toStation ? `to ${toStation.toUpperCase()}` : ''} in next {hours} hours
            </Text>
          </View>

          {/* Train Cards */}
          {trains.map((train, index) => (
            <View key={`${train.trainNumber}-${index}`} style={[styles.trainCard, { backgroundColor: colors.card, borderLeftColor: colors.primary }]}>
              {/* Header */}
              <View style={styles.trainHeader}>
                <View style={styles.trainTitleContainer}>
                  <TrainTypeIcon type={train.trainType} color={colors.primary} />
                  <View style={styles.trainTitleText}>
                    <Text style={[styles.trainNumber, { color: colors.primary }]}>#{train.trainNumber}</Text>
                    <Text style={[styles.trainName, { color: colors.text }]}>{train.trainName}</Text>
                  </View>
                </View>
                <View style={[styles.typeBadge, { backgroundColor: colors.primary }]}>
                  <Text style={[styles.typeBadgeText, { color: colors.card }]}>{train.trainType}</Text>
                </View>
              </View>

              {/* Timing */}
              <View style={[styles.timingContainer, { backgroundColor: colors.backgroundSecondary }]}>
                <View style={styles.timingBox}>
                  <Text style={[styles.timingLabel, { color: colors.textSecondary }]}>Arrival</Text>
                  <Text style={[styles.timingValue, { color: colors.text }]}><Ionicons name="time-outline" size={16} /> {train.arrivalTime}</Text>
                </View>
                <View style={styles.timingDivider}>
                  <Text style={[styles.timingDividerLine, { color: colors.textSecondary }]}>━━</Text>
                  <Ionicons name="train-outline" size={18} color={colors.textSecondary} />
                  <Text style={[styles.timingDividerLine, { color: colors.textSecondary }]}>━━</Text>
                </View>
                <View style={styles.timingBox}>
                  <Text style={[styles.timingLabel, { color: colors.textSecondary }]}>Departure</Text>
                  <Text style={[styles.timingValue, { color: colors.text }]}><Ionicons name="time-outline" size={16} /> {train.departureTime}</Text>
                </View>
              </View>

              {/* Run Days */}
              <View style={styles.runDaysContainer}>
                <Text style={[styles.runDaysLabel, { color: colors.textSecondary }]}><Ionicons name="calendar-outline" size={14} /> Runs:</Text>
                <View style={[styles.runDaysBadge, { backgroundColor: colors.backgroundSecondary }]}>
                  <Text style={[styles.runDaysText, { color: colors.textSecondary }]}>{getRunDaysString(train.runDays)}</Text>
                </View>
              </View>

              {/* Days Grid */}
              <View style={styles.daysGrid}>
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => {
                  const dayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
                  const isActive = train.runDays[dayKeys[idx] as keyof RunDays];
                  return (
                    <View key={idx} style={[
                      styles.dayCircle, 
                      { backgroundColor: isActive ? colors.primary : 'transparent', borderColor: isActive ? colors.primary : colors.border }
                    ]}>
                      <Text style={[
                        styles.dayText, 
                        { color: isActive ? colors.card : colors.textSecondary }
                      ]}>{day}</Text>
                    </View>
                  );
                })}
              </View>

              {/* Classes */}
              <View style={styles.classesContainer}>
                <Text style={[styles.classesLabel, { color: colors.textSecondary }]}>Available Classes:</Text>
                <View style={styles.classesGrid}>
                  {train.classes.map((cls, idx) => (
                    <View 
                      key={idx} 
                      style={[styles.classBadge, { backgroundColor: getClassColor(cls.value) }]}
                    >
                      <Text style={[styles.classValue, { color: colors.card }]}>{cls.value}</Text>
                      <Text style={[styles.className, { color: colors.card }]}>{cls.name}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          ))}

          {/* Info Card */}
          <View style={[styles.infoCard, { backgroundColor: colors.infoBg }]}>
            <Text style={[styles.infoText, { color: colors.info }]}>
            <Ionicons name="information-circle-outline" size={16} /> Showing trains departing within the next {hours} hours. 
              Timings and availability are subject to change. Please verify before booking.
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 30,
  },
  headerContainer: {
    paddingTop: 50,
    paddingBottom: 25,
    paddingHorizontal: 20,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  icon: {
    marginBottom: 10,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 5,
  },
  searchCard: {
    marginHorizontal: 20,
    marginTop: -20,
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  formRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 15,
  },
  formGroup: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    marginBottom: 6,
    fontWeight: "600",
  },
  input: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 16,
    textTransform: "uppercase",
  },
  arrowContainer: {
    paddingHorizontal: 10,
    paddingBottom: 12,
  },
  hoursContainer: {
    marginBottom: 15,
  },
  hoursButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  hourButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: "center",
  },
  hourButtonText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  searchButton: {
    paddingVertical: 14,
    borderRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  searchButtonText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    marginTop: 40,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
  },
  resultsHeader: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  resultsSubtitle: {
    fontSize: 13,
  },
  trainCard: {
    marginHorizontal: 20,
    marginTop: 15,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
  },
  trainHeader: {
    marginBottom: 12,
  },
  trainTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  trainIcon: {
    marginRight: 10,
  },
  trainTitleText: {
    flex: 1,
  },
  trainNumber: {
    fontSize: 14,
    fontWeight: "bold",
  },
  trainName: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 2,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    alignSelf: "flex-start",
    marginTop: 5,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  timingContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  timingBox: {
    flex: 1,
    alignItems: "center",
  },
  timingLabel: {
    fontSize: 11,
    marginBottom: 4,
    fontWeight: "600",
  },
  timingValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  timingDivider: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  timingDividerLine: {
    fontSize: 12,
  },
  runDaysContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  runDaysLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginRight: 8,
  },
  runDaysBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  runDaysText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  daysGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  dayText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  classesContainer: {
    marginTop: 8,
  },
  classesLabel: {
    fontSize: 12,
    marginBottom: 8,
    fontWeight: "600",
  },
  classesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  classBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
    marginBottom: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  classValue: {
    fontSize: 11,
    fontWeight: "bold",
    marginRight: 4,
  },
  className: {
    fontSize: 10,
  },
  infoCard: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 18,
  },
});
