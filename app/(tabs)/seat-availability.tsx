import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { fetchFromRapidAPI } from '../../utils/api';

type Charges = {
  totalCollectibleAmount: number;
  baseFare: number;
  superfastCharge: number;
  fuelAmount: number;
  totalConcession: number;
  tatkalFare: number;
  serviceTax: number;
  otherCharge: number;
  cateringCharge: number;
  reservationCharge: number;
  totalFare: number;
  travelInsuranceCharge: number;
  travelInsuranceServiceTax: number;
  wpServiceCharge: number;
  wpServiceTax: number;
  dynamicFare: number;
};

type Availability = {
  date: string;
  status: string;
  type: string;
  prediction?: number;
  confirmedAvailability: boolean;
};

type AvailabilityClass = {
  reservationClass: string;
  charges: Charges;
  availabilities: Availability[];
};

type SeatAvailabilityData = {
  trainCode: string;
  availabilityClassList: AvailabilityClass[];
};

// Sample data for testing
const SAMPLE_DATA: SeatAvailabilityData = {
  trainCode: "19038",
  availabilityClassList: [
    {
      reservationClass: "2A",
      charges: {
        totalCollectibleAmount: 755.4,
        baseFare: 635,
        superfastCharge: 0,
        fuelAmount: 0,
        totalConcession: 0,
        tatkalFare: 0,
        serviceTax: 35,
        otherCharge: 0,
        cateringCharge: 0,
        reservationCharge: 50,
        totalFare: 720,
        travelInsuranceCharge: 0,
        travelInsuranceServiceTax: 0,
        wpServiceCharge: 30,
        wpServiceTax: 5.4,
        dynamicFare: 0
      },
      availabilities: [
        { date: "2025-11-30", status: "REGRET", type: "REGRET", confirmedAvailability: false },
        { date: "2025-12-01", status: "RLWL3/WL3", type: "WL", prediction: 0, confirmedAvailability: false },
        { date: "2025-12-02", status: "REGRET", type: "REGRET", confirmedAvailability: false },
        { date: "2025-12-03", status: "AVAILABLE-4", type: "CNF", confirmedAvailability: true },
        { date: "2025-12-04", status: "AVAILABLE-1", type: "CNF", confirmedAvailability: true },
        { date: "2025-12-05", status: "REGRET", type: "REGRET", confirmedAvailability: false },
        { date: "2025-12-06", status: "AVAILABLE-10", type: "CNF", confirmedAvailability: true },
        { date: "2025-12-07", status: "RLWL15/WL10", type: "WL", prediction: 50, confirmedAvailability: false }
      ]
    }
  ]
};

const SeatIcon = ({ color }: { color: string }) => (
  <View style={styles.iconContainer}>
    <Ionicons name="accessibility-outline" size={48} color={color} />
  </View>
);

const QUOTA_OPTIONS = [
  { label: 'General', value: 'GN' },
  { label: 'Tatkal', value: 'TQ' },
  { label: 'Ladies', value: 'LD' },
  { label: 'Senior Citizen', value: 'SS' },
  { label: 'Lower Berth', value: 'LB' },
];

const CLASS_OPTIONS = [
  '1A', '2A', '3A', 'SL', '2S', 'CC', 'EC', '3E'
];

