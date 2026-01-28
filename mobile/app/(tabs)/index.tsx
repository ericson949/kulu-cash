import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// MOCK DATA
const TONTINES = [
    { title: 'Family Land Fund', progress: 0.75, status: '8/12 members contributed', color: '#818cf8', icon: 'groups' },
    { title: 'Tech Workers Weekly', progress: 0.40, status: '3 days remaining', color: '#fbbf24', icon: 'devices' },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Background with subtle gradient overlap if needed, but solid dark is fine */}
      
      {/* HEADER */}
      <BlurView intensity={20} tint="dark" style={styles.headerGlass}>
        <SafeAreaView edges={['top']} style={styles.headerContent}>
            <View style={styles.headerRow}>
                <View style={styles.userInfo}>
                    <LinearGradient
                        colors={[Colors.primary, 'rgba(13, 242, 89, 0.2)']}
                        style={styles.avatarBorder}
                    >
                        <Image 
                            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbSPIdHeZCPGwzMhsoTElunvyKcAKs_YqM8wd-HnxNFHDSWwoqM-jb-GyB15r5sBHrjvrB5fHSVaUmJ8X6m_EyX5ECdL2V9ovaQa3tXXnqj7NRPpyio8YmitA6ek6o2rfMRfVkbjVVnwGk582_oJGBqV7JwnWnkvePEl0nba-K4CJYOwU7xebA0YQLvGSfIPIb1OM820C2vBamT1OIm_LGGB-B21gVALpQe1Wa-qscU-2vhc6gSVyXadU5-KGgy_LtExg0idBwpEb9' }} 
                            style={styles.avatar} 
                        />
                    </LinearGradient>
                    <View>
                        <Text style={styles.greeting}>Hey, Explorer!</Text>
                        <Text style={styles.date}>Monday, January 26</Text>
                    </View>
                </View>
                
                <View style={styles.statusBadge}>
                    <View style={styles.activeDot}>
                        <View style={styles.activeDotInner} />
                        <View style={styles.activeDotPulse} />
                    </View>
                    <Text style={styles.statusText}>ACTIVE</Text>
                </View>
            </View>
        </SafeAreaView>
      </BlurView>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        
        {/* CURRENT FOCUS */}
        <View style={styles.section}>
            <LinearGradient
                colors={['#161e19', '#000000']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.focusCard}
            >
                {/* Card Header */}
                <View style={styles.cardHeader}>
                    <View style={styles.flexRow}>
                        <View style={styles.focusIconBg}>
                            <MaterialIcons name="track-changes" size={20} color={Colors.primary} />
                        </View>
                        <Text style={styles.focusTitle}>Current Focus</Text>
                    </View>
                    <View style={styles.urgentBadge}>
                        <Text style={styles.urgentText}>URGENT</Text>
                    </View>
                </View>

                {/* Card Content */}
                <View style={styles.cardBody}>
                    <View style={[styles.flexRow, { justifyContent: 'space-between', alignItems: 'flex-start' }]}>
                        <View>
                            <Text style={styles.subLabel}>SUNDAY SAVINGS CIRCLE</Text>
                            <Text style={styles.mainTitle}>Contribution Due</Text>
                        </View>
                        <TouchableOpacity style={styles.detailsBtn}>
                            <Text style={styles.detailsText}>DETAILS</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Stats Row */}
                    <View style={styles.statsContainer}>
                        <View>
                            <Text style={styles.statValue}>02d : 14h</Text>
                            <Text style={styles.statLabel}>NEXT BOUT STARTS</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={{ alignItems: 'flex-end' }}>
                             <Text style={styles.statValueWhite}>₦25,000</Text>
                             <Text style={styles.statLabel}>YOUR SHARE</Text>
                        </View>
                    </View>

                    {/* Action Button */}
                    <TouchableOpacity activeOpacity={0.9}>
                        <LinearGradient
                            colors={[Colors.primary, '#0cfc60']}
                            style={styles.payButton}
                        >
                            <Text style={styles.payButtonText}>PAY CONTRIBUTION</Text>
                            <MaterialIcons name="arrow-forward" size={20} color={Colors.background} style={{fontWeight: 'bold'}} />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </View>

        {/* MILESTONES */}
        <View style={styles.section}>
            <View style={styles.milestoneCard}>
                <View style={styles.flexRow}>
                    <View style={styles.milestoneIconBg}>
                        <MaterialIcons name="military-tech" size={18} color={Colors.primary} />
                    </View>
                    <View>
                        <Text style={styles.milestoneLabel}>MILESTONES</Text>
                        <Text style={styles.milestoneValue}>LEVEL 12 <Text style={{color: 'rgba(13, 242, 89, 0.6)'}}>650 XP</Text></Text>
                    </View>
                </View>
                <View style={styles.progressBarBase}>
                    <View style={[styles.progressBarFill, { width: '65%' }]} />
                </View>
            </View>
        </View>

        {/* ACTIVE TONTINES */}
        <View style={styles.section}>
            <View style={[styles.flexRow, { justifyContent: 'space-between', marginBottom: 15, paddingHorizontal: 4 }]}>
                <Text style={styles.sectionHeader}>Active Tontines</Text>
                <View style={styles.countBadge}>
                    <Text style={styles.countText}>2 CIRCLES</Text>
                </View>
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20, paddingHorizontal: 20 }}>
                {TONTINES.map((t, i) => (
                    <View key={i} style={styles.tontineCard}>
                        <View style={[styles.flexRow, { justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }]}>
                            <View style={[styles.tontineIconBox, { backgroundColor: `${t.color}20`, borderColor: `${t.color}40` }]}>
                                <MaterialIcons name={t.icon as any} size={24} color={t.color} />
                            </View>
                            <Text style={[styles.percentageText, { color: t.color }]}>{Math.round(t.progress * 100)}%</Text>
                        </View>
                        
                        <View style={{ marginBottom: 12 }}>
                            <Text style={styles.tontineTitle}>{t.title}</Text>
                            <Text style={styles.tontineSubtitle}>{t.status}</Text>
                        </View>

                        <View style={styles.miniProgressBase}>
                            <View style={[styles.miniProgressFill, { width: `${t.progress * 100}%`, backgroundColor: t.color }]} />
                        </View>

                        <TouchableOpacity style={styles.viewDetailsRow}>
                            <Text style={styles.viewDetailsText}>VIEW DETAILS</Text>
                            <MaterialIcons name="arrow-forward" size={14} color="rgba(255,255,255,0.5)" />
                        </TouchableOpacity>
                    </View>
                ))}
                <View style={{width: 20}} /> 
            </ScrollView>
        </View>

      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
      paddingBottom: 120,
      paddingTop: 10,
  },
  section: {
      paddingHorizontal: 20,
      marginBottom: 30,
  },
  
  // HEADER
  headerGlass: {
    paddingBottom: 20,
    backgroundColor: 'rgba(10, 15, 12, 0.8)',
    zIndex: 10,
  },
  headerContent: {
      paddingHorizontal: 20,
  },
  headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 10,
  },
  userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
  },
  avatarBorder: {
      width: 48,
      height: 48,
      borderRadius: 24,
      padding: 2,
  },
  avatar: {
      width: '100%',
      height: '100%',
      borderRadius: 24,
      borderWidth: 2,
      borderColor: Colors.background,
      backgroundColor: '#222',
  },
  greeting: {
      color: '#FFF',
      fontSize: 18,
      fontWeight: 'bold',
      letterSpacing: -0.5,
  },
  date: {
      color: Colors.textSecondary,
      fontSize: 12,
      fontWeight: '500',
  },
  statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(13, 242, 89, 0.1)',
      borderColor: 'rgba(13, 242, 89, 0.2)',
      borderWidth: 1,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 20,
      gap: 6,
  },
  statusText: {
      color: Colors.primary,
      fontSize: 10,
      fontWeight: '900',
      letterSpacing: 1,
  },
  activeDot: {
      width: 8,
      height: 8,
      justifyContent: 'center',
      alignItems: 'center',
  },
  activeDotInner: {
      width: 6, 
      height: 6, 
      backgroundColor: Colors.primary, 
      borderRadius: 4, 
      zIndex: 2,
  },
  activeDotPulse: {
     position: 'absolute',
     width: 12,
     height: 12,
     backgroundColor: Colors.primary,
     opacity: 0.5,
     borderRadius: 6,
  },

  // CARDS 
  focusCard: {
      borderRadius: 24,
      borderWidth: 1,
      borderColor: 'rgba(13, 242, 89, 0.2)',
      overflow: 'hidden',
  },
  cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 20,
      alignItems: 'center',
  },
  focusTitle: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 10,
      letterSpacing: -0.5,
  },
  focusIconBg: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(13, 242, 89, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
  },
  urgentBadge: {
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      borderWidth: 1,
      borderColor: 'rgba(239, 68, 68, 0.2)',
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 12,
  },
  urgentText: {
      color: '#ef4444',
      fontSize: 10,
      fontWeight: 'bold',
      letterSpacing: 0.5,
  },
  cardBody: {
      paddingHorizontal: 20,
      paddingBottom: 24,
      gap: 24,
  },
  flexRow: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  subLabel: {
      color: Colors.textSecondary,
      fontSize: 10,
      fontWeight: 'bold',
      letterSpacing: 1.5,
      marginBottom: 4,
  },
  mainTitle: {
      color: '#FFF',
      fontSize: 20,
      fontWeight: 'bold',
  },
  detailsBtn: {
      backgroundColor: 'rgba(13, 242, 89, 0.05)',
      borderWidth: 1,
      borderColor: 'rgba(13, 242, 89, 0.1)',
      paddingVertical: 4,
      paddingHorizontal: 12,
      borderRadius: 20,
  },
  detailsText: {
      color: Colors.primary,
      fontSize: 10,
      fontWeight: 'bold',
      letterSpacing: 1,
  },
  statsContainer: {
      backgroundColor: 'rgba(255,255,255,0.05)',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.05)',
      borderRadius: 16,
      padding: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  },
  statValue: {
      fontSize: 24,
      fontWeight: '900',
      color: Colors.primary,
      letterSpacing: -1,
  },
  statValueWhite: {
      fontSize: 24,
      fontWeight: '900',
      color: '#FFF',
      letterSpacing: -1,
  },
  statLabel: {
      color: Colors.textSecondary,
      fontSize: 9,
      fontWeight: 'bold',
      letterSpacing: 1,
      marginTop: 2,
  },
  statDivider: {
      width: 1,
      height: 32,
      backgroundColor: 'rgba(255,255,255,0.1)',
      marginHorizontal: 10,
  },
  payButton: {
      height: 56,
      borderRadius: 16,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 12,
      shadowColor: Colors.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 5,
  },
  payButtonText: {
      color: Colors.background,
      fontSize: 14,
      fontWeight: '900',
      letterSpacing: 1.5,
  },

  // MILESTONE
  milestoneCard: {
      backgroundColor: 'rgba(255,255,255,0.05)', // bg-white/5
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.05)',
      borderRadius: 20,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
  },
  milestoneIconBg: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: 'rgba(13, 242, 89, 0.1)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
  },
  milestoneLabel: {
      color: Colors.textSecondary,
      fontSize: 9,
      fontWeight: 'bold',
      letterSpacing: 1.5,
  },
  milestoneValue: {
      color: '#FFF',
      fontSize: 13,
      fontWeight: 'bold',
  },
  progressBarBase: {
      width: 96,
      height: 6,
      backgroundColor: 'rgba(255,255,255,0.05)',
      borderRadius: 3,
      overflow: 'hidden',
  },
  progressBarFill: {
      height: '100%',
      backgroundColor: Colors.primary,
      borderRadius: 3,
  },

  // TONTINES
  sectionHeader: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FFF',
      letterSpacing: -0.5,
  },
  countBadge: {
      backgroundColor: 'rgba(255,255,255,0.05)',
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 20,
  },
  countText: {
      color: Colors.textSecondary,
      fontSize: 10,
      fontWeight: 'bold',
  },
  tontineCard: {
      width: width * 0.75,
      backgroundColor: Colors.card, // card-dark
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.05)',
      borderRadius: 24,
      padding: 20,
      marginRight: 16,
  },
  tontineIconBox: {
      width: 48,
      height: 48,
      borderRadius: 12,
      borderWidth: 1,
      justifyContent: 'center',
      alignItems: 'center',
  },
  percentageText: {
      fontSize: 12,
      fontWeight: '900',
  },
  tontineTitle: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 4,
  },
  tontineSubtitle: {
      color: Colors.textSecondary,
      fontSize: 10,
      fontWeight: '500',
  },
  miniProgressBase: {
      height: 8,
      width: '100%',
      backgroundColor: 'rgba(255,255,255,0.05)',
      borderRadius: 4,
      overflow: 'hidden',
      marginBottom: 12,
  },
  miniProgressFill: {
      height: '100%',
      borderRadius: 4,
  },
  viewDetailsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
  },
  viewDetailsText: {
      color: 'rgba(255,255,255,0.5)',
      fontSize: 10,
      fontWeight: 'bold',
      letterSpacing: 1.5,
  }

});
