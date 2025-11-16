import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

type Feature = {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
};

const features: Feature[] = [
  {
    id: '1',
    title: 'Live Train Status',
    description: 'Track trains in real-time with current location and delays',
    icon: 'train-outline',
    route: '/(tabs)/live-status',
  },
  {
    id: '2',
    title: 'Trains by Station',
    description: 'Find all trains originating or passing through any station',
    icon: 'business-outline',
    route: '/(tabs)/trains-by-station',
  },
  {
    id: '3',
    title: 'Live Station Search',
    description: 'Search trains between stations with time windows',
    icon: 'search-outline',
    route: '/(tabs)/live-station',
  },
  {
    id: '4',
    title: 'Fare Enquiry',
    description: 'Check ticket prices with detailed fare breakup',
    icon: 'cash-outline',
    route: '/(tabs)/fare-enquiry',
  },
  {
    id: '5',
    title: 'Seat Availability',
    description: 'View seat availability for next 7 days with quota details',
    icon: 'accessibility-outline',
    route: '/(tabs)/seat-availability',
  },
  {
    id: '6',
    title: 'PNR Status',
    description: 'Check your ticket confirmation and passenger details',
    icon: 'ticket-outline',
    route: '/(tabs)/pnr-status',
  },
];

export default function HomePage() {
  const { colors, theme } = useTheme();
  const router = useRouter();
  const isDark = theme === 'dark';
  
  const { 
    background: bgColor, 
    text: textColor, 
    textSecondary, 
    primary: primaryColor, 
    primaryLight: primaryBg,
    card,
    info,
    infoBg,
    textTertiary
  } = colors;

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={[styles.heroSection, { backgroundColor: primaryBg }]}>
        <View style={styles.heroContent}>
          <Ionicons name="train-outline" size={64} color={primaryColor} style={styles.heroIcon} />
          <Text style={[styles.heroTitle, { color: primaryColor }]}>RailVerse</Text>
          <Text style={[styles.heroSubtitle, { color: isDark ? textSecondary : primaryColor }]}>
            Your Complete Railway Companion
          </Text>
          <Text style={[styles.heroDescription, { color: textSecondary }]}>
            Track trains, check PNR status, and explore comprehensive railway information - all in one place
          </Text>
        </View>
      </View>

      <View style={styles.statsSection}>
        <View style={[styles.statCard, { backgroundColor: card }]}>
          <Ionicons name="grid-outline" size={28} color={primaryColor} style={styles.statIcon} />
          <Text style={[styles.statValue, { color: primaryColor }]}>6</Text>
          <Text style={[styles.statLabel, { color: textSecondary }]}>Features</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: card }]}>
          <Ionicons name="flash-outline" size={28} color={primaryColor} style={styles.statIcon} />
          <Text style={[styles.statValue, { color: primaryColor }]}>Real-time</Text>
          <Text style={[styles.statLabel, { color: textSecondary }]}>Updates</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: card }]}>
          <Ionicons name="checkmark-circle-outline" size={28} color={primaryColor} style={styles.statIcon} />
          <Text style={[styles.statValue, { color: primaryColor }]}>100%</Text>
          <Text style={[styles.statLabel, { color: textSecondary }]}>Accurate</Text>
        </View>
      </View>

      <View style={styles.featuresSection}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Explore Features</Text>
          <Text style={[styles.sectionSubtitle, { color: textSecondary }]}>
            Everything you need for a smooth railway journey
          </Text>
        </View>

        <View style={styles.featuresGrid}>
          {features.map((feature) => (
            <TouchableOpacity
              key={feature.id}
              style={[styles.featureCard, { backgroundColor: card }]}
              onPress={() => router.push(feature.route as any)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: primaryBg }]}>
                <Ionicons name={feature.icon} size={28} color={primaryColor} />
              </View>
              <View style={styles.featureContent}>
                <Text style={[styles.featureTitle, { color: textColor }]}>{feature.title}</Text>
                <Text style={[styles.featureDescription, { color: textSecondary }]}>
                  {feature.description}
                </Text>
              </View>
              <View style={[styles.arrowContainer, { backgroundColor: primaryBg }]}>
                <Ionicons name="arrow-forward-outline" size={18} color={primaryColor} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.quickActionsSection}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity style={[styles.quickActionCard, { backgroundColor: card }]}>
            <Ionicons name="map-outline" size={32} color={primaryColor} style={styles.quickActionIcon} />
            <Text style={[styles.quickActionText, { color: textColor }]}>Nearby Stations</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickActionCard, { backgroundColor: card }]}>
            <Ionicons name="timer-outline" size={32} color={primaryColor} style={styles.quickActionIcon} />
            <Text style={[styles.quickActionText, { color: textColor }]}>Running Status</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickActionCard, { backgroundColor: card }]}>
            <Ionicons name="calendar-outline" size={32} color={primaryColor} style={styles.quickActionIcon} />
            <Text style={[styles.quickActionText, { color: textColor }]}>Train Schedule</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickActionCard, { backgroundColor: card }]}>
            <Ionicons name="navigate-outline" size={32} color={primaryColor} style={styles.quickActionIcon} />
            <Text style={[styles.quickActionText, { color: textColor }]}>Route Map</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.infoBanner, { backgroundColor: infoBg }]}>
        <Ionicons name="bulb-outline" size={32} color={info} style={styles.infoBannerIcon} />
        <View style={styles.infoBannerContent}>
          <Text style={[styles.infoBannerTitle, { color: info }]}>
            Pro Tip
          </Text>
          <Text style={[styles.infoBannerText, { color: textSecondary }]}>
            Bookmark your frequently searched trains and stations for quick access
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: textSecondary }]}>
          Made with <Ionicons name="heart" size={13} color={colors.error} /> for Indian Railways
        </Text>
        <Text style={[styles.footerVersion, { color: textTertiary }]}>
          Version 1.0.0
        </Text>
      </View>
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
  heroSection: {
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroIcon: {
    marginBottom: 10,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: 1,
  },
  heroSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  heroDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginTop: 25,
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    textAlign: 'center',
  },
  featuresSection: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  featuresGrid: {
    gap: 16,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    gap: 14,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureContent: {
    flex: 1,
    gap: 4,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  featureDescription: {
    fontSize: 12,
    lineHeight: 18,
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionsSection: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  quickActionCard: {
    width: (width - 56) / 2,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  quickActionIcon: {
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  infoBanner: {
    marginHorizontal: 20,
    marginTop: 25,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoBannerIcon: {
  },
  infoBannerContent: {
    flex: 1,
  },
  infoBannerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  infoBannerText: {
    fontSize: 12,
    lineHeight: 18,
  },
  footer: {
    marginTop: 30,
    paddingVertical: 20,
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 13,
  },
  footerVersion: {
    fontSize: 11,
  },
});
