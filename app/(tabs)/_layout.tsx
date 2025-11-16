import { Ionicons } from '@expo/vector-icons';
import { Tabs, usePathname, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { useTheme } from '@/hooks/useTheme';

function ThemeToggleButton() {
  const { theme, toggleTheme, colors } = useTheme();
  return (
    <TouchableOpacity onPress={toggleTheme} style={{ marginRight: 15 }}>
      <Ionicons 
        name={theme === 'dark' ? 'sunny-outline' : 'moon-outline'} 
        size={24} 
        color={colors.text}
      />
    </TouchableOpacity>
  );
}

function MenuButton() {
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { colors } = useTheme();

  type TabRoute = "/(tabs)" | "/(tabs)/live-status" | "/(tabs)/trains-by-station" | "/(tabs)/live-station" | "/(tabs)/fare-enquiry" | "/(tabs)/seat-availability" | "/(tabs)/pnr-status" | "/(tabs)/explore";

  const menuItems: {
    name: string;
    route: TabRoute;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    description: string;
  }[] = [
    { 
      name: 'Home', 
      route: '/(tabs)', 
      icon: 'home-outline',
      color: colors.primary,
      description: 'Welcome to RailVerse'
    },
    { 
      name: 'Live Train Status', 
      route: '/(tabs)/live-status', 
      icon: 'train-outline',
      color: colors.liveStatus,
      description: 'Track trains in real-time'
    },
    { 
      name: 'Trains by Station', 
      route: '/(tabs)/trains-by-station', 
      icon: 'business-outline',
      color: colors.trainsByStation,
      description: 'Find all trains at a station'
    },
    { 
      name: 'Live Station Search', 
      route: '/(tabs)/live-station', 
      icon: 'search-outline',
      color: colors.liveStation,
      description: 'Search trains between stations'
    },
    { 
      name: 'Fare Enquiry', 
      route: '/(tabs)/fare-enquiry', 
      icon: 'wallet-outline',
      color: colors.fareEnquiry.header,
      description: 'Check ticket prices'
    },
    { 
      name: 'Seat Availability', 
      route: '/(tabs)/seat-availability', 
      icon: 'accessibility-outline',
      color: colors.seatAvailability.header,
      description: 'Check seat status'
    },
    { 
      name: 'PNR Status', 
      route: '/(tabs)/pnr-status', 
      icon: 'ticket-outline',
      color: colors.pnrStatus,
      description: 'Check ticket confirmation'
    },
    { 
      name: 'Explore', 
      route: '/(tabs)/explore', 
      icon: 'compass-outline',
      color: colors.explore,
      description: 'Discover more features'
    },
  ];

  const handleNavigation = (route: TabRoute) => {
    setMenuVisible(false);
    router.push(route);
  };

  return (
    <>
      <TouchableOpacity 
        style={styles.menuButton}
        onPress={() => setMenuVisible(true)}
      >
        <Ionicons name="menu" size={28} color={colors.text} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setMenuVisible(false)}
        >
          <View style={[styles.menuContainer, { backgroundColor: colors.card }]}>
            <View style={styles.menuHeader}>
              <Text style={[styles.menuTitle, { color: colors.text }]}>RailVerse Menu</Text>
              <TouchableOpacity onPress={() => setMenuVisible(false)}>
                <Ionicons name="close" size={28} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.menuGrid}>
              {menuItems.map((item) => (
                <TouchableOpacity
                  key={item.name}
                  style={[
                    styles.menuItem,
                    { 
                      backgroundColor: colors.background,
                      borderColor: item.route === pathname ? item.color : colors.border,
                    }
                  ]}
                  onPress={() => handleNavigation(item.route)}
                >
                  <View style={[styles.menuItemIconContainer, { backgroundColor: item.color + '20' }]}>
                    <Ionicons name={item.icon} size={24} color={item.color} />
                  </View>
                  <Text style={[styles.menuItemText, { color: colors.text }]}>{item.name}</Text>
                  <Text style={[styles.menuItemDescription, { color: colors.textSecondary }]}>{item.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

export default function TabLayout() {
  const { colors } = useTheme();
  const pathname = usePathname();

  const getHeaderTitle = () => {
    switch (pathname) {
      case '/(tabs)':
        return 'Home';
      case '/(tabs)/live-status':
        return 'Live Train Status';
      case '/(tabs)/trains-by-station':
        return 'Trains by Station';
      case '/(tabs)/live-station':
        return 'Live Station Search';
      case '/(tabs)/fare-enquiry':
        return 'Fare Enquiry';
      case '/(tabs)/seat-availability':
        return 'Seat Availability';
      case '/(tabs)/pnr-status':
        return 'PNR Status';
      case '/(tabs)/explore':
        return 'Explore';
      default:
        return 'RailVerse';
    }
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.card,
          shadowColor: colors.shadow,
        },
        headerTintColor: colors.text,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerLeft: () => <MenuButton />,
        headerRight: () => <ThemeToggleButton />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <HapticTab>
              <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
            </HapticTab>
          ),
          headerTitle: getHeaderTitle,
        }}
      />
      <Tabs.Screen
        name="live-status"
        options={{
          title: 'Live Status',
          tabBarIcon: ({ color, focused }) => (
            <HapticTab>
              <Ionicons name={focused ? 'train' : 'train-outline'} size={24} color={color} />
            </HapticTab>
          ),
          headerTitle: getHeaderTitle,
        }}
      />
      <Tabs.Screen
        name="trains-by-station"
        options={{
          title: 'Stations',
          tabBarIcon: ({ color, focused }) => (
            <HapticTab>
              <Ionicons name={focused ? 'business' : 'business-outline'} size={24} color={color} />
            </HapticTab>
          ),
          headerTitle: getHeaderTitle,
        }}
      />
      <Tabs.Screen
        name="seat-availability"
        options={{
          title: 'Seats',
          tabBarIcon: ({ color, focused }) => (
            <HapticTab>
              <Ionicons name={focused ? 'accessibility' : 'accessibility-outline'} size={24} color={color} />
            </HapticTab>
          ),
          headerTitle: getHeaderTitle,
        }}
      />
      <Tabs.Screen
        name="pnr-status"
        options={{
          title: 'PNR',
          tabBarIcon: ({ color, focused }) => (
            <HapticTab>
              <Ionicons name={focused ? 'ticket' : 'ticket-outline'} size={24} color={color} />
            </HapticTab>
          ),
          headerTitle: getHeaderTitle,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
          headerTitle: getHeaderTitle,
        }}
      />
      <Tabs.Screen
        name="live-station"
        options={{
          href: null,
          headerTitle: getHeaderTitle,
        }}
      />
      <Tabs.Screen
        name="fare-enquiry"
        options={{
          href: null,
          headerTitle: getHeaderTitle,
        }}
      />
      <Tabs.Screen
        name="search-train"
        options={{
          title: 'Search Train',
          tabBarIcon: ({ color, focused }) => (
            <HapticTab>
              <Ionicons name={focused ? 'search' : 'search-outline'} size={24} color={color} />
            </HapticTab>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    marginLeft: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
  },
  menuContainer: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    width: '48%',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 2,
  },
  menuItemIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  menuItemDescription: {
    fontSize: 12,
    textAlign: 'center',
  },
});

