import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

type FareBreakup = {
  title: string;
  key: string;
  cost: number;
};

type ClassFare = {
  classType: string;
  fare: number;
  breakup: FareBreakup[];
};

type FareData = {
  general: ClassFare[];
  tatkal: ClassFare[];
};

// Sample data for testing when API fails
const SAMPLE_FARE_DATA: FareData = {
  general: [
    {
      classType: "3A",
      fare: 505,
      breakup: [
        { title: "Base Charges", key: "baseFare", cost: 441 },
        { title: "Reservation Charges", key: "reservationCharges", cost: 40 },
        { title: "GST", key: "serviceTax", cost: 24 },
        { title: "Total Amount", key: "total", cost: 505 }
      ]
    },
    {
      classType: "SL",
      fare: 175,
      breakup: [
        { title: "Base Charges", key: "baseFare", cost: 155 },
        { title: "Reservation Charges", key: "reservationCharges", cost: 20 },
        { title: "Total Amount", key: "total", cost: 175 }
      ]
    },
    {
      classType: "2A",
      fare: 710,
      breakup: [
        { title: "Base Charges", key: "baseFare", cost: 626 },
        { title: "Reservation Charges", key: "reservationCharges", cost: 50 },
        { title: "GST", key: "serviceTax", cost: 34 },
        { title: "Total Amount", key: "total", cost: 710 }
      ]
    },
    {
      classType: "2S",
      fare: 105,
      breakup: [
        { title: "Base Charges", key: "baseFare", cost: 90 },
        { title: "Reservation Charges", key: "reservationCharges", cost: 15 },
        { title: "Total Amount", key: "total", cost: 105 }
      ]
    }
  ],
  tatkal: [
    {
      classType: "3A",
      fare: 1105,
      breakup: [
        { title: "Base Charges", key: "baseFare", cost: 712 },
        { title: "Reservation Charges", key: "reservationCharges", cost: 40 },
        { title: "GST", key: "serviceTax", cost: 53 },
        { title: "Tatkal Charges", key: "tatkalCharges", cost: 300 },
        { title: "Total Amount", key: "total", cost: 1105 }
      ]
    },
    {
      classType: "SL",
      fare: 395,
      breakup: [
        { title: "Base Charges", key: "baseFare", cost: 275 },
        { title: "Reservation Charges", key: "reservationCharges", cost: 20 },
        { title: "Tatkal Charges", key: "tatkalCharges", cost: 100 },
        { title: "Total Amount", key: "total", cost: 395 }
      ]
    },
    {
      classType: "2A",
      fare: 1540,
      breakup: [
        { title: "Base Charges", key: "baseFare", cost: 1016 },
        { title: "Reservation Charges", key: "reservationCharges", cost: 50 },
        { title: "GST", key: "serviceTax", cost: 74 },
        { title: "Tatkal Charges", key: "tatkalCharges", cost: 400 },
        { title: "Total Amount", key: "total", cost: 1540 }
      ]
    },
    {
      classType: "2S",
      fare: 190,
      breakup: [
        { title: "Base Charges", key: "baseFare", cost: 160 },
        { title: "Reservation Charges", key: "reservationCharges", cost: 15 },
        { title: "Tatkal Charges", key: "tatkalCharges", cost: 15 },
        { title: "Total Amount", key: "total", cost: 190 }
      ]
    }
  ]
};

const FareIcon = ({ color }: { color: string }) => (
  <View style={styles.iconContainer}>
    <Ionicons name="cash-outline" size={48} color={color} />
  </View>
);

