import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { fetchFromRapidAPI } from '../../utils/api';

type NonStop = {
  si_no?: number;
  station_code?: string;
  station_name?: string;
  distance_from_source?: number;
  sta?: string;
  std?: string;
};

type Station = {
  si_no?: number;
  station_name?: string;
  station_code?: string;
  distance_from_source?: number;
  distance_from_current_station?: number;
  distance_from_current_station_txt?: string;
  sta?: string;
  std?: string;
  eta?: string;
  etd?: string;
  halt?: number;
  a_day?: number;
  arrival_delay?: number;
  platform_number?: number;
  stoppage_number?: number;
  non_stops?: NonStop[];
};

type TrainData = {
  train_name?: string;
  train_number?: string;
  source?: string;
  destination?: string;
  source_stn_name?: string;
  dest_stn_name?: string;
  current_station_code?: string;
  current_station_name?: string;
  status?: string;
  eta?: string;
  etd?: string;
  delay?: number;
  status_as_of?: string;
  status_as_of_min?: number;
  ahead_distance?: number;
  ahead_distance_text?: string;
  distance_from_source?: number;
  total_distance?: number;
  avg_speed?: number;
  train_start_date?: string;
  std?: string;
  journey_time?: number;
  platform_number?: number;
  cur_stn_sta?: string;
  cur_stn_std?: string;
  upcoming_stations?: Station[];
  previous_stations?: Station[];
};

