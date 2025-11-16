import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

type Train = {
  train_number: string;
  train_name: string;
  src_stn_code: string;
  src_stn_name: string;
  dstn_stn_code: string;
  dstn_stn_name: string;
};

const SAMPLE_DATA: Train[] = [
    {
      "train_number": "19038",
      "train_name": "Avadh Express",
      "src_stn_code": "BJU",
      "src_stn_name": "BARAUNI JN",
      "dstn_stn_code": "BDTS",
      "dstn_stn_name": "MUMBAI BANDRA TERMINUS"
    },
    {
      "train_number": "19037",
      "train_name": "AVADH EXP",
      "src_stn_code": "BDTS",
      "src_stn_name": "MUMBAI BANDRA TERMINUS",
      "dstn_stn_code": "BJU",
      "dstn_stn_name": "BARAUNI JN"
    },
];

export default function SearchTrainScreen() {
  const { colors } = useTheme();
  const [query, setQuery] = useState<string>('190');
  const [loading, setLoading] = useState<boolean>(false);
  const [trains, setTrains] = useState<Train[]>([]);
  const [usingSampleData, setUsingSampleData] = useState<boolean>(false);

  const searchTrain = async () => {
    try {
      setLoading(true);
      setUsingSampleData(false);
      setTrains([]);

      const response = await fetch(
        `https://irctc1.p.rapidapi.com/api/v1/searchTrain?query=${query}`,
        {
          method: 'GET',
          headers: {
            'x-rapidapi-host': 'irctc1.p.rapidapi.com',
            'x-rapidapi-key': '22e9b8a2aemsh0912f6a2da48e8cp1e2cc0jsnba91c3220474',
          },
        }
      );

      const json = await response.json();
      if (json.message && json.message.includes("exceeded")) {
        setTrains(SAMPLE_DATA);
        setUsingSampleData(true);
      } else if (json.status && json.data) {
        setTrains(json.data);
      } else {
        setTrains(SAMPLE_DATA);
        setUsingSampleData(true);
      }
    } catch (error) {
      console.error(error);
      setTrains(SAMPLE_DATA);
      setUsingSampleData(true);
    } finally {
      setLoading(false);
    }
  };

  const renderTrainItem = ({ item }: { item: Train }) => (
    <View style={[styles.trainCard, { backgroundColor: colors.card, borderLeftColor: colors.primary }]}>
      <View style={styles.trainCardHeader}>
        <Ionicons name="train-outline" size={24} color={colors.primary} />
        <View style={styles.trainTitle}>
          <Text style={[styles.trainName, { color: colors.text }]}>{item.train_name}</Text>
          <Text style={[styles.trainNumber, { color: colors.primary }]}>#{item.train_number}</Text>
        </View>
      </View>
      <View style={styles.routeContainer}>
        <View style={styles.stationContainer}>
          <Text style={[styles.stationCode, { color: colors.textSecondary }]}>{item.src_stn_code}</Text>
          <Text style={[styles.stationName, { color: colors.textSecondary }]}>{item.src_stn_name}</Text>
        </View>
        <Ionicons name="arrow-forward-outline" size={20} color={colors.primary} />
        <View style={styles.stationContainer}>
          <Text style={[styles.stationCode, { color: colors.textSecondary, textAlign: 'right' }]}>{item.dstn_stn_code}</Text>
          <Text style={[styles.stationName, { color: colors.textSecondary, textAlign: 'right' }]}>{item.dstn_stn_name}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.headerContainer, { backgroundColor: colors.primary }]}>
        <Ionicons name="search-outline" size={48} color={colors.card} />
        <Text style={[styles.header, { color: colors.card }]}>Search Train</Text>
        <Text style={[styles.headerSubtitle, { color: colors.card }]}>Find any train by name or number</Text>
      </View>

      <View style={[styles.searchCard, { backgroundColor: colors.card }]}>
        <TextInput
          style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
          placeholder="Enter Train Name or Number"
          value={query}
          onChangeText={setQuery}
          placeholderTextColor={colors.placeholder}
        />
        <TouchableOpacity
          style={[styles.searchButton, { backgroundColor: colors.primary }]}
          onPress={searchTrain}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={[styles.searchButtonText, { color: colors.card }]}>Search</Text>
          )}
        </TouchableOpacity>
      </View>
      
      {usingSampleData && (
        <View style={[styles.banner, { backgroundColor: colors.warning }]}>
          <Text style={[styles.bannerText, { color: '#FFFFFF' }]}>
            API limit reached. Displaying sample data.
          </Text>
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={trains}
          renderItem={renderTrainItem}
          keyExtractor={(item) => item.train_number}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Ionicons name="list-outline" size={64} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No trains found. Try a different search.</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingTop: 50,
    paddingBottom: 25,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    padding: 14,
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  searchButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  trainCard: {
    marginBottom: 15,
    borderRadius: 12,
    padding: 15,
    borderLeftWidth: 5,
  },
  trainCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  trainTitle: {
    marginLeft: 10,
    flex: 1,
  },
  trainName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  trainNumber: {
    fontSize: 14,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  stationContainer: {
    flex: 1,
  },
  stationCode: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  stationName: {
    fontSize: 12,
    flexWrap: 'wrap',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    marginTop: 10,
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
});