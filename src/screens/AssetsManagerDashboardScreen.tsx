import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Sidebar from '../components/Sidebar';

interface AssetsManagerDashboardScreenProps {
  navigation: NativeStackNavigationProp<any, any>;
}

interface StatCard {
  label: string;
  value: string;
  icon: string;
}

interface Asset {
  id: string;
  name: string;
  assetId: string;
  category: string;
  status: 'active' | 'maintenance' | 'inactive';
  value: string;
  location: string;
  lastUpdated: string;
}

export default function AssetsManagerDashboardScreen({
  navigation,
}: AssetsManagerDashboardScreenProps) {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleMenuPress = () => {
    setSidebarVisible(true);
  };

  const handleSidebarNavigate = (screen: string) => {
    setSidebarVisible(false);
    if (screen === 'Dashboard') {
      // Already on dashboard
    }
  };

  const handleLogout = () => {
    setSidebarVisible(false);
    navigation.navigate('Boarding' as never);
  };

  const statCards: StatCard[] = [
    { label: 'Total Assets', value: '342', icon: 'cube-outline' },
    { label: 'Active Assets', value: '298', icon: 'checkmark-circle-outline' },
    { label: 'Under Maintenance', value: '24', icon: 'wrench-outline' },
    { label: 'Total Value', value: '$2.5M', icon: 'cash-outline' },
  ];

  const mockAssets: Asset[] = [
    {
      id: '1',
      name: 'Server Rack A1',
      assetId: 'AST-001001',
      category: 'IT Equipment',
      status: 'active',
      value: '$15,000',
      location: 'Data Center - Room 101',
      lastUpdated: '2024-11-24',
    },
    {
      id: '2',
      name: 'HVAC Unit - Floor 3',
      assetId: 'AST-002001',
      category: 'Facilities',
      status: 'maintenance',
      value: '$8,500',
      location: 'Building B - Floor 3',
      lastUpdated: '2024-11-23',
    },
    {
      id: '3',
      name: 'Office Desk Set',
      assetId: 'AST-003001',
      category: 'Furniture',
      status: 'active',
      value: '$2,200',
      location: 'Office - Wing A',
      lastUpdated: '2024-11-24',
    },
    {
      id: '4',
      name: 'Backup Generator',
      assetId: 'AST-004001',
      category: 'Power Systems',
      status: 'active',
      value: '$45,000',
      location: 'Basement - Generator Room',
      lastUpdated: '2024-11-22',
    },
    {
      id: '5',
      name: 'Network Switch - Core',
      assetId: 'AST-005001',
      category: 'IT Equipment',
      status: 'maintenance',
      value: '$12,000',
      location: 'Data Center - Room 102',
      lastUpdated: '2024-11-21',
    },
    {
      id: '6',
      name: 'Security Camera System',
      assetId: 'AST-006001',
      category: 'Security',
      status: 'active',
      value: '$18,500',
      location: 'Building Perimeter',
      lastUpdated: '2024-11-24',
    },
    {
      id: '7',
      name: 'Conference Room Projector',
      assetId: 'AST-007001',
      category: 'AV Equipment',
      status: 'inactive',
      value: '$3,500',
      location: 'Conference Room - 5th Floor',
      lastUpdated: '2024-11-20',
    },
    {
      id: '8',
      name: 'Elevator System',
      assetId: 'AST-008001',
      category: 'Facilities',
      status: 'active',
      value: '$120,000',
      location: 'Main Building',
      lastUpdated: '2024-11-24',
    },
  ];

  const filteredAssets = mockAssets.filter(
    (asset) =>
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.assetId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#84CC16';
      case 'maintenance':
        return '#FF9800';
      case 'inactive':
        return '#9CA3AF';
      default:
        return '#6B7280';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'IT Equipment':
        return '#2196F3';
      case 'Facilities':
        return '#FF9800';
      case 'Furniture':
        return '#9C27B0';
      case 'Power Systems':
        return '#F44336';
      case 'Security':
        return '#4CAF50';
      case 'AV Equipment':
        return '#00BCD4';
      default:
        return '#6B7280';
    }
  };

  const renderAssetCard = ({ item }: { item: Asset }) => (
    <View style={styles.assetCard}>
      <View style={styles.assetHeader}>
        <View>
          <Text style={styles.assetName}>{item.name}</Text>
          <Text style={styles.assetId}>{item.assetId}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.statusText}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.assetDetails}>
        <View style={styles.detailRow}>
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: getCategoryColor(item.category) },
            ]}
          >
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
          <Text style={styles.assetValue}>{item.value}</Text>
        </View>

        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color="#6B7280" />
          <Text style={styles.locationText}>{item.location}</Text>
        </View>

        <Text style={styles.lastUpdated}>Updated: {item.lastUpdated}</Text>
      </View>
    </View>
  );

  return (
    <>
      {/* Sidebar Modal */}
      <Modal
        visible={sidebarVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setSidebarVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.sidebarContainer}>
            <Sidebar
              onClose={() => setSidebarVisible(false)}
              onNavigate={handleSidebarNavigate}
              onLogout={handleLogout}
              userType="AssetsManager"
            />
          </View>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setSidebarVisible(false)}
          />
        </View>
      </Modal>

      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerBar}>
            <TouchableOpacity onPress={handleMenuPress}>
              <Ionicons name="menu" size={28} color="#1F2937" />
            </TouchableOpacity>
            <Image
              source={require('../../logo.png')}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <View style={styles.notificationBadge}>
              <TouchableOpacity>
                <Ionicons name="notifications-outline" size={28} color="#1F2937" />
              </TouchableOpacity>
              <Text style={styles.asText}>AS</Text>
            </View>
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>Asset Manager Dashboard</Text>
            <Text style={styles.subtitle}>Monitor and manage your assets</Text>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            {statCards.map((card, index) => (
              <View key={index} style={styles.statCard}>
                <Text style={styles.statLabel}>{card.label}</Text>
                <Text style={styles.statValue}>{card.value}</Text>
              </View>
            ))}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity style={styles.createButton}>
              <Text style={styles.createButtonText}>Add New Asset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.exportButton}>
              <Text style={styles.exportButtonText}>Generate Report</Text>
            </TouchableOpacity>
          </View>

          {/* Search Section */}
          <View style={styles.searchSection}>
            <Text style={styles.searchTitle}>Search Assets</Text>
            <View style={styles.searchInputContainer}>
              <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by asset name or ID"
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          {/* Assets List */}
          <View style={styles.assetsListContainer}>
            <Text style={styles.assetsTitle}>All Assets ({filteredAssets.length})</Text>
            {filteredAssets.length > 0 ? (
              <FlatList
                data={filteredAssets}
                renderItem={renderAssetCard}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="cube-outline" size={48} color="#D1D5DB" />
                <Text style={styles.emptyStateText}>No assets found</Text>
              </View>
            )}
          </View>

          {/* Bottom Spacing */}
          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F4F8',
  },
  headerContainer: {
    backgroundColor: '#0E7490',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerBar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: 15,
  },
  headerLogo: {
    width: 180,
    height: 50,
  },
  notificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  asText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  scrollView: {
    flex: 1,
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  statsContainer: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  statLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
  },
  actionButtonsContainer: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: '#84CC16',
    borderRadius: 8,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  exportButton: {
    backgroundColor: '#FF4D67',
    borderRadius: 8,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exportButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 10,
  },
  searchInputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: '#374151',
  },
  assetsListContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  assetsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  assetCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  assetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  assetName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  assetId: {
    fontSize: 12,
    color: '#6B7280',
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  assetDetails: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  assetValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  locationText: {
    fontSize: 12,
    color: '#6B7280',
  },
  lastUpdated: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 12,
  },
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBackdrop: {
    flex: 1,
  },
  sidebarContainer: {
    width: 280,
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
