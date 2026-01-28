import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Data for grid items
// Data for grid items
const GOALS = [
    { id: 'standard', icon: 'payments', i18nKey: 'standard', color: Colors.primary, isSelected: true },
    { id: 'home', icon: 'home-work', i18nKey: 'home', color: '#64748b' },
    { id: 'business', icon: 'storefront', i18nKey: 'business', color: '#64748b' },
    { id: 'education', icon: 'school', i18nKey: 'education', color: '#64748b' },
    { id: 'vehicle', icon: 'directions-car', i18nKey: 'vehicle', color: '#64748b' },
    { id: 'emergency', icon: 'medical-services', i18nKey: 'emergency', color: '#64748b' },
    { id: 'custom', icon: 'add-box', i18nKey: 'custom', color: '#64748b' },
];

export default function CreateTontineScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [selectedId, setSelectedId] = useState('standard');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={styles.container}>
        {/* BACKGROUND PATTERN MOCK */}
        {/* In a real app we might use an SVG or Image background. 
            For now, just solid dark background matching input #102216 */}
            
        {/* HEADER */}
        <SafeAreaView edges={['top']} style={styles.header}>
            <View style={styles.headerContent}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                    <MaterialIcons name="close" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('createTontine.title')}</Text>
                <TouchableOpacity style={styles.iconBtn}>
                    <MaterialIcons name="help-outline" size={24} color="#FFF" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>

        {/* PROGRESS BAR */}
        <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
                <Text style={styles.stepIndicator}>{t('createTontine.step1')}</Text>
                <Text style={styles.stepTitle}>{t('createTontine.step1Title')}</Text>
            </View>
            <View style={styles.progressTrack}>
                <View style={[styles.progressSegment, styles.progressActive]} />
                <View style={styles.progressSegment} />
                <View style={styles.progressSegment} />
                <View style={styles.progressSegment} />
            </View>
        </View>

        <View style={styles.fixedContent}>
            {/* HERRO TEXT */}
            <View style={styles.heroSection}>
                <Text style={styles.heroTitle}>{t('createTontine.heroTitle')}</Text>
                <Text style={styles.heroSubtitle}>{t('createTontine.heroSubtitle')}</Text>
            </View>

            {/* SEARCH */}
            <View style={styles.searchContainer}>
                <MaterialIcons name="search" size={24} color="#64748b" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder={t('createTontine.searchPlaceholder')}
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

            {/* GRID */}
            <View style={styles.grid}>
                {GOALS.map((goal) => {
                    const isSelected = selectedId === goal.id;
                    const fgColor = isSelected ? Colors.background : (goal.color === Colors.primary ? Colors.primary : '#FFF');
                    const bgColor = isSelected ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)';
                    const borderColor = isSelected ? Colors.primary : 'rgba(255,255,255,0.1)';
                    
                    return (
                        <TouchableOpacity
                            key={goal.id}
                            style={[styles.card, { backgroundColor: bgColor, borderColor: borderColor }]}
                            onPress={() => {
                                setSelectedId(goal.id);
                                if (goal.id === 'custom') {
                                    router.push('/tontine/custom-goal');
                                }
                            }}
                            activeOpacity={0.8}
                        >
                            <View style={[
                                styles.cardIconBox, 
                                { backgroundColor: isSelected ? Colors.primary : 'rgba(255,255,255,0.1)' }
                            ]}>
                                <MaterialIcons 
                                    name={goal.icon as any} 
                                    size={28} 
                                    color={isSelected ? '#102216' : '#94a3b8'} 
                                />
                            </View>
                            <Text style={styles.cardTitle}>{t(`createTontine.goals.${goal.i18nKey}.title`)}</Text>
                            <Text style={[styles.cardSubtitle, { color: isSelected ? Colors.primary : '#64748b' }]}>
                                {t(`createTontine.goals.${goal.i18nKey}.subtitle`).toUpperCase()}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </ScrollView>

        {/* FOOTER */}
        <View style={styles.footer}>
             <View style={styles.offlineNotice}>
                <View style={styles.offlineIconBg}>
                    <MaterialIcons name="offline-bolt" size={16} color={Colors.primary} />
                </View>
                <Text style={styles.offlineText}>
                   {/* We might need Trans component for bold text, simplified for now */}
                   {t('common.offlineNotice').replace('<bold>', '').replace('</bold>', '')} 
                </Text>
             </View>
             
             <TouchableOpacity style={styles.continueBtn} activeOpacity={0.9}>
                 <Text style={styles.continueText}>{t('common.continue')}</Text>
                 <MaterialIcons name="arrow-forward" size={22} color={Colors.background} style={{ fontWeight: '900' }} />
             </TouchableOpacity>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#102216', // Deep Dark Green from HTML
  },
  header: {
      backgroundColor: 'rgba(16, 34, 22, 0.95)',
  },
  headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
  },
  iconBtn: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
  },
  headerTitle: {
      color: '#FFF',
      fontSize: 18,
      fontWeight: 'bold',
  },
  
  progressSection: {
      paddingHorizontal: 24,
      paddingBottom: 20,
      gap: 8,
  },
  progressHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  },
  stepIndicator: {
      color: Colors.primary,
      fontSize: 12,
      fontWeight: '900',
      letterSpacing: 1,
  },
  stepTitle: {
      color: '#9cbaa6',
      fontSize: 12,
      fontWeight: 'bold',
  },
  progressTrack: {
      flexDirection: 'row',
      height: 6,
      gap: 6,
  },
  progressSegment: {
      flex: 1,
      borderRadius: 3,
      backgroundColor: 'rgba(255,255,255,0.1)',
  },
  progressActive: {
      backgroundColor: Colors.primary,
      shadowColor: Colors.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 8,
      elevation: 5,
  },

  scrollContent: {
      paddingHorizontal: 24,
  scrollContent: {
      paddingHorizontal: 24,
      paddingTop: 0,
      paddingBottom: 40,
  },
  },
  heroSection: {
      marginBottom: 24,
  },
  heroTitle: {
      color: '#FFF',
      fontSize: 32,
      fontWeight: '900',
      fontStyle: 'italic',
      lineHeight: 36,
      letterSpacing: -1,
      marginBottom: 8,
  },
  heroSubtitle: {
      color: '#9cbaa6', // slate-500/greenish
      fontSize: 16,
      lineHeight: 24,
  },

  searchContainer: {
      marginBottom: 24,
      position: 'relative',
      justifyContent: 'center',
  },
  searchIcon: {
      position: 'absolute',
      left: 16,
      zIndex: 1,
  },
  searchInput: {
      backgroundColor: 'rgba(255,255,255,0.05)',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.1)',
      borderRadius: 16,
      paddingVertical: 14,
      paddingLeft: 48,
      paddingRight: 16,
      color: '#FFF',
      fontSize: 16,
  },

  fixedContent: {
      paddingHorizontal: 24,
      paddingBottom: 20,
  },

  grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16,
  },
  card: {
      width: (width - 48 - 16) / 2, // (Screen - Padding - Gap) / 2
      padding: 20,
      borderRadius: 24,
      borderWidth: 1, // Standard border
  },
  cardIconBox: {
      width: 48,
      height: 48,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
  },
  cardTitle: {
      color: '#FFF',
      fontSize: 17,
      fontWeight: 'bold',
      marginBottom: 4,
      lineHeight: 22,
  },
  cardSubtitle: {
      fontSize: 10,
      fontWeight: '900',
      letterSpacing: 0.5,
  },

  footer: {
      padding: 24,
      backgroundColor: 'rgba(16, 34, 22, 0.95)',
      borderTopWidth: 1,
      borderTopColor: 'rgba(255,255,255,0.05)',
  },
  offlineNotice: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 20,
      paddingHorizontal: 4,
  },
  offlineIconBg: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: 'rgba(13, 242, 89, 0.1)',
      justifyContent: 'center',
      alignItems: 'center',
  },
  offlineText: {
      flex: 1,
      color: '#9cbaa6',
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '500',
  },
  continueBtn: {
      backgroundColor: Colors.primary,
      height: 56,
      borderRadius: 28,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
      shadowColor: Colors.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 6,
  },
  continueText: {
      color: '#102216',
      fontSize: 16,
      fontWeight: '900',
      letterSpacing: 0.5,
  },
});
