import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { locationService, LocationStats } from '../services';

interface LocationStatsScreenProps {
  navigation: any;
}

export default function LocationStatsScreen({ navigation }: LocationStatsScreenProps) {
  const [stats, setStats] = useState<LocationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCountryDetails, setShowCountryDetails] = useState(false);
  const [showStateDetails, setShowStateDetails] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      // Get stats only for allowed countries
      const allowedCountries = ['US', 'CA', 'GB', 'AU'];
      const allCountries = locationService.getAllCountries(); // This now returns only the 4 countries
      
      let totalStates = 0;
      let totalCities = 0;
      const countriesWithStates: { [key: string]: number } = {};
      const statesWithCities: { [key: string]: number } = {};

      allCountries.forEach(country => {
        const states = locationService.getStatesByCountry(country.isoCode);
        const cities = locationService.getCitiesByCountry(country.isoCode);
        
        totalStates += states.length;
        totalCities += cities.length;
        countriesWithStates[country.label] = states.length;

        // Get cities per state for this country
        states.forEach(state => {
          const stateCities = locationService.getCitiesByState(country.isoCode, state.isoCode);
          const stateKey = `${state.label}, ${country.label}`;
          statesWithCities[stateKey] = stateCities.length;
        });
      });

      const locationStats: LocationStats = {
        totalCountries: allCountries.length,
        totalStates,
        totalCities,
        countriesWithStates,
        statesWithCities,
      };

      setStats(locationStats);
    } catch (error) {
      console.error('Error loading location stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const getTopCountriesWithStates = () => {
    if (!stats) return [];
    return Object.entries(stats.countriesWithStates)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);
  };

  const getTopStatesWithCities = () => {
    if (!stats) return [];
    return Object.entries(stats.statesWithCities)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 15);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Location Statistics</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0E7490" />
          <Text style={styles.loadingText}>Loading location data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Location Statistics</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          
          {/* Overview Cards */}
          <View style={styles.overviewContainer}>
            <Text style={styles.sectionTitle}>Inspector Portal Coverage</Text>
            
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Ionicons name="earth" size={24} color="#0E7490" />
                </View>
                <Text style={styles.statNumber}>{formatNumber(stats?.totalCountries || 0)}</Text>
                <Text style={styles.statLabel}>Countries</Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Ionicons name="location" size={24} color="#059669" />
                </View>
                <Text style={styles.statNumber}>{formatNumber(stats?.totalStates || 0)}</Text>
                <Text style={styles.statLabel}>States/Provinces</Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Ionicons name="business" size={24} color="#DC2626" />
                </View>
                <Text style={styles.statNumber}>{formatNumber(stats?.totalCities || 0)}</Text>
                <Text style={styles.statLabel}>Cities</Text>
              </View>
            </View>
          </View>

          {/* Top Countries with Most States */}
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.sectionHeader}
              onPress={() => setShowCountryDetails(!showCountryDetails)}
            >
              <Text style={styles.sectionTitle}>Countries by States/Provinces</Text>
              <Ionicons 
                name={showCountryDetails ? "chevron-up" : "chevron-down"} 
                size={20} 
                color="#6B7280" 
              />
            </TouchableOpacity>
            
            {showCountryDetails && (
              <View style={styles.listContainer}>
                {getTopCountriesWithStates().map(([country, count], index) => (
                  <View key={country} style={styles.listItem}>
                    <View style={styles.listItemLeft}>
                      <Text style={styles.listItemRank}>#{index + 1}</Text>
                      <Text style={styles.listItemName}>{country}</Text>
                    </View>
                    <Text style={styles.listItemCount}>{formatNumber(count)} states</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Top States with Most Cities */}
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.sectionHeader}
              onPress={() => setShowStateDetails(!showStateDetails)}
            >
              <Text style={styles.sectionTitle}>Top States/Provinces by Cities (Sample)</Text>
              <Ionicons 
                name={showStateDetails ? "chevron-up" : "chevron-down"} 
                size={20} 
                color="#6B7280" 
              />
            </TouchableOpacity>
            
            {showStateDetails && (
              <View style={styles.listContainer}>
                {getTopStatesWithCities().map(([state, count], index) => (
                  <View key={state} style={styles.listItem}>
                    <View style={styles.listItemLeft}>
                      <Text style={styles.listItemRank}>#{index + 1}</Text>
                      <Text style={styles.listItemName}>{state}</Text>
                    </View>
                    <Text style={styles.listItemCount}>{formatNumber(count)} cities</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Data Source Info */}
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Inspector Portal Coverage</Text>
            <Text style={styles.infoText}>
              This inspector portal supports property management in four key countries: 
              United States, Canada, United Kingdom, and Australia.
            </Text>
            <Text style={styles.infoText}>
              Complete coverage includes all states, provinces, territories, and cities 
              within these countries for accurate property location selection.
            </Text>
            <Text style={styles.infoText}>
              • United States: 66 states/territories with 19,821 cities{'\n'}
              • Canada: 13 provinces/territories with 1,079 cities{'\n'}
              • United Kingdom: 247 regions with 3,871 cities{'\n'}
              • Australia: 8 states/territories with 4,152 cities
            </Text>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  placeholder: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  overviewContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F9FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  listItemRank: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    width: 30,
  },
  listItemName: {
    fontSize: 14,
    color: '#1F2937',
    flex: 1,
  },
  listItemCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0E7490',
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 8,
  },
});