export default function LiveStatusScreen() {
  const [trainNo, setTrainNo] = useState<string>("22955");
  const [startDay, setStartDay] = useState<number>(0); // 0 for Today, 1 for 1 day ago, etc.
  const [loading, setLoading] = useState<boolean>(false);
  const [trainData, setTrainData] = useState<TrainData | null>(null);
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';


  const fetchLiveStatus = async () => {
    try {
      setLoading(true);
      const response = await fetchFromRapidAPI(
        `https://irctc1.p.rapidapi.com/api/v1/liveTrainStatus?trainNo=${trainNo}&startDay=${startDay}`
      );

      if (response.success && response.data.data) {
        setTrainData(response.data.data);
      } else {
        alert("No data received from server");
        setTrainData(null);
      }
    } catch (error) {
      console.log(error);
      alert("Error fetching train status");
    } finally {
      setLoading(false);
    }
  };

  const getDelayColor = (delay?: number) => {
    if (!delay || delay === 0) return colors.success;
    if (delay < 30) return colors.warning;
    return colors.error;
  };

  const getStatusBadge = (delay?: number) => {
    if (!delay || delay === 0) return { text: "ON TIME", color: colors.success };
    if (delay < 30) return { text: `${delay} MIN LATE`, color: colors.warning };
    return { text: `${delay} MIN LATE`, color: colors.error };
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.contentContainer}>
      {/* Header with Train Icon */}
      <View style={[styles.headerContainer, { backgroundColor: colors.primary }]}>
        <Ionicons name="train-outline" size={48} color={colors.card} />
        <Text style={[styles.header, { color: colors.card }]}>Live Train Status</Text>
      </View>

      {/* Search Box */}
      <View style={[styles.searchCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.searchLabel, { color: colors.textSecondary }]}>Enter Train Number</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
          placeholder="e.g., 22955"
          value={trainNo}
          onChangeText={setTrainNo}
          keyboardType="numeric"
          placeholderTextColor={colors.placeholder}
        />

        <Text style={[styles.searchLabel, { color: colors.textSecondary, marginTop: 10 }]}>Select Start Day</Text>
        <View style={styles.daySelector}>
          {['Today', '1 Day Ago', '2 Days Ago', '3 Days Ago', '4 Days Ago'].map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayButton,
                { backgroundColor: startDay === index ? colors.primary : colors.inputBg },
              ]}
              onPress={() => setStartDay(index)}
            >
              <Text style={[
                styles.dayButtonText,
                { color: startDay === index ? colors.card : colors.text },
              ]}>{day}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={fetchLiveStatus}>
          <Ionicons name="search-outline" size={20} color={colors.card} />
          <Text style={[styles.buttonText, { color: colors.card }]}>Track Train</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Fetching live status...</Text>
        </View>
      )}

      {trainData && (
        <View>
          {/* Train Header Card */}
          <View style={[styles.trainHeaderCard, { backgroundColor: colors.card }]}>
            <View style={styles.trainTitleRow}>
              <View style={styles.trainTitleLeft}>
                <Text style={[styles.trainName, { color: colors.text }]}>{trainData.train_name}</Text>
                <Text style={[styles.trainNumber, { color: colors.textSecondary }]}>#{trainData.train_number}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusBadge(trainData.delay).color }]}>
                <Text style={[styles.statusBadgeText, { color: colors.card }]}>{getStatusBadge(trainData.delay).text}</Text>
              </View>
            </View>

            {/* Route Info */}
            <View style={[styles.routeContainer, { backgroundColor: colors.backgroundSecondary }]}>
              <View style={styles.routeStation}>
                <Text style={[styles.routeStationCode, { color: colors.primary }]}>{trainData.source}</Text>
                <Text style={[styles.routeStationName, { color: colors.textSecondary }]}>{trainData.source_stn_name}</Text>
              </View>
              <View style={styles.routeArrow}>
                <Ionicons name="arrow-forward-outline" size={24} color={colors.primary} />
              </View>
              <View style={styles.routeStation}>
                <Text style={[styles.routeStationCode, { color: colors.primary, textAlign: 'right' }]}>{trainData.destination}</Text>
                <Text style={[styles.routeStationName, { color: colors.textSecondary, textAlign: 'right' }]}>{trainData.dest_stn_name}</Text>
              </View>
            </View>

            {/* Journey Details */}
            <View style={styles.journeyDetails}>
              <View style={styles.journeyItem}>
                <Text style={[styles.journeyLabel, { color: colors.textSecondary }]}>Start Date</Text>
                <Text style={[styles.journeyValue, { color: colors.text }]}>{trainData.train_start_date}</Text>
              </View>
              <View style={styles.journeyItem}>
                <Text style={[styles.journeyLabel, { color: colors.textSecondary }]}>Departure</Text>
                <Text style={[styles.journeyValue, { color: colors.text }]}>{trainData.std}</Text>
              </View>
              <View style={styles.journeyItem}>
                <Text style={[styles.journeyLabel, { color: colors.textSecondary }]}>Journey Time</Text>
                <Text style={[styles.journeyValue, { color: colors.text }]}>{trainData.journey_time ? `${Math.floor(trainData.journey_time / 60)}h ${trainData.journey_time % 60}m` : 'N/A'}</Text>
              </View>
            </View>
          </View>

          {/* Current Status Card */}
          <View style={[styles.currentStatusCard, { backgroundColor: colors.card }]}>
            <View style={styles.currentStatusHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}><Ionicons name="map-outline" size={20} /> Current Status</Text>
              <Text style={[styles.statusTime, { color: colors.textSecondary }]}>{trainData.status_as_of}</Text>
            </View>

            <View style={[styles.currentLocationBox, { backgroundColor: colors.background, borderLeftColor: colors.primary }]}>
              <View style={styles.currentLocationRow}>
                <Text style={[styles.currentLocationLabel, { color: colors.textSecondary }]}>Current Station</Text>
                <Text style={[styles.currentLocationValue, { color: colors.text }]}>
                  {trainData.current_station_name} ({trainData.current_station_code})
                </Text>
              </View>
              <View style={styles.currentLocationRow}>
                <Text style={[styles.currentLocationLabel, { color: colors.textSecondary }]}>Platform</Text>
                <Text style={[styles.currentLocationValue, { color: colors.text }]}>
                  {trainData.platform_number || 'Not Available'}
                </Text>
              </View>
              <View style={styles.currentLocationRow}>
                <Text style={[styles.currentLocationLabel, { color: colors.textSecondary }]}>ETA/ETD</Text>
                <Text style={[styles.currentLocationValue, { color: colors.text }]}>{trainData.eta} / {trainData.etd}</Text>
              </View>
              <View style={styles.currentLocationRow}>
                <Text style={[styles.currentLocationLabel, { color: colors.textSecondary }]}>Distance Ahead</Text>
                <Text style={[styles.currentLocationValue, { color: colors.text }]}>{trainData.ahead_distance_text}</Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { backgroundColor: colors.backgroundSecondary }]}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: `${((trainData.distance_from_source || 0) / (trainData.total_distance || 1)) * 100}%`,
                      backgroundColor: colors.primary 
                    }
                  ]} 
                />
              </View>
              <Text style={[styles.progressText, { color: colors.textSecondary }]}>
                {trainData.distance_from_source} / {trainData.total_distance} km completed
              </Text>
            </View>
          </View>

          {/* Upcoming Stations */}
          {trainData.upcoming_stations && trainData.upcoming_stations.length > 0 && (
            <View style={[styles.stationsCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}><Ionicons name="arrow-forward-circle-outline" size={20} /> Upcoming Stations</Text>
              {trainData.upcoming_stations.map((station, index) => (
                <View key={index} style={styles.stationItem}>
                  <View style={[styles.stationDot, { backgroundColor: colors.textSecondary, borderColor: colors.card }]} />
                  <View style={[styles.stationContent, { backgroundColor: colors.backgroundSecondary }]}>
                    <View style={styles.stationHeader}>
                      <Text style={[styles.stationName, { color: colors.text }]}>
                        {station.station_name} ({station.station_code})
                      </Text>
                      {station.platform_number ? (
                        <Text style={[styles.platformText, { backgroundColor: colors.background, color: colors.textSecondary }]}>PF {station.platform_number}</Text>
                      ) : null}
                    </View>
                    <View style={styles.stationDetails}>
                      <Text style={[styles.stationDetailText, { color: colors.textSecondary }]}>
                        <Ionicons name="navigate-outline" size={13} /> {station.distance_from_current_station_txt || `${station.distance_from_current_station} km`}
                      </Text>
                      <Text style={[styles.stationDetailText, { color: colors.textSecondary }]}>
                        <Ionicons name="time-outline" size={13} /> ETA: {station.eta || 'N/A'}
                      </Text>
                      {station.halt ? (
                        <Text style={[styles.stationDetailText, { color: colors.textSecondary }]}><Ionicons name="hourglass-outline" size={13} /> Halt: {station.halt} min</Text>
                      ) : null}
                    </View>
                    {/* Non-stop stations */}
                    {station.non_stops && station.non_stops.length > 0 && (
                      <View style={[styles.nonStopsContainer, { backgroundColor: colors.infoBg }]}>
                        <Text style={[styles.nonStopsTitle, { color: colors.info }]}>Non-stop stations:</Text>
                        <Text style={[styles.nonStopsList, { color: colors.textSecondary }]}>
                          {station.non_stops.map(ns => ns.station_code).join(', ')}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Previous Stations */}
          {trainData.previous_stations && trainData.previous_stations.length > 0 && (
            <View style={[styles.stationsCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}><Ionicons name="checkmark-done-circle-outline" size={20} /> Previous Stations</Text>
              {trainData.previous_stations.slice(-10).reverse().map((station, index) => (
                <View key={index} style={styles.stationItem}>
                  <View style={[styles.stationDot, styles.stationDotPassed, { backgroundColor: colors.success, borderColor: colors.card }]} />
                  <View style={[styles.stationContent, { backgroundColor: colors.backgroundSecondary }]}>
                    <View style={styles.stationHeader}>
                      <Text style={[styles.stationName, { color: colors.text }]}>
                        {station.station_name} ({station.station_code})
                      </Text>
                      {station.arrival_delay !== undefined && station.arrival_delay > 0 && (
                        <Text style={[styles.delayBadge, { backgroundColor: getDelayColor(station.arrival_delay), color: colors.card }]}>
                          +{station.arrival_delay}m
                        </Text>
                      )}
                      {station.arrival_delay === 0 && (
                        <Text style={[styles.delayBadge, { backgroundColor: colors.success, color: colors.card }]}>
                          On Time
                        </Text>
                      )}
                    </View>
                    <View style={styles.stationDetails}>
                      <Text style={[styles.stationDetailText, { color: colors.textSecondary }]}>
                        <Ionicons name="navigate-outline" size={13} /> {station.distance_from_source} km from source
                      </Text>
                      <Text style={[styles.stationDetailText, { color: colors.textSecondary }]}>
                        <Ionicons name="time-outline" size={13} /> Actual: {station.eta || 'N/A'}
                      </Text>
                      {station.platform_number ? (
                        <Text style={[styles.stationDetailText, { color: colors.textSecondary }]}><Ionicons name="trail-sign-outline" size={13} /> PF {station.platform_number}</Text>
                      ) : null}
                    </View>
                    {/* Non-stop stations */}
                    {station.non_stops && station.non_stops.length > 0 && (
                      <View style={[styles.nonStopsContainer, { backgroundColor: colors.infoBg }]}>
                        <Text style={[styles.nonStopsTitle, { color: colors.info }]}>Passed without stop:</Text>
                        <Text style={[styles.nonStopsList, { color: colors.textSecondary }]}>
                          {station.non_stops.map(ns => ns.station_code).join(', ')}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
              {trainData.previous_stations.length > 10 && (
                <Text style={[styles.moreStations, { color: colors.textSecondary }]}>
                  + {trainData.previous_stations.length - 10} more stations
                </Text>
              )}
            </View>
          )}

          {/* Disclaimer */}
          <View style={[styles.disclaimerCard, { backgroundColor: colors.infoBg, borderLeftColor: colors.info }]}>
            <Text style={[styles.disclaimerText, { color: colors.info }]}>
              <Ionicons name="information-circle-outline" size={14} /> Train status is compiled from crowd-sourced data and may vary. 
              Please recheck at the station for final confirmation.
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
    fontSize: 16,
  },
  daySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 5,
  },
  dayButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayButtonText: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
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
    marginTop: 40,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: "#666",
  },
  trainHeaderCard: {
    backgroundColor: "#FFF",
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
  trainTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  trainTitleLeft: {
    flex: 1,
  },
  trainName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  trainNumber: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusBadgeText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  routeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F5F7FA",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  routeStation: {
    flex: 1,
  },
  routeStationCode: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1976D2",
  },
  routeStationName: {
    fontSize: 11,
    color: "#666",
    marginTop: 2,
  },
  routeArrow: {
    marginHorizontal: 10,
  },
  arrowIcon: {
    fontSize: 24,
    color: "#1976D2",
  },
  journeyDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  journeyItem: {
    flex: 1,
    alignItems: "center",
  },
  journeyLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  journeyValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  currentStatusCard: {
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    marginTop: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  currentStatusHeader: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 5,
  },
  statusTime: {
    fontSize: 12,
    color: "#999",
  },
  currentLocationBox: {
    backgroundColor: "#F0F8FF",
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#1976D2",
  },
  currentLocationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  currentLocationLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },
  currentLocationValue: {
    fontSize: 14,
    color: "#1A1A1A",
    fontWeight: "bold",
    flex: 1,
    textAlign: "right",
  },
  progressContainer: {
    marginTop: 15,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 10,
  },
  progressText: {
    fontSize: 12,
    color: "#666",
    marginTop: 6,
    textAlign: "center",
  },
  stationsCard: {
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    marginTop: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  stationItem: {
    flexDirection: "row",
    marginBottom: 15,
    position: "relative",
  },
  stationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#1976D2",
    marginTop: 5,
    marginRight: 12,
    borderWidth: 2,
    borderColor: "#FFF",
    shadowColor: "#1976D2",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  stationDotPassed: {
    backgroundColor: "#4CAF50",
    shadowColor: "#4CAF50",
  },
  stationContent: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 10,
  },
  stationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  stationName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A1A",
    flex: 1,
  },
  platformText: {
    fontSize: 12,
    color: "#1976D2",
    fontWeight: "600",
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
    marginLeft: 8,
  },
  delayBadge: {
    fontSize: 11,
    color: "#FFF",
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
    marginLeft: 8,
  },
  stationDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  stationDetailText: {
    fontSize: 13,
    color: "#666",
    marginRight: 10,
  },
  nonStopsContainer: {
    marginTop: 8,
    backgroundColor: "#FFF3E0",
    padding: 8,
    borderRadius: 6,
  },
  nonStopsTitle: {
    fontSize: 11,
    color: "#F57C00",
    fontWeight: "600",
    marginBottom: 3,
  },
  nonStopsList: {
    fontSize: 11,
    color: "#666",
  },
  moreStations: {
    textAlign: "center",
    fontSize: 14,
    color: "#1976D2",
    fontWeight: "600",
    marginTop: 10,
  },
  disclaimerCard: {
    backgroundColor: "#FFF9C4",
    marginHorizontal: 20,
    marginTop: 15,
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#FBC02D",
  },
  disclaimerText: {
    fontSize: 12,
    color: "#666",
    lineHeight: 18,
  },
});
