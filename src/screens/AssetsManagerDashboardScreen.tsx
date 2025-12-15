import React, { useState, useEffect, useCallback } from 'react';
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
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Sidebar from '../components/Sidebar';
import { authService, assetService } from '../services';
import { Asset as AssetType, User } from '../services/api';

interface AssetsManagerDashboardScreenProps {
  navigation: NativeStackNavigationProp<any, any>;
}

interface StatCard {
  label: string;
  value: string;
  icon: string;
}

export default function AssetsManagerDashboardScreen({
  navigation,
}: AssetsManagerDashboardScreenProps) {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [assets, setAssets] = useState<AssetType[]>([]);
  const [stats, setStats] = useState({
    totalAssets: 0,
    activeAssets: 0,
    underMaintenance: 0,
    totalValue: 0
  });
  
  // Add New Asset Modal State
  const [addAssetModalVisible, setAddAssetModalVisible] = useState(false);
  const [savingAsset, setSavingAsset] = useState(false);
  const [newAsset, setNewAsset] = useState({
    name: '',
    category: 'Equipment',
    description: '',
    location: '',
    value: '',
    serialNumber: '',
    manufacturer: '',
    model: '',
    status: 'active',
    condition: 'good',
  });

  const assetCategories = [
    'Equipment',
    'IT',
    'Furniture',
    'Infrastructure',
    'Security',
    'Vehicles',
    'Other'
  ];

  const assetStatuses = [
    { value: 'active', label: 'Active' },
    { value: 'maintenance', label: 'Under Maintenance' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'retired', label: 'Retired' },
  ];

  const assetConditions = [
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' },
  ];

  const loadInitialData = useCallback(async () => {
    try {
      const storedUser = await authService.getStoredUser();
      
      // Role-based access control
      const allowedRoles = ['asset-manager', 'admin'];
      if (!storedUser || !allowedRoles.includes(storedUser.role)) {
        Alert.alert(
          'Access Denied',
          'You do not have permission to access the Asset Manager portal.',
          [{ text: 'OK', onPress: () => {
            authService.logout();
            navigation.reset({ index: 0, routes: [{ name: 'Boarding' as never }] });
          }}]
        );
        return;
      }
      
      setUser(storedUser);
      await fetchData();
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  }, [navigation]);

  const fetchData = async () => {
    try {
      // Fetch assets
      const assetsResponse = await assetService.getAssets();
      if (assetsResponse.success && assetsResponse.assets) {
        const assetData = assetsResponse.assets || [];
        setAssets(assetData);
        
        // Calculate stats
        const active = assetData.filter((a: AssetType) => a.status === 'active' || a.status === 'operational').length;
        const maintenance = assetData.filter((a: AssetType) => a.status === 'maintenance' || a.status === 'under-maintenance').length;
        const totalValue = assetData.reduce((sum: number, a: AssetType) => sum + (a.value || a.purchasePrice || 0), 0);
        
        setStats({
          totalAssets: assetData.length,
          activeAssets: active,
          underMaintenance: maintenance,
          totalValue
        });
      }

      // Also try to get stats from API if available
      try {
        const statsResponse = await assetService.getAssetStats();
        if (statsResponse.success && statsResponse.data) {
          setStats(prev => ({
            ...prev,
            ...statsResponse.data
          }));
        }
      } catch (e) {
        // Stats endpoint might not exist, use calculated stats
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to load assets. Please try again.');
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, []);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      await fetchData();
      return;
    }
    
    setLoading(true);
    try {
      const response = await assetService.getAssets({ search: searchQuery });
      if (response.success && response.assets) {
        setAssets(response.assets || []);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchQuery) {
        handleSearch();
      }
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchQuery, handleSearch]);

  const handleMenuPress = () => {
    setSidebarVisible(true);
  };

  const handleSidebarNavigate = (screen: string) => {
    setSidebarVisible(false);
    if (screen === 'Dashboard') {
      // Already on dashboard
    }
  };

  const handleLogout = async () => {
    setSidebarVisible(false);
    await authService.logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Boarding' as never }],
    });
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  const statCards: StatCard[] = [
    { label: 'Total Assets', value: stats.totalAssets.toString(), icon: 'cube-outline' },
    { label: 'Active Assets', value: stats.activeAssets.toString(), icon: 'checkmark-circle-outline' },
    { label: 'Under Maintenance', value: stats.underMaintenance.toString(), icon: 'wrench-outline' },
    { label: 'Total Value', value: formatCurrency(stats.totalValue), icon: 'cash-outline' },
  ];

  // Filter assets based on search query
  const filteredAssets = assets.filter(
    (asset) =>
      asset.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset._id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'operational':
        return '#84CC16';
      case 'maintenance':
      case 'under-maintenance':
        return '#FF9800';
      case 'inactive':
      case 'retired':
        return '#9CA3AF';
      default:
        return '#6B7280';
    }
  };

  const getCategoryColor = (category: string) => {
    const lowerCategory = category?.toLowerCase() || '';
    if (lowerCategory.includes('it') || lowerCategory.includes('equipment')) return '#2196F3';
    if (lowerCategory.includes('facilit')) return '#FF9800';
    if (lowerCategory.includes('furniture')) return '#9C27B0';
    if (lowerCategory.includes('power')) return '#F44336';
    if (lowerCategory.includes('security')) return '#4CAF50';
    if (lowerCategory.includes('av') || lowerCategory.includes('audio')) return '#00BCD4';
    return '#6B7280';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  const handleAddAsset = () => {
    setNewAsset({
      name: '',
      category: 'Equipment',
      description: '',
      location: '',
      value: '',
      serialNumber: '',
      manufacturer: '',
      model: '',
      status: 'active',
      condition: 'good',
    });
    setAddAssetModalVisible(true);
  };

  const handleSaveAsset = async () => {
    // Validation
    if (!newAsset.name.trim()) {
      Alert.alert('Error', 'Please enter asset name');
      return;
    }
    if (!newAsset.location.trim()) {
      Alert.alert('Error', 'Please enter asset location');
      return;
    }

    setSavingAsset(true);
    try {
      // Generate a unique assetId
      const timestamp = Date.now().toString(36).toUpperCase();
      const random = Math.random().toString(36).substring(2, 6).toUpperCase();
      const assetId = `AST-${timestamp}-${random}`;

      const assetData = {
        assetId,
        name: newAsset.name.trim(),
        category: newAsset.category,
        description: newAsset.description.trim(),
        location: {
          building: newAsset.location.trim(),
          area: newAsset.location.trim(),
        },
        value: newAsset.value ? parseFloat(newAsset.value) : 0,
        serialNumber: newAsset.serialNumber.trim() || undefined,
        manufacturer: newAsset.manufacturer.trim() || undefined,
        model: newAsset.model.trim() || undefined,
        status: newAsset.status,
        condition: newAsset.condition,
      };

      const response = await assetService.createAsset(assetData);
      
      if (response.success) {
        Alert.alert('Success', 'Asset created successfully!');
        setAddAssetModalVisible(false);
        await fetchData(); // Refresh the list
      } else {
        Alert.alert('Error', response.message || 'Failed to create asset');
      }
    } catch (error: any) {
      console.error('Error creating asset:', error);
      Alert.alert('Error', error.message || 'Failed to create asset');
    } finally {
      setSavingAsset(false);
    }
  };

  const handleGenerateReport = async () => {
    Alert.alert(
      'Generate Report',
      'Select report type:',
      [
        {
          text: 'Asset Summary',
          onPress: () => generateAssetReport('summary'),
        },
        {
          text: 'Maintenance Report',
          onPress: () => generateAssetReport('maintenance'),
        },
        {
          text: 'Value Report',
          onPress: () => generateAssetReport('value'),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const generateAssetReport = async (reportType: string) => {
    try {
      const reportData = {
        type: reportType,
        generatedAt: new Date().toISOString(),
        totalAssets: stats.totalAssets,
        activeAssets: stats.activeAssets,
        underMaintenance: stats.underMaintenance,
        totalValue: stats.totalValue,
        assets: assets.map(a => ({
          name: a.name,
          category: a.category,
          status: a.status,
          value: a.value || a.purchasePrice || 0,
          location: a.location,
        })),
      };

      // For now, show a summary alert
      let reportMessage = '';
      if (reportType === 'summary') {
        reportMessage = `Asset Summary Report\n\nTotal Assets: ${stats.totalAssets}\nActive: ${stats.activeAssets}\nUnder Maintenance: ${stats.underMaintenance}\nTotal Value: ${formatCurrency(stats.totalValue)}`;
      } else if (reportType === 'maintenance') {
        const maintenanceAssets = assets.filter(a => a.status === 'maintenance' || a.status === 'under-maintenance');
        reportMessage = `Maintenance Report\n\nAssets Under Maintenance: ${maintenanceAssets.length}\n\n${maintenanceAssets.map(a => `• ${a.name} - ${a.location}`).join('\n') || 'No assets under maintenance'}`;
      } else if (reportType === 'value') {
        const sortedByValue = [...assets].sort((a, b) => (b.value || b.purchasePrice || 0) - (a.value || a.purchasePrice || 0)).slice(0, 5);
        reportMessage = `Value Report\n\nTotal Value: ${formatCurrency(stats.totalValue)}\n\nTop 5 Assets by Value:\n${sortedByValue.map(a => `• ${a.name}: ${formatCurrency(a.value || a.purchasePrice || 0)}`).join('\n') || 'No assets'}`;
      }

      Alert.alert('Report Generated', reportMessage);
    } catch (error) {
      console.error('Error generating report:', error);
      Alert.alert('Error', 'Failed to generate report');
    }
  };

  const renderAssetCard = ({ item }: { item: AssetType }) => (
    <View style={styles.assetCard}>
      <View style={styles.assetHeader}>
        <View>
          <Text style={styles.assetName}>{item.name}</Text>
          <Text style={styles.assetId}>AST-{item._id?.slice(-6).toUpperCase()}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status || 'active') },
          ]}
        >
          <Text style={styles.statusText}>
            {(item.status || 'active').charAt(0).toUpperCase() + (item.status || 'active').slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.assetDetails}>
        <View style={styles.detailRow}>
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: getCategoryColor(item.category || 'Other') },
            ]}
          >
            <Text style={styles.categoryText}>{item.category || 'Other'}</Text>
          </View>
          <Text style={styles.assetValue}>${(item.value || item.purchasePrice || 0).toLocaleString()}</Text>
        </View>

        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color="#6B7280" />
          <Text style={styles.locationText}>
            {typeof item.location === 'object' 
              ? (item.location?.building || item.location?.area || 'No location specified')
              : (item.location || 'No location specified')}
          </Text>
        </View>

        <Text style={styles.lastUpdated}>Updated: {formatDate(item.updatedAt || item.createdAt || '')}</Text>
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

      {/* Add Asset Modal */}
      <Modal
        visible={addAssetModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setAddAssetModalVisible(false)}
      >
        <View style={styles.addAssetModalOverlay}>
          <View style={styles.addAssetModalContent}>
            <View style={styles.addAssetModalHeader}>
              <Text style={styles.addAssetModalTitle}>Add New Asset</Text>
              <TouchableOpacity onPress={() => setAddAssetModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.addAssetForm} showsVerticalScrollIndicator={false}>
              {/* Asset Name */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Asset Name *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter asset name"
                  placeholderTextColor="#9CA3AF"
                  value={newAsset.name}
                  onChangeText={(text) => setNewAsset({ ...newAsset, name: text })}
                />
              </View>

              {/* Category */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Category *</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                  {assetCategories.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryOption,
                        newAsset.category === cat && styles.categoryOptionSelected
                      ]}
                      onPress={() => setNewAsset({ ...newAsset, category: cat })}
                    >
                      <Text style={[
                        styles.categoryOptionText,
                        newAsset.category === cat && styles.categoryOptionTextSelected
                      ]}>{cat}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Location */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Location *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter asset location"
                  placeholderTextColor="#9CA3AF"
                  value={newAsset.location}
                  onChangeText={(text) => setNewAsset({ ...newAsset, location: text })}
                />
              </View>

              {/* Value */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Value ($)</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter asset value"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  value={newAsset.value}
                  onChangeText={(text) => setNewAsset({ ...newAsset, value: text })}
                />
              </View>

              {/* Serial Number */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Serial Number</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter serial number"
                  placeholderTextColor="#9CA3AF"
                  value={newAsset.serialNumber}
                  onChangeText={(text) => setNewAsset({ ...newAsset, serialNumber: text })}
                />
              </View>

              {/* Manufacturer & Model */}
              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.formLabel}>Manufacturer</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="Manufacturer"
                    placeholderTextColor="#9CA3AF"
                    value={newAsset.manufacturer}
                    onChangeText={(text) => setNewAsset({ ...newAsset, manufacturer: text })}
                  />
                </View>
                <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.formLabel}>Model</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="Model"
                    placeholderTextColor="#9CA3AF"
                    value={newAsset.model}
                    onChangeText={(text) => setNewAsset({ ...newAsset, model: text })}
                  />
                </View>
              </View>

              {/* Status */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Status</Text>
                <View style={styles.statusOptions}>
                  {assetStatuses.map((status) => (
                    <TouchableOpacity
                      key={status.value}
                      style={[
                        styles.statusOption,
                        newAsset.status === status.value && styles.statusOptionSelected
                      ]}
                      onPress={() => setNewAsset({ ...newAsset, status: status.value })}
                    >
                      <Text style={[
                        styles.statusOptionText,
                        newAsset.status === status.value && styles.statusOptionTextSelected
                      ]}>{status.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Condition */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Condition</Text>
                <View style={styles.statusOptions}>
                  {assetConditions.map((cond) => (
                    <TouchableOpacity
                      key={cond.value}
                      style={[
                        styles.statusOption,
                        newAsset.condition === cond.value && styles.statusOptionSelected
                      ]}
                      onPress={() => setNewAsset({ ...newAsset, condition: cond.value })}
                    >
                      <Text style={[
                        styles.statusOptionText,
                        newAsset.condition === cond.value && styles.statusOptionTextSelected
                      ]}>{cond.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Description */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Description</Text>
                <TextInput
                  style={[styles.formInput, styles.formTextArea]}
                  placeholder="Enter asset description"
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={3}
                  value={newAsset.description}
                  onChangeText={(text) => setNewAsset({ ...newAsset, description: text })}
                />
              </View>

              {/* Save Button */}
              <TouchableOpacity
                style={[styles.saveAssetButton, savingAsset && styles.saveAssetButtonDisabled]}
                onPress={handleSaveAsset}
                disabled={savingAsset}
              >
                {savingAsset ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.saveAssetButtonText}>Save Asset</Text>
                )}
              </TouchableOpacity>

              <View style={{ height: 30 }} />
            </ScrollView>
          </View>
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

        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#0E7490']}
              tintColor="#0E7490"
            />
          }
        >
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>Asset Manager Dashboard</Text>
            <Text style={styles.subtitle}>Hi, {user?.fullName?.split(' ')[0] || 'User'}! Monitor and manage your assets</Text>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0E7490" />
            </View>
          ) : (
            <>
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
                <TouchableOpacity style={styles.createButton} onPress={handleAddAsset}>
                  <Text style={styles.createButtonText}>Add New Asset</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.exportButton} onPress={handleGenerateReport}>
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
                    keyExtractor={(item) => item._id || Math.random().toString()}
                    scrollEnabled={false}
                  />
                ) : (
                  <View style={styles.emptyState}>
                    <Ionicons name="cube-outline" size={48} color="#D1D5DB" />
                    <Text style={styles.emptyStateText}>No assets found</Text>
                  </View>
                )}
              </View>
            </>
          )}

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  // Add Asset Modal Styles
  addAssetModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  addAssetModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  addAssetModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  addAssetModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  addAssetForm: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1F2937',
  },
  formTextArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  categoryScroll: {
    flexGrow: 0,
  },
  categoryOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 10,
  },
  categoryOptionSelected: {
    backgroundColor: '#0E7490',
  },
  categoryOptionText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  categoryOptionTextSelected: {
    color: '#FFFFFF',
  },
  statusOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statusOption: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  statusOptionSelected: {
    backgroundColor: '#0E7490',
  },
  statusOptionText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  statusOptionTextSelected: {
    color: '#FFFFFF',
  },
  saveAssetButton: {
    backgroundColor: '#0E7490',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  saveAssetButtonDisabled: {
    opacity: 0.6,
  },
  saveAssetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