export default function SeatAvailabilityScreen() {
  const { colors } = useTheme();

  const [trainNo, setTrainNo] = useState<string>("19038");
  const [fromStation, setFromStation] = useState<string>("ST");
  const [toStation, setToStation] = useState<string>("BVI");
  const [classType, setClassType] = useState<string>("2A");
  const [quota, setQuota] = useState<string>("GN");
  const [loading, setLoading] = useState<boolean>(false);
  const [availabilityData, setAvailabilityData] = useState<SeatAvailabilityData | null>(null);
  const [usingSampleData, setUsingSampleData] = useState<boolean>(false);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      setUsingSampleData(false);

      const response = await fetchFromRapidAPI(
        `https://irctc1.p.rapidapi.com/api/v2/checkSeatAvailability?classType=${classType}&fromStationCode=${fromStation.toUpperCase()}&quota=${quota}&toStationCode=${toStation.toUpperCase()}&trainNo=${trainNo}`
      );

      if (response.success && response.data.status && response.data.data) {
        setAvailabilityData(response.data.data);
        setUsingSampleData(false);
      } else {
        console.log("Using sample data - no valid response");
        setAvailabilityData(SAMPLE_DATA);
        setUsingSampleData(true);
      }
    } catch (error) {
      console.log(error);
      console.log("Using sample data due to error");
      setAvailabilityData(SAMPLE_DATA);
      setUsingSampleData(true);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'CNF':
        return colors.success;
      case 'WL':
        return colors.warning;
      case 'REGRET':
        return colors.error;
      case 'RAC':
        return colors.info;
      default:
        return colors.textTertiary;
    }
  };

  const getStatusIcon = (type: string): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case 'CNF':
        return 'checkmark-circle-outline';
      case 'WL':
        return 'time-outline';
      case 'REGRET':
        return 'close-circle-outline';
      case 'RAC':
        return 'sync-circle-outline';
      default:
        return 'help-circle-outline';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      day: '2-digit', 
      month: 'short' 
    };
    return date.toLocaleDateString('en-IN', options);
  };

  const getClassColor = (classType: string) => {
    const colorMap: { [key: string]: string } = {
      '1A': colors.seatAvailability.class['1A'],
      '2A': colors.seatAvailability.class['2A'],
      '3A': colors.seatAvailability.class['3A'],
      'SL': colors.seatAvailability.class.SL,
      '2S': colors.seatAvailability.class['2S'],
      'CC': colors.seatAvailability.class.CC,
      'EC': colors.seatAvailability.class.EC,
      '3E': colors.seatAvailability.class['3E'],
    };
    return colorMap[classType] || colors.textSecondary;
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={[styles.headerContainer, { backgroundColor: colors.seatAvailability.header }]}>
        <SeatIcon color={colors.seatAvailability.headerText} />
        <Text style={[styles.header, { color: colors.seatAvailability.headerText }]}>Seat Availability</Text>
        <Text style={[styles.headerSubtitle, { color: colors.seatAvailability.headerText }]}>Check seat status for next 7 days</Text>
      </View>

      {/* Search Form */}
      <View style={[styles.searchCard, { backgroundColor: colors.card }]}>
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Train Number *</Text>
          <TextInput
            style={[styles.input, { borderColor: colors.border, backgroundColor: colors.background, color: colors.text }]}
            placeholder="e.g., 19038"
            value={trainNo}
            onChangeText={setTrainNo}
            keyboardType="numeric"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.stationRow}>
          <View style={styles.stationGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>From *</Text>
            <TextInput
              style={[styles.inputSmall, { borderColor: colors.border, backgroundColor: colors.background, color: colors.text }]}
              placeholder="ST"
              value={fromStation}
              onChangeText={setFromStation}
              autoCapitalize="characters"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          <View style={styles.arrowContainer}>
            <Text style={[styles.arrowText, { color: colors.seatAvailability.header }]}>→</Text>
          </View>
          <View style={styles.stationGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>To *</Text>
            <TextInput
              style={[styles.inputSmall, { borderColor: colors.border, backgroundColor: colors.background, color: colors.text }]}
              placeholder="BVI"
              value={toStation}
              onChangeText={setToStation}
              autoCapitalize="characters"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Class Type *</Text>
          <View style={styles.classGrid}>
            {CLASS_OPTIONS.map((cls) => (
              <TouchableOpacity
                key={cls}
                style={[
                  styles.classButton,
                  {
                    borderColor: getClassColor(cls),
                    backgroundColor: classType === cls ? colors.primary : colors.background,
                  },
                  classType === cls && styles.classButtonActive,
                ]}
                onPress={() => setClassType(cls)}
              >
                <Text
                  style={[
                    styles.classButtonText,
                    { color: classType === cls ? getClassColor(cls) : colors.textSecondary },
                  ]}
                >
                  {cls}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Quota *</Text>
          <View style={styles.quotaContainer}>
            {QUOTA_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[
                  styles.quotaButton,
                  {
                    backgroundColor: quota === opt.value ? colors.primary : colors.background,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setQuota(opt.value)}
              >
                <Text
                  style={[
                    styles.quotaButtonText,
                    { color: quota === opt.value ? '#FFFFFF' : colors.textSecondary },
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.searchButton, { backgroundColor: colors.primary }]}
          onPress={fetchAvailability}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={'#FFFFFF'} />
          ) : (
            <Text style={[styles.searchButtonText, { color: '#FFFFFF' }]}>Find Availability</Text>
          )}
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Checking availability...</Text>
        </View>
      )}

      {/* Results */}
      {usingSampleData && (
        <View style={[styles.banner, { backgroundColor: colors.warning }]}>
          <Text style={[styles.bannerText, { color: '#FFFFFF' }]}>
            API limit reached. Displaying sample data.
          </Text>
        </View>
      )}

      {availabilityData && availabilityData.availabilityClassList.map((classData) => (
        <View key={classData.reservationClass} style={[styles.resultsCard, { backgroundColor: colors.card }]}>
          <View style={styles.resultsHeader}>
            <Text style={[styles.resultsTitle, { color: colors.text }]}>
              Availability for Class {classData.reservationClass}
            </Text>
            <Text style={[styles.trainCode, { color: colors.textSecondary }]}>
              Train: {availabilityData.trainCode}
            </Text>
          </View>

          <View style={styles.availabilityGrid}>
            {classData.availabilities.map((avail) => (
              <View key={avail.date} style={[styles.availabilityItem, { borderColor: colors.border }]}>
                <Text style={[styles.dateText, { color: colors.textSecondary }]}>{formatDate(avail.date)}</Text>
                <View style={styles.statusContainer}>
                  <Ionicons name={getStatusIcon(avail.type)} size={24} color={getStatusColor(avail.type)} />
                  <Text style={[styles.statusText, { color: getStatusColor(avail.type) }]}>
                    {avail.status}
                  </Text>
                </View>
                {avail.prediction !== undefined && (
                  <View style={styles.predictionContainer}>
                    <Ionicons name="trending-up-outline" size={16} color={colors.info} />
                    <Text style={[styles.predictionText, { color: colors.info }]}>
                      {avail.prediction}% Chance
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>

          <View style={[styles.fareContainer, { borderTopColor: colors.border }]}>
            <Text style={[styles.fareTitle, { color: colors.text }]}>Fare Details</Text>
            <Text style={[styles.fareText, { color: colors.textSecondary }]}>
              Total: ₹{classData.charges.totalCollectibleAmount.toFixed(2)}
            </Text>
          </View>
        </View>
      ))}
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
  iconContainer: {
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
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 12,
    marginBottom: 8,
    fontWeight: "600",
  },
  input: {
    padding: 14,
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 16,
  },
  stationRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 15,
  },
  stationGroup: {
    flex: 1,
  },
  inputSmall: {
    padding: 14,
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 16,
    textTransform: "uppercase",
  },
  arrowContainer: {
    paddingHorizontal: 10,
    paddingBottom: 14,
  },
  arrowText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  classGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  classButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    minWidth: 60,
    alignItems: "center",
  },
  classButtonActive: {
  },
  classButtonText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  quotaContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  quotaButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
  },
  quotaButtonText: {
    fontSize: 13,
    fontWeight: "600",
  },
  searchButton: {
    paddingVertical: 14,
    borderRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
    marginTop: 5,
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
  banner: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 12,
    borderRadius: 10,
  },
  bannerText: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  resultsCard: {
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
  resultsHeader: {
    marginBottom: 15,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  trainCode: {
    fontSize: 14,
    marginTop: 4,
  },
  availabilityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  availabilityItem: {
    width: '48%',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  predictionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  predictionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  fareContainer: {
    borderTopWidth: 1,
    marginTop: 15,
    paddingTop: 15,
  },
  fareTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  fareText: {
    fontSize: 14,
  },
});