export default function FareEnquiryScreen() {
  const { colors } = useTheme();

  const [trainNo, setTrainNo] = useState<string>("19038");
  const [fromStation, setFromStation] = useState<string>("ST");
  const [toStation, setToStation] = useState<string>("BVI");
  const [loading, setLoading] = useState<boolean>(false);
  const [fareData, setFareData] = useState<FareData | null>(null);
  const [selectedTab, setSelectedTab] = useState<'general' | 'tatkal'>('general');
  const [usingSampleData, setUsingSampleData] = useState<boolean>(false);

  const fetchFare = async () => {
    try {
      setLoading(true);
      setUsingSampleData(false);
      
      const response = await fetch(
        `https://irctc1.p.rapidapi.com/api/v2/getFare?trainNo=${trainNo}&fromStationCode=${fromStation.toUpperCase()}&toStationCode=${toStation.toUpperCase()}`,
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
      console.log("Fare API Response:", json);
      
      if (json.message && json.message.includes("exceeded")) {
        // Use sample data when quota exceeded
        console.log("Using sample data due to quota exceeded");
        setFareData(SAMPLE_FARE_DATA);
        setUsingSampleData(true);
      } else if (json.status && json.data) {
        setFareData(json.data);
        setUsingSampleData(false);
      } else {
        alert("No fare data found. Showing sample data.");
        setFareData(SAMPLE_FARE_DATA);
        setUsingSampleData(true);
      }
    } catch (error) {
      console.log(error);
      console.log("Using sample data due to error");
      setFareData(SAMPLE_FARE_DATA);
      setUsingSampleData(true);
    } finally {
      setLoading(false);
    }
  };

  const getClassColor = (classType: string) => {
    const colorMap: { [key: string]: string } = {
      '1A': colors.fareEnquiry.class.A1,
      '2A': colors.fareEnquiry.class.A2,
      '3A': colors.fareEnquiry.class.A3,
      'SL': colors.fareEnquiry.class.SL,
      '2S': colors.fareEnquiry.class.S2,
      'CC': colors.fareEnquiry.class.CC,
      'EC': colors.fareEnquiry.class.EC,
      '3E': colors.fareEnquiry.class.E3,
    };
    return colorMap[classType] || colors.textSecondary;
  };

  const getClassFullName = (classType: string) => {
    const nameMap: { [key: string]: string } = {
      '1A': 'First AC',
      '2A': 'Second AC',
      '3A': 'Third AC',
      'SL': 'Sleeper',
      '2S': 'Second Sitting',
      'CC': 'Chair Car',
      'EC': 'Executive Chair',
      '3E': '3 AC Economy',
    };
    return nameMap[classType] || classType;
  };

  const renderFareCard = (classFare: ClassFare, index: number, isTatkal: boolean) => (
    <View key={`${classFare.classType}-${index}`} style={[styles.fareCard, { backgroundColor: colors.card }]}>
      <View style={[styles.fareCardHeader, { backgroundColor: colors.background }]}>
        <View style={[styles.classBadge, { backgroundColor: getClassColor(classFare.classType) }]}>
          <Text style={[styles.classCode, { color: colors.text }]}>{classFare.classType}</Text>
          <Text style={[styles.className, { color: colors.text }]}>{getClassFullName(classFare.classType)}</Text>
        </View>
        <View style={styles.fareAmountContainer}>
          <Text style={[styles.rupeeSymbol, { color: colors.fareEnquiry.header }]}>₹</Text>
          <Text style={[styles.fareAmount, { color: colors.fareEnquiry.header }]}>{classFare.fare}</Text>
        </View>
      </View>

      <View style={styles.breakupContainer}>
        <Text style={[styles.breakupTitle, { color: colors.textSecondary }]}>Fare Breakup:</Text>
        {classFare.breakup.map((item, idx) => {
          const isTotal = item.key === 'total';
          return (
            <View 
              key={idx} 
              style={[
                styles.breakupRow, 
                { borderBottomColor: colors.border },
                isTotal && [styles.breakupRowTotal, { borderTopColor: colors.fareEnquiry.header }]
              ]}
            >
              <Text style={[styles.breakupLabel, { color: colors.textSecondary }, isTotal && [styles.breakupLabelTotal, { color: colors.text }]]}>
                {item.title}
              </Text>
              <Text style={[styles.breakupValue, { color: colors.text }, isTotal && [styles.breakupValueTotal, { color: colors.fareEnquiry.header }]]}>
                ₹{item.cost}
              </Text>
            </View>
          );
        })}
      </View>

      {isTatkal && (
        <View style={[styles.tatkalBadge, { backgroundColor: colors.error }]}>
          <Text style={[styles.tatkalBadgeText, { color: colors.text }]}>⚡ TATKAL</Text>
        </View>
      )}
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={[styles.headerContainer, { backgroundColor: colors.fareEnquiry.header }]}>
        <FareIcon color={colors.text} />
        <Text style={[styles.header, { color: colors.text }]}>Fare Enquiry</Text>
        <Text style={[styles.headerSubtitle, { color: colors.fareEnquiry.headerText }]}>Check ticket prices</Text>
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
            <Text style={[styles.label, { color: colors.textSecondary }]}>From Station *</Text>
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
            <Text style={[styles.arrowText, { color: colors.fareEnquiry.header }]}>→</Text>
          </View>
          <View style={styles.stationGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>To Station *</Text>
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

        <TouchableOpacity style={[styles.searchButton, { backgroundColor: colors.fareEnquiry.header, shadowColor: colors.fareEnquiry.header }]} onPress={fetchFare}>
          <Text style={[styles.searchButtonText, { color: colors.text }]}>
            <Ionicons name="search-outline" size={16} /> Check Fare
          </Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.fareEnquiry.header} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Fetching fare details...</Text>
        </View>
      )}

      {fareData && (
        <View>
          {/* Sample Data Notice */}
          {usingSampleData && (
            <View style={[styles.sampleDataNotice, { backgroundColor: colors.fareEnquiry.sample.background, borderLeftColor: colors.fareEnquiry.sample.border }]}>
              <Text style={[styles.sampleDataText, { color: colors.fareEnquiry.sample.text }]}>
                <Ionicons name="information-circle-outline" size={14} /> Showing sample data
              </Text>
            </View>
          )}

          {/* Route Info */}
          <View style={[styles.routeCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.routeTitle, { color: colors.fareEnquiry.header }]}>Train #{trainNo}</Text>
            <View style={styles.routeInfo}>
              <Text style={[styles.routeStation, { color: colors.text }]}>{fromStation.toUpperCase()}</Text>
              <Text style={[styles.routeArrow, { color: colors.fareEnquiry.header }]}>━━━━━━→</Text>
              <Text style={[styles.routeStation, { color: colors.text }]}>{toStation.toUpperCase()}</Text>
            </View>
          </View>

          {/* Tab Selector */}
          <View style={[styles.tabContainer, { backgroundColor: colors.card }]}>
            <TouchableOpacity
              style={[styles.tab, selectedTab === 'general' && [styles.tabActive, { backgroundColor: colors.fareEnquiry.header }]]}
              onPress={() => setSelectedTab('general')}
            >
              <Text style={[styles.tabText, { color: colors.textSecondary }, selectedTab === 'general' && [styles.tabTextActive, { color: colors.text }]]}>
                <Ionicons name="ticket-outline" size={16} /> General
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, selectedTab === 'tatkal' && [styles.tabActive, { backgroundColor: colors.fareEnquiry.header }]]}
              onPress={() => setSelectedTab('tatkal')}
            >
              <Text style={[styles.tabText, { color: colors.textSecondary }, selectedTab === 'tatkal' && [styles.tabTextActive, { color: colors.text }]]}>
                <Ionicons name="flash-outline" size={16} /> Tatkal
              </Text>
            </TouchableOpacity>
          </View>

          {/* Fare Cards */}
          <View style={styles.faresSection}>
            {selectedTab === 'general' ? (
              <>
                {fareData.general.map((fare, index) => renderFareCard(fare, index, false))}
              </>
            ) : (
              <>
                {fareData.tatkal.map((fare, index) => renderFareCard(fare, index, true))}
              </>
            )}
          </View>

          {/* Info Card */}
          <View style={[styles.infoCard, { backgroundColor: colors.fareEnquiry.info.background, borderLeftColor: colors.fareEnquiry.info.border }]}>
            <Text style={[styles.infoTitle, { color: colors.fareEnquiry.info.title }]}>
              <Ionicons name="information-circle-outline" size={18} /> Important Notes:
            </Text>
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              • Fares shown are for reference only and may change{'\n'}
              • GST applicable on AC classes{'\n'}
              • Tatkal charges apply for last-minute bookings{'\n'}
              • Additional charges may apply for premium trains{'\n'}
              • Child fare is 50% of adult fare (5-12 years)
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
    marginBottom: 6,
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
  searchButton: {
    paddingVertical: 14,
    borderRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
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
  sampleDataNotice: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 12,
    borderRadius: 10,
    borderLeftWidth: 4,
  },
  sampleDataText: {
    fontSize: 13,
    fontWeight: "600",
  },
  routeCard: {
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
  routeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  routeInfo: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  routeStation: {
    fontSize: 20,
    fontWeight: "bold",
  },
  routeArrow: {
    fontSize: 16,
    marginHorizontal: 15,
  },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 10,
    padding: 5,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
  },
  tabActive: {
  },
  tabText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 14,
  },
  tabTextActive: {
  },
  faresSection: {
    marginTop: 10,
  },
  fareCard: {
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
    overflow: 'hidden',
  },
  fareCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  classBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  classCode: {
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8,
  },
  className: {
    fontWeight: '600',
    fontSize: 12,
  },
  fareAmountContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  rupeeSymbol: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 2,
    marginTop: 2,
  },
  fareAmount: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  breakupContainer: {
    padding: 15,
  },
  breakupTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 10,
  },
  breakupRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  breakupRowTotal: {
    borderTopWidth: 2,
    marginTop: 5,
    paddingTop: 10,
  },
  breakupLabel: {
    fontSize: 14,
  },
  breakupLabelTotal: {
    fontWeight: 'bold',
  },
  breakupValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  breakupValueTotal: {
    fontWeight: 'bold',
  },
  tatkalBadge: {
    position: 'absolute',
    top: 10,
    right: -30,
    transform: [{ rotate: '45deg' }],
    paddingVertical: 4,
    paddingHorizontal: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 4,
  },
  tatkalBadgeText: {
    fontWeight: 'bold',
    fontSize: 10,
    textAlign: 'center',
  },
  infoCard: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 20,
  },
});
