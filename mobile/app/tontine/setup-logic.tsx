import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import FixedStrategyConfig from '@/components/tontine/FixedStrategyConfig';

export default function SetupLogicScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const [contributionType, setContributionType] = useState('fixed');

  return (
    <View style={styles.container}>

      <ScrollView contentContainerStyle={styles.scrollContent}>
         {/* CONTRIBUTION TYPE */}
         <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{t('createTontine.contributionType.title')}</Text>
                <Text style={styles.sectionSubtitle}>{t('createTontine.contributionType.subtitle')}</Text>
            </View>
            <View style={styles.typeGrid}>
                {['fixed', 'variable', 'cumulative'].map((type) => {
                   const isSelected = contributionType === type;
                   return (
                       <TouchableOpacity 
                         key={type} 
                         style={[styles.typeCard, isSelected && styles.typeCardSelected]}
                         onPress={() => setContributionType(type)}
                       >
                           <Text style={[styles.typeText, isSelected && styles.typeTextSelected]}>
                               {t(`createTontine.contributionType.${type}`)}
                           </Text>
                       </TouchableOpacity>
                   )
                })}
            </View>
         </View>

         {/* STRATEGY CONFIG */}
         {contributionType === 'fixed' && <FixedStrategyConfig />}

         {/* Placeholder for other types */}
         {contributionType !== 'fixed' && (
             <View style={{ padding: 20, alignItems: 'center' }}>
                 <Text style={{ color: '#64748b' }}>Logic for {contributionType} coming soon...</Text>
             </View>
         )}
         
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
         <TouchableOpacity style={styles.continueBtn} activeOpacity={0.9} onPress={() => {/* Next Step */}}>
            <Text style={styles.continueText}>{t('common.nextStep')}</Text>
            <MaterialIcons name="arrow-forward" size={22} color={Colors.background} style={{ fontWeight: '900' }} />
         </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#102216',
  },
  scrollContent: {
      padding: 16,
      paddingBottom: 100, // Space for footer
      gap: 32,
  },
  section: {
      gap: 16,
  },
  sectionHeader: {
      marginBottom: 4,
  },
  sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#FFF',
  },
  sectionSubtitle: {
      fontSize: 14,
      color: '#9cbaa6',
  },
  typeGrid: {
      flexDirection: 'row',
      backgroundColor: '#3a5543', // Slightly lighter than bg
      borderRadius: 16,
      padding: 6,
      gap: 4,
  },
  typeCard: {
      flex: 1,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 12,
  },
  typeCardSelected: {
      backgroundColor: Colors.primary,
  },
  typeText: {
      color: '#9cbaa6',
      fontWeight: 'bold',
      fontSize: 14,
  },
  typeTextSelected: {
      color: '#102216',
  },
  footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(16, 34, 22, 0.95)',
      padding: 24,
      paddingBottom: 40,
      borderTopWidth: 1,
      borderTopColor: 'rgba(255,255,255,0.05)',
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
