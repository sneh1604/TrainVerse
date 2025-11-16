import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

type Passenger = {
  passengerSerialNumber: number;
  passengerFoodChoice: string;
  concessionOpted: boolean;
  forGoConcessionOpted: boolean;
  passengerIcardFlag: boolean;
  childBerthFlag: boolean;
  passengerNationality: string;
  passengerQuota: string;
  passengerCoachPosition: number;
  waitListType: number;
  bookingStatusIndex: number;
  bookingStatus: string;
  bookingCoachId: string;
  bookingBerthNo: number;
  bookingStatusDetails: string;
  currentStatusIndex: number;
  currentStatus: string;
  currentCoachId: string;
  currentBerthNo: number;
  currentStatusDetails: string;
};

type PNRData = {
  pnrNumber: string;
  dateOfJourney: string;
  trainNumber: string;
  trainName: string;
  sourceStation: string;
  destinationStation: string;
  reservationUpto: string;
  boardingPoint: string;
  journeyClass: string;
  numberOfpassenger: number;
  chartStatus: string;
  informationMessage: string[];
  passengerList: Passenger[];
  timeStamp: string;
  bookingFare: number;
  ticketFare: number;
  quota: string;
  reasonType: string;
  ticketTypeInPrs: string;
  waitListType: number;
  bookingDate: string;
  arrivalDate: string;
  mobileNumber: string;
  distance: number;
  isWL: string;
};

