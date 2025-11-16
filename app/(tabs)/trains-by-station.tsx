import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

type TrainClass = string;

type Train = {
  trainNo: string;
  trainName: string;
  arrivalTime: string;
  departureTime: string;
  classes: TrainClass[];
};

type StationData = {
  originating: Train[];
  passing: Train[];
};

export default function TrainsByStationScreen() {
  const [stationCode, setStationCode] = useState<string>("MAN");
  const [loading, setLoading] = useState<boolean>(false);
  const [stationData, setStationData] = useState<StationData | null>(null);
  const [stationName, setStationName] = useState<string>("");
  const { theme, colors } = useTheme();
  const isDark = theme === 'dark';

  const fetchTrainsByStation = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://irctc1.p.rapidapi.com/api/v3/getTrainsByStation?stationCode=${stationCode.toUpperCase()}`,
        {
          method: "GET",
          headers: {
            "x-rapidapi-host": "irctc1.p.rapidapi.com",
            "x-rapidapi-key": "22e9b8a2aemsh0912f6a2da48e8cp1e2cc0jsnba91c3220474",
            "x-rapidapi-ua": "RapidAPI-Playground"
          }
        }
      );

      const json = await response.json();
      console.log("Station API Response:", json);
      
      if (json.message && json.message.includes("exceeded")) {
        alert("API quota exceeded. Please try again later or upgrade your plan.");
        setStationData(null);
      } else if (json.status && json.data) {
        setStationData(json.data);
        setStationName(stationCode.toUpperCase());
      } else {
        alert("No data found for this station code");
        setStationData(null);
      }
    } catch (error) {
      console.log(error);
      alert("Error fetching trains by station");
    } finally {
      setLoading(false);
    }
  };

  const getClassBadgeColor = (cls: string) => {
    const colorMap: { [key: string]: string } = {
      '1A': '#8B4513', '2A': '#FF6B6B', '3A': '#4ECDC4', 'SL': '#95E1D3',
      '2S': '#FFA07A', 'CC': '#DDA15E', 'EC': '#BC6C25', 'FC': '#606C38',
      '3E': '#283618', 'EA': '#FEFAE0', 'GN': '#D4A373', 'TQ': '#FAEDCD',
      'LD': '#E9EDC9', 'SS': '#CCD5AE',
    };
    return colorMap[cls] || colors.textTertiary;
  };

  const getUniqueTrains = (trains: Train[]) => {
    const uniqueMap = new Map<string, Train>();
    trains.forEach(train => {
      if (!uniqueMap.has(train.trainNo)) {
        uniqueMap.set(train.trainNo, train);
      }
    });
    return Array.from(uniqueMap.values());
  };

  const renderTrainCard = (train: Train, index: number, type: 'originating' | 'passing') => (
    <View key={`${train.trainNo}-${index}`} style={[styles.trainCard, { backgroundColor: colors.card, borderLeftColor: colors.primary }]}>
      <View style={styles.trainCardHeader}>
        <View style={styles.trainTitleContainer}>
          <Ionicons name="train-outline" size={24} color={colors.primary} />
          <View style={styles.trainTitleText}>
            <Text style={[styles.trainNumber, { color: colors.primary }]}>#{train.trainNo}</Text>
            <Text style={[styles.trainNameText, { color: colors.text }]}>{train.trainName}</Text>
          </View>
        </View>
        <View style={[styles.typeBadge, { backgroundColor: type === 'originating' ? colors.success : colors.info }]}>
          <Text style={styles.typeBadgeText}>
            {type === 'originating' ? '🏁 Starts Here' : '⚡ Passes Through'}
          </Text>
        </View>
      </View>

      <View style={[styles.timeContainer, { backgroundColor: colors.backgroundSecondary }]}>
        <View style={styles.timeBox}>
          <Text style={[styles.timeLabel, { color: colors.textSecondary }]}>Arrival</Text>
          <Text style={[styles.timeValue, { color: colors.text }]}>
            <Ionicons name="time-outline" size={14} color={colors.text} /> {train.arrivalTime}
          </Text>
        </View>
        <View style={styles.timeDivider}>
          <Text style={[styles.timeDividerText, { color: colors.primary }]}>→</Text>
        </View>
        <View style={styles.timeBox}>
          <Text style={[styles.timeLabel, { color: colors.textSecondary }]}>Departure</Text>
          <Text style={[styles.timeValue, { color: colors.text }]}>
            <Ionicons name="time-outline" size={14} color={colors.text} /> {train.departureTime}
          </Text>
        </View>
      </View>

      <View style={styles.classesContainer}>
        <Text style={[styles.classesLabel, { color: colors.textSecondary }]}>Available Classes:</Text>
        <View style={styles.classesGrid}>
          {train.classes.map((cls, idx) => (
            <View 
              key={idx} 
              style={[
                styles.classBadge, 
                { backgroundColor: getClassBadgeColor(cls) }
              ]}
            >
              <Text style={styles.classBadgeText}>{cls}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.trainsByStationBg }]} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={[styles.headerContainer, { backgroundColor: colors.trainsByStation }]}>
        <Ionicons name="business-outline" size={48} color={colors.text} />
        <Text style={[styles.header, { color: colors.text }]}>Trains by Station</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>Find all trains at your station</Text>
      </View>

      {/* Search Box */}
      <View style={[styles.searchCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.searchLabel, { color: colors.textSecondary }]}>Enter Station Code</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
          placeholder="e.g., MAN, ADI, BDTS"
          value={stationCode}
          onChangeText={setStationCode}
          autoCapitalize="characters"
          placeholderTextColor={colors.placeholder}
        />
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.trainsByStation }]} onPress={fetchTrainsByStation}>
          <Ionicons name="search-outline" size={20} color={colors.text} />
          <Text style={[styles.buttonText, { color: colors.text }]}>Find Trains</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Searching trains...</Text>
        </View>
      )}

      {stationData && (
        <View>
          {/* Station Info Banner */}
          <View style={[styles.stationBanner, { backgroundColor: colors.card }]}>
            <Text style={[styles.stationBannerTitle, { color: colors.text }]}>
              <Ionicons name="location-outline" size={20} color={colors.text} /> Station: {stationName}
            </Text>
            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <Text style={[styles.statNumber, { color: colors.primary }]}>{getUniqueTrains(stationData.originating).length}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Originating</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
              <View style={styles.statBox}>
                <Text style={[styles.statNumber, { color: colors.primary }]}>{getUniqueTrains(stationData.passing).length}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Passing</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
              <View style={styles.statBox}>
                <Text style={[styles.statNumber, { color: colors.primary }]}>
                  {getUniqueTrains(stationData.originating).length + getUniqueTrains(stationData.passing).length}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Trains</Text>
              </View>
            </View>
          </View>

          {/* Originating Trains */}
          {stationData.originating && getUniqueTrains(stationData.originating).length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>🏁 Trains Starting from {stationName}</Text>
                <View style={[styles.countBadge, { backgroundColor: colors.primary }]}>
                  <Text style={[styles.countBadgeText, { color: colors.text }]}>{getUniqueTrains(stationData.originating).length}</Text>
                </View>
              </View>
              {getUniqueTrains(stationData.originating).map((train, index) => 
                renderTrainCard(train, index, 'originating')
              )}
            </View>
          )}

          {/* Passing Trains */}
          {stationData.passing && getUniqueTrains(stationData.passing).length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>⚡ Trains Passing Through {stationName}</Text>
                <View style={[styles.countBadge, { backgroundColor: colors.primary }]}>
                  <Text style={[styles.countBadgeText, { color: colors.text }]}>{getUniqueTrains(stationData.passing).length}</Text>
                </View>
              </View>
              {getUniqueTrains(stationData.passing).map((train, index) => 
                renderTrainCard(train, index, 'passing')
              )}
            </View>
          )}

          {/* Info Card */}
          <View style={[styles.infoCard, { backgroundColor: colors.infoBg }]}>
            <Text style={[styles.infoText, { color: colors.info }]}>
              <Ionicons name="information-circle-outline" size={16} color={colors.info} /> Showing all trains that either start from or pass through {stationName} station.
              Class codes: 1A (First AC), 2A (Second AC), 3A (Third AC), SL (Sleeper), 2S (Second Sitting), CC (Chair Car), EC (Executive Chair), etc.
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
  header: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
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
  searchLabel: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "600",
  },
  input: {
    padding: 14,
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 18,
    letterSpacing: 2,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 12,
  },
  button: {
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
  buttonText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  stationBanner: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  stationBannerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: '100%',
  },
  section: {
    marginTop: 25,
    marginHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
  },
  countBadgeText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  trainCard: {
    marginBottom: 15,
    borderRadius: 12,
    padding: 15,
    borderLeftWidth: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  trainCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  trainTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  trainTitleText: {
    flex: 1,
  },
  trainNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  trainNameText: {
    fontSize: 14,
    flexWrap: 'wrap',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 10,
  },
  typeBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  timeBox: {
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  timeDivider: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeDividerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  classesContainer: {
    marginTop: 10,
  },
  classesLabel: {
    fontSize: 12,
    marginBottom: 8,
  },
  classesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  classBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  classBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoCard: {
    margin: 20,
    padding: 15,
    borderRadius: 10,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 18,
  },
});
