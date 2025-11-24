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
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Sidebar from '../components/Sidebar';

interface OrderDashboardScreenProps {
  navigation: NativeStackNavigationProp<any, any>;
}

interface StatCard {
  label: string;
  value: string;
  icon: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  status: 'pending' | 'completed' | 'shipped';
  amount: string;
  date: string;
}

export default function OrderDashboardScreen({ navigation }: OrderDashboardScreenProps) {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleMenuPress = () => {
    setSidebarVisible(true);
  };

  const handleSidebarNavigate = (screen: string) => {
    setSidebarVisible(false);
    if (screen === 'Dashboard') {
      navigation.navigate('OrderDashboard' as never);
    } else if (screen === 'OrderDashboard') {
      navigation.navigate('OrderDashboard' as never);
    } else if (screen === 'Others') {
      navigation.navigate('Others' as never);
    } else if (screen === 'Settings') {
      navigation.navigate('Settings' as never);
    }
  };

  const handleLogout = () => {
    setSidebarVisible(false);
    navigation.navigate('Boarding' as never);
  };

  const statCards: StatCard[] = [
    { label: 'Total Orders', value: '1,234', icon: 'package-multiple' },
    { label: 'Pending Orders', value: '45', icon: 'clock-outline' },
    { label: 'Completed Today', value: '23', icon: 'check-circle-outline' },
    { label: 'Total Revenue', value: '$45,230', icon: 'currency-usd' },
  ];

  const mockOrders: Order[] = [
    // Management User Orders
    {
      id: '1',
      orderNumber: 'ORD-001234',
      customerName: 'John Smith (Management)',
      status: 'completed',
      amount: '$1,250.00',
      date: '2024-11-24',
    },
    {
      id: '2',
      orderNumber: 'ORD-001235',
      customerName: 'Sarah Johnson (Management)',
      status: 'pending',
      amount: '$890.50',
      date: '2024-11-24',
    },
    {
      id: '3',
      orderNumber: 'ORD-001236',
      customerName: 'Michael Brown (Management)',
      status: 'shipped',
      amount: '$2,150.00',
      date: '2024-11-23',
    },
    // Other User Orders
    {
      id: '4',
      orderNumber: 'ORD-001237',
      customerName: 'Emma Davis (Other)',
      status: 'completed',
      amount: '$675.25',
      date: '2024-11-23',
    },
    {
      id: '5',
      orderNumber: 'ORD-001238',
      customerName: 'Robert Wilson (Other)',
      status: 'pending',
      amount: '$1,425.00',
      date: '2024-11-22',
    },
    {
      id: '6',
      orderNumber: 'ORD-001239',
      customerName: 'Lisa Anderson (Other)',
      status: 'shipped',
      amount: '$950.75',
      date: '2024-11-22',
    },
    // Assets Manager User Orders
    {
      id: '7',
      orderNumber: 'ORD-001240',
      customerName: 'David Martinez (Assets Manager)',
      status: 'completed',
      amount: '$3,200.00',
      date: '2024-11-21',
    },
    {
      id: '8',
      orderNumber: 'ORD-001241',
      customerName: 'Jennifer Lee (Assets Manager)',
      status: 'pending',
      amount: '$1,850.50',
      date: '2024-11-21',
    },
    {
      id: '9',
      orderNumber: 'ORD-001242',
      customerName: 'Christopher Taylor (Assets Manager)',
      status: 'shipped',
      amount: '$2,500.00',
      date: '2024-11-20',
    },
    {
      id: '10',
      orderNumber: 'ORD-001243',
      customerName: 'Amanda White (Other)',
      status: 'completed',
      amount: '$1,100.00',
      date: '2024-11-20',
    },
    {
      id: '11',
      orderNumber: 'ORD-001244',
      customerName: 'Kevin Harris (Management)',
      status: 'pending',
      amount: '$2,300.75',
      date: '2024-11-19',
    },
    {
      id: '12',
      orderNumber: 'ORD-001245',
      customerName: 'Rachel Green (Assets Manager)',
      status: 'shipped',
      amount: '$1,650.00',
      date: '2024-11-19',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#84CC16';
      case 'pending':
        return '#FF9800';
      case 'shipped':
        return '#0E7490';
      default:
        return '#6B7280';
    }
  };

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
              userType="Other"
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
              <Text style={styles.orText}>OR</Text>
            </View>
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>Other Dashboard</Text>
            <Text style={styles.subtitle}>Manage and track your orders</Text>
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
              <Text style={styles.createButtonText}>Create New Order</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.exportButton}>
              <Text style={styles.exportButtonText}>Export Orders</Text>
            </TouchableOpacity>
          </View>

          {/* Search Section */}
          <View style={styles.searchSection}>
            <Text style={styles.searchTitle}>Search Orders</Text>
            <View style={styles.searchInputContainer}>
              <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by order ID or customer name"
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          {/* Orders List */}
          <View style={styles.ordersListContainer}>
            <Text style={styles.ordersTitle}>Recent Orders</Text>
            {mockOrders.map((order) => (
              <View key={order.id} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <View>
                    <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                    <Text style={styles.customerName}>{order.customerName}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(order.status) },
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Text>
                  </View>
                </View>
                <View style={styles.orderFooter}>
                  <Text style={styles.orderDate}>{order.date}</Text>
                  <Text style={styles.orderAmount}>{order.amount}</Text>
                </View>
              </View>
            ))}
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
  orText: {
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
  ordersListContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  ordersTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  orderCard: {
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
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  customerName: {
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
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 10,
  },
  orderDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  orderAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
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