export default function PNRStatusScreen() {
  const [pnrNumber, setPnrNumber] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [pnrData, setPnrData] = useState<PNRData | null>(null);
  const [usingSampleData, setUsingSampleData] = useState<boolean>(false);
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';

  const fetchPNRStatus = async () => {
    if (!pnrNumber || pnrNumber.length !== 10) {
      alert("Please enter a valid 10-digit PNR number");
      return;
    }

    try {
      setLoading(true);
      setUsingSampleData(false);

      const response = await fetch(
        `https://irctc-indian-railway-pnr-status.p.rapidapi.com/getPNRStatus/${pnrNumber}`,
        {
          method: "GET",
          headers: {
            "x-rapidapi-host": "irctc-indian-railway-pnr-status.p.rapidapi.com",
            "x-rapidapi-key": "22e9b8a2aemsh0912f6a2da48e8cp1e2cc0jsnba91c3220474"
          }
        }
      );

      const json = await response.json();
      console.log("PNR API Response:", json);

      if (json.message && json.message.includes("exceeded")) {
        alert("API quota exceeded. Please try again later.");
        setPnrData(null);
      } else if (json.success && json.data) {
        setPnrData(json.data);
      } else {
        alert("Invalid PNR number or data not found.");
        setPnrData(null);
      }
    } catch (error) {
      console.log(error);
      alert("An error occurred while fetching PNR status.");
      setPnrData(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    if (status.includes('CNF')) return colors.success;
    if (status.includes('RAC')) return colors.info;
    if (status.includes('WL')) return colors.warning;
    if (status.includes('CAN')) return colors.error;
    return colors.textSecondary;
  };

  const getStatusIcon = (status: string): keyof typeof Ionicons.glyphMap => {
    if (status.includes('CNF')) return 'checkmark-circle-outline';
    if (status.includes('RAC')) return 'swap-horizontal-outline';
    if (status.includes('WL')) return 'hourglass-outline';
    if (status.includes('CAN')) return 'close-circle-outline';
    return 'help-circle-outline';
  };

  const getBerthType = (berthNo: number) => {
    const remainder = berthNo % 8;
    const berthTypes: { [key: number]: string } = {
      1: 'Lower',
      2: 'Middle',
      3: 'Upper',
      4: 'Lower',
      5: 'Middle',
      6: 'Upper',
      7: 'Side Lower',
      0: 'Side Upper'
    };
    return berthTypes[remainder] || 'Unknown';
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={[styles.headerContainer, { backgroundColor: colors.primary }]}>
        <Ionicons name="ticket-outline" size={48} color={colors.card} />
        <Text style={[styles.header, { color: colors.card }]}>PNR Status</Text>
        <Text style={[styles.headerSubtitle, { color: isDark ? colors.text : colors.background }]}>Check your ticket confirmation</Text>
      </View>

      {/* Search Form */}
      <View style={[styles.searchCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.searchLabel, { color: colors.textSecondary }]}>Enter 10-Digit PNR Number</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
          placeholder="e.g., 2142173426"
          value={pnrNumber}
          onChangeText={setPnrNumber}
          keyboardType="numeric"
          maxLength={10}
          placeholderTextColor={colors.placeholder}
        />
        <TouchableOpacity style={[styles.searchButton, { backgroundColor: colors.primary }]} onPress={fetchPNRStatus}>
          <Ionicons name="search-outline" size={20} color={colors.card} />
          <Text style={[styles.searchButtonText, { color: colors.card }]}>Check PNR Status</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Fetching PNR status...</Text>
        </View>
      )}

      {pnrData && (
        <View>
          {/* Sample Data Notice */}
          {usingSampleData && (
            <View style={[styles.sampleDataNotice, { backgroundColor: colors.infoBg, borderLeftColor: colors.info }]}>
              <Text style={[styles.sampleDataText, { color: colors.info }]}>
                <Ionicons name="information-circle-outline" size={14} /> Showing sample data (API quota exceeded or error occurred)
              </Text>
            </View>
          )}

          {/* PNR Header Card */}
          <View style={[styles.pnrHeaderCard, { backgroundColor: colors.card }]}>
            <View style={styles.pnrHeaderTop}>
              <Text style={[styles.pnrLabel, { color: colors.textSecondary }]}>PNR Number</Text>
              <Text style={[styles.pnrNumber, { color: colors.primary }]}>{pnrData.pnrNumber}</Text>
            </View>
            <View style={[styles.chartStatusContainer, { borderTopColor: colors.border }]}>
              <Text style={[styles.chartStatus, { 
                color: pnrData.chartStatus.includes('Not') ? colors.warning : colors.success 
              }]}>
                <Ionicons name="clipboard-outline" size={16} /> {pnrData.chartStatus}
              </Text>
            </View>
          </View>

          {/* Train Details Card */}
          <View style={[styles.trainCard, { backgroundColor: colors.card }]}>
            <View style={styles.trainHeader}>
              <Text style={[styles.trainNumber, { color: colors.primary }]}>#{pnrData.trainNumber}</Text>
              <Text style={[styles.trainName, { color: colors.text }]}>{pnrData.trainName}</Text>
            </View>

            <View style={[styles.routeContainer, { backgroundColor: colors.backgroundSecondary }]}>
              <View style={styles.stationBox}>
                <Text style={[styles.stationCode, { color: colors.text }]}>{pnrData.sourceStation}</Text>
                <Text style={[styles.stationLabel, { color: colors.textSecondary }]}>From</Text>
              </View>
              <View style={styles.routeArrowBox}>
                <Ionicons name="arrow-forward-outline" size={24} color={colors.primary} />
              </View>
              <View style={styles.stationBox}>
                <Text style={[styles.stationCode, { color: colors.text, textAlign: 'right' }]}>{pnrData.destinationStation}</Text>
                <Text style={[styles.stationLabel, { color: colors.textSecondary, textAlign: 'right' }]}>To</Text>
              </View>
            </View>

            <View style={styles.detailsGrid}>
              <View style={[styles.detailItem, { borderBottomColor: colors.border }]}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}><Ionicons name="calendar-outline" size={14} /> Journey Date</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{pnrData.dateOfJourney}</Text>
              </View>
              <View style={[styles.detailItem, { borderBottomColor: colors.border }]}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}><Ionicons name="location-outline" size={14} /> Boarding Point</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{pnrData.boardingPoint}</Text>
              </View>
              <View style={[styles.detailItem, { borderBottomColor: colors.border }]}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}><Ionicons name="ribbon-outline" size={14} /> Class</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{pnrData.journeyClass}</Text>
              </View>
              <View style={[styles.detailItem, { borderBottomColor: 'transparent' }]}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}><Ionicons name="map-outline" size={14} /> Distance</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{pnrData.distance} km</Text>
              </View>
            </View>
          </View>

          {/* Fare Card */}
          <View style={[styles.fareCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.fareCardTitle, { color: colors.text }]}><Ionicons name="wallet-outline" size={18} /> Fare Information</Text>
            <View style={[styles.fareRow, { borderBottomColor: colors.border }]}>
              <Text style={[styles.fareLabel, { color: colors.textSecondary }]}>Booking Fare</Text>
              <Text style={[styles.fareValue, { color: colors.text }]}>₹{pnrData.bookingFare}</Text>
            </View>
            <View style={[styles.fareRow, { borderBottomColor: colors.border }]}>
              <Text style={[styles.fareLabel, { color: colors.textSecondary }]}>Current Ticket Fare</Text>
              <Text style={[styles.fareValueLarge, { color: colors.primary }]}>₹{pnrData.ticketFare}</Text>
            </View>
            <View style={[styles.fareRow, { borderBottomColor: 'transparent' }]}>
              <Text style={[styles.fareLabel, { color: colors.textSecondary }]}>Quota</Text>
              <Text style={[styles.fareValue, { color: colors.text }]}>{pnrData.quota}</Text>
            </View>
          </View>

          {/* Passenger List */}
          <View style={styles.passengersSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              <Ionicons name="people-outline" size={20} /> Passenger Details ({pnrData.numberOfpassenger} Passenger{pnrData.numberOfpassenger > 1 ? 's' : ''})
            </Text>

            {pnrData.passengerList.map((passenger, index) => (
              <View key={index} style={[styles.passengerCard, { backgroundColor: colors.card }]}>
                <View style={[styles.passengerHeader, { borderBottomColor: colors.border }]}>
                  <Text style={[styles.passengerNumber, { color: colors.text }]}>Passenger {passenger.passengerSerialNumber}</Text>
                  <View style={[
                    styles.statusBadge, 
                    { backgroundColor: getStatusColor(passenger.currentStatus) }
                  ]}>
                    <Ionicons name={getStatusIcon(passenger.currentStatus)} size={14} color={colors.card} />
                    <Text style={[styles.statusText, { color: colors.card }]}>{passenger.currentStatus}</Text>
                  </View>
                </View>

                {/* Booking Status */}
                <View style={styles.statusSection}>
                  <Text style={[styles.statusSectionTitle, { color: colors.textSecondary }]}>Booking Status</Text>
                  <View style={[styles.statusDetailBox, { backgroundColor: colors.backgroundSecondary }]}>
                    <View style={styles.statusDetailRow}>
                      <Text style={[styles.statusDetailLabel, { color: colors.textSecondary }]}>Status:</Text>
                      <Text style={[styles.statusDetailValue, { color: colors.text }]}>{passenger.bookingStatusDetails}</Text>
                    </View>
                    {passenger.bookingCoachId && (
                      <>
                        <View style={styles.statusDetailRow}>
                          <Text style={[styles.statusDetailLabel, { color: colors.textSecondary }]}>Coach:</Text>
                          <Text style={[styles.statusDetailValue, { color: colors.text }]}>{passenger.bookingCoachId}</Text>
                        </View>
                        <View style={styles.statusDetailRow}>
                          <Text style={[styles.statusDetailLabel, { color: colors.textSecondary }]}>Berth:</Text>
                          <Text style={[styles.statusDetailValue, { color: colors.text }]}>
                            {passenger.bookingBerthNo} ({getBerthType(passenger.bookingBerthNo)})
                          </Text>
                        </View>
                      </>
                    )}
                  </View>
                </View>

                {/* Current Status */}
                <View style={styles.statusSection}>
                  <Text style={[styles.statusSectionTitle, { color: colors.textSecondary }]}>Current Status</Text>
                  <View style={[styles.statusDetailBox, { backgroundColor: colors.backgroundSecondary }]}>
                    <View style={styles.statusDetailRow}>
                      <Text style={[styles.statusDetailLabel, { color: colors.textSecondary }]}>Status:</Text>
                      <Text style={[styles.statusDetailValue, { color: colors.text, fontWeight: 'bold' }]}>{passenger.currentStatusDetails}</Text>
                    </View>
                    {passenger.currentCoachId && (
                      <>
                        <View style={styles.statusDetailRow}>
                          <Text style={[styles.statusDetailLabel, { color: colors.textSecondary }]}>Coach:</Text>
                          <Text style={[styles.statusDetailValue, { color: colors.text, fontWeight: 'bold' }]}>{passenger.currentCoachId}</Text>
                        </View>
                        <View style={styles.statusDetailRow}>
                          <Text style={[styles.statusDetailLabel, { color: colors.textSecondary }]}>Berth:</Text>
                          <Text style={[styles.statusDetailValue, { color: colors.text, fontWeight: 'bold' }]}>
                            {passenger.currentBerthNo} ({getBerthType(passenger.currentBerthNo)})
                          </Text>
                        </View>
                      </>
                    )}
                  </View>
                </View>
              </View>
            ))}
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
    color: "#666",
  },
  sampleDataNotice: {
    backgroundColor: "#FFF3E0",
    marginHorizontal: 20,
    marginTop: 20,
    padding: 12,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#FF9800",
  },
  sampleDataText: {
    fontSize: 13,
    color: "#E65100",
    fontWeight: "600",
  },
  pnrHeaderCard: {
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
  pnrHeaderTop: {
    alignItems: "center",
    marginBottom: 12,
  },
  pnrLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },
  pnrNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#D32F2F",
    letterSpacing: 2,
  },
  chartStatusContainer: {
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  chartStatus: {
    fontSize: 16,
    fontWeight: "bold",
  },
  trainCard: {
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    marginTop: 15,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
  },
  trainHeader: {
    marginBottom: 15,
    alignItems: "center",
  },
  trainNumber: {
    fontSize: 16,
    color: "#D32F2F",
    fontWeight: "bold",
  },
  trainName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginTop: 4,
  },
  routeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFEBEE",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  stationBox: {
    alignItems: "center",
  },
  stationCode: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#D32F2F",
  },
  stationLabel: {
    fontSize: 11,
    color: "#666",
    marginTop: 4,
  },
  routeArrowBox: {
    flex: 1,
    alignItems: "center",
  },
  routeArrow: {
    fontSize: 20,
    color: "#D32F2F",
  },
  detailsGrid: {
    gap: 12,
  },
  detailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  fareCard: {
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    marginTop: 15,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
  },
  fareCardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  fareRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  fareLabel: {
    fontSize: 14,
    color: "#666",
  },
  fareValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  fareValueLarge: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#D32F2F",
  },
  passengersSection: {
    marginTop: 15,
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 15,
  },
  passengerCard: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  passengerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#F0F0F0",
  },
  passengerNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusIcon: {
    fontSize: 14,
  },
  statusText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "bold",
  },
  statusSection: {
    marginBottom: 12,
  },
  statusSectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  statusDetailBox: {
    backgroundColor: "#F9F9F9",
    padding: 12,
    borderRadius: 8,
    gap: 6,
  },
  statusDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statusDetailLabel: {
    fontSize: 13,
    color: "#666",
  },
  statusDetailValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  additionalInfo: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    gap: 4,
  },
  additionalInfoText: {
    fontSize: 12,
    color: "#666",
  },
  bookingDetailsCard: {
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    marginTop: 15,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
  },
  bookingDetailsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  timelineItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  timelineLabel: {
    fontSize: 13,
    color: "#666",
  },
  timelineValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  infoCard: {
    backgroundColor: "#E3F2FD",
    marginHorizontal: 20,
    marginTop: 15,
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#2196F3",
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1565C0",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: "#666",
    lineHeight: 20,
  },
});
