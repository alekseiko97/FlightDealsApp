import React, { useEffect, useState } from 'react';
import { fetchFlightDeals } from '../scripts/apiService';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

type Deal = {
  id: string;
  origin_airport: string;
  origin_airport_code: string;
  destination_airport: string;
  destination_airport_code: string;
  outbound_date: string;
  outbound_departure_time: string;
  outbound_arrival_time: string;
  outbound_price: string;
  outbound_airline: string;
  inbound_date: string;
  inbound_departure_time: string;
  inbound_arrival_time: string;
  inbound_price: string;
  inbound_airline: string;
  total_price: number;
  isFavorite: boolean;
};

const HomeScreen: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    airline: '',
    outboundDate: '',
    inboundDate: '',
    currentPage: 1,
    pageSize: 10,
    sortColumn: 'total_price',
    sortOrder: 'asc'
  });

  useEffect(() => {
    const loadDeals = async () => {
      try {
        const fetchedDeals = await fetchFlightDeals(filters);
        if (fetchedDeals && fetchedDeals.length > 0) {
          setDeals(fetchedDeals);
        } else {
          setError('No deals available at the moment.');
        }
      } catch (error) {
        console.error('Error loading deals:', error);
        setError('Failed to load flight deals')
      } finally {
        setLoading(false);
      }
    }

    loadDeals();
  }, [filters]); // Re-fetch when filters change

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFavoriteToggle = (dealId: string) => {
    // This function will update the state and store the favorite status
    // You may want to store favorites locally or update them on the backend
    setDeals(prevDeals =>
      prevDeals.map(deal =>
        // TODO:
        deal.id === dealId ? { ...deal, isFavorite: !deal.isFavorite } : deal
      )
    );
  };

  // const handleSort = (field: string) => {
  //   const sortOrder = filters.sortBy === field && filters.sortOrder === 'asc' ? 'desc' : 'asc';
  //   setFilters((prev) => ({
  //     ...prev,
  //     sortBy: field,
  //     sortOrder,
  //   }));
  // };

  const handlePagination = (page: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>{error}</Text>
  }

  return (
    <View style={styles.container}>
      {/* Filter inputs */}
      <TextInput
        style={styles.filterInput}
        placeholder="Outbound Airline"
        value={filters.airline}
        onChangeText={(text) => handleFilterChange('outboundAirline', text)}
      />
      <TextInput
        style={styles.filterInput}
        placeholder="Inbound Airline"
        value={filters.airline}
        onChangeText={(text) => handleFilterChange('inboundAirline', text)}
      />
      <TextInput
        style={styles.filterInput}
        placeholder="Outbound Date"
        value={filters.outboundDate}
        onChangeText={(text) => handleFilterChange('outboundDate', text)}
      />
      <TextInput
        style={styles.filterInput}
        placeholder="Inbound Date"
        value={filters.inboundDate}
        onChangeText={(text) => handleFilterChange('inboundDate', text)}
      />

      {/* Deals list */}
      <FlatList
        data={deals}
        //keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.dealCard}>
            <Text style={styles.airportText}>{item.origin_airport} → {item.destination_airport}</Text>
            <Text style={styles.dateText}>{item.outbound_date} ({item.outbound_departure_time} - {item.outbound_arrival_time}) | {item.outbound_airline}</Text>
            <Text style={styles.dateText}>{item.inbound_date} ({item.inbound_departure_time} - {item.inbound_arrival_time} | {item.inbound_airline}</Text>
            <Text style={styles.priceText}>Total Price: €{item.total_price}</Text>
            <TouchableOpacity style={styles.favoriteButton} onPress={() => handleFavoriteToggle(item.id)}>
              <FontAwesome name={item.isFavorite ? 'star' : 'star-o'} size={24} color={item.isFavorite ? 'gold' : 'gray'} />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Pagination controls */}
      <View style={styles.pagination}>
        <TouchableOpacity
          onPress={() => setFilters(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
          disabled={filters.currentPage === 1}
        >
          <Text>Previous</Text>
        </TouchableOpacity>

        <Text>Page {filters.currentPage}</Text>

        <TouchableOpacity
          onPress={() => setFilters(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
        >
          <Text>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'white' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subHeader: { fontSize: 18, fontWeight: 'bold', marginVertical: 15 },
  dealCard: {
    width: '100%',
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  airportText: { fontSize: 16, fontWeight: '600' },
  dateText: { fontSize: 14, color: '#666' },
  priceText: { fontSize: 16, fontWeight: '700', color: 'black' },
  thumbnail: { width: '100%', height: 80, borderRadius: 5 },
  destination: { fontSize: 16, fontWeight: '600', marginTop: 5 },
  price: { fontSize: 14, color: 'green' },
  filterInput: { padding: 10, width: '50%', borderWidth: 1, marginBottom: 10, borderRadius: 8},
  pagination: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  favoriteButton: { position: 'absolute', top: 10, right: 10 }
});

export default HomeScreen;
