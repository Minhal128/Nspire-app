import React, { useState, useEffect, useCallback } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Sidebar from "../components/Sidebar";
import { userService, authService } from "../services";
import { User as ApiUser } from "../services/api";

interface OthersScreenProps {
  navigation: NativeStackNavigationProp<any, any>;
}

interface User {
  id: string;
  name: string;
  email: string;
  userType: string;
  joinDate: string;
  status: "active" | "inactive";
  avatar?: string;
}

export default function OthersScreen({ navigation }: OthersScreenProps) {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  const loadUsers = useCallback(async () => {
    try {
      const response = await userService.getOtherUsers();
      const usersList = response.users || response || [];

      // Filter non-inspector users and map to expected format
      const mappedUsers: User[] = usersList
        .filter((u: any) => u.role !== "inspector")
        .map((u: any) => ({
          id: u.id || u._id || 'unknown',
          name: u.fullName || u.name || 'Unknown',
          email: u.email || 'unknown@email.com',
          userType: formatUserType(u.role),
          joinDate: u.lastLogin ? new Date(u.lastLogin).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
          status: "active" as const,
        }));

      setUsers(mappedUsers);
    } catch (error) {
      console.error("Error loading users:", error);
      Alert.alert("Error", "Failed to load users");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const formatUserType = (role: string) => {
    switch (role) {
      case "management":
        return "Management";
      case "property-manager":
        return "Property Manager";
      case "supervisor":
        return "Supervisor";
      case "admin":
        return "Admin";
      default:
        return "Other";
    }
  };

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadUsers();
  }, [loadUsers]);

  const handleMenuPress = () => {
    setSidebarVisible(true);
  };

  const handleSidebarNavigate = (screen: string) => {
    setSidebarVisible(false);
    if (screen === "Dashboard") {
      navigation.navigate("OrderDashboard" as never);
    } else if (screen === "OrderDashboard") {
      navigation.navigate("OrderDashboard" as never);
    } else if (screen === "Others") {
      // Already on Others screen
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setSidebarVisible(false);
      navigation.reset({
        index: 0,
        routes: [{ name: "Boarding" as never }],
      });
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case "Management":
        return "#FF9800";
      case "Other":
        return "#9C27B0";
      default:
        return "#6B7280";
    }
  };

  const getStatusColor = (status: string) => {
    return status === "active" ? "#84CC16" : "#9CA3AF";
  };

  const renderUserCard = ({ item }: { item: User }) => (
    <View style={styles.userCard}>
      <View style={styles.userCardContent}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
          </View>
        </View>
        <View style={styles.userInfo}>
          <View style={styles.userNameRow}>
            <Text style={styles.userName}>{item.name}</Text>
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
          <Text style={styles.userEmail}>{item.email}</Text>
          <View style={styles.userMetaRow}>
            <View
              style={[
                styles.userTypeBadge,
                { backgroundColor: getUserTypeColor(item.userType) },
              ]}
            >
              <Text style={styles.userTypeText}>{item.userType}</Text>
            </View>
            <Text style={styles.joinDate}>Joined: {item.joinDate}</Text>
          </View>
        </View>
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
              source={require("../../logo.png")}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <View style={styles.notificationBadge}>
              <TouchableOpacity>
                <Ionicons
                  name="notifications-outline"
                  size={28}
                  color="#1F2937"
                />
              </TouchableOpacity>
              <Text style={styles.orText}>OR</Text>
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
              colors={["#0E7490"]}
            />
          }
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0E7490" />
              <Text style={styles.loadingText}>Loading users...</Text>
            </View>
          ) : (
            <>
              {/* Title Section */}
              <View style={styles.titleSection}>
                <Text style={styles.mainTitle}>Other Users</Text>
                <Text style={styles.subtitle}>
                  Recent users who are not inspectors
                </Text>
              </View>

              {/* Search Section */}
              <View style={styles.searchSection}>
                <Text style={styles.searchTitle}>Search Users</Text>
                <View style={styles.searchInputContainer}>
                  <Ionicons
                    name="search"
                    size={20}
                    color="#9CA3AF"
                    style={styles.searchIcon}
                  />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search by name or email"
                    placeholderTextColor="#9CA3AF"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>
              </View>

              {/* Users List */}
              <View style={styles.usersListContainer}>
                <Text style={styles.usersTitle}>
                  All Users ({filteredUsers.length})
                </Text>
                {filteredUsers.length > 0 ? (
                  <FlatList
                    data={filteredUsers}
                    renderItem={renderUserCard}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                    ItemSeparatorComponent={() => (
                      <View style={styles.separator} />
                    )}
                  />
                ) : (
                  <View style={styles.emptyState}>
                    <Ionicons name="people-outline" size={48} color="#D1D5DB" />
                    <Text style={styles.emptyStateText}>No users found</Text>
                  </View>
                )}
              </View>

              {/* Bottom Spacing */}
              <View style={{ height: 40 }} />
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F4F8",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
  },
  headerContainer: {
    backgroundColor: "#0E7490",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerBar: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 15,
  },
  headerLogo: {
    width: 240,
    height: 65,
  },
  notificationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  orText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
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
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 10,
  },
  searchInputContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    shadowColor: "#000",
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
    color: "#374151",
  },
  usersListContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  usersTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 12,
  },
  userCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  userCardContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#0E7490",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
  userInfo: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  userName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  userEmail: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 8,
  },
  userMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  userTypeBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  userTypeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
  },
  joinDate: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  separator: {
    height: 0,
  },
  emptyState: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#9CA3AF",
    marginTop: 12,
  },
  modalOverlay: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalBackdrop: {
    flex: 1,
  },
  sidebarContainer: {
    width: 280,
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
